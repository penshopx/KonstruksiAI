/**
 * Safety Procedures Library
 * Contains comprehensive safety procedures document for electrical engineering
 */

// Main Safety Procedures Document
export const safetyProceduresDocument = `SAFETY PROCEDURES DOCUMENT - ELECTRICAL ENGINEERING
Dokumen Prosedur Keselamatan Kerja Sistem Kelistrikan

================================================================================
DAFTAR ISI
================================================================================

1. Pendahuluan & Ruang Lingkup
2. Referensi Standar
3. Definisi & Istilah
4. Kategori Pekerjaan Elektrikal
5. Persyaratan Personel
6. Prosedur LOTO (Lockout-Tagout)
7. Prosedur Permit to Work
8. Prosedur kerja Aman
9. Personal Protective Equipment (APD)
10. Identifikasi Bahaya & Penilaian Risiko
11. Prosedur Darurat
12. Inspeksi & Pemeliharaan
13. Pelatihan & Kompetensi
14. Dokumentasi & Pelaporan
15. Lampiran

================================================================================
1. PENDAHULUAN & RUANG LINGKUP
================================================================================

1.1 Tujuan
Dokumen ini menetapkan prosedur keselamatan kerja untuk seluruh pekerjaan 
yang berhubungan dengan sistem kelistrikan guna mencegah kecelakaan kerja, 
melindungi pekerja, dan memastikan kepatuhan terhadap regulasi yang berlaku.

1.2 Ruang Lingkup
Dokumen ini mencakup:
- Instalasi Baru: Pekerjaan instalasi sistem distribusi, panel, kabel, 
  dan peralatan listrik baru
- Renovasi/Modifikasi: Perubahan atau penambahan instalasi yang ada
- Pemeliharaan/Maintenance: Pemeliharaan preventif dan korektif
- Commissioning & Testing: Pengujian dan komisioning sistem kelistrikan

1.3 Area Cakupan
- Sistem Distribusi Listrik (TR & TM)
- Panel Listrik (MDP, SDP, Panel AC)
- Kabel & Wiring (NYM, NYY, NYFGbY)
- Sistem Proteksi (Grounding, Lightning Protection)
- Sistem Emergency (Emergency Lighting, Alarm)
- Pekerjaan di Ketinggian terkait listrik
- Ruang Server/Elektronik

================================================================================
2. REFERENSI STANDAR
================================================================================

| No | Standar                  | Deskripsi                                      |
|----|--------------------------|-----------------------------------------------|
| 1  | PUIL 2011               | Persyaratan Umum Instalasi Listrik Indonesia  |
| 2  | SNI IEC 60364           | Standar Instalasi Listrik untuk Gedung       |
| 3  | ISO 45001:2018          | Sistem Manajemen K3                           |
| 4  | Permenaker No. 5/2018  | Keselamatan dan Kesehatan Kerja Listrik      |
| 5  | Permenaker No. 12/2015 | Penyelenggaraan Sistem Manajemen K3          |
| 6  | NFPA 70E                | Electrical Safety in the Workplace           |
| 7  | SNI 6197:2020           | Konservasi Energi Sistem Pencahayaan         |

================================================================================
3. DEFINISI & ISTILAH
================================================================================

| Istilah           | Definisi                                                      |
|-------------------|---------------------------------------------------------------|
| LOTO              | Lockout-Tagout - Prosedur penguncian dan penandaan sumber energi |
| Energized Work    | Pekerjaan yang dilakukan pada kondisi bertegangan           |
| De-energized Work | Pekerjaan yang dilakukan pada kondisi tidak bertegangan    |
| Arc Flash         | Ledakan cahaya dan panas akibat hubungan pendek listrik     |
| Shock Hazard      | Bahaya sengatan listrik akibat kontak dengan bagian bertegangan |
| APD               | Alat Pelindung Diri (Personal Protective Equipment)         |
| PTW               | Permit to Work - Izin kerja yang diterbitkan untuk pekerjaan berbahaya |
| K3                | Keselamatan dan Kesehatan Kerja                              |
| SOP               | Standard Operating Procedure                                |

================================================================================
4. KATEGORI PEKERJAAN ELEKTRIKAL
================================================================================

| Kategori         | Tegangan        | Contoh Pekerjaan                        |
|------------------|-----------------|----------------------------------------|
| Extra Low Voltage | < 50V AC      | Telephone, Data, Security system       |
| Low Voltage       | 50V - 1000V AC | Instalasi gedung, stop kontak, lampu   |
| Medium Voltage   | 1kV - 36kV     | Distribusi, transformator distribusi   |
| High Voltage     | > 36kV         | Transmisi, gardu induk                |

================================================================================
5. PERSYARATAN PERSONEL
================================================================================

5.1 Kualifikasi Minimal

| Peran                    | Persyaratan                                                    |
|--------------------------|----------------------------------------------------------------|
| Supervisor Elektrikal    | S1 Teknik Elektro + Sertifikasi K3 + 5 tahun pengalaman     |
| Teknisi Listrik          | SMA/SMK Teknik Elektro + Sertifikasi Kompetensi (AK/AT)      |
| Operator Maintenance     | SMA/SMK + Pelatihan K3 Listrik + 2 tahun pengalaman        |
| Safety Officer           | S1 K3/ Teknik + Sertifikasi K3 Listrik + 3 tahun pengalaman|
| Kontraktor               | SBU Konstruksi bidang Elektrikal yang masih berlaku          |

5.2 Persyaratan Kesehatan
- Medical Check-Up tahunan (Fit to Work)
- Tidak memiliki riwayat penyakit jantung/epilepsi
- Penglihatan dan pendengaran normal
- Tidak dalam pengaruh alkohol atau obat-obatan

5.3 Pelatihan Wajib

| Pelatihan           | Frekuensi      |
|--------------------|----------------|
| K3 Listrik Dasar   | Setiap 2 tahun |
| P3K (First Aid)    | Setiap 2 tahun |
| Pemadaman Kebakaran| Setiap 1 tahun |
| LOTO Procedures    | Setiap 1 tahun |
| Working at Height  | Setiap 2 tahun |

================================================================================
6. PROSEDUR LOTO (LOCKOUT-TAGOUT)
================================================================================

6.1 Tujuan LOTO
Mencegah kecelakaan akibat energizing yang tidak terduga selama pekerjaan 
pemeliharaan atau perbaikan.

6.2 Langkah-Langkah LOTO

| Tahap             | Deskripsi                                             |
|-------------------|-------------------------------------------------------|
| 1. NOTIFICATION   | Beritahu semua pihak terkait                          |
| 2. PREPARATION    | Siapkan tools & dokumentasi                          |
| 3. SHUTDOWN       | Matikan peralatan dengan aman                        |
| 4. ISOLATION      | Pisahkan sumber listrik                              |
| 5. LOCKING        | Kunci switchgear dengan lock                         |
| 6. TESTING        | Verifikasi dengan voltage tester                     |
| 7. GROUNDING      | Pasang grounding jika diperlukan                     |

6.3 Prosedur Detail

TAHAP 1: NOTIFICATION (Pemberitahuan)
- Informasikan kepada semua operator, supervisor, dan terkait
- Tempelkan pengumuman di panel kontrol
- Catat dalam logbook

TAHAP 2: PREPARATION (Persiapan)
- Siapkan tools dan peralatan yang diperlukan
- Siapkan form LOTO
- Identifikasi semua sumber energi yang perlu diisolasi

TAHAP 3: SHUTDOWN (Penutupan)
- Matikan peralatan melalui prosedur normal
- Pastikan semua mesin berhenti

TAHAP 4: ISOLATION (Isolasi)
- Tutup main switch/circuit breaker
- Tarik plug/konektor jika ada
- Buka isolator switch

TAHAP 5: LOCKING (Penguncian)
- Pasang personal lock pada setiap titik isolasi
- Pasang tag dengan nama, tanggal, dan alasan
- Gunakan hasp jika多人操作 (multiple person operation)

TAHAP 6: TESTING (Pengujian)
- Gunakan voltage detector untuk verifikasi
- Test pada fase ke netral, fase ke ground
- Pastikan tidak ada tegangan (0V)

TAHAP 7: GROUNDING (Pentanahan)
- Pasang temporary grounding jika diperlukan
- Ground harus dipasang setelah verifikasi zero voltage
- Ground dilepas sebelum energizing kembali

================================================================================
7. PROSEDUR PERMIT TO WORK (PTW)
================================================================================

7.1 Jenis Izin Kerja

| Jenis Permit               | Kapan Diperlukan                              |
|---------------------------|-----------------------------------------------|
| Electrical Work Permit    | Semua pekerjaan terkait listrik               |
| Hot Work Permit           | Pekerjaan panas (welding, grinding)           |
| Work at Height Permit     | Pekerjaan di ketinggian > 1.8m               |
| Confined Space Permit     | Pekerjaan di ruang terbatas                   |

7.2 Alur Permohonan PTW

REQUEST (Teknisi) --> REVIEW (Supervisor) --> APPROVAL (Safety/HSE)
      |                                             |
      v                                             v
EXECUTION (Teknisi) <-- SIGN-OFF (Supervisor) <-- VERIFICATION (Safety)

7.3 Checklist Persetujuan PTW Electrical

| No | Checklist                              | Ya | Tidak |
|----|----------------------------------------|----|----|
| 1  | LOTO sudah diterapkan                  | [ ]| [ ] |
| 2  | APD lengkap tersedia                   | [ ]| [ ] |
| 3  | Area kerja diamankan                    | [ ]| [ ] |
| 4  | Fire extinguisher tersedia             | [ ]| [ ] |
| 5  | Tim pertolongan darurat siaga          | [ ]| [ ] |
| 6  | Supervisor standby di lokasi           | [ ]| [ ] |
| 7  | Komunikasi tersedia                    | [ ]| [ ] |
| 8  | Prosedur darurat sudah dijelaskan      | [ ]| [ ] |

================================================================================
8. PROSEDUR KERJA AMAN
================================================================================

8.1 Pekerjaan Sistem Distribusi

| Langkah | Deskripsi                          | Titik Kritis            |
|---------|------------------------------------|-------------------------|
| 1       | Verifikasi no-load sebelum kerja   | Semua switch OFF        |
| 2       | Pasang grounding input dan output  | Sesudah test zero V     |
| 3       | Tandai area kerja                   | Warning signs           |
| 4       | Gunakan APD lengkap                 | Helm, gloves, shoes     |
| 5       | Jaga safe distance                  | Min 0.5m dari kabel    |

8.2 Pekerjaan Kabel & Wiring

| Langkah | Deskripsi                                |
|---------|------------------------------------------|
| 1       | Identifikasi jalur kabel yang bekerja   |
| 2       | Verifikasi no-load pada circuit terkait  |
| 3       | Pasang warning signs di panel sumber     |
| 4       | Gunakan tools dengan insulated handle    |
| 5       | Label terminasi dengan benar             |

8.3 Pekerjaan Panel Listrik

| Langkah | Deskripsi                           |
|---------|-------------------------------------|
| 1       | Lockout seluruh sumber masuk panel  |
| 2       | Verifikasi dengan multimeter        |
| 3       | Pasang grounding sementara          |
| 4       | Gunakan insulated tools             |
| 5       | Jaga jarak aman dari busbar         |

================================================================================
9. PERSONAL PROTECTIVE EQUIPMENT (APD)
================================================================================

9.1 APD Wajib Pekerjaan Listrik

| No | APD              | Spesifikasi                   | Digunakan Saat              |
|----|------------------|-------------------------------|----------------------------|
| 1  | Safety Helmet    | Isolasi, ANSI Z89.1          | Semua pekerjaan            |
| 2  | Safety Shoes     | Isolasi, Steel toe           | Semua pekerjaan            |
| 3  | Sarung Tangan    | Insulated Class 00-4         | Kontak dengan listrik      |
| 4  | Face Shield      | Arc-rated, 8+ cal/cm2       | Panel/Arc flash area       |
| 5  | Safety Glasses   | Anti-fog                     | Semua pekerjaan            |
| 6  | Ear Plug/Muff   | SNR 25+ dB                   | Area bising                |
| 7  | Arc Flash Suit   | 8-40 cal/cm2                 | Pekerjaan High voltage     |
| 8  | Respiratory      | Half/full face mask          | Ruang terbatas             |

9.2 Klasifikasi Sarung Tangan Isolasi

| Class | Tegangan Max | Warna  |
|-------|--------------|--------|
| 00    | 500V         | Beige  |
| 0     | 1000V        | Red    |
| 1     | 7500V        | White  |
| 2     | 17000V       | Yellow |
| 3     | 26500V       | Green  |
| 4     | 36000V       | Orange |

================================================================================
10. IDENTIFIKASI BAHAYA & PENILAIAN RISIKO
================================================================================

10.1 Kategori Bahaya Utama

| No | Kategori Bahaya   | Hazards                  | Risiko                 | Kategori |
|----|-------------------|-------------------------|------------------------|----------|
| 1  | Electrical Shock  | Kontak langsung         | Sengatan, Luka        | KRITIS  |
| 2  | Electrical Shock  | Kontak tidak langsung  | Sengatan              | TINGGI  |
| 3  | Arc Flash         | Ledakan cahaya         | Luka bakar, Kebutaan  | KRITIS  |
| 4  | Arc Blast         | Ledakan                | Kerusakan organ       | KRITIS  |
| 5  | Fire              | Short circuit          | Kebakaran             | TINGGI  |
| 6  | Fall              | Working at height      | Jatuh, Luka           | TINGGI  |
| 7  | Asphyxia          | Ruang terbatas         | Kekurangan oksigen    | KRITIS  |
| 8  | Noise             | Mesin genset           | Gangguan pendengaran  | SEDANG  |

10.2 Hirarki Pengendalian (NFPA 70E)

1. Eliminasi - Menghilangkan bahaya sepenuhnya
2. Substitusi - Alternatif lebih aman
3. Engineering Controls - Isolasi, remote operation
4. Administrative Controls - Prosedur, permit, training
5. APD - Last line of defense

================================================================================
11. PROSEDUR DARURAT
================================================================================

11.1 Tindakan Pertama Sengatan Listrik

| Langkah | Tindakan                                   |
|---------|-------------------------------------------|
| 1       | AMANKAN AREA - Jangan menyentuh korban    |
| 2       | MATIKAN SUMBER - Matikan listrik          |
| 3       | PANGGIL TOLONG - Hubungi 118             |
| 4       | PINDAHKAN - Jauhkan dari sumber listrik  |
| 5       | CPR - Jika korban tidak bernapas         |
| 6       | RUMAH SAKIT - Bawa ke RS terdekat        |

11.2 Prosedur Kebakaran Listrik

| Tahap | Tindakan                                              |
|-------|------------------------------------------------------|
| 1     | Matikan sumber listrik jika aman                    |
| 2     | Gunakan APAR CO2 atau Dry Powder                    |
| 3     | Jangan gunakan air jika masih bertegangan           |
| 4     | Evakuasi personel                                    |
| 5     | Hubungi pemadam kebakaran (113)                     |

11.3 Kontak Darurat

| Layanan              | Nomor    |
|---------------------|----------|
| Darurat Umum        | 112      |
| Pemadam Kebakaran   | 113      |
| Ambulans            | 118      |
| PLN Emergency       | 123      |
| Safety Officer      | [isi]    |
| Rumah Sakit         | [isi]    |

================================================================================
12. INSPEKSI & PEMELIHARAAN
================================================================================

12.1 Inspeksi APD

| APD              | Sebelum Pakai | Mingguan | Bulanan     |
|------------------|---------------|----------|-------------|
| Helm             | [x]           |          | Visual      |
| Safety Shoes     | [x]           |          |             |
| Sarung Tangan    | [x]           |          | Air test    |
| Face Shield      | [x]           |          |             |
| Arc Suit         | [x]           |          |             |

12.2 Inspeksi Peralatan

| Peralatan          | Sebelum Pakai | Bulanan | Tahunan     |
|--------------------|---------------|---------|-------------|
| Multimeter         | [x]           |         | Kalibrasi   |
| Voltage Detector   | [x]           |         | Kalibrasi   |
| Insulated Tools    | Visual        |         | Test        |
| Grounding Set      |               | [x]     | Test        |

================================================================================
13. PELATIHAN & KOMPETENSI
================================================================================

13.1 Program Pelatihan

| No | Pelatihan         | Durasi | Peserta    | Frekuensi    |
|----|-------------------|--------|------------|--------------|
| 1  | Induksi K3        | 8 jam  | Semua      | Awal proyek  |
| 2  | K3 Listrik Dasar  | 24 jam | Teknisi    | 2 tahun      |
| 3  | LOTO Procedures   | 8 jam  | Teknisi    | 1 tahun      |
| 4  | First Aid         | 16 jam | Semua      | 2 tahun      |
| 5  | Fire Fighting     | 8 jam  | Semua      | 1 tahun      |
| 6  | Working at Height | 16 jam | Teknisi    | 2 tahun      |
| 7  | Confined Space    | 8 jam  | Teknisi    | 2 tahun      |

================================================================================
14. DOKUMENTASI & PELAPORAN
================================================================================

14.1 Dokumen Wajib

| No | Dokumen           | Penyimpanan   | Retensi   |
|----|-------------------|---------------|-----------|
| 1  | LOTO Form         | Safety Office | 5 tahun   |
| 2  | PTW Copy          | Safety Office | 5 tahun   |
| 3  | Incident Report   | Safety Office | 10 tahun  |
| 4  | Training Records  | HRD           | 10 tahun  |
| 5  | Inspection Records| Maintenance   | 5 tahun   |
| 6  | Medical Records   | HRD           | 10 tahun  |

================================================================================
15. LAMPIRAN
================================================================================

Lampiran A: Form LOTO

| Field                    | Isian         |
|--------------------------|---------------|
| Nama Teknisi             | [isi]         |
| Tanggal                  | [isi]         |
| Waktu Mulai              | [isi]         |
| Waktu Selesai            | [isi]         |
| Equipment Name           | [isi]         |
| Lokasi                   | [isi]         |
| Alasan LOTO              | [isi]         |
| Sumber Energi            | [Listrik]     |
| Locks Applied            | [Jumlah lock] |
| Verifikasi Zero Energy   | [Ya/Tidak]   |

Lampiran B: Form Electrical PTW

| Field                | Isian                              |
|----------------------|------------------------------------|
| No. Permit           | [Otomatis]                         |
| Nama Teknisi         | [isi]                              |
| Supervisor           | [isi]                              |
| Lokasi Kerja         | [isi]                              |
| Deskripsi Pekerjaan  | [isi]                              |
| Jenis Pekerjaan      | [Instalasi/Maint/Commissioning]   |
| Tegangan Kerja       | [V/kV]                             |
| LOTO Required        | [Ya/Tidak]                         |

================================================================================
REFERENSI
================================================================================

- PUIL 2011 - Persyaratan Umum Instalasi Listrik Indonesia
- ISO 45001:2018 - Occupational Health and Safety
- Permenaker No. 5/2018 - K3 Listrik
- NFPA 70E:2021 - Standard for Electrical Safety in the Workplace
- SNI IEC 60364 - Electrical Installations of Buildings
`;

// Get safety procedures response for chat
export function getSafetyProceduresResponse(): string {
  return safetyProceduresDocument;
}
