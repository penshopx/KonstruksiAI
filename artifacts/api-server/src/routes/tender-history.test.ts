import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

process.env.API_SERVER_DB_PATH = path.join(
  os.tmpdir(),
  `konstruksi-tender-history-test-${randomUUID()}.db`,
);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const { default: app } = await import("../app");
const { db, projectWorkspaceMembers, tenderAnalysisResults } = await import("../db");
const { createExecutionRecord, transitionExecutionRecord } = await import("../lib/execution-history");
const { persistSuccessfulTenderAnalysis } = await import("../lib/tender-history");
const {
  calculateComplianceScore,
  reconcileCompletenessChecks,
  validateTenderAIResult,
} = await import("./tender-intelligence");
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

test("Tender document statuses override AI scores and retain actionable explanations", () => {
  const checks = reconcileCompletenessChecks(
    [
      { documentType: "SMK3", required: true, present: false, notes: "" },
      { documentType: "SBU", required: true, present: true, notes: "" },
      { documentType: "NIB", required: true, present: true, notes: "" },
    ],
    [
      {
        documentType: "SMK3",
        completenessScore: 96,
        missingElements: [],
        notes: "AI menyatakan lengkap.",
      },
      {
        documentType: "SBU",
        completenessScore: 94,
        missingElements: [],
        notes: "Masih berlaku.",
      },
      {
        documentType: "NIB",
        completenessScore: 28,
        missingElements: ["Data klasifikasi usaha belum sesuai."],
        notes: "Perlu diperbarui.",
      },
    ],
  );

  assert.equal(checks[0]?.completenessScore, 0);
  assert.ok(checks[0]?.missingElements.some((element) =>
    element.includes("SMK3") && element.includes("siapkan"),
  ));
  assert.equal(checks[1]?.completenessScore, 94);
  assert.deepEqual(checks[1]?.missingElements, []);
  assert.equal(checks[2]?.completenessScore, 28);
  assert.deepEqual(checks[2]?.missingElements, ["Data klasifikasi usaha belum sesuai."]);
});

test("Tender assessments match by document type even when the AI changes their order", () => {
  const documents = [
    { documentType: "SMK3", required: true, present: true, notes: "" },
    { documentType: "SBU", required: true, present: true, notes: "" },
  ];
  const assessments = [
    { documentType: "SBU", completenessScore: 91, missingElements: [], notes: "SBU sesuai." },
    { documentType: "SMK3", completenessScore: 37, missingElements: ["Perlu diperiksa."], notes: "SMK3 bermasalah." },
  ];

  const aiResult = validateTenderAIResult({ completenessChecks: assessments }, documents);
  assert.ok(aiResult);
  const checks = reconcileCompletenessChecks(documents, aiResult.completenessChecks);

  assert.equal(checks[0]?.completenessScore, 37);
  assert.equal(checks[0]?.notes, "SMK3 bermasalah.");
  assert.equal(checks[1]?.completenessScore, 91);
  assert.equal(checks[1]?.notes, "SBU sesuai.");
});

test("Tender rejects omitted, duplicate, and unknown document assessments", () => {
  const documents = [
    { documentType: "SBU", required: true, present: true, notes: "" },
    { documentType: "SMK3", required: true, present: false, notes: "" },
  ];
  const assessment = (documentType: string, completenessScore: number) => ({
    documentType,
    completenessScore,
    missingElements: [],
    notes: "Dinilai AI.",
  });
  const invalidAssessmentSets = [
    [assessment("SBU", 88)],
    [assessment("SBU", 88), assessment("SBU", 42)],
    [assessment("SBU", 88), assessment("NIB", 42)],
  ];

  for (const completenessChecks of invalidAssessmentSets) {
    assert.equal(validateTenderAIResult({ completenessChecks }, documents), null);
    assert.throws(
      () => reconcileCompletenessChecks(documents, completenessChecks),
      /do not match the input documents/,
    );
  }
});

test("Tender compliance score is capped by missing required documents", () => {
  const documents = [
    { documentType: "SBU", required: true, present: true, notes: "" },
    { documentType: "SMK3", required: true, present: false, notes: "" },
  ];

  assert.equal(calculateComplianceScore(documents, 98, 100, 0), 50);
  assert.equal(
    calculateComplianceScore(
      documents.map((document) => ({ ...document, present: true })),
      98,
      100,
      0,
    ),
    98,
  );
});

async function createWorkspace(owner: Session): Promise<string> {
  const response = await authedFetch(owner, "/api/project-workspaces", {
    method: "POST",
    body: JSON.stringify({ name: "Workspace Tender", stageId: "tender", notes: "" }),
  });
  assert.equal(response.status, 201);
  const body = await response.json() as { workspace: { id: string } };
  return body.workspace.id;
}

async function seedSavedResult(userId: number, workspaceId: string | null, suffix: string) {
  const execution = await createExecutionRecord({
    userId,
    workspaceId,
    module: "tender",
    inputSummary: {
      label: `Tender Intelligence — Gedung ${suffix}`,
      details: "Tender gedung empat lantai",
    },
  });
  await transitionExecutionRecord(execution.id, "pending", { status: "running" });
  return persistSuccessfulTenderAnalysis({
    executionId: execution.id,
    userId,
    workspaceId,
    payload: {
      projectName: `Gedung ${suffix}`,
      tenderType: "Tender Konstruksi",
      projectDetails: "Nilai kontrak Rp50 miliar, tenggat 90 hari",
      documents: [
        { documentType: "SBU", required: true, present: true, notes: "Berlaku sampai 2028" },
        { documentType: "SMK3", required: true, present: false, notes: "Dalam proses" },
      ],
      checklistState: {
        "admin-1": { checked: true, notes: "Akta tersedia" },
        "safety-1": { checked: false, notes: "Perlu diperbarui" },
      },
      completenessChecks: [
        {
          documentType: "SBU",
          required: true,
          present: true,
          completenessScore: 92,
          missingElements: [],
          notes: "Dokumen masih berlaku.",
        },
        {
          documentType: "SMK3",
          required: true,
          present: false,
          completenessScore: 0,
          missingElements: ["Sertifikat belum tersedia"],
          notes: "Wajib diselesaikan sebelum penawaran.",
        },
      ],
      overallCompleteness: 46,
      risks: [{
        id: "risk-1",
        category: "compliance",
        description: "SMK3 belum tersedia",
        severity: "critical",
        likelihood: "high",
        mitigation: ["Percepat sertifikasi"],
        impact: "Berpotensi gugur administrasi",
      }],
      recommendations: ["Selesaikan SMK3 sebelum batas pemasukan"],
      complianceScore: 38,
      summary: {
        administrativeRequirements: "Dokumen badan usaha tersedia.",
        technicalRequirements: "Kapabilitas teknis perlu diverifikasi.",
        financialRequirements: "Siapkan dukungan bank.",
        keyRisks: "SMK3 belum tersedia.",
        nextSteps: "Percepat sertifikasi dan lakukan review akhir.",
      },
    },
  });
}

const sessions = {} as {
  owner: Session;
  member: Session;
  outsider: Session;
};
let workspaceId = "";
let workspaceResultId = "";
let personalResultId = "";

test("Tender history endpoints require authentication", async () => {
  assert.equal((await fetch(`${baseUrl}/api/tender-intelligence/history`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/api/tender-intelligence/history/missing`)).status, 401);
});

test("saved Tender results persist and reopen with full inputs and AI output", async () => {
  sessions.owner = await registerUser("tender-owner");
  sessions.member = await registerUser("tender-member");
  sessions.outsider = await registerUser("tender-outsider");
  workspaceId = await createWorkspace(sessions.owner);

  await db.insert(projectWorkspaceMembers).values({
    id: randomUUID(),
    workspaceId,
    userId: sessions.member.userId,
    role: "editor",
    createdAt: new Date(),
  });

  workspaceResultId = (await seedSavedResult(sessions.member.userId, workspaceId, "Workspace")).id;
  personalResultId = (await seedSavedResult(sessions.member.userId, null, "Pribadi")).id;

  const listResponse = await authedFetch(sessions.member, "/api/tender-intelligence/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as {
    results: Array<{ id: string; riskCount: number; documents?: unknown }>;
  };
  assert.ok(listBody.results.some(({ id }) => id === workspaceResultId));
  assert.ok(listBody.results.some(({ id }) => id === personalResultId));
  assert.ok(listBody.results.every((result) => result.documents === undefined));
  assert.equal(listBody.results.find(({ id }) => id === workspaceResultId)?.riskCount, 1);

  const filteredResponse = await authedFetch(
    sessions.member,
    `/api/tender-intelligence/history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(filteredResponse.status, 200);
  const filteredBody = await filteredResponse.json() as { results: Array<{ id: string }> };
  assert.deepEqual(filteredBody.results.map(({ id }) => id), [workspaceResultId]);

  const detailResponse = await authedFetch(
    sessions.member,
    `/api/tender-intelligence/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 200);
  const detailBody = await detailResponse.json() as {
    result: {
      id: string;
      executionId: string;
      projectDetails: string;
      documents: Array<{ documentType: string; notes: string }>;
      checklistState: Record<string, { checked: boolean; notes: string }>;
      completenessChecks: unknown[];
      risks: unknown[];
      recommendations: string[];
      summary: { nextSteps: string };
    };
  };
  assert.equal(detailBody.result.id, workspaceResultId);
  assert.equal(detailBody.result.executionId, workspaceResultId);
  assert.equal(detailBody.result.projectDetails, "Nilai kontrak Rp50 miliar, tenggat 90 hari");
  assert.equal(detailBody.result.documents[0]?.notes, "Berlaku sampai 2028");
  assert.deepEqual(detailBody.result.checklistState["admin-1"], {
    checked: true,
    notes: "Akta tersedia",
  });
  assert.equal(detailBody.result.completenessChecks.length, 2);
  assert.equal(detailBody.result.risks.length, 1);
  assert.deepEqual(detailBody.result.recommendations, ["Selesaikan SMK3 sebelum batas pemasukan"]);
  assert.match(detailBody.result.summary.nextSteps, /Percepat sertifikasi/);
});

test("another user cannot list or open someone else's Tender results", async () => {
  const listResponse = await authedFetch(sessions.outsider, "/api/tender-intelligence/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as { results: unknown[] };
  assert.equal(listBody.results.length, 0);

  const detailResponse = await authedFetch(
    sessions.outsider,
    `/api/tender-intelligence/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 404);
});

test("Tender result insert rolls back when execution cannot transition to succeeded", async () => {
  const execution = await createExecutionRecord({
    userId: sessions.member.userId,
    workspaceId: null,
    module: "tender",
    inputSummary: { label: "Tender — rollback", details: "Eksekusi belum berjalan" },
  });

  await assert.rejects(
    async () => persistSuccessfulTenderAnalysis({
      executionId: execution.id,
      userId: sessions.member.userId,
      workspaceId: null,
      payload: {
        projectName: "Harus rollback",
        tenderType: "Tender Konstruksi",
        projectDetails: "",
        documents: [],
        checklistState: {},
        completenessChecks: [],
        overallCompleteness: 0,
        risks: [],
        recommendations: [],
        complianceScore: 0,
        summary: {
          administrativeRequirements: "",
          technicalRequirements: "",
          financialRequirements: "",
          keyRisks: "",
          nextSteps: "",
        },
      },
    }),
    /Status eksekusi Tender tidak dapat diselesaikan/,
  );

  const persisted = await db
    .select({ id: tenderAnalysisResults.id })
    .from(tenderAnalysisResults)
    .where(eq(tenderAnalysisResults.id, execution.id));
  assert.equal(persisted.length, 0);
});

test("revoked workspace access hides saved Tender results immediately", async () => {
  await db
    .update(projectWorkspaceMembers)
    .set({ revokedAt: new Date() })
    .where(and(
      eq(projectWorkspaceMembers.workspaceId, workspaceId),
      eq(projectWorkspaceMembers.userId, sessions.member.userId),
    ));

  const listResponse = await authedFetch(sessions.member, "/api/tender-intelligence/history");
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json() as { results: Array<{ id: string }> };
  assert.ok(!listBody.results.some(({ id }) => id === workspaceResultId));
  assert.ok(listBody.results.some(({ id }) => id === personalResultId));

  const detailResponse = await authedFetch(
    sessions.member,
    `/api/tender-intelligence/history/${workspaceResultId}`,
  );
  assert.equal(detailResponse.status, 404);

  const filteredResponse = await authedFetch(
    sessions.member,
    `/api/tender-intelligence/history?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  assert.equal(filteredResponse.status, 403);
});