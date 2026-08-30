import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

process.env.API_SERVER_DB_PATH = path.join(
  os.tmpdir(),
  `konstruksi-execution-history-test-${randomUUID()}.db`,
);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const { default: app } = await import("../app");
const {
  db,
  projectWorkspaceMembers,
  aiExecutionHistory,
} = await import("../db");
const {
  createExecutionRecord,
  transitionExecutionRecord,
} = await import("../lib/execution-history");
const { and, eq } = await import("drizzle-orm");

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

interface Session {
  userId: number;
  email: string;
  cookie: string;
}

async function registerUser(name: string): Promise<Session> {
  const email = `${name}-${randomUUID()}@example.test`;
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password: "password123" }),
  });
  assert.equal(response.status, 200);
  const match = /auth-token=([^;]+)/.exec(response.headers.get("set-cookie") ?? "");
  assert.ok(match);
  const body = await response.json() as { user: { id: number; email: string } };
  return {
    userId: body.user.id,
    email: body.user.email,
    cookie: `auth-token=${match[1]}`,
  };
}

function authedFetch(session: Session, urlPath: string, init: RequestInit = {}) {
  return fetch(`${baseUrl}${urlPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: session.cookie,
      ...init.headers,
    },
  });
}

async function createWorkspace(owner: Session): Promise<string> {
  const response = await authedFetch(owner, "/api/project-workspaces", {
    method: "POST",
    body: JSON.stringify({
      name: "Workspace Riwayat",
      stageId: "tender",
      notes: "Workspace untuk regression test",
    }),
  });
  assert.equal(response.status, 201);
  const body = await response.json() as { workspace: { id: string } };
  return body.workspace.id;
}

const sessions = {} as {
  owner: Session;
  member: Session;
  outsider: Session;
};
let workspaceId = "";
let workspaceExecutionId = "";
let personalExecutionId = "";

test("history endpoints require authentication", async () => {
  const response = await fetch(`${baseUrl}/api/execution-history`);
  assert.equal(response.status, 401);
});

test("execution metadata persists and can be reopened over HTTP", async () => {
  sessions.owner = await registerUser("history-owner");
  sessions.member = await registerUser("history-member");
  sessions.outsider = await registerUser("history-outsider");
  workspaceId = await createWorkspace(sessions.owner);

  await db.insert(projectWorkspaceMembers).values({
    id: randomUUID(),
    workspaceId,
    userId: sessions.member.userId,
    role: "editor",
    createdAt: new Date(),
  });

  const record = await createExecutionRecord({
    userId: sessions.member.userId,
    workspaceId,
    module: "solver",
    inputSummary: {
      label: "Solver — Teknik Konstruksi",
      details: "Hitung dimensi kolom untuk gedung kantor delapan lantai.",
      metadata: { outputFormat: "Laporan Teknis", hasAdditionalContext: true },
    },
  });
  workspaceExecutionId = record.id;
  await transitionExecutionRecord(record.id, "pending", { status: "running" });
  await transitionExecutionRecord(record.id, "running", {
    status: "succeeded",
    resultRef: `solver:${record.id}`,
    completedAt: new Date(),
  });

  const listResponse = await authedFetch(
    sessions.member,
    `/api/execution-history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as {
    executions: Array<{
      id: string;
      status: string;
      resultRef: string | null;
      inputSummary: { label: string };
    }>;
  };
  assert.equal(listBody.executions.length, 1);
  assert.equal(listBody.executions[0]?.id, record.id);
  assert.equal(listBody.executions[0]?.status, "succeeded");
  assert.equal(listBody.executions[0]?.resultRef, `solver:${record.id}`);
  assert.equal(listBody.executions[0]?.inputSummary.label, "Solver — Teknik Konstruksi");

  const detailResponse = await authedFetch(sessions.member, `/api/execution-history/${record.id}`);
  assert.equal(detailResponse.status, 200);
  const detailBody = await detailResponse.json() as {
    execution: { id: string; completedAt: string | null };
  };
  assert.equal(detailBody.execution.id, record.id);
  assert.ok(detailBody.execution.completedAt);
});

test("failed executions keep a safe error and remain visible after a later request", async () => {
  const record = await createExecutionRecord({
    userId: sessions.member.userId,
    workspaceId: null,
    module: "tender",
    inputSummary: {
      label: "Tender Intelligence — Gedung Kantor",
      details: "Analisis status dokumen tender",
      metadata: { documentCount: 8 },
    },
  });
  personalExecutionId = record.id;
  await transitionExecutionRecord(record.id, "pending", { status: "running" });
  await transitionExecutionRecord(record.id, "running", {
    status: "failed",
    errorMessage: "Analisis AI gagal diproses. Silakan coba lagi.",
    completedAt: new Date(),
  });

  const firstResponse = await authedFetch(sessions.member, `/api/execution-history/${record.id}`);
  const secondResponse = await authedFetch(sessions.member, `/api/execution-history/${record.id}`);
  assert.equal(firstResponse.status, 200);
  assert.equal(secondResponse.status, 200);
  const body = await secondResponse.json() as {
    execution: { status: string; errorMessage: string | null; resultRef: string | null };
  };
  assert.equal(body.execution.status, "failed");
  assert.equal(body.execution.errorMessage, "Analisis AI gagal diproses. Silakan coba lagi.");
  assert.equal(body.execution.resultRef, null);
});

test("stale pending or running executions are terminalized instead of remaining stuck", async () => {
  const record = await createExecutionRecord({
    userId: sessions.member.userId,
    workspaceId: null,
    module: "solver",
    inputSummary: { label: "Solver — proses terputus" },
  });
  await transitionExecutionRecord(record.id, "pending", { status: "running" });
  await db
    .update(aiExecutionHistory)
    .set({ updatedAt: new Date(Date.now() - 31 * 60 * 1000) })
    .where(eq(aiExecutionHistory.id, record.id));

  const response = await authedFetch(sessions.member, `/api/execution-history/${record.id}`);
  assert.equal(response.status, 200);
  const body = await response.json() as {
    execution: { status: string; errorMessage: string | null; completedAt: string | null };
  };
  assert.equal(body.execution.status, "failed");
  assert.match(body.execution.errorMessage ?? "", /terhenti/i);
  assert.ok(body.execution.completedAt);
});

test("another user cannot list or open someone else's execution", async () => {
  const listResponse = await authedFetch(sessions.outsider, "/api/execution-history");
  assert.equal(listResponse.status, 200);
  const body = await listResponse.json() as { executions: unknown[] };
  assert.equal(body.executions.length, 0);

  const detailResponse = await authedFetch(
    sessions.outsider,
    `/api/execution-history/${workspaceExecutionId}`,
  );
  assert.equal(detailResponse.status, 404);
});

test("revoking workspace access immediately hides workspace executions but not personal history", async () => {
  await db
    .update(projectWorkspaceMembers)
    .set({ revokedAt: new Date() })
    .where(and(
      eq(projectWorkspaceMembers.workspaceId, workspaceId),
      eq(projectWorkspaceMembers.userId, sessions.member.userId),
    ));

  const listResponse = await authedFetch(sessions.member, "/api/execution-history");
  assert.equal(listResponse.status, 200);
  const body = await listResponse.json() as { executions: Array<{ id: string }> };
  assert.ok(!body.executions.some((item) => item.id === workspaceExecutionId));
  assert.ok(body.executions.some((item) => item.id === personalExecutionId));

  const detailResponse = await authedFetch(
    sessions.member,
    `/api/execution-history/${workspaceExecutionId}`,
  );
  assert.equal(detailResponse.status, 404);

  const filteredResponse = await authedFetch(
    sessions.member,
    `/api/execution-history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(filteredResponse.status, 403);
});

test("retry references must belong to the same user, module, and workspace", async () => {
  const foreignRecord = await createExecutionRecord({
    userId: sessions.outsider.userId,
    workspaceId: null,
    module: "solver",
    inputSummary: { label: "Eksekusi pengguna lain" },
  });

  const { validateRetryReference } = await import("../lib/execution-history");
  const foreignResult = await validateRetryReference(
    foreignRecord.id,
    sessions.member.userId,
    "solver",
    null,
  );
  assert.ok("error" in foreignResult);

  const wrongModuleResult = await validateRetryReference(
    personalExecutionId,
    sessions.member.userId,
    "solver",
    null,
  );
  assert.ok("error" in wrongModuleResult);

  const validResult = await validateRetryReference(
    personalExecutionId,
    sessions.member.userId,
    "tender",
    null,
  );
  assert.deepEqual(validResult, { retryOfId: personalExecutionId });

  const persisted = await db
    .select({ status: aiExecutionHistory.status })
    .from(aiExecutionHistory)
    .where(eq(aiExecutionHistory.id, personalExecutionId));
  assert.equal(persisted[0]?.status, "failed");
});