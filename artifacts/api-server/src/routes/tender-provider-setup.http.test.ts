import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import OpenAI from "openai";
import { MemoryStore } from "express-rate-limit";

process.env.NODE_ENV = "production";
process.env.API_SERVER_DB_PATH = path.join(os.tmpdir(), `tender-setup-${randomUUID()}.db`);
delete process.env.OPENROUTER_API_KEY;

test("Provider setup is admin-only, bounded, safe and does not run an analysis", async t => {
  const stores: MemoryStore[] = [];
  const init = MemoryStore.prototype.init;
  t.mock.method(MemoryStore.prototype, "init", function (this: MemoryStore, ...args: Parameters<typeof init>) {
    stores.push(this);
    return init.apply(this, args);
  });
  const privateDetail = "PRIVATE_PROVIDER_DETAIL sk-synthetic-never-show";
  let calls = 0;
  let failure: unknown;
  let content: string | null = '{"ok":true}';
  t.mock.method(OpenAI.prototype, "request", () => { throw new Error("Unexpected network access"); });
  t.mock.method(OpenAI.Chat.Completions.prototype, "create", async (
    input: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    options: { timeout: number; maxRetries: number },
  ) => {
    calls++;
    assert.equal(input.model, "openai/gpt-4o-mini");
    assert.equal(input.max_tokens, 16);
    assert.equal(options.timeout, 15_000);
    assert.equal(options.maxRetries, 0);
    assert.equal(input.messages.length, 1);
    assert.doesNotMatch(JSON.stringify(input), /PRIVATE_PROJECT/);
    if (failure) throw failure;
    return { choices: [{ message: { content } }] };
  });
  const { default: app } = await import("../app");
  const { db, users, aiExecutionHistory, tenderAnalysisResults, tenderProviderAudit } = await import("../db");
  const { initializeDatabase } = await import("../db/migrate");
  const { eq } = await import("drizzle-orm");
  const { signToken } = await import("../lib/auth");
  const [account] = await db.insert(users).values({
    name: "Setup test", email: `${randomUUID()}@example.test`, password: "unused", role: "user",
  }).returning();
  // Deliberately stale admin claim: current DB role must win.
  const token = await signToken({ userId: account.id, email: account.email, name: account.name, role: "admin" });
  const server = app.listen(0);
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/tender-intelligence/provider-setup`;
  const request = (method = "POST", authenticated = true, suffix = "") => fetch(url + suffix, {
    method,
    headers: {
      ...(authenticated ? { Cookie: `auth-token=${token}` } : {}),
      "Content-Type": "application/json",
    },
    ...(method === "POST" ? { body: JSON.stringify({
      model: "attacker-model", documents: ["PRIVATE_PROJECT"], accountId: 999999,
      checkedAt: "2000-01-01T00:00:00.000Z", code: privateDetail,
    }) } : {}),
  });
  try {
    assert.equal((await request("POST", false)).status, 401);
    assert.equal((await request("GET", false)).status, 401);
    assert.equal((await request("GET", false, "/history")).status, 401);
    assert.equal((await request()).status, 403);
    assert.equal((await request("GET", true, "/history")).status, 403);
    assert.deepEqual(await (await request("GET")).json(), { canCheck: false });
    assert.equal(calls, 0);
    assert.equal(db.select().from(tenderProviderAudit).all().length, 0);
    await db.update(users).set({ role: "admin" }).where(eq(users.id, account.id));
    assert.deepEqual(await (await request("GET")).json(), { canCheck: true });
    assert.deepEqual(await (await request("GET", true, "/history")).json(), { items: [] });

    const scenarios = [
      { code: "AI_PROVIDER_NOT_CONFIGURED", configured: false },
      { code: "AI_PROVIDER_AUTHENTICATION_FAILED", status: 401 },
      { code: "AI_PROVIDER_AUTHENTICATION_FAILED", status: 403 },
      { code: "AI_PROVIDER_CREDITS_EXHAUSTED", status: 402 },
      { code: "AI_PROVIDER_CREDITS_EXHAUSTED", status: 429, providerCode: "insufficient_quota" },
      { code: "AI_PROVIDER_RATE_LIMITED", status: 429 },
      { code: "AI_PROVIDER_UNAVAILABLE", status: 503 },
      { code: "AI_PROVIDER_UNAVAILABLE", providerCode: "ETIMEDOUT" },
      { code: "AI_PROVIDER_REQUEST_REJECTED", status: 400 },
      { code: "AI_INVALID_MODEL_RESPONSE", empty: true },
      { code: "AI_INTERNAL_ERROR", status: 418 },
      { code: "AI_PROVIDER_READY" },
    ];
    for (const scenario of scenarios) {
      await t.test(scenario.code, async () => {
        for (const store of stores) store.resetAll();
        if (scenario.configured === false) delete process.env.OPENROUTER_API_KEY;
        else process.env.OPENROUTER_API_KEY = "sk-synthetic-offline";
        failure = scenario.status || scenario.providerCode
          ? { status: scenario.status, code: scenario.providerCode, message: privateDetail }
          : undefined;
        content = scenario.empty ? null : '{"ok":true}';
        const before = calls;
        const response = await request();
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("cache-control"), "no-store");
        const result = await response.json() as {
          code: string; ready: boolean; checkedAt: string;
          message: string; action: string; retryable: boolean;
        };
        assert.equal(result.code, scenario.code);
        assert.equal(result.ready, scenario.code === "AI_PROVIDER_READY");
        assert.ok(!Number.isNaN(Date.parse(result.checkedAt)));
        assert.deepEqual(Object.keys(result).sort(), ["action", "checkedAt", "code", "message", "ready", "retryable"]);
        assert.doesNotMatch(JSON.stringify(result), /PRIVATE_PROVIDER|sk-synthetic|OPENROUTER|PRIVATE_PROJECT/);
        assert.equal(calls - before, scenario.configured === false ? 0 : 1, "Probe must not retry");
        const audit = await (await request("GET", true, "/history")).json() as {
          items: Array<{ id: number; accountId: number; checkedAt: string; code: string }>;
        };
        assert.equal(audit.items[0].accountId, account.id, "Use authenticated internal ID, not request body");
        assert.equal(audit.items[0].checkedAt, result.checkedAt);
        assert.equal(audit.items[0].code, scenario.code);
        assert.deepEqual(Object.keys(audit.items[0]).sort(), ["accountId", "checkedAt", "code", "id"]);
        assert.doesNotMatch(JSON.stringify(audit), /PRIVATE_PROVIDER|sk-synthetic|OPENROUTER|PRIVATE_PROJECT|example.test/);
      });
    }
    for (const store of stores) store.resetAll();
    for (let i = 0; i < 3; i++) assert.equal((await request()).status, 200);
    const beforeLimit = calls;
    assert.equal((await request()).status, 429);
    assert.equal(calls, beforeLimit);
    const limitHistoryResponse = await request("GET", true, "/history");
    assert.equal(limitHistoryResponse.status, 200, "Audit reads must not spend probe quota");
    assert.equal(limitHistoryResponse.headers.get("cache-control"), "no-store");
    const limitHistory = await limitHistoryResponse.json() as { items: Array<{ code: string }> };
    assert.equal(limitHistory.items[0].code, "AI_SETUP_RATE_LIMITED");
    assert.equal(db.select().from(tenderProviderAudit).all().length, scenarios.length + 4);
    assert.doesNotMatch(JSON.stringify(db.select().from(tenderProviderAudit).all()),
      /PRIVATE_PROVIDER|sk-synthetic|OPENROUTER|PRIVATE_PROJECT|example.test/);

    // The bounded view includes checks by other admins and survives DB init.
    const [otherAdmin] = db.insert(users).values({
      name: "Other admin", email: `${randomUUID()}@example.test`, password: "unused", role: "admin",
    }).returning().all();
    for (let i = 0; i < 55; i++) {
      db.insert(tenderProviderAudit).values({
        accountId: otherAdmin.id, checkedAt: new Date().toISOString(), code: "AI_PROVIDER_READY",
      }).run();
    }
    initializeDatabase();
    const bounded = await (await request("GET", true, "/history")).json() as {
      items: Array<{ id: number; accountId: number }>;
    };
    assert.equal(bounded.items.length, 50);
    assert.ok(bounded.items.every(row => row.accountId === otherAdmin.id));
    assert.ok(bounded.items.every((row, i) => i === 0 || row.id < bounded.items[i - 1].id));
    await db.delete(users).where(eq(users.id, otherAdmin.id));
    assert.deepEqual(await (await request("GET", true, "/history")).json(), bounded,
      "Removing an account must not erase audit actor IDs");
    assert.equal((await db.select().from(aiExecutionHistory)).length, 0);
    assert.equal((await db.select().from(tenderAnalysisResults)).length, 0);
    await db.update(users).set({ role: "user" }).where(eq(users.id, account.id));
    assert.equal((await request()).status, 403, "Role revocation must take effect immediately");
    assert.equal((await request("GET", true, "/history")).status, 403);
    assert.deepEqual(await (await request("GET")).json(), { canCheck: false });
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
