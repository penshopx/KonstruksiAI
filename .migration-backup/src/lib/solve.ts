// ============================================================
// KONSTRUKSI AI - SOLVE MODULE
// Problem Database & Community Solutions
// ============================================================

export type ProblemDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type ProblemStatus = 'solved' | 'unsolved' | 'in_progress';

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Solution {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  code?: string;
  language?: string;
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  category: 'konstruksi' | 'struktur' | 'mekanika' | 'hidroteknik' | 'geoteknik' | 'transportasi' | 'energi' | 'migas' | 'manajemen' | 'ekonomi';
  difficulty: ProblemDifficulty;
  description: string;
  points: number;
  estimatedTime: string; // e.g., "30 menit"
  solvedCount: number;
  attemptedCount: number;
  acceptanceRate: number; // percentage
  tags: string[];
  prerequisites: string[];
  testCases: TestCase[];
  hints: string[];
  solutions: Solution[];
  relatedProblems: string[];
}

export interface UserSubmission {
  problemId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  submittedAt: Date;
  timeSpent: number; // in minutes
}

// ============================================================
// PROBLEMS DATABASE
// ============================================================

export const PROBLEMS: Problem[] = [
  // ============ STRUKTUR ============
  {
    id: 'prob-001',
    title: 'Analisis Balok Sederhana',
    slug: 'analisis-balok-sederhana',
    category: 'struktur',
    difficulty: 'easy',
    description: `Sebuah balok beton bertulang dengan panjang 6 meter menumpu sederhana di kedua ujungnya. Balok tersebut menerima beban terpusat P = 20 kN di tengah bentang.

Hitunglah:
1. Reaksi tumpuan di A dan B
2. Momen maksimum pada balok
3. Gaya lintang maksimum

Gunakan persamaan kesetimbangan statis.`,
    points: 100,
    estimatedTime: '20 menit',
    solvedCount: 1247,
    attemptedCount: 1589,
    acceptanceRate: 78,
    tags: ['balok', 'momen', 'reaksi tumpuan', 'statika'],
    prerequisites: ['Dasar statika', 'Kesetimbangan gaya'],
    testCases: [
      {
        input: 'L = 6m, P = 20kN, a = 3m dari A',
        expectedOutput: 'RA = 10kN, RB = 10kN, Mmax = 30kNm, Vmax = 10kN',
        explanation: 'Dari ΣM = 0 dan ΣFy = 0, reaksi tumpuan sama karena beban di tengah. Mmax = P×L/4 = 30 kNm.'
      }
    ],
    hints: [
      'Gunakan persamaan kesetimbangan: ΣFx = 0, ΣFy = 0, ΣM = 0',
      'Karena beban di tengah, reaksi tumpuan A dan B akan sama besar',
      'Momen maksimum terjadi di titik beban (tengah bentang)'
    ],
    solutions: [
      {
        id: 'sol-001',
        author: 'PakTono_Struktur',
        authorAvatar: '👨‍🏫',
        content: `**Langkah 1: Menghitung Reaksi Tumpuan**

Karena beban di tengah bentang:
- RA = RB = P/2 = 20/2 = 10 kN

**Langkah 2: Diagram Gaya Lintang (DGL)**
- Dari A ke tengah: V = +10 kN
- Dari tengah ke B: V = -10 kN
- Vmax = 10 kN

**Langkah 3: Diagram Momen (DM)**
- MA = 0
- Mtengah = RA × 3 = 10 × 3 = 30 kNm
- MB = 0
- Mmax = 30 kNm`,
        votes: 45,
        isAccepted: true,
        createdAt: new Date('2024-01-15'),
        comments: [
          { id: 'c-001', author: 'MhsTeknik', content: 'Penjelasan sangat jelas!', createdAt: new Date('2024-01-16') }
        ]
      }
    ],
    relatedProblems: ['prob-002', 'prob-003']
  },

  {
    id: 'prob-002',
    title: 'Portal Baja dengan Beban Merata',
    slug: 'portal-baja-beban-merata',
    category: 'struktur',
    difficulty: 'medium',
    description: `Sebuah portal baja dengan tinggi 4m dan bentang 6m. Balok horizontal menerima beban merata q = 10 kN/m. Kolom vertikal tidak menerima beban.

Hitunglah:
1. Reaksi tumpuan di A (sendi) dan B (rol)
2. Momen di titik C (sudut kiri atas)
3. Gaya normal dan gaya lintang maksimum pada balok

Portal diasumsikan kaku (rigid joint).`,
    points: 200,
    estimatedTime: '45 menit',
    solvedCount: 589,
    attemptedCount: 923,
    acceptanceRate: 64,
    tags: ['portal', 'momen', 'reaksi tumpuan', 'baja'],
    prerequisites: ['Analisis balok', 'Kesetimbangan', 'Diagram gaya'],
    testCases: [
      {
        input: 'h = 4m, L = 6m, q = 10kN/m',
        expectedOutput: 'VA = 30kN, VB = 30kN, HA = 0, MC = 30kNm',
        explanation: 'Total beban = q×L = 60kN, VA = VB = 30kN. Momen di C = qL²/12 = 30kNm.'
      }
    ],
    hints: [
      'Total beban merata = q × L',
      'Karena simetris, reaksi vertikal sama',
      'Gunakan metode cross atau distribusi momen untuk portal'
    ],
    solutions: [],
    relatedProblems: ['prob-001', 'prob-004']
  },

  {
    id: 'prob-003',
    title: 'Dimensi Tulangan Balok',
    slug: 'dimensi-tulangan-balok',
    category: 'struktur',
    difficulty: 'medium',
    description: `Sebuah balok beton bertulang dengan dimensi b = 250 mm, h = 400 mm, d = 350 mm. Mutu beton fc' = 25 MPa, mutu baja fy = 400 MPa. Balok menerima momen ultimate Mu = 85 kNm.

Hitunglah:
1. Koefisien kekuatan reduksi φ
2. Rasio tulangan ρ yang diperlukan
3. Luas tulangan tulangan tarik As yang diperlukan
4. Pilih diameter dan jumlah tulangan

Gunakan SNI 2847:2019.`,
    points: 250,
    estimatedTime: '60 menit',
    solvedCount: 423,
    attemptedCount: 687,
    acceptanceRate: 62,
    tags: ['beton', 'tulangan', 'SNI', 'balok'],
    prerequisites: ['Beton bertulang', 'SNI 2847:2019', 'Momen ultimate'],
    testCases: [
      {
        input: 'b=250mm, d=350mm, fc=25MPa, fy=400MPa, Mu=85kNm',
        expectedOutput: 'φ=0.9, ρ=0.0085, As=743.75mm², 3D19 (As=850mm²)',
        explanation: 'Gunakan rumus k = Mu/(φ×b×d²), lalu ρ = (0.85×fc/fy)×(1-√(1-2k/(0.85×fc)))'
      }
    ],
    hints: [
      'Gunakan faktor β1 = 0.85 untuk fc ≤ 30 MPa',
      'Rasio tulangan maksimum ρmax = 0.75 × ρb',
      'Pilih tulangan dengan As ≥ As_required'
    ],
    solutions: [],
    relatedProblems: ['prob-001', 'prob-005']
  },

  // ============ MEKANIKA ============
  {
    id: 'prob-004',
    title: 'Tegangan pada Batang Tarik',
    slug: 'tegangan-batang-tarik',
    category: 'mekanika',
    difficulty: 'easy',
    description: `Sebuah batang baja dengan panjang 2 meter dan diameter 20 mm ditarik dengan gaya aksial P = 50 kN.

Hitunglah:
1. Tegangan normal (σ) pada batang
2. Regangan (ε) jika modulus elastisitas E = 200 GPa
3. Pertambahan panjang batang (ΔL)

Asumsikan perilaku elastis linier.`,
    points: 100,
    estimatedTime: '15 menit',
    solvedCount: 1834,
    attemptedCount: 2012,
    acceptanceRate: 91,
    tags: ['tegangan', 'regangan', 'batang tarik', 'mekanika'],
    prerequisites: ['Mekanika bahan dasar', 'Hukum Hooke'],
    testCases: [
      {
        input: 'L=2m, d=20mm, P=50kN, E=200GPa',
        expectedOutput: 'σ=159.15MPa, ε=0.000796, ΔL=1.59mm',
        explanation: 'A = π×d²/4 = 314.16 mm², σ = P/A, ε = σ/E, ΔL = ε×L'
      }
    ],
    hints: [
      'Luas penampang A = π × d² / 4',
      'Tegangan σ = P / A',
      'Gunakan Hukum Hooke: σ = E × ε'
    ],
    solutions: [],
    relatedProblems: ['prob-005']
  },

  {
    id: 'prob-005',
    title: 'Kombinasi Tegangan: Tarik dan Torsi',
    slug: 'kombinasi-tarik-torsi',
    category: 'mekanika',
    difficulty: 'hard',
    description: `Sebuah poros silinder dengan diameter 50 mm menerima beban tarik aksial P = 100 kN dan momen torsi T = 5 kNm secara bersamaan.

Hitunglah:
1. Tegangan normal akibat tarik
2. Tegangan geser akibat torsi
3. Tegangan utama (principal stresses) σ1 dan σ2
4. Tegangan geser maksimum
5. Factor of Safety jika yield strength σy = 250 MPa menggunakan teori von Mises

Gunakan teori kegagalan yang sesuai.`,
    points: 350,
    estimatedTime: '90 menit',
    solvedCount: 234,
    attemptedCount: 567,
    acceptanceRate: 41,
    tags: ['torsi', 'tegangan gabungan', 'von Mises', 'faktor keamanan'],
    prerequisites: ['Tegangan', 'Torsi', 'Lingkaran Mohr', 'Teori kegagalan'],
    testCases: [
      {
        input: 'd=50mm, P=100kN, T=5kNm, σy=250MPa',
        expectedOutput: 'σ=50.93MPa, τ=101.86MPa, σ1=144.8MPa, σ2=-93.9MPa, τmax=119.4MPa, FOS=1.55',
        explanation: 'Gunakan lingkaran Mohr untuk mencari tegangan utama, lalu von Mises untuk FOS.'
      }
    ],
    hints: [
      'Hitung tegangan normal dan geser terlebih dahulu',
      'Gunakan persamaan lingkaran Mohr: σ1,2 = (σx+σy)/2 ± √[((σx-σy)/2)² + τxy²]',
      'Von Mises: σ\' = √(σ² + 3τ²)'
    ],
    solutions: [],
    relatedProblems: ['prob-004', 'prob-006']
  },

  // ============ GEOTEKNIK ============
  {
    id: 'prob-006',
    title: 'Kapasitas Dukung Tanah (Terzaghi)',
    slug: 'kapasitas-dukung-terzaghi',
    category: 'geoteknik',
    difficulty: 'medium',
    description: `Sebuah fondasi telapak persegi dengan lebar B = 2 meter ditempatkan pada tanah pasir dengan parameter:
- Sudut gesek dalam φ = 30°
- Berat volume tanah γ = 18 kN/m³
- Kedalaman fondasi Df = 1 meter
- Angka pori e = 0.6

Hitunglah kapasitas dukung ultimate (qu) dan allowable (qa) dengan faktor keamanan SF = 3 menggunakan teori Terzaghi.

Gunakan faktor kapasitas dukung Terzaghi untuk φ = 30°: Nc = 37.2, Nq = 22.5, Nγ = 19.7`,
    points: 200,
    estimatedTime: '40 menit',
    solvedCount: 678,
    attemptedCount: 892,
    acceptanceRate: 76,
    tags: ['fondasi', 'kapasitas dukung', 'Terzaghi', 'geoteknik'],
    prerequisites: ['Mekanika tanah', 'Fondasi dangkal', 'Parameter tanah'],
    testCases: [
      {
        input: 'B=2m, φ=30°, γ=18kN/m³, Df=1m, e=0.6',
        expectedOutput: 'qu=716.4kPa, qa=238.8kPa',
        explanation: 'qu = cNc + γDfNq + 0.5γBNγ untuk pasir c=0'
      }
    ],
    hints: [
      'Untuk pasir, kohesi c = 0',
      'Rumus Terzaghi: qu = cNc + qNq + 0.5γBNγ',
      'q = γ × Df (tekanan overburden)'
    ],
    solutions: [],
    relatedProblems: ['prob-007']
  },

  // ============ HIDROTEKNIK ============
  {
    id: 'prob-007',
    title: 'Debit Aliran pada Saluran Terbuka',
    slug: 'debit-saluran-terbuka',
    category: 'hidroteknik',
    difficulty: 'easy',
    description: `Sebuah saluran terbuka berbentuk trapesium dengan:
- Lebar dasar b = 2 m
- Kemiringan dinding m = 1:1 (horizontal:vertikal)
- Kedalaman air y = 1.5 m
- Kemiringan dasar saluran S = 0.001
- Koefisien Manning n = 0.015

Hitunglah:
1. Luas penampang basah (A)
2. Keliling basah (P)
3. Jari-jari hidrolik (R)
4. Kecepatan aliran (V) dengan rumus Manning
5. Debit aliran (Q)`,
    points: 150,
    estimatedTime: '25 menit',
    solvedCount: 1123,
    attemptedCount: 1289,
    acceptanceRate: 87,
    tags: ['hidrolika', 'saluran', 'Manning', 'debit'],
    prerequisites: ['Hidrolika dasar', 'Rumus Manning'],
    testCases: [
      {
        input: 'b=2m, m=1, y=1.5m, S=0.001, n=0.015',
        expectedOutput: 'A=5.25m², P=6.24m, R=0.84m, V=1.93m/s, Q=10.13m³/s',
        explanation: 'A=(b+my)y, P=b+2y√(1+m²), R=A/P, V=(1/n)×R^(2/3)×S^(1/2)'
      }
    ],
    hints: [
      'Untuk trapesium: A = (b + my) × y',
      'Keliling basah P = b + 2y√(1 + m²)',
      'Rumus Manning: V = (1/n) × R^(2/3) × S^(1/2)'
    ],
    solutions: [],
    relatedProblems: ['prob-008']
  },

  // ============ ENERGI ============
  {
    id: 'prob-008',
    title: 'Sizing PLTS On-Grid Rumah',
    slug: 'sizing-plts-rumah',
    category: 'energi',
    difficulty: 'medium',
    description: `Sebuah rumah tinggal di Jakarta memiliki konsumsi listrik rata-rata 450 kWh per bulan. Ingin dipasang sistem PLTS on-grid.

Data:
- Irradiasi di Jakarta: 4.8 kWh/m²/hari (average)
- Efisiensi panel: 20%
- Performance ratio: 0.75
- Panel yang tersedia: 450 Wp per panel

Hitunglah:
1. Kebutuhan energi per hari (kWh/hari)
2. Kapasitas PLTS yang diperlukan (kWp)
3. Jumlah panel yang dibutuhkan
4. Perkiraan produksi energi per tahun

Asumsikan 30 hari per bulan.`,
    points: 200,
    estimatedTime: '35 menit',
    solvedCount: 892,
    attemptedCount: 1123,
    acceptanceRate: 79,
    tags: ['PLTS', 'sizing', 'energi surya', 'on-grid'],
    prerequisites: ['Dasar PLTS', 'Irradiasi', 'kWp'],
    testCases: [
      {
        input: '450kWh/bulan, 4.8kWh/m²/hari, efisiensi 20%, PR 0.75, panel 450Wp',
        expectedOutput: '15kWh/hari, 4.17kWp, 10 panel, 1825kWh/tahun',
        explanation: 'Energi harian = 450/30 = 15kWh. Kapasitas = E/(I×PR) = 15/(4.8×0.75) = 4.17kWp'
      }
    ],
    hints: [
      'Konversi konsumsi bulanan ke harian: divide by 30',
      'Rumus: Kapasitas (kWp) = Energi harian / (Irradiasi × PR)',
      'Jumlah panel = Kapasitas total / Kapasitas per panel'
    ],
    solutions: [],
    relatedProblems: ['prob-009']
  },

  // ============ MIGAS ============
  {
    id: 'prob-009',
    title: 'Perhitungan BOT dan BOPD',
    slug: 'bot-bopd-perhitungan',
    category: 'migas',
    difficulty: 'medium',
    description: `Sebuah sumur minyak di lapangan X memiliki produksi sebagai berikut:
- Oil rate: 1500 BOPD (Barrels of Oil Per Day)
- Water cut: 25%
- Gas-Oil Ratio (GOR): 500 SCF/STB
- Berat jenis minyak: 35°API

Hitunglah:
1. Total liquid production (BLPD)
2. Water production (BWPD)
3. Gas production (MSCFD)
4. Berat jenis minyak dalam specific gravity (SG)

Note: 1 STB = 1 barrel stock tank oil`,
    points: 180,
    estimatedTime: '30 menit',
    solvedCount: 445,
    attemptedCount: 623,
    acceptanceRate: 71,
    tags: ['migas', 'produksi', 'BOPD', 'GOR'],
    prerequisites: ['Dasar migas', 'Fluida reservoir', 'Satuan migas'],
    testCases: [
      {
        input: '1500 BOPD, WC=25%, GOR=500 SCF/STB, API=35°',
        expectedOutput: '2000 BLPD, 500 BWPD, 750 MSCFD, SG=0.85',
        explanation: 'WC = WOR/(1+WOR), Liquid = Oil/(1-WC), Water = Liquid - Oil, Gas = Oil×GOR'
      }
    ],
    hints: [
      'Water cut (WC) = Water rate / Liquid rate',
      'Liquid rate = Oil rate / (1 - WC)',
      'API gravity to SG: SG = 141.5 / (131.5 + °API)'
    ],
    solutions: [],
    relatedProblems: []
  },

  // ============ MANAJEMEN ============
  {
    id: 'prob-010',
    title: 'Analisis Nilai Waktu Uang',
    slug: 'nilai-waktu-uang',
    category: 'manajemen',
    difficulty: 'easy',
    description: `Sebuah proyek konstruksi membutuhkan investasi awal Rp 5 miliar. Proyek diharapkan menghasilkan arus kas bersih (net cash flow) sebagai berikut:
- Tahun 1: Rp 1.2 miliar
- Tahun 2: Rp 1.5 miliar
- Tahun 3: Rp 1.8 miliar
- Tahun 4: Rp 2.0 miliar
- Tahun 5: Rp 1.5 miliar

Dengan discount rate (MARR) = 12% per tahun, hitunglah:
1. Net Present Value (NPV)
2. Apakah proyek layak secara finansial?
3. Internal Rate of Return (IRR) approximation

Gunakan rumus NPV = Σ(CFt / (1+i)^t) - Initial Investment`,
    points: 150,
    estimatedTime: '30 menit',
    solvedCount: 678,
    attemptedCount: 823,
    acceptanceRate: 82,
    tags: ['ekonomi', 'NPV', 'IRR', 'manajemen proyek'],
    prerequisites: ['Engineering economy', 'Nilai waktu uang'],
    testCases: [
      {
        input: 'Investasi 5M, CF tahun 1-5: 1.2, 1.5, 1.8, 2.0, 1.5, i=12%',
        expectedOutput: 'NPV=Rp 614.5 juta, Layak (NPV>0), IRR≈18%',
        explanation: 'NPV = -5000 + 1200/1.12 + 1500/1.12² + 1800/1.12³ + 2000/1.12⁴ + 1500/1.12⁵'
      }
    ],
    hints: [
      'Gunakan tabel faktor PV atau kalkulator finansial',
      'NPV positif = proyek layak',
      'IRR adalah discount rate yang membuat NPV = 0'
    ],
    solutions: [],
    relatedProblems: ['prob-011']
  },

  {
    id: 'prob-011',
    title: 'Estimasi Biaya dengan Metode Analogi',
    slug: 'estimasi-biaya-analogi',
    category: 'manajemen',
    difficulty: 'medium',
    description: `Perusahaan Anda akan membangun gedung perkantoran 10 lantai dengan luas lantai total 15,000 m². Dari data proyek sebelumnya:
- Gedung A: 8 lantai, 10,000 m², biaya Rp 50 miliar, dibangun 2 tahun lalu
- Gedung B: 12 lantai, 20,000 m², biaya Rp 110 miliar, dibangun 1 tahun lalu

Data tambahan:
- Indeks harga konstruksi tahun ini: 125 (tahun lalu: 115, 2 tahun lalu: 110)
- Faktor kapasitas (capacity factor) = 0.85

Hitunglah estimasi biaya proyek baru menggunakan metode analogi dengan faktor kapasitas dan penyesuaian inflasi.`,
    points: 220,
    estimatedTime: '40 menit',
    solvedCount: 345,
    attemptedCount: 478,
    acceptanceRate: 72,
    tags: ['estimasi', 'biaya', 'manajemen', 'analogi'],
    prerequisites: ['Estimasi biaya', 'Faktor kapasitas', 'Indeks harga'],
    testCases: [
      {
        input: 'Target: 10 lantai, 15.000m² | Gedung A: 8lt, 10.000m², 50M | Gedung B: 12lt, 20.000m², 110M',
        expectedOutput: 'Estimasi biaya: Rp 78.5 - 85.2 miliar',
        explanation: 'Gunakan C2 = C1 × (Q2/Q1)^n × (I2/I1) dengan n=0.85'
      }
    ],
    hints: [
      'Rumus: Cost2 = Cost1 × (Capacity2/Capacity1)^n × (Index2/Index1)',
      'Hitung estimasi dari kedua analogi, lalu average',
      'n = capacity factor (biasanya 0.6-0.9 untuk konstruksi)'
    ],
    solutions: [],
    relatedProblems: ['prob-010']
  },

  // ============ TRANSPORTASI ============
  {
    id: 'prob-012',
    title: 'Perhitungan Crossfall Jalan',
    slug: 'crossfall-jalan',
    category: 'transportasi',
    difficulty: 'easy',
    description: `Sebuah jalan dua lajur dengan lebar per lajur 3.5 m akan dirancang dengan crossfall (kemiringan melintang) 2%.

Hitunglah:
1. Selisih elevasi antara tepi jalan dan garis tengah (crown)
2. Jika panjang jalan 500 m, berapa volume urugan yang dibutuhkan untuk membentuk crossfall (asumsikan tebal perkerasan rata-rata 25 cm)?
3. Gambarkan profil melintang jalan

Gunakan asumsi jalan datar (tanpa longitudinal grade).`,
    points: 120,
    estimatedTime: '20 menit',
    solvedCount: 892,
    attemptedCount: 1023,
    acceptanceRate: 87,
    tags: ['jalan', 'geometrik', 'crossfall', 'transportasi'],
    prerequisites: ['Geometrik jalan', 'Crossfall', 'Perkerasan'],
    testCases: [
      {
        input: 'Lebar lajur 3.5m, crossfall 2%, panjang 500m, tebal 25cm',
        expectedOutput: 'Selisih elevasi=0.07m, Volume=87.5m³',
        explanation: 'h = width × crossfall = 3.5 × 0.02 = 0.07m. Volume = area segitiga × panjang × 2 sisi'
      }
    ],
    hints: [
      'Crossfall 2% = 0.02 dalam desimal',
      'Selisih elevasi = setengah lebar jalan × crossfall',
      'Volume = luas penampang × panjang'
    ],
    solutions: [],
    relatedProblems: []
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find(p => p.slug === slug);
}

export function getProblemsByCategory(category: Problem['category']): Problem[] {
  return PROBLEMS.filter(p => p.category === category);
}

export function getProblemsByDifficulty(difficulty: ProblemDifficulty): Problem[] {
  return PROBLEMS.filter(p => p.difficulty === difficulty);
}

export function searchProblems(query: string): Problem[] {
  const lowerQuery = query.toLowerCase();
  return PROBLEMS.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export function getDifficultyColor(difficulty: ProblemDifficulty): string {
  const colors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-orange-100 text-orange-700',
    expert: 'bg-red-100 text-red-700'
  };
  return colors[difficulty];
}

export function getDifficultyLabel(difficulty: ProblemDifficulty): string {
  const labels = {
    easy: 'Mudah',
    medium: 'Menengah',
    hard: 'Sulit',
    expert: 'Expert'
  };
  return labels[difficulty];
}

export function getCategoryLabel(category: Problem['category']): string {
  const labels: Record<Problem['category'], string> = {
    konstruksi: 'Konstruksi',
    struktur: 'Struktur',
    mekanika: 'Mekanika',
    hidroteknik: 'Hidroteknik',
    geoteknik: 'Geoteknik',
    transportasi: 'Transportasi',
    energi: 'Energi',
    migas: 'Migas',
    manajemen: 'Manajemen',
    ekonomi: 'Ekonomi'
  };
  return labels[category];
}

export function getTotalPoints(): number {
  return PROBLEMS.reduce((sum, p) => sum + p.points, 0);
}

export function getCategoryStats() {
  const stats: Record<string, { count: number; avgDifficulty: number }> = {};
  
  PROBLEMS.forEach(p => {
    if (!stats[p.category]) {
      stats[p.category] = { count: 0, avgDifficulty: 0 };
    }
    stats[p.category].count++;
    const diffValue = { easy: 1, medium: 2, hard: 3, expert: 4 }[p.difficulty];
    stats[p.category].avgDifficulty += diffValue;
  });

  Object.keys(stats).forEach(key => {
    stats[key].avgDifficulty = Math.round(stats[key].avgDifficulty / stats[key].count);
  });

  return stats;
}
