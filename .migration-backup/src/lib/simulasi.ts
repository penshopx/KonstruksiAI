// ============================================================
// KONSTRUKSI AI - SIMULASI UJI KOMPETENSI MODULE
// Simulasi ujian sertifikasi SKK/SKKNI untuk tenaga teknik
// ============================================================

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-based)
  explanation: string;
  topic: string;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  reference?: string;
}

export interface ExamSet {
  id: string;
  title: string;
  description: string;
  category: ExamCategory;
  level: 'operator' | 'teknisi' | 'supervisor' | 'ahli';
  skkniCode?: string;
  duration: number; // in minutes
  passingScore: number; // percentage
  questions: ExamQuestion[];
  icon: string;
  color: string;
}

export type ExamCategory =
  | 'struktur'
  | 'arsitektur'
  | 'mekanikal'
  | 'elektrikal'
  | 'k3'
  | 'manajemen'
  | 'energi'
  | 'migas'
  | 'pengadaan';

export interface ExamResult {
  examId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  answers: number[];
  passed: boolean;
  completedAt: Date;
}

// ============ DATA: EXAM SETS ============

export const EXAM_SETS: ExamSet[] = [
  // === AHLI TEKNIK STRUKTUR ===
  {
    id: 'exam-001',
    title: 'Ahli Teknik Struktur Bangunan Gedung',
    description: 'Simulasi uji kompetensi SKK Ahli Teknik Struktur Bangunan Gedung sesuai SKKNI Konstruksi.',
    category: 'struktur',
    level: 'ahli',
    skkniCode: 'F.410100.001.01',
    duration: 90,
    passingScore: 70,
    icon: '🏗️',
    color: 'orange',
    questions: [
      {
        id: 'q-001-01',
        question: 'Berdasarkan SNI 2847:2019, faktor reduksi kekuatan (φ) untuk komponen lentur adalah:',
        options: ['0.65', '0.75', '0.90', '1.00'],
        correctAnswer: 2,
        explanation: 'Sesuai SNI 2847:2019 Pasal 21.2.1, faktor reduksi kekuatan untuk komponen yang dikontrol lentur adalah φ = 0.90.',
        topic: 'Beton Bertulang',
        difficulty: 'mudah',
        reference: 'SNI 2847:2019 Pasal 21.2.1',
      },
      {
        id: 'q-001-02',
        question: 'Kombinasi beban yang menghasilkan gaya terbesar pada struktur bangunan gedung biasa adalah:',
        options: [
          '1.4D',
          '1.2D + 1.6L',
          '1.2D + 1.0E + 1.0L',
          '0.9D + 1.0E',
        ],
        correctAnswer: 1,
        explanation: 'Kombinasi 1.2D + 1.6L umumnya menghasilkan gaya terbesar untuk beban gravitasi. Namun untuk zona gempa tinggi, 1.2D + 1.0E + 1.0L bisa lebih besar.',
        topic: 'Analisis Beban',
        difficulty: 'sedang',
        reference: 'SNI 2847:2019 Pasal 5.3',
      },
      {
        id: 'q-001-03',
        question: 'Mutu beton minimum untuk struktur bangunan gedung bertingkat sesuai SNI 2847:2019 adalah:',
        options: ['fc\' 17 MPa (K-200)', 'fc\' 21 MPa (K-250)', 'fc\' 25 MPa (K-300)', 'fc\' 28 MPa (K-350)'],
        correctAnswer: 1,
        explanation: 'SNI 2847:2019 mensyaratkan mutu beton minimum fc\' = 21 MPa (setara K-250) untuk struktur bangunan gedung.',
        topic: 'Material Beton',
        difficulty: 'mudah',
        reference: 'SNI 2847:2019 Pasal 26.4.3',
      },
      {
        id: 'q-001-04',
        question: 'Rasio tulangan minimum (ρmin) untuk balok beton bertulang dengan fy = 400 MPa adalah:',
        options: ['0.0025', '0.0035', '0.0050', '0.0075'],
        correctAnswer: 1,
        explanation: 'ρmin = 1.4/fy = 1.4/400 = 0.0035. Ini adalah nilai minimum untuk mencegah keruntuhan getas.',
        topic: 'Desain Balok',
        difficulty: 'sedang',
        reference: 'SNI 2847:2019 Pasal 9.6.1',
      },
      {
        id: 'q-001-05',
        question: 'Sistem Rangka Pemikul Momen Khusus (SRPMK) memiliki faktor modifikasi respons (R) sebesar:',
        options: ['3', '5', '8', '10'],
        correctAnswer: 2,
        explanation: 'SRPMK memiliki R = 8, yang merupakan nilai tertinggi untuk sistem rangka beton bertulang, menunjukkan daktilitas tinggi.',
        topic: 'Analisis Gempa',
        difficulty: 'sedang',
        reference: 'SNI 1726:2019 Tabel 12',
      },
      {
        id: 'q-001-06',
        question: 'Tebal minimum pelat satu arah dengan bentang 5 m dan tumpuan sederhana adalah:',
        options: ['150 mm', '200 mm', '250 mm', '300 mm'],
        correctAnswer: 2,
        explanation: 'Tebal minimum pelat satu arah dengan tumpuan sederhana = L/20 = 5000/20 = 250 mm.',
        topic: 'Desain Pelat',
        difficulty: 'mudah',
        reference: 'SNI 2847:2019 Tabel 9.3.1.1',
      },
      {
        id: 'q-001-07',
        question: 'Beban hidup minimum untuk lantai kantor sesuai SNI 1727:2020 adalah:',
        options: ['1.5 kN/m²', '2.4 kN/m²', '3.0 kN/m²', '4.8 kN/m²'],
        correctAnswer: 1,
        explanation: 'Beban hidup untuk lantai kantor adalah 2.4 kN/m² sesuai SNI 1727:2020.',
        topic: 'Beban Bangunan',
        difficulty: 'mudah',
        reference: 'SNI 1727:2020 Tabel 4.3-1',
      },
      {
        id: 'q-001-08',
        question: 'Pondasi tiang pancang digunakan ketika:',
        options: [
          'Daya dukung tanah > 2 kg/cm²',
          'Tanah keras berada di kedalaman dangkal',
          'Tanah lunak atau beban struktur sangat besar',
          'Bangunan hanya 1-2 lantai',
        ],
        correctAnswer: 2,
        explanation: 'Pondasi tiang pancang digunakan ketika tanah permukaan lunak dan tanah keras berada di kedalaman besar, atau ketika beban struktur sangat besar.',
        topic: 'Pondasi',
        difficulty: 'mudah',
        reference: 'SNI 8460:2017',
      },
      {
        id: 'q-001-09',
        question: 'Dalam analisis gempa metode statik ekivalen, gaya geser dasar (V) dihitung dengan rumus:',
        options: ['V = Cs × W', 'V = Sa × W / R', 'V = PGA × W', 'V = Sd1 × W / T'],
        correctAnswer: 0,
        explanation: 'Gaya geser dasar V = Cs × W, dimana Cs adalah koefisien respons seismik dan W adalah berat seismik efektif.',
        topic: 'Analisis Gempa',
        difficulty: 'sedang',
        reference: 'SNI 1726:2019 Pasal 7.8',
      },
      {
        id: 'q-001-10',
        question: 'Selimut beton minimum untuk balok yang terekspos langsung ke tanah adalah:',
        options: ['20 mm', '40 mm', '50 mm', '75 mm'],
        correctAnswer: 3,
        explanation: 'Selimut beton minimum untuk komponen yang terekspos langsung ke tanah adalah 75 mm sesuai SNI 2847:2019.',
        topic: 'Detail Beton',
        difficulty: 'sedang',
        reference: 'SNI 2847:2019 Tabel 20.6.1.3',
      },
    ],
  },

  // === AHLI K3 KONSTRUKSI ===
  {
    id: 'exam-002',
    title: 'Ahli K3 Konstruksi',
    description: 'Simulasi uji kompetensi SKK Ahli K3 Konstruksi sesuai Permen Naker dan SKKNI K3.',
    category: 'k3',
    level: 'ahli',
    skkniCode: 'M.711000.001.01',
    duration: 90,
    passingScore: 70,
    icon: '🦺',
    color: 'red',
    questions: [
      {
        id: 'q-002-01',
        question: 'Undang-undang yang menjadi dasar hukum utama K3 di Indonesia adalah:',
        options: ['UU No. 13/2003', 'UU No. 1/1970', 'UU No. 2/2017', 'UU No. 36/2009'],
        correctAnswer: 1,
        explanation: 'UU No. 1/1970 tentang Keselamatan Kerja adalah dasar hukum utama K3 di Indonesia.',
        topic: 'Regulasi K3',
        difficulty: 'mudah',
        reference: 'UU No. 1/1970',
      },
      {
        id: 'q-002-02',
        question: 'Hierarki pengendalian risiko K3 yang paling efektif adalah:',
        options: ['APD', 'Administrasi', 'Rekayasa teknik', 'Eliminasi'],
        correctAnswer: 3,
        explanation: 'Eliminasi adalah pengendalian paling efektif karena menghilangkan bahaya sepenuhnya. Hierarki: Eliminasi > Substitusi > Rekayasa > Administrasi > APD.',
        topic: 'Pengendalian Risiko',
        difficulty: 'mudah',
        reference: 'ISO 45001:2018',
      },
      {
        id: 'q-002-03',
        question: 'Perusahaan wajib menerapkan SMK3 jika memiliki tenaga kerja minimal:',
        options: ['50 orang', '100 orang', '200 orang', '500 orang'],
        correctAnswer: 1,
        explanation: 'Berdasarkan PP No. 50/2012, perusahaan wajib menerapkan SMK3 jika memiliki ≥100 tenaga kerja atau memiliki tingkat potensi bahaya tinggi.',
        topic: 'SMK3',
        difficulty: 'mudah',
        reference: 'PP No. 50/2012 Pasal 5',
      },
      {
        id: 'q-002-04',
        question: 'Batas waktu pelaporan kecelakaan kerja kepada Disnaker adalah:',
        options: ['1x24 jam', '2x24 jam', '3x24 jam', '7 hari'],
        correctAnswer: 1,
        explanation: 'Kecelakaan kerja harus dilaporkan kepada Disnaker dalam waktu 2x24 jam sesuai UU No. 1/1970.',
        topic: 'Pelaporan Kecelakaan',
        difficulty: 'mudah',
        reference: 'UU No. 1/1970 Pasal 11',
      },
      {
        id: 'q-002-05',
        question: 'HIRARC adalah singkatan dari:',
        options: [
          'Hazard Identification, Risk Assessment, Risk Control',
          'Health, Injury, Risk, Accident, Response, Control',
          'Hazard Investigation, Risk Analysis, Risk Correction',
          'Health Inspection, Risk Assessment, Risk Compliance',
        ],
        correctAnswer: 0,
        explanation: 'HIRARC = Hazard Identification, Risk Assessment, and Risk Control. Ini adalah metode sistematis untuk mengidentifikasi dan mengendalikan bahaya.',
        topic: 'Manajemen Risiko K3',
        difficulty: 'mudah',
        reference: 'ISO 45001:2018',
      },
      {
        id: 'q-002-06',
        question: 'Nilai risiko dalam matriks risiko dihitung dengan:',
        options: [
          'Probabilitas + Dampak',
          'Probabilitas × Dampak',
          'Probabilitas / Dampak',
          'Probabilitas - Dampak',
        ],
        correctAnswer: 1,
        explanation: 'Nilai risiko = Probabilitas (likelihood) × Dampak (severity/consequence). Ini menghasilkan matriks risiko 5×5.',
        topic: 'Penilaian Risiko',
        difficulty: 'mudah',
        reference: 'ISO 31000:2018',
      },
      {
        id: 'q-002-07',
        question: 'Pekerjaan di ketinggian (>1.8 m) wajib menggunakan:',
        options: ['Helm safety', 'Full body harness', 'Safety shoes', 'Rompi safety'],
        correctAnswer: 1,
        explanation: 'Pekerjaan di ketinggian >1.8 m wajib menggunakan full body harness sesuai Permen Naker No. 9/2016.',
        topic: 'APD',
        difficulty: 'mudah',
        reference: 'Permen Naker No. 9/2016',
      },
      {
        id: 'q-002-08',
        question: 'Audit SMK3 eksternal dilakukan oleh:',
        options: ['Internal perusahaan', 'Konsultan K3', 'Kementerian Ketenagakerjaan', 'BPJS Ketenagakerjaan'],
        correctAnswer: 2,
        explanation: 'Audit SMK3 eksternal dilakukan oleh lembaga audit yang ditunjuk oleh Kementerian Ketenagakerjaan.',
        topic: 'Audit K3',
        difficulty: 'sedang',
        reference: 'PP No. 50/2012 Pasal 16',
      },
      {
        id: 'q-002-09',
        question: 'Bendera K3 Emas diberikan kepada perusahaan yang mencapai nilai audit SMK3:',
        options: ['> 60%', '> 70%', '> 85%', '100%'],
        correctAnswer: 2,
        explanation: 'Bendera K3 Emas diberikan untuk nilai audit >85%, sedangkan Bendera K3 Perak untuk nilai 60-85%.',
        topic: 'Penghargaan K3',
        difficulty: 'sedang',
        reference: 'PP No. 50/2012',
      },
      {
        id: 'q-002-10',
        question: 'JSA (Job Safety Analysis) adalah:',
        options: [
          'Laporan kecelakaan kerja',
          'Analisis bahaya per langkah pekerjaan',
          'Sertifikat keselamatan kerja',
          'Prosedur evakuasi darurat',
        ],
        correctAnswer: 1,
        explanation: 'JSA adalah metode analisis bahaya yang mengidentifikasi bahaya dan pengendalian untuk setiap langkah pekerjaan secara sistematis.',
        topic: 'Analisis Bahaya',
        difficulty: 'mudah',
        reference: 'OSHA 3071',
      },
    ],
  },

  // === TEKNISI INSTALASI LISTRIK ===
  {
    id: 'exam-003',
    title: 'Teknisi Instalasi Listrik Bangunan',
    description: 'Simulasi uji kompetensi SKK Teknisi Instalasi Listrik Bangunan sesuai PUIL 2011 dan SKKNI.',
    category: 'elektrikal',
    level: 'teknisi',
    skkniCode: 'D.35.112.01.KUALIFIKASI.2.KITLB',
    duration: 60,
    passingScore: 70,
    icon: '⚡',
    color: 'yellow',
    questions: [
      {
        id: 'q-003-01',
        question: 'Tegangan standar untuk instalasi listrik rumah tinggal di Indonesia adalah:',
        options: ['110V / 60 Hz', '220V / 50 Hz', '380V / 50 Hz', '440V / 60 Hz'],
        correctAnswer: 1,
        explanation: 'Tegangan standar untuk instalasi listrik rumah tinggal di Indonesia adalah 220V / 50 Hz (satu fasa).',
        topic: 'Dasar Kelistrikan',
        difficulty: 'mudah',
        reference: 'PUIL 2011',
      },
      {
        id: 'q-003-02',
        question: 'Kabel NYM digunakan untuk:',
        options: [
          'Instalasi dalam tanah',
          'Instalasi dalam ruangan kering',
          'Instalasi di luar ruangan',
          'Instalasi di area basah',
        ],
        correctAnswer: 1,
        explanation: 'Kabel NYM (Nayylon Mantel) digunakan untuk instalasi dalam ruangan kering. Untuk dalam tanah digunakan NYY atau NYFGBY.',
        topic: 'Kabel Listrik',
        difficulty: 'mudah',
        reference: 'PUIL 2011',
      },
      {
        id: 'q-003-03',
        question: 'RCCB (Residual Current Circuit Breaker) berfungsi untuk:',
        options: [
          'Proteksi arus lebih',
          'Proteksi hubung singkat',
          'Proteksi arus bocor ke tanah',
          'Proteksi tegangan lebih',
        ],
        correctAnswer: 2,
        explanation: 'RCCB berfungsi memutus arus ketika ada arus bocor ke tanah (ground fault), melindungi dari kejut listrik. Sensitivitas standar: 30 mA.',
        topic: 'Proteksi Listrik',
        difficulty: 'sedang',
        reference: 'PUIL 2011 Pasal 4.4',
      },
      {
        id: 'q-003-04',
        question: 'Warna kabel netral (N) dalam instalasi listrik Indonesia adalah:',
        options: ['Merah', 'Hitam', 'Biru', 'Kuning-hijau'],
        correctAnswer: 2,
        explanation: 'Standar warna kabel: Fasa (L) = merah/hitam/kuning, Netral (N) = biru, Grounding (PE) = kuning-hijau.',
        topic: 'Standar Kabel',
        difficulty: 'mudah',
        reference: 'PUIL 2011',
      },
      {
        id: 'q-003-05',
        question: 'Tahanan isolasi minimum kabel instalasi listrik adalah:',
        options: ['0.5 MΩ', '1 MΩ', '2 MΩ', '5 MΩ'],
        correctAnswer: 1,
        explanation: 'Tahanan isolasi minimum untuk instalasi listrik adalah 1 MΩ sesuai PUIL 2011.',
        topic: 'Pengujian Instalasi',
        difficulty: 'sedang',
        reference: 'PUIL 2011 Pasal 9.1',
      },
      {
        id: 'q-003-06',
        question: 'Luas penampang kabel minimum untuk instalasi penerangan rumah tinggal adalah:',
        options: ['0.75 mm²', '1.5 mm²', '2.5 mm²', '4 mm²'],
        correctAnswer: 1,
        explanation: 'Luas penampang minimum untuk instalasi penerangan adalah 1.5 mm², sedangkan untuk stop kontak adalah 2.5 mm².',
        topic: 'Sizing Kabel',
        difficulty: 'mudah',
        reference: 'PUIL 2011',
      },
      {
        id: 'q-003-07',
        question: 'SLO (Sertifikat Laik Operasi) untuk instalasi listrik diterbitkan oleh:',
        options: ['PLN', 'Kementerian ESDM', 'Lembaga Inspeksi Teknik (LIT)', 'Disnaker'],
        correctAnswer: 2,
        explanation: 'SLO diterbitkan oleh Lembaga Inspeksi Teknik (LIT) yang terakreditasi oleh Kementerian ESDM.',
        topic: 'Perizinan Listrik',
        difficulty: 'sedang',
        reference: 'Permen ESDM No. 19/2015',
      },
      {
        id: 'q-003-08',
        question: 'Sistem grounding TN-S berarti:',
        options: [
          'Tanpa grounding',
          'Grounding terpisah dari netral',
          'Grounding digabung dengan netral',
          'Grounding melalui transformator',
        ],
        correctAnswer: 1,
        explanation: 'TN-S (Terra Neutral Separated) berarti konduktor proteksi (PE) dan netral (N) terpisah sepanjang instalasi.',
        topic: 'Sistem Grounding',
        difficulty: 'sulit',
        reference: 'IEC 60364',
      },
      {
        id: 'q-003-09',
        question: 'Daya listrik (P) dihitung dengan rumus:',
        options: ['P = V + I', 'P = V × I × cos φ', 'P = V / I', 'P = I² / R'],
        correctAnswer: 1,
        explanation: 'Daya aktif P = V × I × cos φ, dimana cos φ adalah faktor daya. Untuk beban resistif murni, cos φ = 1.',
        topic: 'Dasar Kelistrikan',
        difficulty: 'mudah',
        reference: 'Dasar Teknik Listrik',
      },
      {
        id: 'q-003-10',
        question: 'MCB (Miniature Circuit Breaker) berfungsi untuk:',
        options: [
          'Hanya proteksi arus lebih',
          'Hanya proteksi hubung singkat',
          'Proteksi arus lebih dan hubung singkat',
          'Proteksi tegangan lebih',
        ],
        correctAnswer: 2,
        explanation: 'MCB berfungsi untuk proteksi arus lebih (overload) dan hubung singkat (short circuit). Ini adalah proteksi dasar instalasi listrik.',
        topic: 'Proteksi Listrik',
        difficulty: 'mudah',
        reference: 'PUIL 2011',
      },
    ],
  },

  // === AHLI MANAJEMEN PROYEK ===
  {
    id: 'exam-004',
    title: 'Ahli Manajemen Proyek Konstruksi',
    description: 'Simulasi uji kompetensi SKK Ahli Manajemen Proyek Konstruksi sesuai SKKNI dan PMBOK.',
    category: 'manajemen',
    level: 'ahli',
    skkniCode: 'M.711000.002.01',
    duration: 90,
    passingScore: 70,
    icon: '📊',
    color: 'blue',
    questions: [
      {
        id: 'q-004-01',
        question: 'Metode yang digunakan untuk mengidentifikasi jalur kritis dalam jadwal proyek adalah:',
        options: ['WBS', 'CPM (Critical Path Method)', 'EVM', 'PERT'],
        correctAnswer: 1,
        explanation: 'CPM (Critical Path Method) digunakan untuk mengidentifikasi jalur kritis, yaitu rangkaian aktivitas yang menentukan durasi minimum proyek.',
        topic: 'Penjadwalan Proyek',
        difficulty: 'mudah',
        reference: 'PMBOK Guide',
      },
      {
        id: 'q-004-02',
        question: 'Earned Value Management (EVM) menggunakan indikator SPI untuk mengukur:',
        options: ['Kinerja biaya', 'Kinerja jadwal', 'Kualitas pekerjaan', 'Risiko proyek'],
        correctAnswer: 1,
        explanation: 'SPI (Schedule Performance Index) = EV/PV mengukur kinerja jadwal. SPI > 1 berarti lebih cepat dari rencana.',
        topic: 'Pengendalian Proyek',
        difficulty: 'sedang',
        reference: 'PMBOK Guide',
      },
      {
        id: 'q-004-03',
        question: 'Dokumen yang mendefinisikan lingkup, jadwal, dan biaya proyek secara resmi adalah:',
        options: ['Project Charter', 'Project Management Plan', 'Scope Statement', 'WBS'],
        correctAnswer: 1,
        explanation: 'Project Management Plan adalah dokumen komprehensif yang mendefinisikan bagaimana proyek akan dieksekusi, dipantau, dan dikendalikan.',
        topic: 'Perencanaan Proyek',
        difficulty: 'sedang',
        reference: 'PMBOK Guide',
      },
      {
        id: 'q-004-04',
        question: 'Denda keterlambatan dalam kontrak pemerintah maksimal adalah:',
        options: ['1% dari nilai kontrak', '3% dari nilai kontrak', '5% dari nilai kontrak', '10% dari nilai kontrak'],
        correctAnswer: 2,
        explanation: 'Berdasarkan Perpres 16/2018, denda keterlambatan adalah 1/1000 per hari dengan maksimal 5% dari nilai kontrak.',
        topic: 'Kontrak Konstruksi',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018',
      },
      {
        id: 'q-004-05',
        question: 'Float (slack) dalam CPM adalah:',
        options: [
          'Waktu mulai paling awal aktivitas',
          'Waktu selesai paling akhir aktivitas',
          'Waktu cadangan yang tersedia tanpa menunda proyek',
          'Durasi aktivitas kritis',
        ],
        correctAnswer: 2,
        explanation: 'Float adalah waktu cadangan yang tersedia untuk suatu aktivitas tanpa menunda penyelesaian proyek. Aktivitas kritis memiliki float = 0.',
        topic: 'Penjadwalan Proyek',
        difficulty: 'sedang',
        reference: 'PMBOK Guide',
      },
      {
        id: 'q-004-06',
        question: 'Kurva S dalam manajemen proyek digunakan untuk:',
        options: [
          'Analisis risiko',
          'Monitoring kemajuan proyek vs rencana',
          'Perhitungan biaya',
          'Identifikasi stakeholder',
        ],
        correctAnswer: 1,
        explanation: 'Kurva S menggambarkan akumulasi kemajuan (biaya atau pekerjaan) terhadap waktu, digunakan untuk monitoring dan pengendalian proyek.',
        topic: 'Pengendalian Proyek',
        difficulty: 'mudah',
        reference: 'Manajemen Proyek Konstruksi',
      },
      {
        id: 'q-004-07',
        question: 'PHO (Provisional Hand Over) adalah:',
        options: [
          'Serah terima akhir proyek',
          'Serah terima pertama setelah konstruksi selesai',
          'Serah terima dokumen proyek',
          'Serah terima lahan kepada kontraktor',
        ],
        correctAnswer: 1,
        explanation: 'PHO adalah serah terima pertama (sementara) setelah konstruksi selesai. Setelah masa pemeliharaan, dilakukan FHO (Final Hand Over).',
        topic: 'Serah Terima Proyek',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018',
      },
      {
        id: 'q-004-08',
        question: 'Contingency dalam RAB proyek biasanya berkisar:',
        options: ['1-2%', '5-10%', '15-20%', '25-30%'],
        correctAnswer: 1,
        explanation: 'Contingency dalam RAB biasanya 5-10% dari total biaya untuk mengantisipasi ketidakpastian dan risiko yang belum teridentifikasi.',
        topic: 'Estimasi Biaya',
        difficulty: 'mudah',
        reference: 'Manajemen Proyek Konstruksi',
      },
      {
        id: 'q-004-09',
        question: 'Addendum kontrak diperlukan ketika:',
        options: [
          'Kontraktor meminta perpanjangan waktu',
          'Ada perubahan lingkup, waktu, atau harga kontrak',
          'Terjadi kecelakaan kerja',
          'Subkontraktor berganti',
        ],
        correctAnswer: 1,
        explanation: 'Addendum kontrak diperlukan ketika ada perubahan resmi terhadap lingkup pekerjaan, waktu pelaksanaan, atau nilai kontrak.',
        topic: 'Administrasi Kontrak',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018',
      },
      {
        id: 'q-004-10',
        question: 'Rencana Mutu Kontrak (RMK) disusun oleh:',
        options: ['Pemilik proyek (owner)', 'Kontraktor pelaksana', 'Konsultan pengawas', 'LKPP'],
        correctAnswer: 1,
        explanation: 'RMK disusun oleh kontraktor pelaksana sebagai dokumen jaminan mutu yang menjelaskan bagaimana pekerjaan akan dilaksanakan sesuai spesifikasi.',
        topic: 'Manajemen Mutu',
        difficulty: 'sedang',
        reference: 'Permen PUPR No. 14/2020',
      },
    ],
  },

  // === TEKNISI PLTS ===
  {
    id: 'exam-005',
    title: 'Teknisi Instalasi PLTS',
    description: 'Simulasi uji kompetensi SKK Teknisi Instalasi PLTS sesuai SKKNI Energi Terbarukan.',
    category: 'energi',
    level: 'teknisi',
    skkniCode: 'D.35.140.01.KUALIFIKASI.2.KIPLTS',
    duration: 60,
    passingScore: 70,
    icon: '☀️',
    color: 'amber',
    questions: [
      {
        id: 'q-005-01',
        question: 'Irradiasi matahari rata-rata di Indonesia adalah:',
        options: ['2-3 kWh/m²/hari', '3-4 kWh/m²/hari', '4.5-5.5 kWh/m²/hari', '6-7 kWh/m²/hari'],
        correctAnswer: 2,
        explanation: 'Indonesia memiliki irradiasi matahari rata-rata 4.5-5.5 kWh/m²/hari, menjadikannya salah satu negara dengan potensi surya terbaik.',
        topic: 'Potensi Surya',
        difficulty: 'mudah',
        reference: 'IESR Solar Handbook',
      },
      {
        id: 'q-005-02',
        question: 'Panel surya monocrystalline memiliki efisiensi sekitar:',
        options: ['8-12%', '13-16%', '18-22%', '25-30%'],
        correctAnswer: 2,
        explanation: 'Panel surya monocrystalline memiliki efisiensi 18-22%, lebih tinggi dari polycrystalline (15-18%) karena kemurnian silikon yang lebih tinggi.',
        topic: 'Panel Surya',
        difficulty: 'mudah',
        reference: 'IEC 61215',
      },
      {
        id: 'q-005-03',
        question: 'Performance Ratio (PR) sistem PLTS yang baik adalah:',
        options: ['50-60%', '65-70%', '75-85%', '90-95%'],
        correctAnswer: 2,
        explanation: 'Performance Ratio 75-85% adalah nilai yang baik untuk sistem PLTS, memperhitungkan kerugian akibat suhu, kabel, inverter, dan faktor lainnya.',
        topic: 'Kinerja PLTS',
        difficulty: 'sedang',
        reference: 'IEC 61724',
      },
      {
        id: 'q-005-04',
        question: 'Kapasitas PLTS rooftop maksimum yang diizinkan sesuai Permen ESDM 26/2021 adalah:',
        options: [
          '50% dari daya tersambung PLN',
          '100% dari daya tersambung PLN',
          '150% dari daya tersambung PLN',
          'Tidak ada batasan',
        ],
        correctAnswer: 1,
        explanation: 'Sesuai Permen ESDM 26/2021, kapasitas PLTS rooftop maksimum adalah 100% dari daya tersambung PLN.',
        topic: 'Regulasi PLTS',
        difficulty: 'sedang',
        reference: 'Permen ESDM 26/2021',
      },
      {
        id: 'q-005-05',
        question: 'Sudut kemiringan (tilt angle) optimal panel surya di Indonesia adalah:',
        options: ['0° (horizontal)', '10-15°', '30-45°', '60-90°'],
        correctAnswer: 1,
        explanation: 'Di Indonesia yang berada di sekitar khatulistiwa, tilt angle optimal adalah 10-15° menghadap utara atau selatan tergantung lokasi.',
        topic: 'Instalasi Panel Surya',
        difficulty: 'sedang',
        reference: 'IESR Solar Handbook',
      },
      {
        id: 'q-005-06',
        question: 'Inverter string pada PLTS berfungsi untuk:',
        options: [
          'Menyimpan energi listrik',
          'Mengubah arus DC dari panel menjadi AC',
          'Mengukur produksi listrik',
          'Melindungi panel dari petir',
        ],
        correctAnswer: 1,
        explanation: 'Inverter mengubah arus searah (DC) yang dihasilkan panel surya menjadi arus bolak-balik (AC) yang dapat digunakan peralatan listrik.',
        topic: 'Komponen PLTS',
        difficulty: 'mudah',
        reference: 'IEC 62109',
      },
      {
        id: 'q-005-07',
        question: 'Rumus untuk menghitung kapasitas PLTS yang dibutuhkan adalah:',
        options: [
          'Kapasitas = Kebutuhan energi / Irradiasi',
          'Kapasitas = Kebutuhan energi / (Irradiasi × PR)',
          'Kapasitas = Irradiasi × PR',
          'Kapasitas = Kebutuhan energi × Irradiasi',
        ],
        correctAnswer: 1,
        explanation: 'Kapasitas (kWp) = Kebutuhan energi (kWh/hari) / (Irradiasi (kWh/m²/hari) × Performance Ratio)',
        topic: 'Sizing PLTS',
        difficulty: 'sedang',
        reference: 'IESR Solar Handbook',
      },
      {
        id: 'q-005-08',
        question: 'SLO untuk instalasi PLTS diterbitkan oleh:',
        options: ['PLN', 'Kementerian ESDM / LIT', 'BPPT', 'Kementerian PUPR'],
        correctAnswer: 1,
        explanation: 'SLO (Sertifikat Laik Operasi) untuk instalasi PLTS diterbitkan oleh Lembaga Inspeksi Teknik (LIT) yang terakreditasi Kementerian ESDM.',
        topic: 'Perizinan PLTS',
        difficulty: 'mudah',
        reference: 'Permen ESDM 26/2021',
      },
      {
        id: 'q-005-09',
        question: 'Pengujian IV curve pada panel surya dilakukan untuk:',
        options: [
          'Mengukur tegangan panel',
          'Mengukur arus panel',
          'Mengevaluasi karakteristik dan kinerja panel',
          'Mengukur suhu panel',
        ],
        correctAnswer: 2,
        explanation: 'IV curve (Current-Voltage curve) menggambarkan karakteristik panel surya dan digunakan untuk mengevaluasi kinerja, mendeteksi kerusakan, dan memverifikasi spesifikasi.',
        topic: 'Pengujian PLTS',
        difficulty: 'sulit',
        reference: 'IEC 62446',
      },
      {
        id: 'q-005-10',
        question: 'Baterai yang paling umum digunakan untuk sistem PLTS off-grid saat ini adalah:',
        options: ['Lead-acid (aki)', 'Lithium Iron Phosphate (LFP)', 'Nickel-Cadmium', 'Zinc-Air'],
        correctAnswer: 1,
        explanation: 'Baterai Lithium Iron Phosphate (LFP) semakin populer karena siklus hidup lebih panjang (2000-6000 siklus), lebih aman, dan efisiensi lebih tinggi dibanding lead-acid.',
        topic: 'Penyimpanan Energi',
        difficulty: 'sedang',
        reference: 'IEC 62619',
      },
    ],
  },

  // === PENGADAAN BARANG/JASA ===
  {
    id: 'exam-006',
    title: 'Pengadaan Barang/Jasa Pemerintah',
    description: 'Simulasi uji kompetensi Sertifikat Pengadaan LKPP Level 1 sesuai Perpres 16/2018.',
    category: 'pengadaan',
    level: 'ahli',
    skkniCode: 'M.749020.001.02',
    duration: 90,
    passingScore: 70,
    icon: '📋',
    color: 'purple',
    questions: [
      {
        id: 'q-006-01',
        question: 'Perpres yang mengatur pengadaan barang/jasa pemerintah saat ini adalah:',
        options: ['Perpres 54/2010', 'Perpres 16/2018 jo. 12/2021', 'Perpres 70/2012', 'Perpres 4/2015'],
        correctAnswer: 1,
        explanation: 'Perpres 16/2018 yang telah diubah dengan Perpres 12/2021 adalah regulasi utama pengadaan barang/jasa pemerintah yang berlaku saat ini.',
        topic: 'Regulasi Pengadaan',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 jo. 12/2021',
      },
      {
        id: 'q-006-02',
        question: 'Nilai pengadaan yang dapat dilakukan dengan metode pengadaan langsung adalah:',
        options: ['< Rp 50 juta', '< Rp 200 juta', '< Rp 500 juta', '< Rp 1 miliar'],
        correctAnswer: 1,
        explanation: 'Pengadaan langsung dapat dilakukan untuk nilai < Rp 200 juta untuk barang/jasa lainnya dan < Rp 200 juta untuk pekerjaan konstruksi.',
        topic: 'Metode Pengadaan',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 38',
      },
      {
        id: 'q-006-03',
        question: 'HPS (Harga Perkiraan Sendiri) dalam pengadaan pemerintah berfungsi sebagai:',
        options: [
          'Harga yang harus ditawarkan kontraktor',
          'Batas atas harga penawaran yang dapat diterima',
          'Harga minimum penawaran',
          'Harga negosiasi akhir',
        ],
        correctAnswer: 1,
        explanation: 'HPS adalah batas atas harga penawaran yang dapat diterima. Penawaran yang melebihi HPS dinyatakan gugur.',
        topic: 'HPS',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 26',
      },
      {
        id: 'q-006-04',
        question: 'Jaminan pelaksanaan dalam kontrak pemerintah besarnya adalah:',
        options: ['1-3% dari nilai kontrak', '5% dari nilai kontrak', '10% dari nilai kontrak', '15% dari nilai kontrak'],
        correctAnswer: 1,
        explanation: 'Jaminan pelaksanaan adalah 5% dari nilai kontrak, diberikan setelah penetapan pemenang dan sebelum penandatanganan kontrak.',
        topic: 'Jaminan Pengadaan',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 36',
      },
      {
        id: 'q-006-05',
        question: 'Pokja (Kelompok Kerja) dalam pengadaan pemerintah bertugas untuk:',
        options: [
          'Menyusun anggaran proyek',
          'Melaksanakan pemilihan penyedia',
          'Menandatangani kontrak',
          'Menerima hasil pekerjaan',
        ],
        correctAnswer: 1,
        explanation: 'Pokja bertugas melaksanakan pemilihan penyedia barang/jasa, mulai dari penyusunan dokumen pemilihan hingga penetapan pemenang.',
        topic: 'Pelaku Pengadaan',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 8',
      },
      {
        id: 'q-006-06',
        question: 'Masa sanggah dalam proses tender adalah:',
        options: ['3 hari kerja', '5 hari kerja', '7 hari kerja', '14 hari kerja'],
        correctAnswer: 1,
        explanation: 'Masa sanggah adalah 5 hari kerja setelah pengumuman hasil pemilihan. Peserta yang tidak puas dapat mengajukan sanggah.',
        topic: 'Proses Tender',
        difficulty: 'sedang',
        reference: 'Perpres 16/2018 Pasal 51',
      },
      {
        id: 'q-006-07',
        question: 'E-purchasing melalui e-katalog LKPP digunakan untuk:',
        options: [
          'Semua jenis pengadaan',
          'Pengadaan barang/jasa yang sudah ada di katalog',
          'Hanya pengadaan konstruksi',
          'Pengadaan nilai besar',
        ],
        correctAnswer: 1,
        explanation: 'E-purchasing digunakan untuk membeli barang/jasa yang sudah terdaftar dalam e-katalog LKPP, prosesnya lebih cepat dan transparan.',
        topic: 'E-Procurement',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 50',
      },
      {
        id: 'q-006-08',
        question: 'Spesifikasi teknis dalam dokumen pengadaan tidak boleh:',
        options: [
          'Mencantumkan standar SNI',
          'Menyebut merek atau produk tertentu',
          'Mencantumkan persyaratan teknis',
          'Mencantumkan standar internasional',
        ],
        correctAnswer: 1,
        explanation: 'Spesifikasi teknis tidak boleh menyebut merek atau produk tertentu karena dapat membatasi persaingan. Harus menggunakan spesifikasi kinerja atau standar.',
        topic: 'Spesifikasi Teknis',
        difficulty: 'mudah',
        reference: 'Perpres 16/2018 Pasal 19',
      },
      {
        id: 'q-006-09',
        question: 'PPK (Pejabat Pembuat Komitmen) bertanggung jawab untuk:',
        options: [
          'Melaksanakan pemilihan penyedia',
          'Menandatangani dan mengelola kontrak',
          'Menyusun anggaran',
          'Menerima hasil pekerjaan akhir',
        ],
        correctAnswer: 1,
        explanation: 'PPK bertanggung jawab menandatangani kontrak, mengelola pelaksanaan kontrak, dan memastikan pekerjaan sesuai spesifikasi.',
        topic: 'Pelaku Pengadaan',
        difficulty: 'sedang',
        reference: 'Perpres 16/2018 Pasal 11',
      },
      {
        id: 'q-006-10',
        question: 'Kontrak lump sum digunakan ketika:',
        options: [
          'Volume pekerjaan belum pasti',
          'Lingkup dan volume pekerjaan sudah jelas',
          'Pekerjaan darurat',
          'Nilai kontrak kecil',
        ],
        correctAnswer: 1,
        explanation: 'Kontrak lump sum digunakan ketika lingkup dan volume pekerjaan sudah jelas dan pasti. Harga tetap tidak berubah meskipun ada perubahan volume minor.',
        topic: 'Jenis Kontrak',
        difficulty: 'sedang',
        reference: 'Perpres 16/2018 Pasal 27',
      },
    ],
  },
];

// ============ HELPER FUNCTIONS ============

export function getExamById(id: string): ExamSet | undefined {
  return EXAM_SETS.find(e => e.id === id);
}

export function getExamsByCategory(category: ExamCategory): ExamSet[] {
  return EXAM_SETS.filter(e => e.category === category);
}

export function getExamsByLevel(level: ExamSet['level']): ExamSet[] {
  return EXAM_SETS.filter(e => e.level === level);
}

export function getCategoryLabel(category: ExamCategory): string {
  const labels: Record<ExamCategory, string> = {
    struktur: 'Teknik Struktur',
    arsitektur: 'Arsitektur',
    mekanikal: 'Mekanikal',
    elektrikal: 'Elektrikal',
    k3: 'K3 & Keselamatan',
    manajemen: 'Manajemen Proyek',
    energi: 'Energi & EBT',
    migas: 'Migas & Tambang',
    pengadaan: 'Pengadaan',
  };
  return labels[category] || category;
}

export function getLevelLabel(level: ExamSet['level']): string {
  const labels = {
    operator: 'Operator',
    teknisi: 'Teknisi',
    supervisor: 'Supervisor',
    ahli: 'Ahli',
  };
  return labels[level];
}

export function getLevelColor(level: ExamSet['level']): string {
  const colors = {
    operator: 'bg-green-100 text-green-700',
    teknisi: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-orange-100 text-orange-700',
    ahli: 'bg-purple-100 text-purple-700',
  };
  return colors[level];
}

export function calculateScore(questions: ExamQuestion[], answers: number[]): {
  score: number;
  correct: number;
  total: number;
} {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) correct++;
  });
  return {
    score: Math.round((correct / questions.length) * 100),
    correct,
    total: questions.length,
  };
}
