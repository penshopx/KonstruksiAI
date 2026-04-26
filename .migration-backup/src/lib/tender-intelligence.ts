/**
 * Tender Intelligence Library
 * Comprehensive tender document analysis and compliance checking
 * Features: Document completeness check, requirement summary, risk identification, compliance checklist
 * Standards: Indonesian procurement regulations, construction standards
 */

export interface TenderRequirement {
  id: string;
  category: 'administrative' | 'technical' | 'financial' | 'legal' | 'safety' | 'environmental';
  name: string;
  description: string;
  mandatory: boolean;
  checklist: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  references: string[];
}

export interface DocumentCompletenessCheck {
  documentType: string;
  required: boolean;
  present: boolean;
  completenessScore: number;
  missingElements: string[];
  notes: string;
}

export interface RiskAssessment {
  id: string;
  category: 'compliance' | 'technical' | 'financial' | 'schedule' | 'contractual';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string[];
  impact: string;
}

export interface TenderAnalysisResult {
  id: string;
  projectName: string;
  tenderType: string;
  analysisDate: string;
  completenessChecks: DocumentCompletenessCheck[];
  overallCompleteness: number;
  requirements: TenderRequirement[];
  risks: RiskAssessment[];
  recommendations: string[];
  complianceScore: number;
  summary: {
    administrativeRequirements: string;
    technicalRequirements: string;
    financialRequirements: string;
    keyRisks: string;
    nextSteps: string;
  };
}

export interface TenderChecklist {
  id: string;
  name: string;
  category: string;
  items: ChecklistItem[];
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  notes: string;
  mandatory: boolean;
  category: string;
}

// Indonesian Tender Requirements Database
export const TENDER_REQUIREMENTS: TenderRequirement[] = [
  {
    id: 'admin-1',
    category: 'administrative',
    name: 'Legal Entity Documents',
    description: 'Company registration, NPWP, SIUP, TDP, and other legal documents',
    mandatory: true,
    checklist: [
      'Akta Pendirian Perusahaan',
      'NPWP Perusahaan',
      'SIUP/TDP',
      'Surat Keterangan Domisili',
      'Surat Pengukuhan Pengusaha Kena Pajak (PKP)',
      'Rekening Koran 3 bulan terakhir'
    ],
    riskLevel: 'critical',
    references: ['UU No. 28 Tahun 2007 tentang Ketentuan Umum Perpajakan', 'Peraturan Pemerintah No. 5 Tahun 2021']
  },
  {
    id: 'admin-2',
    category: 'administrative',
    name: 'Tax Compliance',
    description: 'Tax compliance certificates and payment proofs',
    mandatory: true,
    checklist: [
      'SPT Tahunan Pajak',
      'Surat Keterangan Bebas Utang Pajak',
      'Surat Keterangan Fiskal',
      'Bukti Pembayaran Pajak'
    ],
    riskLevel: 'high',
    references: ['UU No. 6 Tahun 1983 tentang Ketentuan Umum dan Tata Cara Perpajakan']
  },
  {
    id: 'tech-1',
    category: 'technical',
    name: 'Technical Capability',
    description: 'Proof of technical expertise and experience in similar projects',
    mandatory: true,
    checklist: [
      'Daftar Pengalaman Proyek Serupa',
      'Sertifikat Keahlian Tenaga Ahli',
      'Sertifikat Badan Usaha (SBU)',
      'Surat Referensi dari Klien',
      'Portofolio Proyek'
    ],
    riskLevel: 'high',
    references: ['Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah No. 12 Tahun 2021']
  },
  {
    id: 'tech-2',
    category: 'technical',
    name: 'Equipment and Resources',
    description: 'Availability of equipment, machinery, and human resources',
    mandatory: true,
    checklist: [
      'Daftar Peralatan/Mesin',
      'Sertifikat Kepemilikan Alat',
      'Daftar Tenaga Ahli dan Terampil',
      'Sertifikat Kompetensi Tenaga Kerja',
      'Surat Keterangan Ketersediaan Material'
    ],
    riskLevel: 'medium',
    references: ['Peraturan Pemerintah No. 22 Tahun 2020 tentang Pelaksanaan Keselamatan Kerja']
  },
  {
    id: 'fin-1',
    category: 'financial',
    name: 'Financial Capability',
    description: 'Financial statements and bank references proving capability',
    mandatory: true,
    checklist: [
      'Laporan Keuangan 2 tahun terakhir',
      'Surat Referensi Bank',
      'Surat Keterangan Laporan Keuangan dari Akuntan Publik',
      'Neraca dan Laporan Laba Rugi',
      'Surat Keterangan Kemampuan Keuangan'
    ],
    riskLevel: 'high',
    references: ['Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah No. 13 Tahun 2021']
  },
  {
    id: 'legal-1',
    category: 'legal',
    name: 'Legal Compliance',
    description: 'Compliance with labor laws and regulations',
    mandatory: true,
    checklist: [
      'Surat Keterangan Status Hubungan Industrial',
      'BPJS Ketenagakerjaan dan Kesehatan',
      'Surat Keterangan Bebas Sengketa',
      'Izin Kerja Tenaga Asing (jika ada)'
    ],
    riskLevel: 'critical',
    references: ['UU No. 13 Tahun 2003 tentang Ketenagakerjaan', 'UU No. 24 Tahun 2011 tentang BPJS']
  },
  {
    id: 'safety-1',
    category: 'safety',
    name: 'Safety Management System',
    description: 'Safety management and occupational health certificates',
    mandatory: true,
    checklist: [
      'Sertifikat Sistem Manajemen Keselamatan Kerja (SMK3)',
      'Program K3',
      'Daftar Alat Pelindung Diri (APD)',
      'Surat Keterangan Tenaga K3',
      'Rencana Sistem Manajemen K3'
    ],
    riskLevel: 'critical',
    references: ['UU No. 1 Tahun 1970 tentang Keselamatan Kerja', 'Peraturan Menteri Tenaga Kerja No. 5 Tahun 2021']
  },
  {
    id: 'env-1',
    category: 'environmental',
    name: 'Environmental Compliance',
    description: 'Environmental management and permits',
    mandatory: false,
    checklist: [
      'UKL-UPL/SPPL',
      'AMDAL atau UKL-UPL',
      'Surat Keterangan Sistem Manajemen Lingkungan',
      'Program Pengelolaan Lingkungan'
    ],
    riskLevel: 'high',
    references: ['UU No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup']
  }
];

// Tender Checklist Categories
export const TENDER_CHECKLISTS: TenderChecklist[] = [
  {
    id: 'checklist-admin',
    name: 'Administrative Documents',
    category: 'administrative',
    priority: 'high',
    items: [
      { id: 'admin-1', text: 'Akta Pendirian Perusahaan yang masih berlaku', checked: false, notes: '', mandatory: true, category: 'legal' },
      { id: 'admin-2', text: 'NPWP Perusahaan aktif', checked: false, notes: '', mandatory: true, category: 'tax' },
      { id: 'admin-3', text: 'SIUP/TDP sesuai bidang usaha', checked: false, notes: '', mandatory: true, category: 'business' },
      { id: 'admin-4', text: 'Surat Keterangan Domisili Perusahaan', checked: false, notes: '', mandatory: true, category: 'business' },
      { id: 'admin-5', text: 'Rekening koran 3 bulan terakhir', checked: false, notes: '', mandatory: true, category: 'financial' },
      { id: 'admin-6', text: 'SPT Tahunan Pajak 2 tahun terakhir', checked: false, notes: '', mandatory: true, category: 'tax' }
    ]
  },
  {
    id: 'checklist-technical',
    name: 'Technical Capability',
    category: 'technical',
    priority: 'high',
    items: [
      { id: 'tech-1', text: 'Sertifikat Badan Usaha (SBU) sesuai klasifikasi', checked: false, notes: '', mandatory: true, category: 'certification' },
      { id: 'tech-2', text: 'Daftar pengalaman proyek serupa (minimal 3 proyek)', checked: false, notes: '', mandatory: true, category: 'experience' },
      { id: 'tech-3', text: 'Sertifikat kompetensi tenaga ahli', checked: false, notes: '', mandatory: true, category: 'certification' },
      { id: 'tech-4', text: 'Daftar peralatan dan mesin yang dimiliki', checked: false, notes: '', mandatory: true, category: 'resources' },
      { id: 'tech-5', text: 'Surat referensi dari klien sebelumnya', checked: false, notes: '', mandatory: false, category: 'references' }
    ]
  },
  {
    id: 'checklist-financial',
    name: 'Financial Documents',
    category: 'financial',
    priority: 'high',
    items: [
      { id: 'fin-1', text: 'Laporan keuangan audited 2 tahun terakhir', checked: false, notes: '', mandatory: true, category: 'financial' },
      { id: 'fin-2', text: 'Surat referensi bank', checked: false, notes: '', mandatory: true, category: 'banking' },
      { id: 'fin-3', text: 'Neraca dan laporan laba rugi', checked: false, notes: '', mandatory: true, category: 'financial' },
      { id: 'fin-4', text: 'Surat keterangan kemampuan keuangan', checked: false, notes: '', mandatory: false, category: 'financial' }
    ]
  },
  {
    id: 'checklist-safety',
    name: 'Safety & Environmental',
    category: 'safety',
    priority: 'high',
    items: [
      { id: 'safety-1', text: 'Sertifikat SMK3 atau ISO 45001', checked: false, notes: '', mandatory: true, category: 'safety' },
      { id: 'safety-2', text: 'Program K3 perusahaan', checked: false, notes: '', mandatory: true, category: 'safety' },
      { id: 'safety-3', text: 'BPJS Ketenagakerjaan dan Kesehatan', checked: false, notes: '', mandatory: true, category: 'insurance' },
      { id: 'safety-4', text: 'AMDAL/UKL-UPL (untuk proyek tertentu)', checked: false, notes: '', mandatory: false, category: 'environmental' }
    ]
  }
];

// Helper Functions
export function calculateCompletenessScore(checks: DocumentCompletenessCheck[]): number {
  const totalWeight = checks.length;
  const completedWeight = checks.filter(check => check.present).length;
  return Math.round((completedWeight / totalWeight) * 100);
}

export function assessTenderRisks(requirements: TenderRequirement[]): RiskAssessment[] {
  const risks: RiskAssessment[] = [];

  // Check for critical missing requirements
  const criticalMissing = requirements.filter(req => req.mandatory && req.riskLevel === 'critical');
  if (criticalMissing.length > 0) {
    risks.push({
      id: 'risk-critical-missing',
      category: 'compliance',
      description: `Missing ${criticalMissing.length} critical requirements`,
      severity: 'critical',
      likelihood: 'high',
      mitigation: [
        'Segera lengkapi dokumen yang hilang',
        'Konsultasikan dengan tim legal',
        'Periksa ulang persyaratan tender'
      ],
      impact: 'Disqualification from tender process'
    });
  }

  // Financial capability risk
  const financialReqs = requirements.filter(req => req.category === 'financial');
  risks.push({
    id: 'risk-financial',
    category: 'financial',
    description: 'Financial capability may not meet project requirements',
    severity: 'high',
    likelihood: 'medium',
    mitigation: [
      'Siapkan laporan keuangan audited terkini',
      'Dapatkan surat referensi bank tambahan',
      'Pertimbangkan partnership dengan perusahaan lain'
    ],
    impact: 'Rejected due to insufficient financial proof'
  });

  return risks;
}

export function generateTenderSummary(analysis: TenderAnalysisResult): string {
  return `
# Tender Analysis Summary: ${analysis.projectName}

## Overall Compliance Score: ${analysis.complianceScore}/100
## Document Completeness: ${analysis.overallCompleteness}%

### Administrative Requirements
${analysis.summary.administrativeRequirements}

### Technical Requirements
${analysis.summary.technicalRequirements}

### Financial Requirements
${analysis.summary.financialRequirements}

### Key Risks Identified
${analysis.summary.keyRisks}

### Next Steps
${analysis.summary.nextSteps}
  `.trim();
}

export function createTenderAnalysis(
  projectName: string,
  tenderType: string,
  checks: DocumentCompletenessCheck[]
): TenderAnalysisResult {
  const completenessScore = calculateCompletenessScore(checks);
  const risks = assessTenderRisks(TENDER_REQUIREMENTS);

  return {
    id: `analysis-${Date.now()}`,
    projectName,
    tenderType,
    analysisDate: new Date().toISOString(),
    completenessChecks: checks,
    overallCompleteness: completenessScore,
    requirements: TENDER_REQUIREMENTS,
    risks,
    recommendations: [
      'Review all mandatory requirements carefully',
      'Prepare additional supporting documents',
      'Consult with legal and technical experts',
      'Create timeline for document preparation'
    ],
    complianceScore: Math.max(0, completenessScore - (risks.length * 5)),
    summary: {
      administrativeRequirements: 'Complete all legal entity documents, tax compliance, and business licenses',
      technicalRequirements: 'Demonstrate capability through certifications, experience, and resource availability',
      financialRequirements: 'Provide audited financial statements and bank references',
      keyRisks: risks.map(r => r.description).join('; '),
      nextSteps: 'Compile all required documents, verify completeness, and submit before deadline'
    }
  };
}