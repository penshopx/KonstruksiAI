// Knowledge Base Data Structure
// Comprehensive articles for engineering fields

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  excerpt: string;
  content: string;
  tags: string[];
  difficulty: "Pemula" | "Menengah" | "Ahli";
  readTime: number;
  author: string;
  publishedAt: string;
  updatedAt: string;
  relatedArticles: string[];
  downloads?: {
    name: string;
    url: string;
    size: string;
    type: "PDF" | "DOCX" | "XLSX" | "ZIP";
  }[];
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  instructor: string;
  views: number;
  publishedAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  format: "PDF" | "DOCX" | "XLSX" | "ZIP";
  size: string;
  downloads: number;
  lastUpdated: string;
}

export const KNOWLEDGE_CATEGORIES = [
  {
    id: "konstruksi",
    name: "Teknik Konstruksi",
    icon: "🏗️",
    color: "orange",
    description: "Panduan lengkap bidang teknik konstruksi, arsitektur, sipil, mekanikal, dan elektrikal",
    subcategories: [
      { id: "arsitektur", name: "Arsitektur", count: 12 },
      { id: "sipil", name: "Teknik Sipil", count: 18 },
      { id: "mekanikal", name: "Mekanikal", count: 8 },
      { id: "elektrikal", name: "Elektrikal", count: 10 },
      { id: "tata-lingkungan", name: "Tata Lingkungan", count: 6 },
      { id: "rekayasa-teknik", name: "Rekayasa Teknik", count: 9 },
      { id: "lanskap", name: "Lanskap", count: 5 },
      { id: "desain-interior", name: "Desain Interior", count: 7 },
      { id: "iluminasi", name: "Iluminasi", count: 4 },
      { id: "perencanaan-wilayah", name: "Perencanaan Wilayah & Kota", count: 6 },
    ],
  },
  {
    id: "energi",
    name: "Ketenagalistrikan & EBT",
    icon: "⚡",
    color: "yellow",
    description: "Dokumentasi teknis ketenagalistrikan dan energi baru terbarukan",
    subcategories: [
      { id: "energi-surya", name: "Energi Surya (Solar)", count: 14 },
      { id: "energi-angin", name: "Energi Angin", count: 8 },
      { id: "energi-air", name: "Energi Air (Hidro)", count: 6 },
      { id: "panas-bumi", name: "Panas Bumi", count: 5 },
      { id: "bess", name: "Penyimpanan Energi (BESS)", count: 7 },
      { id: "pembangkit", name: "Pembangkit Listrik", count: 11 },
      { id: "transmisi", name: "Transmisi & Distribusi", count: 9 },
      { id: "biomassa", name: "Biomassa & Biogas", count: 4 },
    ],
  },
  {
    id: "migas",
    name: "Migas & Pertambangan",
    icon: "⛏️",
    color: "blue",
    description: "Panduan operasional migas, pertambangan mineral, dan eksplorasi",
    subcategories: [
      { id: "minyak-gas", name: "Minyak & Gas Bumi", count: 13 },
      { id: "tambang-mineral", name: "Pertambangan Mineral", count: 10 },
      { id: "geologi", name: "Geologi & Eksplorasi", count: 8 },
      { id: "konstruksi-migas", name: "Konstruksi Migas", count: 7 },
      { id: "pipeline", name: "Pipeline & Fasilitas", count: 9 },
      { id: "k3-migas", name: "K3 Migas & Tambang", count: 12 },
      { id: "lingkungan-migas", name: "Lingkungan Hidup", count: 6 },
      { id: "ekonomi-migas", name: "Ekonomi & Regulasi", count: 8 },
    ],
  },
  {
    id: "tender",
    name: "Tender & Pengadaan",
    icon: "📋",
    color: "green",
    description: "Panduan lengkap proses tender, pengadaan barang/jasa, dan strategi penawaran",
    subcategories: [
      { id: "lpse", name: "LPSE & E-Procurement", count: 15 },
      { id: "dokumen-tender", name: "Dokumen Tender", count: 12 },
      { id: "strategi", name: "Strategi Penawaran", count: 8 },
      { id: "kontrak", name: "Manajemen Kontrak", count: 10 },
      { id: "pengadaan", name: "Pengadaan Barang/Jasa", count: 9 },
    ],
  },
  {
    id: "manajemen",
    name: "Manajemen Bisnis Konstruksi",
    icon: "🏢",
    color: "purple",
    description: "Manajemen proyek, keuangan, SDM, dan operasional perusahaan konstruksi",
    subcategories: [
      { id: "manajemen-proyek", name: "Manajemen Proyek", count: 14 },
      { id: "keuangan", name: "Manajemen Keuangan", count: 11 },
      { id: "sdm", name: "Manajemen SDM", count: 8 },
      { id: "cashflow", name: "Cashflow & RAB", count: 10 },
      { id: "subkontrak", name: "Subkontraktor", count: 7 },
      { id: "k3", name: "K3 & SMK3", count: 12 },
    ],
  },
  {
    id: "perijinan",
    name: "Perijinan & Sertifikasi",
    icon: "📜",
    color: "red",
    description: "Informasi lengkap perijinan konstruksi, sertifikasi, dan regulasi",
    subcategories: [
      { id: "sbu", name: "SBU Konstruksi", count: 10 },
      { id: "skk", name: "SKK Konstruksi", count: 8 },
      { id: "iujk", name: "IUJK", count: 6 },
      { id: "sertifikasi", name: "Sertifikasi Profesi", count: 12 },
      { id: "imb", name: "IMB/PBG", count: 7 },
      { id: "regulasi", name: "Regulasi Terkini", count: 15 },
    ],
  },
];

export const ARTICLES: Article[] = [
  // Teknik Sipil Articles
  {
    id: "sipil-001",
    title: "Panduan Lengkap Perhitungan RAB Gedung Komersial",
    slug: "panduan-rab-gedung-komersial",
    category: "konstruksi",
    subcategory: "sipil",
    excerpt: "Pelajari cara menghitung Rencana Anggaran Biaya untuk gedung komersial dengan metode SNI dan standar industri konstruksi Indonesia.",
    content: `
# Panduan Lengkap Perhitungan RAB Gedung Komersial

## Pendahuluan
Rencana Anggaran Biaya (RAB) adalah dokumen penting dalam setiap proyek konstruksi. Dokumen ini berisi estimasi biaya lengkap yang dibutuhkan untuk menyelesaikan proyek.

## Komponen Utama RAB

### 1. Pekerjaan Persiapan
- Pembersihan lahan
- Pemasangan pagar proyek
- Pembuatan gudang dan pos jaga
- Pengukuran dan pemasangan bouwplank

### 2. Pekerjaan Struktur
- Pondasi (footplate, pile cap, tiang pancang)
- Kolom dan balok
- Pelat lantai
- Tangga dan lift pit

### 3. Pekerjaan Arsitektur
- Dinding dan partisi
- Plafon
- Lantai (keramik, granit, vinyl)
- Pintu dan jendela
- Cat dan finishing

### 4. Pekerjaan MEP
- Instalasi listrik
- Instalasi plumbing
- Instalasi HVAC
- Sistem proteksi kebakaran

## Metode Perhitungan

### Metode Analisa Harga Satuan
Formula: 
\`\`\`
HSP = (Volume × Harga Satuan Bahan) + Upah + Alat
\`\`\`

### Metode SNI
Menggunakan analisa standar yang diterbitkan oleh PUPR:
- SNI 2836:2008 - Tata cara perhitungan harga satuan pekerjaan beton
- SNI 7394:2008 - Tata cara perhitungan harga satuan pekerjaan plesteran
- SNI 6897:2008 - Tata cara perhitungan harga satuan pekerjaan pengecatan

## Contoh Perhitungan

### Pekerjaan Beton K-300
Untuk volume 100 m³ beton:
- Semen: 400 kg/m³ × 100 × Rp1.200 = Rp48.000.000
- Pasir: 0,6 m³/m³ × 100 × Rp250.000 = Rp15.000.000
- Kerikil: 0,8 m³/m³ × 100 × Rp350.000 = Rp28.000.000
- Upah kerja: 100 × Rp850.000 = Rp85.000.000

**Total: Rp176.000.000**

## Tips Optimasi Biaya
1. Gunakan material lokal untuk mengurangi biaya transport
2. Perhatikan faktor kehilangan material (waste factor)
3. Sesuaikan dengan indeks harga daerah setempat
4. Pertimbangkan biaya overhead dan profit (10-15%)

## Kesimpulan
Perhitungan RAB yang akurat memerlukan pemahaman mendalam tentang:
- Spesifikasi teknis
- Volume pekerjaan
- Harga satuan material dan upah
- Faktor-faktor tambahan (waste, overhead, profit)

Dengan mengikuti standar SNI dan memperhatikan kondisi lapangan, Anda dapat menyusun RAB yang realistis dan kompetitif.
    `,
    tags: ["RAB", "Estimasi Biaya", "Gedung Komersial", "SNI", "Manajemen Proyek"],
    difficulty: "Menengah",
    readTime: 15,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-01-15",
    updatedAt: "2024-03-01",
    relatedArticles: ["sipil-002", "sipil-003", "manajemen-001"],
    downloads: [
      { name: "Template RAB Excel", url: "/downloads/template-rab.xlsx", size: "245 KB", type: "XLSX" },
      { name: "Analisa Harga Satuan SNI", url: "/downloads/analisa-sni.pdf", size: "1.2 MB", type: "PDF" },
    ],
  },
  {
    id: "sipil-002",
    title: "Spesifikasi Teknis Beton Bertulang Sesuai SNI 2847:2019",
    slug: "spesifikasi-beton-bertulang-sni",
    category: "konstruksi",
    subcategory: "sipil",
    excerpt: "Pemahaman mendalam tentang SNI 2847:2019 untuk perencanaan dan pelaksanaan struktur beton bertulang.",
    content: `
# Spesifikasi Teknis Beton Bertulang Sesuai SNI 2847:2019

## Ruang Lingkup
SNI 2847:2019 menetapkan persyaratan minimum untuk:
- Perencanaan struktur beton
- Pelaksanaan pekerjaan beton
- Pengawasan dan pengendalian mutu

## Persyaratan Material

### Beton
Mutu beton dinyatakan dengan notasi fc' (kuat tekan karakteristik):
- fc' 20 MPa (K-250) - untuk struktur ringan
- fc' 25 MPa (K-300) - standar untuk gedung
- fc' 30 MPa (K-350) - untuk struktur berat
- fc' 35 MPa (K-400) - untuk struktur khusus

### Baja Tulangan
- U24 (fy = 240 MPa) - tulangan polos
- U40 (fy = 400 MPa) - tulangan deformed
- U50 (fy = 500 MPa) - tulangan deformed high-grade

## Persyaratan Penulangan

### Selimut Beton (Concrete Cover)
| Lokasi | Minimum Cover |
|--------|---------------|
| Beton di tanah | 75 mm |
| Terpapar cuaca | 50 mm |
| Di dalam ruang | 20 mm |
| Balok & kolom | 40 mm |

### Jarak Antar Tulangan
- Minimum: diameter tulangan atau 25 mm
- Maksimum: sesuai perhitungan struktur

## Prosedur Pelaksanaan

### 1. Persiapan
- Pemeriksaan shop drawing
- Persiapan material dan peralatan
- Pengecekan bekisting

### 2. Pembesian
- Cutting dan bending sesuai gambar
- Pengikatan dengan kawat bendrat
- Pemasangan spaser dan kursen

### 3. Pengecoran
- Persiapan ready mix atau site mixing
- Transportasi dan pouring
- Pemadatan dengan vibrator
- Perawatan (curing) minimal 7 hari

## Pengujian Mutu

### Slump Test
- K-250: 10-15 cm
- K-300: 7-12 cm
- K-350: 5-10 cm

### Uji Kuat Tekan
- Benda uji: silinder 15×30 cm
- Umur uji: 28 hari
- Jumlah: minimum 3 benda uji per hari pengecoran

## Kesalahan Umum dan Solusi
1. **Segregasi**: Akibat terlalu tinggi jatuh beton → gunakan tremie
2. **Bleding**: Akibat terlalu banyak air → kontrol w/c ratio
3. **Retak plastis**: Akibat penguapan cepat → gunakan curing compound

## Referensi
- SNI 2847:2019 - Persyaratan Beton Struktural
- SNI 7656:2012 - Tata Cara Pembuatan Rencana Campuran Beton Normal
    `,
    tags: ["Beton Bertulang", "SNI 2847", "Struktur", "Pembesian", "Mutu Beton"],
    difficulty: "Ahli",
    readTime: 20,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-02-01",
    updatedAt: "2024-03-05",
    relatedArticles: ["sipil-001", "sipil-004", "rekayasa-001"],
    downloads: [
      { name: "Checklist Pengecoran Beton", url: "/downloads/checklist-beton.pdf", size: "320 KB", type: "PDF" },
      { name: "Tabel Tulangan SNI", url: "/downloads/tabel-tulangan.xlsx", size: "180 KB", type: "XLSX" },
    ],
  },
  
  // Energi Surya Articles
  {
    id: "energi-001",
    title: "Panduan Instalasi PLTS On-Grid untuk Gedung Komersial",
    slug: "panduan-plts-ongrid-gedung",
    category: "energi",
    subcategory: "energi-surya",
    excerpt: "Panduan lengkap perencanaan dan instalasi Pembangkit Listrik Tenaga Surya on-grid untuk gedung komersial dengan kapasitas 50-500 kWp.",
    content: `
# Panduan Instalasi PLTS On-Grid untuk Gedung Komersial

## Overview Sistem On-Grid
Sistem PLTS on-grid terhubung dengan jaringan PLN. Listrik yang dihasilkan:
- Langsung digunakan untuk beban gedung
- Kelebihan ekspor ke PLN (net metering)
- Kekurangan diambil dari PLN

## Tahapan Perencanaan

### 1. Audit Energi
Identifikasi:
- Konsumsi listrik bulanan (kWh)
- Beban puncak (kW)
- Pola penggunaan harian
- Biaya listrik saat ini

### 2. Site Survey
Evaluasi:
- Arah dan kemiringan atap
- Bayangan dari bangunan/vegetasi
- Kondisi struktur atap
- Akses untuk instalasi dan maintenance

### 3. Sizing System
Formula umum:
\`\`\`
Kapasitas PLTS (kWp) = Konsumsi Bulanan (kWh) / (PR × HPS × 30)
\`\`\`

Dimana:
- PR (Performance Ratio): 0.75-0.85
- HPS (Horas Peak Sun): 4-5 jam (Indonesia)

## Komponen Utama

### 1. Solar Panel
Pilihan teknologi:
- Monocrystalline: efisiensi 20-22%
- Polycrystalline: efisiensi 16-18%
- Thin-film: efisiensi 10-12%

Rekomendasi untuk gedung: Monocrystalline 450-550 Wp

### 2. Inverter Grid-Tie
Spesifikasi:
- Kapasitas: 110% dari kapasitas panel
- Efisiensi: >98%
- THD: <3%
- Fitur anti-islanding

### 3. Balance of System
- Mounting structure (aluminium/galvanis)
- DC dan AC cable
- DC combiner box
- AC distribution panel
- Metering system

## Prosedur Instalasi

### Tahap 1: Persiapan (1-2 hari)
- Delivery dan inspeksi komponen
- Persiapan peralatan
- Safety briefing tim

### Tahap 2: Mechanical (2-3 hari)
- Instalasi mounting structure
- Pemasangan solar panel
- Grounding system

### Tahap 3: Electrical (2-3 hari)
- Wiring DC side
- Instalasi inverter
- Wiring AC side
- Sistem proteksi dan metering

### Tahap 4: Commissioning (1 hari)
- Testing dan commissioning
- Setting parameter inverter
- Verifikasi net metering
- Training operator

## Regulasi dan Perizinan

### Izin PLTS Atap (Untuk 2019)
1. Pendaftaran Online SLO PLTS Atap
2. Instalasi oleh tenaga ahli bersertifikat
3. Uji laik operasi oleh LSMK
4. Pemasangan meter khusus (export-import)

### Dokumen yang Diperlukan
- Gambar single line diagram
- Layout panel dan inverter
- Data teknis komponen
- Sertifikat kompetensi tenaga ahli

## Perhitungan Ekonomi

### Contoh: Gedung 100 kWp
- Investasi: Rp 1.2 Miliar
- Produksi tahunan: ~140.000 kWh
- Penghematan tahunan: Rp 210 juta (asumsi Rp 1.500/kWh)
- Payback period: 5.7 tahun
- ROI: 17.5%

## Maintenance Rutin

### Harian
- Monitoring via aplikasi
- Visual inspeksi panel

### Bulanan
- Cleaning panel (jika perlu)
- Cek koneksi kabel
- Inspeksi inverter

### Tahunan
- Thermography scan
- Pengukuran performance ratio
- Cleaning komprehensif
- Kalibrasi metering

## Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|---------------------|--------|
| Produksi turun | Panel kotor | Cleaning |
| Inverter error | Overheating | Cek ventilasi |
| Export ke PLN nol | Metering error | Cek CT dan PT |

## Kesimpulan
Instalasi PLTS on-grid untuk gedung komersial memberikan:
- Penghematan biaya listrik 40-60%
- Payback period 5-7 tahun
- Masa pakai sistem 25+ tahun
- Nilai properti meningkat
    `,
    tags: ["PLTS", "Energi Surya", "On-Grid", "Gedung Komersial", "Net Metering"],
    difficulty: "Menengah",
    readTime: 25,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-01-20",
    updatedAt: "2024-03-10",
    relatedArticles: ["energi-002", "energi-003", "elektrikal-001"],
    downloads: [
      { name: "Checklist Instalasi PLTS", url: "/downloads/checklist-plts.pdf", size: "450 KB", type: "PDF" },
      { name: "Kalkulator PLTS Excel", url: "/downloads/kalkulator-plts.xlsx", size: "320 KB", type: "XLSX" },
    ],
  },
  
  // Migas Articles
  {
    id: "migas-001",
    title: "Prosedur Keselamatan Kerja di Area Rig Pengeboran Minyak",
    slug: "prosedur-keselamatan-rig-pengeboran",
    category: "migas",
    subcategory: "k3-migas",
    excerpt: "Standar keselamatan kerja lengkap untuk operasi rig pengeboran minyak dan gas sesuai regulasi K3 migas.",
    content: `
# Prosedur Keselamatan Kerja di Area Rig Pengeboran Minyak

## Pendahuluan
Rig pengeboran merupakan tempat kerja dengan risiko tinggi. Dokumen ini menjelaskan prosedur keselamatan yang harus dipatuhi seluruh personil.

## Klasifikasi Area Rig

### Zone 0
Area dengan atmosfer gas/udara yang mudah meledak secara terus-menerus
- Di dalam tangki
- Di dalam separator
- Di dalam pipeline

### Zone 1
Area di mana atmosfer gas/udara yang mudah meledak kemungkinan besar terjadi
- Dekat dengan wellhead
- Area shales shaker
- Mud pump area

### Zone 2
Area di mana atmosfer gas/udara yang mudah meledak jarang terjadi
- Area drill floor
- Mud pit area
- Area peralatan utilitas

## Alat Pelindung Diri (APD)

### APD Wajib
- Safety helmet dengan chin strap
- Safety glasses/safety goggles
- Safety shoes steel toe
- Coverall flame resistant
- Ear protection (earmuff/earplug)
- Safety gloves

### APD Tambahan (sesuai area)
- SCBA (Self Contained Breathing Apparatus)
- H2S monitor
- Personal gas detector
- Fall protection harness

## Prosedur Masuk Area Rig

### 1. Orientasi Keselamatan
- Safety induction 30 menit
- Pengenalan area berbahaya
- Prosedur darurat
- Pengenalan alarm dan muster point

### 2. Pemeriksaan APD
- Kelengkapan APD
- Kondisi APD (tidak rusak/expire)
- Validasi training APD

### 3. Pendaftaran
- Log book visitor
- Buddy assignment
- JSA (Job Safety Analysis) review

## Prosedur Operasi Utama

### 1. Rigging Up/Down
- Toolbox meeting sebelum kerja
- Inspeksi peralatan angkat
- Establish exclusion zone
- Komunikasi via hand signal/radio
- Spotter untuk setiap operasi angkat

### 2. Drilling Operation
- Morning safety meeting
- Pre-tour inspection
- Check brake system
- Monitor drilling parameters
- Standby untuk well control

### 3. Hot Work
- Dapatkan hot work permit
- Inspeksi area (LEL test)
- Fire watch assigned
- Fire extinguisher standby
- Gas test continuous

## Prosedur Darurat

### Fire/Explosion
1. Aktifkan fire alarm
2. Evakuasi ke muster point
3. Head count
4. Fire fighting jika aman

### H2S Release
1. Kenali alarm H2S (siren + strobo)
2. Pakai SCBA
3. Evakuasi upwind/crosswind
4. Report ke control room

### Well Blowout
1. Aktifkan well control procedure
2. Close BOP
3. Evakuasi non-essential personnel
4. Contact well control specialist

### Man Overboard
1. Lemparkan life ring
2. Yell "Man Overboard"
3. Maintain visual contact
4. Launch rescue boat

## Inspeksi dan Audit

### Daily Inspection
- Pre-tour safety inspection
- Housekeeping check
- Peralatan safety check

### Weekly Inspection
- Fire fighting equipment
- Life saving appliances
- Communication equipment

### Monthly Inspection
- Safety management system audit
- Training record review
- Incident investigation

## Pelatihan yang Diwajibkan

### Untuk Semua Personil
- Basic Offshore Safety Induction (BOSIET)
- H2S Awareness
- Fire Fighting
- First Aid

### Untuk Operator
- Rigging and Lifting
- Confined Space Entry
- Working at Height
- Hot Work

## Dokumentasi

### Form yang Harus Diisi
- Daily safety report
- Near miss report
- Incident report
- JSA (Job Safety Analysis)
- PTW (Permit To Work)

## Kesimpulan
Keselamatan di area rig pengeboran memerlukan:
- Kedisiplinan tinggi
- Komunikasi yang jelas
- Pelatihan berkelanjutan
- Kepatuhan prosedur 100%
- Budaya safety yang kuat

Ingat: "Safety is not just a priority, it's a value"
    `,
    tags: ["K3 Migas", "Rig Pengeboran", "Safety", "H2S", "Blowout"],
    difficulty: "Ahli",
    readTime: 20,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-02-10",
    updatedAt: "2024-03-08",
    relatedArticles: ["migas-002", "migas-003", "k3-001"],
    downloads: [
      { name: "JSA Rigging Operation", url: "/downloads/jsa-rigging.pdf", size: "280 KB", type: "PDF" },
      { name: "Checklist APD", url: "/downloads/checklist-apd.xlsx", size: "150 KB", type: "XLSX" },
    ],
  },
  
  // Tender Articles
  {
    id: "tender-001",
    title: "Strategi Menang Tender Proyek Pemerintah LPSE 2024",
    slug: "strategi-menang-tender-lpse",
    category: "tender",
    subcategory: "lpse",
    excerpt: "Panduan strategis untuk memenangkan tender proyek pemerintah melalui sistem LPSE dengan metode pengadaan terbaru.",
    content: `
# Strategi Menang Tender Proyek Pemerintah LPSE 2024

## Perubahan Regulasi 2024
- PP 16/2018 (revisi) - Pengadaan Barang/Jasa
- Permen PUPR 8/2024 - Standar Biaya
- Sistem E-Tendering wajib 100%

## Memahami Metode Pengadaan

### 1. Pemilihan Langsung
- Nilai: < Rp 200 juta (barang/jasa) / < Rp 500 juta (konstruksi)
- Peserta: Minimal 3 penyedia
- Waktu: 7 hari kerja

### 2. Penunjukan Langsung
- Nilai: < Rp 50 juta (barang/jasa) / < Rp 100 juta (konstruksi)
- Peserta: 1 penyedia (ditunjuk)
- Syarat: Kondisi darurat/kegentingan

### 3. Tender Terbuka
- Nilai: > Rp 200 juta / > Rp 500 juta
- Peserta: Terbuka
- Waktu: 20-30 hari kerja

### 4. Seleksi Terbuka
- Untuk: Konsultan
- Nilai: Sesuai ambang batas

## Tahapan Menang Tender

### Fase 1: Pra-Tender (2-4 minggu sebelum)

#### A. Intelligence Gathering
1. Monitor LPSE setiap hari
2. Analisa pengumuman pasca-qualification
3. Riset historis proyek instansi
4. Identifikasi pesaing potensial

#### B. Persiapan Dokumen
- Perpanjang semua izin (SBU, IUJK, NPWP)
- Update data LPSE (SPSE)
- Siapkan jaminan penawaran
- Update data keuangan

### Fase 2: Analisis Tender (H-20 sampai H-7)

#### A. Dokumen Tender Analysis
1. **Spesifikasi Teknis**
   - Scope of work detail
   - Spesifikasi material
   - Standar mutu yang dipersyaratkan
   - Timeline pelaksanaan

2. **Administrasi**
   - Syarat kualifikasi
   - Bobot evaluasi
   - Metode evaluasi (HPS/OE, sistem gugur, sistem nilai)

3. **Komersial**
   - HPS/OE (Harga Perkiraan Sendiri/Ongkos Estimasi)
   - Pagu anggaran
   - Termin pembayaran

#### B. Site Visit
- Survey lokasi proyek
- Identifikasi kondisi lapangan
- Foto dokumentasi
- Tanyakan pada panitia (Q&A)

### Fase 3: Penyusunan Penawaran (H-7 sampai H-1)

#### A. Hitung Biaya
Formula Dasar:
\`\`\`
Harga Penawaran = Direct Cost + Indirect Cost + Profit Margin
\`\`\`

**Direct Cost:**
- Bahan/material
- Upah tenaga kerja
- Sewa alat
- Subkontraktor

**Indirect Cost (10-15%):**
- Overhead proyek
- Biaya administrasi
- Biaya mobilisasi
- Asuransi

**Profit Margin (8-15%):**
- Tergantung risiko proyek
- Tergantung persaingan

#### B. Strategi Harga

**Jika Metode HPS:**
- Target: 85-95% dari HPS
- Jangan di bawah 80% (kurensi)
- Jangan 100% (tidak kompetitif)

**Jika Sistem Nilai:**
- Bobot teknis 70-80% → fokus kualitas
- Bobot harga 20-30% → harga kompetitif

### Fase 4: Upload Dokumen (H-1)

#### Checklist Dokumen
- [ ] Surat penawaran
- [ ] Dokumen kualifikasi (copy lengkap)
- [ ] Jaminan penawaran
- [ ] Penawaran teknis
- [ ] Penawaran komersial (PDF + Excel)
- [ ] Pakta integritas

#### Tips Upload
- Upload H-1 jangan H-hour (server penuh)
- Compress PDF jika > 10 MB
- Double-check semua file
- Screenshot bukti upload

### Fase 5: Pembukaan & Evaluasi

#### Saat Pembukaan
- Hadir on-time
- Bawa dokumen asli (jika diminta)
- Catat harga pesaing

#### Jika Lulus Evaluasi
- Siapkan jaminan pelaksanaan
- Siapkan tim proyek
- Review kontrak draft

#### Jika Gagal
- Minta penjelasan tertulis
- Evaluasi kekurangan
- Simpan untuk pembelajaran

## Tips Menang Tender

### 1. Bangun Relationship
- Networking dengan panitia
- Gabung asosiasi pengusaha
- Ikut sosialisasi LPSE

### 2. Spesialisasi
- Fokus pada 2-3 bidang
- Jadi ahli di niche tertentu
- Bangun track record

### 3. Kerjasama
- Joint venture dengan rekan
- Subkontrak untuk komplemen
- Sharing resource

### 4. Teknologi
- Gunakan software estimasi
- Otomasi dokumen tender
- Analisis data historis

## Red Flags yang Harus Dihindari

❌ Tender dengan HPS tidak wajar (sangat rendah)
❌ Spesifikasi dibuat "pas" untuk vendor tertentu
❌ Syarat kualifikasi aneh/berlebihan
❌ Riwayat tender instansi buruk (sering gagal lelang)
❌ Pesaing dengan track record jelek menang terus

## Kesimpulan
Menang tender LPSE memerlukan:
- Persiapan matang
- Analisis yang tajam
- Strategi harga tepat
- Dokumen yang lengkap
- Sedikit faktor keberuntungan

"Tender itu bukan lotre, tapi perang persiapan"
    `,
    tags: ["Tender", "LPSE", "E-Procurement", "Strategi", "Pengadaan"],
    difficulty: "Menengah",
    readTime: 25,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-01-25",
    updatedAt: "2024-03-12",
    relatedArticles: ["tender-002", "tender-003", "manajemen-002"],
    downloads: [
      { name: "Template Penawaran Tender", url: "/downloads/template-penawaran.docx", size: "520 KB", type: "DOCX" },
      { name: "Checklist Dokumen Tender", url: "/downloads/checklist-tender.pdf", size: "380 KB", type: "PDF" },
    ],
  },
  
  // Manajemen Articles
  {
    id: "manajemen-001",
    title: "Manajemen Cashflow Proyek Konstruksi: Dari RAB sampai Laporan Keuangan",
    slug: "manajemen-cashflow-proyek-konstruksi",
    category: "manajemen",
    subcategory: "cashflow",
    excerpt: "Panduan praktis mengelola arus kas proyek konstruksi untuk menghindari keterlambatan pembayaran dan kebangkrutan.",
    content: `
# Manajemen Cashflow Proyek Konstruksi

## Pentingnya Cashflow Management
Proyek bisa untung di atas kertas, tapi bangkrut di lapangan karena cashflow bermasalah.

## Sumber dan Penggunaan Kas

### Sumber Kas (Cash In)
1. Uang Muka (10-20%)
2. Termin/Progress Payment (Bulanan)
3. Retensi (5-10%, kembali setelah pemeliharaan)
4. Claim/Variation Order

### Penggunaan Kas (Cash Out)
1. Material (40-50% dari nilai proyek)
2. Upah (20-30%)
3. Subkontraktor (10-20%)
4. Alat/Equipment (5-10%)
5. Overhead (5-8%)

## Strategi Cashflow Positif

### 1. Negosiasi Termin Pembayaran
Ideal:
- Uang muka: 20%
- Termin: Bulanan dengan certifikasi 2 minggu
- Retensi: 5%

### 2. Timing Pembayaran
Prioritaskan pembayaran:
- Material dengan syarat kredit 30-60 hari
- Upah: Dibayar setelah ada penerimaan termin
- Subkon: Sesuai progress dengan holdback

### 3. S-Curve Management
\`\`\`
Cashflow Positif = Termin masuk > Biaya operasional bulanan
\`\`\`

## Tools Cashflow Management

### 1. Cashflow Projection
Buat proyeksi 3 bulan ke depan:
| Bulan | Cash In | Cash Out | Net Cash | Saldo Akhir |
|-------|---------|----------|----------|-------------|
| Jan | 500jt | 400jt | +100jt | 150jt |
| Feb | 300jt | 450jt | -150jt | 0 |
| Mar | 600jt | 400jt | +200jt | 200jt |

### 2. Weekly Cash Report
Track mingguan:
- Penerimaan yang diharapkan
- Pembayaran yang jatuh tempo
- Proyeksi saldo minimum

### 3. Bank Reconciliation
Rekonsiliasi bank mingguan:
- Cek outstanding deposit
- Cek outstanding cek
- Identifikasi transaksi tidak wajar

## Mengatasi Cashflow Negatif

### Short Term Solutions
1. **Factoring/Invoice Financing**
   - Jual piutang termin ke bank/leasing
   - Biaya: 1-3% per bulan
   
2. **Supplier Credit Extension**
   - Negosiasi perpanjangan kredit
   - Berikan jaminan/jadwal pembayaran

3. **Equipment Leaseback**
   - Jual alat, sewa balik
   - Dapatkan cash injection

### Long Term Solutions
1. **Improve Collection**
   - Tagih termin tepat waktu
   - Resolve dispute cepat
   - Kurangi retensi dengan bank garansi

2. **Cost Reduction**
   - Optimasi material usage
   - Kurangi waste
   - Negotiate better rates

3. **Project Selection**
   - Hindari proyek dengan termin jelek
   - Prioritaskan owner dengan bayar cepat
   - Balance portfolio proyek

## Rasio Keuangan Proyek

### 1. Current Ratio
\`\`\`
Current Ratio = Current Assets / Current Liabilities
Target: > 1.2
\`\`\`

### 2. Cash Ratio
\`\`\`
Cash Ratio = (Cash + Bank) / Current Liabilities
Target: > 0.3
\`\`\`

### 3. Days Sales Outstanding (DSO)
\`\`\`
DSO = (Piutang / Penjualan) × Hari
Target: < 45 hari
\`\`\`

## Red Flags Cashflow

⚠️ Termin sering telat > 30 hari
⚠️ Supplier menolak kredit
⚠️ Gaji karyawan sering telat
⚠️ Tidak bisa bayar utang bank tepat waktu
⚠️ Sering pakai personal loan untuk proyek

## Best Practices

### 1. Pisahkan Rekening
- Rekening operasional proyek terpisah
- Jangan campur dengan rekening pribadi
- Transfer fee proyek ke rekening pusat

### 2. Contingency Fund
- Sediakan dana darurat 5-10% nilai proyek
- Gunakan hanya untuk kondisi emergency

### 3. Weekly Review
- Rapat keuangan mingguan
- Review cashflow projection
- Quick decision untuk masalah cash

### 4. Digital Tools
Gunakan software:
- SAP/Oracle (enterprise)
- Zahir/MyOB (SME)
- Excel advance (startup)

## Kesimpulan
Cashflow yang sehat memerlukan:
- Planning yang detail
- Monitoring ketat
- Action cepat saat ada masalah
- Disiplin finansial

"Revenue is vanity, profit is sanity, but cash is king"
    `,
    tags: ["Cashflow", "Manajemen Keuangan", "Proyek", "Termin", "RAB"],
    difficulty: "Menengah",
    readTime: 20,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-02-05",
    updatedAt: "2024-03-15",
    relatedArticles: ["manajemen-002", "sipil-001", "tender-001"],
    downloads: [
      { name: "Template Cashflow Proyek", url: "/downloads/template-cashflow.xlsx", size: "420 KB", type: "XLSX" },
      { name: "SOP Manajemen Keuangan", url: "/downloads/sop-keuangan.pdf", size: "350 KB", type: "PDF" },
    ],
  },
  
  // Perijinan Articles
  {
    id: "perijinan-001",
    title: "Panduan Lengkap Sertifikasi SBU Konstruksi 2024: Klasifikasi, Subklasifikasi, dan Cara Pengajuan",
    slug: "panduan-sbu-konstruksi-2024",
    category: "perijinan",
    subcategory: "sbu",
    excerpt: "Informasi terbaru tentang Sertifikat Badan Usaha (SBU) konstruksi: klasifikasi baru, persyaratan, biaya, dan prosedur pengajuan.",
    content: `
# Panduan Lengkap Sertifikasi SBU Konstruksi 2024

## Perubahan Regulasi 2024
- PP 14/2021 tentang Jenis dan Tarif PNBP
- Permen PUPR 11/2022 (revisi)
- Sistem OSS-RBA terintegrasi

## Apa itu SBU?
Sertifikat Badan Usaha (SBU) adalah dokumen yang membuktikan badan usaha memiliki kemampuan melaksanakan pekerjaan konstruksi.

## Klasifikasi SBU

### Kualifikasi Usaha
1. **Kecil (K)**
   - Nilai pekerjaan: < Rp 5 Miliar
   - Modal disetor: Minimal Rp 50 juta

2. **Menengah (M)**
   - Nilai pekerjaan: Rp 5-50 Miliar
   - Modal disetor: Minimal Rp 500 juta

3. **Besar (B)**
   - Nilai pekerjaan: > Rp 50 Miliar
   - Modal disetor: Minimal Rp 5 Miliar

### Bidang Usaha

#### 1. Bangunan Gedung (BG)
Subklasifikasi:
- BG001: Gedung hunian (rumah, apartemen)
- BG002: Gedung komersial (kantor, hotel)
- BG003: Gedung industri (pabrik, gudang)
- BG004: Gedung sosial budaya (sekolah, rumah sakit)

#### 2. Bangunan Sipil (SP)
Subklasifikasi:
- SP001: Jalan (jalan raya, jembatan)
- SP002: Jaringan irigasi (bendungan, saluran)
- SP003: Bangunan pengairan (pelabuhan, bandara)
- SP004: Bangunan utilitas (PLTM, instalasi pengolahan)

#### 3. Bangunan Mekanikal (MK)
- MK001: Instalasi HVAC
- MK002: Instalasi pemipaan
- MK003: Elevator dan eskalator

#### 4. Bangunan Elektrikal (EL)
- EL001: Instalasi listrik
- EL002: Instalasi telekomunikasi
- EL003: Instalasi proteksi petir

#### 5. Bangunan Arsitektur (AR)
- AR001: Desain arsitektur
- AR002: Landscape
- AR003: Interior

## Persyaratan Pengajuan SBU

### Persyaratan Administrasi
1. Akte pendirian dan perubahan (jika ada)
2. SK Kemenkumham
3. NPWP perusahaan
4. NIB (Nomor Induk Berusaha)
5. KTP direksi

### Persyaratan Keuangan
1. Laporan keuangan 2 tahun terakhir (audit)
2. Rekening koran 3 bulan terakhir
3. Modal disetor minimal sesuai kualifikasi

### Persyaratan Teknis
1. Tenaga ahli sesuai subklasifikasi
2. Sertifikat kompetensi pekerja
3. Daftar peralatan
4. Pengalaman pekerjaan (untuk upgrade)

## Tenaga Ahli yang Diperlukan

### Per Kualifikasi
| Kualifikasi | Jumlah | Minimal Pendidikan |
|-------------|--------|-------------------|
| Kecil | 1-2 orang | D3/S1 |
| Menengah | 3-5 orang | S1 |
| Besar | 5-10 orang | S1/S2 |

### Jenis Tenaga Ahli
1. **Ahli Utama** (Pengalaman 10+ tahun)
   - S2/D4 relevant
   - Sertifikat kompetensi

2. **Ahli Madya** (Pengalaman 7+ tahun)
   - S1 relevant
   - Sertifikat kompetensi

3. **Ahli Muda** (Pengalaman 4+ tahun)
   - S1/D4 relevant
   - Sertifikat kompetensi

## Prosedur Pengajuan

### 1. Pendaftaran OSS-RBA
- Login oss.go.id
- Pilih menu "SBU Konstruksi"
- Isi data perusahaan

### 2. Upload Dokumen
- Dokumen administrasi
- Dokumen keuangan
- Dokumen teknis (tenaga ahli, alat, pengalaman)

### 3. Verifikasi
- Verifikasi administrasi (1-3 hari)
- Verifikasi teknis (3-7 hari)
- Assessment lapangan (jika diperlukan)

### 4. Pembayaran
- PNBP SBU sesuai kualifikasi
- Kecil: Rp 500.000
- Menengah: Rp 1.000.000
- Besar: Rp 2.500.000

### 5. Penerbitan
- Softcopy: 1 hari setelah bayar
- Hardcopy: 7-14 hari (dikirim ke alamat)

## Masa Berlaku dan Perpanjangan

### Masa Berlaku
- SBU: 3 tahun
- Harus diperpanjang sebelum expired

### Perpanjangan
Proses lebih mudah:
- Tidak perlu assessment
- Cek kelengkapan dokumen
- Bayar PNBP perpanjangan

### Upgrade Kualifikasi
Bisa upgrade dengan syarat:
- Pengalaman pekerjaan sesuai
- Tenaga ahli sesuai target
- Modal disetor sesuai target

## Sanksi dan Pembekuan

### SBU Dibeku Jika:
- Tidak memenuhi kewajiban laporan
- Melakukan pelanggaran K3
- Tidak memenuhi ketentuan kualifikasi

### Dampak Pembekuan:
- Tidak bisa ikut tender
- Proyek berjalan tetap dilanjutkan
- Wajib perbaiki kekurangan

## Tips Mengurus SBU

### 1. Persiapkan Tenaga Ahli
- Pastikan sertifikat masih berlaku
- Siapkan kontrak kerja
- Cek pengalaman kerja

### 2. Dokumen Lengkap
- Buat checklist dokumen
- Siapkan softcopy dan hardcopy
- Legalisir dokumen penting

### 3. Ikut Bimtek
- Ikut sosialisasi LPJK
- Update informasi regulasi
- Networking dengan sesama pengusaha

### 4. Jasa Konsultan
Jika bingung, gunakan:
- Konsultan SBU berpengalaman
- Perkumpulan pengusaha (GAPENSI, AKLI)
- Jasa legal formalities

## Biaya Total Estimasi

### SBU Kecil
- PNBP: Rp 500.000
- Jasa konsultan: Rp 2-5 juta
- Tenaga ahli: Rp 1-2 juta/bulan
- Total: Rp 5-10 juta

### SBU Menengah
- PNBP: Rp 1.000.000
- Jasa konsultan: Rp 5-10 juta
- Tenaga ahli: Rp 3-5 juta/bulan
- Total: Rp 15-30 juta

### SBU Besar
- PNBP: Rp 2.500.000
- Jasa konsultan: Rp 10-20 juta
- Tenaga ahli: Rp 10-20 juta/bulan
- Total: Rp 50-100 juta

## Kesimpulan
SBU adalah "SIM" untuk berbisnis konstruksi. Proses pengurusan memang rumit, tapi sangat penting untuk:
- Ikut tender
- Dapat proyek pemerintah
- Membangun reputasi
- Kepastian hukum

"Investasi di awal untuk SBU akan terbayar dengan proyek-proyek yang didapat"
    `,
    tags: ["SBU", "Sertifikasi", "Konstruksi", "LPJK", "OSS-RBA"],
    difficulty: "Pemula",
    readTime: 25,
    author: "Tim KonstruksiAI",
    publishedAt: "2024-01-10",
    updatedAt: "2024-03-20",
    relatedArticles: ["perijinan-002", "perijinan-003", "tender-001"],
    downloads: [
      { name: "Checklist Dokumen SBU", url: "/downloads/checklist-sbu.pdf", size: "280 KB", type: "PDF" },
      { name: "Template Tenaga Ahli", url: "/downloads/template-tenaga-ahli.xlsx", size: "200 KB", type: "XLSX" },
    ],
  },
];

// Video Tutorials Data
export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: "video-001",
    title: "Cara Membuat RAB Gedung dengan Excel (Part 1)",
    description: "Tutorial lengkap membuat Rencana Anggaran Biaya untuk proyek gedung menggunakan Microsoft Excel. Cover volume, analisa harga satuan, dan rekapitulasi.",
    thumbnail: "https://img.youtube.com/vi/placeholder1/maxresdefault.jpg",
    duration: "45:20",
    category: "konstruksi",
    instructor: "Tim KonstruksiAI",
    views: 12500,
    publishedAt: "2024-01-15",
  },
  {
    id: "video-002",
    title: "Instalasi PLTS On-Grid: Dari Survey sampai Commissioning",
    description: "Video dokumentasi lengkap instalasi PLTS on-grid 50 kWp. Mulai dari site survey, instalasi panel, wiring, sampai commissioning dan pengujian.",
    thumbnail: "https://img.youtube.com/vi/placeholder2/maxresdefault.jpg",
    duration: "1:20:15",
    category: "energi",
    instructor: "Tim KonstruksiAI",
    views: 8300,
    publishedAt: "2024-02-01",
  },
  {
    id: "video-003",
    title: "Strategi Menang Tender LPSE: Analisa Dokumen sampai Upload",
    description: "Walkthrough lengkap proses tender LPSE. Dari download dokumen tender, analisa HPS, hitung biaya, sampai upload dokumen penawaran.",
    thumbnail: "https://img.youtube.com/vi/placeholder3/maxresdefault.jpg",
    duration: "55:30",
    category: "tender",
    instructor: "Tim KonstruksiAI",
    views: 15600,
    publishedAt: "2024-01-20",
  },
  {
    id: "video-004",
    title: "Manajemen Cashflow Proyek dengan Excel Dashboard",
    description: "Cara membuat dashboard cashflow proyek yang otomatis update. Meliputi proyeksi kas, laporan termin, dan monitoring piutang.",
    thumbnail: "https://img.youtube.com/vi/placeholder4/maxresdefault.jpg",
    duration: "38:45",
    category: "manajemen",
    instructor: "Tim KonstruksiAI",
    views: 9200,
    publishedAt: "2024-02-10",
  },
  {
    id: "video-005",
    title: "Panduan Lengkap Urus SBU Konstruksi Online",
    description: "Screen recording lengkap cara mengurus SBU konstruksi melalui sistem OSS-RBA. Dari pendaftaran sampai penerbitan sertifikat.",
    thumbnail: "https://img.youtube.com/vi/placeholder5/maxresdefault.jpg",
    duration: "1:10:00",
    category: "perijinan",
    instructor: "Tim KonstruksiAI",
    views: 18700,
    publishedAt: "2024-01-25",
  },
  {
    id: "video-006",
    title: "K3 Konstruksi: JSA dan Permit To Work",
    description: "Penjelasan Job Safety Analysis (JSA) dan Permit To Work (PTW) untuk pekerjaan konstruksi dengan risiko tinggi.",
    thumbnail: "https://img.youtube.com/vi/placeholder6/maxresdefault.jpg",
    duration: "42:15",
    category: "manajemen",
    instructor: "Tim KonstruksiAI",
    views: 7100,
    publishedAt: "2024-02-20",
  },
];

// Document Templates Data
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "template-001",
    name: "Template RAB Proyek Gedung Excel",
    description: "Template Excel lengkap untuk RAB gedung dengan rumus otomatis, analisa SNI, dan rekapitulasi.",
    category: "konstruksi",
    format: "XLSX",
    size: "2.5 MB",
    downloads: 5420,
    lastUpdated: "2024-03-01",
  },
  {
    id: "template-002",
    name: "Surat Penawaran Tender Standar",
    description: "Format surat penawaran yang sesuai dengan ketentuan tender LPSE pemerintah.",
    category: "tender",
    format: "DOCX",
    size: "125 KB",
    downloads: 3890,
    lastUpdated: "2024-02-15",
  },
  {
    id: "template-003",
    name: "Cashflow Proyek 12 Bulan",
    description: "Template monitoring cashflow proyek dengan grafik dan analisis.",
    category: "manajemen",
    format: "XLSX",
    size: "890 KB",
    downloads: 4210,
    lastUpdated: "2024-03-10",
  },
  {
    id: "template-004",
    name: "Job Safety Analysis (JSA) Form",
    description: "Form JSA standar untuk pekerjaan konstruksi dengan identifikasi hazard dan kontrol.",
    category: "manajemen",
    format: "DOCX",
    size: "210 KB",
    downloads: 3150,
    lastUpdated: "2024-02-20",
  },
  {
    id: "template-005",
    name: "Daftar Tenaga Ahli Format LPJK",
    description: "Format daftar tenaga ahli sesuai standar LPJK untuk pengajuan SBU.",
    category: "perijinan",
    format: "XLSX",
    size: "180 KB",
    downloads: 2890,
    lastUpdated: "2024-01-30",
  },
  {
    id: "template-006",
    name: "Kalkulator PLTS On-Grid",
    description: "Kalkulator otomatis untuk sizing PLTS on-grid dengan ROI analysis.",
    category: "energi",
    format: "XLSX",
    size: "1.2 MB",
    downloads: 3650,
    lastUpdated: "2024-03-05",
  },
  {
    id: "template-007",
    name: "SOP Pelaksanaan Proyek Konstruksi",
    description: "Standard Operating Procedure lengkap untuk pelaksanaan proyek konstruksi.",
    category: "manajemen",
    format: "PDF",
    size: "3.5 MB",
    downloads: 4520,
    lastUpdated: "2024-02-28",
  },
  {
    id: "template-008",
    name: "Checklist K3 Harian Proyek",
    description: "Checklist inspeksi K3 harian untuk area proyek konstruksi.",
    category: "manajemen",
    format: "XLSX",
    size: "245 KB",
    downloads: 5210,
    lastUpdated: "2024-03-12",
  },
  {
    id: "template-009",
    name: "Analisa Harga Satuan SNI 2024",
    description: "Tabel analisa harga satuan pekerjaan konstruksi berdasarkan SNI terbaru.",
    category: "konstruksi",
    format: "XLSX",
    size: "4.8 MB",
    downloads: 6780,
    lastUpdated: "2024-03-15",
  },
  {
    id: "template-010",
    name: "Kontrak Kerja Subkontraktor",
    description: "Template kontrak kerja dengan subkontraktor sesuai standar industri.",
    category: "tender",
    format: "DOCX",
    size: "320 KB",
    downloads: 2980,
    lastUpdated: "2024-02-10",
  },
];

// Helper functions
export function getArticlesByCategory(categoryId: string): Article[] {
  return ARTICLES.filter(article => article.category === categoryId);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(article => article.slug === slug);
}

export function searchArticles(query: string): Article[] {
  const lowerQuery = query.toLowerCase();
  return ARTICLES.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getRelatedArticles(articleId: string): Article[] {
  const article = ARTICLES.find(a => a.id === articleId);
  if (!article) return [];
  
  return ARTICLES.filter(a => 
    article.relatedArticles.includes(a.id) || 
    (a.category === article.category && a.id !== article.id)
  ).slice(0, 4);
}

export function getVideosByCategory(categoryId: string): VideoTutorial[] {
  return VIDEO_TUTORIALS.filter(video => video.category === categoryId);
}

export function getTemplatesByCategory(categoryId: string): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES.filter(template => template.category === categoryId);
}
