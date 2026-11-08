import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

process.env.API_SERVER_DB_PATH = path.join(os.tmpdir(), `tender-run-guard-${randomUUID()}.db`);
process.env.NODE_ENV = "production";

const { default: app } = await import("../app");
const { claimTenderRequest } = await import("../lib/tender-run-guard");
const { transitionExecutionRecord } = await import("../lib/execution-history");
const { db, aiExecutionHistory } = await import("../db");
const { eq } = await import("drizzle-orm");

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

async function registerUser() {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Tender Guard Test",
      email: `tender-guard-${randomUUID()}@example.test`,
      password: "test-password-123",
    }),
  });
  assert.equal(response.status, 200);
  const cookie = /auth-token=([^;]+)/.exec(response.headers.get("set-cookie") ?? "")?.[1];
  assert.ok(cookie);
  const body = await response.json() as { user: { id: number } };
  return { userId: body.user.id, cookie: `auth-token=${cookie}` };
}

test("concurrent tabs receive 409 without another execution; terminal state releases durable admission", async () => {
  const user = await registerUser();
  const otherUser = await registerUser();
  const post = (cookie: string) => fetch(`${baseUrl}/api/tender-intelligence/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ requestId: randomUUID(), projectName: "Proyek",
      documents: [{ documentType: "NPWP", required: true, present: true, notes: "" }] }),
  });
  const claimed = claimTenderRequest({ userId: user.userId, requestId: randomUUID(), workspaceId: null,
    inputHash: "offline-hash", retryOfId: null, inputSummary: { label: "Offline active run" } });
  assert.equal(claimed.kind, "claimed");
  if (claimed.kind !== "claimed") throw new Error("Expected claim");
  try {
    const responses = await Promise.all([post(user.cookie), post(user.cookie)]);
    for (const response of responses) {
      assert.equal(response.status, 409);
      const body = await response.json() as { code: string; action: string; executionId?: string };
      assert.equal(body.code, "ANALYSIS_IN_PROGRESS");
      assert.match(body.action, /tab lain/);
      assert.equal(body.executionId, undefined);
    }
    const invalid = await fetch(`${baseUrl}/api/tender-intelligence/analyze`, {
      method: "POST", headers: { "Content-Type": "application/json", Cookie: otherUser.cookie },
      body: JSON.stringify({ projectName: "" }),
    });
    assert.equal(invalid.status, 400);
    const executions = await db.select().from(aiExecutionHistory).where(eq(aiExecutionHistory.userId, user.userId));
    assert.equal(executions.length, 1);
  } finally {
    await transitionExecutionRecord(claimed.execution.id, "running", { status: "failed" });
  }
  const next = claimTenderRequest({ userId: user.userId, requestId: randomUUID(), workspaceId: null,
    inputHash: "next-hash", retryOfId: null, inputSummary: { label: "Next offline run" } });
  assert.equal(next.kind, "claimed", "terminal state releases durable admission");
});
