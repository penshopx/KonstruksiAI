// ============================================================
// KonstruksiAI - Test Reports Library
// Comprehensive electrical test reports for Indonesian standards
// ============================================================

export function getTestReportsResponse(): string {
  return `---

# LAPORAN PENGUJIAN INSTALASI LISTRIK
## TEST REPORTS DOCUMENT - ELECTRICAL INSTALLATION

---

## 1. INFORMASI PROYEK / PROJECT INFORMATION

| Parameter | Detail |
|-----------|--------|
| **Nama Proyek** | [Nama Proyek] |
| **Lokasi** | [Alamat Lengkap] |
| **Pemilik Proyek** | [Nama Pemilik] |
| **Kontraktor Listrik** | [Nama Kontraktor] |
| **Nomor Kontrak** | [Nomor Kontrak] |
| **Tanggal Pengujian** | [DD/MM/YYYY] |
| **Nomor Laporan** | [TR/YYYY/XXXX] |

---

## 2. RUANG LINGKUP PENGUJIAN / TESTING SCOPE

### 2.1 Cakupan Pekerjaan / Work Scope

Pengujian dilakukan untuk instalasi listrik dengan spesifikasi berikut:

| Kategori | Spesifikasi |
|----------|-------------|
| **Tegangan Nominal** | 220/380V, 50Hz |
| **Jenis Instalasi** | Gedung Komersial/Industri/Residential |
| **Kapasitas Panel Utama** | [xxx] kVA |
| **Jumlah Lantai** | [x] Lantai |
| **Luas Bangunan** | [x.xxx] m² |
| **Daya Terpasang** | [xxx] kVA |
| **Daya Tersedia** | [xxx] kVA |

### 2.2 Sistem yang Diuji / Systems Tested

- [ ] Sistem Distribusi Utama (Main Distribution System)
- [ ] Panel Distribusi (Distribution Panels)
- [ ] Sistem Proteksi (Protection System)
- [ ] Sistem Grounding (Grounding System)
- [ ] Instalasi Penerangan (Lighting Installation)
- [ ] Instalasi Stop Kontak (Socket Outlet Installation)
- [ ] Sistem AC (Air Conditioning System)
- [ ] Generator Set (Emergency Power)
- [ ] UPS (Uninterruptible Power Supply)

---

## 3. REFERENSI STANDAR / REFERENCE STANDARDS

Pengujian dilakukan berdasarkan standar berikut:

| Standar | Deskripsi |
|---------|-----------|
| **PUIL 2011** | Persyaratan Umum Instalasi Listrik |
| **SNI IEC 60364** | Electrical Installations of Buildings |
| **SNI IEC 61850** | Communication Networks and Systems |
| **IEC 60335** | Household and Similar Electrical Appliances |
| **IEC 61010** | Safety Requirements for Electrical Equipment |
| **IEC 61557** | Electrical Safety in Low Voltage Distribution Systems |
| **ISO 9001** | Quality Management Systems |
| **SNI ISO 45001:2018** | Sistem Manajemen Keselamatan dan Kesehatan Kerja |

---

## 4. PERALATAN UJI / TEST EQUIPMENT

| No | Nama Peralatan | Merk/Model | No. Sertifikat | Tanggal Kalibrasi |
|----|----------------|------------|-----------------|-------------------|
| 1 | Earth Resistance Tester | Kyoritsu 4105A | CAL/2024/001 | 15/01/2025 |
| 2 | Insulation Tester | Kyoritsu 3165 | CAL/2024/002 | 15/01/2025 |
| 3 | Digital Multimeter | Fluke 87V | CAL/2024/003 | 20/01/2025 |
| 4 | Clamp Meter | Fluke 323 | CAL/2024/004 | 20/01/2025 |
| 5 | Loop Impedance Tester | Kyoritsu 4141 | CAL/2024/005 | 25/01/2025 |
| 6 | RCD Tester | Kyoritsu 5406A | CAL/2024/006 | 25/01/2025 |
| 7 | High Voltage Tester | High Voltage Inc. HVA-100 | CAL/2024/007 | 01/02/2025 |
| 8 | Power Quality Analyzer | Fluke 435-II | CAL/2024/008 | 01/02/2025 |

**Catatan:** Semua peralatan telah dikalibrasi dan bersertifikat kalibrasi yang berlaku.

---

## 5. PROSEDUR PENGUJIAN / TESTING PROCEDURES

### 5.1 Pengujian Tahanan Isolasi / Insulation Resistance Test

#### 5.1.1 Tujuan / Purpose
Mengukur tahanan isolasi antara konduktor aktif dengan ground, dan antar konduktor untuk memastikan tidak ada kebocoran arus yang berbahaya.

#### 5.1.2 Metode / Method
- Tegangan uji: 500V DC untuk instalasi 220V/380V
- Durasi pengujian: 1 menit
- Kondisi: Semua beban terputus

#### 5.1.3 Kriteria Penerimaan / Acceptance Criteria
- Tahanan isolasi minimum: 1 MΩ
- Untuk circuit dengan panjang > 100m: minimum 0.5 MΩ
- Indeks Polarisasi (PI) > 1.5

#### 5.1.4 Hasil Pengujian / Test Results

| No | Lokasi/Rangkaian | Tegangan Uji (V DC) | Hasil (MΩ) | Status |
|----|------------------|-------------------|------------|--------|
| 1 | Panel Utama - Input | 500 | > 500 | PASS |
| 2 | Rangkaian Penerangan Lantai 1 | 500 | 250 | PASS |
| 3 | Rangkaian Penerangan Lantai 2 | 500 | 280 | PASS |
| 4 | Rangkaian Stop Kontak Lantai 1 | 500 | 200 | PASS |
| 5 | Rangkaian Stop Kontak Lantai 2 | 500 | 220 | PASS |
| 6 | Panel Distribusi Lt.1 | 500 | > 500 | PASS |
| 7 | Panel Distribusi Lt.2 | 500 | > 500 | PASS |
| 8 | Rangkaian AC | 500 | 180 | PASS |
| 9 | Generator Set | 500 | > 500 | PASS |
| 10 | UPS System | 500 | > 500 | PASS |

### 5.2 Pengujian Kontinuitas Grounding / Grounding Continuity Test

#### 5.2.1 Tujuan / Purpose
Memastikan semua bagian konduktif yang dapat disentuh terhubung dengan baik ke sistem grounding.

#### 5.2.2 Metode / Method
- Menggunakan ohmmeter dengan resolusi 0.01Ω
- Mengukur resistansi dari terminal grounding ke bodi peralatan

#### 5.2.3 Kriteria Penerimaan / Acceptance Criteria
- Resistansi grounding < 5Ω untuk sistem TN
- Resistansi grounding < 10Ω untuk sistem TT
- Drop voltage < 50V pada saat fault

#### 5.2.4 Hasil Pengujian / Test Results

| No | Titik Ukur | Nilai R (Ω) | Batas Maks (Ω) | Status |
|----|------------|-------------|----------------|--------|
| 1 | Panel Utama | 0.8 | 5 | PASS |
| 2 | Panel Distribusi Lt.1 | 1.2 | 5 | PASS |
| 3 | Panel Distribusi Lt.2 | 1.5 | 5 | PASS |
| 4 | Transformator | 2.1 | 5 | PASS |
| 5 | Generator Set | 2.8 | 5 | PASS |
| 6 | UPS | 1.8 | 5 | PASS |
| 7 | AC Central | 2.3 | 5 | PASS |
| 8 | MCB Utama | 0.5 | 5 | PASS |
| 9 | Copper Busbar | 0.3 | 5 | PASS |
| 10 | Electrode Grounding | 4.2 | 5 | PASS |

### 5.3 Pengujian Tahanan Elektroda Grounding / Earth Resistance Test

#### 5.3.1 Tujuan / Purpose
Mengukur resistansi sistem grounding terhadap bumi.

#### 5.3.2 Metode / Method
- Metode 3-pole (Wenner) atau Fall of Potential
- Jarak elektroda uji: 20m dari elektroda grounding

#### 5.3.3 Kriteria Penerimaan / Acceptance Criteria
- Resistansi elektroda grounding < 5Ω
- Untuk sistem proteksi petir < 10Ω

#### 5.3.4 Hasil Pengujian / Test Results

| No | Lokasi Elektroda | Metode | Nilai R (Ω) | Batas Maks (Ω) | Status |
|----|------------------|--------|-------------|----------------|--------|
| 1 | Elektroda Utama Building A | 3-Pole | 2.8 | 5 | PASS |
| 2 | Elektroda Utama Building B | 3-Pole | 3.2 | 5 | PASS |
| 3 | Elektroda Panel Utama | 3-Pole | 1.9 | 5 | PASS |
| 4 | Elektroda Proteksi Petir | 3-Pole | 4.5 | 10 | PASS |
| 5 | Elektroda UPS Room | 3-Pole | 2.1 | 5 | PASS |

### 5.4 Pengujian Loop Impedansi / Loop Impedance Test

#### 5.4.1 Tujuan / Purpose
Memastikan impedansi loop fault cukup rendah untuk memastikan kerja proteksi dalam waktu yang dipersyaratkan.

#### 5.4.2 Metode / Method
- Menggunakan loop impedance tester
- MengukurZS (Impedansi Sumber) dan Ze (Impedansi Eksternal)

#### 5.4.3 Kriteria Penerimaan / Acceptance Criteria
- Waktu pemutusan maksimum: 0.4 detik untuk 230V (TN)
- Zs x Ia ≤ Uo (dimana Ia adalah arus pemutus)

#### 5.4.4 Hasil Pengujian / Test Results

| No | Lokasi | Zs (Ω) | Uo (V) | Ia (A) | Zs x Ia | Status |
|----|--------|--------|--------|--------|---------|--------|
| 1 | Panel Utama | 0.35 | 230 | 32 | 11.2 | PASS |
| 2 | Panel Lt.1 | 0.42 | 230 | 32 | 13.4 | PASS |
| 3 | Panel Lt.2 | 0.48 | 230 | 32 | 15.4 | PASS |
| 4 | Socket Lt.1 | 0.55 | 230 | 32 | 17.6 | PASS |
| 5 | Socket Lt.2 | 0.62 | 230 | 32 | 19.8 | PASS |
| 6 | AC 5000W | 0.38 | 230 | 32 | 12.2 | PASS |
| 7 | Lighting Circuit | 0.72 | 230 | 10 | 7.2 | PASS |

### 5.5 Pengujian RCD (Residual Current Device)

#### 5.5.1 Tujuan / Purpose
Memastikan RCD berfungsi dengan benar dan waktu pemutusannya sesuai standar.

#### 5.5.2 Metode / Method
- Menggunakan RCD tester
- Mengukur waktu pemutusan pada arus nominal 30mA dan 300mA

#### 5.5.3 Kriteria Penerimaan / Acceptance Criteria
- Waktu pemutusan pada 1xIΔn: < 300ms
- Waktu pemutusan pada 5xIΔn: < 40ms
- Tidak ada gagal-trip pada arus 0.5xIΔn

#### 5.5.4 Hasil Pengujian / Test Results

| No | Lokasi | Tipe | IΔn (mA) | Waktu 1xIΔn (ms) | Waktu 5xIΔn (ms) | Status |
|----|--------|------|-----------|------------------|------------------|--------|
| 1 | Panel Utama | Type A | 30 | 28 | 12 | PASS |
| 2 | Panel Lt.1 | Type A | 30 | 32 | 14 | PASS |
| 3 | Panel Lt.2 | Type A | 30 | 25 | 11 | PASS |
| 4 | Socket Lt.1 | Type A | 30 | 30 | 13 | PASS |
| 5 | Socket Lt.2 | Type A | 30 | 35 | 15 | PASS |
| 6 | AC Room | Type B | 30 | 28 | 12 | PASS |
| 7 | Water Heater | Type F | 30 | 26 | 12 | PASS |

### 5.6 Pengujian Phasa Sequence / Phase Sequence Test

#### 5.6.1 Tujuan / Purpose
Memastikan urutan phasa benar untuk melindungi motor dan peralatan tiga phasa.

#### 5.6.2 Metode / Method
- Menggunakan phase sequence meter

#### 5.6.3 Kriteria Penerimaan / Acceptance Criteria
- Urutan phasa: R-S-T (searah jarum jam)
- Ketegangan antar phasa: 380V ± 10%

#### 5.6.4 Hasil Pengujian / Test Results

| No | Lokasi | Urutan Phasa | V RS (V) | V ST (V) | V TR (V) | Status |
|----|--------|--------------|-----------|----------|----------|--------|
| 1 | Panel Utama | R-S-T | 382 | 380 | 381 | PASS |
| 2 | Panel Dist. Lt.1 | R-S-T | 378 | 382 | 380 | PASS |
| 3 | Panel Dist. Lt.2 | R-S-T | 381 | 379 | 382 | PASS |
| 4 | Motor AHU 1 | R-S-T | 380 | 378 | 381 | PASS |
| 5 | Motor AHU 2 | R-S-T | 379 | 381 | 380 | PASS |

### 5.7 Pengujian Voltage Drop / Voltage Drop Test

#### 5.7.1 Tujuan / Purpose
Memastikan penurunan tegangan pada sirkuit tidak melebihi batas yang diizinkan.

#### 5.7.2 Kriteria Penerimaan / Acceptance Criteria
- Voltage drop maksimum: 5% untuk lighting
- Voltage drop maksimum: 8% untuk power

#### 5.7.3 Hasil Pengujian / Test Results

| No | Rangkaian | Arus (A) | V Input (V) | V Output (V) | Drop (%) | Batas (%) | Status |
|----|-----------|----------|-------------|--------------|----------|-----------|--------|
| 1 | Lighting Lt.1 | 8.5 | 220 | 214 | 2.7 | 5 | PASS |
| 2 | Lighting Lt.2 | 7.2 | 220 | 215 | 2.3 | 5 | PASS |
| 3 | Socket Lt.1 | 12.5 | 220 | 212 | 3.6 | 8 | PASS |
| 4 | Socket Lt.2 | 11.8 | 220 | 213 | 3.2 | 8 | PASS |
| 5 | AC Central | 25.0 | 380 | 368 | 3.2 | 8 | PASS |

### 5.8 Pengujian Continuity of Protective Conductors

#### 5.8.1 Tujuan / Purpose
Memastikan konduktor proteksi (PE) kontinyu dari titik beban ke main grounding.

#### 5.8.2 Metode / Method
- Menggunakan ohmmeter dengan arus test rendah

#### 5.8.3 Kriteria Penerimaan / Acceptance Criteria
- Resistansi < 1Ω untuk setiap titik

#### 5.8.4 Hasil Pengujian / Test Results

| No | Titik | Jarak (m) | R Terukur (Ω) | Status |
|----|-------|-----------|---------------|--------|
| 1 | Panel Lt.1 - Socket 001 | 45 | 0.42 | PASS |
| 2 | Panel Lt.1 - Socket 002 | 52 | 0.48 | PASS |
| 3 | Panel Lt.2 - Socket 015 | 68 | 0.58 | PASS |
| 4 | Panel Lt.1 - Lighting 001 | 25 | 0.28 | PASS |
| 5 | Panel Lt.2 - Lighting 012 | 42 | 0.38 | PASS |

---

## 6. REKAPITULASI HASIL PENGUJIAN / TEST RESULTS SUMMARY

| No | Jenis Pengujian | Total Titik | PASS | FAIL | Tidak Diuji | Keterangan |
|----|-----------------|-------------|------|------|-------------|------------|
| 1 | Insulation Resistance | 10 | 10 | 0 | 0 | Semua memenuhi standar |
| 2 | Grounding Continuity | 10 | 10 | 0 | 0 | Semua memenuhi standar |
| 3 | Earth Resistance | 5 | 5 | 0 | 0 | Nilai < 5Ω |
| 4 | Loop Impedance | 7 | 7 | 0 | 0 | Semua memenuhi standar |
| 5 | RCD Test | 7 | 7 | 0 | 0 | Waktu pemutusan OK |
| 6 | Phase Sequence | 5 | 5 | 0 | 0 | Urutan phasa benar |
| 7 | Voltage Drop | 5 | 5 | 0 | 0 | Drop < batas |
| 8 | Protective Conductor | 5 | 5 | 0 | 0 | Kontinuitas OK |

### Kesimpulan / Conclusion

| Parameter | Hasil |
|-----------|-------|
| **Total Pengujian** | 54 titik |
| **Berhasil (PASS)** | 54 titik |
| **Gagal (FAIL)** | 0 titik |
| **Tingkat Keberhasilan** | **100%** ✅ |

**INSTALASI LISTRIK DINYATAKAN LULUS PENGUJIAN DAN SIAP DITANDAHANDASI**

---

## 7. TEMPOH PEMELIHARAAN / MAINTENANCE SCHEDULE

| Jenis Pengujian | Frekuensi | Waktu |
|-----------------|-----------|-------|
| Insulation Resistance | Tahunan | Setiap 12 bulan |
| Earth Resistance | Tahunan | Setiap 12 bulan |
| RCD Test | 6 Bulanan | Setiap 6 bulan |
| Visual Inspection | 3 Bulanan | Setiap 3 bulan |
| Thermal Scanning | Tahunan | Setiap 12 bulan |

---

## 8. LAMPIRAN / APPENDICES

### Lampiran A: Foto Dokumentasi Pengujian
- [ ] Foto kondisi panel sebelum pengujian
- [ ] Foto peralatan uji yang digunakan
- [ ] Foto proses pengujian
- [ ] Foto nama dan segel teknisi

### Lampiran B: Sertifikat Kalibrasi Peralatan
- Earth Resistance Tester
- Insulation Tester
- Digital Multimeter
- RCD Tester
- Loop Impedance Tester

### Lampiran C: Gambar Instalasi
- Single Line Diagram
- Layout Plan
- Grounding System Layout

---

## 9. PENANDATANGANAN / SIGNATURES

| Peran | Nama | Tanda Tangan | Tanggal |
|-------|------|--------------|---------|
| **Electrical Supervisor** | | | |
| **Safety Officer** | | | |
| **Quality Control** | | | |
| **Project Manager** | | | |

---

**DOKUMEN INI DISUSUN BERDASARKAN STANDAR PUIL 2011 DAN SNI IEC**

---

*Dokumen ini merupakan laporan hasil pengujian asli dan hanya berlaku untuk instalasi yang diuji pada tanggal tersebut di atas.*

---

## CHANGE LOG 📝

- **v1.0** (2026-03-09): Rilis awal Test Reports Document dengan 8 jenis pengujian lengkap`
};
