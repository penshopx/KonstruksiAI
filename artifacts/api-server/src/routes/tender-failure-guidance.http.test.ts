import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import OpenAI from "openai";
import type { TenderAnalysisPayload } from "../lib/tender-history";

// Only synthetic credentials, isolated storage, and a stubbed SDK are used.
// No application code test switch or network-capable provider fallback.
process.env.NODE_ENV = "production";
process.env.API_SERVER_DB_PATH = path.join(os.tmpdir(), `tender-failures-${randomUUID()}.db`);
delete process.env.OPENROUTER_API_KEY;

const privateDetail = "PROVIDER_PRIVATE_DETAIL sk-synthetic-do-not-expose";
let providerCalls = 0;
let providerFailure: unknown;
let modelContent: string | null = null;
let transientStatuses: number[] = [];
let observeAttempt: (() => Promise<void>) | undefined;

function syntheticProviderFailure(status: number, code?: string) {
  return {
    status,
    code,
    message: privateDetail,
    error: { message: privateDetail },
    headers: { authorization: `Bearer ${privateDetail}` },
  };
}

test("Tender endpoint failures and retry recovery stay safe without provider details", async t => {
  let unexpectedTransportCalls = 0;
  t.mock.method(OpenAI.prototype, "request", () => {
    unexpectedTransportCalls++;
    throw new Error("Unexpected SDK transport request in offline test");
  });
  t.mock.method(OpenAI.Chat.Completions.prototype, "create", () => {
    providerCalls++;
    return {
      withResponse: async () => {
        await observeAttempt?.();
        const transientStatus = transientStatuses[providerCalls - 1];
        if (transientStatus) throw syntheticProviderFailure(transientStatus);
        if (providerFailure) throw providerFailure;
        return {
          data: { choices: [{ message: { content: modelContent } }] },
          response: { status: 200 },
          request_id: `req_${privateDetail}`,
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
        providerFailure = scenario.providerStatus
          ? syntheticProviderFailure(scenario.providerStatus, scenario.providerCode)
          : undefined;
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
    for (const statuses of [[503], [429], [503, 429], [429, 503]]) {
      await t.test(`${statuses.join(" then ")} then success on attempt ${statuses.length + 1}`, async () => {
        providerCalls = 0;
        providerFailure = undefined;
        transientStatuses = statuses;
        const documents = [
          { documentType: "SBU", present: true, required: true, notes: "Berlaku sampai 2028" },
          { documentType: "SMK3", present: false, required: true, notes: "Dalam proses" },
          { documentType: "Brosur", present: false, required: false, notes: "Opsional" },
        ];
        const checklistState = { "admin-1": { checked: true, notes: "Akta tersedia" } };
        const summary = {
          administrativeRequirements: "Lengkapi SMK3.",
          technicalRequirements: "SBU sesuai.",
          financialRequirements: "Periksa jaminan.",
          keyRisks: "SMK3 belum tersedia.",
          nextSteps: "Siapkan dokumen wajib.",
        };
        modelContent = JSON.stringify({
          // Reordered assessments and optimistic missing-document scores must
          // still reconcile to the user's input after a provider retry.
          completenessChecks: [
            { documentType: "Brosur", completenessScore: 90, missingElements: [], notes: "" },
            { documentType: "SMK3", completenessScore: 98, missingElements: [], notes: "" },
            { documentType: "SBU", completenessScore: 94, missingElements: [], notes: "Masih berlaku." },
          ],
          risks: [],
          recommendations: ["Lengkapi SMK3 sebelum pengajuan."],
          complianceScore: 98,
          summary,
        });
        const previousExecutions = await db.select().from(aiExecutionHistory);
        const previousIds = new Set(previousExecutions.map(row => row.id));
        const previousResults = await db.select().from(tenderAnalysisResults);
        const observations: {
          id: string; status: string; errorMessage: string | null;
          resultRef: string | null; completedAt: Date | null;
          executionCount: number; resultCount: number;
        }[] = [];
        observeAttempt = async () => {
          const executions = await db.select().from(aiExecutionHistory);
          const current = executions.filter(row => !previousIds.has(row.id));
          assert.equal(current.length, 1, "Provider retries must share one execution");
          observations.push({
            ...current[0]!,
            executionCount: executions.length,
            resultCount: (await db.select().from(tenderAnalysisResults)).length,
          });
        };
        const response = await fetch(`${base}/api/tender-intelligence/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Cookie: `auth-token=${token}` },
          body: JSON.stringify({
            requestId: randomUUID(),
            projectName: "Proyek Uji Pemulihan",
            documents,
            checklistState,
          }),
        });
        observeAttempt = undefined;
        assert.equal(response.status, 200);
        const body = await response.json() as TenderAnalysisPayload & {
          status: string; executionId: string; resultRef: string;
          result: TenderAnalysisPayload & { id: string; executionId: string };
        };
        assert.deepEqual(Object.keys(body).sort(), [
          "completenessChecks", "complianceScore", "executionId", "overallCompleteness",
          "recommendations", "result", "resultRef", "risks", "status", "summary",
        ]);
        assert.equal(body.status, "succeeded");
        assert.equal(providerCalls, statuses.length + 1, "Stop retrying immediately after success");
        assert.equal(observations.length, providerCalls);
        for (const observation of observations) {
          assert.equal(observation.id, body.executionId);
          assert.equal(observation.status, "running", "Transient failures must not fail the execution");
          assert.equal(observation.errorMessage, null);
          assert.equal(observation.resultRef, null);
          assert.equal(observation.completedAt, null);
          assert.equal(observation.executionCount, previousExecutions.length + 1);
          assert.equal(observation.resultCount, previousResults.length, "No result before model success");
        }
        assert.doesNotMatch(JSON.stringify(body),
          /PROVIDER_PRIVATE_DETAIL|sk-synthetic|Bearer|authorization|OPENROUTER_API_KEY|request_id|providerRequestId|AI_PROVIDER_|"error"|"action"|"retryable"/);
        assert.equal(body.resultRef, `tender:${body.result.id}`);
        assert.equal(body.result.id, body.executionId);
        assert.equal(body.result.executionId, body.executionId);
        assert.deepEqual(body.result.documents, documents);
        assert.deepEqual(body.result.checklistState, checklistState);
        const expectedChecks = [
          { ...documents[0], completenessScore: 94, missingElements: [], notes: "Masih berlaku." },
          {
            ...documents[1], completenessScore: 0,
            missingElements: ["Dokumen SMK3 belum tersedia; siapkan dokumen ini sebelum pengajuan tender."],
            notes: "Dokumen belum dilengkapi.",
          },
          {
            ...documents[2], completenessScore: 0,
            missingElements: ["Dokumen Brosur belum tersedia; siapkan dokumen ini sebelum pengajuan tender."],
            notes: "Dokumen belum dilengkapi.",
          },
        ];
        assert.deepEqual(body.completenessChecks, expectedChecks);
        assert.deepEqual(body.result.completenessChecks, expectedChecks);
        assert.equal(body.overallCompleteness, 31);
        assert.equal(body.complianceScore, 50);
        assert.equal(body.result.overallCompleteness, body.overallCompleteness);
        assert.equal(body.result.complianceScore, body.complianceScore);
        assert.deepEqual(body.summary, summary);
        assert.deepEqual(body.result.summary, summary);
        assert.deepEqual(body.recommendations, ["Lengkapi SMK3 sebelum pengajuan."]);
        assert.deepEqual(body.result.recommendations, body.recommendations);
        assert.deepEqual(body.risks, []);
        assert.deepEqual(body.result.risks, body.risks);
        const executions = await db.select().from(aiExecutionHistory);
        assert.equal(executions.length, previousExecutions.length + 1);
        const execution = executions.find(row => row.id === body.executionId);
        assert.ok(execution);
        assert.equal(execution.status, "succeeded");
        assert.equal(execution.errorMessage, null, "No stale failure after a successful retry");
        assert.equal(execution.resultRef, body.resultRef);
        assert.ok(execution.completedAt);
        assert.ok(execution.completedAt.getTime() >= execution.startedAt.getTime());
        const results = await db.select().from(tenderAnalysisResults);
        assert.equal(results.length, previousResults.length + 1, "Only one result may be persisted");
        const saved = results.filter(row => row.executionId === body.executionId);
        assert.equal(saved.length, 1);
        assert.equal(saved[0]!.id, body.result.id);
        assert.deepEqual(JSON.parse(saved[0]!.documents), documents);
        assert.deepEqual(JSON.parse(saved[0]!.checklistState), checklistState);
        assert.deepEqual(JSON.parse(saved[0]!.completenessChecks), expectedChecks);
        assert.equal(saved[0]!.overallCompleteness, 31);
        assert.equal(saved[0]!.complianceScore, 50);
      });
    }
    assert.equal(unexpectedTransportCalls, 0, "All provider traffic must stop at the SDK stub");
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
