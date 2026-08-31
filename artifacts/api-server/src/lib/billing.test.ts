import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const databasePath = path.join(os.tmpdir(), `konstruksi-billing-${process.pid}.db`);
process.env.API_SERVER_DB_PATH = databasePath;
process.env.SESSION_SECRET = "billing-test-session-secret";
process.env.PAYMENT_PROVIDER = "test-provider";
process.env.PAYMENT_WEBHOOK_SECRET = "billing-test-webhook-secret";
process.env.PAYMENT_PRO_PRICE_ID = "price_pro_test";
process.env.PAYMENT_PRO_AMOUNT = "299000";
process.env.PAYMENT_CURRENCY = "IDR";
process.env.PAYMENT_CHECKOUT_URL = "https://checkout.example.test/pro?client_reference_id=attacker&plan=wrong";

const { initializeDatabase } = await import("../db/migrate");
const { db, paymentCheckoutIntents, users } = await import("../db");
const {
  applyVerifiedPaymentEvent,
  createPaymentCheckoutIntent,
} = await import("./entitlements");
const {
  BILLING_CONFIGURED,
  createCheckoutUrlForUser,
  parsePaymentEvent,
  verifyPaymentSignature,
} = await import("../routes/billing");

initializeDatabase();

test("verifies a fresh HMAC and rejects tampered or stale signatures", () => {
  const payload = Buffer.from('{"id":"evt_1"}');
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", process.env.PAYMENT_WEBHOOK_SECRET!)
    .update(`${timestamp}.${payload.toString("utf8")}`)
    .digest("hex");

  assert.equal(verifyPaymentSignature(payload, `${timestamp}.${signature}`), true);
  assert.equal(verifyPaymentSignature(payload, `t=${timestamp},v1=${signature}`), true);
  assert.equal(verifyPaymentSignature(Buffer.from('{"id":"evt_2"}'), `${timestamp}.${signature}`), false);
  assert.equal(verifyPaymentSignature(payload, `${timestamp - 601}.${signature}`), false);
});

test("keeps checkout disabled until a real provider sandbox is explicitly verified", () => {
  assert.equal(BILLING_CONFIGURED, false);
});

test("checkout replaces untrusted references with a server-owned intent", () => {
  const [user] = db.insert(users).values({
    name: "Checkout Owner",
    email: `checkout-owner-${process.pid}@example.test`,
    password: "not-a-real-password",
  }).returning().all();
  assert.ok(user);

  const checkoutUrl = new URL(createCheckoutUrlForUser(user.id));
  const intentId = checkoutUrl.searchParams.get("client_reference_id");
  assert.ok(intentId);
  assert.notEqual(intentId, "attacker");
  assert.equal(checkoutUrl.searchParams.get("plan"), "price_pro_test");

  const intent = db.select().from(paymentCheckoutIntents).all().find(({ id }) => id === intentId);
  assert.ok(intent);
  assert.equal(intent.userId, user.id);
});

test("maps provider events to the Pro user and makes retries idempotent", () => {
  const [user] = db.insert(users).values({
    name: "Billing Test",
    email: `billing-${process.pid}@example.test`,
    password: "not-a-real-password",
  }).returning().all();
  assert.ok(user);
  const intent = createPaymentCheckoutIntent(user.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });

  const active = applyVerifiedPaymentEvent({
    id: "evt_subscription_active",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_test_1",
    status: "active",
    checkoutIntentId: intent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T01:00:00.000Z"),
  });
  assert.deepEqual(
    { duplicate: active.duplicate, plan: active.plan, userId: active.userId },
    { duplicate: false, plan: "pro", userId: user.id },
  );

  const retry = applyVerifiedPaymentEvent({
    id: "evt_subscription_active",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_test_1",
    status: "active",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T01:00:00.000Z"),
  });
  assert.equal(retry.duplicate, true);
  assert.equal(retry.plan, "pro");
});

test("cancellation and failed payment revoke Pro access", () => {
  const [user] = db.insert(users).values({
    name: "Revocation Test",
    email: `revocation-${process.pid}@example.test`,
    password: "not-a-real-password",
  }).returning().all();
  assert.ok(user);
  const intent = createPaymentCheckoutIntent(user.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });

  applyVerifiedPaymentEvent({
    id: "evt_active_2",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_test_2",
    status: "active",
    checkoutIntentId: intent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T02:00:00.000Z"),
  });
  const revoked = applyVerifiedPaymentEvent({
    id: "evt_cancelled_2",
    type: "subscription.cancelled",
    provider: "test-provider",
    subscriptionId: "sub_test_2",
    status: "canceled",
    eventCreatedAt: new Date("2026-08-31T03:00:00.000Z"),
  });
  assert.equal(revoked.plan, "free");

  const failedIntent = createPaymentCheckoutIntent(user.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  applyVerifiedPaymentEvent({
    id: "evt_active_failed_subscription",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_test_failed",
    status: "active",
    checkoutIntentId: failedIntent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T03:01:00.000Z"),
  });
  const failed = applyVerifiedPaymentEvent({
    id: "evt_payment_failed",
    type: "payment.failed",
    provider: "test-provider",
    subscriptionId: "sub_test_failed",
    status: "failed",
    eventCreatedAt: new Date("2026-08-31T03:02:00.000Z"),
  });
  assert.equal(failed.plan, "free");
});

test("requires the configured Pro price, amount and paid status", () => {
  assert.throws(() => parsePaymentEvent({
    id: "evt_wrong_price",
    type: "checkout.completed",
    created_at: "2026-08-31T04:00:00.000Z",
    subscription_id: "sub_test_3",
    status: "active",
    payment_status: "paid",
    amount_total: 299000,
    currency: "IDR",
    price_id: "price_other",
  }, "test-provider"), /different plan/);
});

test("normalizes a Stripe checkout event into the billing contract", () => {
  const event = parsePaymentEvent({
    id: "evt_stripe_checkout",
    type: "checkout.session.completed",
    created: 1788134400,
    data: {
      object: {
        id: "cs_test_1",
        client_reference_id: "intent_stripe_1",
        subscription: "sub_stripe_1",
        payment_status: "paid",
        amount_total: 299000,
        currency: "idr",
        metadata: { planId: "price_pro_test" },
      },
    },
  }, "stripe");

  assert.deepEqual(
    {
      id: event.id,
      type: event.type,
      subscriptionId: event.subscriptionId,
      checkoutIntentId: event.checkoutIntentId,
      planId: event.planId,
      amount: event.amount,
      currency: event.currency,
      status: event.status,
      paymentStatus: event.paymentStatus,
    },
    {
      id: "evt_stripe_checkout",
      type: "checkout.completed",
      subscriptionId: "sub_stripe_1",
      checkoutIntentId: "intent_stripe_1",
      planId: "price_pro_test",
      amount: 299000,
      currency: "IDR",
      status: "active",
      paymentStatus: "paid",
    },
  );
});

test("normalizes Stripe invoice payment status separately from entitlement status", () => {
  const [user] = db.insert(users).values({
    name: "Stripe Renewal",
    email: `stripe-renewal-${process.pid}@example.test`,
    password: "not-a-real-password",
  }).returning().all();
  assert.ok(user);
  const intent = createPaymentCheckoutIntent(user.id, {
    provider: "stripe",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  applyVerifiedPaymentEvent({
    id: "evt_stripe_initial_subscription",
    type: "subscription.active",
    provider: "stripe",
    subscriptionId: "sub_stripe_invoice",
    status: "active",
    checkoutIntentId: intent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T08:00:00.000Z"),
  });

  const event = parsePaymentEvent({
    id: "evt_stripe_invoice_paid",
    type: "invoice.paid",
    created: Date.parse("2026-08-31T09:00:00.000Z") / 1000,
    data: {
      object: {
        id: "in_stripe_1",
        subscription: "sub_stripe_invoice",
        status: "paid",
        paid: true,
        amount_paid: 299000,
        currency: "idr",
        metadata: {
          plan_id: "price_pro_test",
        },
      },
    },
  }, "stripe");

  assert.deepEqual(
    {
      type: event.type,
      subscriptionId: event.subscriptionId,
      status: event.status,
      paymentStatus: event.paymentStatus,
    },
    {
      type: "subscription.active",
      subscriptionId: "sub_stripe_invoice",
      status: "active",
      paymentStatus: "paid",
    },
  );
  const renewed = applyVerifiedPaymentEvent(event);
  assert.equal(renewed.plan, "pro");
  assert.equal(renewed.status, "active");

  assert.throws(() => parsePaymentEvent({
    id: "evt_stripe_invoice_open",
    type: "invoice.paid",
    created: Date.parse("2026-08-31T10:00:00.000Z") / 1000,
    data: {
      object: {
        id: "in_stripe_open",
        subscription: "sub_stripe_invoice",
        status: "open",
        paid: false,
        amount_paid: 299000,
        currency: "idr",
        metadata: { plan_id: "price_pro_test" },
      },
    },
  }, "stripe"), /not confirmed as paid/);
});

test("ignores delayed events and keeps Pro while another subscription is active", () => {
  const [user] = db.insert(users).values({
    name: "Ordering Test",
    email: `ordering-${process.pid}@example.test`,
    password: "not-a-real-password",
  }).returning().all();
  assert.ok(user);

  const activate = (subscriptionId: string, intentId: string, eventCreatedAt: Date) =>
    applyVerifiedPaymentEvent({
      id: `evt_${subscriptionId}_active`,
      type: "subscription.active",
      provider: "test-provider",
      subscriptionId,
      status: "active",
      checkoutIntentId: intentId,
      planId: "price_pro_test",
      amount: 299000,
      currency: "IDR",
      paymentStatus: "paid",
      eventCreatedAt,
    });
  const firstIntent = createPaymentCheckoutIntent(user.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  const secondIntent = createPaymentCheckoutIntent(user.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  activate("sub_multi_1", firstIntent.id, new Date("2026-08-31T05:00:00.000Z"));
  activate("sub_multi_2", secondIntent.id, new Date("2026-08-31T05:01:00.000Z"));

  const cancelled = applyVerifiedPaymentEvent({
    id: "evt_sub_multi_1_cancelled",
    type: "subscription.cancelled",
    provider: "test-provider",
    subscriptionId: "sub_multi_1",
    status: "canceled",
    eventCreatedAt: new Date("2026-08-31T06:00:00.000Z"),
  });
  assert.equal(cancelled.plan, "pro");

  const delayed = applyVerifiedPaymentEvent({
    id: "evt_sub_multi_1_delayed_active",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_multi_1",
    status: "active",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T05:30:00.000Z"),
  });
  assert.equal(delayed.ignoredOutOfOrder, true);
  assert.equal(delayed.status, "canceled");
  assert.equal(delayed.plan, "pro");
});

test("never transfers an existing subscription to another checkout owner", () => {
  const [firstUser, secondUser] = db.insert(users).values([
    {
      name: "First Owner",
      email: `first-owner-${process.pid}@example.test`,
      password: "not-a-real-password",
    },
    {
      name: "Second Owner",
      email: `second-owner-${process.pid}@example.test`,
      password: "not-a-real-password",
    },
  ]).returning().all();
  assert.ok(firstUser);
  assert.ok(secondUser);
  const firstIntent = createPaymentCheckoutIntent(firstUser.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  const secondIntent = createPaymentCheckoutIntent(secondUser.id, {
    provider: "test-provider",
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
  });
  applyVerifiedPaymentEvent({
    id: "evt_owner_active",
    type: "subscription.active",
    provider: "test-provider",
    subscriptionId: "sub_owner_locked",
    status: "active",
    checkoutIntentId: firstIntent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T07:00:00.000Z"),
  });

  assert.throws(() => applyVerifiedPaymentEvent({
    id: "evt_owner_transfer_attempt",
    type: "subscription.updated",
    provider: "test-provider",
    subscriptionId: "sub_owner_locked",
    status: "active",
    checkoutIntentId: secondIntent.id,
    planId: "price_pro_test",
    amount: 299000,
    currency: "IDR",
    paymentStatus: "paid",
    eventCreatedAt: new Date("2026-08-31T08:00:00.000Z"),
  }), /owner cannot be changed/);
});