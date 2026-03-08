import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/agents";

// ============================================================
// Chat API Route — KonstruksiAI
// Supports: simulated responses (default) + real LLM (when API key set)
// ============================================================

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  agentId?: string;
  businessId?: string;
  columnId?: string;
}

export interface ChatResponse {
  message: string;
  agentName?: string;
  error?: string;
}

// ============================================================
// SIMULATED AI RESPONSES (fallback when no API key)
// ============================================================

function generateSimulatedResponse(
  userMessage: string,
  agentSystemPrompt: string,
  agentName: string
): string {
  const msg = userMessage.toLowerCase();

  // Detect task type from message
  if (msg.includes("rab") || msg.includes("rencana anggaran") || msg.includes("estimasi biaya")) {
    return `Sebagai ${agentName}, saya akan membantu menyusun RAB untuk Anda.

**Struktur RAB yang akan saya buat:**

| No | Uraian Pekerjaan | Volume | Satuan | Harga Satuan | Total |
|----|-----------------|--------|--------|--------------|-------|
| 1 | Pekerjaan Persiapan | 1 | Ls | Rp 50.000.000 | Rp 50.000.000 |
| 2 | Pekerjaan Tanah | 500 | m³ | Rp 150.000 | Rp 75.000.000 |
| 3 | Pekerjaan Pondasi | 200 | m³ | Rp 1.200.000 | Rp 240.000.000 |
| 4 | Pekerjaan Struktur | 800 | m³ | Rp 2.500.000 | Rp 2.000.000.000 |
| 5 | Pekerjaan Arsitektur | 1.000 | m² | Rp 1.500.000 | Rp 1.500.000.000 |
| 6 | Pekerjaan MEP | 1 | Ls | Rp 800.000.000 | Rp 800.000.000 |

**Total Biaya Langsung: Rp 4.665.000.000**
**Overhead & Profit (12%): Rp 559.800.000**
**PPN (11%): Rp 575.148.000**
**TOTAL RAB: Rp 5.799.948.000**

*Catatan: Ini adalah estimasi awal. Untuk RAB yang lebih akurat, mohon berikan gambar teknik dan spesifikasi detail proyek Anda.*

Apakah Anda ingin saya breakdown lebih detail untuk item pekerjaan tertentu?`;
  }

  if (msg.includes("jadwal") || msg.includes("schedule") || msg.includes("timeline")) {
    return `Sebagai ${agentName}, berikut jadwal proyek yang saya rekomendasikan:

**JADWAL PELAKSANAAN PROYEK**

| Fase | Aktivitas | Durasi | Bulan |
|------|-----------|--------|-------|
| 1 | Persiapan & Mobilisasi | 2 minggu | Bulan 1 |
| 2 | Pekerjaan Tanah & Pondasi | 6 minggu | Bulan 1-2 |
| 3 | Struktur Lantai 1-3 | 8 minggu | Bulan 2-4 |
| 4 | Struktur Lantai 4-6 | 8 minggu | Bulan 4-6 |
| 5 | Pekerjaan Arsitektur | 10 minggu | Bulan 5-8 |
| 6 | Pekerjaan MEP | 8 minggu | Bulan 6-9 |
| 7 | Finishing & Komisioning | 4 minggu | Bulan 9-10 |
| 8 | Testing & Serah Terima | 2 minggu | Bulan 10 |

**Total Durasi: 10 Bulan**

**Milestone Kritis:**
- ✅ M1: Selesai pondasi — Bulan 2
- ✅ M2: Selesai struktur — Bulan 6  
- ✅ M3: Selesai MEP — Bulan 9
- ✅ M4: Serah Terima (PHO) — Bulan 10

Apakah Anda ingin saya buat jadwal yang lebih detail dengan critical path?`;
  }

  if (msg.includes("k3") || msg.includes("keselamatan") || msg.includes("safety") || msg.includes("jsa")) {
    return `Sebagai ${agentName}, berikut analisis K3 yang saya siapkan:

**JOB SAFETY ANALYSIS (JSA)**

**Pekerjaan:** Sesuai permintaan Anda
**Tanggal:** ${new Date().toLocaleDateString("id-ID")}

| No | Langkah Kerja | Bahaya | Risiko | Pengendalian | APD |
|----|--------------|--------|--------|--------------|-----|
| 1 | Persiapan area kerja | Benda jatuh | Tinggi | Pasang safety net, barricade | Helm, sepatu safety |
| 2 | Mobilisasi peralatan | Tertabrak alat | Sedang | Pengawas, rambu K3 | Rompi, helm |
| 3 | Pelaksanaan pekerjaan | Jatuh dari ketinggian | Tinggi | Full body harness, scaffolding | Harness, helm |
| 4 | Penyelesaian | Tertimpa material | Sedang | Housekeeping, stacking | Helm, sarung tangan |

**Regulasi yang berlaku:**
- UU No. 1/1970 tentang Keselamatan Kerja
- PP No. 50/2012 tentang SMK3
- Permen Naker No. 9/2016 tentang K3 Pekerjaan Ketinggian

Apakah Anda ingin saya buat HIRARC atau prosedur darurat yang lebih lengkap?`;
  }

  if (msg.includes("kontrak") || msg.includes("perjanjian") || msg.includes("klausul")) {
    return `Sebagai ${agentName}, berikut analisis kontrak yang saya siapkan:

**REVIEW KONTRAK KONSTRUKSI**

**Klausul-klausul yang perlu diperhatikan:**

🔴 **RISIKO TINGGI:**
1. **Klausul Pembayaran** — Pastikan termin pembayaran jelas (DP, progress, retensi)
2. **Klausul Denda** — Denda keterlambatan maksimal 5% dari nilai kontrak (sesuai Perpres 16/2018)
3. **Klausul Force Majeure** — Harus mencakup pandemi, bencana alam, kebijakan pemerintah

🟡 **RISIKO SEDANG:**
4. **Klausul Variasi** — Prosedur persetujuan perubahan pekerjaan
5. **Klausul Klaim** — Batas waktu pengajuan klaim (biasanya 28 hari)
6. **Klausul Garansi** — Masa pemeliharaan dan tanggung jawab

🟢 **REKOMENDASI:**
- Tambahkan klausul eskalasi harga material
- Perjelas definisi "selesai" dan kriteria serah terima
- Pastikan mekanisme penyelesaian sengketa (mediasi → arbitrase)

**Referensi:** FIDIC Red Book 2017, UU No. 2/2017 Jasa Konstruksi

Apakah ada klausul spesifik yang ingin Anda review lebih detail?`;
  }

  if (msg.includes("perijinan") || msg.includes("izin") || msg.includes("pbg") || msg.includes("imb")) {
    return `Sebagai ${agentName}, berikut panduan perijinan yang Anda butuhkan:

**CHECKLIST PERIJINAN KONSTRUKSI**

**1. Persetujuan Bangunan Gedung (PBG)** — Pengganti IMB
*Dasar hukum: PP No. 16/2021, UU Cipta Kerja*

📋 **Persyaratan Teknis:**
- [ ] Gambar arsitektur (denah, tampak, potongan)
- [ ] Gambar struktur + perhitungan
- [ ] Gambar MEP (mekanikal, elektrikal, plumbing)
- [ ] Dokumen AMDAL/UKL-UPL (jika diperlukan)
- [ ] Sertifikat tanah (SHM/HGB)

📋 **Persyaratan Administratif:**
- [ ] KTP pemohon/akta perusahaan
- [ ] NPWP
- [ ] Bukti kepemilikan tanah
- [ ] Surat kuasa (jika dikuasakan)

⏱️ **Estimasi Waktu:** 14-30 hari kerja
💰 **Biaya:** Sesuai Perda setempat (biasanya 0.5-1% dari nilai bangunan)

**Cara Pengajuan:** Melalui sistem OSS (oss.go.id) atau DPMPTSP setempat

Apakah Anda ingin panduan lebih detail untuk jenis bangunan atau lokasi tertentu?`;
  }

  if (msg.includes("tender") || msg.includes("pengadaan") || msg.includes("lelang")) {
    return `Sebagai ${agentName}, berikut panduan tender yang saya siapkan:

**STRATEGI TENDER KONSTRUKSI**

**Analisis Dokumen Tender:**

✅ **Yang harus dicek pertama:**
1. Nilai HPS/OE — tentukan target margin
2. Persyaratan kualifikasi — pastikan perusahaan memenuhi
3. Jadwal tender — pastikan cukup waktu persiapan
4. Metode evaluasi — sistem gugur atau merit point?

**Strategi Penawaran:**

| Komponen | Rekomendasi |
|----------|-------------|
| Harga | 85-95% dari HPS (kompetitif) |
| Teknis | Skor minimal 70/100 |
| Pengalaman | Tampilkan proyek sejenis |
| SDM | Pastikan SKA/SKT sesuai |

**Dokumen yang harus disiapkan:**
- [ ] Penawaran harga (BOQ terisi)
- [ ] Metode pelaksanaan
- [ ] Jadwal pelaksanaan
- [ ] Daftar personil + SKA/SKT
- [ ] Daftar peralatan
- [ ] Dokumen kualifikasi perusahaan

**Regulasi:** Perpres No. 16/2018 jo. Perpres No. 12/2021

Apakah Anda ingin saya bantu analisis dokumen tender spesifik?`;
  }

  // Default response based on agent context
  return `Sebagai **${agentName}**, saya siap membantu Anda.

Berdasarkan pertanyaan Anda: *"${userMessage}"*

Saya dapat membantu Anda dengan:

1. **Analisis & Konsultasi** — Memberikan analisis mendalam berdasarkan keahlian saya
2. **Pembuatan Dokumen** — Menyusun dokumen teknis, laporan, atau template
3. **Panduan Regulasi** — Menjelaskan regulasi Indonesia yang berlaku
4. **Rekomendasi Praktis** — Solusi yang bisa langsung diterapkan

**Untuk hasil yang lebih optimal, coba berikan:**
- Detail spesifik proyek (lokasi, skala, nilai)
- Konteks atau latar belakang masalah
- Output yang Anda harapkan (laporan, checklist, template, dll.)

Contoh pertanyaan yang bisa Anda ajukan:
- *"Buatkan RAB untuk proyek [deskripsi]"*
- *"Buat jadwal proyek untuk [deskripsi]"*
- *"Analisis risiko untuk [deskripsi]"*
- *"Checklist perijinan untuk [deskripsi]"*

Silakan berikan detail lebih lanjut dan saya akan segera mengerjakan tugas Anda! 🚀`;
}

// ============================================================
// MAIN API HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, agentId, businessId, columnId } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get agent context
    let agentSystemPrompt = `Anda adalah KonstruksiAI, asisten AI profesional untuk industri konstruksi dan engineering Indonesia. 
Anda memiliki keahlian mendalam dalam teknik konstruksi, energi, migas, tender, manajemen bisnis, dan perijinan.
Selalu berikan jawaban dalam bahasa Indonesia yang profesional dan terstruktur.`;
    
    let agentName = "KonstruksiAI";

    const resolvedId = agentId || (businessId && columnId ? `${businessId}-${columnId}` : null);
    
    if (resolvedId) {
      const agent = getAgent(
        resolvedId.split("-")[0],
        resolvedId.split("-").slice(1).join("-")
      );
      if (agent) {
        agentSystemPrompt = agent.systemPrompt;
        agentName = agent.name;
      }
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // ============================================================
    // TRY REAL LLM API (if API key is configured)
    // ============================================================
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    // Try OpenAI
    if (openaiApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: agentSystemPrompt },
              ...messages.slice(-10), // Last 10 messages for context
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: data.choices[0]?.message?.content || "Maaf, tidak ada respons.",
            agentName,
          });
        }
      } catch {
        console.error("OpenAI API error, falling back to simulation");
      }
    }

    // Try Anthropic Claude
    if (anthropicApiKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            system: agentSystemPrompt,
            messages: messages
              .filter(m => m.role !== "system")
              .slice(-10)
              .map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: data.content[0]?.text || "Maaf, tidak ada respons.",
            agentName,
          });
        }
      } catch {
        console.error("Anthropic API error, falling back to simulation");
      }
    }

    // Try Google Gemini
    if (geminiApiKey) {
      try {
        const geminiMessages = messages
          .filter(m => m.role !== "system")
          .slice(-10)
          .map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: agentSystemPrompt }] },
              contents: geminiMessages,
              generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: data.candidates[0]?.content?.parts[0]?.text || "Maaf, tidak ada respons.",
            agentName,
          });
        }
      } catch {
        console.error("Gemini API error, falling back to simulation");
      }
    }

    // Try Groq (fast & free tier available)
    if (groqApiKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: agentSystemPrompt },
              ...messages.slice(-10),
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: data.choices[0]?.message?.content || "Maaf, tidak ada respons.",
            agentName,
          });
        }
      } catch {
        console.error("Groq API error, falling back to simulation");
      }
    }

    // ============================================================
    // FALLBACK: Simulated Response
    // ============================================================
    const simulatedResponse = generateSimulatedResponse(
      lastUserMessage,
      agentSystemPrompt,
      agentName
    );

    return NextResponse.json({
      message: simulatedResponse,
      agentName,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
