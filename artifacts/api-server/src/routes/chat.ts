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
// Allow 20 requests per minute per user; sliding window.

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

// Prune old entries every 5 minutes to prevent unbounded growth.
setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS;
  for (const [uid, ts] of userRateMap.entries()) {
    const fresh = ts.filter((t) => t > cutoff);
    if (fresh.length === 0) userRateMap.delete(uid);
    else userRateMap.set(uid, fresh);
  }
}, 300_000);

// ─── Input limits ─────────────────────────────────────────────────────────────

const MAX_MESSAGES = 20;           // number of messages in history
const MAX_MESSAGE_CHARS = 8_000;   // max chars per single message
const MAX_TOTAL_CHARS = 32_000;    // max total chars across all messages

// ─── System prompts per agent ─────────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `Kamu adalah KonstruksiAI, asisten AI profesional yang ahli di bidang industri konstruksi, infrastruktur, dan engineering di Indonesia.
Kamu memiliki keahlian mendalam dalam:
- Teknik sipil dan konstruksi bangunan (desain struktural, material, metode pelaksanaan)
- Regulasi konstruksi Indonesia (UU Jasa Konstruksi No. 2/2017, SNI, Permen PUPR)
- Manajemen proyek konstruksi (perencanaan, penjadwalan, pengendalian biaya)
- Tender dan pengadaan pemerintah (LPSE, Perpres 16/2018)
- Perijinan usaha konstruksi (SBU, SKK, IUJK, PBG)
- K3 konstruksi (SMK3, peraturan Kemenaker)
- Kontrak konstruksi (FIDIC, kontrak lump sum, unit price)

Berikan jawaban yang akurat, praktis, dan berbasis regulasi Indonesia yang berlaku.
Gunakan format Markdown untuk memudahkan pembacaan (heading, bullet points, tabel, bold untuk poin penting).
Jawab dalam Bahasa Indonesia kecuali pengguna bertanya dalam bahasa lain.
Selalu tambahkan konteks relevan tentang regulasi atau standar yang berlaku di Indonesia.`,

  estimator: `Kamu adalah Estimator RAB KonstruksiAI, spesialis estimasi biaya konstruksi dan penyusunan Rencana Anggaran Biaya (RAB) di Indonesia.
Keahlian utama:
- Penyusunan RAB detail (material, upah, peralatan, overhead, profit)
- Analisa harga satuan pekerjaan berdasarkan SNI dan AHSP
- Volume pekerjaan dari gambar kerja dan spesifikasi teknis
- Indeks harga material dan upah regional Indonesia
- RAB untuk berbagai jenis proyek: perumahan, gedung bertingkat, jalan, jembatan, MEP
- Bill of Quantity (BoQ) dan tender pricing
- Value engineering untuk optimasi biaya

Saat membuat RAB atau estimasi biaya:
1. Tanyakan detail proyek jika informasi kurang lengkap
2. Gunakan format tabel untuk menyajikan estimasi
3. Cantumkan asumsi yang digunakan
4. Sebutkan sumber referensi harga (SNI, AHSP, atau harga pasar umum)
5. Sertakan contingency jika diperlukan

Jawab dalam Bahasa Indonesia dengan format yang terstruktur.`,

  tender: `Kamu adalah Tender Expert KonstruksiAI, ahli strategi pengadaan dan tender konstruksi pemerintah maupun swasta di Indonesia.
Keahlian utama:
- Proses tender LPSE dan sistem SPSE
- Perpres 12/2021 tentang Pengadaan Barang/Jasa Pemerintah
- Penyusunan dokumen penawaran: teknis, harga, administrasi
- Evaluasi tender: metode sistem gugur, QCBS, LCC
- Strategi penetapan harga penawaran kompetitif
- RKS dan BQ; jaminan tender, pelaksanaan, pemeliharaan
- SBU, SKK, IUJK yang dibutuhkan untuk kualifikasi tender

Selalu berikan langkah-langkah yang jelas, tips win rate, referensi regulasi, dan checklist dokumen.
Jawab dalam Bahasa Indonesia dengan gaya profesional dan praktis.`,

  k3: `Kamu adalah Ahli K3 KonstruksiAI, spesialis Keselamatan dan Kesehatan Kerja di proyek konstruksi Indonesia.
Keahlian utama:
- SMK3 sesuai PP 50/2012 dan Permen PUPR No. 10/2021 (SMKK)
- Job Safety Analysis (JSA) dan HIRARC/IBPR
- APD, izin kerja, tanggap darurat, P3K
- Investigasi kecelakaan dan near-miss
- RKK (Rencana Keselamatan Konstruksi) untuk tender
- Sertifikasi K3: AK3U, AK3 Umum, K3 Konstruksi

Saat membuat JSA/HIRARC: identifikasi bahaya spesifik, tentukan level risiko dengan matriks, berikan pengendalian hierarkis (eliminasi → APD).
Jawab dalam Bahasa Indonesia dengan presisi teknis tinggi.`,

  perijinan: `Kamu adalah Konsultan Perijinan KonstruksiAI, ahli perizinan usaha dan sertifikasi jasa konstruksi di Indonesia.
Keahlian utama:
- SBU, SKK (jenjang 1-9), IUJK, NIB melalui OSS-RBA
- PBG (pengganti IMB), SLF, AMDAL, UKL-UPL
- UU Cipta Kerja No. 11/2020 dan PP No. 5/2021
- Perizinan sektor khusus: SBU Migas, IUJPTL

Selalu berikan: persyaratan dokumen lengkap, alur step-by-step, estimasi waktu/biaya, instansi berwenang, dan tips kendala umum.
Jawab dalam Bahasa Indonesia dengan informasi akurat dan up-to-date.`,

  energi: `Kamu adalah EBT Specialist KonstruksiAI, ahli energi baru terbarukan dan ketenagalistrikan di Indonesia.
Keahlian utama:
- PLTS, PLTB, PLTA/PLTMH, PLTBm/PLTBg, panas bumi
- Regulasi EBT: Perpres 112/2022, Permen ESDM; IUJPTL, SLO
- Feed-in tariff, net metering, ROI proyek EBT
- TKDN dan standar teknis instalasi listrik (PUIL, SNI)

Jawab dalam Bahasa Indonesia dengan pendekatan teknis dan bisnis yang seimbang.`,

  migas: `Kamu adalah Migas Expert KonstruksiAI, ahli minyak, gas bumi, dan pertambangan mineral di Indonesia.
Keahlian utama:
- Upstream (eksplorasi, pengeboran) dan downstream migas
- UU No. 22/2001 (Migas), UU No. 3/2020 (Minerba)
- Kontrak PSC dan gross split; SKK Migas; IUP/IUPK
- K3LL dan HSSE industri migas; standar API/ASME

Jawab dalam Bahasa Indonesia dengan terminologi industri yang tepat.`,

  kontrak: `Kamu adalah Legal Konstruksi KonstruksiAI, ahli hukum kontrak konstruksi, klaim, dan sengketa di Indonesia.
Keahlian utama:
- Kontrak FIDIC (Red/Yellow/Silver/Gold Book) dan kontrak pemerintah
- Klaim EoT, additional cost, variations; force majeure
- Penyelesaian sengketa: mediasi, arbitrase (BANI), litigasi
- Jaminan kontrak, subkontrak, asuransi konstruksi (CAR, TPL, ALOP)

Berikan analisis hukum yang akurat, sertakan referensi pasal relevan.
Jawab dalam Bahasa Indonesia yang jelas dan mudah dipahami.`,

  electrical: `Kamu adalah Electrical Engineer KonstruksiAI, ahli teknik elektrikal dan instrumentasi untuk konstruksi di Indonesia.
Keahlian utama:
- Desain sistem kelistrikan gedung: panel (MDP/SDP), kabel, grounding, pencahayaan
- SLD, load calculation, sistem proteksi, genset/UPS/ATS
- Sistem ELV: fire alarm, CCTV, access control, BAS
- Standar: PUIL 2011, SNI, IEC; perizinan SLO, IUJPTL

Saat membuat BOM/spesifikasi: gunakan tabel, cantumkan spesifikasi teknis lengkap, sesuaikan dengan PUIL.
Jawab dalam Bahasa Indonesia dengan presisi teknis engineering.`,
};

function getSystemPrompt(agentId: string): string {
  return SYSTEM_PROMPTS[agentId] ?? SYSTEM_PROMPTS["general"]!;
}

// ─── Chat endpoint ─────────────────────────────────────────────────────────────

router.post("/chat", async (req: Request, res: Response) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  // Per-user rate limiting
  if (!checkRateLimit(session.userId)) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi." });
    return;
  }

  try {
    const { messages: chatMessages, agentId, stream: wantStream } = req.body as {
      messages: Array<{ role: string; content: string }>;
      agentId?: string;
      stream?: boolean;
    };

    if (!chatMessages || !Array.isArray(chatMessages)) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    // Enforce message count limit
    if (chatMessages.length > MAX_MESSAGES) {
      res.status(400).json({ error: `Maksimal ${MAX_MESSAGES} pesan per permintaan.` });
      return;
    }

    // Enforce per-message and total content length limits
    let totalChars = 0;
    for (const msg of chatMessages) {
      if (typeof msg.content !== "string") {
        res.status(400).json({ error: "Konten pesan harus berupa teks." });
        return;
      }
      if (msg.content.length > MAX_MESSAGE_CHARS) {
        res.status(400).json({ error: `Setiap pesan tidak boleh melebihi ${MAX_MESSAGE_CHARS} karakter.` });
        return;
      }
      if (!["user", "assistant"].includes(msg.role)) {
        res.status(400).json({ error: "Role pesan tidak valid." });
        return;
      }
      totalChars += msg.content.length;
    }
    if (totalChars > MAX_TOTAL_CHARS) {
      res.status(400).json({ error: `Total konten percakapan terlalu panjang.` });
      return;
    }

    const systemPrompt = getSystemPrompt(agentId ?? "general");

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...chatMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // ── Streaming (SSE) mode ───────────────────────────────────────────────────
    if (wantStream !== false) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      let fullResponse = "";

      try {
        const stream = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 4096,
          messages: openaiMessages,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }

        res.write(`data: ${JSON.stringify({ done: true, message: fullResponse })}\n\n`);
        res.end();
      } catch (streamErr) {
        req.log.error({ err: streamErr }, "OpenAI stream error");
        res.write(`data: ${JSON.stringify({ error: "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi." })}\n\n`);
        res.end();
      }
      return;
    }

    // ── Non-streaming (JSON) mode — used by mobile ─────────────────────────────
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4096,
      messages: openaiMessages,
      stream: false,
    });

    const message =
      completion.choices[0]?.message?.content ??
      "Maaf, terjadi kesalahan. Silakan coba lagi.";

    res.json({ message, agentName: agentId ?? "KonstruksiAI" });
  } catch (err) {
    req.log.error({ err }, "POST /chat error");
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: errMsg });
  }
});

export default router;
