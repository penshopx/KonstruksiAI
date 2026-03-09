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
  agentName: string,
  conversationHistory: ChatMessage[] = []
): string {
  // Build context from conversation history for follow-up responses
  const hasHistory = conversationHistory.length > 1;
  const isFollowUp = hasHistory &&
    !userMessage.toLowerCase().match(/^(halo|hai|hi|hello|apa kabar|selamat)/);
  
  let contextHint = "";
  if (isFollowUp && conversationHistory.length >= 2) {
    // Get the last 2 exchanges for context
    const recentHistory = conversationHistory.slice(-4, -1);
    const topic = recentHistory.map(m => m.content).join(" ").toLowerCase();
    
    if (topic.includes("rab") || topic.includes("biaya") || topic.includes("harga")) {
      contextHint = "[Ini pertanyaan lanjutan tentang RAB/biaya] ";
    } else if (topic.includes("tender") || topic.includes("lpse")) {
      contextHint = "[Ini pertanyaan lanjutan tentang tender] ";
    } else if (topic.includes("sertifikat") || topic.includes("sbu") || topic.includes("skk")) {
      contextHint = "[Ini pertanyaan lanjutan tentang sertifikasi] ";
    } else if (topic.includes("plts") || topic.includes("panel surya") || topic.includes("ebt")) {
      contextHint = "[Ini pertanyaan lanjutan tentang energi terbarukan] ";
    } else if (topic.includes("listrik") || topic.includes("panel") || topic.includes("electrical") || topic.includes("elektrikal")) {
      contextHint = "[Ini pertanyaan lanjutan tentang instalasi listrik] ";
    }
  }
  const msg = (contextHint + userMessage).toLowerCase();

  // Detect if user wants electrical engineer consultation
  if (msg.includes("consult") || msg.includes("expert") || msg.includes("30 tahun") || 
      msg.includes("deep dive") || msg.includes("konsultasi") || msg.includes("ahli listrik")) {
    return `👋 Halo! Saya adalah Electrical Engineer AI dengan 30 tahun pengalaman di bidang engineering. Bagaimana saya bisa membantu Anda hari ini?

Silakan ceritakan masalah atau tantangan engineering yang Anda hadapi. Saya akan:
1. Mendengarkan secara aktif
2. Mengajukan pertanyaan mendalam untuk memahami konteks
3. Menganalisis dari berbagai perspektif
4. Memberikan solusi yang actionable berdasarkan pengalaman 30 tahun saya

Apa yang ingin Anda diskusikan?`;
  }

  // Detect task type from message

  // === ELEKTRICAL ENGINEERING DOCUMENTS ===
  if (msg.includes("bom") || msg.includes("bill of material") || msg.includes("daftar material") || 
      (msg.includes("instalasi listrik") && msg.includes("material")) || (msg.includes("listrik") && msg.includes("material"))) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut Bill of Materials (BOM) untuk instalasi listrik:\n\n**BILL OF MATERIALS - INSTALASI LISTRIK GEDUNG**\n\n| No | Material | Spesifikasi | Satuan | Qty | Estimasi Harga |\n|----|----------|-------------|--------|-----|----------------|\n| 1 | Kabel NYM | 3x2.5 mm2 | m | 500 | Rp 275.000 |\n| 2 | Kabel NYM | 3x4 mm2 | m | 300 | Rp 198.000 |\n| 3 | Kabel NYY | 4x16 mm2 | m | 100 | Rp 330.000 |\n| 4 | Pipe Conduit | PVC 20mm | m | 400 | Rp 160.000 |\n| 5 | Box Panel | 40x60x20cm | unit | 4 | Rp 880.000 |\n| 6 | MCB | 20A 1P | pcs | 20 | Rp 280.000 |\n| 7 | MCB | 32A 1P | pcs | 10 | Rp 210.000 |\n| 8 | RCCB | 40A 30mA 2P | pcs | 4 | Rp 520.000 |\n| 9 | Stop Kontak | In bowa 5/6 | pcs | 40 | Rp 400.000 |\n| 10 | Lampu LED | 18W | pcs | 50 | Rp 350.000 |\n\n**RINGKASAN:**\n- Total Material: sekitar Rp 4.053.000\n- Upah Instalasi: sekitar Rp 2.500.000\n- Total Estimasi: sekitar Rp 6.553.000\n\nIngin saya buatkan detail yang lebih spesifik untuk proyek Anda?`;
  }

  if (msg.includes("risk assessment") || msg.includes("penilaian risiko") || msg.includes("analisa risiko") || msg.includes("hazard")) {
    return `👋 Saya Electrical Engineer dengan 30 tahun pengalaman. Berikut Dokumen Penilaian Risiko Komensif untuk pekerjaan instalasi listrik:\n\n**DOKUMEN PENILAIAN RISIKO ELEKTRIKAL**\n\n**1. RUANG LINGKUP**\n- Instalasi sistem distribusi listrik\n- Pemasangan panel distribusi dan switchgear\n- Pekerjaan kabel dan wiring\n- Instalasi sistem proteksi petir\n- Pekerjaan commissioning dan testing\n\n**2. MATRIKS PENILAIAN RISIKO**\n\n| Level | Probabilitas | Dampak | Skor |\n|-------|--------------|--------|------|\n| 1 | Rare/Tidak mungkin | Insignifikan | 1-2 |\n| 2 | Unlikely | Minor | 3-4 |\n| 3 | Possible | Moderate | 5-6 |\n| 4 | Likely | Major | 7-8 |\n| 5 | Almost Certain | Catastrophic | 9-10 |\n\n**3. IDENTIFIKASI BAHAYA UTAMA**\n\n| No | Hazards | Risiko | Skor | Status |\n|----|---------|--------|------|--------|\n| 3.1 | Kontak langsung konduktor bertegangan | Sengatan, henti jantung | 20 | 🔴 HIGH |\n| 3.2 | Arc flash | Luka bakar termal | 15 | 🟠 MEDIUM |\n| 3.3 | Short circuit | Kebakaran, ledakan | 12 | 🟠 MEDIUM |\n| 3.4 | Pekerjaan di ketinggian | Jatuh | 25 | 🔴 HIGH |\n| 3.5 | Overload | Kebakaran | 12 | 🟠 MEDIUM |\n\n**4. KONTROL MITIGASI**\n\n✓ LOTO (Lockout-Tagout) sebelum pekerjaan\n✓ APD lengkap (insulated gloves, face shield, arc-rated clothing)\n✓ Pengamanan area kerja dengan warning signs\n✓ Sertifikasi kompetensi teknisi\n✓ Prosedur permit-to-work\n\n**5. KONTROL RISIKO (Hirarki NFPA 70E)**\n\n1. **Eliminasi** - Menghilangkan bahaya sepenuhnya\n2. **Substitusi** - Alternatif lebih aman\n3. **Engineering Controls** - Isolasi, remote operation\n4. **Administrative Controls** - Prosedur, permit, training\n5. **APD** - Last line of defense\n\n**6. JADWAL PEMELIHARAAN**\n\n| Aktivitas | Frekuensi |\n|-----------|-----------|\n| Inspeksi APD | Sebelum penggunaan |\n| Test insulated tools | Setiap 6 bulan |\n| Verifikasi grounding | Setiap 1 tahun |\n| Emergency drill | Setiap 6 bulan |\n\n**Referensi:**\n- Permenaker No. 5/2018 tentang K3 Listrik\n- PUIL 2011 Section 4\n- NFPA 70E:2021\n- ISO 31000:2018\n\nIngin saya buatkan dokumen lengkap Risk Assessment dalam format Word/PDF?`;
  }

  if (msg.includes("safety procedure") || msg.includes("prosedur keselamatan") || msg.includes("prosedur k3")) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut Prosedur Keselamatan Kerja untuk pekerjaan instalasi listrik:\n\n**PROSEDUR KESELAMATAN KERJA - Instalasi Sistem Kelistrikan**\n\n1. PERSYARATAN SEBELUM KERJA\n\nPersyaratan Personel:\n- Sertifikat Kompetensi Listrik (AK/AT)\n- Pelatihan K3 Listrik\n- Medical check-up lulus\n\nPersyaratan Peralatan:\n- Alat ukur teruji (multimeter, earth resistance)\n- PPE lengkap (helm, sarung tangan isolat, shoes)\n- Tools insulated\n\n2. PROSEDUR LOTO (Lock Out Tag Out)\n\n1. Notification - Beritahu semua pihak terkait\n2. Preparation - Siapkan tools & dokumentasi\n3. Shutdown - Matikan peralatan\n4. Isolation - Pisahkan sumber listrik\n5. Locking - Kunci switchgear\n6. Verification - Tes dengan voltage detector\n\n3. PROSEDUR EMERGENCY\n\n| Situasi | Tindakan |\n|---------|----------|\n| Sengatan listrik | Matikan sumber, CPR, RS |\n| Kebakaran listrik | Padamkan dengan CO2, MCB |\n\n**Kontak Darurat:**\n- Safety Officer: [isi nomor]\n- Rumah Sakit Terdekat: [isi nomor]\n- PLN Emergency: 123\n\nIngin saya buatkan dokumen lengkap Prosedur K3?`;
  }

  if (msg.includes("design spec") || msg.includes("spesifikasi teknis") || msg.includes("specification")) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut Spesifikasi Teknis Desain Instalasi Listrik:\n\n**SPESIFIKASI TEKNIS INSTALASI LISTRIK - Gedung Komersial 5 Lantai**\n\n1. DAYA LISTRIK\n\n| Parameter | Spesifikasi |\n|-----------|-------------|\n| Sumber Utama | PLN 1977 kVA |\n| Backup | Genset 1000 kVA |\n| Beban Terpasang | 1500 kW |\n| Diversitas | 0.8 |\n| Beban Terhitung | 1200 kW |\n\n2. SISTEM DISTRIBUSI\n\nPLN 1977 kVA -> TR 20kV/400V 2500kVA -> Main CB 2500A -> MDP Lantai 1-5 -> Panel-Panel\n\n3. KABEL & PROTEKSI\n\n| Circuit | Kabel | MCB | RCCB |\n|--------|-------|-----|------|\n| Lighting | NYM 3x2.5mm2 | 16A | 40A/30mA |\n| Socket | NYM 3x4mm2 | 20A | 40A/30mA |\n| AC | NYM 3x6mm2 | 32A | 40A/30mA |\n\n4. STANDAR RUJUKAN\n\n- PUIL 2011\n- SPLN S3.001-1:2019\n- SNI IEC 60364\n- NFPA 70\n\nIngin saya buatkan dokumen lengkap Electrical Design?`;
  }

  if (msg.includes("circuit diagram") || msg.includes("single line") || msg.includes("sld") || msg.includes("diagram")) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut contoh Single Line Diagram:\n\n**SINGLE LINE DIAGRAM**\nSistem Distribusi Listrik Gedung\n\n[DIAGRAM]\nPLN 20kV (1977kVA) -> TR 20kV/400V 2500kVA -> Main CB 2500A -> MDP Lantai 1-5 -> Panel-Panel\n\nKOMPONEN UTAMA:\n| Simbol | Komponen | Spesifikasi |\n|--------|----------|-------------|\n| TR | Transformator | 2500kVA, 20kV/400V |\n| MV | Main Circuit Breaker | 2500A, 36kA |\n| MDP | Panel Distribusi | 630A, IP54 |\n\nIngin saya buatkan diagram detail untuk proyek spesifik Anda?`;
  }

  if (msg.includes("maintenance schedule") || msg.includes("jadwal pemeliharaan") || msg.includes("preventive maintenance")) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut Preventive Maintenance Schedule untuk instalasi listrik:\n\n**JADWAL PEMELIHARAAN PREVENTIF - Sistem Kelistrikan Gedung**\n\n| Aktivitas | Frekuensi | Deskripsi |\n|-----------|-----------|-----------|\n| **Panel Listrik** | | |\n| Inspeksi visual | Mingguan | Cek kerusakan, kebocoran |\n| Pengencangan terminasi | Bulanan | Cek kekencangan kabel |\n| Termografi | Triwulanan | Deteksi hot spot |\n| Load test | Tahunan | Test under load |\n| **Kabel & Instalasi** | | |\n| Inspeksi visual | Bulanan | Cek kondisi kabel |\n| Earth resistance test | Semesteran | Test grounding |\n| Insulation resistance | Tahunan | Megger test |\n| **Proteksi** | | |\n| Test RCCB | Bulanan | Test tombol trip |\n| Test MCB | Semesteran | Test karakteristik |\n| Test proteksi petir | Tahunan | Inspection SPD |\n\nIngin saya buatkan template checklist lengkap?`;
  }

  if (msg.includes("test report") || msg.includes("laporan pengujian") || msg.includes("commissioning")) {
    return `Sebagai Electrical Engineer dengan 30 tahun pengalaman, berikut format Laporan Pengujian Instalasi Listrik:\n\n**LAPORAN PENGUJIAN INSTALASI LISTRIK**\n\n1. DATA PROYEK\n\n| Field | Isian |\n|-------|-------|\n| Nama Proyek | [isi] |\n| Alamat | [isi] |\n| Tanggal Pengujian | [isi] |\n| Penyedia Jasa | [isi] |\n\n2. HASIL PENGUJIAN\n\nA. Pengujian Tahanan Isolasi\n\n| Circuit | L-N (MOhm) | L-G (MOhm) | N-G (MOhm) | Status |\n|--------|------------|------------|------------|--------|\n| Lighting L1 | >100 | >100 | >100 | PASS |\n| Lighting L2 | >100 | >100 | >100 | PASS |\n\nStandar: Min 1 MOhm (PUIL 2011)\n\nB. Pengujian Kontinuitas Grounding\n\n| Titik | Resistansi (Ohm) | Status |\n|-------|---------------|--------|\n| Panel MDP | 0.8 | PASS |\n| Panel lantai 1 | 1.2 | PASS |\n\nStandar: Maks 5 Ohm (PUIL 2011)\n\n3. KESIMPULAN\n\nSemua pengujian LULUS - Instalasi aman beroperasi\n\nIngin saya buatkan template laporan lengkap?`;
  }

  // === EXISTING HANDLERS ===
  if (msg.includes("rab") || msg.includes("rencana anggaran") || msg.includes("estimasi biaya")) {
    // Extract area size from message if provided (e.g., "36 m2", "100 meter")
    const areaMatch = msg.match(/(\d+)\s*meter\s*persegi|(\d+)\s*m2|(\d+)\s*m²|luas\s*(\d+)/i);
    const area = areaMatch ? parseInt(areaMatch[1] || areaMatch[2] || areaMatch[3] || areaMatch[4] || "100") : 100;
    
    // Calculate realistic estimates based on area
    const isSmallHouse = area <= 50;
    const isMediumHouse = area <= 150;
    
    // Realistic pricing for Indonesian construction (2024)
    const biayaPerM2 = isSmallHouse ? 3500000 : isMediumHouse ? 4500000 : 5500000;
    const totalBiaya = area * biayaPerM2;
    
    const persiapan = Math.round(totalBiaya * 0.05);
    const pondasi = Math.round(totalBiaya * 0.15);
    const struktur = Math.round(totalBiaya * 0.35);
    const arsitektur = Math.round(totalBiaya * 0.30);
    const mep = Math.round(totalBiaya * 0.15);
    const totalLangsung = persiapan + pondasi + struktur + arsitektur + mep;
    const overhead = Math.round(totalLangsung * 0.10);
    const ppn = Math.round((totalLangsung + overhead) * 0.11);
    const grandTotal = totalLangsung + overhead + ppn;
    
    const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");
    
    return `Sebagai ${agentName}, berikut estimasi RAB untuk proyek Anda:

**📊 RENCANA ANGGARAN BIAYA**
*Proyek: Rumah Tinggal | Luas: ${area} m²*

| No | Uraian Pekerjaan | % | Estimasi Biaya |
|----|------------------|---|----------------|
| 1 | Pekerjaan Persiapan | 5% | ${formatRupiah(persiapan)} |
| 2 | Pekerjaan Pondasi & Tanah | 15% | ${formatRupiah(pondasi)} |
| 3 | Pekerjaan Struktur (Sloof, Kolom, Balok, Ring) | 35% | ${formatRupiah(struktur)} |
| 4 | Pekerjaan Arsitektur (Dinding, Lantai, Atap) | 30% | ${formatRupiah(arsitektur)} |
| 5 | Pekerjaan MEP (Listrik, Air, Sanitasi) | 15% | ${formatRupiah(mep)} |

**Subtotal Pekerjaan:** ${formatRupiah(totalLangsung)}
**Overhead & Profit (10%):** ${formatRupiah(overhead)}
**PPN (11%):** ${formatRupiah(ppn)}
**💰 TOTAL ESTIMASI: ${formatRupiah(grandTotal)}**

---

**📋 Asumsi Perhitungan:**
- Harga per m²: ${formatRupiah(biayaPerM2)}/m² (${isSmallHouse ? "tipe sederhana" : isMediumHouse ? "tipe menengah" : "tipe premium"})
- Material: Beton K-225, Baja tulangan U-24, Bata merah/ringan
- Spesifikasi: Standard rumah tinggal Indonesia
- Lokasi: Pulau Jawa (harga material regional)

**⚠️ Catatan Penting:**
Estimasi ini bersifat indikatif. Biaya aktual dapat bervariasi 15-25% tergantung:
- Lokasi proyek (biaya transportasi material)
- Spesifikasi material yang dipilih
- Kondisi tanah dan akses lokasi
- Fluktuasi harga material

Untuk RAB detail dengan item pekerjaan lengkap (AHSP), saya butuh:
- Denah rumah dengan ukuran
- Detail spesifikasi material
- Kondisi lokasi pekerjaan

Apakah Anda ingin breakdown lebih detail untuk komponen tertentu?`;
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

  if (msg.includes("arsitektur") || msg.includes("desain") || msg.includes("bim")) {
    return `Sebagai ${agentName}, berikut informasi terkait Arsitektur & Desain:

**BUILDING INFORMATION MODELING (BIM)**

**Apa itu BIM?**
BIM adalah proses berbasis model 3D cerdas yang memberikan wawasan dan alat bagi para profesional arsitektur, teknik, dan konstruksi untuk merencanakan, merancang, membangun, dan mengelola bangunan & infrastruktur secara efisien.

**Level BIM di Indonesia:**

| Level | Deskripsi | Status |
|-------|-----------|--------|
| BIM Level 0 | 2D CAD saja | Masih banyak digunakan |
| BIM Level 1 | 2D + 3D modeling | Wajib proyek pemerintah >Rp 100 M |
| BIM Level 2 | Kolaborasi lintas disiplin | Best practice |
| BIM Level 3 | Full integrated BIM | Emerging |

**Software BIM yang Umum Digunakan:**

| Software | Kegunaan | Vendor |
|----------|----------|--------|
| **Autodesk Revit** | Arsitektur, Struktur, MEP | Autodesk |
| **AutoCAD** | 2D drafting & dokumentasi | Autodesk |
| **SketchUp** | Desain konseptual 3D | Trimble |
| **ArchiCAD** | BIM arsitektur | Graphisoft |
| **Navisworks** | Clash detection & review | Autodesk |
| **Lumion** | Rendering & visualisasi | Act-3D |

**Standar Gambar Arsitektur:**
- SNI 03-1728 — Tata cara perencanaan struktur baja
- Permen PUPR No. 22/2018 — Pembangunan bangunan gedung negara
- Persyaratan teknis gambar: skala, notasi, simbol standar

**Proses PBG (Persetujuan Bangunan Gedung):**

\`\`\`
Konsep Desain → DED (Detail Engineering Design) →
Review TABG → Penerbitan PBG → Pelaksanaan →
SLF (Sertifikat Laik Fungsi)
\`\`\`

**Regulasi BIM di Indonesia:**
- SE Menteri PUPR No. 22/2018 — Persyaratan BIM proyek pemerintah
- Permen PUPR No. 9/2021 — Pedoman BIM bangunan gedung & infrastruktur

Apakah Anda ingin informasi lebih detail tentang software BIM tertentu atau proses sertifikasi BIM?`;
  }

  if (msg.includes("k3") || msg.includes("keselamatan") || msg.includes("safety") || msg.includes("jsa") || msg.includes("smk3")) {
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

  if (msg.includes("kontrak") || msg.includes("perjanjian") || msg.includes("klausul") || msg.includes("fidic") || msg.includes("sengketa")) {
    return `Sebagai ${agentName}, berikut panduan kontrak & hukum konstruksi:

**JENIS KONTRAK KONSTRUKSI**

| Jenis Kontrak | Karakteristik | Risiko Kontraktor | Cocok Untuk |
|---------------|--------------|-------------------|-------------|
| **Lump Sum** | Harga tetap, scope tetap | Tinggi | Proyek jelas & well-defined |
| **Unit Price** | Harga per satuan, volume bervariasi | Sedang | Pekerjaan tanah, jalan |
| **Cost Plus Fee** | Biaya aktual + fee | Rendah | Proyek darurat/kompleks |
| **Turnkey EPC** | Desain+bangun+serah terima | Sangat tinggi | Industri, power plant |

**FIDIC CONDITIONS OF CONTRACT:**

🔑 **Suite FIDIC (Edisi 2017):**
- **Red Book** — Pekerjaan sipil, kontraktor desain minor
- **Yellow Book** — EPC, kontraktor desain penuh
- **Silver Book** — Turnkey, risiko pada kontraktor
- **Green Book** — Kontrak nilai kecil, simplified

**Klausul Penting:**
- Clause 8: Commencement, Delays & Suspension
- Clause 13: Variations & Adjustments
- Clause 20: Claims, Disputes & Arbitration

**PENYELESAIAN SENGKETA KONSTRUKSI:**

\`\`\`
Negosiasi (Level 1)
    ↓ gagal (28 hari)
Mediasi (Level 2)
    ↓ gagal
Adjudikasi/DAB — FIDIC
    ↓ banding
Arbitrase (Final) — BANI, ICC
\`\`\`

🔴 **Klausul Kritis:**
1. **Force Majeure** — pastikan cakupan jelas (pandemi, kebijakan pemerintah)
2. **Eskalasi harga** — indeksasi material (baja, beton, BBM)
3. **Retensi** — maksimal 5% sesuai Perpres 16/2018
4. **Denda penalti** — batas maksimal 5% dari nilai kontrak

**Regulasi:**
- UU No. 2/2017 tentang Jasa Konstruksi
- Perpres No. 16/2018 jo. 12/2021 (Pengadaan)
- UU No. 30/1999 tentang Arbitrase & Penyelesaian Sengketa

Apakah Anda ingin analisis klausul kontrak tertentu atau panduan negosiasi FIDIC?`;
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

  if (msg.includes("energi") || msg.includes("plts") || msg.includes("solar") || msg.includes("ebt") || msg.includes("listrik") || msg.includes("pln")) {
    return `Sebagai ${agentName}, berikut informasi energi terbarukan yang Anda butuhkan:

**PANDUAN PLTS (PEMBANGKIT LISTRIK TENAGA SURYA)**

**Jenis PLTS:**

| Jenis | Kapasitas | Cocok Untuk | Estimasi Biaya |
|-------|-----------|-------------|----------------|
| PLTS Rooftop On-Grid | 2-500 kWp | Gedung, pabrik | Rp 12-15 juta/kWp |
| PLTS Off-Grid | 1-100 kWp | Daerah terpencil | Rp 20-30 juta/kWp |
| PLTS Utility Scale | >1 MWp | IPP, BUMN | Rp 8-12 juta/kWp |

**Perizinan PLTS Rooftop:**
- [ ] Permohonan ke PLN setempat
- [ ] Sertifikasi instalasi (ESDM)
- [ ] SLO (Sertifikat Laik Operasi)
- [ ] Perjanjian jual beli listrik (jika ekspor ke PLN)

**Regulasi Terbaru:**
- Permen ESDM No. 26/2021 — PLTS Atap
- Perpres No. 112/2022 — Percepatan EBT
- Target bauran EBT 23% pada 2025

**Insentif:**
✅ Tax holiday untuk investasi EBT
✅ Bebas bea masuk panel surya
✅ Feed-in tariff untuk PLTS skala besar

Apakah Anda ingin saya hitung estimasi ROI untuk proyek PLTS Anda?`;
  }

  if (msg.includes("migas") || msg.includes("minyak") || msg.includes("gas") || msg.includes("tambang") || msg.includes("iup") || msg.includes("psc")) {
    return `Sebagai ${agentName}, berikut informasi migas & pertambangan:

**PERIZINAN USAHA PERTAMBANGAN (IUP)**

**Tahapan IUP Mineral:**

| Tahap | Izin | Instansi | Durasi |
|-------|------|----------|--------|
| 1 | WIUP (Wilayah IUP) | Kementerian ESDM | 3-6 bulan |
| 2 | IUP Eksplorasi | Gubernur/Bupati | 6-12 bulan |
| 3 | Studi Kelayakan | Internal + ESDM | 3-6 bulan |
| 4 | IUP Operasi Produksi | Kementerian ESDM | 6-12 bulan |

**Dokumen yang Diperlukan:**
- [ ] Akta pendirian perusahaan
- [ ] NPWP & NIB (OSS)
- [ ] Peta wilayah yang dimohon
- [ ] Rencana kerja & anggaran biaya
- [ ] Dokumen lingkungan (AMDAL)
- [ ] Bukti kemampuan finansial

**Kontrak PSC (Production Sharing Contract) Migas:**

🔑 **Mekanisme Bagi Hasil:**
- Cost Recovery: Kontraktor recover biaya operasi dulu
- Profit Split: Sisa dibagi antara pemerintah & kontraktor
- Typical split: 85:15 (minyak) atau 70:30 (gas) untuk pemerintah

**Regulasi:**
- UU No. 4/2009 tentang Pertambangan Mineral & Batubara
- UU No. 22/2001 tentang Minyak & Gas Bumi
- PP No. 96/2021 tentang Pelaksanaan Kegiatan Usaha Pertambangan

Apakah Anda ingin detail lebih lanjut tentang proses perizinan atau kontrak?`;
  }

  if (msg.includes("struktur") || msg.includes("beton") || msg.includes("baja") || msg.includes("pondasi") || msg.includes("kolom") || msg.includes("balok")) {
    return `Sebagai ${agentName}, berikut panduan teknik struktur:

**TEKNIK STRUKTUR BANGUNAN**

**Sistem Struktur Utama:**

| Sistem | Material | Keunggulan | Cocok Untuk |
|--------|----------|------------|-------------|
| Rangka Beton Bertulang | Beton + Baja tulangan | Tahan gempa, fleksibel | Gedung bertingkat |
| Struktur Baja | Profil baja WF/H | Cepat, bentang lebar | Gudang, pabrik, jembatan |
| Prategang (Prestressed) | Beton + strand | Bentang panjang, tipis | Jembatan, parkir |
| Komposit | Beton + baja | Efisien, kuat | Gedung tinggi |

**Mutu Beton (SNI 2847:2019):**

| Kode | f'c (MPa) | Penggunaan |
|------|-----------|------------|
| K-175 / fc' 14.5 | 14.5 | Lantai kerja, non-struktural |
| K-250 / fc' 20.75 | 20.75 | Struktur umum |
| K-300 / fc' 24.9 | 24.9 | Kolom, balok, pelat |
| K-350 / fc' 29.05 | 29.05 | Struktur khusus, jembatan |
| K-400 / fc' 33.2 | 33.2 | Prategang, high-rise |

**Analisis Beban (SNI 1727:2020):**
- **Beban Mati (DL):** Berat sendiri struktur + finishing
- **Beban Hidup (LL):** Hunian 2.4 kN/m², kantor 2.4 kN/m², parkir 4.8 kN/m²
- **Beban Gempa (E):** Sesuai peta gempa SNI 1726:2019
- **Beban Angin (W):** Sesuai SNI 1727:2020

**Kombinasi Beban (LRFD):**
\`\`\`
1.4D
1.2D + 1.6L
1.2D + 1.0E + 1.0L
0.9D + 1.0E
\`\`\`

**Software Analisis Struktur:**
- **ETABS** — Gedung bertingkat, analisis gempa
- **SAP2000** — Struktur umum, jembatan
- **STAAD.Pro** — Struktur baja, industri
- **SAFE** — Pelat dan pondasi

**Regulasi:**
- SNI 2847:2019 — Persyaratan beton struktural
- SNI 1726:2019 — Tata cara perencanaan ketahanan gempa
- SNI 1727:2020 — Beban minimum untuk perancangan bangunan

Apakah Anda ingin perhitungan struktur untuk elemen tertentu?`;
  }

  if (msg.includes("mekanikal") || msg.includes("hvac") || msg.includes("plumbing") || msg.includes("pipa") || msg.includes("pompa") || msg.includes("ac")) {
    return `Sebagai ${agentName}, berikut panduan sistem mekanikal bangunan:

**SISTEM MEKANIKAL BANGUNAN (MEP)**

**1. HVAC (Heating, Ventilation & Air Conditioning)**

| Sistem | Kapasitas | Cocok Untuk | Estimasi Biaya |
|--------|-----------|-------------|----------------|
| Split AC | 0.5-5 PK | Ruangan kecil-sedang | Rp 3-15 juta/unit |
| VRF/VRV | 5-50 PK | Gedung komersial | Rp 15-50 juta/unit |
| Chiller + AHU | >50 TR | Gedung besar | Rp 500 juta - 5 M |
| Cooling Tower | Sesuai chiller | Sistem terpusat | Rp 100-500 juta |

**Standar Desain HVAC:**
- ASHRAE 62.1 — Ventilasi kualitas udara dalam ruangan
- SNI 03-6572 — Tata cara perancangan sistem ventilasi
- Suhu nyaman: 22-26°C, RH 50-60%

**2. Sistem Plumbing**

\`\`\`
Sumber Air → Tangki Bawah (Ground Tank)
    ↓ Pompa Transfer
Tangki Atas (Roof Tank)
    ↓ Gravitasi
Distribusi ke Fixture
    ↓
Sistem Drainase → IPAL → Saluran Kota
\`\`\`

**Kebutuhan Air (SNI 03-7065):**
- Hunian: 120 liter/orang/hari
- Kantor: 50 liter/orang/hari
- Hotel: 250 liter/kamar/hari
- Rumah Sakit: 500 liter/tempat tidur/hari

**3. Sistem Pemadam Kebakaran**

| Sistem | Standar | Penggunaan |
|--------|---------|------------|
| Sprinkler | NFPA 13 / SNI | Gedung >3 lantai |
| Hydrant | SNI 03-1745 | Semua gedung |
| FM200/CO2 | NFPA 2001 | Server room, panel |
| Foam | NFPA 11 | Gudang BBM, hangar |

**Regulasi:**
- Permen PUPR No. 26/2008 — Persyaratan teknis sistem proteksi kebakaran
- SNI 03-6481 — Sistem plumbing
- ASHRAE Standards untuk HVAC

Apakah Anda ingin detail perhitungan untuk sistem tertentu?`;
  }

  if (msg.includes("lingkungan") || msg.includes("amdal") || msg.includes("ukl") || msg.includes("upl") || msg.includes("limbah") || msg.includes("ipal")) {
    return `Sebagai ${agentName}, berikut panduan lingkungan hidup untuk proyek konstruksi:

**DOKUMEN LINGKUNGAN HIDUP**

**Jenis Dokumen Berdasarkan Skala Proyek:**

| Dokumen | Threshold | Proses | Waktu |
|---------|-----------|--------|-------|
| **AMDAL** | Proyek besar/strategis | Komisi AMDAL | 75-180 hari |
| **UKL-UPL** | Proyek menengah | Dinas LH | 14-30 hari |
| **SPPL** | Proyek kecil | Dinas LH | 7-14 hari |
| **DELH/DPLH** | Proyek existing | Komisi/Dinas LH | 30-90 hari |

**Kriteria Wajib AMDAL (PP 22/2021):**
- Luas lahan > 5 ha (perumahan)
- Gedung > 10.000 m² atau > 8 lantai
- Kawasan industri > 50 ha
- Jalan tol, bendungan, pelabuhan

**Komponen AMDAL:**
\`\`\`
1. Kerangka Acuan (KA-ANDAL)
2. ANDAL (Analisis Dampak Lingkungan)
3. RKL (Rencana Pengelolaan Lingkungan)
4. RPL (Rencana Pemantauan Lingkungan)
\`\`\`

**Sistem IPAL (Instalasi Pengolahan Air Limbah):**

| Tahap | Proses | Tujuan |
|-------|--------|--------|
| Primer | Sedimentasi, skimming | Padatan tersuspensi |
| Sekunder | Biologis (aerobik/anaerobik) | BOD, COD |
| Tersier | Filtrasi, disinfeksi | Patogen, nutrisi |

**Baku Mutu Air Limbah (PermenLHK P.68/2016):**
- BOD: ≤ 30 mg/L
- COD: ≤ 100 mg/L
- TSS: ≤ 30 mg/L
- pH: 6-9

**Regulasi:**
- UU No. 32/2009 tentang Perlindungan & Pengelolaan Lingkungan Hidup
- PP No. 22/2021 tentang Penyelenggaraan Perlindungan & Pengelolaan LH
- PermenLHK P.18/2021 tentang AMDAL, UKL-UPL, SPPL

Apakah Anda ingin panduan penyusunan dokumen lingkungan untuk proyek tertentu?`;
  }

  if (msg.includes("manajemen") || msg.includes("proyek") || msg.includes("project") || msg.includes("wbs") || msg.includes("gantt")) {
    return `Sebagai ${agentName}, berikut panduan manajemen proyek konstruksi:

**MANAJEMEN PROYEK KONSTRUKSI**

**Struktur WBS (Work Breakdown Structure):**

\`\`\`
Proyek Konstruksi
├── 1. Pra-Konstruksi
│   ├── 1.1 Perijinan & Dokumen
│   ├── 1.2 Desain & Engineering
│   └── 1.3 Pengadaan
├── 2. Konstruksi
│   ├── 2.1 Pekerjaan Sipil
│   ├── 2.2 Pekerjaan Struktur
│   ├── 2.3 Pekerjaan Arsitektur
│   └── 2.4 Pekerjaan MEP
└── 3. Pasca-Konstruksi
    ├── 3.1 Testing & Commissioning
    └── 3.2 Serah Terima
\`\`\`

**KPI Proyek yang Harus Dipantau:**

| KPI | Target | Frekuensi |
|-----|--------|-----------|
| Schedule Performance Index (SPI) | ≥ 1.0 | Mingguan |
| Cost Performance Index (CPI) | ≥ 1.0 | Mingguan |
| Safety Incident Rate | 0 | Harian |
| Quality Defect Rate | < 2% | Per milestone |
| Cash Flow | Positif | Bulanan |

**Tools Manajemen Proyek:**
- **Primavera P6** — Scheduling kompleks
- **MS Project** — Scheduling standar
- **Procore** — Manajemen dokumen & lapangan
- **BIM 360** — Koordinasi desain

Apakah Anda ingin template laporan progress mingguan atau bulanan?`;
  }

  // Default response - enhanced for better user experience
  const generalResponses = [
    `Terima kasih atas pertanyaan Anda! Saya adalah KonstruksiAI, asisten AI untuk industri konstruksi Indonesia.

Saya dapat membantu Anda dengan berbagai topik seperti:

📐 **Teknik Konstruksi**
- Struktur bangunan (beton, baja, pondasi)
- RAB dan estimasi biaya
- Arsitektur dan desain

⚡ **Energi Terbarukan**
- PLTS (Pembangkit Listrik Tenaga Surya)
- PLTB dan energi angin
- Sistem ketenagalistrikan

🏭 **Migas & Pertambangan**
- Perizinan usaha pertambangan
- Kontrak PSC dan bagi hasil
- Regulasi ESDM

📋 **Bisnis Konstruksi**
- Tender dan pengadaan (LKPP)
- Manajemen proyek
- Kontrak dan hukum konstruksi

🎯 **Perijinan**
- PBG (Persetujuan Bangunan Gedung)
- Sertifikasi (SBU, SKK, SKA)
- K3 dan keselamatan kerja

**Agar dapat membantu Anda dengan lebih baik, coba berikan:**
- Detail proyek (lokasi, skala, nilai)
- Konteks atau latar belakang masalah
- Output yang diharapkan (analisis, dokumen, checklist, dll)

Contoh pertanyaan yang bisa Anda ajukan:
• "Buatkan RAB untuk rumah tipe 45"
• "Apa saja syarat PBG untuk rumah tinggal?"
• "Cara daftar tender di LPSE"
• "Jelaskan regulasi K3 konstruksi"

Silakan ajukan pertanyaan Anda!`,
    
    `Halo! Saya KonstruksiAI, asisten AI untuk sektor konstruksi dan engineering Indonesia.

Saya siap membantu Anda dengan pertanyaan teknis maupun bisnis, termasuk:

✅ **Analisis & Konsultasi**
- Evaluasi teknis bangunan
- Studi kelayakan proyek
- Analisis risiko

✅ **Pembuatan Dokumen**
- RAB (Rencana Anggaran Biaya)
- Jadwal proyek (Gantt chart)
- Dokumen tender
- Checklist perijinan

✅ **Panduan Regulasi**
- Pemahaman regulasi Indonesia
- Proses perijinan
- Standar teknis (SNI)

✅ **Rekomendasi Praktis**
- Solusi yang bisa langsung diterapkan
- Rekomendasi material
- Best practice industri

**Contoh penggunaan:**
"Buatkan estimasi biaya untuk proyek"
"Apa saja tahap perizinan proyek bangunan?"
"Jelaskan tentang tender konstruksi"

Silakan tanyakan apapun tentang konstruksi!`
  ];
  
  // Pick a response based on message length for variety
  const responseIndex = userMessage.length % generalResponses.length;
  return generalResponses[responseIndex];
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

KEAHLIAN ANDA:
- Teknik konstruksi, struktur bangunan, dan estimasi biaya (RAB)
- Energi terbarukan (PLTS, PLTB, EBT) dan ketenagalistrikan
- Migas, pertambangan, dan regulasi ESDM
- Tender, pengadaan, dan manajemen proyek konstruksi
- Perijinan bangunan (PBG, SLF) dan regulasi K3

PANDUAN ESTIMASI BIAYA (RAB):
- Rumah sederhana (tipe 21-36): Rp 3-4 juta/m²
- Rumah menengah (tipe 45-120): Rp 4-6 juta/m²
- Rumah premium (tipe 150+): Rp 6-10 juta/m²
- Gedung komersial: Rp 8-15 juta/m²
- Bangunan industri: Rp 10-20 juta/m²
- Selalu perhitungkan: material (60%), upah (25%), overhead & profit (10%), PPN 11%

PENTING: Berikan estimasi yang REALISTIS sesuai kondisi pasar Indonesia 2024. Jika user meminta RAB rumah kecil, jangan berikan angka miliaran.

Selalu berikan jawaban dalam bahasa Indonesia yang profesional, terstruktur, dan praktis.`;
    
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
    const hfApiKey = process.env.HUGGING_FACE_API_KEY;
    const hfModel = process.env.HUGGING_FACE_MODEL || "Qwen/Qwen2.5-7B-Instruct";

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
    console.log("[Chat API] Groq API Key configured:", groqApiKey ? "Yes (" + groqApiKey.slice(0, 10) + "...)" : "No");
    if (groqApiKey) {
      try {
        console.log("[Chat API] Attempting Groq API call...");
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
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
          console.log("[Chat API] Groq API success!");
          return NextResponse.json({
            message: data.choices[0]?.message?.content || "Maaf, tidak ada respons.",
            agentName,
          });
        } else {
          const errorText = await response.text();
          console.error("[Chat API] Groq API error response:", response.status, errorText);
        }
      } catch (error) {
        console.error("[Chat API] Groq API fetch error:", error);
      }
    }

    // Try Hugging Face Qwen
    console.log("[Chat API] Hugging Face API Key configured:", hfApiKey ? "Yes (" + hfApiKey.slice(0, 10) + "...)" : "No");
    if (hfApiKey) {
      try {
        console.log("[Chat API] Attempting Hugging Face API call with model:", hfModel);
        
        // Format messages for Qwen chat template
        const chatMessages = [
          { role: "system", content: agentSystemPrompt },
          ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        ];
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${hfModel}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${hfApiKey}`,
            },
            body: JSON.stringify({
              inputs: chatMessages,
              parameters: {
                max_new_tokens: 2000,
                temperature: 0.7,
                return_full_text: false,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("[Chat API] Hugging Face API success!");
          
          // Handle different response formats
          let responseText = "";
          if (Array.isArray(data) && data[0]?.generated_text) {
            responseText = data[0].generated_text;
          } else if (data?.generated_text) {
            responseText = data.generated_text;
          }
          
          // Clean up the response - extract just the assistant message
          if (responseText) {
            // Try to extract the last assistant message if the model returns full conversation
            const assistantMatch = responseText.lastIndexOf("assistant");
            if (assistantMatch !== -1) {
              responseText = responseText.slice(assistantMatch + 9).trim();
            }
            
            return NextResponse.json({
              message: responseText || "Maaf, tidak ada respons.",
              agentName,
            });
          }
          return NextResponse.json({
            message: "Maaf, tidak ada respons.",
            agentName,
          });
        } else {
          const errorText = await response.text();
          console.error("[Chat API] Hugging Face API error response:", response.status, errorText);
        }
      } catch (error) {
        console.error("[Chat API] Hugging Face API fetch error:", error);
      }
    }

    // ============================================================
    // FALLBACK: Simulated Response
    // ============================================================
    const simulatedResponse = generateSimulatedResponse(
      lastUserMessage,
      agentSystemPrompt,
      agentName,
      messages
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
