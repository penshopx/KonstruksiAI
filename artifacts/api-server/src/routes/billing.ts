import { createHmac, timingSafeEqual } from "node:crypto";
import express, { Router, type Request } from "express";
import { getSessionFromRequest, requireAuth } from "../lib/auth";
import {
  applyVerifiedPaymentEvent,
  createPaymentCheckoutIntent,
  type PaymentEventType,
  type VerifiedPaymentEvent,
} from "../lib/entitlements";

const router = Router();
const PAYMENT_PROVIDER = (process.env.PAYMENT_PROVIDER || "").trim().toLowerCase();
const PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "";
const PAYMENT_CHECKOUT_URL = process.env.PAYMENT_CHECKOUT_URL || "";
const PAYMENT_PRO_PRICE_ID = process.env.PAYMENT_PRO_PRICE_ID || "";
const PAYMENT_PRO_AMOUNT = Number(process.env.PAYMENT_PRO_AMOUNT || "");
const PAYMENT_CURRENCY = (process.env.PAYMENT_CURRENCY || "IDR").trim().toUpperCase();
const PAYMENT_PROVIDER_VERIFIED = process.env.PAYMENT_PROVIDER_VERIFIED === "true";
const SUPPORTED_PAYMENT_PROVIDERS = new Set(["stripe"]);
const checkoutUrlIsValid = (() => {
  try {
    const url = new URL(PAYMENT_CHECKOUT_URL);
    return url.protocol === "https:"
      && (url.hostname === "checkout.stripe.com" || url.hostname === "buy.stripe.com");
  } catch {
    return false;
  }
})();
export const BILLING_CONFIGURED = Boolean(
  SUPPORTED_PAYMENT_PROVIDERS.has(PAYMENT_PROVIDER)
  && PAYMENT_PROVIDER_VERIFIED
  && /^whsec_[A-Za-z0-9_]+$/.test(PAYMENT_WEBHOOK_SECRET)
  && checkoutUrlIsValid
  && PAYMENT_PRO_PRICE_ID
  && Number.isSafeInteger(PAYMENT_PRO_AMOUNT)
  && PAYMENT_PRO_AMOUNT > 0
  && /^[A-Z]{3}$/.test(PAYMENT_CURRENCY),
);

const EVENT_TYPES = new Set<PaymentEventType>([
  "checkout.completed",
  "subscription.active",
  "subscription.updated",
  "subscription.cancelled",
  "subscription.deleted",
  "payment.failed",
]);

function rawBody(req: Request): Buffer | null {
  return Buffer.isBuffer(req.body) ? req.body : null;
}

export function verifyPaymentSignature(
  payload: Buffer,
  signatureHeader: string | undefined,
  secret = PAYMENT_WEBHOOK_SECRET,
): boolean {
  if (!secret || !signatureHeader) return false;
  let timestamp: string | undefined;
  let signatures: string[] = [];
  if (signatureHeader.includes("=")) {
    const parts = signatureHeader.split(",").map((part) => part.trim().split("=", 2));
    timestamp = parts.find(([key]) => key === "t")?.[1];
    signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  } else {
    const [customTimestamp, signature] = signatureHeader.split(".", 2);
    timestamp = customTimestamp;
    signatures = signature ? [signature] : [];
  }
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return false;
  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload.toString("utf8")}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return signatures.some((signature) => {
    const actualBuffer = Buffer.from(signature, "utf8");
    return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
  });
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asPositiveInteger(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
  }
  return undefined;
}

function asDate(value: unknown): Date | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = new Date(value > 10_000_000_000 ? value : value * 1000);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return asDate(numeric);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function nestedValue(value: unknown, ...path: Array<string | number>): unknown {
  let current: unknown = value;
  for (const key of path) {
    current = Array.isArray(current)
      ? current[Number(key)]
      : asRecord(current)?.[String(key)];
  }
  return current;
}

function firstValue(...values: unknown[]): unknown {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizePaymentEventType(
  provider: string,
  rawType: string | undefined,
  data: Record<string, unknown>,
): PaymentEventType | undefined {
  if (!rawType) return undefined;
  if (EVENT_TYPES.has(rawType as PaymentEventType)) return rawType as PaymentEventType;

  const type = rawType.toLowerCase();
  if (provider === "stripe") {
    if (type === "checkout.session.completed") return "checkout.completed";
    if (type === "customer.subscription.created") return "subscription.active";
    if (type === "customer.subscription.updated") {
      const status = asNonEmptyString(data.status)?.toLowerCase();
      return status === "canceled" || status === "cancelled"
        ? "subscription.cancelled"
        : "subscription.updated";
    }
    if (type === "customer.subscription.deleted") return "subscription.deleted";
    if (type === "invoice.payment_failed") return "payment.failed";
    if (type === "invoice.paid") return "subscription.active";
  }

  return undefined;
}

export function parsePaymentEvent(
  body: unknown,
  provider: string,
): VerifiedPaymentEvent {
  if (!body || typeof body !== "object") throw new Error("Webhook body must be an object");
  const input = body as Record<string, unknown>;
  const id = asNonEmptyString(input.id) || asNonEmptyString(input.event_id);
  const rawType = asNonEmptyString(input.type);
  const eventData = asRecord(input.data);
  const data = asRecord(eventData?.object) || eventData || input;
  const subscription = asRecord(data.subscription) || data;
  const metadata = asRecord(data.metadata) || asRecord(subscription.metadata) || {};
  const type = normalizePaymentEventType(provider.trim().toLowerCase(), rawType, data);
  const subscriptionId = asNonEmptyString(
    firstValue(
      data.subscription_id,
      data.subscriptionId,
      typeof data.subscription === "string" ? data.subscription : undefined,
      nestedValue(data.subscription, "id"),
      type?.startsWith("subscription.") ? data.id : undefined,
      metadata.subscription_id,
      metadata.subscriptionId,
    ),
  );
  const statusValue = firstValue(
    data.status,
    subscription.status,
    type === "checkout.completed" || type === "subscription.active" ? "active" : undefined,
    type === "subscription.cancelled" || type === "subscription.deleted" ? "canceled" : undefined,
    type === "payment.failed" ? "failed" : undefined,
  );
  const providerStatus = asNonEmptyString(
    statusValue,
  )?.toLowerCase();
  const status = type === "subscription.cancelled" || type === "subscription.deleted"
    ? "canceled"
    : type === "payment.failed"
      ? "failed"
      : type === "checkout.completed" || type === "subscription.active"
        ? (planForStatusIsPro(providerStatus || "") ? providerStatus : "active")
        : providerStatus;
  const checkoutIntentId = asNonEmptyString(
    firstValue(
      metadata.checkoutIntentId,
      metadata.checkout_intent_id,
      data.client_reference_id,
      data.clientReferenceId,
      data.checkout_intent_id,
      data.checkoutIntentId,
    ),
  );
  const planId = asNonEmptyString(
    firstValue(
      data.price_id,
      data.priceId,
      data.plan_id,
      data.planId,
      nestedValue(data.price, "id"),
      nestedValue(data.plan, "id"),
      nestedValue(subscription.price, "id"),
      nestedValue(subscription.plan, "id"),
      nestedValue(data.items, "data", 0, "price", "id"),
      nestedValue(data.line_items, "data", 0, "price", "id"),
      metadata.planId,
      metadata.plan_id,
      metadata.price_id,
    ),
  );
  const firstItem = (value: unknown): Record<string, unknown> | undefined => {
    const records = asRecord(value)?.data;
    return Array.isArray(records) ? asRecord(records[0]) : undefined;
  };
  const dataItem = firstItem(data.items) || firstItem(data.line_items);
  const itemPrice = asRecord(dataItem?.price);
  const subscriptionItem = firstItem(subscription.items);
  const subscriptionPrice = asRecord(subscriptionItem?.price);
  const periodEnd = asDate(firstValue(
    data.current_period_end,
    subscription.current_period_end,
    data.currentPeriodEnd,
    subscription.currentPeriodEnd,
  ));
  const amount = asPositiveInteger(firstValue(
    data.amount_total,
    data.amount_paid,
    data.amount,
    data.amount_due,
    subscription.amount,
    nestedValue(data.price, "unit_amount"),
    nestedValue(data.plan, "amount"),
    itemPrice?.unit_amount,
    subscriptionPrice?.unit_amount,
  ));
  const currency = asNonEmptyString(firstValue(
    data.currency,
    subscription.currency,
    nestedValue(data.price, "currency"),
    nestedValue(data.plan, "currency"),
    itemPrice?.currency,
    subscriptionPrice?.currency,
  ))?.toUpperCase();
  const stripeInvoiceIsPaid = provider.trim().toLowerCase() === "stripe"
    && rawType?.toLowerCase() === "invoice.paid"
    && (data.paid === true || providerStatus === "paid");
  const paymentStatus = asNonEmptyString(
    firstValue(
      data.payment_status,
      data.paymentStatus,
      data.payment_state,
      subscription.payment_status,
      stripeInvoiceIsPaid ? "paid" : undefined,
      type === "payment.failed" ? "failed" : undefined,
      planForStatusIsPro(providerStatus || "") ? "paid" : undefined,
    ),
  )?.toLowerCase();
  const eventCreatedAt = asDate(firstValue(
    input.created_at,
    input.createdAt,
    input.created,
    eventData?.created_at,
    eventData?.createdAt,
    data.created_at,
    data.createdAt,
  ));

  if (!id || !type) {
    throw new Error("Webhook event id or type is invalid");
  }
  if (!subscriptionId) throw new Error("Webhook event is missing subscription_id");
  if (!status) throw new Error("Webhook event is missing status");
  if (!eventCreatedAt) throw new Error("Webhook event is missing a valid creation timestamp");
  if (planForStatusIsPro(status)) {
    if (planId !== PAYMENT_PRO_PRICE_ID) throw new Error("Webhook event is for a different plan");
    if (amount !== PAYMENT_PRO_AMOUNT || currency !== PAYMENT_CURRENCY) {
      throw new Error("Webhook payment amount or currency is invalid");
    }
    if (!["paid", "succeeded", "successful"].includes(paymentStatus || "")) {
      throw new Error("Webhook payment is not confirmed as paid");
    }
  }

  return {
    id,
    type: type as PaymentEventType,
    provider,
    subscriptionId,
    status,
    checkoutIntentId,
    planId,
    amount,
    currency,
    paymentStatus,
    eventCreatedAt,
    currentPeriodEnd: periodEnd && !Number.isNaN(periodEnd.getTime()) ? periodEnd : undefined,
  };
}

function planForStatusIsPro(status: string): boolean {
  return status === "active" || status === "trialing";
}

export function createCheckoutUrlForUser(userId: number): string {
  const checkoutUrl = new URL(PAYMENT_CHECKOUT_URL);
  const intent = createPaymentCheckoutIntent(userId, {
    provider: PAYMENT_PROVIDER,
    planId: PAYMENT_PRO_PRICE_ID,
    amount: PAYMENT_PRO_AMOUNT,
    currency: PAYMENT_CURRENCY,
  });
  checkoutUrl.searchParams.set("client_reference_id", intent.id);
  checkoutUrl.searchParams.set("plan", PAYMENT_PRO_PRICE_ID);
  return checkoutUrl.toString();
}

router.get("/billing/config", (_req, res) => {
  res.json({
    configured: BILLING_CONFIGURED,
    provider: PAYMENT_PROVIDER || null,
    checkoutAvailable: BILLING_CONFIGURED,
  });
});

router.post("/billing/checkout", requireAuth, async (req, res) => {
  if (!BILLING_CONFIGURED) {
    res.status(503).json({ error: "Pembayaran Pro belum dikonfigurasi" });
    return;
  }
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Silakan masuk terlebih dahulu" });
    return;
  }
  try {
    res.json({ checkoutUrl: createCheckoutUrlForUser(session.userId) });
  } catch {
    req.log.error("Invalid payment checkout URL configuration");
    res.status(500).json({ error: "Konfigurasi checkout tidak valid" });
  }
});

router.post(
  "/billing/webhook",
  express.raw({ type: "application/json", limit: "256kb" }),
  (req, res) => {
    const payload = rawBody(req);
    if (!payload || !BILLING_CONFIGURED) {
      res.status(503).json({ error: "Webhook pembayaran belum dikonfigurasi" });
      return;
    }
    const signatureHeader = PAYMENT_PROVIDER === "stripe"
      ? req.headers["stripe-signature"]
      : undefined;
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!verifyPaymentSignature(payload, signature)) {
      res.status(401).json({ error: "Signature pembayaran tidak valid" });
      return;
    }
    try {
      const event = parsePaymentEvent(JSON.parse(payload.toString("utf8")), PAYMENT_PROVIDER);
      const result = applyVerifiedPaymentEvent(event);
      req.log.info(
        { eventId: event.id, eventType: event.type, userId: result.userId, duplicate: result.duplicate },
        "Payment webhook processed",
      );
      res.json({ received: true, duplicate: result.duplicate });
    } catch (error) {
      req.log.warn({ err: error }, "Payment webhook rejected");
      res.status(400).json({ error: error instanceof Error ? error.message : "Webhook pembayaran tidak valid" });
    }
  },
);

export default router;