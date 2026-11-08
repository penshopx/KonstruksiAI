import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import OpenAI from "openai";

// Only synthetic credentials, isolated storage, and a stubbed SDK are used.
// No application code test switch or network-capable provider fallback.
process.env.NODE_ENV = "production";
process.env.API_SERVER_DB_PATH = path.join(os.tmpdir(), `tender-failures-${randomUUID()}.db`);
delete process.env.OPENROUTER_API_KEY;

const privateDetail = "PROVIDER_PRIVATE_DETAIL sk-synthetic-do-not-expose";
let providerCalls = 0;
let providerFailure: unknown;
let modelContent: string | null = null;

test("Tender endpoint failures provide safe, actionable guidance without provider details", async t => {
  let unexpectedTransportCalls = 0;
  t.mock.method(OpenAI.prototype, "request", () => {
    unexpectedTransportCalls++;
    throw new Error("Unexpected SDK transport request in offline test");
  });
  t.mock.method(OpenAI.Chat.Completions.prototype, "create", () => {
    providerCalls++;
    return {
      withResponse: async () => {
        if (providerFailure) throw providerFailure;
        return {
          data: { choices: [{ message: { content: modelContent } }] },
          response: { status: 200 },
          request_id: "req_synthetic",
        };
      },
    };
  });
  const { default: app } = await import("../app");
  const { db, aiExecutionHistory, tenderAnalysisResults } = await import("../db");
  const { eq } = await import("drizzle-orm");
  const server = app.listen(0);
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const registration = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Tender Failure Regression",
        email: `tender-failure-${randomUUID()}@example.test`,
        password: "synthetic-password-123",
      }),
    });
    assert.equal(registration.status, 200);
    const token = /auth-token=([^;]+)/.exec(registration.headers.get("set-cookie") ?? "")?.[1];
    assert.ok(token);
    const cases = [
      { name: "missing credentials", status: 503, code: "AI_PROVIDER_NOT_CONFIGURED", retryable: false, attempts: 0, action: /administrator/ },
      { name: "invalid credentials", providerStatus: 401, status: 502, code: "AI_PROVIDER_AUTHENTICATION_FAILED", retryable: false, attempts: 1, action: /kredensial/ },
      { name: "provider access denied", providerStatus: 403, status: 502, code: "AI_PROVIDER_AUTHENTICATION_FAILED", retryable: false, attempts: 1, action: /akses provider/ },
      { name: "billing exhausted", providerStatus: 402, status: 402, code: "AI_PROVIDER_CREDITS_EXHAUSTED", retryable: false, attempts: 1, action: /billing/ },
      { name: "quota exhaustion is not a transient 429", providerStatus: 429, providerCode: "insufficient_quota", status: 402, code: "AI_PROVIDER_CREDITS_EXHAUSTED", retryable: false, attempts: 1, action: /billing/ },
      { name: "temporary outage", providerStatus: 503, status: 503, code: "AI_PROVIDER_UNAVAILABLE", retryable: true, attempts: 3, action: /Tunggu/ },
      { name: "temporary rate limit", providerStatus: 429, status: 429, code: "AI_PROVIDER_RATE_LIMITED", retryable: true, attempts: 3, action: /Tunggu/ },
      { name: "empty model content", content: null, status: 502, code: "AI_INVALID_MODEL_RESPONSE", retryable: true, attempts: 1, action: /tim teknis/ },
      { name: "malformed model JSON", content: privateDetail, status: 502, code: "AI_INVALID_MODEL_RESPONSE", retryable: true, attempts: 1, action: /tim teknis/ },
      { name: "invalid model schema", content: JSON.stringify({ privateDetail }), status: 502, code: "AI_INVALID_MODEL_RESPONSE", retryable: true, attempts: 1, action: /tim teknis/ },
    ];
    for (const scenario of cases) {
      await t.test(scenario.name, async () => {
        providerCalls = 0;
        modelContent = scenario.content ?? null;
        providerFailure = scenario.providerStatus ? {
          status: scenario.providerStatus,
          code: scenario.providerCode,
          message: privateDetail,
          error: { message: privateDetail },
          headers: { authorization: `Bearer ${privateDetail}` },
        } : undefined;
        const response = await fetch(`${base}/api/tender-intelligence/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Cookie: `auth-token=${token}` },
          body: JSON.stringify({
            projectName: "Proyek Uji Kegagalan",
            documents: [{ documentType: "SBU", present: true, required: true, notes: "" }],
          }),
        });
        assert.equal(response.status, scenario.status);
        const body = await response.json() as {
          code: string; error: string; action: string; retryable: boolean; executionId: string;
        };
        assert.deepEqual(Object.keys(body).sort(), ["action", "code", "error", "executionId", "retryable"]);
        assert.equal(body.code, scenario.code);
        assert.equal(body.retryable, scenario.retryable);
        assert.ok(typeof body.error === "string" && body.error.length > 10);
        assert.match(body.action, scenario.action);
        assert.equal(typeof body.executionId, "string");
        assert.ok(body.executionId.length > 0);
        assert.doesNotMatch(JSON.stringify(body), /PROVIDER_PRIVATE_DETAIL|sk-synthetic|Bearer|authorization|OPENROUTER_API_KEY|insufficient_quota/);
        assert.equal(providerCalls, scenario.attempts, "Only transient failures should retry automatically");
        const [execution] = await db.select().from(aiExecutionHistory).where(eq(aiExecutionHistory.id, body.executionId));
        assert.equal(execution?.status, "failed");
        assert.doesNotMatch(execution.errorMessage ?? "", /PROVIDER_PRIVATE_DETAIL|sk-synthetic/);
        const results = await db.select().from(tenderAnalysisResults);
        assert.equal(results.length, 0, "A failed request must not persist a successful result");
      });
      // The first request must test absence before the lazy client is initialized.
      process.env.OPENROUTER_API_KEY = "sk-synthetic-offline-test-only";
    }
    assert.equal(unexpectedTransportCalls, 0, "All provider traffic must stop at the SDK stub");
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
