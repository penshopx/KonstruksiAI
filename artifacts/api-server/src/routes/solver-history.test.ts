import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

process.env.API_SERVER_DB_PATH = path.join(
  os.tmpdir(),
  `konstruksi-solver-history-test-${randomUUID()}.db`,
);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const { default: app } = await import("../app");
const { db, projectWorkspaceMembers, solverAnalysisResults } = await import("../db");
const { createExecutionRecord, transitionExecutionRecord } = await import("../lib/execution-history");
const { persistSuccessfulSolverAnalysis } = await import("../lib/solver-history");
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
  cookie: string;
}

async function registerUser(name: string): Promise<Session> {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email: `${name}-${randomUUID()}@example.test`,
      password: "password123",
    }),
  });
  assert.equal(response.status, 200);
  const cookieMatch = /auth-token=([^;]+)/.exec(response.headers.get("set-cookie") ?? "");
  assert.ok(cookieMatch);
  const body = await response.json() as { user: { id: number } };
  return { userId: body.user.id, cookie: `auth-token=${cookieMatch[1]}` };
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
    body: JSON.stringify({ name: "Workspace Solver", stageId: "planning", notes: "" }),
  });
  assert.equal(response.status, 201);
  const body = await response.json() as { workspace: { id: string } };
  return body.workspace.id;
}

async function seedSavedResult(userId: number, workspaceId: string | null, suffix: string) {
  const execution = await createExecutionRecord({
    userId,
    workspaceId,
    module: "solver",
    inputSummary: {
      label: "Solver — Teknik Konstruksi",
      details: `Hitung kolom gedung ${suffix}`,
    },
  });
  await transitionExecutionRecord(execution.id, "pending", { status: "running" });
  const saved = await persistSuccessfulSolverAnalysis({
    executionId: execution.id,
    userId,
    workspaceId,
    payload: {
      problem: `Hitung kolom gedung ${suffix}`,
      domain: "Teknik Konstruksi",
      context: "Lokasi Jakarta, empat lantai",
      outputFormat: "Laporan Teknis Terstruktur",
      approach: "Analisis beban awal dan dimensi kolom",
      analysis: "## Analisis\nBeban dihitung berdasarkan asumsi awal.",
      solution: "## Solusi\nGunakan evaluasi struktur rinci.",
      regulations: ["SNI 2847:2019"],
      nextSteps: ["Verifikasi beban lapangan", "Tinjau bersama insinyur struktur"],
    },
  });
  return saved;
}

const sessions = {} as {
  owner: Session;
  member: Session;
  outsider: Session;
};
let workspaceId = "";
let workspaceResultId = "";
let personalResultId = "";

test("solver history endpoints require authentication", async () => {
  assert.equal((await fetch(`${baseUrl}/api/solver/history`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/api/solver/history/missing`)).status, 401);
});

test("saved Solver results persist and reopen with their full content", async () => {
  sessions.owner = await registerUser("solver-owner");
  sessions.member = await registerUser("solver-member");
  sessions.outsider = await registerUser("solver-outsider");
  workspaceId = await createWorkspace(sessions.owner);

  await db.insert(projectWorkspaceMembers).values({
    id: randomUUID(),
    workspaceId,
    userId: sessions.member.userId,
    role: "editor",
    createdAt: new Date(),
  });

  workspaceResultId = (await seedSavedResult(sessions.member.userId, workspaceId, "workspace")).id;
  personalResultId = (await seedSavedResult(sessions.member.userId, null, "pribadi")).id;

  const listResponse = await authedFetch(sessions.member, "/api/solver/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as {
    results: Array<{ id: string; problem: string; analysis?: string }>;
  };
  assert.ok(listBody.results.some((result) => result.id === workspaceResultId));
  assert.ok(listBody.results.some((result) => result.id === personalResultId));
  assert.ok(listBody.results.every((result) => result.analysis === undefined));

  const filteredResponse = await authedFetch(
    sessions.member,
    `/api/solver/history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(filteredResponse.status, 200);
  const filteredBody = await filteredResponse.json() as { results: Array<{ id: string }> };
  assert.deepEqual(filteredBody.results.map(({ id }) => id), [workspaceResultId]);

  const detailResponse = await authedFetch(
    sessions.member,
    `/api/solver/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 200);
  const detailBody = await detailResponse.json() as {
    result: {
      id: string;
      executionId: string;
      context: string;
      analysis: string;
      solution: string;
      regulations: string[];
      nextSteps: string[];
    };
  };
  assert.equal(detailBody.result.id, workspaceResultId);
  assert.equal(detailBody.result.executionId, workspaceResultId);
  assert.equal(detailBody.result.context, "Lokasi Jakarta, empat lantai");
  assert.match(detailBody.result.analysis, /Analisis/);
  assert.match(detailBody.result.solution, /Solusi/);
  assert.deepEqual(detailBody.result.regulations, ["SNI 2847:2019"]);
  assert.equal(detailBody.result.nextSteps.length, 2);
});

test("another user cannot list or open someone else's Solver results", async () => {
  const listResponse = await authedFetch(sessions.outsider, "/api/solver/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as { results: unknown[] };
  assert.equal(listBody.results.length, 0);

  const detailResponse = await authedFetch(
    sessions.outsider,
    `/api/solver/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 404);
});

test("result insert rolls back when the execution cannot transition to succeeded", async () => {
  const execution = await createExecutionRecord({
    userId: sessions.member.userId,
    workspaceId: null,
    module: "solver",
    inputSummary: { label: "Solver — rollback", details: "Eksekusi belum berjalan" },
  });

  await assert.rejects(
    async () => persistSuccessfulSolverAnalysis({
        executionId: execution.id,
        userId: sessions.member.userId,
        workspaceId: null,
        payload: {
          problem: "Hasil yang harus di-rollback",
          domain: "Teknik Konstruksi",
          context: "",
          outputFormat: "Laporan Teknis Terstruktur",
          approach: "Tidak boleh tersimpan",
          analysis: "Tidak boleh tersimpan",
          solution: "Tidak boleh tersimpan",
          regulations: [],
          nextSteps: [],
        },
      }),
    /Status eksekusi Solver tidak dapat diselesaikan/,
  );

  const persisted = await db
    .select({ id: solverAnalysisResults.id })
    .from(solverAnalysisResults)
    .where(eq(solverAnalysisResults.id, execution.id));
  assert.equal(persisted.length, 0);
});

test("revoked workspace access hides saved workspace results immediately", async () => {
  await db
    .update(projectWorkspaceMembers)
    .set({ revokedAt: new Date() })
    .where(and(
      eq(projectWorkspaceMembers.workspaceId, workspaceId),
      eq(projectWorkspaceMembers.userId, sessions.member.userId),
    ));

  const listResponse = await authedFetch(sessions.member, "/api/solver/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as { results: Array<{ id: string }> };
  assert.ok(!listBody.results.some(({ id }) => id === workspaceResultId));
  assert.ok(listBody.results.some(({ id }) => id === personalResultId));

  const detailResponse = await authedFetch(
    sessions.member,
    `/api/solver/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 404);

  const filteredResponse = await authedFetch(
    sessions.member,
    `/api/solver/history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(filteredResponse.status, 403);
});