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
const BILLING_CONFIGURED = Boolean(
  PAYMENT_PROVIDER
  && PAYMENT_WEBHOOK_SECRET
  && PAYMENT_CHECKOUT_URL
  && PAYMENT_PRO_PRICE_ID
  && Number.isSafeInteger(PAYMENT_PRO_AMOUNT)
  && PAYMENT_PRO_AMOUNT > 0
  && PAYMENT_CURRENCY,
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
  const [timestamp, signature] = signatureHeader.split(".", 2);
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload.toString("utf8")}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(signature, "utf8");
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
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

export function parsePaymentEvent(
  body: unknown,
  provider: string,
): VerifiedPaymentEvent {
  if (!body || typeof body !== "object") throw new Error("Webhook body must be an object");
  const input = body as Record<string, unknown>;
  const id = asNonEmptyString(input.id) || asNonEmptyString(input.event_id);
  const type = asNonEmptyString(input.type);
  const data = input.data && typeof input.data === "object"
    ? input.data as Record<string, unknown>
    : input;
  const subscription = data.subscription && typeof data.subscription === "object"
    ? data.subscription as Record<string, unknown>
    : data;
  const metadata = data.metadata && typeof data.metadata === "object"
    ? data.metadata as Record<string, unknown>
    : subscription.metadata && typeof subscription.metadata === "object"
      ? subscription.metadata as Record<string, unknown>
      : {};
  const subscriptionId = asNonEmptyString(
    data.subscription_id
      ?? subscription.id
      ?? data.subscriptionId,
  );
  const providerStatus = asNonEmptyString(
    data.status
      ?? subscription.status
      ?? (type === "checkout.completed" || type === "subscription.active" ? "active" : undefined)
      ?? (type === "subscription.cancelled" || type === "subscription.deleted" ? "canceled" : undefined)
      ?? (type === "payment.failed" ? "failed" : undefined),
  )?.toLowerCase();
  const status = type === "subscription.cancelled" || type === "subscription.deleted"
    ? "canceled"
    : type === "payment.failed"
      ? "failed"
      : providerStatus;
  const checkoutIntentId = asNonEmptyString(
    metadata.checkoutIntentId
      ?? metadata.checkout_intent_id
      ?? data.client_reference_id
      ?? data.checkout_intent_id,
  );
  const planId = asNonEmptyString(
    data.price_id
      ?? data.priceId
      ?? subscription.price_id
      ?? metadata.planId,
  );
  const periodEndValue = data.current_period_end ?? subscription.current_period_end;
  const periodEnd = typeof periodEndValue === "number" && Number.isFinite(periodEndValue)
    ? new Date(periodEndValue > 10_000_000_000 ? periodEndValue : periodEndValue * 1000)
    : undefined;
  const amount = asPositiveInteger(data.amount_total ?? data.amount ?? subscription.amount);
  const currency = asNonEmptyString(data.currency ?? subscription.currency)?.toUpperCase();
  const paymentStatus = asNonEmptyString(
    data.payment_status
      ?? data.paymentStatus
      ?? subscription.payment_status,
  )?.toLowerCase();
  const eventCreatedAt = asDate(input.created_at ?? input.createdAt ?? input.created);

  if (!id || !type || !EVENT_TYPES.has(type as PaymentEventType)) {
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
    if (!["paid", "succeeded"].includes(paymentStatus || "")) {
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

router.get("/billing/config", (_req, res) => {
  res.json({
    configured: BILLING_CONFIGURED,
    provider: PAYMENT_PROVIDER || null,
    checkoutAvailable: Boolean(PAYMENT_CHECKOUT_URL),
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
    const checkoutUrl = new URL(PAYMENT_CHECKOUT_URL);
    const intent = createPaymentCheckoutIntent(session.userId, {
      provider: PAYMENT_PROVIDER,
      planId: PAYMENT_PRO_PRICE_ID,
      amount: PAYMENT_PRO_AMOUNT,
      currency: PAYMENT_CURRENCY,
    });
    checkoutUrl.searchParams.set("client_reference_id", intent.id);
    checkoutUrl.searchParams.set("plan", PAYMENT_PRO_PRICE_ID);
    res.json({ checkoutUrl: checkoutUrl.toString() });
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
    if (!verifyPaymentSignature(payload, req.headers["x-payment-signature"] as string | undefined)) {
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