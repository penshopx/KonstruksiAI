/**
 * Tender Intelligence Response Generator
 * Generates AI responses for tender document analysis queries
 */

import { TENDER_REQUIREMENTS, TENDER_CHECKLISTS, createTenderAnalysis, generateTenderSummary } from './tender-intelligence';

export function generateTenderIntelligenceResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Keywords for tender intelligence
  const tenderKeywords = [
    'tender', 'penawaran', 'lelang', 'pengadaan', 'tender documents', 'dokumen tender',
    'kelengkapan', 'completeness', 'checklist', 'daftar periksa', 'requirements', 'persyaratan',
    'administrative', 'administratif', 'technical', 'teknis', 'financial', 'keuangan',
    'legal', 'hukum', 'safety', 'keselamatan', 'k3', 'environmental', 'lingkungan',
    'risk', 'risiko', 'compliance', 'kepatuhan', 'sertifikat', 'certificate',
    'sbu', 'sertifikat badan usaha', 'npwp', 'siup', 'tdp', 'akta perusahaan'
  ];

  const hasTenderKeywords = tenderKeywords.some(keyword => lowerQuery.includes(keyword));

  if (!hasTenderKeywords) {
    return `Saya adalah asisten Tender Intelligence yang dapat membantu Anda menganalisis dokumen tender dan memeriksa kelengkapan persyaratan. 

Silakan tanyakan tentang:
- Pengecekan kelengkapan dokumen tender
- Persyaratan administratif, teknis, dan finansial
- Identifikasi risiko dalam dokumen tender
- Checklist persiapan penawaran
- Analisis kepatuhan terhadap regulasi pengadaan

Contoh pertanyaan:
- "Apa saja persyaratan administratif untuk tender konstruksi?"
- "Bagaimana cara mengecek kelengkapan dokumen tender saya?"
- "Risiko apa yang perlu diperhatikan dalam tender?"
- "Checklist untuk persiapan penawaran konstruksi"`;
  }

  // Handle specific queries
  if (lowerQuery.includes('kelengkapan') || lowerQuery.includes('completeness') || lowerQuery.includes('check')) {
    return generateCompletenessCheckResponse(query);
  }

  if (lowerQuery.includes('persyaratan') || lowerQuery.includes('requirements') || lowerQuery.includes('syarat')) {
    return generateRequirementsResponse(query);
  }

  if (lowerQuery.includes('risiko') || lowerQuery.includes('risk')) {
    return generateRiskAssessmentResponse(query);
  }

  if (lowerQuery.includes('checklist') || lowerQuery.includes('daftar periksa')) {
    return generateChecklistResponse(query);
  }

  if (lowerQuery.includes('administratif') || lowerQuery.includes('administrative')) {
    return generateAdministrativeResponse();
  }

  if (lowerQuery.includes('teknis') || lowerQuery.includes('technical')) {
    return generateTechnicalResponse();
  }

  if (lowerQuery.includes('finansial') || lowerQuery.includes('financial') || lowerQuery.includes('keuangan')) {
    return generateFinancialResponse();
  }

  if (lowerQuery.includes('keselamatan') || lowerQuery.includes('safety') || lowerQuery.includes('k3')) {
    return generateSafetyResponse();
  }

  // Default tender intelligence response
  return generateGeneralTenderResponse();
}

function generateCompletenessCheckResponse(query: string): string {
  const analysis = createTenderAnalysis(
    'Sample Construction Project',
    'Construction Tender',
    [
      { documentType: 'Akta Perusahaan', required: true, present: false, completenessScore: 0, missingElements: ['Akta terbaru'], notes: 'Wajib ada' },
      { documentType: 'NPWP', required: true, present: false, completenessScore: 0, missingElements: ['NPWP aktif'], notes: 'Wajib ada' },
      { documentType: 'SBU', required: true, present: false, completenessScore: 0, missingElements: ['SBU sesuai klasifikasi'], notes: 'Wajib ada' },
      { documentType: 'Laporan Keuangan', required: true, present: false, completenessScore: 0, missingElements: ['Audited 2 tahun'], notes: 'Wajib ada' },
      { documentType: 'Sertifikat SMK3', required: true, present: false, completenessScore: 0, missingElements: ['ISO 45001 atau SMK3'], notes: 'Wajib ada' }
    ]
  );

  return `# Pengecekan Kelengkapan Dokumen Tender

## 📊 Skor Kelengkapan: ${analysis.overallCompleteness}%

## ❌ Dokumen yang Masih Belum Lengkap:

${analysis.completenessChecks.filter(check => !check.present).map(check => `- **${check.documentType}**: ${check.missingElements.join(', ')}`).join('\n')}

## ✅ Persyaratan Utama yang Perlu Dipenuhi:

### 1. **Dokumen Administratif** (Wajib)
- Akta Pendirian Perusahaan yang masih berlaku
- NPWP Perusahaan yang aktif
- SIUP/TDP sesuai bidang usaha
- Surat Keterangan Domisili
- Rekening koran 3 bulan terakhir

### 2. **Dokumen Teknis** (Wajib)
- Sertifikat Badan Usaha (SBU) sesuai klasifikasi proyek
- Daftar pengalaman proyek serupa (minimal 3 proyek)
- Sertifikat kompetensi tenaga ahli
- Daftar peralatan dan mesin

### 3. **Dokumen Finansial** (Wajib)
- Laporan keuangan audited 2 tahun terakhir
- Surat referensi bank
- Neraca dan laporan laba rugi

### 4. **Dokumen Keselamatan & Kesehatan Kerja** (Wajib)
- Sertifikat Sistem Manajemen Keselamatan Kerja (SMK3)
- Program K3 perusahaan
- Bukti kepesertaan BPJS Ketenagakerjaan

## ⚠️ Risiko Jika Tidak Lengkap:
- **Diskualifikasi** dari proses tender
- **Penolakan penawaran** oleh panitia
- **Hilang kesempatan proyek**

## 📋 Checklist Cepat:
Gunakan fitur Checklist Tender Intelligence untuk memverifikasi setiap item secara detail.

## 💡 Rekomendasi:
1. Segera kumpulkan dokumen yang masih kurang
2. Verifikasi keabsahan semua dokumen
3. Siapkan softcopy dan hardcopy
4. Buat timeline pengumpulan dokumen`;
}

function generateRequirementsResponse(query: string): string {
  return `# Persyaratan Tender Konstruksi

## 📋 Kategori Persyaratan Utama

### **A. Persyaratan Administratif** (Wajib 100%)
Semua dokumen hukum perusahaan harus lengkap dan masih berlaku:

- ✅ Akta Pendirian Perusahaan + SK Menkumham
- ✅ NPWP Perusahaan (wajib aktif)
- ✅ SIUP/TDP sesuai klasifikasi bidang usaha
- ✅ Surat Keterangan Domisili Perusahaan
- ✅ Surat Pengukuhan PKP (jika omzet > threshold)
- ✅ Rekening koran 3 bulan terakhir
- ✅ SPT Tahunan Pajak 2 tahun terakhir

### **B. Persyaratan Teknis** (Wajib)
Bukti kemampuan teknis dan pengalaman:

- ✅ Sertifikat Badan Usaha (SBU) sesuai klasifikasi
- ✅ Daftar pengalaman proyek serupa (3-5 proyek)
- ✅ Sertifikat kompetensi tenaga ahli (Ahli Muda/Madya/Utama)
- ✅ Daftar peralatan mesin dan alat berat
- ✅ Surat referensi dari klien sebelumnya

### **C. Persyaratan Finansial** (Wajib)
Bukti kemampuan finansial:

- ✅ Laporan keuangan audited 2 tahun terakhir
- ✅ Surat referensi bank
- ✅ Neraca dan Laporan Laba Rugi
- ✅ Surat keterangan kemampuan keuangan

### **D. Persyaratan K3 & Lingkungan** (Wajib)
- ✅ Sertifikat SMK3 atau ISO 45001
- ✅ Program Keselamatan dan Kesehatan Kerja
- ✅ Bukti kepesertaan BPJS Ketenagakerjaan
- ✅ AMDAL/UKL-UPL (untuk proyek tertentu)

## 🔍 Cara Verifikasi:
1. **Cross-check** dengan dokumen asli LPSE
2. **Validasi** masa berlaku semua sertifikat
3. **Konfirmasi** klasifikasi SBU sesuai nilai proyek
4. **Pastikan** pengalaman proyek relevan

## 📊 Matriks Kepatuhan:
| Kategori | Bobot | Status |
|----------|--------|--------|
| Administratif | 25% | ❌ Belum Lengkap |
| Teknis | 35% | ❌ Belum Lengkap |
| Finansial | 25% | ❌ Belum Lengkap |
| K3/Lingkungan | 15% | ❌ Belum Lengkap |

**Skor Kepatuhan Saat Ini: 0%**

## ⚡ Next Steps:
1. Kumpulkan semua dokumen wajib
2. Verifikasi keaslian dan validitas
3. Siapkan dalam format yang diminta
4. Submit sebelum batas waktu`;
}

function generateRiskAssessmentResponse(query: string): string {
  return `# 🔍 Analisis Risiko Tender

## ⚠️ Risiko Kritis yang Perlu Diperhatikan:

### **1. Risiko Diskualifikasi (Tinggi)**
- **Penyebab**: Dokumen administrasi tidak lengkap/tidak valid
- **Dampak**: Keluar dari proses tender
- **Mitigasi**:
  - Verifikasi semua dokumen legal perusahaan
  - Pastikan masa berlaku masih aktif
  - Siapkan softcopy dan hardcopy

### **2. Risiko Teknis (Sedang-Tinggi)**
- **Penyebab**: Kurangnya pengalaman atau sertifikasi yang relevan
- **Dampak**: Penilaian teknis rendah, kemungkinan gagal
- **Mitigasi**:
  - Tunjukkan minimal 3 proyek serupa
  - Pastikan SBU sesuai klasifikasi
  - Siapkan sertifikat kompetensi tenaga ahli

### **3. Risiko Finansial (Tinggi)**
- **Penyebab**: Bukti kemampuan finansial lemah
- **Dampak**: Ditolak karena tidak memenuhi persyaratan
- **Mitigasi**:
  - Siapkan laporan keuangan audited
  - Dapatkan surat referensi bank
  - Hitung rasio keuangan yang baik

### **4. Risiko Kepatuhan K3 (Kritis)**
- **Penyebab**: Tidak ada sertifikat SMK3 atau program K3
- **Dampak**: Diskualifikasi karena persyaratan wajib
- **Mitigasi**:
  - Dapatkan sertifikasi SMK3
  - Lengkapi program K3 perusahaan
  - Pastikan kepesertaan BPJS

### **5. Risiko Waktu (Sedang)**
- **Penyebab**: Terlambat mengumpulkan dokumen
- **Dampak**: Tidak bisa ikut tender
- **Mitigasi**:
  - Buat checklist dan timeline
  - Siapkan dokumen jauh hari sebelumnya
  - Monitor batas waktu submission

## 📊 Matriks Risiko:

| Risiko | Probabilitas | Dampak | Level |
|--------|-------------|---------|-------|
| Diskualifikasi | Tinggi | Kritis | 🔴 Sangat Tinggi |
| Teknis Rendah | Sedang | Tinggi | 🟠 Tinggi |
| Finansial Lemah | Sedang | Tinggi | 🟠 Tinggi |
| K3 Tidak Lengkap | Tinggi | Kritis | 🔴 Sangat Tinggi |
| Terlambat Submit | Rendah | Sedang | 🟡 Sedang |

## 🛡️ Strategi Mitigasi:
1. **Audit Internal**: Periksa semua dokumen 2 minggu sebelum deadline
2. **Konsultasi Legal**: Tanyakan ke kantor hukum untuk validitas
3. **Backup Plan**: Siapkan opsi partnership jika diperlukan
4. **Monitoring**: Track progress pengumpulan dokumen harian

## 💡 Rekomendasi:
- Prioritaskan penyelesaian risiko kritis terlebih dahulu
- Buat tim khusus untuk pengumpulan dokumen
- Gunakan software checklist untuk tracking
- Simpan semua dokumen di cloud dengan backup`;
}

function generateChecklistResponse(query: string): string {
  const checklists = TENDER_CHECKLISTS;

  return `# 📋 Checklist Persiapan Tender

## 🎯 Checklist Lengkap Berdasarkan Kategori:

### **A. Dokumen Administratif**
${checklists.find(c => c.category === 'administrative')?.items.map(item =>
  `- [ ] ${item.text} ${item.mandatory ? '(Wajib)' : '(Opsional)'}`
).join('\n')}

### **B. Kemampuan Teknis**
${checklists.find(c => c.category === 'technical')?.items.map(item =>
  `- [ ] ${item.text} ${item.mandatory ? '(Wajib)' : '(Opsional)'}`
).join('\n')}

### **C. Dokumen Finansial**
${checklists.find(c => c.category === 'financial')?.items.map(item =>
  `- [ ] ${item.text} ${item.mandatory ? '(Wajib)' : '(Opsional)'}`
).join('\n')}

### **D. Keselamatan & Lingkungan**
${checklists.find(c => c.category === 'safety')?.items.map(item =>
  `- [ ] ${item.text} ${item.mandatory ? '(Wajib)' : '(Opsional)'}`
).join('\n')}

## 📊 Progress Tracking:

| Kategori | Total Item | Wajib | Selesai | Status |
|----------|------------|-------|---------|--------|
| Administratif | 6 | 6 | 0 | ❌ Belum |
| Teknis | 5 | 4 | 0 | ❌ Belum |
| Finansial | 4 | 4 | 0 | ❌ Belum |
| K3/Lingkungan | 4 | 3 | 0 | ❌ Belum |

**Total Progress: 0%**

## ⚡ Quick Wins (Prioritas Tinggi):
1. ✅ Ambil fotokopi NPWP dan SIUP (5 menit)
2. ✅ Download rekening koran dari bank (10 menit)
3. ✅ Siapkan daftar pengalaman proyek (15 menit)
4. ✅ Konfirmasi masa berlaku SBU (5 menit)

## 📅 Timeline yang Disarankan:
- **Hari 1-2**: Kumpulkan dokumen administrasi
- **Hari 3-4**: Lengkapi dokumen teknis dan finansial
- **Hari 5-6**: Final check dan validasi semua dokumen
- **Hari 7**: Submit sebelum deadline

## 🔍 Cara Penggunaan Checklist:
1. **Centang (✓)** setiap item yang sudah siap
2. **Tambahkan catatan** jika ada kekurangan
3. **Upload foto/dokumen** sebagai bukti
4. **Track progress** secara real-time

## 💡 Tips Sukses:
- **Start early**: Jangan menunggu deadline
- **Double-check**: Verifikasi ulang semua dokumen
- **Backup**: Simpan di multiple lokasi
- **Format**: Pastikan sesuai yang diminta tender`;
}

function generateAdministrativeResponse(): string {
  const adminReqs = TENDER_REQUIREMENTS.filter(req => req.category === 'administrative');

  return `# 📄 Persyaratan Administratif Tender

## 📋 Dokumen Wajib (100% Harus Ada):

${adminReqs.map(req => `
### **${req.name}**
**Status**: ${req.mandatory ? 'Wajib' : 'Opsional'} | **Risiko**: ${req.riskLevel.toUpperCase()}

**Deskripsi**: ${req.description}

**Checklist Detail**:
${req.checklist.map(item => `- ✅ ${item}`).join('\n')}

**Referensi**: ${req.references.join(', ')}
`).join('\n')}

## ⚖️ Regulasi Terkait:
- **UU No. 28 Tahun 2007**: Ketentuan Umum Perpajakan
- **PP No. 5 Tahun 2021**: Perubahan PP No. 44 Tahun 2007 tentang Pelaksanaan Pengadaan
- **Permen PUPR No. 14 Tahun 2020**: Sistem Klasifikasi Usaha Jasa Konstruksi

## 🔍 Cara Verifikasi:
1. **Validitas**: Pastikan semua dokumen masih berlaku
2. **Kelengkapan**: Jangan ada yang missing dari checklist
3. **Format**: Sesuai yang diminta dokumen tender
4. **Softcopy**: Siapkan PDF yang readable

## ⚠️ Kesalahan Umum:
- ❌ Menggunakan SIUP/TDP expired
- ❌ NPWP tidak aktif
- ❌ Akta perusahaan belum update
- ❌ Rekening koran tidak 3 bulan terakhir

## 💡 Tips:
- **Backup**: Simpan softcopy di Google Drive/Dropbox
- **Legal Check**: Konsultasikan dengan notaris/hukum
- **Timeline**: Siapkan 1-2 minggu sebelum tender dibuka`;
}

function generateTechnicalResponse(): string {
  const techReqs = TENDER_REQUIREMENTS.filter(req => req.category === 'technical');

  return `# 🔧 Persyaratan Teknis Tender

## 📋 Komponen Utama:

${techReqs.map(req => `
### **${req.name}**
**Status**: ${req.mandatory ? 'Wajib' : 'Opsional'} | **Risiko**: ${req.riskLevel.toUpperCase()}

**Deskripsi**: ${req.description}

**Checklist Detail**:
${req.checklist.map(item => `- ✅ ${item}`).join('\n')}

**Referensi**: ${req.references.join(', ')}
`).join('\n')}

## 📊 Klasifikasi SBU (Sertifikat Badan Usaha):

| Klasifikasi | Sub-Klasifikasi | Contoh Proyek |
|-------------|----------------|---------------|
| 1 | Bangunan | Gedung, Rumah, Jembatan |
| 2 | Sipil | Jalan, Bendungan, Irigasi |
| 3 | Mekanikal Elektrikal | HVAC, Plumbing, Electrical |
| 4 | Pengadaan Barang | Material, Equipment |
| 5 | Jasa Konsultasi | Desain, Supervisi |
| 6 | Jasa Lainnya | Transportasi, Cleaning |

## 🎯 Pengalaman Proyek:
**Minimal 3 proyek serupa dalam 5 tahun terakhir:**
- Nilai proyek minimal 80% dari tender yang dilamar
- Kontrak selesai minimal 85%
- Ada sertifikat pekerjaan (SHO/SHK)

## 👷 Tenaga Ahli:
**Sertifikasi Kompetensi:**
- Ahli Utama (pengalaman >15 tahun)
- Ahli Madya (pengalaman 8-15 tahun)
- Ahli Muda (pengalaman 3-8 tahun)

## 🛠️ Peralatan:
**Daftar wajib include:**
- Jenis dan kapasitas peralatan
- Status kepemilikan (milik/sewa)
- Kondisi peralatan (baik/rusak)
- Lokasi penyimpanan

## 💡 Strategi Teknis:
1. **Match SBU**: Pastikan klasifikasi sesuai proyek
2. **Relevant Experience**: Fokus proyek serupa
3. **Resource Proof**: Tunjukkan kepemilikan peralatan
4. **Expert Team**: Komposisi tenaga ahli yang tepat`;
}

function generateFinancialResponse(): string {
  const finReqs = TENDER_REQUIREMENTS.filter(req => req.category === 'financial');

  return `# 💰 Persyaratan Finansial Tender

## 📋 Dokumen Keuangan Wajib:

${finReqs.map(req => `
### **${req.name}**
**Status**: ${req.mandatory ? 'Wajib' : 'Opsional'} | **Risiko**: ${req.riskLevel.toUpperCase()}

**Deskripsi**: ${req.description}

**Checklist Detail**:
${req.checklist.map(item => `- ✅ ${item}`).join('\n')}

**Referensi**: ${req.references.join(', ')}
`).join('\n')}

## 📊 Rasio Keuangan Minimal:

| Rasio | Minimal | Ideal | Cara Hitung |
|-------|---------|-------|-------------|
| **Current Ratio** | 1.1:1 | 1.5:1 | Aset Lancar ÷ Hutang Lancar |
| **Debt to Equity** | <1:1 | <0.8:1 | Total Hutang ÷ Ekuitas |
| **ROA** | >5% | >8% | Laba Bersih ÷ Total Aset |
| **ROE** | >10% | >15% | Laba Bersih ÷ Ekuitas |

## 🏦 Surat Referensi Bank:
**Isi wajib mencakup:**
- Saldo rata-rata 6 bulan terakhir
- Riwayat transaksi lancar
- Tidak ada kredit macet
- Kemampuan limit kredit

## 📈 Laporan Keuangan:
**Komponen wajib:**
- Neraca (Balance Sheet)
- Laporan Laba Rugi (P&L)
- Laporan Arus Kas (Cash Flow)
- Catatan atas Laporan Keuangan
- Opini Akuntan Publik

## 💡 Tips Finansial:
1. **Audited**: Gunakan KAP terdaftar
2. **Current**: Maksimal 6 bulan dari tanggal tender
3. **Clean**: Pastikan tidak ada catatan negative
4. **Realistic**: Jangan inflate angka

## ⚠️ Red Flags:
- ❌ Laporan keuangan belum audit
- ❌ Bank reference kurang detail
- ❌ Rasio keuangan di bawah standar
- ❌ Ada hutang bermasalah`;
}

function generateSafetyResponse(): string {
  const safetyReqs = TENDER_REQUIREMENTS.filter(req => req.category === 'safety');

  return `# 🛡️ Persyaratan K3 & Lingkungan

## 📋 Dokumen Keselamatan Kerja:

${safetyReqs.map(req => `
### **${req.name}**
**Status**: ${req.mandatory ? 'Wajib' : 'Opsional'} | **Risiko**: ${req.riskLevel.toUpperCase()}

**Deskripsi**: ${req.description}

**Checklist Detail**:
${req.checklist.map(item => `- ✅ ${item}`).join('\n')}

**Referensi**: ${req.references.join(', ')}
`).join('\n')}

## 🏆 Sertifikasi SMK3:
**Tingkatan:**
- **Level 1**: Sistem dasar K3
- **Level 2**: Sistem terdokumentasi
- **Level 3**: Sistem tersertifikasi
- **Level 4**: Sistem berbasis risiko
- **Level 5**: Sistem berkelanjutan

## 👥 Program K3:
**Komponen wajib:**
- Kebijakan Keselamatan
- Struktur Organisasi K3
- Prosedur Operasional
- Pelatihan K3
- Inspeksi dan Audit
- Investigasi Kecelakaan

## 🦺 APD (Alat Pelindung Diri):
**Kategori wajib:**
- Helm safety
- Safety glasses
- Ear plug/muffs
- Safety shoes
- Gloves
- Safety harness
- Respiratory protection

## 🌱 AMDAL/UKL-UPL:
**Kapan diperlukan:**
- Proyek dengan dampak lingkungan signifikan
- Proyek di area sensitif (hutan, sungai, pesisir)
- Proyek dengan skala besar

## 💡 Best Practices:
1. **ISO 45001**: Target sertifikasi internasional
2. **Zero Accident**: Program keselamatan zero kecelakaan
3. **Training**: Pelatihan K3 rutin untuk semua karyawan
4. **Audit**: Audit K3 minimal 1x per tahun

## ⚠️ Konsekuensi Jika Tidak Patuh:
- **Denda** dari pengawas K3
- **Stop work order** jika terjadi kecelakaan
- **Blacklist** dari proyek pemerintah
- **Sanksi hukum** untuk pelanggaran berat`;
}

function generateGeneralTenderResponse(): string {
  return `# 🎯 Tender Intelligence Assistant

## 🔍 Apa yang Bisa Saya Bantu:

### **1. Pengecekan Kelengkapan Dokumen**
- Analisis dokumen tender Anda
- Identifikasi kekurangan
- Berikan skor kelengkapan
- Saran prioritas penyelesaian

### **2. Analisis Persyaratan**
- **Administratif**: Legal entity, tax compliance
- **Teknis**: SBU, experience, equipment
- **Finansial**: Financial statements, bank references
- **K3**: Safety certificates, programs

### **3. Identifikasi Risiko**
- Risiko diskualifikasi
- Risiko teknis/finansial
- Risiko kepatuhan
- Strategi mitigasi

### **4. Checklist Interaktif**
- Checklist per kategori
- Progress tracking
- Notes dan attachments
- Timeline management

## 📊 Contoh Analisis Tender:

**Proyek**: Pembangunan Gedung Kantor
**Nilai**: Rp 50 Miliar
**Klasifikasi**: SBU Kualifikasi Besar

### Status Kelengkapan Saat Ini:
- 📋 **Administratif**: 0/6 dokumen ✓
- 🔧 **Teknis**: 0/5 dokumen ✓  
- 💰 **Finansial**: 0/4 dokumen ✓
- 🛡️ **K3**: 0/4 dokumen ✓

**Risiko Level**: 🔴 KRITIS
**Rekomendasi**: Segera lengkapi dokumen wajib

## 💡 Tips Sukses Tender:

1. **Start Early**: Siapkan dokumen 1 bulan sebelum
2. **Double Check**: Verifikasi ulang semua persyaratan
3. **Quality over Quantity**: Pastikan semua dokumen valid
4. **Consult Experts**: Tanyakan ke konsultan tender berpengalaman

## ❓ Tanyakan Saya:

- "Cek kelengkapan dokumen tender saya"
- "Apa persyaratan teknis untuk tender konstruksi?"
- "Risiko apa yang perlu diwaspadai?"
- "Checklist persiapan penawaran"
- "Cara dapatkan SBU yang sesuai"

**Siap membantu Anda menangkan tender! 🚀**`;
}