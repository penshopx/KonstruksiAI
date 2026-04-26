// ============================================================
// KONSTRUKSI AI - BIMTEK MODULE
// Bimbingan Teknis: Modul Pelatihan & Materi Teknis
// ============================================================

export interface BimtekModule {
  id: string;
  title: string;
  description: string;
  category: BimtekCategory;
  level: 'dasar' | 'menengah' | 'lanjutan';
  duration: number; // in minutes
  topics: BimtekTopic[];
  prerequisites?: string[];
  certification?: string;
  icon: string;
  color: string;
}

export interface BimtekTopic {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  examples?: string[];
  references?: string[];
  duration: number; // in minutes
}

export type BimtekCategory = 
  | 'konstruksi'
  | 'elektrikal'
  | 'mekanikal'
  | 'energi'
  | 'migas'
  | 'k3'
  | 'manajemen'
  | 'perijinan';

export interface BimtekSession {
  id: string;
  moduleId: string;
  title: string;
  date: string;
  instructor: string;
  format: 'online' | 'offline' | 'hybrid';
  maxParticipants: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  location?: string;
  meetingLink?: string;
}

// ============ DATA: BIMTEK MODULES ============

export const BIMTEK_MODULES: BimtekModule[] = [
  // === KONSTRUKSI ===
  {
    id: 'bimtek-001',
    title: 'Perencanaan Struktur Beton Bertulang',
    description: 'Bimbingan teknis perencanaan struktur beton bertulang sesuai SNI 2847:2019 dan SNI 1726:2019 untuk bangunan gedung.',
    category: 'konstruksi',
    level: 'menengah',
    duration: 480,
    icon: '🏗️',
    color: 'orange',
    certification: 'SKK Ahli Teknik Struktur',
    prerequisites: ['Dasar-dasar teknik sipil', 'Mekanika bahan'],
    topics: [
      {
        id: 'topic-001-1',
        title: 'Konsep Dasar Beton Bertulang',
        content: 'Beton bertulang adalah material komposit yang menggabungkan kekuatan tekan beton dengan kekuatan tarik baja tulangan. Perencanaan menggunakan metode LRFD (Load and Resistance Factor Design) sesuai SNI 2847:2019.',
        keyPoints: [
          'Mutu beton: K-175 hingga K-500 (fc\' 14.5 - 41.5 MPa)',
          'Mutu baja: BJTP 24 (fy=240 MPa) dan BJTD 40 (fy=400 MPa)',
          'Faktor reduksi kekuatan (φ): lentur 0.90, geser 0.75, tekan 0.65',
          'Kombinasi beban: 1.2D + 1.6L, 1.2D + 1.0E + 1.0L',
        ],
        examples: [
          'Perhitungan tulangan lentur balok T',
          'Desain kolom dengan beban aksial dan momen',
        ],
        references: ['SNI 2847:2019', 'SNI 1726:2019', 'SNI 1727:2020'],
        duration: 90,
      },
      {
        id: 'topic-001-2',
        title: 'Perencanaan Balok dan Pelat',
        content: 'Perencanaan balok meliputi pengecekan kekuatan lentur, geser, dan torsi. Pelat direncanakan sebagai pelat satu arah atau dua arah tergantung rasio bentang.',
        keyPoints: [
          'Rasio tulangan minimum: ρmin = 1.4/fy',
          'Rasio tulangan maksimum: ρmax = 0.75ρb',
          'Pelat dua arah: rasio bentang pendek/panjang ≤ 0.5',
          'Tebal minimum pelat: L/20 (satu arah), L/33 (dua arah)',
        ],
        examples: [
          'Desain balok induk 30x60 cm bentang 8 m',
          'Desain pelat lantai tebal 12 cm',
        ],
        references: ['SNI 2847:2019 Pasal 9', 'SNI 2847:2019 Pasal 8'],
        duration: 120,
      },
      {
        id: 'topic-001-3',
        title: 'Perencanaan Kolom dan Pondasi',
        content: 'Kolom menerima beban aksial dan momen. Pondasi dipilih berdasarkan kondisi tanah dan beban struktur.',
        keyPoints: [
          'Kolom pendek: λ = kL/r < 22 (tidak perlu pembesaran momen)',
          'Kolom langsing: perlu analisis P-delta',
          'Pondasi dangkal: daya dukung tanah > 1.5 kg/cm²',
          'Pondasi dalam (tiang): untuk tanah lunak atau beban besar',
        ],
        examples: [
          'Desain kolom 40x40 cm dengan beban 500 kN',
          'Desain pondasi telapak 2x2 m',
        ],
        references: ['SNI 2847:2019 Pasal 10', 'SNI 8460:2017'],
        duration: 120,
      },
      {
        id: 'topic-001-4',
        title: 'Analisis Beban Gempa',
        content: 'Analisis beban gempa menggunakan metode statik ekivalen atau analisis dinamik spektrum respons sesuai SNI 1726:2019.',
        keyPoints: [
          'Kategori risiko bangunan: I, II, III, IV',
          'Sistem struktur: SRPMK, SRPMM, SRPMB',
          'Faktor modifikasi respons (R): 8 untuk SRPMK',
          'Gaya geser dasar: V = Cs × W',
        ],
        examples: [
          'Perhitungan gaya gempa gedung 5 lantai di zona gempa tinggi',
          'Distribusi gaya gempa per lantai',
        ],
        references: ['SNI 1726:2019', 'Peta Gempa Indonesia 2017'],
        duration: 150,
      },
    ],
  },
  {
    id: 'bimtek-002',
    title: 'Manajemen Proyek Konstruksi',
    description: 'Bimbingan teknis manajemen proyek konstruksi meliputi perencanaan, pengendalian biaya, jadwal, mutu, dan K3.',
    category: 'manajemen',
    level: 'menengah',
    duration: 360,
    icon: '📊',
    color: 'blue',
    certification: 'SKK Ahli Manajemen Proyek',
    topics: [
      {
        id: 'topic-002-1',
        title: 'Perencanaan Proyek (WBS & Jadwal)',
        content: 'Work Breakdown Structure (WBS) adalah dekomposisi hierarkis pekerjaan proyek. Jadwal dibuat menggunakan metode CPM (Critical Path Method) atau PERT.',
        keyPoints: [
          'WBS: dekomposisi sampai level work package',
          'CPM: identifikasi jalur kritis dan float',
          'Kurva S: monitoring kemajuan proyek',
          'Earned Value Management (EVM): SPI, CPI, EAC',
        ],
        examples: [
          'Pembuatan WBS proyek gedung 10 lantai',
          'Analisis CPM dengan 20 aktivitas',
        ],
        references: ['PMBOK Guide 7th Edition', 'Perpres 16/2018'],
        duration: 90,
      },
      {
        id: 'topic-002-2',
        title: 'Pengendalian Biaya & RAB',
        content: 'Rencana Anggaran Biaya (RAB) disusun berdasarkan AHSP (Analisis Harga Satuan Pekerjaan) yang ditetapkan pemerintah.',
        keyPoints: [
          'AHSP: Permen PUPR No. 1/2022',
          'Komponen biaya: material, upah, alat, overhead',
          'Contingency: 5-10% dari total biaya',
          'Eskalasi harga: indeksasi material',
        ],
        examples: [
          'Penyusunan RAB pekerjaan beton bertulang',
          'Analisis varians biaya (cost variance)',
        ],
        references: ['Permen PUPR No. 1/2022', 'SNI 7394:2008'],
        duration: 90,
      },
      {
        id: 'topic-002-3',
        title: 'Pengendalian Mutu (QC/QA)',
        content: 'Quality Control (QC) adalah pemeriksaan hasil pekerjaan, sedangkan Quality Assurance (QA) adalah sistem manajemen mutu.',
        keyPoints: [
          'Rencana Mutu Kontrak (RMK)',
          'Inspeksi dan pengujian material',
          'NCR (Non-Conformance Report)',
          'ISO 9001:2015 untuk sistem manajemen mutu',
        ],
        examples: [
          'Pembuatan checklist QC pekerjaan beton',
          'Prosedur pengujian slump test dan kuat tekan',
        ],
        references: ['ISO 9001:2015', 'SNI 1972:2008'],
        duration: 90,
      },
      {
        id: 'topic-002-4',
        title: 'Manajemen Risiko Proyek',
        content: 'Identifikasi, analisis, dan mitigasi risiko proyek konstruksi untuk meminimalkan dampak negatif.',
        keyPoints: [
          'Risk register: identifikasi semua risiko',
          'Matriks risiko: probabilitas × dampak',
          'Strategi mitigasi: avoid, transfer, mitigate, accept',
          'Monitoring risiko sepanjang proyek',
        ],
        examples: [
          'Pembuatan risk register proyek jalan tol',
          'Analisis risiko keterlambatan material',
        ],
        references: ['ISO 31000:2018', 'PMBOK Guide'],
        duration: 90,
      },
    ],
  },
  {
    id: 'bimtek-003',
    title: 'Instalasi Sistem Kelistrikan Bangunan',
    description: 'Bimbingan teknis instalasi sistem kelistrikan bangunan gedung sesuai PUIL 2011 dan standar PLN.',
    category: 'elektrikal',
    level: 'dasar',
    duration: 360,
    icon: '⚡',
    color: 'yellow',
    certification: 'SKK Teknisi Instalasi Listrik',
    topics: [
      {
        id: 'topic-003-1',
        title: 'Dasar-Dasar Sistem Kelistrikan',
        content: 'Sistem kelistrikan bangunan terdiri dari sistem distribusi daya, penerangan, dan sistem khusus (fire alarm, CCTV, BAS).',
        keyPoints: [
          'Tegangan: 220V/380V (3 fasa), 50 Hz',
          'Sistem grounding: TN-S, TN-C-S, TT',
          'Proteksi: MCB, MCCB, RCCB, fuse',
          'Kabel: NYM, NYY, NYFGBY sesuai aplikasi',
        ],
        examples: [
          'Perhitungan kebutuhan daya gedung kantor',
          'Pemilihan kabel berdasarkan arus beban',
        ],
        references: ['PUIL 2011', 'SNI 04-0225-2011'],
        duration: 90,
      },
      {
        id: 'topic-003-2',
        title: 'Perencanaan Panel Listrik (MDP/SDP)',
        content: 'Main Distribution Panel (MDP) mendistribusikan daya ke Sub Distribution Panel (SDP) di setiap lantai atau zona.',
        keyPoints: [
          'Kapasitas panel: sesuai total beban + 20% cadangan',
          'Busbar: tembaga atau aluminium',
          'Proteksi: MCCB dengan rating arus sesuai',
          'Labeling: sesuai standar PLN',
        ],
        examples: [
          'Desain MDP untuk gedung 5 lantai 500 kVA',
          'Single line diagram sistem distribusi',
        ],
        references: ['PUIL 2011', 'Standar PLN'],
        duration: 90,
      },
      {
        id: 'topic-003-3',
        title: 'Sistem Penerangan & Efisiensi Energi',
        content: 'Perencanaan sistem penerangan mempertimbangkan tingkat iluminasi, efisiensi lampu, dan kontrol otomatis.',
        keyPoints: [
          'Standar iluminasi: SNI 03-6575-2001',
          'Kantor: 300-500 lux, Gudang: 100-200 lux',
          'LED: efisiensi 80-150 lm/W',
          'Kontrol: sensor gerak, daylight sensor, BMS',
        ],
        examples: [
          'Perhitungan jumlah lampu ruang kantor 10x10 m',
          'Analisis penghematan energi dengan LED',
        ],
        references: ['SNI 03-6575-2001', 'Permen ESDM No. 13/2012'],
        duration: 90,
      },
      {
        id: 'topic-003-4',
        title: 'Keselamatan Instalasi Listrik',
        content: 'Keselamatan instalasi listrik mencakup proteksi terhadap kejut listrik, kebakaran, dan gangguan sistem.',
        keyPoints: [
          'Proteksi kejut listrik: grounding, RCCB 30mA',
          'Proteksi kebakaran: kabel tahan api, conduit',
          'Pemeriksaan berkala: SLO (Sertifikat Laik Operasi)',
          'Standar: IEC 60364, PUIL 2011',
        ],
        examples: [
          'Prosedur pengujian tahanan isolasi kabel',
          'Checklist inspeksi panel listrik',
        ],
        references: ['PUIL 2011', 'Permen ESDM No. 19/2015'],
        duration: 90,
      },
    ],
  },
  {
    id: 'bimtek-004',
    title: 'Sistem PLTS (Pembangkit Listrik Tenaga Surya)',
    description: 'Bimbingan teknis perencanaan, instalasi, dan operasi sistem PLTS rooftop dan ground-mounted.',
    category: 'energi',
    level: 'menengah',
    duration: 480,
    icon: '☀️',
    color: 'amber',
    certification: 'SKK Teknisi PLTS',
    topics: [
      {
        id: 'topic-004-1',
        title: 'Komponen Sistem PLTS',
        content: 'Sistem PLTS terdiri dari panel surya (PV module), inverter, baterai (opsional), dan sistem monitoring.',
        keyPoints: [
          'Panel surya: monocrystalline (efisiensi 18-22%), polycrystalline (15-18%)',
          'Inverter: string inverter, micro inverter, central inverter',
          'Baterai: lithium-ion (LFP), lead-acid',
          'Monitoring: SCADA, IoT sensor',
        ],
        examples: [
          'Pemilihan panel surya untuk PLTS 10 kWp',
          'Perbandingan string vs micro inverter',
        ],
        references: ['IEC 61215', 'IEC 62109', 'Permen ESDM 26/2021'],
        duration: 120,
      },
      {
        id: 'topic-004-2',
        title: 'Perencanaan & Sizing PLTS',
        content: 'Sizing PLTS meliputi perhitungan kebutuhan energi, kapasitas panel, inverter, dan baterai.',
        keyPoints: [
          'Irradiasi matahari Indonesia: 4.5-5.5 kWh/m²/hari',
          'Performance Ratio (PR): 75-85%',
          'Rumus: Kapasitas (kWp) = Kebutuhan (kWh/hari) / (Irradiasi × PR)',
          'Tilt angle optimal: 10-15° di Indonesia',
        ],
        examples: [
          'Sizing PLTS rooftop untuk gedung kantor 100 kWh/hari',
          'Perhitungan ROI dan payback period',
        ],
        references: ['Permen ESDM 26/2021', 'IESR Solar Handbook'],
        duration: 120,
      },
      {
        id: 'topic-004-3',
        title: 'Instalasi & Komisioning PLTS',
        content: 'Instalasi PLTS harus memenuhi standar keselamatan dan teknis yang berlaku.',
        keyPoints: [
          'Mounting: ballast, penetrasi atap, ground mount',
          'Kabel DC: kabel surya UV-resistant',
          'Grounding: sistem grounding khusus PLTS',
          'Komisioning: pengujian Voc, Isc, IV curve',
        ],
        examples: [
          'Prosedur instalasi panel surya di atap beton',
          'Checklist komisioning PLTS 50 kWp',
        ],
        references: ['IEC 62446', 'SNI IEC 62548'],
        duration: 120,
      },
      {
        id: 'topic-004-4',
        title: 'Perizinan & Regulasi PLTS',
        content: 'PLTS rooftop memerlukan persetujuan PLN dan SLO dari ESDM.',
        keyPoints: [
          'Permohonan ke PLN: kapasitas ≤ 100% daya tersambung',
          'SLO: Sertifikat Laik Operasi dari ESDM',
          'Net metering: ekspor ke PLN dengan tarif tertentu',
          'Insentif: bebas bea masuk panel surya',
        ],
        examples: [
          'Alur perizinan PLTS rooftop 30 kWp',
          'Dokumen yang diperlukan untuk SLO',
        ],
        references: ['Permen ESDM 26/2021', 'Perpres 112/2022'],
        duration: 120,
      },
    ],
  },
  {
    id: 'bimtek-005',
    title: 'K3 Konstruksi & SMK3',
    description: 'Bimbingan teknis Keselamatan dan Kesehatan Kerja (K3) di sektor konstruksi sesuai PP 50/2012 dan regulasi terkait.',
    category: 'k3',
    level: 'dasar',
    duration: 360,
    icon: '🦺',
    color: 'red',
    certification: 'SKK Ahli K3 Konstruksi',
    topics: [
      {
        id: 'topic-005-1',
        title: 'Dasar-Dasar K3 Konstruksi',
        content: 'K3 konstruksi bertujuan melindungi tenaga kerja dari kecelakaan dan penyakit akibat kerja.',
        keyPoints: [
          'Dasar hukum: UU No. 1/1970, PP No. 50/2012',
          'Hierarki pengendalian: eliminasi, substitusi, rekayasa, administrasi, APD',
          'APD wajib: helm, sepatu safety, rompi, harness',
          'Kewajiban pelaporan kecelakaan: 2x24 jam',
        ],
        examples: [
          'Identifikasi bahaya di area konstruksi',
          'Pembuatan JSA (Job Safety Analysis)',
        ],
        references: ['UU No. 1/1970', 'PP No. 50/2012', 'Permen Naker No. 9/2016'],
        duration: 90,
      },
      {
        id: 'topic-005-2',
        title: 'HIRARC & Manajemen Risiko K3',
        content: 'HIRARC (Hazard Identification, Risk Assessment, and Risk Control) adalah metode sistematis identifikasi dan pengendalian bahaya.',
        keyPoints: [
          'Identifikasi bahaya: fisik, kimia, biologi, ergonomi, psikologi',
          'Penilaian risiko: likelihood × severity',
          'Level risiko: rendah (1-4), sedang (5-12), tinggi (13-25)',
          'Pengendalian: sesuai hierarki pengendalian',
        ],
        examples: [
          'HIRARC pekerjaan di ketinggian',
          'HIRARC pekerjaan pengelasan',
        ],
        references: ['OHSAS 18001', 'ISO 45001:2018'],
        duration: 90,
      },
      {
        id: 'topic-005-3',
        title: 'Sistem Manajemen K3 (SMK3)',
        content: 'SMK3 adalah bagian dari sistem manajemen perusahaan secara keseluruhan dalam rangka pengendalian risiko K3.',
        keyPoints: [
          'Wajib SMK3: perusahaan >100 karyawan atau risiko tinggi',
          'Elemen SMK3: kebijakan, perencanaan, pelaksanaan, pemantauan, tinjauan',
          'Audit SMK3: internal dan eksternal (Kemenaker)',
          'Bendera K3: emas (>85%), perak (60-85%)',
        ],
        examples: [
          'Penyusunan kebijakan K3 perusahaan',
          'Prosedur audit SMK3 internal',
        ],
        references: ['PP No. 50/2012', 'Permen Naker No. 26/2014'],
        duration: 90,
      },
      {
        id: 'topic-005-4',
        title: 'Penanganan Darurat & P3K',
        content: 'Prosedur tanggap darurat dan pertolongan pertama pada kecelakaan (P3K) di lokasi konstruksi.',
        keyPoints: [
          'Rencana tanggap darurat: evakuasi, komunikasi, penyelamatan',
          'P3K: DRSABC (Danger, Response, Send, Airway, Breathing, Circulation)',
          'Peralatan P3K: kotak P3K, tandu, AED',
          'Latihan darurat: minimal 1x per tahun',
        ],
        examples: [
          'Simulasi evakuasi kebakaran di proyek',
          'Prosedur P3K untuk luka bakar',
        ],
        references: ['Permen Naker No. 15/2008', 'SNI 19-3994-1995'],
        duration: 90,
      },
    ],
  },
  {
    id: 'bimtek-006',
    title: 'Pengadaan Barang/Jasa Pemerintah',
    description: 'Bimbingan teknis pengadaan barang/jasa pemerintah sesuai Perpres 16/2018 jo. 12/2021 dan peraturan LKPP.',
    category: 'manajemen',
    level: 'menengah',
    duration: 480,
    icon: '📋',
    color: 'purple',
    certification: 'Sertifikat Pengadaan LKPP',
    topics: [
      {
        id: 'topic-006-1',
        title: 'Dasar Hukum & Prinsip Pengadaan',
        content: 'Pengadaan pemerintah diatur oleh Perpres 16/2018 dengan prinsip efisien, efektif, transparan, terbuka, bersaing, adil, dan akuntabel.',
        keyPoints: [
          'Perpres 16/2018 jo. 12/2021: regulasi utama',
          'Pelaku pengadaan: PA, KPA, PPK, Pokja, PPHP',
          'Metode pemilihan: tender, seleksi, penunjukan langsung, e-purchasing',
          'Nilai pengadaan: <200 juta (pengadaan langsung), >200 juta (tender)',
        ],
        examples: [
          'Alur proses tender konstruksi pemerintah',
          'Tugas dan wewenang PPK',
        ],
        references: ['Perpres 16/2018', 'Perpres 12/2021', 'Perlem LKPP'],
        duration: 120,
      },
      {
        id: 'topic-006-2',
        title: 'Penyusunan Dokumen Pengadaan',
        content: 'Dokumen pengadaan meliputi dokumen kualifikasi, dokumen pemilihan, dan spesifikasi teknis.',
        keyPoints: [
          'HPS: Harga Perkiraan Sendiri (tidak boleh melebihi)',
          'Spesifikasi teknis: tidak menyebut merek',
          'Kriteria evaluasi: administrasi, teknis, harga',
          'Jaminan: penawaran 1-3%, pelaksanaan 5%, pemeliharaan 5%',
        ],
        examples: [
          'Penyusunan HPS pekerjaan konstruksi',
          'Pembuatan spesifikasi teknis yang benar',
        ],
        references: ['Perpres 16/2018', 'Perlem LKPP No. 12/2021'],
        duration: 120,
      },
      {
        id: 'topic-006-3',
        title: 'Evaluasi Penawaran & Penetapan Pemenang',
        content: 'Evaluasi penawaran dilakukan secara sistematis dan objektif sesuai kriteria yang ditetapkan dalam dokumen pemilihan.',
        keyPoints: [
          'Sistem gugur: administrasi → teknis → harga',
          'Merit point: bobot teknis 10-30%, harga 70-90%',
          'Klarifikasi: untuk hal yang meragukan',
          'Sanggah: 5 hari kerja setelah pengumuman',
        ],
        examples: [
          'Evaluasi penawaran teknis metode merit point',
          'Prosedur sanggah dan sanggah banding',
        ],
        references: ['Perpres 16/2018', 'Perlem LKPP'],
        duration: 120,
      },
      {
        id: 'topic-006-4',
        title: 'Pengendalian Kontrak & PHO/FHO',
        content: 'Pengendalian kontrak meliputi monitoring pelaksanaan, addendum, dan serah terima pekerjaan.',
        keyPoints: [
          'Addendum kontrak: perubahan lingkup, waktu, harga',
          'Denda keterlambatan: 1/1000 per hari, maks 5%',
          'PHO: Provisional Hand Over (serah terima pertama)',
          'FHO: Final Hand Over (serah terima akhir)',
        ],
        examples: [
          'Prosedur addendum kontrak karena force majeure',
          'Checklist PHO pekerjaan konstruksi',
        ],
        references: ['Perpres 16/2018', 'Permen PUPR No. 14/2020'],
        duration: 120,
      },
    ],
  },
  {
    id: 'bimtek-007',
    title: 'Perizinan Bangunan Gedung (PBG & SLF)',
    description: 'Bimbingan teknis proses perizinan bangunan gedung: Persetujuan Bangunan Gedung (PBG) dan Sertifikat Laik Fungsi (SLF).',
    category: 'perijinan',
    level: 'dasar',
    duration: 240,
    icon: '📜',
    color: 'teal',
    certification: 'Pemahaman Regulasi PBG',
    topics: [
      {
        id: 'topic-007-1',
        title: 'Regulasi PBG (Pengganti IMB)',
        content: 'PBG menggantikan IMB berdasarkan PP No. 16/2021 sebagai implementasi UU Cipta Kerja.',
        keyPoints: [
          'Dasar hukum: PP No. 16/2021, UU Cipta Kerja',
          'PBG: persetujuan teknis sebelum membangun',
          'SLF: sertifikat laik fungsi setelah selesai',
          'Sistem OSS: pengajuan online melalui oss.go.id',
        ],
        examples: [
          'Alur pengajuan PBG untuk rumah tinggal',
          'Perbedaan IMB dan PBG',
        ],
        references: ['PP No. 16/2021', 'UU No. 11/2020 (Cipta Kerja)'],
        duration: 60,
      },
      {
        id: 'topic-007-2',
        title: 'Persyaratan Teknis PBG',
        content: 'Persyaratan teknis PBG meliputi dokumen arsitektur, struktur, MEP, dan lingkungan.',
        keyPoints: [
          'Gambar arsitektur: denah, tampak, potongan',
          'Gambar struktur: pondasi, kolom, balok, pelat',
          'Gambar MEP: listrik, plumbing, HVAC',
          'Dokumen lingkungan: AMDAL/UKL-UPL/SPPL',
        ],
        examples: [
          'Checklist dokumen PBG gedung komersial',
          'Persyaratan TABG (Tim Ahli Bangunan Gedung)',
        ],
        references: ['PP No. 16/2021', 'Permen PUPR No. 11/2021'],
        duration: 60,
      },
      {
        id: 'topic-007-3',
        title: 'Proses Pengajuan & Penerbitan PBG',
        content: 'Pengajuan PBG dilakukan melalui sistem OSS atau DPMPTSP dengan waktu proses 14-30 hari kerja.',
        keyPoints: [
          'Pengajuan: OSS (oss.go.id) atau DPMPTSP',
          'Verifikasi: administrasi dan teknis',
          'TABG: review untuk bangunan tertentu',
          'Biaya: sesuai Perda setempat',
        ],
        examples: [
          'Langkah-langkah pengajuan PBG di OSS',
          'Cara menghitung retribusi PBG',
        ],
        references: ['PP No. 16/2021', 'Perda setempat'],
        duration: 60,
      },
      {
        id: 'topic-007-4',
        title: 'Sertifikat Laik Fungsi (SLF)',
        content: 'SLF diterbitkan setelah bangunan selesai dibangun dan memenuhi persyaratan teknis.',
        keyPoints: [
          'Pengajuan SLF: setelah konstruksi selesai',
          'Pemeriksaan: oleh pengkaji teknis atau TABG',
          'Masa berlaku: 20 tahun (hunian), 5 tahun (non-hunian)',
          'Perpanjangan SLF: sebelum masa berlaku habis',
        ],
        examples: [
          'Prosedur pengajuan SLF gedung perkantoran',
          'Checklist pemeriksaan untuk SLF',
        ],
        references: ['PP No. 16/2021', 'Permen PUPR No. 27/2018'],
        duration: 60,
      },
    ],
  },
  {
    id: 'bimtek-008',
    title: 'Sistem Mekanikal Bangunan (HVAC & Plumbing)',
    description: 'Bimbingan teknis perencanaan dan instalasi sistem mekanikal bangunan: HVAC, plumbing, dan fire protection.',
    category: 'mekanikal',
    level: 'menengah',
    duration: 360,
    icon: '🔧',
    color: 'cyan',
    certification: 'SKK Teknisi Mekanikal',
    topics: [
      {
        id: 'topic-008-1',
        title: 'Sistem HVAC Bangunan',
        content: 'HVAC (Heating, Ventilation, Air Conditioning) mengatur kenyamanan termal dan kualitas udara dalam ruangan.',
        keyPoints: [
          'Beban pendinginan: 1 TR = 3.517 kW',
          'Koefisien Prestasi (COP): 2.5-4.5 untuk AC',
          'Ventilasi: ASHRAE 62.1, min 10 L/s/orang',
          'Efisiensi energi: EER, SEER, IPLV',
        ],
        examples: [
          'Perhitungan beban pendinginan ruang kantor',
          'Pemilihan sistem AC untuk gedung 10 lantai',
        ],
        references: ['ASHRAE 62.1', 'SNI 03-6572-2001', 'Permen ESDM 13/2012'],
        duration: 90,
      },
      {
        id: 'topic-008-2',
        title: 'Sistem Plumbing & Sanitasi',
        content: 'Sistem plumbing meliputi distribusi air bersih, pembuangan air kotor, dan sistem drainase.',
        keyPoints: [
          'Kebutuhan air: SNI 03-7065-2005',
          'Tekanan air: 0.5-4 bar di titik penggunaan',
          'Sistem distribusi: downfeed (gravitasi) atau upfeed (pompa)',
          'Pengolahan air limbah: IPAL sebelum dibuang',
        ],
        examples: [
          'Sizing tangki air untuk gedung 10 lantai',
          'Desain sistem drainase atap',
        ],
        references: ['SNI 03-7065-2005', 'Permen LH No. 5/2014'],
        duration: 90,
      },
      {
        id: 'topic-008-3',
        title: 'Sistem Pemadam Kebakaran',
        content: 'Sistem pemadam kebakaran aktif meliputi sprinkler, hydrant, dan APAR.',
        keyPoints: [
          'Sprinkler: wajib untuk gedung >4 lantai atau >5000 m²',
          'Hydrant: jarak antar hydrant maks 35 m',
          'APAR: setiap 200-400 m² atau 15 m jarak',
          'Standar: SNI 03-3989-2000, NFPA 13',
        ],
        examples: [
          'Desain sistem sprinkler gedung perkantoran',
          'Penempatan APAR yang benar',
        ],
        references: ['SNI 03-3989-2000', 'Permen PU No. 26/2008'],
        duration: 90,
      },
      {
        id: 'topic-008-4',
        title: 'Sistem Transportasi Vertikal (Lift & Eskalator)',
        content: 'Lift dan eskalator adalah sistem transportasi vertikal yang wajib ada di gedung bertingkat.',
        keyPoints: [
          'Lift: wajib untuk gedung >4 lantai',
          'Kapasitas lift: 8-20 orang (630-1600 kg)',
          'Kecepatan: 1-10 m/s tergantung tinggi gedung',
          'Standar: SNI 05-7052-2004, EN 81',
        ],
        examples: [
          'Perhitungan jumlah lift untuk gedung 20 lantai',
          'Persyaratan lift kebakaran',
        ],
        references: ['SNI 05-7052-2004', 'Permen PU No. 26/2008'],
        duration: 90,
      },
    ],
  },
];

// ============ HELPER FUNCTIONS ============

export function getBimtekByCategory(category: BimtekCategory): BimtekModule[] {
  return BIMTEK_MODULES.filter(m => m.category === category);
}

export function getBimtekById(id: string): BimtekModule | undefined {
  return BIMTEK_MODULES.find(m => m.id === id);
}

export function getCategoryLabel(category: BimtekCategory): string {
  const labels: Record<BimtekCategory, string> = {
    konstruksi: 'Konstruksi',
    elektrikal: 'Elektrikal',
    mekanikal: 'Mekanikal',
    energi: 'Energi & EBT',
    migas: 'Migas & Tambang',
    k3: 'K3 & Keselamatan',
    manajemen: 'Manajemen',
    perijinan: 'Perijinan',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: BimtekCategory): string {
  const colors: Record<BimtekCategory, string> = {
    konstruksi: 'bg-orange-100 text-orange-700',
    elektrikal: 'bg-yellow-100 text-yellow-700',
    mekanikal: 'bg-cyan-100 text-cyan-700',
    energi: 'bg-amber-100 text-amber-700',
    migas: 'bg-blue-100 text-blue-700',
    k3: 'bg-red-100 text-red-700',
    manajemen: 'bg-purple-100 text-purple-700',
    perijinan: 'bg-teal-100 text-teal-700',
  };
  return colors[category] || 'bg-slate-100 text-slate-700';
}

export function getLevelLabel(level: BimtekModule['level']): string {
  const labels = {
    dasar: 'Dasar',
    menengah: 'Menengah',
    lanjutan: 'Lanjutan',
  };
  return labels[level];
}

export function getLevelColor(level: BimtekModule['level']): string {
  const colors = {
    dasar: 'bg-green-100 text-green-700',
    menengah: 'bg-blue-100 text-blue-700',
    lanjutan: 'bg-purple-100 text-purple-700',
  };
  return colors[level];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} jam`;
  return `${hours} jam ${mins} menit`;
}
