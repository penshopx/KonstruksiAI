/**
 * Regulatory Compliance Documentation for Electrical Engineering
 * 
 * This library provides comprehensive regulatory compliance documentation
 * for electrical engineering projects in Indonesia, covering:
 * - Indonesian National Standards (SNI)
 * - PUIL (Persyaratan Umum Instalasi Listrik) 2011
 * - International Standards (IEC, ISO)
 * - Environmental regulations
 * - Safety compliance
 * 
 * Author: ConstructionAI - Expert Level Electrical Engineer
 * Created: 2026-03-09
 */

// ============================================
// REGULATORY COMPLIANCE OVERVIEW
// ============================================

export interface ComplianceRequirement {
  id: string;
  category: string;
  standard: string;
  description: string;
  requirements: string[];
  documents: string[];
  frequency: string;
  authority: string;
}

export interface ComplianceChecklist {
  projectType: string;
  phases: string[];
  requirements: ComplianceRequirement[];
}

export interface AuditItem {
  id: string;
  area: string;
  criteria: string;
  evidence: string[];
  status: "compliant" | "non-compliant" | "pending";
  notes: string;
}

// ============================================
// MAIN REGULATORY COMPLIANCE DOCUMENTATION
// ============================================

export function getRegulatoryComplianceOverview(): string {
  return `
# 📋 DOKUMENTASI KEPATUHAN REGULASI
## Dokumentasi Kepatuhan Regulasi untuk Proyek Teknik Elektro

---

## 1. TINJAUAN UMUM

Dokumentasi kepatuhan regulasi ini disusun untuk memastikan bahwa seluruh proyek teknik elektro memenuhi persyaratan yang ditetapkan oleh otoritas regulasi di Indonesia maupun standar internasional. Dokumen ini mencakup persyaratan untuk instalasi listrik, keselamatan kerja, pelestarian lingkungan, dan manajemen mutu.

### 1.1 Tujuan Dokumentasi

Tujuan utama dokumentasi kepatuhan regulasi adalah untuk:
- Memastikan kepatuhan terhadap seluruh peraturan yang berlaku
- Menyediakan panduan pelaksanaan yang jelas bagi tim proyek
- Memfasilitasi proses audit dan inspeksi oleh otoritas terkait
- Mendokumentasikan bukti kepatuhan untuk keperluan verifikasi

### 1.2 Ruang Lingkup

Dokumentasi ini mencakup:
- Proyek instalasi listrik gedung komersial dan industri
- Sistem distribusi tenaga listrik
- Instalasi penerangan dan dayanya
- Sistem proteksi dan pentanahan
- Sistem energi terbarukan (PLTS, PLTB)
- Instalasi di area berbahaya (hazardous area)

---

## 2. STANDAR DAN REGULASI UTAMA

### 2.1 Standar Nasional Indonesia (SNI)

| No | Standar | Judul | Aplikasi |
|----|---------|-------|----------|
| 1 | SNI IEC 60335-1 | Peralatan rumah tangga dan相似 - Keselamatan Bagian 1: Ketentuan umum | Semua peralatan listrik |
| 2 | SNI IEC 60364 | Instalasi listrik bangunan | Instalasi listrik gedung |
| 3 | SNI IEC 60439-1 | Rakitan switchgear dan controlgear tegangan rendah | Panel listrik |
| 4 | SNI IEC 60076 | Transformator daya | Transformator |
| 5 | SNI IEC 60034 | Mesin listrik berputar | Motor, generator |
| 6 | SNI IEC 62040 | Sistem catu daya tak terputus (UPS) | UPS |
| 7 | SNI IEC 61000 | Kompatibilitas elektromagnetik | Semua peralatan |
| 8 | SNI ISO 9001 | Sistem manajemen mutu | Manajemen proyek |
| 9 | SNI ISO 45001 | Sistem manajemen keselamatan dan kesehatan kerja | K3 |
| 10 | SNI ISO 14001 | Sistem manajemen lingkungan | Lingkungan |

### 2.2 PUIL 2011 (Persyaratan Umum Instalasi Listrik)

PUIL 2011 adalah regulasi utama untuk instalasi listrik di Indonesia yang ditetapkan oleh PLN. Berikut adalah persyaratan utama:

#### BAB 1 - Ketentuan Umum
- Semua instalasi harus dirancang dan dilaksanakan sesuai standar PUIL
- Instalasi harus memenuhi persyaratan keselamatan terhadap ancaman listrik
- Perencanaan harus mempertimbangkan kondisi lingkungan

#### BAB 2 - Ketentuan Dasar
- Pengamanan terhadap shocks listrik (proteksi langsung dan tidak langsung)
- Pengamanan terhadap efek termal
- Pengamanan terhadap arus lebih
- Pengamanan terhadap gangguan tegangan

#### BAB 3 - Ketentuan Pentanahan
- Sistem pentanahan harus memenuhi persyaratan Bab 3 PUIL
- Tahanan pentanahan maksimal 5 Ohm untuk sistem TN
- Pemeriksaan pentanahan wajib dilakukan secara berkala

#### BAB 4 - Pemeliharaan dan Pengujian
- Instalasi harus dipelihara dalam kondisi aman
- Pengujian berkala wajib dilakukan sesuai jadwal
- Hasil pengujian harus didokumentasikan

### 2.3 Peraturan Menteri ESDM

| No | Peraturan | Substansi |
|----|-----------|-----------|
| 1 | Permen ESDM No. 14/2012 | Manajemen Energi |
| 2 | Permen ESDM No. 18/2012 | Pengusahaan Ketenagalistrikan |
| 3 | Permen ESDM No. 45/2017 | Pemeliharaan dan Pengawasan Instalasi Listrik |
| 4 | Permen ESDM No. 12/2019 | Keamanan Ketenagalistrikan |
| 5 | Permen ESDM No. 28/2019 | Tarif Tenaga Listrik |
| 6 | Permen ESDM No. 4/2020 | Pengembangan Energi Terbarukan |

### 2.4 Standar Internasional

| Standar | Deskripsi | Aplikasi |
|---------|-----------|----------|
| IEC 60364 | Electrical installations of buildings | Instalasi listrik |
| IEC 61439 | Low-voltage switchgear assemblies | Panel distribusi |
| IEC 62040 | Uninterruptible power supplies | UPS |
| IEC 61000 | Electromagnetic compatibility | Kompatibilitas EM |
| ISO 9001 | Quality management systems | Mutu |
| ISO 45001 | Occupational health and safety | K3 |
| ISO 14001 | Environmental management | Lingkungan |
| NFPA 70 | National Electrical Code | Instalasi USA reference |
| BS 7671 | Requirements for electrical installations | UK standard reference |

---

## 3. PERSYARATAN KEPATUHAN PER FASE PROYEK

### 3.1 Fase Perencanaan (Design Phase)

#### Dokumen yang Diperlukan:
1. **Studi Kelayakan Listrik**
   - Analisis beban Existing dan proyeksi
   - Ketersediaan daya dari grid
   - Rekomendasi kapasitas

2. **Desain Sistem Elektrik**
   - Single line diagram
   - Layout instalasi
   - Spesifikasi material
   - Perhitungan teknis (short circuit, voltage drop, coordination)

3. **Dokumen Lingkungan**
   - AMDAL/UKL-UPL untuk proyek besar
   - Analisis dampak lingkungan
   - Rencana pengelolaan lingkungan

4. **Izin dan Persetujuan**
   - Ijin prinsip dari Pemda
   - Rekomendasi dari PLN
   - Persetujuan from Dinas Perizinan

#### Checklist Kepatuhan Fase Desain:
- [ ] Desain memenuhi PUIL 2011
- [ ] Desain sesuai SNI IEC yang berlaku
- [ ] Perhitungan teknis sudah diverifikasi
- [ ] Spesifikasi material sesuai standar
- [ ] Environmental permit sudah diurus
- [ ] Safety design sudah terintegrasi

### 3.2 Fase Pengadaan (Procurement Phase)

#### Persyaratan Vendor/Supplier:
1. **Kualifikasi Vendor**
   - Sertifikat SNI untuk produk wajib SNI
   - Sertifikasi ISO 9001 (lebih disukai)
   - track record proyek serupa
   - Layanan purna jual

2. **Dokumen Material**
   - Certificate of Origin
   - Test report dari laboratorium terakreditasi
   - Komformitas CE/UL (jika applicable)
   - Garansi sertifikat

3. **Quality Control**
   - Inspection and Test Plan (ITP)
   - Vendor inspection witnesses
   - Pre-shipment inspection

#### Checklist Kepatuhan Fase Pengadaan:
- [ ] Vendorterpilih memenuhi kualifikasi
- [ ] Material memiliki sertifikat yang valid
- [ ] Test reports dari laboratorium terakreditasi
- [ ] Dokumentasi lengkap untuk setiap material
- [ ] QC procedures sudah agreed

### 3.3 Fase Konstruksi (Construction Phase)

#### Persyaratan Instalasi:
1. **Standar Pelaksanaan**
   - Semua instalasi harus sesuai gambar desain
   - Menggunakan material yang sudah disetujui
   - Teknisi bersertifikat Kompetensi Listrik (SKT/SKI)

2. **Pengawasan Konstruksi**
   - Electrical Supervisor dari kontraktor
   - Electrical Inspector dari konsultan MK
   - Witness testing dari owner/representative

3. **Dokumentasi Konstruksi**
   - Daily progress reports
   - Material delivery reports
   - Inspection requests
   - Non-conformance reports (NCR)

#### Checklist Kepatuhan Fase Konstruksi:
- [ ] Kontraktor memiliki IUJK yang valid
- [ ] Teknisi memiliki Sertifikat Kompetensi
- [ ] Pekerjaan sesuai gambar desain
- [ ] Pengawasan dilakukan sesuai ITP
- [ ] NCR sudah di-resolve sebelum closing

### 3.4 Fase Komisioning (Commissioning Phase)

#### Kegiatan Komisioning:
1. **Pre-Commissioning**
   - Visual inspection
   - Continuity test
   - Insulation resistance test
   - Earth resistance test

2. **Commissioning Tests**
   - Load test
   - Protection coordination test
   - Functional test
   - Performance test

3. **Dokumentasi Komisioning**
   - Commissioning test reports
   - As-built drawings
   - Operation and Maintenance manuals
   - Final acceptance protocol

#### Checklist Kepatuhan Fase Komisioning:
- [ ] Semua pengujian sudah dilakukan
- [ ] Hasil pengujian memenuhi standar
- [ ] O&M manuals sudah diterima
- [ ] As-built drawings sudah di-update
- [ ] Training operator sudah dilakukan

### 3.5 Fase Operasi dan Pemeliharaan (O&M Phase)

#### Persyaratan Berkelanjutan:
1. **Pemeliharaan Berkala**
   - Jadwal pemeliharaan Preventif
   - Jadwal pemeliharaan Korektif
   - penggantian consumables

2. **Inspeksi Berkala**
   - Inspeksi visual bulanan
   - Pengujian berkala (tahunan)
   - Thermography survey
   - Electrical audit

3. **Pelaporan**
   - Laporan pemeliharaan bulanan
   - Laporan insiden/tidak standar
   - Laporan ke pihak berwenang (jika diperlukan)

#### Checklist Kepatuhan Fase O&M:
- [ ] Jadwal pemeliharaan berjalan sesuai rencana
- [ ] Rekaman pemeliharaan lengkap
- [ ] Inspeksi berkala dilakukan
- [ ] Laporan compliance submitted
- [ ] Personel terlatih dan bersertifikat

---

## 4. PERSYARATAN KESELAMATAN DAN K3

### 4.1 Sistem Manajemen K3

#### Kebijakan K3:
- Komitmen manajemen puncak
- Identifikasi hazards dan risiko
- Prosedur kerja aman
- Pelatihan K3
- Inspeksi dan audit

#### Dokumen K3 yang Diperlukan:
1. **Rencana K3 (RKK)**
   - Identifikasi risiko pekerjaan listrik
   - Langkah-langkah mitigasi
   - Prosedur darurat

2. **Prosedur Kerja Aman (JK3)**
   - Prosedur Lock Out Tag Out (LOTO)
   - Prosedur kerja dengan tegangan
   - Prosedur kerja di ketinggian
   - Prosedur confined space

3. **Alat Pelindung Diri (APD)**
   - Helm keselamatan
   - Sarung tangan isolat
   - Sepatu safety
   - Kacamata safety
   - Rompi reflektif

### 4.2 Pelatihan dan Sertifikasi

#### Sertifikasi Wajib:
| No | Jenis Pelatihan | Penerbit | Frekuensi |
|----|----------------|----------|-----------|
| 1 | Kompetensi Listrik (SKT/SKI) | DISNAKER | 3 tahun |
| 2 | K3 Listrik | Kemnaker | 3 tahun |
| 3 | Pertolongan Pertama (P3K) | PMI/Kemnaker | 3 tahun |
| 4 | Pemadam Kebakaran | DISHUBK | Tahunan |
| 5 | Operator Alat Berat | DISNAKER | Tahunan |

### 4.3 Inspeksi dan Audit K3

#### Jadwal Inspeksi:
- **Harian**: Kondisi APD, alat kerja
- **Mingguan**: Kebersihan area, penandaan
- **Bulanan**: Sistem darurat, first aid
- **Tahunan**: Audit K3 internal

---

## 5. PERSYARATAN LINGKUNGAN

### 5.1 Peraturan Lingkungan Utama

#### Dokumen Lingkungan:
1. **AMDAL (Analisis Mengenai Dampak Lingkungan)**
   - Untuk proyek besar (>10 MW, >50 Ha)
   - Proses konsultasi publik
   - Persetujuan dari KLHK

2. **UKL-UPL (Upaya Pengelolaan Lingkungan - Upaya Pemantauan Lingkungan)**
   - Untuk proyek menengah
   - Persetujuan dari Dinas LH Pemda

3. **SPPL (Surat Pernyataan Pengelolaan Lingkungan)**
   - Untuk proyek kecil
   - Registrasi online

### 5.2 Pengelolaan Limbah

#### Jenis Limbah Listrik:
| Jenis Limbah | Kode | Pengelolaan |
|--------------|------|-------------|
| Logam berat (Pb, Cd, Hg) | B101 | Limbah B3 - Vendor tersertifikasi |
| Kabel dan copper scrap | D--metal | Recycle |
| Olie transformator | B102 | Limbah B3 - Regenerasi |
| Batterai | B104 | Limbah B3 - Vendor tersertifikasi |
| Lampu TL/LED | B111 | Limbah B3 - Recycle |

### 5.3 Efisiensi Energi

#### Persyaratan:
- Menggunakan peralatan dengan label daya tinggi (Star Rating)
- Sistem pencahayaan LED
- Sensor occupancy untuk area tidak sering dipakai
- Monitoring energi real-time
- Laporan audit energi berkala

---

## 6. DOKUMENTASI DAN REKAMAN

### 6.1 Daftar Dokumen Wajib

#### Dokumen Desain:
- Single line diagram
- Schematic diagrams
- Layout drawings
- Cable schedules
- Equipment schedules
- Calculation sheets

#### Dokumen Konstruksi:
- ITP (Inspection and Test Plan)
- Inspection reports
- Test results
- NCR register
- As-built drawings

#### Dokumen Komisioning:
- Commissioning schedule
- Pre-commissioning checklists
- Commissioning test results
- Performance test results
- Final acceptance certificate

#### Dokumen O&M:
- Operation manuals
- Maintenance schedules
- Maintenance logs
- Emergency procedures
- Safety Data Sheets (SDS)

### 6.2 Sistem Filing dan Penyimpanan

#### Persyaratan Penyimpanan:
- **Digital**: Server/cloud dengan backup harian
- **Fisik**: Filing cabinet tahan api
- **Retention Period**: Minimal 10 tahun atau sesuai regulasi
- **Akses**: Terkontrol dengan log access

### 6.3 Standar Pelaporan

#### Laporan Berkala:
| Laporan | Frekuensi | Penerima |
|---------|-----------|----------|
| Laporan K3 | Bulanan | Manajemen, Disnaker |
| Laporan Pemeliharaan | Bulanan | Manajemen |
| Laporan Compliance | Tahunan | Regulators |
| Laporan Lingkungan | Tahunan | DLH |
| Laporan Audit | Tahunan | Manajemen |

---

## 7. PERSIAPAN AUDIT DAN INSPEKSI

### 7.1 Persiapan Audit Internal

#### Langkah Persiapan:
1. **Review Dokumen**
   - Semua prosedur dan instruksi kerja
   - Rekaman compliance
   - Laporan audit sebelumnya

2. **Identifikasi Non-Conformance**
   - Review NCR register
   - Verifikasi corrective actions
   - Gap analysis

3. **Simulasi Audit**
   - Interview simulation
   - Document walkthrough
   - Site tour rehearsal

### 7.2 Persiapan Audit Eksternal

#### Audit yang Umum:
1. **Audit dari PLN**
   - Kepatuhan PUIL
   - Sistem proteksi
   - Pentanahan

2. **Audit dari Disnaker**
   - K3 compliance
   - Sertifikasi pekerja
   - APD

3. **Audit dari DLH**
   - Limbah B3
   - Ijin lingkungan
   - Pelaporan

4. **Audit Sertifikasi**
   - ISO 9001 surveillance
   - ISO 45001 surveillance
   - ISO 14001 surveillance

### 7.3 Checklist Audit

#### Dokumen yang Harus Siap:
- [ ] Quality manual dan prosedur
- [ ] Records of training
- [ ] Equipment maintenance records
- [ ] Test and inspection records
- [ ] Non-conformance reports
- [ ] Corrective action records
- [ ] Management review minutes
- [ ] Internal audit reports
- [ ] Contracts and agreements
- [ ] Permits and licenses

#### Site yang Harus Siap:
- [ ] Area kerja bersih dan aman
- [ ] Penandaan dan signage lengkap
- [ ] APD tersedia dan digunakan
- [ ] Emergency equipment berfungsi
- [ ] First aid kit lengkap
- [ ] Fire extinguishers terinspeksi

---

## 8. TABEL REFERENSI CEPAT

### 8.1 Standar SNI untuk Peralatan Listrik

| Peralatan | Standar SNI | Standar IEC |
|-----------|-------------|-------------|
| Kabel NYY | SNI IEC 60227 | IEC 60227 |
| Kabel NYM | SNI IEC 60227 | IEC 60227 |
| Kabel XLPE | SNI IEC 60502 | IEC 60502 |
| MCCB | SNI IEC 60898 | IEC 60898 |
| MCB | SNI IEC 60898 | IEC 60898 |
| Kontaktor | SNI IEC 60947-4-1 | IEC 60947-4-1 |
| Transformator | SNI IEC 60076 | IEC 60076 |
| Motor Listrik | SNI IEC 60034 | IEC 60034 |
| Lampu LED | SNI IEC 62560 | IEC 62560 |
| Panel Listrik | SNI IEC 61439 | IEC 61439 |

### 8.2 Frekuensi Pengujian Berkala

| Peralatan | Pengujian | Frekuensi |
|-----------|-----------|-----------|
| Installasi Gedung | Insulation Resistance | 1 tahun |
| Installasi Gedung | Earth Resistance | 1 tahun |
| Transformator | Oil Quality | 1 tahun |
| Transformator | Turns Ratio | 5 tahun |
| Generator | Load Test | 6 bulan |
| Panel Listrik | Thermography | 1 tahun |
| UPS | Battery Discharge | 6 bulan |
| Grounding System | Earth Resistance | 1 tahun |
| Lightning Rod | Continuity | 1 tahun |
| Emergency System | Load Test | 6 bulan |

### 8.3 Kategori Proyek dan Izin

| Kategori Proyek | Izin Diperlukan |
|-----------------|-----------------|
| >10 MW | IUPL, AMDAL, IUPTL |
| 1-10 MW | UKL-UPL, IUPTL |
| <1 MW | SPPL, PK (Penyaluran) |
| Komersial >5000m² | IUJK, UKL-UPL |
| Komersial <5000m² | IUJK, SPPL |
| Residensial >100 unit | IUJK, UKL-UPL |
| Residensial <100 unit | IUJK, SPPL |

---

## 9. KONTAK OTORITAS REGULASI

### 9.1 Instansi Pemerintah Terkait

| Instansi | Bidang | Website |
|----------|--------|---------|
| Kemnaker | K3 dan Tenaga Kerja | https://www.kemnaker.go.id |
| ESDM | Ketenagalistrikan | https://www.esdm.go.id |
| PLN | Instalasi Listrik | https://www.pln.co.id |
| BSN | Standar Nasional | https://www.bsn.go.id |
| DLH | Lingkungan | https://www.menlhk.go.id |
| Disnaker.Local | K3 Daerah | [Sesuai Wilayah] |

### 9.2 Laboratorium Pengujian Terakreditasi

| Laboratorium | Lokasi | Akreditasi |
|--------------|--------|-------------|
| PLN Pusat UPT | Jakarta | KAN |
| LIPI | Jakarta | KAN |
| ITS | Surabaya | KAN |
| ITB | Bandung | KAN |
| B4T | Bandung | KAN |

---

## 10. PENUTUP

Dokumentasi kepatuhan regulasi ini harus digunakan sebagai panduan dalam pelaksanaan proyek teknik elektro. Seluruh aktivitas proyek harus符合 dengan persyaratan yang ditetapkan dalam dokumen ini.

### Tanggung Jawab:

- **Project Manager**: Kepemimpinan dan koordinasi keseluruhan
- **Electrical Engineer**: Desain dan spesifikasi teknis
- **Kontraktor**: Pelaksanaan sesuai desain dan standar
- **Safety Officer**: K3 compliance
- **QA/QC**: Quality assurance dan dokumentasi

### Review dan Update:

Dokumen ini harus direview secara berkala minimal setiap tahun atau apabila ada perubahan regulasi. Seluruh update harus didokumentasikan dalam change log.

---

**Dokumen ini disusun berdasarkan:**
- PUIL 2011 (Persyaratan Umum Instalasi Listrik)
- SNI IEC 60364, SNI IEC 61439, SNI IEC 60076
- ISO 9001:2015, ISO 45001:2018, ISO 14001:2015
- Permen ESDM No. 14, 18, 45, 12, 28, 4 Tahun 2012-2020
- NFPA 70, BS 7671 (referensi internasional)

---

🤖 Would You Like Me To Evaluate This Work ☝ and Provide Options to Improve It? Yes or No?
`;
}

// ============================================
// COMPLIANCE BY PROJECT TYPE
// ============================================

export function getCommercialBuildingCompliance(): string {
  return `
# 📋 DOKUMENTASI KEPATUHAN REGULASI - GEDUNG KOMERSIAL

---

## 1. RUANG LINGKUP

Dokumen ini mencakup persyaratan kepatuhan regulasi untuk proyek gedung komersial termasuk:
- Kantor dan写字楼
- Pusat perbelanjaan (Mall)
- Hotel dan resort
- Rumah sakit
- Apartemen dan kondominium

---

## 2. PERSYARATAN KHUSUS

### 2.1 Sistem Listrik

| Komponen | Standar | Persyaratan |
|----------|---------|-------------|
| Distribusi Utama | PUIL Bab 3 | Tegangan 20kV, kapasitas sesuai beban |
| Distribusi Daya | PUIL Bab 4 | Radial atau distribusi kota |
| Penerangan | SNI IEC 60598 | Lux sesuai fungsi ruang |
| Emergency Lighting | SNI IEC 60598-2-22 | 1.5 lux minimum |
| Fire Alarm | SNI NFPA 72 | Sistem addressable |

### 2.2 Kategori Kelistrikan

| Kategori | Definisi | Redundansi |
|----------|----------|------------|
| Kritikal | ICU, Server room, Data center | N+1 atau 2N |
| Esensial | Lift, Pompa fire, Emergency lighting | N |
| Normal | Penerangan umum, AC, Outlet | Single |

### 2.3 Izin dan Sertifikasi

- IUJK (Izin Usaha Jasa Konstruksi)
- Sertifikat Laik Operasi (SLO) dari PLN
- Sertifikat Pemeriksaan Periodik
- Tanda Daftar Perusahaan (TDP)
- NPWP dan dokumen pajak

---

## 3. CHECKLIST KEPATUHAN

### Fase Perencanaan:
- [ ] Desain sesuai PUIL 2011
- [ ] Perhitungan beban terverifikasi
- [ ] Single line diagram disetujui
- [ ] Koordinasi dengan PLN
- [ ] Environmental permit

### Fase Konstruksi:
- [ ] Kontraktor bersertifikat
- [ ] Material sesuai spesifikasi
- [ ] Pengawasan MK
- [ ] Testing sesuai ITP
- [ ] Dokumentasi lengkap

### Fase Komisioning:
- [ ] Semua test passed
- [ ] SLO dari PLN
- [ ] As-built drawings
- [ ] O&M manuals
- [ ] Training completed

### Fase Operasi:
- [ ] Pemeliharaan berkala
- [ ] Inspeksi berkala
- [ ] Laporan compliance
- [ ] Renew certificates

---

## 4. STANDAR KHUSUS GEDUNG KOMERSIAL

### 4.1 Persyaratan Lift
- Sertifikasi KAN untuk lift
- Test load 125% kapasitas
- Emergency rescue procedure
- Pemeliharaan bulanan

### 4.2 Persyaratan Fire Protection
- Fire pump dengan backup diesel
- Hydrant dan sprinkler
- Emergency exit dengan pencahayaan
- Alarm system terinterkoneksi

### 4.3 Persyaratan HVAC
- Energy efficiency ratio (EER) minimum
- Maintenance access
- Filter replacement schedule

---

🤖 Would You Like Me To Evaluate This Work ☝ and Provide Options to Improve It? Yes or No?
`;
}

export function getIndustrialPlantCompliance(): string {
  return `
# 📋 DOKUMENTASI KEPATUHAN REGULASI - PABRIK/INDUSTRI

---

## 1. RUANG LINGKUP

Dokumen ini mencakup persyaratan kepatuhan regulasi untuk proyek pabrik dan industri termasuk:
- Pabrik manufaktur
- Pabrik pengolahan
- Warehouse dan logistic center
- Pabrik EBT (Energi Terbarukan)

---

## 2. PERSYARATAN KHUSUS

### 2.1 Sistem Distribusi

| Komponen | Standar | Persyaratan |
|----------|---------|-------------|
| Gardu Induk | PUIL, SNI IEC 60076 | Kapasitas N+1 |
| Trafo Distribusi | SNI IEC 60076 | Oil atau dry type |
| MDP | SNI IEC 61439 | Breaking capacity Icu |
| SDS | SNI IEC 61439 | Selective coordination |

### 2.2 Daya dan Beban

| Kategori Beban | Prioritas | Backup |
|----------------|-----------|--------|
| Produksi Utama | 1 | Generator |
| Safety Critical | 1 | UPS + Generator |
| Utilitas | 2 | Generator |
| Kantor | 3 | Grid |

### 2.3 Area Berbahaya (Hazardous Area)

#### Klasifikasi Zona:
| Zona | Definisi | Contoh Area |
|------|----------|-------------|
| Zone 0 | Explosive gas continuously | Tangki bahan bakar |
| Zone 1 | Explosive gas occasionally | Area pengecatan |
| Zone 2 | Explosive gas abnormal | Sekitar tanki |
| Zone 20 | Dust explosive continuously | Silo flour |
| Zone 21 | Dust explosive occasionally | Area grinding |
| Zone 22 | Dust explosive abnormal | Sekitar silo |

#### Equipment untuk Hazardous Area:
- EX-Proof equipment
- Increased safety equipment
- Non-sparking equipment

---

## 3. PERSYARATAN K3 INDUSTRI

### 3.1 Identifikasi Bahaya

| Hazards | Sumber | Mitigasi |
|---------|--------|----------|
| Electric shock | Overhead lines, panel | Grounding, PPE |
| Arc flash | Switchgear | Remote operation, PPE |
| Fire | Kabel, equipment | Fire detection, suppression |
| Explosion | Gas, dust | ATEX/IECEx equipment |

### 3.2 Prosedur LOTO

Lock Out Tag Out wajib untuk:
- Maintenance transformator
- Maintenance switchgear
- Maintenance motor besar
- Isolasi sistem distribusi

---

## 4. PERSYARATAN LINGKUNGAN

### 4.1 Limbah B3

| Jenis Limbah | Kode | Pengelolaan |
|--------------|------|-------------|
| Olie bekas | B102 | Vendor berizin |
| Filter oli | B101 | Vendor berizin |
| Batterai bekas | B104 | Vendor berizin |
| Lampu bekas | B111 | Recycling |

### 4.2 Emisi

- Stack monitoring
- Air quality monitoring
- Noise monitoring

---

🤖 Would You Like Me To Evaluate This Work ☝ and Provide Options to Improve It? Yes or No?
`;
}

export function getRenewableEnergyCompliance(): string {
  return `
# 📋 DOKUMENTASI KEPATUHAN REGULASI - ENERGI TERBARUKAN

---

## 1. RUANG LINGKUP

Dokumen ini mencakup persyaratan kepatuhan regulasi untuk proyek energi terbarukan:
- PLTS (Pembangkit Listrik Tenaga Surya)
- PLTB (Pembangkit Listrik Tenaga Angin)
- PLTMH (Pembangkit Listrik Tenaga Mikro Hydro)
- Biomass dan Biogas

---

## 2. PERSYARATAN UTAMA

### 2.1 Regulasi EBT

| Regulasi | Nomor | Substansi |
|----------|-------|-----------|
| Permen ESDM No. 4/2020 | PLTS >10 MW | Mandatory |
| Permen ESDM No. 50/2017 | EBT 23% target | Mixing obligation |
| Permen ESDM No. 14/2012 | Energy Management | Audit wajib |

### 2.2 Izin EBT

| Kapasitas | Izin Diperlukan |
|-----------|-----------------|
| >10 MW | IUPTL (Izin Usaha Penyediaan Tenaga Listrik) |
| 1-10 MW | IUPTL skala kecil |
| <1 MW | Registrasi PLTS Atap |

### 2.3 Standar Teknis PLTS

| Komponen | Standar | Persyaratan |
|----------|---------|-------------|
| Modul Surya | SNI IEC 61215 | Sertifikasi SNI |
| Inverter | SNI IEC 62109 | Grid code compliance |
| Mounting | SNI 6389:2020 | Struktural |
| Protection | PUIL, SNI IEC 60364 | Anti-islanding |

---

## 3. PERSYARATAN INTERKONEKSI

### 3.1 Grid Code Compliance

| Parameter | Standar PLN | Tolerance |
|-----------|-------------|-----------|
| Voltage | 380V/20kV | ±5% |
| Frequency | 50 Hz | ±0.5 Hz |
| THD | <5% | IEEE 519 |
| Power Factor | >0.85 | Lagging |

### 3.2 Proteksi Interkoneksi

| Proteksi | Fungsi |
|----------|--------|
| Under/Over Voltage | Isolation saat abnormal |
| Under/Over Frequency | Anti-islanding |
| Anti-islanding | Trip saat grid failure |
| Synchronizing | Coordinated connection |

---

## 4. PERSYARATAN AMDAL/UKL-UPL

### 4.1 PLTS >10 MW

- Wajib AMDAL
- Studi dampak lingkungan lengkap
- Konsultasi publik
- Persetujuan KLHK

### 4.2 PLTS 1-10 MW

- Wajib UKL-UPL
- Rekomendasi DLH Provinsi
- Pengelolaan lingkungan

### 4.3 PLTS Atap <10 kW

- SPPL sederhana
- Registrasi online

---

🤖 Would You Like Me To Evaluate This Work ☝ and Provide Options to Improve It? Yes or No?
`;
}

// ============================================
// GET RESPONSE BY KEYWORD
// ============================================

export function getRegulatoryComplianceResponse(query: string): string {
  const q = query.toLowerCase();
  
  // Check for specific project types
  if (q.includes("gedung") || q.includes("komersial") || q.includes("mall") || q.includes("apartemen") || q.includes("hotel") || q.includes("building") || q.includes("commercial")) {
    return getCommercialBuildingCompliance();
  }
  
  if (q.includes("industri") || q.includes("pabrik") || q.includes("manufactur") || q.includes("factory") || q.includes("warehouse") || q.includes("plant")) {
    return getIndustrialPlantCompliance();
  }
  
  if (q.includes("ebt") || q.includes("terbarukan") || q.includes("plts") || q.includes("surya") || q.includes("solar") || q.includes("angin") || q.includes("wind") || q.includes("biomass") || q.includes("hydro") || q.includes("renewable")) {
    return getRenewableEnergyCompliance();
  }
  
  // Default: Return full compliance overview
  return getRegulatoryComplianceOverview();
}
