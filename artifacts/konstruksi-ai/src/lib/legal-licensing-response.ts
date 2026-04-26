/**
 * Legal & Licensing Response Generator
 * Generates AI responses for legal compliance and licensing queries
 */

import {
  LICENSE_REQUIREMENTS,
  checkLicenseCompliance,
  getLicenseRequirementsForEntity,
  generateLicenseChecklist,
  calculateRenewalUrgency,
  type LegalEntity,
  type LicenseRequirement
} from './legal-licensing';

export function generateLegalLicensingResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Keywords for legal licensing
  const legalKeywords = [
    'legalitas', 'legal', 'perizinan', 'izin', 'license', 'licensing',
    'nib', 'siup', 'sbu', 'sertifikat badan usaha', 'smk3', 'amdal', 'ukl-upl',
    'izin usaha', 'izin operasional', 'izin lingkungan', 'izin keselamatan',
    'perpanjangan', 'renewal', 'masa berlaku', 'expiry', 'kadaluarsa',
    'kepatuhan', 'compliance', 'persyaratan', 'requirements',
    'akta perusahaan', 'npwp', 'domisili', 'surat keterangan'
  ];

  const hasLegalKeywords = legalKeywords.some(keyword => lowerQuery.includes(keyword));

  if (!hasLegalKeywords) {
    return `Saya adalah asisten Legal & Licensing yang dapat membantu Anda mengelola kepatuhan hukum dan perizinan usaha. 

Silakan tanyakan tentang:
- Pengecekan kelengkapan perizinan perusahaan
- Persyaratan perizinan berdasarkan sektor usaha
- Masa berlaku dan perpanjangan izin
- Persyaratan legalitas badan usaha
- Compliance check untuk tender/proyek
- Dokumen yang diperlukan untuk pengajuan izin

Contoh pertanyaan:
- "Apa saja izin yang diperlukan untuk perusahaan konstruksi?"
- "Bagaimana cara perpanjang SIUP?"
- "Dokumen apa yang perlu disiapkan untuk SBU?"
- "Berapa lama masa berlaku SMK3?"`;
  }

  // Handle specific queries
  if (lowerQuery.includes('kelengkapan') || lowerQuery.includes('check') || lowerQuery.includes('status')) {
    return generateComplianceCheckResponse(query);
  }

  if (lowerQuery.includes('persyaratan') || lowerQuery.includes('requirements') || lowerQuery.includes('syarat')) {
    return generateRequirementsResponse(query);
  }

  if (lowerQuery.includes('perpanjangan') || lowerQuery.includes('renewal') || lowerQuery.includes('masa berlaku')) {
    return generateRenewalResponse(query);
  }

  if (lowerQuery.includes('nib')) {
    return generateNIBResponse();
  }

  if (lowerQuery.includes('siup')) {
    return generateSIUPResponse();
  }

  if (lowerQuery.includes('sbu') || lowerQuery.includes('sertifikat badan usaha')) {
    return generateSBUResponse();
  }

  if (lowerQuery.includes('smk3')) {
    return generateSMK3Response();
  }

  // Default legal licensing response
  return generateGeneralLegalResponse();
}

function generateComplianceCheckResponse(query: string): string {
  // Mock entity for demonstration
  const mockEntity: LegalEntity = {
    id: 'entity-001',
    name: 'PT Konstruksi Maju Jaya',
    type: 'PT',
    npwp: '01.234.567.8-123.000',
    nib: '1234567890123',
    sector: 'construction',
    subSector: 'civil engineering',
    region: 'DKI Jakarta',
    establishmentDate: '2020-01-15',
    status: 'active'
  };

  const mockLicenses = [
    { id: 'license-001', licenseRequirementId: 'nib', entityId: 'entity-001', status: 'approved' as const, approvalDate: '2020-02-01', documents: [], renewalHistory: [] },
    { id: 'license-002', licenseRequirementId: 'siup', entityId: 'entity-001', status: 'approved' as const, approvalDate: '2020-03-01', expiryDate: '2025-03-01', documents: [], renewalHistory: [] },
    { id: 'license-003', licenseRequirementId: 'sbu', entityId: 'entity-001', status: 'approved' as const, approvalDate: '2020-04-01', expiryDate: '2023-04-01', documents: [], renewalHistory: [] },
    { id: 'license-004', licenseRequirementId: 'smk3', entityId: 'entity-001', status: 'not_applied' as const, documents: [], renewalHistory: [] }
  ];

  const complianceCheck = checkLicenseCompliance(mockEntity, mockLicenses);

  return `# 📋 Pengecekan Kepatuhan Legal & Perizinan

## 🏢 Profil Perusahaan
**${mockEntity.name}**
- Tipe: ${mockEntity.type}
- Sektor: ${mockEntity.sector}
- Wilayah: ${mockEntity.region}
- Status: ${mockEntity.status}

## 📊 Status Kepatuhan: ${complianceCheck.overallCompliance}%

## 📄 Status Perizinan:

${complianceCheck.licenseCompliance.map(license => {
  const statusEmoji = license.status === 'compliant' ? '✅' :
                     license.status === 'expired' ? '❌' :
                     license.status === 'pending' ? '⏳' : '⚠️';
  const riskColor = license.riskLevel === 'critical' ? '🔴' :
                   license.riskLevel === 'high' ? '🟠' :
                   license.riskLevel === 'medium' ? '🟡' : '🟢';

  return `### ${statusEmoji} ${license.licenseName}
**Status**: ${license.status} | **Risiko**: ${riskColor} ${license.riskLevel.toUpperCase()}
${license.expiryDate ? `**Berlaku sampai**: ${new Date(license.expiryDate).toLocaleDateString('id-ID')}` : ''}
${license.daysUntilExpiry !== undefined ? `**${license.daysUntilExpiry < 0 ? 'Sudah expired' : 'Tersisa'}**: ${Math.abs(license.daysUntilExpiry)} hari` : ''}`;
}).join('\n\n')}

## ⚠️ Gap Kepatuhan:

${complianceCheck.gaps.length > 0 ?
  complianceCheck.gaps.map(gap => `- **${gap.gapDescription}**
  Dampak: ${gap.impact}
  Prioritas: ${gap.priority.toUpperCase()}
  Estimasi Biaya: Rp ${gap.estimatedCost.toLocaleString('id-ID')}
  Estimasi Waktu: ${gap.estimatedTime} hari`).join('\n\n') :
  '✅ Semua perizinan utama sudah lengkap'}

## 💡 Rekomendasi Tindakan:

${complianceCheck.recommendations.map(rec => `- ${rec}`).join('\n')}

## 📅 Jadwal Review Berikutnya:
${new Date(complianceCheck.nextReviewDate).toLocaleDateString('id-ID')}`;
}

function generateRequirementsResponse(query: string): string {
  const sector = query.toLowerCase().includes('konstruksi') || query.toLowerCase().includes('construction') ? 'construction' : 'general';

  const mockEntity: LegalEntity = {
    id: 'temp',
    name: 'Sample Company',
    type: 'PT',
    npwp: '',
    sector,
    subSector: '',
    region: 'Indonesia',
    establishmentDate: '',
    status: 'active'
  };

  const applicableLicenses = getLicenseRequirementsForEntity(mockEntity);

  return `# 📋 Persyaratan Perizinan untuk Sektor ${sector.toUpperCase()}

## 📄 Izin yang Diperlukan:

${applicableLicenses.map(license => `
### **${license.name}**
**Kategori**: ${license.category} | **Wajib**: ${license.mandatory ? 'Ya' : 'Tidak'}
**Otoritas**: ${license.authority}
**Dasar Hukum**: ${license.legalBasis}
**Masa Berlaku**: ${license.validityPeriod > 0 ? `${license.validityPeriod} bulan` : 'Seumur hidup'}
**Biaya Awal**: Rp ${license.fees.initial.toLocaleString('id-ID')}
**Biaya Perpanjangan**: Rp ${license.fees.renewal.toLocaleString('id-ID')}

#### Dokumen yang Diperlukan:
${license.requirements.map(req =>
  `- ${req.description} ${req.mandatory ? '(Wajib)' : '(Opsional)'}`
).join('\n')}
`).join('\n')}

## 📊 Matriks Kepatuhan:

| Izin | Wajib | Masa Berlaku | Status |
|------|-------|--------------|--------|
${applicableLicenses.map(license =>
  `| ${license.name} | ${license.mandatory ? '✅' : '❌'} | ${license.validityPeriod > 0 ? `${license.validityPeriod} bln` : '∞'} | ❌ Belum |`
).join('\n')}

## ⚡ Quick Checklist:
1. ✅ Kumpulkan semua dokumen identitas perusahaan
2. ✅ Ajukan NIB melalui OSS (Online Single Submission)
3. ✅ Ajukan SIUP ke Kementerian Perdagangan
4. ✅ Siapkan dokumen untuk SBU (jika konstruksi)
5. ✅ Persiapkan dokumen K3 dan lingkungan
6. ✅ Monitor masa berlaku dan siapkan perpanjangan

## 💡 Tips Sukses:
- **Start Early**: Proses perizinan bisa memakan waktu 1-3 bulan
- **Konsultasi**: Gunakan jasa konsultan perizinan untuk efisiensi
- **Digital**: Manfaatkan sistem OSS untuk kemudahan
- **Backup**: Simpan semua dokumen asli dan softcopy`;
}

function generateRenewalResponse(query: string): string {
  return `# 🔄 Panduan Perpanjangan Izin Usaha

## 📅 Jadwal Perpanjangan yang Perlu Diperhatikan:

### **SIUP (Surat Izin Usaha Perdagangan)**
- **Masa Berlaku**: 5 tahun
- **Pengingat Perpanjangan**: 3 bulan sebelum expired
- **Dokumen**: NIB aktif, Akta perusahaan, NPWP, Surat domisili
- **Biaya**: Rp 2.500.000
- **Prosedur**: Ajukan ke Dinas Perdagangan provinsi

### **SBU (Sertifikat Badan Usaha)**
- **Masa Berlaku**: 3 tahun
- **Pengingat Perpanjangan**: 3 bulan sebelum expired
- **Dokumen**: SIUP aktif, Daftar pengalaman, Tenaga ahli, Peralatan
- **Biaya**: Rp 3.000.000
- **Prosedur**: Ajukan ke LPJK

### **SMK3 (Sertifikat Sistem Manajemen K3)**
- **Masa Berlaku**: 3 tahun
- **Pengingat Perpanjangan**: 6 bulan sebelum expired
- **Dokumen**: Kebijakan K3, Program K3, Struktur organisasi, Pelatihan
- **Biaya**: Rp 1.000.000
- **Prosedur**: Audit dan verifikasi oleh Disnaker

## ⚠️ Risiko Jika Terlambat Perpanjang:

### **Level 1 (1-30 hari expired)**
- Denda administrasi
- Peringatan tertulis
- Masih bisa beroperasi

### **Level 2 (31-90 hari expired)**
- Denda yang lebih besar
- Pembatasan kegiatan
- Potensi penghentian sementara

### **Level 3 (>90 hari expired)**
- Pencabutan izin
- Tidak bisa mengikuti tender/proyek
- Sanksi hukum

## 📋 Checklist Perpanjangan:

1. ✅ **90 hari sebelum expired**: Persiapkan dokumen
2. ✅ **60 hari sebelum expired**: Ajukan permohonan
3. ✅ **30 hari sebelum expired**: Ikuti verifikasi/audit
4. ✅ **7 hari sebelum expired**: Bayar biaya perpanjangan
5. ✅ **Hari H**: Ambil izin baru

## 💡 Strategi Manajemen Perpanjangan:

### **Sistem Reminder**
- Setup calendar reminder 6 bulan sebelum expired
- Buat dashboard monitoring perizinan
- Assign PIC untuk setiap jenis izin

### **Dokumen Management**
- Simpan template dokumen perizinan
- Backup semua dokumen di cloud
- Lakukan audit berkala

### **Budget Planning**
- Alokasikan budget tahunan untuk perpanjangan
- Hitung biaya denda jika terlambat
- Siapkan dana darurat

### **Proses Outsourcing**
- Pertimbangkan jasa konsultan untuk renewal
- Training internal untuk pemahaman proses
- Sistem tracking progress renewal

## 🛠️ Tools yang Bisa Digunakan:
- **OSS System**: Untuk NIB dan izin terintegrasi
- **LPJK Portal**: Untuk SBU dan sertifikasi
- **Kemnaker Portal**: Untuk SMK3 dan K3
- **Project Management Software**: Untuk tracking semua deadline`;
}

function generateNIBResponse(): string {
  return `# 🏭 Nomor Induk Berusaha (NIB)

## 📋 Apa itu NIB?
NIB adalah nomor identitas berusaha yang dikeluarkan oleh BKPM untuk menggantikan berbagai izin usaha sebelumnya.

## ✅ Keuntungan NIB:
- **Satu Pintu**: Menggantikan 7 jenis izin sebelumnya
- **Berlaku Nasional**: Tidak perlu izin daerah lagi
- **Seumur Hidup**: Tidak perlu perpanjangan
- **Digital**: Terintegrasi dengan sistem OSS

## 📄 Persyaratan:
- KTP Direktur/Penanggung jawab
- Akta Pendirian Perusahaan
- NPWP Perusahaan
- Surat Keterangan Domisili
- Modal dasar minimum sesuai KBLI

## 💰 Biaya:
- **Gratis**: Tidak ada biaya pengajuan

## ⏱️ Proses:
1. Daftar akun di OSS (oss.go.id)
2. Isi data perusahaan
3. Upload dokumen
4. Pilih KBLI (Klasifikasi Baku Lapangan Usaha)
5. Submit dan tunggu verifikasi (1-3 hari)

## 🎯 KBLI untuk Konstruksi:
- 41001: Konstruksi bangunan gedung
- 42101: Konstruksi jalan dan jembatan
- 42211: Konstruksi saluran irigasi
- 42901: Konstruksi sipil lainnya

## 💡 Tips:
- **KBLI Tepat**: Pilih sesuai core business
- **Dokumen Jelas**: Pastikan scan dokumen readable
- **Data Akurat**: Hindari kesalahan penulisan
- **Backup**: Simpan PDF NIB di multiple lokasi`;
}

function generateSIUPResponse(): string {
  return `# 🏪 Surat Izin Usaha Perdagangan (SIUP)

## 📋 Fungsi SIUP:
Izin untuk melakukan kegiatan perdagangan dan jasa.

## 📊 Klasifikasi SIUP:

| Klasifikasi | Modal Minimum | Kegiatan |
|-------------|---------------|----------|
| Mikro | < Rp 50 juta | Usaha kecil |
| Kecil | Rp 50 juta - 500 juta | Usaha menengah |
| Menengah | Rp 500 juta - 10 miliar | Usaha besar |

## 📄 Persyaratan:
- NIB yang masih berlaku
- Akta Perusahaan
- NPWP Perusahaan
- Surat Keterangan Domisili
- Bukti kepemilikan tempat usaha

## 💰 Biaya:
- **Mikro**: Rp 150.000
- **Kecil**: Rp 300.000
- **Menengah**: Rp 600.000

## ⏱️ Masa Berlaku:
- **5 tahun** untuk semua klasifikasi

## 📍 Otoritas Penerbit:
- **Kementerian Perdagangan** untuk SIUP skala besar
- **Dinas Perdagangan Provinsi** untuk skala menengah ke bawah

## 💡 Strategi Pengajuan:
1. **Tentukan Klasifikasi**: Sesuai modal dan skala usaha
2. **Siapkan Dokumen**: Lengkap dan masih berlaku
3. **Domisili Jelas**: Surat keterangan dari kelurahan
4. **KBLI Sesuai**: Pastikan sesuai dengan SIUP`;
}

function generateSBUResponse(): string {
  return `# 🏗️ Sertifikat Badan Usaha (SBU)

## 📋 Fungsi SBU:
Sertifikat kompetensi badan usaha untuk konstruksi yang dikeluarkan LPJK.

## 📊 Klasifikasi SBU:

| Kualifikasi | Subklasifikasi | Syarat Pengalaman |
|-------------|----------------|-------------------|
| Besar | Konstruksi Umum | > Rp 50 miliar |
| Menengah | Spesialis | Rp 10-50 miliar |
| Kecil | Subkontraktor | Rp 2.5-10 miliar |

## 📄 Persyaratan Utama:
- SIUP yang masih berlaku
- Akta Perusahaan
- Daftar pengalaman proyek (minimal 3)
- Sertifikat tenaga ahli (Ahli Muda/Madya/Utama)
- Daftar peralatan dan mesin
- Laporan keuangan audited

## 💰 Biaya:
- **Rp 5.000.000** untuk penerbitan pertama
- **Rp 3.000.000** untuk perpanjangan

## ⏱️ Masa Berlaku:
- **3 tahun** untuk semua kualifikasi

## 📍 Proses Pengajuan:
1. **Registrasi** di sistem LPJK
2. **Upload Dokumen** sesuai checklist
3. **Verifikasi** oleh asesor LPJK
4. **Audit Lapangan** (jika diperlukan)
5. **Penerbitan** SBU

## 💡 Tips Sukses:
- **Pengalaman Relevan**: Pastikan proyek sesuai klasifikasi
- **Tenaga Ahli**: Minimal 1 Ahli Utama per bidang
- **Peralatan**: Sesuai dengan kapasitas proyek
- **Audit Siap**: Persiapkan dokumen pendukung audit`;
}

function generateSMK3Response(): string {
  return `# 🛡️ Sertifikat Sistem Manajemen Keselamatan Kerja (SMK3)

## 📋 Fungsi SMK3:
Sertifikat sistem manajemen K3 yang wajib untuk perusahaan berisiko tinggi.

## 📊 Tingkatan SMK3:

| Tingkat | Kriteria | Masa Berlaku |
|---------|----------|--------------|
| 1 | Sistem dasar | 3 tahun |
| 2 | Sistem terdokumentasi | 3 tahun |
| 3 | Sistem tersertifikasi | 3 tahun |
| 4 | Sistem berbasis risiko | 3 tahun |
| 5 | Sistem berkelanjutan | 3 tahun |

## 📄 Komponen Utama:
- **Kebijakan K3**: Komitmen manajemen
- **Struktur Organisasi K3**: PIC dan tanggung jawab
- **Program K3**: Rencana kerja tahunan
- **Prosedur Operasional**: SOP untuk kegiatan berbahaya
- **Pelatihan K3**: Minimal 8 jam per tahun per karyawan
- **Inspeksi dan Audit**: Monitoring berkala
- **Investigasi Kecelakaan**: Sistem pelaporan dan analisis

## 💰 Biaya:
- **Rp 1.500.000** untuk sertifikasi awal
- **Rp 1.000.000** untuk surveillance

## 📍 Otoritas:
- **Dinas Tenaga Kerja Provinsi**
- **Kementerian Ketenagakerjaan** untuk sertifikasi nasional

## 💡 Strategi Implementasi:
1. **Gap Analysis**: Audit internal sistem K3 existing
2. **Training**: Latih PIC K3 dan committee
3. **Dokumentasi**: Buat SOP dan form yang diperlukan
4. **Audit**: Lakukan audit internal sebelum eksternal
5. **Continuous Improvement**: Sistem review berkala`;
}

function generateGeneralLegalResponse(): string {
  return `# ⚖️ Legal & Licensing Intelligence Assistant

## 🔍 Apa yang Bisa Saya Bantu:

### **1. Pengecekan Kepatuhan**
- Analisis status perizinan perusahaan
- Identifikasi izin yang masih kurang
- Monitoring masa berlaku dan renewal
- Risiko assessment untuk compliance

### **2. Panduan Perizinan**
- **NIB**: Nomor Induk Berusaha
- **SIUP**: Surat Izin Usaha Perdagangan
- **SBU**: Sertifikat Badan Usaha
- **SMK3**: Sistem Manajemen Keselamatan Kerja
- **AMDAL/UKL-UPL**: Izin lingkungan

### **3. Persyaratan dan Prosedur**
- Dokumen yang diperlukan untuk setiap izin
- Biaya dan masa berlaku
- Otoritas penerbit dan prosedur pengajuan
- Tips sukses mendapatkan izin

### **4. Renewal Management**
- Jadwal perpanjangan izin
- Checklist dokumen renewal
- Strategi menghindari denda
- Sistem reminder otomatis

## 📊 Contoh Analisis Compliance:

**Perusahaan**: PT Konstruksi Maju Jaya
**Sektor**: Konstruksi Sipil
**Status Compliance**: 60%

### Izin Utama:
- ✅ NIB: Aktif (Seumur hidup)
- ✅ SIUP: Aktif sampai 2025
- ❌ SBU: Expired 2023 (Perlu perpanjang)
- ❌ SMK3: Belum ada (Wajib untuk konstruksi)

### Rekomendasi Prioritas:
1. Segera ajukan perpanjangan SBU
2. Dapatkan sertifikasi SMK3
3. Monitor SIUP yang akan expired 2025

## 💡 Best Practices:

1. **Proactive Approach**: Jangan tunggu expired baru ajukan perpanjangan
2. **Digital Systems**: Gunakan OSS untuk kemudahan pengajuan
3. **Document Management**: Simpan semua dokumen di sistem terorganisir
4. **Regular Audits**: Lakukan pengecekan compliance bulanan
5. **Expert Consultation**: Gunakan konsultan untuk izin kompleks

## ❓ Tanyakan Saya:

- "Apa saja izin wajib untuk perusahaan konstruksi?"
- "Bagaimana cara perpanjang SBU?"
- "Dokumen apa yang perlu untuk SIUP?"
- "Berapa biaya SMK3?"
- "Risiko apa jika izin expired?"
- "Checklist lengkap untuk NIB"

**Siap membantu Anda compliant dan legal! 🏛️**`;
}