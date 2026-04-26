"use client";

import { useState, useRef, useEffect } from "react";
import Link from "@/shims/next-link";

// ============================================================
// SOLVER PAGE — Multi-step Engineering Problem Solver
// Inspired by gpai.app/solver — structured AI problem solving
// ============================================================

interface SolverStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface SolverDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  problemTypes: string[];
}

interface SolverResult {
  problem: string;
  domain: string;
  approach: string;
  analysis: string;
  solution: string;
  regulations: string[];
  nextSteps: string[];
  outputFormat: string;
}

const SOLVER_DOMAINS: SolverDomain[] = [
  {
    id: "konstruksi",
    name: "Teknik Konstruksi",
    icon: "🏗️",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    description: "Struktur, arsitektur, MEP, jalan, jembatan",
    problemTypes: [
      "Perhitungan struktur & dimensi elemen",
      "Estimasi biaya & RAB proyek",
      "Metode pelaksanaan konstruksi",
      "Analisis beban & gempa",
      "Desain pondasi & tanah",
      "Spesifikasi material & mutu",
    ],
  },
  {
    id: "energi",
    name: "Ketenagalistrikan & EBT",
    icon: "⚡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/40",
    description: "PLTS, PLTB, PLTA, transmisi, distribusi",
    problemTypes: [
      "Desain sistem PLTS rooftop & utility",
      "Perhitungan kapasitas pembangkit",
      "Analisis jaringan distribusi listrik",
      "Studi kelayakan proyek EBT",
      "Perizinan SLO & IUPTL",
      "Optimasi bauran energi",
    ],
  },
  {
    id: "migas",
    name: "Migas & Pertambangan",
    icon: "⛏️",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    description: "Eksplorasi, produksi, pipeline, K3 migas",
    problemTypes: [
      "Analisis cadangan & produksi",
      "Desain fasilitas produksi migas",
      "Perizinan IUP & IUPK",
      "Studi kelayakan tambang",
      "Manajemen K3 migas",
      "Kontrak PSC & bagi hasil",
    ],
  },
  {
    id: "tender",
    name: "Tender & Pengadaan",
    icon: "📋",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/40",
    description: "LPSE, dokumen tender, evaluasi, kontrak",
    problemTypes: [
      "Strategi penawaran harga tender",
      "Penyusunan dokumen teknis tender",
      "Evaluasi & analisis penawaran",
      "Kualifikasi & SBU perusahaan",
      "Kontrak FIDIC & pemerintah",
      "Klaim & sengketa konstruksi",
    ],
  },
  {
    id: "perijinan",
    name: "Perijinan & Regulasi",
    icon: "📜",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    description: "PBG, SLF, AMDAL, SBU, SKK, OSS",
    problemTypes: [
      "Pengurusan PBG & SLF",
      "Sertifikasi SBU & SKK",
      "Dokumen AMDAL & UKL-UPL",
      "Perizinan OSS & DPMPTSP",
      "Regulasi UU Cipta Kerja",
      "Sertifikasi profesi keteknikan",
    ],
  },
  {
    id: "manajemen",
    name: "Manajemen Proyek",
    icon: "📊",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/40",
    description: "Perencanaan, pengendalian, SDM, keuangan",
    problemTypes: [
      "Penyusunan WBS & jadwal proyek",
      "Pengendalian biaya & cashflow",
      "Manajemen risiko proyek",
      "Koordinasi multi-disiplin",
      "Laporan & dokumentasi proyek",
      "Manajemen subkontraktor",
    ],
  },
];

const SOLVER_STEPS: SolverStep[] = [
  { id: "domain", title: "Pilih Domain", description: "Tentukan bidang keteknikan", icon: "🎯" },
  { id: "problem", title: "Deskripsikan Masalah", description: "Jelaskan permasalahan Anda", icon: "📝" },
  { id: "context", title: "Tambah Konteks", description: "Parameter & detail teknis", icon: "⚙️" },
  { id: "solve", title: "Dapatkan Solusi", description: "Analisis & rekomendasi AI", icon: "🚀" },
];

const EXAMPLE_PROBLEMS: Record<string, string[]> = {
  konstruksi: [
    "Saya perlu menghitung dimensi kolom beton untuk gedung 8 lantai di zona gempa tinggi Jakarta",
    "Buat RAB estimasi untuk pembangunan gudang industri 2000 m² di Bekasi",
    "Bagaimana metode pelaksanaan pengecoran beton di musim hujan?",
  ],
  energi: [
    "Desain sistem PLTS rooftop 100 kWp untuk pabrik tekstil di Bandung",
    "Hitung kapasitas baterai BESS untuk PLTS off-grid 50 kWp",
    "Apa persyaratan SLO untuk PLTS rooftop yang terhubung ke PLN?",
  ],
  migas: [
    "Apa saja tahapan dan persyaratan mendapatkan IUP Operasi Produksi mineral?",
    "Bagaimana mekanisme cost recovery dalam kontrak PSC migas?",
    "Buat checklist K3 untuk pekerjaan pengeboran sumur minyak",
  ],
  tender: [
    "Strategi penawaran harga untuk tender konstruksi gedung senilai Rp 50 miliar",
    "Dokumen apa saja yang diperlukan untuk kualifikasi tender pemerintah?",
    "Bagaimana cara mengajukan klaim perpanjangan waktu akibat force majeure?",
  ],
  perijinan: [
    "Apa persyaratan dan alur pengurusan PBG untuk gedung komersial 15 lantai?",
    "Bagaimana cara mendapatkan SBU Konstruksi Gedung kualifikasi Besar?",
    "Proyek apa saja yang wajib AMDAL berdasarkan PP 22/2021?",
  ],
  manajemen: [
    "Buat WBS dan jadwal proyek untuk konstruksi jembatan bentang 100m",
    "Bagaimana mengelola cashflow proyek konstruksi agar tidak defisit?",
    "Strategi manajemen risiko untuk proyek konstruksi di daerah terpencil",
  ],
};

// ============================================================
// SIMULATED SOLVER RESPONSES
// ============================================================

function generateSolverResponse(domain: string, problem: string, context: string): SolverResult {
  const domainObj = SOLVER_DOMAINS.find(d => d.id === domain);
  const domainName = domainObj?.name || domain;

  // Generic structured response based on domain
  const responses: Record<string, Partial<SolverResult>> = {
    konstruksi: {
      approach: "Analisis Teknik Struktural & Estimasi Biaya",
      analysis: `**Analisis Permasalahan:**

Berdasarkan deskripsi Anda, saya mengidentifikasi beberapa aspek teknis yang perlu diperhatikan:

1. **Klasifikasi Proyek:** Berdasarkan informasi yang diberikan, proyek ini termasuk kategori konstruksi ${problem.includes("gedung") ? "bangunan gedung" : problem.includes("jalan") ? "infrastruktur jalan" : "konstruksi umum"}.

2. **Standar yang Berlaku:**
   - SNI 2847:2019 — Persyaratan beton struktural
   - SNI 1726:2019 — Ketahanan gempa
   - SNI 1727:2020 — Beban minimum bangunan
   - Permen PUPR No. 1/2022 — AHSP

3. **Parameter Kritis:**
   - Lokasi & zona gempa (berpengaruh pada koefisien seismik)
   - Jenis tanah & daya dukung pondasi
   - Fungsi bangunan (menentukan beban hidup)
   - Mutu material (beton, baja tulangan)`,
      solution: `**Solusi & Rekomendasi:**

### Langkah 1: Analisis Beban
\`\`\`
Beban Mati (DL):
- Berat sendiri struktur: 24 kN/m³ (beton)
- Finishing & partisi: 1.5-2.0 kN/m²

Beban Hidup (LL):
- Kantor: 2.4 kN/m²
- Parkir: 4.8 kN/m²
- Atap: 0.96 kN/m²

Kombinasi LRFD:
- 1.2D + 1.6L (dominan gravitasi)
- 1.2D + 1.0E + 1.0L (dominan gempa)
\`\`\`

### Langkah 2: Dimensi Elemen Struktur
| Elemen | Dimensi Awal | Mutu Material |
|--------|-------------|---------------|
| Kolom | 500×500 mm | fc' 30 MPa (K-350) |
| Balok Induk | 300×600 mm | fc' 25 MPa (K-300) |
| Pelat | 120-150 mm | fc' 25 MPa |
| Pondasi | Tiang Ø500 mm | fc' 35 MPa |

### Langkah 3: Estimasi Biaya
| Pekerjaan | Volume | Harga Satuan | Total |
|-----------|--------|--------------|-------|
| Pondasi | 200 m³ | Rp 2.500.000/m³ | Rp 500.000.000 |
| Struktur | 800 m³ | Rp 3.000.000/m³ | Rp 2.400.000.000 |
| Arsitektur | 1.000 m² | Rp 1.500.000/m² | Rp 1.500.000.000 |
| MEP | 1 Ls | Rp 800.000.000 | Rp 800.000.000 |
| **TOTAL** | | | **Rp 5.200.000.000** |`,
      regulations: [
        "SNI 2847:2019 — Persyaratan Beton Struktural",
        "SNI 1726:2019 — Tata Cara Perencanaan Ketahanan Gempa",
        "SNI 1727:2020 — Beban Minimum untuk Perancangan Bangunan",
        "Permen PUPR No. 1/2022 — AHSP Bidang Pekerjaan Umum",
        "PP No. 16/2021 — Peraturan Pelaksanaan UU Bangunan Gedung",
      ],
      nextSteps: [
        "Lakukan penyelidikan tanah (soil investigation) untuk data daya dukung",
        "Buat DED (Detail Engineering Design) dengan software ETABS/SAP2000",
        "Konsultasikan dengan Tim Ahli Bangunan Gedung (TABG) untuk PBG",
        "Siapkan dokumen tender: RKS, BQ, spesifikasi teknis",
        "Daftarkan proyek ke LPSE jika pengadaan pemerintah",
      ],
    },
    energi: {
      approach: "Analisis Teknis Sistem Energi & Studi Kelayakan",
      analysis: `**Analisis Sistem Energi:**

1. **Potensi Energi Terbarukan:**
   - Iradiasi surya Indonesia: 4.5-5.5 kWh/m²/hari
   - Kecepatan angin rata-rata: 3-6 m/s (bervariasi per lokasi)
   - Potensi hidro: tersebar di Sumatera, Kalimantan, Papua

2. **Regulasi & Kebijakan:**
   - Perpres No. 112/2022 — Percepatan Pengembangan EBT
   - Permen ESDM No. 26/2021 — PLTS Atap
   - Target bauran EBT 23% pada 2025, 31% pada 2030

3. **Aspek Teknis Kritis:**
   - Kapasitas terpasang vs kebutuhan beban
   - Sistem penyimpanan energi (BESS)
   - Koneksi ke jaringan PLN (on-grid/off-grid)`,
      solution: `**Solusi Teknis & Finansial:**

### Desain Sistem PLTS
\`\`\`
Kapasitas Panel: sesuai kebutuhan beban
Peak Sun Hours: 4.5-5.0 jam/hari (rata-rata Indonesia)
Performance Ratio: 0.75-0.80
Produksi Energi = Kapasitas × PSH × PR
\`\`\`

### Komponen Utama
| Komponen | Spesifikasi | Estimasi Biaya |
|----------|-------------|----------------|
| Panel Surya | Monocrystalline 400-550 Wp | Rp 3.000-4.000/Wp |
| Inverter | String/Central inverter | Rp 1.500-2.500/Wp |
| Mounting | Rooftop/Ground mount | Rp 500-1.000/Wp |
| Kabel & Panel | Sesuai kapasitas | Rp 500-800/Wp |
| Instalasi | Termasuk komisioning | Rp 500-1.000/Wp |
| **Total EPC** | | **Rp 6.000-9.000/Wp** |

### Analisis Finansial
| Parameter | Nilai |
|-----------|-------|
| Investasi Awal | Rp 6-9 juta/kWp |
| Produksi Tahunan | ~1.600-1.800 kWh/kWp |
| Penghematan/tahun | Rp 1.500-2.000/kWh × produksi |
| Payback Period | 5-8 tahun |
| IRR | 12-18% |
| Lifetime | 25-30 tahun |`,
      regulations: [
        "Perpres No. 112/2022 — Percepatan Pengembangan EBT",
        "Permen ESDM No. 26/2021 — PLTS Atap",
        "Permen ESDM No. 4/2020 — IUPTL",
        "UU No. 30/2009 — Ketenagalistrikan",
        "SNI IEC 62446 — Sistem PLTS Grid-Connected",
      ],
      nextSteps: [
        "Lakukan survei lokasi & analisis bayangan (shading analysis)",
        "Hitung kebutuhan beban listrik aktual (load profile)",
        "Ajukan permohonan ke PLN untuk koneksi on-grid",
        "Siapkan dokumen SLO (Sertifikat Laik Operasi) ke ESDM",
        "Pertimbangkan insentif pajak & skema pembiayaan hijau",
      ],
    },
    tender: {
      approach: "Analisis Strategi Tender & Penyusunan Dokumen",
      analysis: `**Analisis Tender:**

1. **Jenis Pengadaan:**
   - Tender Umum (nilai > Rp 200 juta untuk jasa konsultansi, > Rp 1 miliar untuk konstruksi)
   - Penunjukan Langsung (kondisi tertentu)
   - Pengadaan Langsung (nilai kecil)

2. **Metode Evaluasi:**
   - Sistem Gugur: evaluasi administrasi → teknis → harga
   - Merit Point: skor teknis + harga (bobot tertentu)
   - Harga Terendah Responsif: untuk pekerjaan sederhana

3. **Faktor Penentu Kemenangan:**
   - Harga penawaran kompetitif (85-95% HPS)
   - Kelengkapan dokumen administrasi
   - Kualitas metode pelaksanaan
   - Pengalaman & referensi proyek sejenis`,
      solution: `**Strategi & Dokumen Tender:**

### Checklist Dokumen Penawaran
**Administrasi:**
- [ ] Surat penawaran bermaterai
- [ ] Jaminan penawaran (1-3% dari nilai penawaran)
- [ ] Akta pendirian & perubahan perusahaan
- [ ] NPWP & bukti pajak
- [ ] SBU sesuai sub-klasifikasi
- [ ] SIUJK / NIB

**Teknis:**
- [ ] Metode pelaksanaan (min. 10 halaman)
- [ ] Jadwal pelaksanaan (bar chart/S-curve)
- [ ] Daftar personil + SKA/SKT
- [ ] Daftar peralatan + bukti kepemilikan/sewa
- [ ] Pengalaman proyek sejenis (5 tahun terakhir)

**Harga:**
- [ ] Rekapitulasi penawaran
- [ ] Rincian harga satuan (BOQ terisi)
- [ ] Analisa harga satuan (AHSP)
- [ ] Daftar harga material & upah

### Strategi Harga
| Komponen | Rekomendasi |
|----------|-------------|
| Target harga | 88-93% dari HPS |
| Overhead | 8-12% dari biaya langsung |
| Profit | 5-10% |
| Kontingensi | 2-5% |`,
      regulations: [
        "Perpres No. 16/2018 jo. Perpres No. 12/2021 — Pengadaan Barang/Jasa",
        "Perlem LKPP No. 12/2021 — Pedoman Pengadaan",
        "UU No. 2/2017 — Jasa Konstruksi",
        "Permen PUPR No. 14/2020 — Standar & Pedoman Pengadaan Jasa Konstruksi",
      ],
      nextSteps: [
        "Daftar di LPSE (lpse.lkpp.go.id) dan lengkapi profil perusahaan",
        "Pastikan SBU & SKK personil masih berlaku",
        "Pelajari dokumen tender secara menyeluruh sebelum aanwijzing",
        "Siapkan jaminan penawaran dari bank/asuransi",
        "Konsultasikan dengan konsultan tender berpengalaman",
      ],
    },
    perijinan: {
      approach: "Analisis Regulasi & Alur Perijinan",
      analysis: `**Analisis Kebutuhan Perijinan:**

1. **Jenis Perijinan yang Diperlukan:**
   - PBG (Persetujuan Bangunan Gedung) — pengganti IMB
   - SLF (Sertifikat Laik Fungsi) — setelah konstruksi selesai
   - Perijinan lingkungan (AMDAL/UKL-UPL/SPPL)
   - Perijinan usaha (SBU, SIUJK, NIB)

2. **Dasar Hukum Terkini:**
   - UU No. 11/2020 — Cipta Kerja
   - PP No. 16/2021 — Bangunan Gedung
   - PP No. 5/2021 — Perizinan Berusaha Berbasis Risiko
   - Sistem OSS (Online Single Submission)

3. **Instansi Terkait:**
   - DPMPTSP (Dinas Penanaman Modal & PTSP)
   - Dinas PUPR setempat
   - KLHK / Dinas Lingkungan Hidup
   - Kementerian ESDM (untuk energi)`,
      solution: `**Alur & Checklist Perijinan:**

### Alur PBG (Persetujuan Bangunan Gedung)
\`\`\`
1. Persiapan Dokumen Teknis
   ↓
2. Konsultasi Perencanaan (DPMPTSP)
   ↓
3. Pemeriksaan Dokumen (TABG jika perlu)
   ↓
4. Penerbitan PBG (14-30 hari kerja)
   ↓
5. Pelaksanaan Konstruksi
   ↓
6. Pengajuan SLF
   ↓
7. Pemeriksaan Kelaikan Fungsi
   ↓
8. Penerbitan SLF
\`\`\`

### Persyaratan PBG
| Dokumen | Keterangan |
|---------|------------|
| Gambar arsitektur | Denah, tampak, potongan (skala 1:100) |
| Gambar struktur | + perhitungan struktur |
| Gambar MEP | Mekanikal, elektrikal, plumbing |
| Dokumen lingkungan | AMDAL/UKL-UPL/SPPL |
| Sertifikat tanah | SHM/HGB/HPL |
| KTP/Akta perusahaan | Pemohon/pemilik |
| NPWP | Pemohon |

### Biaya & Waktu
| Perijinan | Estimasi Waktu | Biaya |
|-----------|---------------|-------|
| PBG | 14-30 hari kerja | 0.5-1% nilai bangunan |
| SLF | 14-21 hari kerja | Sesuai Perda |
| AMDAL | 75-180 hari | Rp 200-500 juta |
| UKL-UPL | 14-30 hari | Rp 50-150 juta |`,
      regulations: [
        "UU No. 11/2020 — Cipta Kerja",
        "PP No. 16/2021 — Peraturan Pelaksanaan UU Bangunan Gedung",
        "Permen PUPR No. 1/2022 — Pedoman Teknis PBG",
        "PP No. 22/2021 — Penyelenggaraan Perlindungan & Pengelolaan LH",
        "PP No. 5/2021 — Perizinan Berusaha Berbasis Risiko",
      ],
      nextSteps: [
        "Daftar di OSS (oss.go.id) dan lengkapi profil usaha",
        "Konsultasikan dengan DPMPTSP setempat untuk persyaratan lokal",
        "Siapkan gambar teknis yang sudah ditandatangani konsultan berlisensi",
        "Pastikan lahan tidak dalam kawasan lindung atau sengketa",
        "Pertimbangkan menggunakan jasa konsultan perijinan berpengalaman",
      ],
    },
    migas: {
      approach: "Analisis Teknis & Regulasi Migas/Pertambangan",
      analysis: `**Analisis Sektor Migas & Pertambangan:**

1. **Klasifikasi Kegiatan:**
   - Hulu Migas: eksplorasi & produksi (SKK Migas)
   - Hilir Migas: pengolahan, pengangkutan, niaga (BPH Migas)
   - Pertambangan Mineral: IUP dari Kementerian ESDM
   - Pertambangan Batubara: IUP/IUPK dari Kementerian ESDM

2. **Regulasi Utama:**
   - UU No. 22/2001 — Minyak & Gas Bumi
   - UU No. 3/2020 — Pertambangan Mineral & Batubara
   - PP No. 96/2021 — Pelaksanaan Kegiatan Usaha Pertambangan

3. **Aspek K3 Kritis:**
   - Permen ESDM No. 38/2014 — K3 Pertambangan
   - Kepmen ESDM No. 1827/2018 — Pedoman Teknis Pertambangan`,
      solution: `**Solusi & Panduan Teknis:**

### Tahapan IUP Mineral
| Tahap | Izin | Instansi | Durasi |
|-------|------|----------|--------|
| 1 | WIUP (Wilayah IUP) | Kementerian ESDM | 3-6 bulan |
| 2 | IUP Eksplorasi | Kementerian ESDM | 6-12 bulan |
| 3 | Studi Kelayakan | Internal + ESDM | 3-6 bulan |
| 4 | IUP Operasi Produksi | Kementerian ESDM | 6-12 bulan |

### Dokumen Wajib IUP
- [ ] Akta pendirian perusahaan + NPWP
- [ ] NIB dari OSS
- [ ] Peta wilayah yang dimohon (koordinat)
- [ ] Rencana kerja & anggaran biaya (RKAB)
- [ ] Dokumen lingkungan (AMDAL wajib)
- [ ] Bukti kemampuan finansial
- [ ] Rencana reklamasi & pascatambang

### Mekanisme PSC Migas
\`\`\`
Gross Revenue
  - Cost Recovery (biaya operasi)
  = Profit Oil/Gas
    - Pajak (PPh Badan)
    = Net Profit
      ÷ Bagi Hasil (Pemerintah : Kontraktor)
        Minyak: 85:15 (standar)
        Gas: 70:30 (standar)
\`\`\``,
      regulations: [
        "UU No. 22/2001 — Minyak & Gas Bumi",
        "UU No. 3/2020 — Pertambangan Mineral & Batubara",
        "PP No. 96/2021 — Pelaksanaan Kegiatan Usaha Pertambangan",
        "Permen ESDM No. 38/2014 — K3 Pertambangan",
        "Kepmen ESDM No. 1827/2018 — Pedoman Teknis Pertambangan",
      ],
      nextSteps: [
        "Lakukan studi geologi awal untuk identifikasi potensi sumber daya",
        "Konsultasikan dengan Dirjen Minerba/Migas untuk persyaratan terkini",
        "Siapkan tim ahli: geolog, insinyur tambang, konsultan lingkungan",
        "Alokasikan anggaran untuk AMDAL (wajib untuk semua IUP)",
        "Pertimbangkan kemitraan dengan BUMN (Pertamina, MIND ID)",
      ],
    },
    manajemen: {
      approach: "Analisis Manajemen Proyek & Pengendalian",
      analysis: `**Analisis Manajemen Proyek:**

1. **Framework yang Digunakan:**
   - PMBOK (Project Management Body of Knowledge)
   - Standar ISO 21500 — Panduan Manajemen Proyek
   - Permen PUPR No. 14/2020 — Standar Jasa Konstruksi

2. **Area Pengetahuan Kritis:**
   - Manajemen Ruang Lingkup (Scope)
   - Manajemen Jadwal (Schedule)
   - Manajemen Biaya (Cost)
   - Manajemen Risiko (Risk)
   - Manajemen Kualitas (Quality)

3. **Tantangan Umum Proyek Konstruksi Indonesia:**
   - Keterlambatan pembayaran termin
   - Perubahan desain (change order)
   - Ketersediaan material & tenaga kerja
   - Perijinan & birokrasi`,
      solution: `**Solusi Manajemen Proyek:**

### Template WBS (Work Breakdown Structure)
\`\`\`
1.0 PROYEK KONSTRUKSI
  1.1 Manajemen Proyek
    1.1.1 Perencanaan
    1.1.2 Pengendalian
    1.1.3 Pelaporan
  1.2 Pekerjaan Persiapan
    1.2.1 Mobilisasi
    1.2.2 Direksi Keet
    1.2.3 Pagar Proyek
  1.3 Pekerjaan Sipil
    1.3.1 Tanah & Pondasi
    1.3.2 Struktur
    1.3.3 Arsitektur
  1.4 Pekerjaan MEP
    1.4.1 Mekanikal
    1.4.2 Elektrikal
    1.4.3 Plumbing
  1.5 Komisioning & Serah Terima
\`\`\`

### Pengendalian Biaya (Earned Value)
| Metrik | Formula | Interpretasi |
|--------|---------|--------------|
| CPI | EV/AC | >1: under budget |
| SPI | EV/PV | >1: ahead of schedule |
| EAC | BAC/CPI | Estimasi biaya akhir |
| VAC | BAC-EAC | Varians biaya akhir |

### Manajemen Risiko
| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Keterlambatan material | Tinggi | Tinggi | Buffer stock, multi-supplier |
| Cuaca ekstrem | Sedang | Sedang | Jadwal buffer, asuransi |
| Perubahan desain | Tinggi | Tinggi | Freeze design, change order |
| Kenaikan harga | Sedang | Tinggi | Eskalasi harga dalam kontrak |`,
      regulations: [
        "Permen PUPR No. 14/2020 — Standar & Pedoman Jasa Konstruksi",
        "SNI ISO 21500:2012 — Panduan Manajemen Proyek",
        "Perpres No. 16/2018 — Pengadaan Barang/Jasa Pemerintah",
        "UU No. 2/2017 — Jasa Konstruksi",
      ],
      nextSteps: [
        "Implementasikan software manajemen proyek (Primavera P6, MS Project)",
        "Buat sistem pelaporan mingguan dengan format standar",
        "Adakan rapat koordinasi rutin (weekly meeting)",
        "Siapkan contingency plan untuk risiko utama",
        "Dokumentasikan semua perubahan dengan berita acara resmi",
      ],
    },
  };

  const domainResponse = responses[domain] || responses.konstruksi;

  return {
    problem,
    domain: domainName,
    approach: domainResponse.approach || "Analisis Teknis Komprehensif",
    analysis: domainResponse.analysis || "",
    solution: domainResponse.solution || "",
    regulations: domainResponse.regulations || [],
    nextSteps: domainResponse.nextSteps || [],
    outputFormat: "Laporan Teknis Terstruktur",
  };
}

// ============================================================
// MARKDOWN RENDERER (simple)
// ============================================================

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 rounded text-orange-300 text-xs">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto my-3 font-mono">$1</pre>')
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-bold text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-bold text-lg mt-5 mb-2">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-bold text-xl mt-5 mb-3">$1</h1>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split("|").filter(c => c.trim());
      return `<tr>${cells.map(c => `<td class="border border-slate-700 px-3 py-1.5 text-sm text-slate-300">${c.trim()}</td>`).join("")}</tr>`;
    })
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 border border-slate-600 rounded mt-0.5 flex-shrink-0"></span><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 bg-green-500 rounded mt-0.5 flex-shrink-0 flex items-center justify-center text-white text-xs">✓</span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br/>");
}

// ============================================================
// MAIN SOLVER PAGE
// ============================================================

export default function SolverPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");
  const [outputType, setOutputType] = useState("laporan");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedDomainObj = SOLVER_DOMAINS.find(d => d.id === selectedDomain);

  const handleGenerate = async () => {
    if (!selectedDomain || !problem.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep(3);

    // Simulate progressive generation
    const steps = [
      { progress: 15, delay: 400 },
      { progress: 35, delay: 800 },
      { progress: 55, delay: 600 },
      { progress: 75, delay: 700 },
      { progress: 90, delay: 500 },
      { progress: 100, delay: 400 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setGenerationProgress(step.progress);
    }

    const generatedResult = generateSolverResponse(selectedDomain, problem, context);
    setResult(generatedResult);
    setIsGenerating(false);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedDomain("");
    setProblem("");
    setContext("");
    setResult(null);
    setGenerationProgress(0);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `# Solusi: ${result.problem}\n\n## Domain: ${result.domain}\n\n## Pendekatan\n${result.approach}\n\n## Analisis\n${result.analysis}\n\n## Solusi\n${result.solution}\n\n## Regulasi\n${result.regulations.map(r => `- ${r}`).join("\n")}\n\n## Langkah Selanjutnya\n${result.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
                <span className="text-white font-bold text-lg">KonstruksiAI</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-orange-400 font-medium text-sm">🔬 Solver</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/chat" className="text-slate-400 hover:text-white text-sm transition-colors">Chat Bebas</Link>
              <Link href="/matrix" className="text-slate-400 hover:text-white text-sm transition-colors">Matriks</Link>
              <Link href="/tools" className="text-slate-400 hover:text-white text-sm transition-colors">Tools</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            <span className="text-orange-300 text-sm font-medium">Engineering Problem Solver</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Selesaikan Masalah Keteknikan
            <span className="text-orange-400 block">dengan Analisis AI Terstruktur</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Deskripsikan permasalahan teknis Anda, dan AI akan menganalisis serta memberikan solusi terstruktur lengkap dengan regulasi dan langkah implementasi.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {SOLVER_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  i === currentStep
                    ? "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                    : i < currentStep
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-slate-800 border border-slate-700 text-slate-500"
                }`}
              >
                <span>{i < currentStep ? "✓" : step.icon}</span>
                <span className="font-medium hidden sm:block">{step.title}</span>
              </div>
              {i < SOLVER_STEPS.length - 1 && (
                <div className={`w-6 h-0.5 ${i < currentStep ? "bg-green-500/50" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Domain Selection */}
        {!result && (
          <div className="space-y-8">
            {/* Domain Selection */}
            <div>
              <h2 className="text-white font-bold text-xl mb-2">
                <span className="text-orange-400 mr-2">1.</span>Pilih Domain Keteknikan
              </h2>
              <p className="text-slate-400 text-sm mb-5">Pilih bidang yang paling relevan dengan permasalahan Anda</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SOLVER_DOMAINS.map(domain => (
                  <button
                    key={domain.id}
                    onClick={() => {
                      setSelectedDomain(domain.id);
                      setCurrentStep(Math.max(currentStep, 1));
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedDomain === domain.id
                        ? `${domain.bgColor} ${domain.borderColor} ring-2 ring-orange-500/30`
                        : "bg-slate-800 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{domain.icon}</span>
                      <span className={`font-bold text-sm ${selectedDomain === domain.id ? domain.color : "text-white"}`}>
                        {domain.name}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">{domain.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {domain.problemTypes.slice(0, 2).map(pt => (
                        <span key={pt} className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                          {pt.split(" ").slice(0, 3).join(" ")}...
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            {selectedDomain && (
              <div>
                <h2 className="text-white font-bold text-xl mb-2">
                  <span className="text-orange-400 mr-2">2.</span>Deskripsikan Permasalahan
                </h2>
                <p className="text-slate-400 text-sm mb-4">Jelaskan permasalahan teknis Anda secara spesifik</p>

                {/* Example problems */}
                <div className="mb-4">
                  <p className="text-slate-500 text-xs mb-2">💡 Contoh pertanyaan:</p>
                  <div className="flex flex-wrap gap-2">
                    {(EXAMPLE_PROBLEMS[selectedDomain] || []).map(ex => (
                      <button
                        key={ex}
                        onClick={() => {
                          setProblem(ex);
                          setCurrentStep(Math.max(currentStep, 2));
                        }}
                        className="text-xs bg-slate-800 border border-slate-700 hover:border-orange-500/50 text-slate-400 hover:text-orange-300 px-3 py-1.5 rounded-lg transition-all text-left"
                      >
                        {ex.length > 60 ? ex.slice(0, 60) + "..." : ex}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={problem}
                  onChange={e => {
                    setProblem(e.target.value);
                    if (e.target.value.trim()) setCurrentStep(Math.max(currentStep, 2));
                  }}
                  placeholder={`Contoh: "Saya perlu menghitung dimensi kolom beton untuk gedung 8 lantai di zona gempa tinggi Jakarta, dengan beban hidup kantor 2.4 kN/m²..."`}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none outline-none transition-colors"
                  rows={4}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600 text-xs">Semakin detail, semakin akurat solusinya</span>
                  <span className="text-slate-600 text-xs">{problem.length} karakter</span>
                </div>
              </div>
            )}

            {/* Context & Options */}
            {problem.trim() && (
              <div>
                <h2 className="text-white font-bold text-xl mb-2">
                  <span className="text-orange-400 mr-2">3.</span>Tambah Konteks (Opsional)
                </h2>
                <p className="text-slate-400 text-sm mb-4">Parameter tambahan untuk solusi yang lebih spesifik</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Lokasi Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta, Surabaya, Kalimantan Timur"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Skala/Nilai Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 5 miliar, 2000 m², 100 kWp"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-400 text-xs mb-1.5 block">Konteks Tambahan</label>
                  <textarea
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="Informasi tambahan: kondisi tanah, spesifikasi khusus, batasan anggaran, timeline, dll."
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none outline-none transition-colors"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="text-slate-400 text-xs mb-2 block">Format Output yang Diinginkan</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "laporan", label: "📄 Laporan Teknis" },
                      { id: "checklist", label: "✅ Checklist" },
                      { id: "tabel", label: "📊 Tabel & Data" },
                      { id: "panduan", label: "📖 Panduan Langkah" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setOutputType(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          outputType === opt.id
                            ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedDomain || !problem.trim() || isGenerating}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-[1.01] shadow-lg shadow-orange-500/20 disabled:shadow-none disabled:scale-100"
                >
                  🚀 Analisis & Selesaikan Masalah
                </button>
              </div>
            )}
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
          <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-3xl">🔬</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Menganalisis Permasalahan...</h3>
            <p className="text-slate-400 text-sm mb-6">AI sedang memproses dan menyusun solusi teknis untuk Anda</p>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Memproses...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[
                { icon: "🔍", label: "Analisis masalah" },
                { icon: "📚", label: "Cek regulasi" },
                { icon: "✍️", label: "Susun solusi" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`text-center p-2 rounded-lg transition-all ${
                    generationProgress > i * 33
                      ? "bg-orange-500/10 border border-orange-500/30"
                      : "bg-slate-700/50 border border-slate-700"
                  }`}
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isGenerating && (
          <div ref={resultRef} className="mt-8 space-y-6">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-orange-500/10 to-slate-800 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-2 py-0.5 rounded-full">✓ Solusi Siap</span>
                    <span className="text-slate-500 text-xs">{selectedDomainObj?.icon} {result.domain}</span>
                  </div>
                  <h2 className="text-white font-bold text-xl mb-1">{result.approach}</h2>
                  <p className="text-slate-400 text-sm">{result.problem}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={copyToClipboard}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-2 rounded-lg transition-colors"
                    title="Salin ke clipboard"
                  >
                    📋 Salin
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    🔄 Baru
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center text-sm">🔍</span>
                Analisis Permasalahan
              </h3>
              <div
                className="prose-custom text-slate-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.analysis) }}
              />
            </div>

            {/* Solution */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center text-sm">💡</span>
                Solusi & Rekomendasi
              </h3>
              <div
                className="prose-custom text-slate-300 text-sm leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.solution) }}
              />
            </div>

            {/* Regulations */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-500/20 rounded-lg flex items-center justify-center text-sm">📜</span>
                Regulasi & Standar yang Berlaku
              </h3>
              <div className="space-y-2">
                {result.regulations.map((reg, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-purple-400 text-sm flex-shrink-0">§</span>
                    <span className="text-slate-300 text-sm">{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center text-sm">🎯</span>
                Langkah Selanjutnya
              </h3>
              <div className="space-y-3">
                {result.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500/10 to-slate-800 border border-orange-500/20 rounded-2xl p-6 text-center">
              <p className="text-slate-300 text-sm mb-4">
                Butuh analisis lebih mendalam atau diskusi interaktif?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/chat"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                >
                  💬 Lanjutkan di Chat
                </Link>
                <Link
                  href="/matrix"
                  className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  📊 Buka Matriks Agen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
