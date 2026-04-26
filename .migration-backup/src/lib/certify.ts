// ============================================================
// KONSTRUKSI AI - CERTIFY MODULE
// Sertifikasi: SBU, SKTK, SKKNI, KBLI, Regulasi Nasional
// ============================================================

// ============ BADAN USAHA JASA KONSTRUKSI (BUJK) ============

export type BusinessScale = 'kecil' | 'menengah' | 'besar';
export type BusinessClassification = 'bg' | 'sp' | 'el' | 'me' | 'tl' | 'pl';

export interface SBUClassification {
  code: string;
  name: string;
  description: string;
  kblis: string[];
  scope: string[];
}

export interface SBUQualification {
  scale: BusinessScale;
  minCapital: number; // in millions IDR
  minExperience: number; // years
  minProjectValue: number; // in millions IDR
  requirements: {
    direktur: string;
    pengalamanProyek: number;
    sdmTeknis: number;
    peralatan: string[];
  };
}

export interface SBUCertificate {
  id: string;
  code: string;
  name: string;
  classification: string;
  subClassification: string;
  qualification: BusinessScale;
  lpjkNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'suspended';
}

export interface WorkerCertificate {
  id: string;
  sktkNumber: string;
  name: string;
  nik: string;
  competencyCode: string;
  competencyName: string;
  level: 'operator' | 'teknisi' | 'supervisor' | 'manajerial';
  issueDate: Date;
  expiryDate: Date;
  lsp: string;
  status: 'active' | 'expired';
}

// ============ REGULASI NASIONAL ============

export interface Regulation {
  id: string;
  type: 'uu' | 'pp' | 'perpres' | 'permen' | 'kepmen' | 'se' | 'sni';
  number: string;
  year: number;
  title: string;
  description: string;
  sector: 'konstruksi' | 'ketenagalistrikan' | 'energi' | 'mineral' | 'migas' | 'safety' | 'general';
  scope: string[];
  keyPoints: string[];
  relatedRegulations: string[];
  downloadUrl?: string;
}

// ============ SKKNI ============

export interface SKKNI {
  code: string;
  title: string;
  unitCompetencies: UnitCompetency[];
  sector: string;
  levelKKI: number; // 1-9
  description: string;
}

export interface UnitCompetency {
  code: string;
  title: string;
  elements: CompetencyElement[];
}

export interface CompetencyElement {
  code: string;
  description: string;
  kuk: string[]; // Kriteria Unjuk Kerja
}

// ============ KBLI ============

export interface KBLI {
  code: string;
  name: string;
  description: string;
  sbuMappings: string[];
  requirements: string[];
}

// ============ DATA: SBU CLASSIFICATIONS ============

export const SBU_CLASSIFICATIONS: SBUClassification[] = [
  {
    code: 'BG',
    name: 'Bangunan Gedung',
    description: 'Konstruksi bangunan gedung, rumah, apartemen, perkantoran, dan fasilitas umum',
    kblis: ['41011', '41012', '41013', '41014'],
    scope: [
      'Konstruksi bangunan hunian (rumah, apartemen, rusun)',
      'Konstruksi bangunan komersial (kantor, ruko, hotel)',
      'Konstruksi bangunan industri (pabrik, gudang)',
      'Konstruksi fasilitas umum (sekolah, rumah sakit)',
      'Renovasi dan rehabilitasi bangunan gedung'
    ]
  },
  {
    code: 'SP',
    name: 'Sipil',
    description: 'Konstruksi sipil termasuk jalan, jembatan, bendungan, pelabuhan, dan bandara',
    kblis: ['42101', '42102', '42201', '42202', '42911', '42912'],
    scope: [
      'Konstruksi jalan dan jembatan',
      'Konstruksi jalan rel dan kereta api',
      'Konstruksi bendungan dan pengairan',
      'Konstruksi pelabuhan dan dermaga',
      'Konstruksi bandar udara',
      'Konstruksi bangunan bawah tanah'
    ]
  },
  {
    code: 'EL',
    name: 'Elektrikal',
    description: 'Instalasi kelistrikan, pembangkit, transmisi, dan distribusi',
    kblis: ['43211', '43212', '35111', '35112', '35113'],
    scope: [
      'Instalasi tenaga listrik',
      'Instalasi penerangan jalan umum',
      'Instalasi komunikasi',
      'Instalasi pengaman kebakaran',
      'Pemasangan peralatan listrik'
    ]
  },
  {
    code: 'ME',
    name: 'Mekanikal',
    description: 'Instalasi mekanikal, HVAC, plumbing, dan fire protection',
    kblis: ['43221', '43222', '43223', '43291', '43292'],
    scope: [
      'Instalasi sanitasi dan plumbing',
      'Instalasi HVAC (heating, ventilation, AC)',
      'Instalasi gas dan thermal',
      'Instalasi elevator dan eskalator',
      'Instalasi pipa proses'
    ]
  },
  {
    code: 'TL',
    name: 'Tata Lingkungan',
    description: 'Konstruksi untuk pengelolaan lingkungan hidup',
    kblis: ['37011', '37012', '39011', '39012'],
    scope: [
      'Konstruksi sistem pengelolaan air limbah',
      'Konstruksi TPA dan pengelolaan sampah',
      'Konstruksi IPAL (Instalasi Pengolahan Air Limbah)',
      'Reklamasi dan restorasi lingkungan',
      'Penghijauan dan konservasi'
    ]
  },
  {
    code: 'PL',
    name: 'Pekerjaan Lainnya',
    description: 'Klasifikasi lain yang tidak termasuk dalam kategori di atas',
    kblis: ['43110', '43120', '43130', '43901', '43902'],
    scope: [
      'Pekerjaan pembersihan bangunan',
      'Pekerjaan persiapan konstruksi',
      'Pekerjaan bor dan eksplorasi',
      'Pekerjaan instalasi lainnya',
      'Konstruksi khusus'
    ]
  }
];

// ============ DATA: SBU QUALIFICATIONS ============

export const SBU_QUALIFICATIONS: Record<BusinessScale, SBUQualification> = {
  kecil: {
    scale: 'kecil',
    minCapital: 500,
    minExperience: 1,
    minProjectValue: 200,
    requirements: {
      direktur: 'Minimal D3 teknik atau SMA + pengalaman 3 tahun',
      pengalamanProyek: 2,
      sdmTeknis: 2,
      peralatan: ['Peralatan dasar konstruksi', 'Kendaraan operasional']
    }
  },
  menengah: {
    scale: 'menengah',
    minCapital: 2500,
    minExperience: 3,
    minProjectValue: 1000,
    requirements: {
      direktur: 'Minimal S1 teknik + pengalaman 5 tahun',
      pengalamanProyek: 5,
      sdmTeknis: 5,
      peralatan: ['Peralatan konstruksi lengkap', 'Kendaraan berat', 'Workshop']
    }
  },
  besar: {
    scale: 'besar',
    minCapital: 10000,
    minExperience: 5,
    minProjectValue: 5000,
    requirements: {
      direktur: 'Minimal S1 teknik + pengalaman 10 tahun',
      pengalamanProyek: 10,
      sdmTeknis: 15,
      peralatan: ['Peralatan konstruksi modern', 'Fleet lengkap', 'Workshop besar', 'Alat uji laboratorium']
    }
  }
};

// ============ DATA: REGULASI NASIONAL ============

export const REGULATIONS: Regulation[] = [
  // === KONSTRUKSI ===
  {
    id: 'reg-001',
    type: 'uu',
    number: '2/2017',
    year: 2017,
    title: 'UU Jasa Konstruksi',
    description: 'Undang-undang tentang Jasa Konstruksi yang mengatur penyelenggaraan jasa konstruksi',
    sector: 'konstruksi',
    scope: ['Jasa konstruksi', 'Badan usaha', 'Sertifikasi', 'Lembaga penunjang'],
    keyPoints: [
      'Wajib sertifikasi SBU untuk badan usaha',
      'Wajib SKTK untuk tenaga kerja',
      'Pembinaan oleh LPJK',
      'Sanksi pelanggaran'
    ],
    relatedRegulations: ['reg-002', 'reg-003']
  },
  {
    id: 'reg-002',
    type: 'pp',
    number: '14/2021',
    year: 2021,
    title: 'PP Penyelenggaraan Jasa Konstruksi',
    description: 'Peraturan Pemerintah pelaksanaan UU Jasa Konstruksi',
    sector: 'konstruksi',
    scope: ['Badan usaha', 'Tenaga kerja', 'Lembaga penunjang'],
    keyPoints: [
      'Klasifikasi dan kualifikasi badan usaha',
      'Klasifikasi dan kualifikasi tenaga kerja',
      'Standar kompetensi (SKKNI)',
      'Tata cara sertifikasi'
    ],
    relatedRegulations: ['reg-001', 'reg-003']
  },
  {
    id: 'reg-003',
    type: 'permen',
    number: '11/PRT/M/2021',
    year: 2021,
    title: 'Permen PUPR Standar Kompetensi',
    description: 'Peraturan Menteri PUPR tentang Standar Kompetensi Kerja Konstruksi',
    sector: 'konstruksi',
    scope: ['SKKNI', 'Kompetensi', 'Sertifikasi'],
    keyPoints: [
      'Penetapan SKKNI konstruksi',
      'Unit kompetensi per bidang',
      'Level KKI (Kerangka Kualifikasi Indonesia)',
      'Kriteria unjuk kerja'
    ],
    relatedRegulations: ['reg-002']
  },
  {
    id: 'reg-004',
    type: 'sni',
    number: '2847:2019',
    year: 2019,
    title: 'SNI Persyaratan Beton Struktural',
    description: 'Standar Nasional Indonesia untuk perencanaan beton struktural',
    sector: 'konstruksi',
    scope: ['Betonn', 'Struktur', 'Perencanaan'],
    keyPoints: [
      'Mutu beton dan tulangan',
      'Analisis struktur',
      'Desain elemen struktur',
      'Pembebanan'
    ],
    relatedRegulations: ['reg-001']
  },
  {
    id: 'reg-005',
    type: 'sni',
    number: '1726:2019',
    year: 2019,
    title: 'SNI Tata Cara Perencanaan Ketahanan Gempa',
    description: 'Standar untuk perencanaan struktur tahan gempa',
    sector: 'konstruksi',
    scope: ['Gempa', 'Struktur', 'Analisis'],
    keyPoints: [
      'Spektrum respons gempa',
      'Sistem struktur',
      'Metode analisis',
      'Detailing tahan gempa'
    ],
    relatedRegulations: ['reg-004']
  },

  // === KETENAGALISTRIKAN ===
  {
    id: 'reg-006',
    type: 'uu',
    number: '30/2009',
    year: 2009,
    title: 'UU Ketenagalistrikan',
    description: 'Undang-undang tentang Ketenagalistrikan',
    sector: 'ketenagalistrikan',
    scope: ['Ketenagalistrikan', 'Pembangkit', 'Transmisi', 'Distribusi'],
    keyPoints: [
      'Kewenangan penyediaan listrik',
      'Izin usaha ketenagalistrikan (IUP/IUPTL)',
      'Keselamatan ketenagalistrikan',
      'Perlindungan konsumen'
    ],
    relatedRegulations: ['reg-007', 'reg-008']
  },
  {
    id: 'reg-007',
    type: 'permen',
    number: '1/2021',
    year: 2021,
    title: 'Permen ESDM Tata Cara Penyediaan dan Penggunaan TDL',
    description: 'Peraturan Menteri ESDM tentang penyediaan listrik',
    sector: 'ketenagalistrikan',
    scope: ['Tarif', 'Distribusi', 'Pelayanan'],
    keyPoints: [
      'Penetapan tarif tenaga listrik',
      'Subsidi listrik',
      'Tata cara penggunaan TDL',
      'Penyelesaian perselisihan'
    ],
    relatedRegulations: ['reg-006']
  },
  {
    id: 'reg-008',
    type: 'permen',
    number: '19/2015',
    year: 2015,
    title: 'Permen ESDM Keselamatan Ketenagalistrikan',
    description: 'Persyaratan keselamatan instalasi dan penggunaan tenaga listrik',
    sector: 'ketenagalistrikan',
    scope: ['Keselamatan', 'Instalasi', 'Operasi'],
    keyPoints: [
      'Sertifikasi personel',
      'Standar instalasi',
      'Audit keselamatan',
      'Pelaporan kecelakaan'
    ],
    relatedRegulations: ['reg-006']
  },

  // === ENERGI ===
  {
    id: 'reg-009',
    type: 'uu',
    number: '30/2007',
    year: 2007,
    title: 'UU Energi',
    description: 'Undang-undang tentang Energi',
    sector: 'energi',
    scope: ['Energi', 'Energi Baru Terbarukan', 'Konservasi'],
    keyPoints: [
      'Kebijakan energi nasional',
 'Energi baru terbarukan (EBT)',
      'Konservasi energi',
      'Efisiensi energi'
    ],
    relatedRegulations: ['reg-010', 'reg-011']
  },
  {
    id: 'reg-010',
    type: 'pp',
    number: '79/2014',
    year: 2014,
    title: 'PP Kebijakan Energi Nasional',
    description: 'Peraturan Pemerintah tentang Kebijakan Energi Nasional',
    sector: 'energi',
    scope: ['KEN', 'EBT', 'Bauran energi'],
    keyPoints: [
      'Target bauran energi 2025 dan 2050',
      'Pengembangan EBT',
      'Ketahanan energi',
      'Kemandirian energi'
    ],
    relatedRegulations: ['reg-009']
  },
  {
    id: 'reg-011',
    type: 'perpres',
    number: '112/2022',
    year: 2022,
    title: 'Perpres Percepatan Pengembangan EBT',
    description: 'Peraturan Presiden tentang percepatan EBT untuk penyediaan listrik',
    sector: 'energi',
    scope: ['EBT', 'PLTS', 'PLTB', 'PLTM'],
    keyPoints: [
      'Target EBT 23% pada 2025',
      'Harga dasar listrik EBT',
      'Percepatan perizinan',
      'Pendanaan proyek EBT'
    ],
    relatedRegulations: ['reg-009', 'reg-010']
  },

  // === MIGAS ===
  {
    id: 'reg-012',
    type: 'uu',
    number: '22/2001',
    year: 2001,
    title: 'UU Minyak dan Gas Bumi',
    description: 'Undang-undang tentang Minyak dan Gas Bumi',
    sector: 'migas',
    scope: ['Migas', 'Kontrak kerja sama', 'Hulu', 'Hilir'],
    keyPoints: [
      'Kontrak Bagi Hasil (PSC)',
      'Izin usaha migas',
      'KKKS (Kontraktor Kontrak Kerja Sama)',
      'BPMIGAS/SKK Migas'
    ],
    relatedRegulations: ['reg-013', 'reg-014']
  },
  {
    id: 'reg-013',
    type: 'pp',
    number: '35/2004',
    year: 2004,
    title: 'PP Kegiatan Usaha Hulu Migas',
    description: 'Peraturan Pemerintah tentang kegiatan usaha hulu minyak dan gas bumi',
    sector: 'migas',
    scope: ['Eksplorasi', 'Eksploitasi', 'Hulu'],
    keyPoints: [
      'Wilayah kerja (WK)',
      'Tahapan kegiatan usaha hulu',
      'Pengusahaan WK',
      'Pengawasan dan pengendalian'
    ],
    relatedRegulations: ['reg-012']
  },
  {
    id: 'reg-014',
    type: 'permen',
    number: '05/2018',
    year: 2018,
    title: 'Permen ESDM Keselamatan Migas',
    description: 'Persyaratan keselamatan operasi migas',
    sector: 'migas',
    scope: ['Keselamatan', 'Operasi', 'K3'],
    keyPoints: [
      'Manajemen keselamatan migas',
      'Sertifikasi peralatan',
      'Audit keselamatan',
      'Pencegahan kecelakaan'
    ],
    relatedRegulations: ['reg-012', 'reg-020']
  },

  // === MINERAL & PERTAMBANGAN ===
  {
    id: 'reg-015',
    type: 'uu',
    number: '4/2009',
    year: 2009,
    title: 'UU Pertambangan Mineral dan Batubara',
    description: 'Undang-undang tentang Pertambangan Mineral dan Batubara (Minerba)',
    sector: 'mineral',
    scope: ['Mineral', 'Batubara', 'IUP', 'IPR'],
    keyPoints: [
      'IUP (Izin Usaha Pertambangan)',
      'IUPK (IUP Khusus)',
      'IPR (Izin Pertambangan Rakyat)',
      'Kewajiban pengolahan dan pemurnian'
    ],
    relatedRegulations: ['reg-016', 'reg-017']
  },
  {
    id: 'reg-016',
    type: 'pp',
    number: '23/2010',
    year: 2010,
    title: 'PP Pelaksanaan Kegiatan Usaha Pertambangan',
    description: 'Peraturan Pemerintah pelaksanaan UU Minerba',
    sector: 'mineral',
    scope: ['IUP', 'Operasi', 'Lingkungan'],
    keyPoints: [
      'Tahapan kegiatan usaha pertambangan',
      'Wilayah izin usaha',
      'Kewajiban pemegang IUP',
      'Pengawasan dan pengendalian'
    ],
    relatedRegulations: ['reg-015']
  },
  {
    id: 'reg-017',
    type: 'permen',
    number: '26/2018',
    year: 2018,
    title: 'Permen ESDM Pelaksanaan Kaidah Teknik Pertambangan',
    description: 'Kaidah teknik pertambangan yang baik (Good Mining Practice)',
    sector: 'mineral',
    scope: ['Teknik pertambangan', 'K3', 'Lingkungan'],
    keyPoints: [
      'Perencanaan tambang',
      'Pelaksanaan penambangan',
      'Keselamatan dan kesehatan kerja',
      'Pengelolaan lingkungan'
    ],
    relatedRegulations: ['reg-015', 'reg-016']
  },

  // === SAFETY ===
  {
    id: 'reg-018',
    type: 'uu',
    number: '1/1970',
    year: 1970,
    title: 'UU Keselamatan Kerja',
    description: 'Undang-undang tentang Keselamatan Kerja',
    sector: 'safety',
    scope: ['K3', 'Keselamatan', 'Kesehatan'],
    keyPoints: [
      'Kewajibn K3 di tempat kerja',
      'Panitia pembina K3',
      'Pengawasan K3',
      'Sanksi pelanggaran'
    ],
    relatedRegulations: ['reg-019', 'reg-020']
  },
  {
    id: 'reg-019',
    type: 'pp',
    number: '50/2012',
    year: 2012,
    title: 'PP Penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3)',
    description: 'Kewajiban menerapkan SMK3 di tempat kerja',
    sector: 'safety',
    scope: ['SMK3', 'Audit', 'Sertifikasi'],
    keyPoints: [
      'Persyaratan SMK3',
      'Audit SMK3',
      'Sertifikasi SMK3',
      'Pengawasan dan sanksi'
    ],
    relatedRegulations: ['reg-018', 'reg-020']
  },
  {
    id: 'reg-020',
    type: 'permen',
    number: '05/1996',
    year: 1996,
    title: 'Permenaker Sistem Manajemen Keselamatan dan Kesehatan Kerja',
    description: 'Pedoman penerapan SMK3 di tempat kerja',
    sector: 'safety',
    scope: ['SMK3', 'Implementasi', 'Evaluasi'],
    keyPoints: [
      'Kebijakan K3',
      'Perencanaan K3',
      'Penerapan dan operasi',
      'Audit dan tinjauan manajemen'
    ],
    relatedRegulations: ['reg-018', 'reg-019']
  }
];

// ============ DATA: SKKNI ============

export const SKKNI_LIST: SKKNI[] = [
  {
    code: 'SKKNI-KON-001',
    title: 'Ahli Teknik Konstruksi Bangunan Gedung',
    sector: 'Konstruksi',
    levelKKI: 6,
    description: 'Kompetensi untuk merencanakan, mengimplementasikan, dan mengendalikan pekerjaan konstruksi bangunan gedung',
    unitCompetencies: [
      {
        code: 'KON-001.U1',
        title: 'Mengelola proyek konstruksi',
        elements: [
          {
            code: 'KON-001.U1.E1',
            description: 'Menyusun rencana kerja dan syarat-syarat (RKS)',
            kuk: [
              'Mengidentifikasi lingkup pekerjaan',
              'Menentukan spesifikasi teknis',
              'Menyusun jadwal pelaksanaan',
              'Menentukan sumber daya yang diperlukan'
            ]
          },
          {
            code: 'KON-001.U1.E2',
            description: 'Mengorganisasikan pelaksanaan proyek',
            kuk: [
              'Menyusun struktur organisasi proyek',
              'Menentukan tugas dan tanggung jawab',
              'Mengkoordinasikan tim proyek',
              'Menyusun prosedur kerja'
            ]
          }
        ]
      },
      {
        code: 'KON-001.U2',
        title: 'Mengendalikan mutu konstruksi',
        elements: [
          {
            code: 'KON-001.U2.E1',
            description: 'Menyusun rencana mutu',
            kuk: [
              'Menentukan standar mutu',
              'Menyusun prosedur inspeksi',
              'Menentukan metode pengujian',
              'Menyusun dokumentasi mutu'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'SKKNI-EL-001',
    title: 'Ahli Teknik Ketenagalistrikan',
    sector: 'Ketenagalistrikan',
    levelKKI: 6,
    description: 'Kompetensi untuk merencanakan, mengimplementasikan, dan mengoperasikan sistem kelistrikan',
    unitCompetencies: [
      {
        code: 'EL-001.U1',
        title: 'Merencanakan sistem kelistrikan',
        elements: [
          {
            code: 'EL-001.U1.E1',
            description: 'Menganalisis kebutuhan beban listrik',
            kuk: [
              'Mengumpulkan data beban',
              'Menghitung demand factor',
              'Menentukan kapasitas trafo',
              'Menyusun single line diagram'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'SKKNI-SAF-001',
    title: 'Ahli Keselamatan dan Kesehatan Kerja (K3)',
    sector: 'Safety',
    levelKKI: 5,
    description: 'Kompetensi untuk merencanakan, mengimplementasikan, dan mengawasi sistem K3 di tempat kerja',
    unitCompetencies: [
      {
        code: 'SAF-001.U1',
        title: 'Menerapkan SMK3',
        elements: [
          {
            code: 'SAF-001.U1.E1',
            description: 'Menyusun kebijakan K3',
            kuk: [
              'Mengidentifikasi persyaratan K3',
              'Menyusun kebijakan K3 organisasi',
              'Menyosialisasikan kebijakan',
              'Mengevaluasi kebijakan'
            ]
          }
        ]
      }
    ]
  }
];

// ============ DATA: KBLI ============

export const KBLI_LIST: KBLI[] = [
  {
    code: '41011',
    name: 'Konstruksi Gedung Hunian',
    description: 'Kegiatan konstruksi gedung untuk tempat tinggal',
    sbuMappings: ['BG001', 'BG002'],
    requirements: ['SBU Bangunan Gedung', 'Tenaga ahli konstruksi']
  },
  {
    code: '41012',
    name: 'Konstruksi Gedung Komersial',
    description: 'Konstruksi gedung untuk kegiatan komersial',
    sbuMappings: ['BG003', 'BG004'],
    requirements: ['SBU Bangunan Gedung', 'Sertifikat laik fungsi']
  },
  {
    code: '42101',
    name: 'Konstruksi Jalan dan Jembatan',
    description: 'Konstruksi jalan raya, jembatan, dan underpass',
    sbuMappings: ['SP001', 'SP002'],
    requirements: ['SBU Sipil', 'Sertifikasi teknisi jalan']
  },
  {
    code: '42201',
    name: 'Konstruksi Jaringan Irigasi',
    description: 'Konstruksi jaringan irigasi dan drainage',
    sbuMappings: ['SP003'],
    requirements: ['SBU Sipil', 'Ahli hidroteknik']
  },
  {
    code: '35111',
    name: 'Pembangkit Listrik Tenaga Air',
    description: 'Pembangkit listrik dari tenaga air',
    sbuMappings: ['EL001'],
    requirements: ['SBU Elektrikal', 'Izin IPPKB']
  },
  {
    code: '35112',
    name: 'Pembangkit Listrik Tenaga Panas Bumi',
    description: 'Pembangkit listrik dari panas bumi',
    sbuMappings: ['EL001', 'EL002'],
    requirements: ['SBU Elektrikal', 'Izin Panas Bumi']
  },
  {
    code: '35113',
    name: 'Pembangkit Listrik Tenaga Surya',
    description: 'Pembangkit listrik dari panel surya',
    sbuMappings: ['EL002'],
    requirements: ['SBU Elektrikal', 'Sertifikasi PLTS']
  },
  {
    code: '43211',
    name: 'Instalasi Kelistrikan',
    description: 'Instalasi sistem kelistrikan dalam gedung',
    sbuMappings: ['EL003', 'EL004'],
    requirements: ['SBU Elektrikal', 'SLO (Sertifikat Laik Operasi)']
  },
  {
    code: '43221',
    name: 'Instalasi Plumbing dan Sanitasi',
    description: 'Instalasi sistem air bersih dan air kotor',
    sbuMappings: ['ME001', 'ME002'],
    requirements: ['SBU Mekanikal', 'Sertifikasi teknisi plumbing']
  },
  {
    code: '37011',
    name: 'Pengelolaan Air Limbah',
    description: 'Kegiatan pengumpulan dan pengolahan air limbah',
    sbuMappings: ['TL001', 'TL002'],
    requirements: ['SBU Tata Lingkungan', 'AMDAL']
  }
];

// ============ HELPER FUNCTIONS ============

export function getRegulationsBySector(sector: Regulation['sector']): Regulation[] {
  return REGULATIONS.filter(r => r.sector === sector);
}

export function getRegulationsByType(type: Regulation['type']): Regulation[] {
  return REGULATIONS.filter(r => r.type === type);
}

export function getSBUByClassification(code: string): SBUClassification | undefined {
  return SBU_CLASSIFICATIONS.find(c => c.code === code);
}

export function getKBLIBySBU(sbuCode: string): KBLI[] {
  return KBLI_LIST.filter(k => k.sbuMappings.includes(sbuCode));
}

export function getSKKNIBySector(sector: string): SKKNI[] {
  return SKKNI_LIST.filter(s => s.sector === sector);
}

export function getRegulationTypeLabel(type: Regulation['type']): string {
  const labels = {
    uu: 'Undang-Undang',
    pp: 'Peraturan Pemerintah',
    perpres: 'Peraturan Presiden',
    permen: 'Peraturan Menteri',
    kepmen: 'Keputusan Menteri',
    se: 'Surat Edaran',
    sni: 'Standar Nasional Indonesia'
  };
  return labels[type];
}

export function getSectorLabel(sector: Regulation['sector']): string {
  const labels = {
    konstruksi: 'Konstruksi',
    ketenagalistrikan: 'Ketenagalistrikan',
    energi: 'Energi',
    mineral: 'Mineral & Batubara',
    migas: 'Migas',
    safety: 'Keselamatan',
    general: 'Umum'
  };
  return labels[sector];
}

export function getSectorColor(sector: Regulation['sector']): string {
  const colors = {
    konstruksi: 'bg-orange-100 text-orange-800',
    ketenagalistrikan: 'bg-yellow-100 text-yellow-800',
    energi: 'bg-green-100 text-green-800',
    mineral: 'bg-stone-100 text-stone-800',
    migas: 'bg-blue-100 text-blue-800',
    safety: 'bg-red-100 text-red-800',
    general: 'bg-slate-100 text-slate-800'
  };
  return colors[sector];
}
