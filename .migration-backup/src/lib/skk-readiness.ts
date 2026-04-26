/**
 * SKK (Sertifikat Keahlian Kerja) Readiness Library
 * Comprehensive assessment for construction workforce certification
 * Based on SK Dirjen Bina Konstruksi No. 114 Tahun 2024
 */

export interface WorkforceProfile {
  id: string;
  name: string;
  nik: string;
  birthDate: string;
  education: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  employer: string;
  joinDate: string;
}

export interface SkkApplicationType {
  type: 'new' | 'renewal' | 'update' | 'remediation';
  previousSkkNumber?: string;
  expiryDate?: string;
  changeReason?: string;
}

export interface JobPosition {
  code: string; // e.g., "01.01.01"
  name: string;
  level: 'Operator' | 'Ahli Muda' | 'Ahli Madya' | 'Ahli Utama';
  competencyUnit: string;
  sector: string;
  description: string;
  minimumRequirements: {
    education: string;
    experience: number; // years
    trainingHours: number;
    certification?: string[];
  };
}

export interface CompetencyEvidence {
  category: 'education' | 'experience' | 'training' | 'certification' | 'assessment' | 'portfolio';
  requirement: string;
  evidence: string[];
  status: 'available' | 'partial' | 'missing';
  notes: string;
}

export interface SkkReadinessAssessment {
  personnelId: string;
  applicationType: SkkApplicationType;
  targetPosition: JobPosition;
  assessmentDate: string;
  overallReadiness: number; // 0-100
  categoryScores: {
    education: number;
    experience: number;
    training: number;
    certification: number;
    assessment: number;
    portfolio: number;
  };
  competencyEvidence: CompetencyEvidence[];
  criticalGaps: string[];
  recommendedActions: RecommendedAction[];
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

  readinessBreakdown: {
    education: ReadinessItem;
    experience: ReadinessItem;
    training: ReadinessItem;
    certification: ReadinessItem;
    assessment: ReadinessItem;
    portfolio: ReadinessItem;
  };
}

export interface ReadinessItem {
  requirement: string;
  current: string;
  required: string;
  status: 'met' | 'partial' | 'not_met';
  score: number;
  evidence: string[];
  notes: string;
}

export interface RecommendedAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'training' | 'certification' | 'experience' | 'assessment' | 'documentation';
  description: string;
  timeline: string;
  responsibleParty: string;
  dependencies: string[];
  successCriteria: string;
}

// SKK Job Positions based on SK Dirjen Bina Konstruksi No. 114 Tahun 2024
export const SKK_JOB_POSITIONS: Record<string, JobPosition> = {
  '01.01.01': {
    code: '01.01.01',
    name: 'Operator Alat Berat',
    level: 'Operator',
    competencyUnit: 'CU-01-01-01',
    sector: 'konstruksi',
    description: 'Operator excavator, bulldozer, dan alat berat beroda',
    minimumRequirements: {
      education: 'SMA/SMK',
      experience: 1,
      trainingHours: 80,
      certification: ['Sertifikat Operator Alat Berat']
    }
  },
  '02.01.01': {
    code: '02.01.01',
    name: 'Pengawas Lapangan',
    level: 'Ahli Muda',
    competencyUnit: 'CU-02-01-01',
    sector: 'konstruksi',
    description: 'Pengawas pelaksanaan konstruksi di lapangan',
    minimumRequirements: {
      education: 'D3 Teknik Sipil',
      experience: 2,
      trainingHours: 120,
      certification: ['Sertifikat Pengawas Lapangan']
    }
  },
  '03.01.01': {
    code: '03.01.01',
    name: 'Kepala Proyek',
    level: 'Ahli Madya',
    competencyUnit: 'CU-03-01-01',
    sector: 'konstruksi',
    description: 'Penanggung jawab pelaksanaan proyek konstruksi',
    minimumRequirements: {
      education: 'S1 Teknik Sipil',
      experience: 5,
      trainingHours: 200,
      certification: ['Sertifikat Kepala Proyek', 'Sertifikat K3']
    }
  },
  '04.01.01': {
    code: '04.01.01',
    name: 'Direktur Teknik',
    level: 'Ahli Utama',
    competencyUnit: 'CU-04-01-01',
    sector: 'konstruksi',
    description: 'Penanggung jawab teknis perusahaan konstruksi',
    minimumRequirements: {
      education: 'S1 Teknik Sipil',
      experience: 10,
      trainingHours: 300,
      certification: ['Sertifikat Ahli Utama Teknik Sipil', 'Sertifikat Manajemen Konstruksi']
    }
  },
  '05.01.01': {
    code: '05.01.01',
    name: 'Tenaga Ahli Struktur',
    level: 'Ahli Madya',
    competencyUnit: 'CU-05-01-01',
    sector: 'konstruksi',
    description: 'Perencana dan perancang struktur bangunan',
    minimumRequirements: {
      education: 'S1 Teknik Sipil',
      experience: 7,
      trainingHours: 250,
      certification: ['Sertifikat Ahli Struktur', 'Sertifikat Software Struktur']
    }
  },
  '06.01.01': {
    code: '06.01.01',
    name: 'Tenaga Ahli Elektrikal',
    level: 'Ahli Madya',
    competencyUnit: 'CU-06-01-01',
    sector: 'konstruksi',
    description: 'Perencana sistem elektrikal bangunan',
    minimumRequirements: {
      education: 'S1 Teknik Elektro',
      experience: 6,
      trainingHours: 220,
      certification: ['Sertifikat Ahli Elektrikal', 'Sertifikat K3 Listrik']
    }
  },
  '07.01.01': {
    code: '07.01.01',
    name: 'Tenaga Ahli MEP',
    level: 'Ahli Muda',
    competencyUnit: 'CU-07-01-01',
    sector: 'konstruksi',
    description: 'Perencana sistem MEP (Mechanical, Electrical, Plumbing)',
    minimumRequirements: {
      education: 'D4 Teknik Elektro/Mesin',
      experience: 3,
      trainingHours: 150,
      certification: ['Sertifikat MEP', 'Sertifikat Plumbing']
    }
  }
};

// Assessment Functions
export function assessSkkReadiness(
  workforce: WorkforceProfile,
  applicationType: SkkApplicationType,
  targetPosition: JobPosition,
  availableEvidence: Record<string, any>
): SkkReadinessAssessment {
  const competencyEvidence: CompetencyEvidence[] = [];

  // Education Assessment
  const educationEvidence: CompetencyEvidence = {
    category: 'education',
    requirement: targetPosition.minimumRequirements.education,
    evidence: availableEvidence.education || [],
    status: checkEducationCompliance(workforce.education, targetPosition.minimumRequirements.education),
    notes: 'Pendidikan formal yang sesuai jabatan'
  };

  // Experience Assessment
  const experienceEvidence: CompetencyEvidence = {
    category: 'experience',
    requirement: `${targetPosition.minimumRequirements.experience} tahun pengalaman`,
    evidence: availableEvidence.experience || [],
    status: checkExperienceCompliance(availableEvidence.experience_years || 0, targetPosition.minimumRequirements.experience),
    notes: 'Pengalaman kerja di bidang yang relevan'
  };

  // Training Assessment
  const trainingEvidence: CompetencyEvidence = {
    category: 'training',
    requirement: `${targetPosition.minimumRequirements.trainingHours} jam pelatihan`,
    evidence: availableEvidence.training || [],
    status: checkTrainingCompliance(availableEvidence.training_hours || 0, targetPosition.minimumRequirements.trainingHours),
    notes: 'Pelatihan kompetensi yang relevan'
  };

  // Certification Assessment
  const requiredCerts = targetPosition.minimumRequirements.certification || [];
  const certificationEvidence: CompetencyEvidence = {
    category: 'certification',
    requirement: requiredCerts.join(', '),
    evidence: availableEvidence.certifications || [],
    status: checkCertificationCompliance(availableEvidence.certifications || [], requiredCerts),
    notes: 'Sertifikat kompetensi yang diperlukan'
  };

  // Assessment/Portfolio Assessment
  const assessmentEvidence: CompetencyEvidence = {
    category: 'assessment',
    requirement: 'Hasil assessment kompetensi',
    evidence: availableEvidence.assessment || [],
    status: availableEvidence.assessment?.length > 0 ? 'available' : 'missing',
    notes: 'Penilaian kompetensi dari LSP'
  };

  const portfolioEvidence: CompetencyEvidence = {
    category: 'portfolio',
    requirement: 'Portofolio pekerjaan',
    evidence: availableEvidence.portfolio || [],
    status: availableEvidence.portfolio?.length > 0 ? 'available' : 'missing',
    notes: 'Dokumentasi pekerjaan dan pencapaian'
  };

  competencyEvidence.push(
    educationEvidence,
    experienceEvidence,
    trainingEvidence,
    certificationEvidence,
    assessmentEvidence,
    portfolioEvidence
  );

  // Calculate scores
  const categoryScores = {
    education: educationEvidence.status === 'available' ? 100 : educationEvidence.status === 'partial' ? 50 : 0,
    experience: experienceEvidence.status === 'available' ? 100 : experienceEvidence.status === 'partial' ? 50 : 0,
    training: trainingEvidence.status === 'available' ? 100 : trainingEvidence.status === 'partial' ? 50 : 0,
    certification: certificationEvidence.status === 'available' ? 100 : certificationEvidence.status === 'partial' ? 50 : 0,
    assessment: assessmentEvidence.status === 'available' ? 100 : 0,
    portfolio: portfolioEvidence.status === 'available' ? 100 : 0
  };

  const overallReadiness = Math.round(
    (categoryScores.education * 0.15 +
     categoryScores.experience * 0.25 +
     categoryScores.training * 0.20 +
     categoryScores.certification * 0.25 +
     categoryScores.assessment * 0.10 +
     categoryScores.portfolio * 0.05)
  );

  // Create readiness breakdown
  const readinessBreakdown = {
    education: createReadinessItem('Pendidikan', workforce.education, targetPosition.minimumRequirements.education, educationEvidence),
    experience: createReadinessItem('Pengalaman', `${availableEvidence.experience_years || 0} tahun`, `${targetPosition.minimumRequirements.experience} tahun`, experienceEvidence),
    training: createReadinessItem('Pelatihan', `${availableEvidence.training_hours || 0} jam`, `${targetPosition.minimumRequirements.trainingHours} jam`, trainingEvidence),
    certification: createReadinessItem('Sertifikasi', (availableEvidence.certifications || []).join(', '), requiredCerts.join(', '), certificationEvidence),
    assessment: createReadinessItem('Assessment', availableEvidence.assessment?.length > 0 ? 'Ada' : 'Tidak ada', 'Hasil assessment LSP', assessmentEvidence),
    portfolio: createReadinessItem('Portofolio', availableEvidence.portfolio?.length > 0 ? 'Ada' : 'Tidak ada', 'Dokumentasi pekerjaan', portfolioEvidence)
  };

  // Identify critical gaps
  const criticalGaps = competencyEvidence
    .filter(ev => ev.status === 'missing')
    .map(ev => ev.requirement);

  // Generate recommendations
  const recommendedActions = generateSkkRecommendations(competencyEvidence, targetPosition);

  // Calculate risk level
  const riskLevel = overallReadiness >= 80 ? 'low' :
                   overallReadiness >= 60 ? 'medium' :
                   overallReadiness >= 40 ? 'high' : 'critical';

  // Estimate preparation time and cost
  const missingItems = competencyEvidence.filter(ev => ev.status !== 'available').length;
  const estimatedPreparationTime = missingItems * 14; // Rough estimate: 2 weeks per missing competency
  const estimatedCost = missingItems * 2000000; // Rough estimate: 2 million IDR per competency

  return {
    personnelId: workforce.id,
    applicationType,
    targetPosition,
    assessmentDate: new Date().toISOString(),
    overallReadiness,
    categoryScores,
    competencyEvidence,
    criticalGaps,
    recommendedActions,
    estimatedPreparationTime,
    estimatedCost,
    riskLevel,
    executiveSummary: {
      currentStatus: `${overallReadiness}% readiness untuk ${targetPosition.name} (${getReadinessLevel(overallReadiness)})`,
      keyStrengths: competencyEvidence
        .filter(ev => ev.status === 'available')
        .map(ev => ev.requirement)
        .slice(0, 3),
      criticalIssues: criticalGaps.slice(0, 3),
      nextSteps: recommendedActions.filter(a => a.priority === 'high').map(a => a.description),
      recommendedTimeline: `Estimasi waktu persiapan: ${estimatedPreparationTime} hari`
    },
    readinessBreakdown
  };
}

// Helper functions
function checkEducationCompliance(actual: string, required: string): 'available' | 'partial' | 'missing' {
  if (!actual || !required) return 'missing';

  const educationLevels = ['SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];
  const actualLevel = educationLevels.findIndex(level => actual.toLowerCase().includes(level.toLowerCase()));
  const requiredLevel = educationLevels.findIndex(level => required.toLowerCase().includes(level.toLowerCase()));

  if (actualLevel >= requiredLevel) return 'available';
  if (actualLevel >= requiredLevel - 1) return 'partial'; // Close enough
  return 'missing';
}

function checkExperienceCompliance(actualYears: number, requiredYears: number): 'available' | 'partial' | 'missing' {
  if (actualYears >= requiredYears) return 'available';
  if (actualYears >= requiredYears * 0.7) return 'partial'; // At least 70%
  return 'missing';
}

function checkTrainingCompliance(actualHours: number, requiredHours: number): 'available' | 'partial' | 'missing' {
  if (actualHours >= requiredHours) return 'available';
  if (actualHours >= requiredHours * 0.8) return 'partial'; // At least 80%
  return 'missing';
}

function checkCertificationCompliance(actualCerts: string[], requiredCerts: string[]): 'available' | 'partial' | 'missing' {
  if (!requiredCerts.length) return 'available';

  const matchedCerts = requiredCerts.filter(reqCert =>
    actualCerts.some(actualCert =>
      actualCert.toLowerCase().includes(reqCert.toLowerCase().split(' ')[0]) // Basic matching
    )
  );

  if (matchedCerts.length === requiredCerts.length) return 'available';
  if (matchedCerts.length > 0) return 'partial';
  return 'missing';
}

function createReadinessItem(label: string, current: string, required: string, evidence: CompetencyEvidence): ReadinessItem {
  return {
    requirement: `${label}: ${required}`,
    current: current || 'Tidak tersedia',
    required,
    status: evidence.status === 'available' ? 'met' :
            evidence.status === 'partial' ? 'partial' : 'not_met',
    score: evidence.status === 'available' ? 100 :
           evidence.status === 'partial' ? 50 : 0,
    evidence: evidence.evidence,
    notes: evidence.notes
  };
}

function generateSkkRecommendations(
  evidence: CompetencyEvidence[],
  position: JobPosition
): RecommendedAction[] {
  const recommendations: RecommendedAction[] = [];

  const missingEducation = evidence.find(ev => ev.category === 'education' && ev.status !== 'available');
  if (missingEducation) {
    recommendations.push({
      id: 'rec-education',
      priority: 'high',
      category: 'training',
      description: `Tingkatkan pendidikan ke level ${position.minimumRequirements.education}`,
      timeline: '6-12 bulan',
      responsibleParty: 'Individu',
      dependencies: [],
      successCriteria: `Mendapatkan ijazah ${position.minimumRequirements.education}`
    });
  }

  const missingExperience = evidence.find(ev => ev.category === 'experience' && ev.status !== 'available');
  if (missingExperience) {
    recommendations.push({
      id: 'rec-experience',
      priority: 'high',
      category: 'experience',
      description: `Peroleh pengalaman ${position.minimumRequirements.experience} tahun di bidang terkait`,
      timeline: `${position.minimumRequirements.experience * 12} bulan`,
      responsibleParty: 'Individu/Perusahaan',
      dependencies: [],
      successCriteria: `Memiliki ${position.minimumRequirements.experience} tahun pengalaman terverifikasi`
    });
  }

  const missingTraining = evidence.find(ev => ev.category === 'training' && ev.status !== 'available');
  if (missingTraining) {
    recommendations.push({
      id: 'rec-training',
      priority: 'medium',
      category: 'training',
      description: `Ikuti pelatihan kompetensi selama ${position.minimumRequirements.trainingHours} jam`,
      timeline: '3-6 bulan',
      responsibleParty: 'Individu',
      dependencies: [],
      successCriteria: `Menyelesaikan ${position.minimumRequirements.trainingHours} jam pelatihan terverifikasi`
    });
  }

  const missingCertification = evidence.find(ev => ev.category === 'certification' && ev.status !== 'available');
  if (missingCertification) {
    recommendations.push({
      id: 'rec-certification',
      priority: 'high',
      category: 'certification',
      description: `Dapatkan sertifikat kompetensi: ${(position.minimumRequirements.certification || []).join(', ')}`,
      timeline: '6-12 bulan',
      responsibleParty: 'Individu/LSP',
      dependencies: ['Penyelesaian pelatihan'],
      successCriteria: `Memperoleh semua sertifikat yang diperlukan`
    });
  }

  const missingAssessment = evidence.find(ev => ev.category === 'assessment' && ev.status !== 'available');
  if (missingAssessment) {
    recommendations.push({
      id: 'rec-assessment',
      priority: 'medium',
      category: 'assessment',
      description: 'Lakukan assessment kompetensi di LSP terakreditasi',
      timeline: '1-3 bulan',
      responsibleParty: 'Individu/LSP',
      dependencies: ['Penyelesaian pelatihan dan sertifikasi'],
      successCriteria: 'Lulus assessment kompetensi LSP'
    });
  }

  const missingPortfolio = evidence.find(ev => ev.category === 'portfolio' && ev.status !== 'available');
  if (missingPortfolio) {
    recommendations.push({
      id: 'rec-portfolio',
      priority: 'low',
      category: 'documentation',
      description: 'Susun portofolio pekerjaan dan pencapaian',
      timeline: '1 bulan',
      responsibleParty: 'Individu',
      dependencies: [],
      successCriteria: 'Portofolio lengkap dengan dokumentasi pekerjaan'
    });
  }

  return recommendations;
}

function getReadinessLevel(score: number): string {
  if (score >= 80) return 'Siap Mengajukan';
  if (score >= 60) return 'Perlu Perbaikan Minor';
  if (score >= 40) return 'Perlu Perbaikan Mayor';
  return 'Belum Siap';
}

// Utility functions
export function getSkkPositionByCode(code: string): JobPosition | undefined {
  return SKK_JOB_POSITIONS[code];
}

export function getAvailableSkkPositions(): JobPosition[] {
  return Object.values(SKK_JOB_POSITIONS);
}

export function validateSkkApplicationType(
  workforce: WorkforceProfile,
  applicationType: SkkApplicationType
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check minimum age (18 years)
  const age = new Date().getFullYear() - new Date(workforce.birthDate).getFullYear();
  if (age < 18) {
    issues.push('Usia minimal 18 tahun untuk mendapatkan SKK');
  }

  // Check education level
  if (!workforce.education) {
    issues.push('Pendidikan formal harus dicantumkan');
  }

  // Check for renewal
  if (applicationType.type === 'renewal' && !applicationType.previousSkkNumber) {
    issues.push('Nomor SKK sebelumnya diperlukan untuk perpanjangan');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}