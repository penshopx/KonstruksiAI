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
