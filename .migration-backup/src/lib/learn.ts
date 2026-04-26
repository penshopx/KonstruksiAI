// ============================================================
// KONSTRUKSI AI - LEARN MODULE
// Learning Paths, Quizzes, Progress Tracking
// ============================================================

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "2 jam"
  lessons: Lesson[];
  quiz: Quiz;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'practice';
  duration: string;
  content: string;
  isCompleted?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'calculation';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  category: 'konstruksi' | 'energi' | 'migas' | 'tender' | 'manajemen' | 'perijinan';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  thumbnail: string;
  estimatedHours: number;
  modules: LearningModule[];
  prerequisites: string[];
  outcomes: string[];
  certificationAwarded?: string;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
}

export interface UserProgress {
  pathId: string;
  moduleId: string;
  lessonId: string;
  completedAt: Date;
  score?: number;
}

// ============================================================
// LEARNING PATHS DATA
// ============================================================

export const LEARNING_PATHS: LearningPath[] = [
  // ============ KONSTRUKSI PATHS ============
  {
    id: 'path-001',
    title: 'Fundamental Teknik Sipil',
    slug: 'fundamental-teknik-sipil',
    category: 'konstruksi',
    level: 'beginner',
    description: 'Pembelajaran komprehensif untuk memahami dasar-dasar teknik sipil, mulai dari mekanika tanah, struktur bangunan, hingga manajemen proyek konstruksi.',
    thumbnail: '🏗️',
    estimatedHours: 24,
    enrolledCount: 2847,
    rating: 4.8,
    reviewCount: 342,
    prerequisites: ['Matematika dasar', 'Fisika dasar'],
    outcomes: [
      'Memahami prinsip mekanika struktur',
      'Mampu membaca gambar teknik',
      'Menguasai perhitungan bahan bangunan',
      'Memahami proses konstruksi gedung'
    ],
    certificationAwarded: 'Teknik Sipil Fundamental Certificate',
    modules: [
      {
        id: 'mod-001',
        title: 'Pengenalan Teknik Sipil',
        description: 'Sejarah, ruang lingkup, dan profesi teknik sipil',
        duration: '2 jam',
        lessons: [
          {
            id: 'les-001',
            title: 'Sejarah dan Perkembangan Teknik Sipil',
            type: 'video',
            duration: '30 menit',
            content: 'Video pembelajaran tentang evolusi teknik sipil dari zaman Romawi kuno hingga era modern dengan teknologi BIM.'
          },
          {
            id: 'les-002',
            title: 'Bidang-bidang Teknik Sipil',
            type: 'reading',
            duration: '45 menit',
            content: `Teknik sipil mencakup berbagai sub-bidang:
            
1. **Struktur** - Perencanaan dan analisis struktur bangunan
2. **Geoteknik** - Mekanika tanah dan fondasi
3. **Transportasi** - Jalan, jembatan, bandara
4. **Air** - Irigasi, drainase, pengelolaan air
5. **Konstruksi** - Manajemen proyek dan pelaksanaan
6. **Lingkungan** - Pengelolaan dampak lingkungan`
          },
          {
            id: 'les-003',
            title: 'Standar dan Regulasi Indonesia',
            type: 'reading',
            duration: '30 menit',
            content: 'SNI (Standar Nasional Indonesia), peraturan PU, dan standar internasional seperti ACI, AISC, Eurocode.'
          }
        ],
        quiz: {
          id: 'quiz-001',
          title: 'Quiz Modul 1: Pengenalan Teknik Sipil',
          passingScore: 70,
          timeLimit: 15,
          questions: [
            {
              id: 'q-001',
              question: 'SNI adalah singkatan dari?',
              type: 'multiple_choice',
              options: ['Standar Nasional Indonesia', 'Sistem Nasional Indonesia', 'Standar Norma Indonesia', 'Standar Nasional Internasional'],
              correctAnswer: 0,
              explanation: 'SNI stands for Standar Nasional Indonesia (Indonesian National Standard)',
              points: 10
            },
            {
              id: 'q-002',
              question: 'Berapa jumlah sub-bidang utama dalam teknik sipil?',
              type: 'multiple_choice',
              options: ['4', '5', '6', '7'],
              correctAnswer: 2,
              explanation: 'Ada 6 sub-bidang utama: Struktur, Geoteknik, Transportasi, Air, Konstruksi, dan Lingkungan',
              points: 10
            }
          ]
        }
      },
      {
        id: 'mod-002',
        title: 'Mekanika Struktur Dasar',
        description: 'Gaya, momen, dan analisis struktur sederhana',
        duration: '4 jam',
        lessons: [
          {
            id: 'les-004',
            title: 'Konsep Gaya dan Resultan',
            type: 'video',
            duration: '45 menit',
            content: 'Penjelasan tentang gaya, komponen gaya, dan cara menghitung resultan gaya.'
          },
          {
            id: 'les-005',
            title: 'Momen dan Kopel',
            type: 'interactive',
            duration: '1 jam',
            content: 'Interaktif: Simulasi perhitungan momen pada balok dengan berbagai beban.'
          },
          {
            id: 'les-006',
            title: 'Diagram Gaya Lintang dan Momen',
            type: 'practice',
            duration: '1 jam',
            content: 'Latihan membuat DGL dan DM untuk balok sederhana dengan beban terpusat dan merata.'
          }
        ],
        quiz: {
          id: 'quiz-002',
          title: 'Quiz: Mekanika Struktur',
          passingScore: 75,
          timeLimit: 20,
          questions: [
            {
              id: 'q-003',
              question: 'Jika balok dengan panjang 6m dibebani 10kN di tengah, berapa momen maksimum?',
              type: 'calculation',
              correctAnswer: 15,
              explanation: 'Mmax = P×L/4 = 10×6/4 = 15 kNm',
              points: 20
            }
          ]
        }
      },
      {
        id: 'mod-003',
        title: 'Bahan Bangunan',
        description: 'Properti dan aplikasi material konstruksi',
        duration: '3 jam',
        lessons: [
          {
            id: 'les-007',
            title: 'Beton: Komposisi dan Karakteristik',
            type: 'video',
            duration: '45 menit',
            content: 'Semen, agregat, air, dan additive. Slump test dan kuat tekan beton.'
          },
          {
            id: 'les-008',
            title: 'Baja Struktural',
            type: 'reading',
            duration: '30 menit',
            content: 'Tipe baja struktural, profil baja, sambungan, dan proteksi korosi.'
          },
          {
            id: 'les-009',
            title: 'Material Non-Struktural',
            type: 'reading',
            duration: '30 menit',
            content: 'Bata, pasangan, plester, cat, keramik, dan material finishing.'
          }
        ],
        quiz: {
          id: 'quiz-003',
          title: 'Quiz: Bahan Bangunan',
          passingScore: 70,
          timeLimit: 15,
          questions: [
            {
              id: 'q-004',
              question: 'Komponen utama beton adalah semen, agregat, dan?',
              type: 'fill_blank',
              correctAnswer: 'air',
              explanation: 'Beton terdiri dari semen (perekat), agregat kasar & halus, dan air untuk hidrasi.',
              points: 15
            }
          ]
        }
      }
    ]
  },
  
  {
    id: 'path-002',
    title: 'Perencanaan Gedung Bertingkat',
    slug: 'perencanaan-gedung-bertingkat',
    category: 'konstruksi',
    level: 'intermediate',
    description: 'Metodologi perencanaan struktur gedung bertingkat sesuai SNI 1726:2019 (tata cara perencanaan ketahanan gempa).',
    thumbnail: '🏢',
    estimatedHours: 36,
    enrolledCount: 1523,
    rating: 4.9,
    reviewCount: 198,
    prerequisites: ['Fundamental Teknik Sipil', 'Statika dan Dinamika'],
    outcomes: [
      'Mampu merencanakan gedung tahan gempa',
      'Memahami analisis struktur dengan ETABS/SAP2000',
      'Menguasai desain balok, kolom, dan pelat',
      'Mampu membaca dan membuat gambar kerja struktur'
    ],
    certificationAwarded: 'Structural Design Specialist Certificate',
    modules: [
      {
        id: 'mod-004',
        title: 'Beban dan Kombinasi Beban',
        description: 'Beban mati, hidup, gempa, dan angin',
        duration: '4 jam',
        lessons: [
          {
            id: 'les-010',
            title: 'Beban Mati (Dead Load)',
            type: 'reading',
            duration: '1 jam',
            content: 'Perhitungan beban mati: berat sendiri struktur, dinding, lantai finishing, MEP.'
          },
          {
            id: 'les-011',
            title: 'Beban Hidup (Live Load)',
            type: 'reading',
            duration: '45 menit',
            content: 'Beban hidup sesuai penggunaan: perumahan, perkantoran, parkir, assembly.'
          },
          {
            id: 'les-012',
            title: 'Beban Gempa SNI 1726:2019',
            type: 'video',
            duration: '1.5 jam',
            content: 'Spektrum respons, faktor keutamaan, parameter gerak tanah, metode analisis.'
          }
        ],
        quiz: {
          id: 'quiz-004',
          title: 'Quiz: Beban dan Kombinasi',
          passingScore: 75,
          timeLimit: 20,
          questions: [
            {
              id: 'q-005',
              question: 'Faktor keutamaan untuk gedung rumah sakit adalah?',
              type: 'multiple_choice',
              options: ['1.0', '1.2', '1.4', '1.5'],
              correctAnswer: 2,
              explanation: 'Gedung rumah sakit memiliki faktor keutamaan 1.4 (SNI 1726:2019 Tabel 4)',
              points: 15
            }
          ]
        }
      },
      {
        id: 'mod-005',
        title: 'Sistem Struktur Gedung',
        description: 'Sistem ganda, SRPMB, dan sistem lainnya',
        duration: '5 jam',
        lessons: [
          {
            id: 'les-013',
            title: 'Sistem Penahan Momen',
            type: 'video',
            duration: '1.5 jam',
            content: 'SRPMB, SRPMK, SRPMI dan karakteristik daktilitas masing-masing.'
          },
          {
            id: 'les-014',
            title: 'Sistem Ganda dengan Dinding Struktural',
            type: 'reading',
            duration: '1 jam',
            content: 'Perencanaan shear wall, coupling beam, dan interaksi dengan rangka.'
          },
          {
            id: 'les-015',
            title: 'Praktik ETABS: Model 3D',
            type: 'practice',
            duration: '2 jam',
            content: 'Tutorial membuat model struktur 3D gedung 10 lantai dengan ETABS.'
          }
        ],
        quiz: {
          id: 'quiz-005',
          title: 'Quiz: Sistem Struktur',
          passingScore: 80,
          timeLimit: 25,
          questions: []
        }
      }
    ]
  },

  // ============ ENERGI PATHS ============
  {
    id: 'path-003',
    title: 'Dasar-dasar Energi Surya (PLTS)',
    slug: 'dasar-plts',
    category: 'energi',
    level: 'beginner',
    description: 'Pemahaman fundamental tentang fotovoltaik, komponen PLTS, dan perencanaan sistem on-grid.',
    thumbnail: '☀️',
    estimatedHours: 18,
    enrolledCount: 3156,
    rating: 4.7,
    reviewCount: 412,
    prerequisites: ['Listrik dasar', 'Matematika'],
    outcomes: [
      'Memahami prinsip kerja sel surya',
      'Mampu menghitung kebutuhan PLTS',
      'Menguasai komponen inverter, baterai, dan charge controller',
      'Dapat merencanakan sistem on-grid sederhana'
    ],
    certificationAwarded: 'Solar Energy Fundamentals Certificate',
    modules: [
      {
        id: 'mod-006',
        title: 'Fotovoltaik dan Sel Surya',
        description: 'Fisika dan teknologi panel surya',
        duration: '3 jam',
        lessons: [
          {
            id: 'les-016',
            title: 'Efek Fotovoltaik',
            type: 'video',
            duration: '45 menit',
            content: 'Bagaimana cahaya diubah menjadi listrik pada material semikonduktor.'
          },
          {
            id: 'les-017',
            title: 'Tipe-tipe Panel Surya',
            type: 'reading',
            duration: '30 menit',
            content: 'Mono-crystalline, poly-crystalline, thin-film, dan perbandingan efisiensi.'
          },
          {
            id: 'les-018',
            title: 'Karakteristik I-V Curve',
            type: 'interactive',
            duration: '1 jam',
            content: 'Simulasi kurva karakteristik panel: Voc, Isc, Vmp, Imp, Pmax, FF.'
          }
        ],
        quiz: {
          id: 'quiz-006',
          title: 'Quiz: Fotovoltaik',
          passingScore: 70,
          timeLimit: 15,
          questions: [
            {
              id: 'q-006',
              question: 'Efisiensi panel monocrystalline biasanya?',
              type: 'multiple_choice',
              options: ['10-12%', '15-20%', '25-30%', '35-40%'],
              correctAnswer: 1,
              explanation: 'Panel monocrystalline memiliki efisiensi 15-20%, lebih tinggi dari polycrystalline (13-16%).',
              points: 10
            }
          ]
        }
      },
      {
        id: 'mod-007',
        title: 'Komponen Sistem PLTS',
        description: 'Inverter, baterai, dan balance of system',
        duration: '4 jam',
        lessons: [
          {
            id: 'les-019',
            title: 'Inverter: On-grid vs Off-grid',
            type: 'video',
            duration: '1 jam',
            content: 'Jenis-jenis inverter, efisiensi, proteksi, dan karakteristik masing-masing.'
          },
          {
            id: 'les-020',
            title: 'Baterai dan Charge Controller',
            type: 'reading',
            duration: '1 jam',
            content: 'Lead-acid vs Lithium-ion, DOD, siklus hidup, MPPT vs PWM controller.'
          },
          {
            id: 'les-021',
            title: 'Balance of System',
            type: 'reading',
            duration: '30 menit',
            content: 'Kabel, konektor, junction box, mounting structure, grounding, lightning protection.'
          }
        ],
        quiz: {
          id: 'quiz-007',
          title: 'Quiz: Komponen PLTS',
          passingScore: 70,
          timeLimit: 15,
          questions: []
        }
      }
    ]
  },

  // ============ MIGAS PATHS ============
  {
    id: 'path-004',
    title: 'Safety di Industri Migas',
    slug: 'safety-migas',
    category: 'migas',
    level: 'beginner',
    description: 'Keselamatan kerja, K3, dan prosedur operasional standar di industri minyak dan gas.',
    thumbnail: '⛑️',
    estimatedHours: 20,
    enrolledCount: 2245,
    rating: 4.9,
    reviewCount: 287,
    prerequisites: ['Tidak ada'],
    outcomes: [
      'Memahami regulasi K3 migas',
      'Mampu mengidentifikasi hazard dan risk assessment',
      'Menguasai prosedur darurat',
      'Dapat menggunakan PPE dengan benar'
    ],
    certificationAwarded: 'HSE Basic Certificate',
    modules: [
      {
        id: 'mod-008',
        title: 'Dasar K3 Migas',
        description: 'Regulasi dan sistem manajemen K3',
        duration: '3 jam',
        lessons: [
          {
            id: 'les-022',
            title: 'Regulasi K3 Migas Indonesia',
            type: 'reading',
            duration: '1 jam',
            content: 'Permen ESDM, Permenaker, API RP, dan standar internasional ISO 45001.'
          },
          {
            id: 'les-023',
            title: 'Hazard Identification',
            type: 'video',
            duration: '1 jam',
            content: 'HAZID, HAZOP, Job Safety Analysis (JSA), dan risk matrix.'
          },
          {
            id: 'les-024',
            title: 'Permit to Work System',
            type: 'reading',
            duration: '30 menit',
            content: 'Hot work, cold work, confined space, work at height permits.'
          }
        ],
        quiz: {
          id: 'quiz-008',
          title: 'Quiz: Dasar K3 Migas',
          passingScore: 80,
          timeLimit: 20,
          questions: [
            {
              id: 'q-007',
              question: 'Dokumen yang diperlukan untuk pekerjaan las di area berbahaya?',
              type: 'multiple_choice',
              options: ['Cold Work Permit', 'Hot Work Permit', 'Confined Space Permit', 'General Permit'],
              correctAnswer: 1,
              explanation: 'Pekerjaan las termasuk hot work dan memerlukan Hot Work Permit.',
              points: 10
            }
          ]
        }
      }
    ]
  },

  // ============ TENDER PATHS ============
  {
    id: 'path-005',
    title: 'Mastering Tender Konstruksi',
    slug: 'mastering-tender-konstruksi',
    category: 'tender',
    level: 'intermediate',
    description: 'Strategi memenangkan tender proyek konstruksi dari persiapan dokumen hingga negosiasi kontrak.',
    thumbnail: '📋',
    estimatedHours: 16,
    enrolledCount: 1892,
    rating: 4.6,
    reviewCount: 234,
    prerequisites: ['Pengalaman proyek konstruksi'],
    outcomes: [
      'Memahami regulasi pengadaan (Perpres 16/2018)',
      'Mampu menyusun dokumen penawaran yang kompetitif',
      'Menguasai teknik pricing dan costing',
      'Dapat melakukan negosiasi kontrak'
    ],
    certificationAwarded: 'Tender Specialist Certificate',
    modules: [
      {
        id: 'mod-009',
        title: 'Regulasi Pengadaan Barang/Jasa',
        description: 'Perpres 16/2018 dan turunannya',
        duration: '3 jam',
        lessons: [
          {
            id: 'les-025',
            title: 'Kerangka Regulasi',
            type: 'video',
            duration: '1 jam',
            content: 'Perpres 16/2018, LPSE, K/L/D, dan tipe-tipe pengadaan.'
          },
          {
            id: 'les-026',
            title: 'Metode Pemilihan',
            type: 'reading',
            duration: '1 jam',
            content: 'Pelelangan umum, terbatas, pemilihan langsung, penunjukan langsung.'
          }
        ],
        quiz: {
          id: 'quiz-009',
          title: 'Quiz: Regulasi',
          passingScore: 75,
          timeLimit: 20,
          questions: []
        }
      },
      {
        id: 'mod-010',
        title: 'Penyusunan Dokumen Penawaran',
        description: 'Administrasi, teknis, dan harga',
        duration: '4 jam',
        lessons: [
          {
            id: 'les-027',
            title: 'Dokumen Administrasi',
            type: 'reading',
            duration: '1 jam',
            content: 'SIUP, NPWP, SBU, sertifikat keahlian, laporan keuangan.'
          },
          {
            id: 'les-028',
            title: 'Dokumen Teknis',
            type: 'practice',
            duration: '2 jam',
            content: 'Metode pelaksanaan, jadwal, manajemen mutu, HSE plan, struktur organisasi.'
          },
          {
            id: 'les-029',
            title: 'Penawaran Harga yang Kompetitif',
            type: 'video',
            duration: '1 jam',
            content: 'Cost estimation, markup, risk contingency, strategi pricing.'
          }
        ],
        quiz: {
          id: 'quiz-010',
          title: 'Quiz: Dokumen Penawaran',
          passingScore: 75,
          timeLimit: 20,
          questions: []
        }
      }
    ]
  },

  // ============ MANAJEMEN PATHS ============
  {
    id: 'path-006',
    title: 'Manajemen Proyek Konstruksi',
    slug: 'manajemen-proyek-konstruksi',
    category: 'manajemen',
    level: 'intermediate',
    description: 'Prinsip dan praktik manajemen proyek konstruksi: perencanaan, pelaksanaan, monitoring, dan controlling.',
    thumbnail: '📊',
    estimatedHours: 28,
    enrolledCount: 2134,
    rating: 4.8,
    reviewCount: 276,
    prerequisites: ['Pengalaman industri konstruksi'],
    outcomes: [
      'Menguasai project management lifecycle',
      'Mampu membuat WBS, CPM, dan schedule',
      'Dapat mengelola cost, quality, dan scope',
      'Memahami kontrak FIDIC dan varian'
    ],
    certificationAwarded: 'Construction Project Manager Certificate',
    modules: [
      {
        id: 'mod-011',
        title: 'Project Management Framework',
        description: 'PMBOK dan aplikasi di konstruksi',
        duration: '4 jam',
        lessons: [
          {
            id: 'les-030',
            title: 'Siklus Hidup Proyek',
            type: 'video',
            duration: '1 jam',
            content: 'Initiating, planning, executing, monitoring & controlling, closing.'
          },
          {
            id: 'les-031',
            title: '10 Knowledge Areas',
            type: 'reading',
            duration: '1.5 jam',
            content: 'Integration, scope, schedule, cost, quality, resources, communications, risk, procurement, stakeholder.'
          },
          {
            id: 'les-032',
            title: 'Manajemen Stakeholder',
            type: 'practice',
            duration: '1 jam',
            content: 'Stakeholder mapping, engagement strategies, communication plan.'
          }
        ],
        quiz: {
          id: 'quiz-011',
          title: 'Quiz: PM Framework',
          passingScore: 75,
          timeLimit: 20,
          questions: []
        }
      },
      {
        id: 'mod-012',
        title: 'Time Management',
        description: 'Scheduling dan control',
        duration: '5 jam',
        lessons: [
          {
            id: 'les-033',
            title: 'Work Breakdown Structure',
            type: 'video',
            duration: '1 jam',
            content: 'Cara membuat WBS yang efektif untuk proyek konstruksi.'
          },
          {
            id: 'les-034',
            title: 'Critical Path Method',
            type: 'interactive',
            duration: '1.5 jam',
            content: 'Simulasi CPM: forward pass, backward pass, float calculation.'
          },
          {
            id: 'les-035',
            title: 'Microsoft Project Praktik',
            type: 'practice',
            duration: '2 jam',
            content: 'Membuat schedule proyek dengan MS Project: tasks, dependencies, resources, baseline.'
          }
        ],
        quiz: {
          id: 'quiz-012',
          title: 'Quiz: Time Management',
          passingScore: 80,
          timeLimit: 25,
          questions: []
        }
      }
    ]
  },

  // ============ PERIJINAN PATHS ============
  {
    id: 'path-007',
    title: 'SBU dan Sertifikasi Konstruksi',
    slug: 'sbu-sertifikasi',
    category: 'perijinan',
    level: 'beginner',
    description: 'Panduan lengkap perijinan usaha jasa konstruksi: SBU, ISO, dan sertifikasi kompetensi.',
    thumbnail: '📜',
    estimatedHours: 12,
    enrolledCount: 3421,
    rating: 4.7,
    reviewCount: 456,
    prerequisites: ['Tidak ada'],
    outcomes: [
      'Memahami klasifikasi dan kualifikasi SBU',
      'Mampu mengurus SBU baru atau perpanjangan',
      'Menguasai sistem sertifikasi LPJK',
      'Dapat mengelola sertifikat kompetensi personel'
    ],
    certificationAwarded: 'Licensing & Certification Guide',
    modules: [
      {
        id: 'mod-013',
        title: 'Sistem Perijinan Konstruksi',
        description: 'LPJK, LSP, dan lembaga terkait',
        duration: '2 jam',
        lessons: [
          {
            id: 'les-036',
            title: 'Ekosistem Perijinan',
            type: 'reading',
            duration: '1 jam',
            content: 'LPJK, LSP, OSS RBA, BUJK, dan peran masing-masing lembaga.'
          },
          {
            id: 'les-037',
            title: 'Regulasi Terbaru',
            type: 'video',
            duration: '45 menit',
            content: 'Perpres 14/2021, Permen PUPR, dan implikasi untuk pengusaha.'
          }
        ],
        quiz: {
          id: 'quiz-013',
          title: 'Quiz: Sistem Perijinan',
          passingScore: 70,
          timeLimit: 15,
          questions: []
        }
      },
      {
        id: 'mod-014',
        title: 'SBU: Klasifikasi dan Subklasifikasi',
        description: 'Pilih yang tepat untuk bisnis Anda',
        duration: '3 jam',
        lessons: [
          {
            id: 'les-038',
            title: 'Bidang Usaha Jasa Konstruksi',
            type: 'reading',
            duration: '1 jam',
            content: 'BG001-BG999: bangunan gedung, SP001-SP999: sipil, EL001-EL999: elektrikal, dst.'
          },
          {
            id: 'les-039',
            title: 'Kualifikasi: Kecil, Menengah, Besar',
            type: 'video',
            duration: '1 jam',
            content: 'Persyaratan modal, pengalaman, SDM, dan peralatan tiap kualifikasi.'
          }
        ],
        quiz: {
          id: 'quiz-014',
          title: 'Quiz: SBU',
          passingScore: 75,
          timeLimit: 20,
          questions: []
        }
      }
    ]
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getLearningPathBySlug(slug: string): LearningPath | undefined {
  return LEARNING_PATHS.find(path => path.slug === slug);
}

export function getLearningPathsByCategory(category: LearningPath['category']): LearningPath[] {
  return LEARNING_PATHS.filter(path => path.category === category);
}

export function getLearningPathsByLevel(level: LearningPath['level']): LearningPath[] {
  return LEARNING_PATHS.filter(path => path.level === level);
}

export function searchLearningPaths(query: string): LearningPath[] {
  const lowerQuery = query.toLowerCase();
  return LEARNING_PATHS.filter(path => 
    path.title.toLowerCase().includes(lowerQuery) ||
    path.description.toLowerCase().includes(lowerQuery) ||
    path.outcomes.some(o => o.toLowerCase().includes(lowerQuery))
  );
}

export function getModuleById(pathId: string, moduleId: string): LearningModule | undefined {
  const path = LEARNING_PATHS.find(p => p.id === pathId);
  return path?.modules.find(m => m.id === moduleId);
}

export function getLessonById(pathId: string, moduleId: string, lessonId: string): Lesson | undefined {
  const learningModule = getModuleById(pathId, moduleId);
  return learningModule?.lessons.find(l => l.id === lessonId);
}

export function getTotalLessons(path: LearningPath): number {
  return path.modules.reduce((total, module) => total + module.lessons.length, 0);
}

export function getCategoryColor(category: LearningPath['category']): string {
  const colors: Record<LearningPath['category'], string> = {
    konstruksi: 'from-orange-500 to-red-600',
    energi: 'from-yellow-500 to-orange-500',
    migas: 'from-blue-600 to-cyan-500',
    tender: 'from-emerald-500 to-teal-600',
    manajemen: 'from-purple-500 to-violet-600',
    perijinan: 'from-pink-500 to-rose-600'
  };
  return colors[category];
}

export function getLevelBadge(level: LearningPath['level']): { text: string; color: string } {
  const badges = {
    beginner: { text: 'Pemula', color: 'bg-green-100 text-green-800' },
    intermediate: { text: 'Menengah', color: 'bg-yellow-100 text-yellow-800' },
    advanced: { text: 'Lanjutan', color: 'bg-orange-100 text-orange-800' },
    expert: { text: 'Ahli', color: 'bg-red-100 text-red-800' }
  };
  return badges[level];
}

export function getCategoryLabel(category: LearningPath['category']): string {
  const labels: Record<LearningPath['category'], string> = {
    konstruksi: 'Teknik Konstruksi',
    energi: 'Energi & Kelistrikan',
    migas: 'Migas & Pertambangan',
    tender: 'Tender & Pengadaan',
    manajemen: 'Manajemen Proyek',
    perijinan: 'Perijinan & Legal'
  };
  return labels[category];
}
