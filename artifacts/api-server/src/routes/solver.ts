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
// Allow 20 requests per minute per user; sliding window. Mirrors the chat
// endpoint's limiter since both call the same OpenAI account.

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

// ─── Domain knowledge & prompts ───────────────────────────────────────────────

const MAX_PROBLEM_CHARS = 8_000;
const MAX_CONTEXT_CHARS = 8_000;

interface SolverDomainInfo {
  name: string;
  systemPrompt: string;
}

const SOLVER_DOMAINS: Record<string, SolverDomainInfo> = {
  konstruksi: {
    name: "Teknik Konstruksi",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Teknik Konstruksi (struktur, arsitektur, MEP, jalan, jembatan).
Keahlian utama: perhitungan struktur & dimensi elemen, estimasi biaya & RAB, metode pelaksanaan konstruksi, analisis beban & gempa, desain pondasi & tanah, spesifikasi material & mutu beton/baja.
Gunakan standar SNI (SNI 1726 gempa, SNI 2847 beton, SNI 1729 baja) dan praktik rekayasa konstruksi Indonesia yang berlaku.`,
  },
  energi: {
    name: "Ketenagalistrikan & EBT",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Ketenagalistrikan & Energi Baru Terbarukan (PLTS, PLTB, PLTA, transmisi, distribusi).
Keahlian utama: desain sistem PLTS rooftop & utility, perhitungan kapasitas pembangkit, analisis jaringan distribusi, studi kelayakan proyek EBT, perizinan SLO & IUPTL, optimasi bauran energi.
Gunakan regulasi Perpres 112/2022, Permen ESDM, PUIL, dan SNI kelistrikan yang berlaku di Indonesia.`,
  },
  migas: {
    name: "Migas & Pertambangan",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Migas & Pertambangan (eksplorasi, produksi, pipeline, K3 migas).
Keahlian utama: analisis cadangan & produksi, desain fasilitas produksi migas, perizinan IUP & IUPK, studi kelayakan tambang, manajemen K3 migas, kontrak PSC & bagi hasil.
Gunakan UU No. 22/2001 (Migas), UU No. 3/2020 (Minerba), dan standar industri migas/pertambangan Indonesia.`,
  },
  tender: {
    name: "Tender & Pengadaan",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Tender & Pengadaan (LPSE, dokumen tender, evaluasi, kontrak).
Keahlian utama: strategi penawaran harga tender, penyusunan dokumen teknis tender, evaluasi & analisis penawaran, kualifikasi & SBU perusahaan, kontrak FIDIC & pemerintah, klaim & sengketa konstruksi.
Gunakan regulasi Perpres 16/2018 jo. perubahannya tentang Pengadaan Barang/Jasa Pemerintah dan praktik LPSE/SPSE.`,
  },
  perijinan: {
    name: "Perijinan & Regulasi",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Perijinan & Regulasi konstruksi (PBG, SLF, AMDAL, SBU, SKK, OSS).
Keahlian utama: pengurusan PBG & SLF, sertifikasi SBU & SKK, dokumen AMDAL & UKL-UPL, perizinan OSS & DPMPTSP, regulasi UU Cipta Kerja, sertifikasi profesi keteknikan.
Gunakan PP 16/2021 (PBG/SLF), PP 22/2021 (AMDAL), dan regulasi turunan UU Cipta Kerja yang berlaku.`,
  },
  manajemen: {
    name: "Manajemen Proyek",
    systemPrompt: `Kamu adalah AI Solver KonstruksiAI untuk domain Manajemen Proyek konstruksi (perencanaan, pengendalian, SDM, keuangan).
Keahlian utama: penyusunan WBS & jadwal proyek, pengendalian biaya & cashflow, manajemen risiko proyek, koordinasi multi-disiplin, laporan & dokumentasi proyek, manajemen subkontraktor.
Gunakan praktik manajemen proyek konstruksi standar (PMBOK, kurva-S, critical path method) yang relevan dengan konteks proyek di Indonesia.`,
  },
};

const OUTPUT_FORMAT_LABELS: Record<string, string> = {
  laporan: "Laporan Teknis Terstruktur",
  checklist: "Checklist Verifikasi",
  tabel: "Tabel & Data Terstruktur",
  panduan: "Panduan Langkah demi Langkah",
};

const OUTPUT_FORMAT_INSTRUCTIONS: Record<string, string> = {
  laporan: "Tulis 'solution' sebagai laporan naratif terstruktur dengan sub-heading Markdown (##) dan bullet point.",
  checklist: "Tulis 'solution' sebagai daftar checklist Markdown menggunakan format '- [ ] item' untuk setiap poin verifikasi.",
  tabel: "Tulis 'solution' menggunakan tabel Markdown (baris header dan data dengan format '| kolom1 | kolom2 |') jika data cocok disajikan tabular.",
  panduan: "Tulis 'solution' sebagai langkah-langkah bernomor yang jelas dan berurutan (1., 2., 3., dst).",
};

function getResolvedOutputType(outputType: unknown): string {
  return typeof outputType === "string" && Object.prototype.hasOwnProperty.call(OUTPUT_FORMAT_LABELS, outputType)
    ? outputType
    : "laporan";
}

function buildSystemPrompt(domainPrompt: string, outputType: string): string {
  return `${domainPrompt}

Tugasmu adalah menganalisis permasalahan teknis yang diberikan pengguna dan menyusun solusi konkret. Jika informasi pengguna kurang untuk jawaban pasti, nyatakan asumsi yang kamu ambil di dalam analisis — jangan menolak menjawab.

${OUTPUT_FORMAT_INSTRUCTIONS[outputType]}

Kembalikan HANYA objek JSON valid (tanpa teks lain di luar JSON) dengan struktur persis berikut:
{
  "approach": string,      // judul singkat pendekatan/metode penyelesaian (maks 1 kalimat)
  "analysis": string,      // analisis permasalahan, format Markdown (heading ##, bullet, bold)
  "solution": string,      // solusi & rekomendasi detail, format Markdown sesuai instruksi format output di atas
  "regulations": string[], // daftar regulasi/standar Indonesia yang relevan (SNI, UU, PP, Permen, dst), masing-masing satu kalimat singkat
  "nextSteps": string[]    // daftar langkah tindak lanjut konkret, urut berdasarkan prioritas
}
Jawab dalam Bahasa Indonesia.`;
}

interface SolverAIResult {
  approach: string;
  analysis: string;
  solution: string;
  regulations: string[];
  nextSteps: string[];
}

function validateSolverResult(parsed: unknown): SolverAIResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  const { approach, analysis, solution } = obj;
  if (typeof approach !== "string" || !approach.trim()) return null;
  if (typeof analysis !== "string" || !analysis.trim()) return null;
  if (typeof solution !== "string" || !solution.trim()) return null;
  const regulations = Array.isArray(obj.regulations)
    ? obj.regulations.filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    : [];
  const nextSteps = Array.isArray(obj.nextSteps)
    ? obj.nextSteps.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];
  return { approach: approach.trim(), analysis: analysis.trim(), solution: solution.trim(), regulations, nextSteps };
}

// ─── Solver endpoint ───────────────────────────────────────────────────────────

router.post("/solver/generate", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  if (!checkRateLimit(session.userId)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi." });
    return;
  }

  try {
    const { domain, problem, context, outputType } = req.body as {
      domain?: string;
      problem?: string;
      context?: string;
      outputType?: string;
    };

    if (typeof domain !== "string" || !Object.prototype.hasOwnProperty.call(SOLVER_DOMAINS, domain)) {
      res.status(400).json({ error: "Domain tidak valid." });
      return;
    }
    if (typeof problem !== "string" || !problem.trim()) {
      res.status(400).json({ error: "Deskripsi masalah wajib diisi." });
      return;
    }
    if (problem.length > MAX_PROBLEM_CHARS) {
      res.status(400).json({ error: `Deskripsi masalah tidak boleh melebihi ${MAX_PROBLEM_CHARS} karakter.` });
      return;
    }
    const trimmedContext = typeof context === "string" ? context : "";
    if (trimmedContext.length > MAX_CONTEXT_CHARS) {
      res.status(400).json({ error: `Konteks tambahan tidak boleh melebihi ${MAX_CONTEXT_CHARS} karakter.` });
      return;
    }

    const resolvedOutputType = getResolvedOutputType(outputType);
    const domainInfo = SOLVER_DOMAINS[domain]!;
    const systemPrompt = buildSystemPrompt(domainInfo.systemPrompt, resolvedOutputType);

    const userContent = [
      `Permasalahan: ${problem.trim()}`,
      trimmedContext.trim() ? `Konteks tambahan: ${trimmedContext.trim()}` : null,
    ].filter((part): part is string => Boolean(part)).join("\n\n");

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
            { role: "system", content: systemPrompt },
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

    const result = validateSolverResult(parsed);
    if (!result) {
      throw new Error("AI mengembalikan struktur data yang tidak lengkap. Silakan coba lagi.");
    }

    res.json({
      problem: problem.trim(),
      domain: domainInfo.name,
      approach: result.approach,
      analysis: result.analysis,
      solution: result.solution,
      regulations: result.regulations,
      nextSteps: result.nextSteps,
      outputFormat: OUTPUT_FORMAT_LABELS[resolvedOutputType],
    });
  } catch (err) {
    req.log.error({ err }, "POST /solver/generate error");
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: errMsg });
  }
});

export default router;
