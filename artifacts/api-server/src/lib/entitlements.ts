import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import {
  db,
  paymentCheckoutIntents,
  paymentEvents,
  paymentSubscriptions,
  users,
} from "../db";

export type UserPlan = "free" | "pro";

export async function getUserPlan(userId: number): Promise<UserPlan> {
  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.plan === "pro" ? "pro" : "free";
}

export async function userHasProAccess(userId: number): Promise<boolean> {
  return (await getUserPlan(userId)) === "pro";
}

export const ACTIVE_PAYMENT_STATUSES = new Set(["active", "trialing"]);
export const REVOKED_PAYMENT_STATUSES = new Set([
  "canceled",
  "cancelled",
  "unpaid",
  "past_due",
  "incomplete",
  "incomplete_expired",
  "payment_failed",
  "failed",
]);

export type PaymentEventType =
  | "checkout.completed"
  | "subscription.active"
  | "subscription.updated"
  | "subscription.cancelled"
  | "subscription.deleted"
  | "payment.failed";

export interface VerifiedPaymentEvent {
  id: string;
  type: PaymentEventType;
  provider: string;
  subscriptionId: string;
  status: string;
  checkoutIntentId?: string;
  planId?: string;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
  eventCreatedAt: Date;
  currentPeriodEnd?: Date;
}

export interface EntitlementUpdateResult {
  duplicate: boolean;
  userId: number | null;
  plan: UserPlan | null;
  status: string;
  ignoredOutOfOrder?: boolean;
}

export function planForPaymentStatus(status: string): UserPlan | null {
  const normalized = status.trim().toLowerCase();
  if (ACTIVE_PAYMENT_STATUSES.has(normalized)) return "pro";
  if (REVOKED_PAYMENT_STATUSES.has(normalized)) return "free";
  return null;
}

export interface CheckoutIntentConfig {
  provider: string;
  planId: string;
  amount: number;
  currency: string;
}

export function createPaymentCheckoutIntent(
  userId: number,
  config: CheckoutIntentConfig,
): { id: string; expiresAt: Date } {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
  const id = randomUUID();
  db.insert(paymentCheckoutIntents).values({
    id,
    userId,
    provider: config.provider,
    planId: config.planId,
    amount: config.amount,
    currency: config.currency.toUpperCase(),
    expiresAt,
    createdAt: now,
  }).run();
  return { id, expiresAt };
}

/**
 * Applies a provider-verified event in one database transaction. The event id
 * is persisted before the entitlement update, making webhook retries safe.
 */
export function applyVerifiedPaymentEvent(event: VerifiedPaymentEvent): EntitlementUpdateResult {
  return db.transaction((tx) => {
    const existing = tx.select({ id: paymentEvents.id })
      .from(paymentEvents)
      .where(eq(paymentEvents.id, event.id))
      .limit(1)
      .get();
    if (existing) {
      const subscription = tx.select({
        userId: paymentSubscriptions.userId,
        status: paymentSubscriptions.status,
      })
        .from(paymentSubscriptions)
        .where(and(
          eq(paymentSubscriptions.provider, event.provider),
          eq(paymentSubscriptions.providerSubscriptionId, event.subscriptionId),
        ))
        .limit(1)
        .get();
      return {
        duplicate: true,
        userId: subscription?.userId ?? null,
        plan: subscription ? planForPaymentStatus(subscription.status) : null,
        status: subscription?.status ?? event.status,
      };
    }

    const plan = planForPaymentStatus(event.status);
    if (!plan) {
      throw new Error(`Unsupported payment status: ${event.status}`);
    }

    const now = new Date();
    const subscription = tx.select({
      id: paymentSubscriptions.id,
      userId: paymentSubscriptions.userId,
      status: paymentSubscriptions.status,
      lastEventAt: paymentSubscriptions.lastEventAt,
    })
      .from(paymentSubscriptions)
      .where(and(
        eq(paymentSubscriptions.provider, event.provider),
        eq(paymentSubscriptions.providerSubscriptionId, event.subscriptionId),
      ))
      .limit(1)
      .get();
    let userId = subscription?.userId;
    let checkoutIntent: typeof paymentCheckoutIntents.$inferSelect | undefined;
    if (event.checkoutIntentId) {
      checkoutIntent = tx.select()
        .from(paymentCheckoutIntents)
        .where(eq(paymentCheckoutIntents.id, event.checkoutIntentId))
        .limit(1)
        .get();
      if (!checkoutIntent) throw new Error("Payment event references an unknown checkout intent");
      if (checkoutIntent.provider !== event.provider) throw new Error("Checkout intent provider mismatch");
      if (userId && checkoutIntent.userId !== userId) throw new Error("Subscription owner cannot be changed");
    }
    if (!subscription) {
      if (!checkoutIntent) throw new Error("New subscription requires a server checkout intent");
      if (checkoutIntent.consumedAt) throw new Error("Checkout intent was already consumed");
      if (checkoutIntent.expiresAt.getTime() < now.getTime()) throw new Error("Checkout intent has expired");
      if (plan !== "pro") throw new Error("Unknown subscriptions cannot revoke access");
      if (
        event.planId !== checkoutIntent.planId
        || event.amount !== checkoutIntent.amount
        || event.currency?.toUpperCase() !== checkoutIntent.currency
      ) {
        throw new Error("Paid plan details do not match the checkout intent");
      }
      if (!["paid", "succeeded"].includes(event.paymentStatus || "")) {
        throw new Error("Payment has not been confirmed as paid");
      }
      userId = checkoutIntent.userId;
      tx.update(paymentCheckoutIntents)
        .set({ consumedAt: now })
        .where(eq(paymentCheckoutIntents.id, checkoutIntent.id))
        .run();
    }
    if (!userId) throw new Error("Payment event does not identify an existing user");

    if (subscription && event.eventCreatedAt.getTime() <= subscription.lastEventAt.getTime()) {
      tx.insert(paymentEvents).values({
        id: event.id,
        provider: event.provider,
        type: event.type,
        subscriptionId: event.subscriptionId,
        userId,
        payload: JSON.stringify(event),
        eventCreatedAt: event.eventCreatedAt,
        receivedAt: now,
        processedAt: now,
      }).run();
      const user = tx.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).limit(1).get();
      return {
        duplicate: false,
        userId,
        plan: user?.plan === "pro" ? "pro" : "free",
        status: subscription.status,
        ignoredOutOfOrder: true,
      };
    }

    const subscriptionValues = {
      userId,
      provider: event.provider,
      providerSubscriptionId: event.subscriptionId,
      plan: "pro",
      status: event.status.trim().toLowerCase(),
      lastEventAt: event.eventCreatedAt,
      currentPeriodEnd: event.currentPeriodEnd ?? null,
      cancelledAt: plan === "free" ? now : null,
      updatedAt: now,
    };
    if (subscription) {
      tx.update(paymentSubscriptions)
        .set(subscriptionValues)
        .where(eq(paymentSubscriptions.id, subscription.id))
        .run();
    } else {
      tx.insert(paymentSubscriptions).values({
        ...subscriptionValues,
        createdAt: now,
      }).run();
    }

    const subscriptions = tx.select({ status: paymentSubscriptions.status })
      .from(paymentSubscriptions)
      .where(eq(paymentSubscriptions.userId, userId))
      .all();
    const derivedPlan: UserPlan = subscriptions.some(({ status }) => ACTIVE_PAYMENT_STATUSES.has(status))
      ? "pro"
      : "free";
    tx.update(users)
      .set({ plan: derivedPlan })
      .where(eq(users.id, userId))
      .run();
    tx.insert(paymentEvents).values({
      id: event.id,
      provider: event.provider,
      type: event.type,
      subscriptionId: event.subscriptionId,
      userId,
      payload: JSON.stringify(event),
      eventCreatedAt: event.eventCreatedAt,
      receivedAt: now,
      processedAt: now,
    }).run();

    return { duplicate: false, userId, plan: derivedPlan, status: event.status.trim().toLowerCase() };
  });
}
