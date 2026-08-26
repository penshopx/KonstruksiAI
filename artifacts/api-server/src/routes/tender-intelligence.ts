import { Router } from "express";
import type { Request, Response } from "express";
import { getSessionFromRequest } from "../lib/auth";
import OpenAI from "openai";

const router = Router();

// ─── OpenAI client (lazy init) ────────────────────────────────────────────────

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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

setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS;
  for (const [uid, ts] of userRateMap.entries()) {
    const fresh = ts.filter((t) => t > cutoff);
    if (fresh.length === 0) userRateMap.delete(uid);
    else userRateMap.set(uid, fresh);
  }
}, 300_000);

// ─── Retry policy for transient OpenAI errors ────────────────────────────────

const MAX_COMPLETION_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 503]);

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function isRetryableOpenAIError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status !== undefined && RETRYABLE_STATUS_CODES.has(status);
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

function validateTenderAIResult(parsed: unknown): TenderAIResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;

  const rawChecks = Array.isArray(obj.completenessChecks) ? obj.completenessChecks : null;
  if (!rawChecks) return null;

  const completenessChecks: CompletenessCheckAI[] = [];
  for (const item of rawChecks) {
    if (!item || typeof item !== "object") continue;
    const ci = item as Record<string, unknown>;
    if (typeof ci.documentType !== "string" || !ci.documentType.trim()) continue;
    const score = typeof ci.completenessScore === "number" && Number.isFinite(ci.completenessScore)
      ? Math.min(100, Math.max(0, Math.round(ci.completenessScore)))
      : 0;
    const missingElements = Array.isArray(ci.missingElements)
      ? ci.missingElements.filter((m): m is string => typeof m === "string" && m.trim().length > 0)
      : [];
    const notes = typeof ci.notes === "string" ? ci.notes.trim() : "";
    completenessChecks.push({ documentType: ci.documentType.trim(), completenessScore: score, missingElements, notes });
  }
  if (completenessChecks.length === 0) return null;

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

router.post("/tender-intelligence/analyze", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  if (!checkRateLimit(session.userId)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi." });
    return;
  }

  try {
    const { projectName, tenderType, projectDetails, documents: rawDocuments } = req.body as {
      projectName?: string;
      tenderType?: string;
      projectDetails?: string;
      documents?: unknown;
    };

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

    const userContent = buildUserContent(projectName.trim(), resolvedTenderType, resolvedDetails, documents);

    let attempt = 0;
    let raw: string | null = null;
    let lastErr: unknown;

    while (attempt < MAX_COMPLETION_ATTEMPTS) {
      attempt += 1;
      try {
        const completion = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 4096,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          stream: false,
        });
        raw = completion.choices[0]?.message?.content ?? null;
        lastErr = undefined;
        break;
      } catch (err) {
        lastErr = err;
        if (!isRetryableOpenAIError(err) || attempt >= MAX_COMPLETION_ATTEMPTS) break;
        await wait(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      }
    }

    if (lastErr) throw lastErr;
    if (!raw) throw new Error("AI tidak mengembalikan respons. Silakan coba lagi.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI mengembalikan format yang tidak valid. Silakan coba lagi.");
    }

    const aiResult = validateTenderAIResult(parsed);
    if (!aiResult) {
      throw new Error("AI mengembalikan struktur data yang tidak lengkap. Silakan coba lagi.");
    }

    // Merge the AI's per-document assessment back onto the caller's trusted
    // document list. `required`/`present` always come from the user's actual
    // input, never from the model, so the AI cannot silently misreport what
    // the user declared.
    const checksByType = new Map(aiResult.completenessChecks.map((c) => [c.documentType.toLowerCase(), c]));
    const completenessChecks = documents.map((doc, index) => {
      const match = checksByType.get(doc.documentType.toLowerCase()) ?? aiResult.completenessChecks[index] ?? null;
      const fallbackScore = doc.present ? 50 : 0;
      return {
        documentType: doc.documentType,
        required: doc.required,
        present: doc.present,
        completenessScore: match ? match.completenessScore : fallbackScore,
        missingElements: match && match.missingElements.length > 0
          ? match.missingElements
          : (doc.present ? [] : ["Dokumen belum tersedia"]),
        notes: match?.notes || (doc.present ? "Dokumen dilaporkan tersedia." : "Dokumen belum dilengkapi."),
      };
    });

    const overallCompleteness = completenessChecks.length > 0
      ? Math.round(completenessChecks.reduce((sum, c) => sum + c.completenessScore, 0) / completenessChecks.length)
      : 0;

    const risks = aiResult.risks.map((risk, index) => ({ id: `risk-${index + 1}`, ...risk }));

    const complianceScore = aiResult.complianceScore ?? Math.max(0, overallCompleteness - risks.length * 5);

    res.json({
      completenessChecks,
      overallCompleteness,
      risks,
      recommendations: aiResult.recommendations,
      complianceScore,
      summary: aiResult.summary,
    });
  } catch (err) {
    req.log.error({ err }, "POST /tender-intelligence/analyze error");
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: errMsg });
  }
});

export default router;
