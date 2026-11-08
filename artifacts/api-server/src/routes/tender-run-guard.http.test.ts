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
const { db, aiExecutionHistory, projectWorkspaceMembers, projectWorkspaces } = await import("../db");
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

test("second device discovers only authorized active runs and reads terminal state without dispatch", async () => {
  const owner = await registerUser();
  const member = await registerUser();
  const outsider = await registerUser();
  const originalFetch = globalThis.fetch;
  let providerCalls = 0;
  globalThis.fetch = ((input, init) => {
    const url = String(input);
    if (!url.startsWith(`${baseUrl}/`)) {
      providerCalls++;
      throw new Error("Offline test blocks all external transport");
    }
    return originalFetch(input, init);
  }) as typeof fetch;
  const get = (cookie: string, suffix = "/active", scope = "") =>
    fetch(`${baseUrl}/api/tender-intelligence/requests${suffix}${scope}`, { headers: { Cookie: cookie } });
  const seed = (userId: number, workspaceId: string | null) => {
    const result = claimTenderRequest({ userId, workspaceId, requestId: randomUUID(),
      inputHash: "offline", retryOfId: null, inputSummary: { label: "Cross device" } });
    assert.equal(result.kind, "claimed");
    if (result.kind !== "claimed") throw new Error("Expected claim");
    return result.execution.id;
  };
  try {
    assert.equal((await get("")).status, 401);
    const created = await fetch(`${baseUrl}/api/project-workspaces`, {
      method: "POST", headers: { Cookie: owner.cookie, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Recovery workspace", stageId: "tender", notes: "" }),
    });
    assert.equal(created.status, 201);
    const { workspace } = await created.json() as { workspace: { id: string } };
    const scope = `?workspaceId=${workspace.id}`;
    db.insert(projectWorkspaceMembers).values({
      id: randomUUID(), workspaceId: workspace.id, userId: member.userId, role: "editor",
    }).run();
    const executionId = seed(member.userId, workspace.id);
    const personalId = seed(outsider.userId, null);
    const response = await get(member.cookie, "/active", scope);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { activeRequest: { executionId } });
    assert.deepEqual(await (await get(member.cookie)).json(), { activeRequest: null }, "scope cannot leak to personal");
    assert.deepEqual(await (await get(owner.cookie, "/active", scope)).json(), { activeRequest: null },
      "workspace owner cannot discover another account's run");
    assert.equal((await get(outsider.cookie, "/active", scope)).status, 403);
    assert.equal((await get(member.cookie, `/executions/${personalId}`)).status, 404);
    assert.equal((await get(member.cookie, `/executions/${executionId}`)).status, 404);
    assert.equal((await get(owner.cookie, `/executions/${executionId}`, scope)).status, 404);
    assert.equal((await get(member.cookie, `/executions/${executionId}`, scope)).status, 202);
    assert.equal((await get(member.cookie, "/active", "?workspaceId=a&workspaceId=b")).status, 400);
    await transitionExecutionRecord(executionId, "running", { status: "failed" });
    assert.deepEqual(await (await get(member.cookie, "/active", scope)).json(), { activeRequest: null },
      "terminal requests are not discovery history");
    assert.equal((await get(member.cookie, `/executions/${executionId}`, scope)).status, 409);
    const nextId = seed(member.userId, workspace.id);
    db.delete(projectWorkspaceMembers).where(eq(projectWorkspaceMembers.userId, member.userId)).run();
    assert.equal((await get(member.cookie, "/active", scope)).status, 403);
    assert.equal((await get(member.cookie, `/executions/${nextId}`, scope)).status, 403);
    db.delete(projectWorkspaces).where(eq(projectWorkspaces.id, workspace.id)).run();
    assert.deepEqual(await (await get(member.cookie)).json(), { activeRequest: null },
      "SET NULL history foreign key must not expose deleted workspace runs as personal");
    assert.equal((await get(member.cookie, `/executions/${nextId}`)).status, 404);
    await transitionExecutionRecord(personalId, "running", { status: "succeeded" });
    assert.deepEqual(await (await get(outsider.cookie)).json(), { activeRequest: null }, "success is excluded too");
    const rows = db.select().from(aiExecutionHistory).where(eq(aiExecutionHistory.userId, member.userId)).all();
    assert.equal(rows.length, 2, "status reads do not create executions");
    assert.equal(providerCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
