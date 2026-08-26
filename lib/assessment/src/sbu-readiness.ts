/**
 * SBU (Sertifikat Badan Usaha) Readiness Library
 * Comprehensive assessment for construction business entity certification
 * Based on PP No. 28 Tahun 2025 and SK Dirjen Bina Konstruksi No. 37 Tahun 2025
 */

export interface BusinessEntityProfile {
  id: string;
  name: string;
  businessType: 'PT' | 'CV' | 'UD' | 'Firma' | 'Koperasi';
  npwp: string;
  nib: string;
  sector: string;
  subSector: string;
  establishmentDate: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
}

export interface SbuApplicationType {
  type: 'new' | 'renewal' | 'update' | 'remediation';
  previousSbuNumber?: string;
  expiryDate?: string;
  changeReason?: string;
}

export interface SbuClassification {
  mainClassification: string; // e.g., "1", "2", "3", etc.
  subClassification: string; // e.g., "10101", "20202", etc.
  description: string;
  qualificationLevel: 'Kecil' | 'Menengah' | 'Besar';
  workScope: string[];
  minimumExperience: {
    years: number;
    projects: number;
    value: number; // in IDR
  };
}

export interface SbuPersonnelRequirement {
  position: string;
  minimumEducation: string;
  minimumExperience: number; // years
  certificationRequired: boolean;
  certificationType?: string;
  quantity: number;
}

export interface SbuEquipmentRequirement {
  category: string;
  type: string;
  minimumQuantity: number;
  minimumCapacity?: string;
  ownership: 'owned' | 'leased' | 'partnered';
}

export interface SbuReadinessEvidence {
  category: 'administrative' | 'technical' | 'personnel' | 'equipment' | 'experience' | 'financial';
  requirement: string;
  evidence: string[];
  status: 'available' | 'partial' | 'missing';
  notes: string;
}

export interface SbuReadinessAssessment {
  entityId: string;
  applicationType: SbuApplicationType;
  targetClassification: SbuClassification;
  assessmentDate: string;
  overallReadiness: number; // 0-100
  categoryScores: {
    administrative: number;
    technical: number;
    personnel: number;
    equipment: number;
    experience: number;
    financial: number;
  };
  evidenceAssessment: SbuReadinessEvidence[];
  criticalGaps: string[];
  recommendedActions: string[];
  estimatedPreparationTime: number; // days
  estimatedCost: number; // IDR
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  executiveSummary: {
    currentStatus: string;
    keyStrengths: string[];
    criticalIssues: string[];
    nextSteps: string[];
    recommendedTimeline: string;
  };
}

// SBU Classification Matrix based on SK Dirjen Bina Konstruksi No. 37 Tahun 2025
export const SBU_CLASSIFICATIONS: Record<string, SbuClassification> = {
  '10101': {
    mainClassification: '1',
    subClassification: '10101',
    description: 'Bangunan Gedung',
    qualificationLevel: 'Besar',
    workScope: [
      'Perencanaan dan perancangan bangunan gedung',
      'Pelaksanaan konstruksi bangunan gedung',
      'Pengawasan konstruksi bangunan gedung'
    ],
    minimumExperience: {
      years: 10,
      projects: 5,
      value: 50000000000 // 50 billion IDR
    }
  },
  '20202': {
    mainClassification: '2',
    subClassification: '20202',
    description: 'Sipil - Jalan dan Jembatan',
    qualificationLevel: 'Besar',
    workScope: [
      'Perencanaan jalan dan jembatan',
      'Konstruksi jalan dan jembatan',
      'Pemeliharaan jalan dan jembatan'
    ],
    minimumExperience: {
      years: 8,
      projects: 3,
      value: 25000000000 // 25 billion IDR
    }
  },
  '30303': {
    mainClassification: '3',
    subClassification: '30303',
    description: 'Mekanikal Elektrikal - HVAC',
    qualificationLevel: 'Menengah',
    workScope: [
      'Sistem pendingin udara',
      'Sistem ventilasi',
      'Sistem pemanas'
    ],
    minimumExperience: {
      years: 5,
      projects: 2,
      value: 5000000000 // 5 billion IDR
    }
  }
};

// Personnel Requirements by Classification
export const SBU_PERSONNEL_REQUIREMENTS: Record<string, SbuPersonnelRequirement[]> = {
  '10101': [ // Bangunan Gedung Besar
    {
      position: 'Direktur Teknik',
      minimumEducation: 'S1 Teknik Sipil',
      minimumExperience: 15,
      certificationRequired: true,
      certificationType: 'Ahli Utama Teknik Sipil',
      quantity: 1
    },
    {
      position: 'Kepala Proyek',
      minimumEducation: 'S1 Teknik Sipil',
      minimumExperience: 10,
      certificationRequired: true,
      certificationType: 'Ahli Madya Teknik Sipil',
      quantity: 2
    },
    {
      position: 'Pengawas Lapangan',
      minimumEducation: 'D3 Teknik Sipil',
      minimumExperience: 5,
      certificationRequired: true,
      certificationType: 'Teknisi Bangunan',
      quantity: 3
    }
  ],
  '20202': [ // Jalan dan Jembatan Besar
    {
      position: 'Direktur Teknik',
      minimumEducation: 'S1 Teknik Sipil',
      minimumExperience: 12,
      certificationRequired: true,
      certificationType: 'Ahli Utama Teknik Sipil',
      quantity: 1
    },
    {
      position: 'Insinyur Struktur',
      minimumEducation: 'S1 Teknik Sipil',
      minimumExperience: 8,
      certificationRequired: true,
      certificationType: 'Ahli Madya Teknik Sipil',
      quantity: 2
    }
  ]
};

// Equipment Requirements by Classification
export const SBU_EQUIPMENT_REQUIREMENTS: Record<string, SbuEquipmentRequirement[]> = {
  '10101': [
    {
      category: 'Alat Berat',
      type: 'Excavator',
      minimumQuantity: 2,
      minimumCapacity: '20 ton',
      ownership: 'owned'
    },
    {
      category: 'Alat Berat',
      type: 'Bulldozer',
      minimumQuantity: 1,
      minimumCapacity: '100 HP',
      ownership: 'owned'
    },
    {
      category: 'Alat Ukur',
      type: 'Total Station',
      minimumQuantity: 3,
      ownership: 'owned'
    }
  ],
  '20202': [
    {
      category: 'Alat Berat',
      type: 'Asphalt Finisher',
      minimumQuantity: 1,
      ownership: 'owned'
    },
    {
      category: 'Alat Ukur',
      type: 'GPS Survey Equipment',
      minimumQuantity: 2,
      ownership: 'owned'
    }
  ]
};

// Assessment Functions
export function assessSbuReadiness(
  entity: BusinessEntityProfile,
  applicationType: SbuApplicationType,
  targetClassification: SbuClassification,
  availableEvidence: Record<string, any>
): SbuReadinessAssessment {
  const evidenceAssessment: SbuReadinessEvidence[] = [];

  // Administrative Requirements Assessment
  const adminEvidence: SbuReadinessEvidence[] = [
    {
      category: 'administrative',
      requirement: 'Akta Pendirian Perusahaan yang masih berlaku',
      evidence: availableEvidence.akta_pendirian || [],
      status: availableEvidence.akta_pendirian?.length > 0 ? 'available' : 'missing',
      notes: 'Dokumen dasar legalitas perusahaan'
    },
    {
      category: 'administrative',
      requirement: 'NPWP Perusahaan aktif',
      evidence: availableEvidence.npwp || [],
      status: availableEvidence.npwp?.length > 0 ? 'available' : 'missing',
      notes: 'Nomor Pokok Wajib Pajak perusahaan'
    },
    {
      category: 'administrative',
      requirement: 'SIUP/TDP sesuai bidang konstruksi',
      evidence: availableEvidence.siup_tdp || [],
      status: availableEvidence.siup_tdp?.length > 0 ? 'available' : 'missing',
      notes: 'Izin usaha perdagangan untuk konstruksi'
    }
  ];

  // Personnel Assessment
  const personnelReqs = SBU_PERSONNEL_REQUIREMENTS[targetClassification.subClassification] || [];
  const personnelEvidence: SbuReadinessEvidence[] = personnelReqs.map(req => ({
    category: 'personnel',
    requirement: `${req.position} (${req.certificationType || req.minimumEducation})`,
    evidence: availableEvidence.personnel?.filter((p: any) =>
      p.position === req.position &&
      p.experience >= req.minimumExperience &&
      (!req.certificationRequired || p.certifications?.includes(req.certificationType))
    ) || [],
    status: (availableEvidence.personnel?.filter((p: any) =>
      p.position === req.position &&
      p.experience >= req.minimumExperience &&
      (!req.certificationRequired || p.certifications?.includes(req.certificationType))
    ) || []).length >= req.quantity ? 'available' : 'missing',
    notes: `Dibutuhkan ${req.quantity} orang dengan pengalaman ${req.minimumExperience} tahun`
  }));

  // Equipment Assessment
  const equipmentReqs = SBU_EQUIPMENT_REQUIREMENTS[targetClassification.subClassification] || [];
  const equipmentEvidence: SbuReadinessEvidence[] = equipmentReqs.map(req => ({
    category: 'equipment',
    requirement: `${req.type} (${req.minimumCapacity || 'standard'})`,
    evidence: availableEvidence.equipment?.filter((e: any) =>
      e.type === req.type &&
      e.quantity >= req.minimumQuantity &&
      e.ownership === req.ownership
    ) || [],
    status: (availableEvidence.equipment?.filter((e: any) =>
      e.type === req.type &&
      e.quantity >= req.minimumQuantity &&
      e.ownership === req.ownership
    ) || []).length > 0 ? 'available' : 'missing',
    notes: `Dibutuhkan ${req.minimumQuantity} unit dengan kepemilikan ${req.ownership}`
  }));

  // Experience Assessment
  const experienceEvidence: SbuReadinessEvidence = {
    category: 'experience',
    requirement: `Pengalaman ${targetClassification.minimumExperience.years} tahun, ${targetClassification.minimumExperience.projects} proyek, nilai ≥ ${targetClassification.minimumExperience.value.toLocaleString('id-ID')} IDR`,
    evidence: availableEvidence.experience || [],
    status: availableEvidence.experience?.length >= targetClassification.minimumExperience.projects ? 'available' : 'missing',
    notes: 'Riwayat proyek yang telah diselesaikan'
  };

  // Financial Assessment
  const financialEvidence: SbuReadinessEvidence = {
    category: 'financial',
    requirement: 'Laporan keuangan audited 2 tahun terakhir',
    evidence: availableEvidence.financial_statements || [],
    status: availableEvidence.financial_statements?.length >= 2 ? 'available' : 'missing',
    notes: 'Laporan keuangan yang telah diaudit'
  };

  evidenceAssessment.push(...adminEvidence, ...personnelEvidence, ...equipmentEvidence, experienceEvidence, financialEvidence);

  // Calculate scores
  const categoryScores = {
    administrative: calculateCategoryScore(adminEvidence),
    technical: 85, // Placeholder - would need technical document assessment
    personnel: calculateCategoryScore(personnelEvidence),
    equipment: calculateCategoryScore(equipmentEvidence),
    experience: calculateCategoryScore([experienceEvidence]),
    financial: calculateCategoryScore([financialEvidence])
  };

  const overallReadiness = Math.round(
    (categoryScores.administrative * 0.2 +
     categoryScores.technical * 0.2 +
     categoryScores.personnel * 0.2 +
     categoryScores.equipment * 0.15 +
     categoryScores.experience * 0.15 +
     categoryScores.financial * 0.1)
  );

  // Identify critical gaps
  const criticalGaps = evidenceAssessment
    .filter(ev => ev.status === 'missing')
    .map(ev => ev.requirement);

  // Generate recommendations
  const recommendedActions = generateSbuRecommendations(evidenceAssessment, targetClassification);

  // Calculate risk level
  const riskLevel = overallReadiness >= 80 ? 'low' :
                   overallReadiness >= 60 ? 'medium' :
                   overallReadiness >= 40 ? 'high' : 'critical';

  // Estimate preparation time and cost
  const missingItems = evidenceAssessment.filter(ev => ev.status !== 'available').length;
  const estimatedPreparationTime = missingItems * 7; // Rough estimate: 1 week per missing item
  const estimatedCost = missingItems * 1000000; // Rough estimate: 1 million IDR per missing item

  return {
    entityId: entity.id,
    applicationType,
    targetClassification,
    assessmentDate: new Date().toISOString(),
    overallReadiness,
    categoryScores,
    evidenceAssessment,
    criticalGaps,
    recommendedActions,
    estimatedPreparationTime,
    estimatedCost,
    riskLevel,
    executiveSummary: {
      currentStatus: `Readiness score: ${overallReadiness}% (${getReadinessLevel(overallReadiness)})`,
      keyStrengths: evidenceAssessment
        .filter(ev => ev.status === 'available')
        .map(ev => ev.requirement)
        .slice(0, 3),
      criticalIssues: criticalGaps.slice(0, 3),
      nextSteps: recommendedActions.slice(0, 3),
      recommendedTimeline: `Estimasi waktu persiapan: ${estimatedPreparationTime} hari`
    }
  };
}

function calculateCategoryScore(evidence: SbuReadinessEvidence[]): number {
  if (evidence.length === 0) return 100;
  const availableCount = evidence.filter(ev => ev.status === 'available').length;
  return Math.round((availableCount / evidence.length) * 100);
}

function generateSbuRecommendations(
  evidence: SbuReadinessEvidence[],
  classification: SbuClassification
): string[] {
  const recommendations: string[] = [];

  const missingAdmin = evidence.filter(ev =>
    ev.category === 'administrative' && ev.status !== 'available'
  );
  if (missingAdmin.length > 0) {
    recommendations.push('Lengkapi dokumen administrasi: Akta, NPWP, SIUP/TDP');
  }

  const missingPersonnel = evidence.filter(ev =>
    ev.category === 'personnel' && ev.status !== 'available'
  );
  if (missingPersonnel.length > 0) {
    recommendations.push(`Recruit personel sesuai persyaratan klasifikasi ${classification.subClassification}`);
    recommendations.push('Pastikan personel memiliki sertifikasi yang diperlukan');
  }

  const missingEquipment = evidence.filter(ev =>
    ev.category === 'equipment' && ev.status !== 'available'
  );
  if (missingEquipment.length > 0) {
    recommendations.push('Siapkan peralatan sesuai spesifikasi klasifikasi');
    recommendations.push('Pastikan status kepemilikan peralatan sesuai ketentuan');
  }

  if (evidence.find(ev => ev.category === 'experience' && ev.status !== 'available')) {
    recommendations.push(`Kumpulkan bukti pengalaman minimal ${classification.minimumExperience.projects} proyek`);
  }

  if (evidence.find(ev => ev.category === 'financial' && ev.status !== 'available')) {
    recommendations.push('Siapkan laporan keuangan audited 2 tahun terakhir');
  }

  recommendations.push('Konsultasikan dengan asesor LPJK untuk validasi akhir');

  return recommendations;
}

function getReadinessLevel(score: number): string {
  if (score >= 80) return 'Siap Mengajukan';
  if (score >= 60) return 'Perlu Perbaikan Minor';
  if (score >= 40) return 'Perlu Perbaikan Mayor';
  return 'Belum Siap';
}

// Utility functions
export function getSbuClassificationByCode(code: string): SbuClassification | undefined {
  return SBU_CLASSIFICATIONS[code];
}

export function getAvailableClassifications(): SbuClassification[] {
  return Object.values(SBU_CLASSIFICATIONS);
}

export function validateSbuApplicationType(
  entity: BusinessEntityProfile,
  applicationType: SbuApplicationType
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check establishment date for renewal
  if (applicationType.type === 'renewal' && !applicationType.previousSbuNumber) {
    issues.push('Nomor SBU sebelumnya diperlukan untuk perpanjangan');
  }

  // Check entity age (minimum 2 years for new applications)
  const establishmentDate = new Date(entity.establishmentDate);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  if (applicationType.type === 'new' && establishmentDate > twoYearsAgo) {
    issues.push('Perusahaan harus berusia minimal 2 tahun untuk pengajuan SBU baru');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}