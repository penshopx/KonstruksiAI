import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { getSessionFromRequest } from "../lib/auth";
import OpenAI from "openai";
import { rateLimit } from "express-rate-limit";
import { eq } from "drizzle-orm";
import { db, users } from "../db";
import { listTenderProviderChecks, recordTenderProviderCheck } from "../lib/tender-provider-audit";
import type { CheckTenderProviderSetup200 } from "@workspace/api-zod";
import { DiscoverActiveTenderRequestResponse, RecoverTenderExecutionParams } from "@workspace/api-zod";
import {
  classifyTenderAnalysisError,
  getTenderAnalysisErrorDiagnostics,
  getTenderProviderRequestId,
  isRetryableTenderProviderError,
  TenderAnalysisFailureError,
} from "../lib/tender-analysis-errors";
import { claimTenderRequest, findTenderRequest, findTenderExecution, reconcileTenderRequests, tenderInputHash } from "../lib/tender-run-guard";
import {
  resolveExecutionWorkspace,
  transitionExecutionRecord,
  validateRetryReference,
} from "../lib/execution-history";
import {
  getTenderAnalysisResult,
  listTenderAnalysisHistory,
  normalizeChecklistState,
  persistSuccessfulTenderAnalysis,
  toTenderAnalysisResult,
  toTenderAnalysisSummary,
} from "../lib/tender-history";

const router = Router();
const TENDER_MODEL = "openai/gpt-4o-mini";

// Global cap: this diagnostic spends provider tokens and must not be abused.
const setupCheckLimiter = rateLimit({
  windowMs: 60_000,
  limit: 3,
  keyGenerator: () => "tender-provider-setup",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) => {
    recordTenderProviderCheck(res.locals.setupAccountId, new Date().toISOString(), "AI_SETUP_RATE_LIMITED");
    res.status(429).json({ error: "Batas pemeriksaan tercapai. Tunggu satu menit lalu coba kembali." });
  },
});

// Check the current account, not a role claim that can be stale in a seven-day JWT.
router.use("/tender-intelligence/provider-setup", async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [account] = await db.select({ role: users.role }).from(users)
    .where(eq(users.id, session.userId)).limit(1);
  const canCheck = account?.role === "admin";
  // Express strips this middleware's mount path; "/" is the capability route,
  // while "/history" must continue through the administrator check.
  if (req.method === "GET" && req.path === "/") {
    res.json({ canCheck }); return;
  }
  if (!canCheck) {
    res.status(403).json({ error: "Pemeriksaan ini hanya tersedia untuk administrator." });
    return;
  }
  res.locals.setupAccountId = session.userId;
  next();
});

router.get("/tender-intelligence/provider-setup/history", async (_req, res): Promise<void> => {
  res.json(listTenderProviderChecks());
});

router.post("/tender-intelligence/provider-setup", setupCheckLimiter, async (_req, res) => {
  const checkedAt = new Date().toISOString();
  let result: Omit<CheckTenderProviderSetup200, "checkedAt"> & { checkedAt: string };
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: TENDER_MODEL,
      max_tokens: 16,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: 'Reply with JSON: {"ok":true}' }],
    }, { timeout: 15_000, maxRetries: 0 });
    if (!completion.choices[0]?.message?.content?.trim()) {
      throw new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE");
    }
    result = {
      ready: true, code: "AI_PROVIDER_READY", checkedAt,
      message: "Provider AI siap menerima permintaan Tender.",
      action: "Hasil ini hanya memastikan koneksi saat pemeriksaan, bukan menjamin keberhasilan analisis.",
      retryable: false,
    };
  } catch (error) {
    // Only allowlisted guidance crosses the API boundary; never echo SDK output.
    const failure = classifyTenderAnalysisError(error);
    result = {
      ready: false, code: failure.code, checkedAt,
      message: failure.error, action: failure.action, retryable: failure.retryable,
    };
  }
  // Outside the provider catch: a failed audit write must not be reported as a
  // successful check (nor misclassified as a provider error).
  recordTenderProviderCheck(res.locals.setupAccountId, checkedAt, result.code);
  res.json(result);
});

// ─── OpenAI client (lazy init) ────────────────────────────────────────────────

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new TenderAnalysisFailureError("AI_PROVIDER_NOT_CONFIGURED");
    }
    _openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      timeout: 90_000,
      maxRetries: 0,
    });
  }
  return _openai;
}

// ─── Per-user in-memory rate limiter ─────────────────────────────────────────
// Allow 20 requests per minute per user; sliding window. Mirrors chat.ts and
// solver.ts since all three call the same OpenAI account.

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

const userRateMap = new Map<number, number[]>();

function checkRateLimit(userId: number): boolean {
  const now = Date.now();
  const window = (userRateMap.get(userId) ?? []).filter(
    (ts) => now - ts < RATE_WINDOW_MS,
  );
  if (window.length >= RATE_MAX) return false;
  window.push(now);
  userRateMap.set(userId, window);
  return true;
}

// Unref'd so this background pruning timer never keeps the process (or a
// test harness) alive.
setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS;
  for (const [uid, ts] of userRateMap.entries()) {
    const fresh = ts.filter((t) => t > cutoff);
    if (fresh.length === 0) userRateMap.delete(uid);
    else userRateMap.set(uid, fresh);
  }
}, 300_000).unref();

// ─── Retry policy for transient OpenAI errors ────────────────────────────────

const MAX_COMPLETION_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

function isRetryableOpenAIError(error: unknown): boolean {
  return isRetryableTenderProviderError(error);
}
function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// ─── Input limits ─────────────────────────────────────────────────────────────

const MAX_PROJECT_NAME_CHARS = 300;
const MAX_TENDER_TYPE_CHARS = 200;
const MAX_DETAILS_CHARS = 8_000;
const MAX_DOCUMENTS = 40;
const MAX_DOCUMENT_TYPE_CHARS = 200;
const MAX_NOTES_CHARS = 2_000;

interface DocumentInput {
  documentType: string;
  required: boolean;
  present: boolean;
  notes: string;
}

function parseDocuments(raw: unknown): { documents: DocumentInput[] } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "Minimal satu dokumen diperlukan untuk analisis." };
  }
  if (raw.length > MAX_DOCUMENTS) {
    return { error: `Maksimal ${MAX_DOCUMENTS} dokumen per analisis.` };
  }

  const documents: DocumentInput[] = [];
  const documentTypes = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      return { error: "Format data dokumen tidak valid." };
    }
    const obj = item as Record<string, unknown>;
    const documentType = typeof obj.documentType === "string" ? obj.documentType.trim() : "";
    if (!documentType) {
      return { error: "Setiap dokumen harus memiliki nama/jenis dokumen." };
    }
    if (documentType.length > MAX_DOCUMENT_TYPE_CHARS) {
      return { error: `Nama dokumen tidak boleh melebihi ${MAX_DOCUMENT_TYPE_CHARS} karakter.` };
    }
    const normalizedDocumentType = documentType.toLowerCase();
    if (documentTypes.has(normalizedDocumentType)) {
      return { error: `Jenis dokumen "${documentType}" dicantumkan lebih dari sekali.` };
    }
    documentTypes.add(normalizedDocumentType);
    const notes = typeof obj.notes === "string" ? obj.notes : "";
    if (notes.length > MAX_NOTES_CHARS) {
      return { error: `Catatan dokumen tidak boleh melebihi ${MAX_NOTES_CHARS} karakter.` };
    }
    documents.push({
      documentType,
      required: obj.required === true,
      present: obj.present === true,
      notes: notes.trim(),
    });
  }
  return { documents };
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Kamu adalah AI Tender Intelligence KonstruksiAI, ahli analisis kesiapan tender pengadaan konstruksi pemerintah maupun swasta di Indonesia.
Rujukan regulasi utama: Perpres 12/2021 jo. perubahannya tentang Pengadaan Barang/Jasa Pemerintah, UU No. 2/2017 tentang Jasa Konstruksi, ketentuan SBU/SKK, BPJS Ketenagakerjaan, dan persyaratan K3 konstruksi (SMK3).

Tugasmu: menilai kesiapan tender berdasarkan status dokumen dan detail proyek NYATA yang diberikan pengguna. JANGAN mengarang status dokumen yang berbeda dari input, dan JANGAN memberi skor kelengkapan generik yang sama untuk semua kasus — dasarkan penilaian pada input aktual.

Untuk setiap dokumen dalam daftar "Status Dokumen" yang diberikan:
- Jika berstatus "Belum Ada", completenessScore harus 0 dan missingElements mencantumkan elemen yang perlu dilengkapi.
- Jika berstatus "Ada", evaluasi catatan pengguna (jika ada) untuk menilai completenessScore (0-100) secara realistis. Dokumen "ada" tapi kedaluwarsa, tidak sesuai bidang, atau catatan yang mengindikasikan masalah tetap harus mendapat skor rendah dan dijelaskan di missingElements. Jika tidak ada catatan mencurigakan, beri skor tinggi (85-100).
- Tulis "notes" singkat (maksimal 1-2 kalimat) menjelaskan alasan penilaian tiap dokumen.

Setelah itu, identifikasi risiko-risiko NYATA (bukan daftar generik) berdasarkan dokumen yang belum lengkap/bermasalah serta detail proyek yang diberikan, berikan rekomendasi konkret dan berprioritas, serta skor kepatuhan keseluruhan (complianceScore, 0-100) yang mempertimbangkan kelengkapan dokumen DAN risiko yang teridentifikasi.

Kembalikan HANYA objek JSON valid (tanpa teks lain di luar JSON) dengan struktur persis berikut:
{
  "completenessChecks": [
    { "documentType": string, "completenessScore": number, "missingElements": string[], "notes": string }
  ],
  "risks": [
    { "category": "compliance"|"technical"|"financial"|"schedule"|"contractual", "description": string, "severity": "low"|"medium"|"high"|"critical", "likelihood": "low"|"medium"|"high", "mitigation": string[], "impact": string }
  ],
  "recommendations": string[],
  "complianceScore": number,
  "summary": {
    "administrativeRequirements": string,
    "technicalRequirements": string,
    "financialRequirements": string,
    "keyRisks": string,
    "nextSteps": string
  }
}
"completenessChecks" harus memuat SATU entri untuk SETIAP dokumen pada "Status Dokumen" di atas, dengan "documentType" persis sama dengan input, dalam urutan yang sama.
Jawab dalam Bahasa Indonesia.`;

function buildUserContent(
  projectName: string,
  tenderType: string,
  projectDetails: string,
  documents: DocumentInput[],
): string {
  const documentLines = documents
    .map((doc) => {
      const parts = [
        `- ${doc.documentType}`,
        `Wajib: ${doc.required ? "Ya" : "Tidak"}`,
        `Status: ${doc.present ? "Ada" : "Belum Ada"}`,
      ];
      if (doc.notes) parts.push(`Catatan pengguna: ${doc.notes}`);
      return parts.join(" | ");
    })
    .join("\n");

  return [
    `Nama Proyek: ${projectName}`,
    `Jenis Tender: ${tenderType}`,
    projectDetails ? `Detail Proyek:\n${projectDetails}` : null,
    `Status Dokumen:\n${documentLines}`,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n\n");
}

// ─── AI result validation ─────────────────────────────────────────────────────

const RISK_CATEGORIES = new Set(["compliance", "technical", "financial", "schedule", "contractual"]);
const SEVERITY_LEVELS = new Set(["low", "medium", "high", "critical"]);
const LIKELIHOOD_LEVELS = new Set(["low", "medium", "high"]);

interface CompletenessCheckAI {
  documentType: string;
  completenessScore: number;
  missingElements: string[];
  notes: string;
}

export function reconcileCompletenessChecks(
  documents: DocumentInput[],
  aiChecks: CompletenessCheckAI[],
) {
  const checks = validateCompletenessChecks(aiChecks, documents);
  if (!checks) {
    throw new Error("Tender AI completeness checks do not match the input documents.");
  }
  const checksByType = new Map(checks.map((check) => [check.documentType.toLowerCase(), check]));
  return documents.map((doc) => {
    const match = checksByType.get(doc.documentType.toLowerCase())!;
    const missingDocumentExplanation =
      `Dokumen ${doc.documentType} belum tersedia; siapkan dokumen ini sebelum pengajuan tender.`;

    return {
      documentType: doc.documentType,
      required: doc.required,
      present: doc.present,
      completenessScore: doc.present ? match.completenessScore : 0,
      missingElements: doc.present
        ? match.missingElements
        : [
            ...match.missingElements,
            missingDocumentExplanation,
          ],
      notes: match.notes || (doc.present ? "Dokumen dilaporkan tersedia." : "Dokumen belum dilengkapi."),
    };
  });
}

export function calculateComplianceScore(
  documents: Pick<DocumentInput, "required" | "present">[],
  aiComplianceScore: number | null,
  overallCompleteness: number,
  riskCount: number,
): number {
  const score = aiComplianceScore ?? Math.max(0, overallCompleteness - riskCount * 5);
  const requiredDocuments = documents.filter((document) => document.required);
  if (requiredDocuments.length === 0) return score;

  const presentRequiredDocuments = requiredDocuments.filter((document) => document.present).length;
  const requiredDocumentScoreCap = Math.floor(
    (presentRequiredDocuments / requiredDocuments.length) * 100,
  );
  return Math.min(score, requiredDocumentScoreCap);
}

interface RiskAI {
  category: string;
  description: string;
  severity: string;
  likelihood: string;
  mitigation: string[];
  impact: string;
}

interface TenderAIResult {
  completenessChecks: CompletenessCheckAI[];
  risks: RiskAI[];
  recommendations: string[];
  complianceScore: number | null;
  summary: {
    administrativeRequirements: string;
    technicalRequirements: string;
    financialRequirements: string;
    keyRisks: string;
    nextSteps: string;
  };
}

function validateCompletenessChecks(
  rawChecks: unknown,
  documents: Pick<DocumentInput, "documentType">[],
): CompletenessCheckAI[] | null {
  if (!Array.isArray(rawChecks) || rawChecks.length !== documents.length) return null;

  const expectedTypes = new Set(documents.map((document) => document.documentType.toLowerCase()));
  if (expectedTypes.size !== documents.length) return null;

  const seenTypes = new Set<string>();
  const completenessChecks: CompletenessCheckAI[] = [];
  for (const item of rawChecks) {
    if (!item || typeof item !== "object") return null;
    const ci = item as Record<string, unknown>;
    if (typeof ci.documentType !== "string" || !ci.documentType.trim()) return null;
    const documentType = ci.documentType.trim();
    const normalizedDocumentType = documentType.toLowerCase();
    if (!expectedTypes.has(normalizedDocumentType) || seenTypes.has(normalizedDocumentType)) return null;
    seenTypes.add(normalizedDocumentType);

    const score = typeof ci.completenessScore === "number" && Number.isFinite(ci.completenessScore)
      ? Math.min(100, Math.max(0, Math.round(ci.completenessScore)))
      : 0;
    const missingElements = Array.isArray(ci.missingElements)
      ? ci.missingElements.filter((m): m is string => typeof m === "string" && m.trim().length > 0)
      : [];
    const notes = typeof ci.notes === "string" ? ci.notes.trim() : "";
    completenessChecks.push({ documentType, completenessScore: score, missingElements, notes });
  }

  return seenTypes.size === expectedTypes.size ? completenessChecks : null;
}

export function validateTenderAIResult(
  parsed: unknown,
  documents: Pick<DocumentInput, "documentType">[],
): TenderAIResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;

  const completenessChecks = validateCompletenessChecks(obj.completenessChecks, documents);
  if (!completenessChecks) return null;

  const rawRisks = Array.isArray(obj.risks) ? obj.risks : [];
  const risks: RiskAI[] = [];
  for (const item of rawRisks) {
    if (!item || typeof item !== "object") continue;
    const ri = item as Record<string, unknown>;
    if (typeof ri.description !== "string" || !ri.description.trim()) continue;
    const category = typeof ri.category === "string" && RISK_CATEGORIES.has(ri.category) ? ri.category : "compliance";
    const severity = typeof ri.severity === "string" && SEVERITY_LEVELS.has(ri.severity) ? ri.severity : "medium";
    const likelihood = typeof ri.likelihood === "string" && LIKELIHOOD_LEVELS.has(ri.likelihood) ? ri.likelihood : "medium";
    const mitigation = Array.isArray(ri.mitigation)
      ? ri.mitigation.filter((m): m is string => typeof m === "string" && m.trim().length > 0)
      : [];
    const impact = typeof ri.impact === "string" ? ri.impact.trim() : "";
    risks.push({ category, description: ri.description.trim(), severity, likelihood, mitigation, impact });
  }

  const recommendations = Array.isArray(obj.recommendations)
    ? obj.recommendations.filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    : [];

  const complianceScore = typeof obj.complianceScore === "number" && Number.isFinite(obj.complianceScore)
    ? Math.min(100, Math.max(0, Math.round(obj.complianceScore)))
    : null;

  const summaryRaw = obj.summary && typeof obj.summary === "object" ? (obj.summary as Record<string, unknown>) : {};
  const summary = {
    administrativeRequirements: typeof summaryRaw.administrativeRequirements === "string" ? summaryRaw.administrativeRequirements.trim() : "",
    technicalRequirements: typeof summaryRaw.technicalRequirements === "string" ? summaryRaw.technicalRequirements.trim() : "",
    financialRequirements: typeof summaryRaw.financialRequirements === "string" ? summaryRaw.financialRequirements.trim() : "",
    keyRisks: typeof summaryRaw.keyRisks === "string" ? summaryRaw.keyRisks.trim() : "",
    nextSteps: typeof summaryRaw.nextSteps === "string" ? summaryRaw.nextSteps.trim() : "",
  };

  return { completenessChecks, risks, recommendations, complianceScore, summary };
}

// ─── Tender Intelligence endpoint ─────────────────────────────────────────────

async function sendRequestState(res: Response, userId: number, requestId: string, workspaceId: string | null, byExecution = false) {
  res.setHeader("Cache-Control", "no-store");
  reconcileTenderRequests(userId);
  const saved = byExecution ? findTenderExecution(userId, workspaceId, requestId)
    : findTenderRequest(userId, requestId, workspaceId);
  if (!saved) {
    res.status(404).json({ error: "Permintaan Tender tidak ditemukan." });
    return;
  }
  const { execution } = saved;
  if (execution.status === "succeeded") {
    const result = await getTenderAnalysisResult({ userId, id: execution.id });
    if (!result) {
      res.status(404).json({ error: "Hasil Tender tidak ditemukan atau akses telah dicabut." });
      return;
    }
    const payload = toTenderAnalysisResult(result);
    res.json({ ...payload, status: "succeeded", executionId: execution.id,
      resultRef: execution.resultRef, result: payload });
  } else if (execution.status === "failed") {
    res.status(409).json({
      status: "failed", executionId: execution.id, code: "ANALYSIS_PREVIOUSLY_FAILED",
      error: execution.errorMessage || "Permintaan sebelumnya tidak selesai.",
      action: "Permintaan ini tidak akan dijalankan ulang otomatis. Periksa riwayat, lalu pilih Analisis baru bila diperlukan.",
      retryable: false,
    });
  } else {
    res.status(202).json({ status: "running", executionId: execution.id,
      message: "Analisis masih berjalan. Status dipulihkan tanpa memanggil AI kembali." });
  }
}

router.get("/tender-intelligence/requests/active", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  const workspace = await resolveExecutionWorkspace(req.query.workspaceId, session.userId);
  if ("error" in workspace) { res.status(workspace.status).json({ error: workspace.error }); return; }
  reconcileTenderRequests(session.userId);
  const saved = findTenderExecution(session.userId, workspace.workspaceId);
  res.json(DiscoverActiveTenderRequestResponse.parse({
    activeRequest: saved ? { executionId: saved.execution.id } : null,
  }));
});

router.get("/tender-intelligence/requests/executions/:executionId", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  const workspace = await resolveExecutionWorkspace(req.query.workspaceId, session.userId);
  if ("error" in workspace) { res.status(workspace.status).json({ error: workspace.error }); return; }
  const params = RecoverTenderExecutionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "ID proses tidak valid." }); return;
  }
  await sendRequestState(res, session.userId, params.data.executionId, workspace.workspaceId, true);
});

router.get("/tender-intelligence/requests/:requestId", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  const workspace = await resolveExecutionWorkspace(req.query.workspaceId, session.userId);
  if ("error" in workspace) { res.status(workspace.status).json({ error: workspace.error }); return; }
  const requestId = String(req.params.requestId);
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(requestId)) {
    res.status(400).json({ error: "ID permintaan tidak valid." }); return;
  }
  await sendRequestState(res, session.userId, requestId, workspace.workspaceId);
});

router.get("/tender-intelligence/history", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const workspaceResolution = await resolveExecutionWorkspace(req.query.workspaceId, session.userId);
    if ("error" in workspaceResolution) {
      res.status(workspaceResolution.status).json({ error: workspaceResolution.error });
      return;
    }
    const results = await listTenderAnalysisHistory({
      userId: session.userId,
      ...(workspaceResolution.workspaceId ? { workspaceId: workspaceResolution.workspaceId } : {}),
    });
    res.json({ results: results.map(toTenderAnalysisSummary) });
  } catch (error) {
    req.log.error({ err: error }, "GET /tender-intelligence/history error");
    res.status(500).json({ error: "Riwayat hasil Tender tidak dapat dimuat." });
  }
});

router.get("/tender-intelligence/history/:id", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(404).json({ error: "Hasil analisis Tender tidak ditemukan." });
      return;
    }
    const result = await getTenderAnalysisResult({ userId: session.userId, id });
    if (!result) {
      res.status(404).json({ error: "Hasil analisis Tender tidak ditemukan." });
      return;
    }
    res.json({ result: toTenderAnalysisResult(result) });
  } catch (error) {
    req.log.error({ err: error }, "GET /tender-intelligence/history/:id error");
    res.status(500).json({ error: "Hasil analisis Tender tidak dapat dibuka." });
  }
});

router.post("/tender-intelligence/analyze", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  let executionId: string | null = null;
  let processingProviderResponse = false;
  let attempt = 0;
  const requestStartedAt = performance.now();

  try {
    const {
      projectName,
      tenderType,
      projectDetails,
      documents: rawDocuments,
      checklistState: rawChecklistState,
      workspaceId,
      retryOfId,
      requestId: rawRequestId,
    } = req.body as {
      projectName?: string;
      tenderType?: string;
      projectDetails?: string;
      documents?: unknown;
      checklistState?: unknown;
      workspaceId?: string | null;
      retryOfId?: string | null;
      requestId?: string;
    };
    // Legacy callers remain supported; recovery-capable clients must supply a
    // stable ID before sending. Never derive it from input (new runs are explicit).
    const requestId = rawRequestId === undefined ? randomUUID() : rawRequestId;
    if (typeof requestId !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(requestId)) {
      res.status(400).json({ error: "ID permintaan tidak valid." }); return;
    }

    if (typeof projectName !== "string" || !projectName.trim()) {
      res.status(400).json({ error: "Nama proyek wajib diisi." });
      return;
    }
    if (projectName.length > MAX_PROJECT_NAME_CHARS) {
      res.status(400).json({ error: `Nama proyek tidak boleh melebihi ${MAX_PROJECT_NAME_CHARS} karakter.` });
      return;
    }

    const resolvedTenderType = typeof tenderType === "string" && tenderType.trim()
      ? tenderType.trim().slice(0, MAX_TENDER_TYPE_CHARS)
      : "Tender Konstruksi";

    const resolvedDetails = typeof projectDetails === "string" ? projectDetails.trim() : "";
    if (resolvedDetails.length > MAX_DETAILS_CHARS) {
      res.status(400).json({ error: `Detail proyek tidak boleh melebihi ${MAX_DETAILS_CHARS} karakter.` });
      return;
    }

    const parsedDocuments = parseDocuments(rawDocuments);
    if ("error" in parsedDocuments) {
      res.status(400).json({ error: parsedDocuments.error });
      return;
    }
    const { documents } = parsedDocuments;
    const checklistState = normalizeChecklistState(rawChecklistState);

    const workspaceResolution = await resolveExecutionWorkspace(workspaceId, session.userId);
    if ("error" in workspaceResolution) {
      res.status(workspaceResolution.status).json({ error: workspaceResolution.error });
      return;
    }
    const retryResolution = await validateRetryReference(
      retryOfId,
      session.userId,
      "tender",
      workspaceResolution.workspaceId,
    );
    if ("error" in retryResolution) {
      res.status(400).json({ error: retryResolution.error });
      return;
    }

    const userContent = buildUserContent(projectName.trim(), resolvedTenderType, resolvedDetails, documents);

    const claim = claimTenderRequest({
      userId: session.userId,
      requestId,
      inputHash: tenderInputHash({
        projectName: projectName.trim(), tenderType: resolvedTenderType,
        projectDetails: resolvedDetails, documents, checklistState,
        retryOfId: retryResolution.retryOfId,
      }),
      workspaceId: workspaceResolution.workspaceId,
      retryOfId: retryResolution.retryOfId,
      inputSummary: {
        label: `Tender Intelligence — ${projectName.trim()}`,
        details: resolvedDetails || "Analisis status dokumen tender",
        metadata: {
          tenderType: resolvedTenderType,
          documentCount: documents.length,
          availableDocumentCount: documents.filter((document) => document.present).length,
          checkedChecklistCount: Object.values(checklistState).filter((item) => item.checked).length,
        },
      },
    });
    if (claim.kind === "conflict") {
      res.status(409).json({ code: "REQUEST_INPUT_CHANGED",
        error: "ID permintaan sudah digunakan dengan input atau ruang proyek berbeda.",
        action: "Pulihkan permintaan lama atau pilih Analisis baru untuk input yang berubah.", retryable: false });
      return;
    }
    if (claim.kind === "replay") {
      await sendRequestState(res, session.userId, requestId, workspaceResolution.workspaceId);
      return;
    }
    if (claim.kind === "busy") {
      res.status(409).json({ code: "ANALYSIS_IN_PROGRESS",
        error: "Analisis Tender lain untuk akun Anda masih berjalan.",
        action: "Tunggu analisis di tab lain selesai, lalu periksa riwayat.", retryable: true });
      return;
    }
    executionId = claim.execution.id;
    if (!checkRateLimit(session.userId)) {
      await transitionExecutionRecord(executionId, "running", { status: "failed", completedAt: new Date(),
        errorMessage: "Batas permintaan analisis aplikasi tercapai. Tunggu satu menit." });
      res.status(429).json({ error: "Batas permintaan analisis aplikasi tercapai.", code: "REQUEST_RATE_LIMITED",
        action: "Tunggu satu menit sebelum memulai analisis baru.", retryable: true, executionId });
      return;
    }

    let raw: string | null = null;
    let lastErr: unknown;

    processingProviderResponse = true;
    while (attempt < MAX_COMPLETION_ATTEMPTS) {
      attempt += 1;
      const attemptStartedAt = performance.now();
      try {
        const { data: completion, response, request_id } = await getOpenAI().chat.completions.create({
          model: TENDER_MODEL,
          max_tokens: 4096,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          stream: false,
        }).withResponse();
        const providerRequestId = getTenderProviderRequestId({ request_id, response });
        req.log.info({
          executionId,
          attempt,
          maxAttempts: MAX_COMPLETION_ATTEMPTS,
          durationMs: Math.round(performance.now() - attemptStartedAt),
          providerStatus: response.status,
          ...(providerRequestId ? { providerRequestId } : {}),
        }, "Tender AI attempt completed");
        raw = completion.choices[0]?.message?.content ?? null;
        lastErr = undefined;
        break;
      } catch (err) {
        lastErr = err;
        const willRetry = isRetryableTenderProviderError(err) && attempt < MAX_COMPLETION_ATTEMPTS;
        req.log.warn({
          executionId,
          attempt,
          maxAttempts: MAX_COMPLETION_ATTEMPTS,
          durationMs: Math.round(performance.now() - attemptStartedAt),
          failureCode: classifyTenderAnalysisError(err).code,
          willRetry,
          ...getTenderAnalysisErrorDiagnostics(err),
        }, "Tender AI attempt failed");
        if (!willRetry) break;
        await wait(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      }
    }

    if (lastErr) throw lastErr;
    if (!raw) throw new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE");
    }

    const aiResult = validateTenderAIResult(parsed, documents);
    if (!aiResult) {
      throw new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE");
    }
    processingProviderResponse = false;

    // Trust the user's document status over the model, especially for scores
    // and the explanation shown when a document has not been provided.
    const completenessChecks = reconcileCompletenessChecks(documents, aiResult.completenessChecks);

    const overallCompleteness = completenessChecks.length > 0
      ? Math.round(completenessChecks.reduce((sum, c) => sum + c.completenessScore, 0) / completenessChecks.length)
      : 0;

    const risks = aiResult.risks.map((risk, index) => ({ id: `risk-${index + 1}`, ...risk }));

    const complianceScore = calculateComplianceScore(
      documents,
      aiResult.complianceScore,
      overallCompleteness,
      risks.length,
    );

    const savedResult = await persistSuccessfulTenderAnalysis({
      executionId,
      userId: session.userId,
      workspaceId: workspaceResolution.workspaceId,
      payload: {
        projectName: projectName.trim(),
        tenderType: resolvedTenderType,
        projectDetails: resolvedDetails,
        documents,
        checklistState,
        completenessChecks,
        overallCompleteness,
        risks,
        recommendations: aiResult.recommendations,
        complianceScore,
        summary: aiResult.summary,
      },
    });
    const resultRef = `tender:${savedResult.id}`;

    res.json({
      executionId,
      resultRef,
      completenessChecks,
      overallCompleteness,
      risks,
      recommendations: aiResult.recommendations,
      complianceScore,
      summary: aiResult.summary,
      result: toTenderAnalysisResult(savedResult),
      status: "succeeded",
    });
  } catch (err) {
    const classifiedFailure = classifyTenderAnalysisError(processingProviderResponse
      ? err
      : new TenderAnalysisFailureError("AI_INTERNAL_ERROR"));
    const failure = processingProviderResponse && classifiedFailure.code === "AI_INTERNAL_ERROR"
      ? classifyTenderAnalysisError(new TenderAnalysisFailureError("AI_PROVIDER_UNAVAILABLE"))
      : classifiedFailure;
    if (executionId) {
      try {
        await transitionExecutionRecord(executionId, ["pending", "running"], {
          status: "failed",
          completedAt: new Date(),
          errorMessage: `${failure.error} ${failure.action}`,
        });
      } catch (historyErr) {
        req.log.warn({ err: historyErr, executionId }, "Tender execution history update failed");
      }
    }
    req.log.error({
      failureCode: failure.code,
      executionId,
      attempts: attempt,
      durationMs: Math.round(performance.now() - requestStartedAt),
      ...getTenderAnalysisErrorDiagnostics(err),
    }, "POST /tender-intelligence/analyze error");
    res.status(failure.statusCode).json({
      error: failure.error,
      code: failure.code,
      action: failure.action,
      retryable: failure.retryable,
      ...(executionId ? { executionId } : {}),
    });
  } finally {
    req.log.info({
      executionId,
      attempts: attempt,
      durationMs: Math.round(performance.now() - requestStartedAt),
      statusCode: res.statusCode,
    }, "Tender analysis request finished");
  }
});

export default router;
