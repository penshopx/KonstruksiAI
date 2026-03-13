/**
 * Tender Eligibility Checker Library
 * Comprehensive assessment for business entity and personnel eligibility for construction tenders
 * Based on Indonesian procurement regulations and construction certification requirements
 */

export interface TenderDocument {
  id: string;
  title: string;
  content: string;
  requirements: TenderRequirement[];
  projectDetails: {
    sector: string;
    location: string;
    value: number;
    deadline: string;
    owner: string;
  };
}

export interface TenderRequirement {
  id: string;
  category: 'administrative' | 'technical' | 'legal' | 'personnel' | 'certification' | 'experience' | 'financial';
  description: string;
  mandatory: boolean;
  evidenceRequired: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface TenderEligibilityCheck {
  requestId: string;
  businessEntityId: string;
  tenderId: string;
  checkDate: string;
  overallStatus: 'eligible' | 'conditionally_eligible' | 'not_eligible';
  readinessScore: number; // 0-100
  complianceScore: number; // 0-100
  evidenceCompletenessScore: number; // 0-100

  requirementsAnalysis: {
    total: number;
    met: number;
    partial: number;
    unmet: number;
    criticalGaps: number;
  };

  categoryScores: {
    administrative: number;
    technical: number;
    legal: number;
    personnel: number;
    certification: number;
    experience: number;
    financial: number;
  };

  gaps: EligibilityGap[];
  actions: RecommendedAction[];
  personnelAnalysis: PersonnelEligibility[];
  risks: string[];

  executiveSummary: {
    currentStatus: string;
    keyStrengths: string[];
    criticalIssues: string[];
    nextSteps: string[];
    estimatedTimeToEligibility: number; // days
    estimatedCost: number; // IDR
  };

  requiresHumanReview: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface EligibilityGap {
  id: string;
  requirementId: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  currentStatus: string;
  requiredStatus: string;
  estimatedResolutionTime: number; // days
  estimatedCost: number; // IDR
  responsibleParty: string;
  evidenceAvailable: string[];
  evidenceMissing: string[];
}

export interface RecommendedAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'document' | 'personnel' | 'certification' | 'legal' | 'training';
  description: string;
  timeline: string;
  responsibleParty: string;
  dependencies: string[];
  successCriteria: string;
}

export interface PersonnelEligibility {
  personnelId: string;
  name: string;
  position: string;
  requiredForTender: boolean;
  eligibilityStatus: 'eligible' | 'conditionally_eligible' | 'not_eligible';
  certificationsHeld: string[];
  certificationsRequired: string[];
  experienceYears: number;
  experienceRequired: number;
  trainingCompleted: string[];
  trainingRequired: string[];
  gaps: string[];
  replacementNeeded: boolean;
  alternativePersonnel?: string[];
}

// Tender requirement extraction functions
export function extractTenderRequirements(document: TenderDocument): TenderRequirement[] {
  const requirements: TenderRequirement[] = [];

  // Administrative requirements
  requirements.push({
    id: 'admin-1',
    category: 'administrative',
    description: 'Akta Pendirian Perusahaan yang masih berlaku',
    mandatory: true,
    evidenceRequired: ['Akta Pendirian', 'SK Menkumham'],
    priority: 'high'
  });

  requirements.push({
    id: 'admin-2',
    category: 'administrative',
    description: 'NPWP Perusahaan aktif',
    mandatory: true,
    evidenceRequired: ['NPWP'],
    priority: 'high'
  });

  requirements.push({
    id: 'admin-3',
    category: 'administrative',
    description: 'SIUP/TDP sesuai bidang usaha',
    mandatory: true,
    evidenceRequired: ['SIUP', 'TDP'],
    priority: 'high'
  });

  // Legal requirements
  requirements.push({
    id: 'legal-1',
    category: 'legal',
    description: 'Izin usaha yang masih berlaku sesuai sektor',
    mandatory: true,
    evidenceRequired: ['Izin Operasional', 'Izin Sektoral'],
    priority: 'high'
  });

  // Certification requirements
  requirements.push({
    id: 'cert-1',
    category: 'certification',
    description: 'Sertifikat Badan Usaha (SBU) sesuai klasifikasi pekerjaan',
    mandatory: true,
    evidenceRequired: ['SBU'],
    priority: 'high'
  });

  // Personnel requirements
  requirements.push({
    id: 'personnel-1',
    category: 'personnel',
    description: 'Direktur Teknik dengan sertifikasi Ahli Utama',
    mandatory: true,
    evidenceRequired: ['Sertifikat Ahli Utama', 'Pengalaman Proyek'],
    priority: 'high'
  });

  requirements.push({
    id: 'personnel-2',
    category: 'personnel',
    description: 'Kepala Proyek dengan sertifikasi Ahli Madya',
    mandatory: true,
    evidenceRequired: ['Sertifikat Ahli Madya', 'Pengalaman Proyek'],
    priority: 'high'
  });

  // Experience requirements
  requirements.push({
    id: 'exp-1',
    category: 'experience',
    description: `Pengalaman proyek serupa minimal ${Math.ceil(document.projectDetails.value / 1000000000)} miliar`,
    mandatory: true,
    evidenceRequired: ['Daftar Riwayat Proyek', 'Sertifikat Pekerjaan'],
    priority: 'high'
  });

  // Financial requirements
  requirements.push({
    id: 'financial-1',
    category: 'financial',
    description: 'Laporan keuangan audited 2 tahun terakhir',
    mandatory: true,
    evidenceRequired: ['Laporan Keuangan Audited'],
    priority: 'high'
  });

  return requirements;
}

// Main eligibility assessment function
export function assessTenderEligibility(
  businessEntityId: string,
  tenderDocument: TenderDocument,
  personnelIds: string[],
  availableEvidence: Record<string, any>
): TenderEligibilityCheck {
  const requestId = `TEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const requirements = extractTenderRequirements(tenderDocument);

  // Mock data for demonstration - in real implementation, this would come from database
  const mockEntityData = {
    legalStatus: availableEvidence.legalStatus || 'active',
    licenses: availableEvidence.licenses || [],
    certifications: availableEvidence.certifications || [],
    financials: availableEvidence.financials || []
  };

  const mockPersonnelData = personnelIds.map(id => ({
    id,
    name: `Personnel ${id}`,
    position: availableEvidence.personnel?.[id]?.position || 'Unknown',
    certifications: availableEvidence.personnel?.[id]?.certifications || [],
    experience: availableEvidence.personnel?.[id]?.experience || 0,
    training: availableEvidence.personnel?.[id]?.training || []
  }));

  // Analyze requirements compliance
  const requirementsAnalysis = analyzeRequirementsCompliance(requirements, availableEvidence);
  const personnelAnalysis = analyzePersonnelEligibility(requirements, mockPersonnelData);

  // Calculate scores
  const categoryScores = calculateCategoryScores(requirements, availableEvidence);
  const readinessScore = calculateReadinessScore(categoryScores, requirementsAnalysis);
  const complianceScore = calculateComplianceScore(requirementsAnalysis);
  const evidenceCompletenessScore = calculateEvidenceCompleteness(availableEvidence, requirements);

  // Determine overall status
  const overallStatus = determineOverallStatus(readinessScore, requirementsAnalysis);

  // Generate gaps and actions
  const gaps = generateEligibilityGaps(requirements, availableEvidence, mockEntityData, mockPersonnelData);
  const actions = generateRecommendedActions(gaps, requirementsAnalysis);

  // Calculate risks
  const risks = identifyTenderRisks(requirementsAnalysis, personnelAnalysis, mockEntityData);

  return {
    requestId,
    businessEntityId,
    tenderId: tenderDocument.id,
    checkDate: new Date().toISOString(),
    overallStatus,
    readinessScore,
    complianceScore,
    evidenceCompletenessScore,
    requirementsAnalysis,
    categoryScores,
    gaps,
    actions,
    personnelAnalysis,
    risks,
    executiveSummary: {
      currentStatus: `${overallStatus.replace('_', ' ').toUpperCase()} (${readinessScore}% readiness)`,
      keyStrengths: identifyKeyStrengths(requirementsAnalysis, mockEntityData),
      criticalIssues: gaps.filter(g => g.severity === 'critical').map(g => g.description),
      nextSteps: actions.filter(a => a.priority === 'high').map(a => a.description),
      estimatedTimeToEligibility: calculateTimeToEligibility(gaps),
      estimatedCost: calculateCostToEligibility(gaps)
    },
    requiresHumanReview: overallStatus === 'conditionally_eligible' || readinessScore < 70,
    confidenceLevel: evidenceCompletenessScore > 80 ? 'high' : evidenceCompletenessScore > 60 ? 'medium' : 'low'
  };
}

// Helper functions
function analyzeRequirementsCompliance(
  requirements: TenderRequirement[],
  evidence: Record<string, any>
): { total: number; met: number; partial: number; unmet: number; criticalGaps: number } {
  let met = 0;
  let partial = 0;
  let unmet = 0;
  let criticalGaps = 0;

  requirements.forEach(req => {
    const hasEvidence = req.evidenceRequired.some(evType => evidence[evType]?.length > 0);

    if (hasEvidence) {
      if (req.evidenceRequired.every(evType => evidence[evType]?.length > 0)) {
        met++;
      } else {
        partial++;
      }
    } else {
      unmet++;
      if (req.priority === 'high' && req.mandatory) {
        criticalGaps++;
      }
    }
  });

  return {
    total: requirements.length,
    met,
    partial,
    unmet,
    criticalGaps
  };
}

function analyzePersonnelEligibility(
  requirements: TenderRequirement[],
  personnelData: any[]
): PersonnelEligibility[] {
  const personnelReqs = requirements.filter(r => r.category === 'personnel');

  return personnelData.map(person => {
    const requiredCerts = personnelReqs.flatMap(r => r.evidenceRequired);
    const hasRequiredCerts = requiredCerts.some(cert => person.certifications.includes(cert));

    const eligibilityStatus = hasRequiredCerts && person.experience >= 5 ? 'eligible' :
                             hasRequiredCerts || person.experience >= 3 ? 'conditionally_eligible' : 'not_eligible';

    return {
      personnelId: person.id,
      name: person.name,
      position: person.position,
      requiredForTender: true,
      eligibilityStatus,
      certificationsHeld: person.certifications,
      certificationsRequired: requiredCerts,
      experienceYears: person.experience,
      experienceRequired: 5,
      trainingCompleted: person.training,
      trainingRequired: ['K3', 'Teknis'],
      gaps: eligibilityStatus !== 'eligible' ? ['Sertifikasi tambahan', 'Pengalaman lebih banyak'] : [],
      replacementNeeded: eligibilityStatus === 'not_eligible'
    };
  });
}

function calculateCategoryScores(
  requirements: TenderRequirement[],
  evidence: Record<string, any>
): {
  administrative: number;
  technical: number;
  legal: number;
  personnel: number;
  certification: number;
  experience: number;
  financial: number;
} {
  const categories = ['administrative', 'technical', 'legal', 'personnel', 'certification', 'experience', 'financial'];

  const scores: Record<string, number> = {};
  categories.forEach(category => {
    const categoryReqs = requirements.filter(r => r.category === category);
    if (categoryReqs.length === 0) {
      scores[category] = 100;
      return;
    }

    const met = categoryReqs.filter(req =>
      req.evidenceRequired.every(evType => evidence[evType]?.length > 0)
    ).length;

    scores[category] = Math.round((met / categoryReqs.length) * 100);
  });

  return {
    administrative: scores.administrative || 100,
    technical: scores.technical || 100,
    legal: scores.legal || 100,
    personnel: scores.personnel || 100,
    certification: scores.certification || 100,
    experience: scores.experience || 100,
    financial: scores.financial || 100
  };
}

function calculateReadinessScore(
  categoryScores: Record<string, number>,
  analysis: any
): number {
  // Weighted scoring: administrative and legal are most important
  const weights = {
    administrative: 0.2,
    legal: 0.2,
    certification: 0.15,
    personnel: 0.15,
    experience: 0.15,
    technical: 0.1,
    financial: 0.05
  };

  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([category, weight]) => {
    totalScore += (categoryScores[category] || 0) * weight;
    totalWeight += weight;
  });

  return Math.round(totalScore / totalWeight);
}

function calculateComplianceScore(analysis: any): number {
  const { met, partial, unmet, total } = analysis;
  return Math.round(((met + partial * 0.5) / total) * 100);
}

function calculateEvidenceCompleteness(
  evidence: Record<string, any>,
  requirements: TenderRequirement[]
): number {
  const allRequiredEvidence = requirements.flatMap(r => r.evidenceRequired);
  const uniqueEvidence = [...new Set(allRequiredEvidence)];
  const availableEvidence = uniqueEvidence.filter(evType => evidence[evType]?.length > 0);

  return Math.round((availableEvidence.length / uniqueEvidence.length) * 100);
}

function determineOverallStatus(
  readinessScore: number,
  analysis: any
): 'eligible' | 'conditionally_eligible' | 'not_eligible' {
  if (readinessScore >= 80 && analysis.criticalGaps === 0) {
    return 'eligible';
  } else if (readinessScore >= 60 || analysis.criticalGaps <= 2) {
    return 'conditionally_eligible';
  } else {
    return 'not_eligible';
  }
}

function generateEligibilityGaps(
  requirements: TenderRequirement[],
  evidence: Record<string, any>,
  entityData: any,
  personnelData: any[]
): EligibilityGap[] {
  const gaps: EligibilityGap[] = [];

  requirements.forEach(req => {
    const availableEvidence = req.evidenceRequired.filter(evType => evidence[evType]?.length > 0);
    const missingEvidence = req.evidenceRequired.filter(evType => !evidence[evType]?.length);

    if (missingEvidence.length > 0) {
      const severity = req.mandatory && req.priority === 'high' ? 'critical' :
                      req.mandatory ? 'high' : 'medium';

      gaps.push({
        id: `gap-${req.id}`,
        requirementId: req.id,
        category: req.category,
        severity,
        description: req.description,
        impact: severity === 'critical' ? 'Berisiko gugur dari proses tender' :
               severity === 'high' ? 'Perlu klarifikasi tambahan' : 'Tidak kritikal',
        currentStatus: `Evidence available: ${availableEvidence.join(', ')}`,
        requiredStatus: `All required: ${req.evidenceRequired.join(', ')}`,
        estimatedResolutionTime: severity === 'critical' ? 30 : severity === 'high' ? 14 : 7,
        estimatedCost: severity === 'critical' ? 5000000 : severity === 'high' ? 2000000 : 500000,
        responsibleParty: 'Legal/Compliance Team',
        evidenceAvailable: availableEvidence,
        evidenceMissing: missingEvidence
      });
    }
  });

  return gaps;
}

function generateRecommendedActions(gaps: EligibilityGap[], analysis: any): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  // Sort gaps by severity and create actions
  const sortedGaps = gaps.sort((a, b) => {
    const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  sortedGaps.slice(0, 5).forEach((gap, index) => {
    actions.push({
      id: `action-${index + 1}`,
      priority: gap.severity === 'critical' ? 'high' : gap.severity === 'high' ? 'high' : 'medium',
      category: gap.category as any,
      description: `Lengkapi ${gap.description.toLowerCase()}`,
      timeline: `${gap.estimatedResolutionTime} hari`,
      responsibleParty: gap.responsibleParty,
      dependencies: [],
      successCriteria: `Evidence lengkap untuk ${gap.evidenceMissing.join(', ')}`
    });
  });

  // Add general actions
  if (analysis.unmet > 0) {
    actions.push({
      id: 'action-general-1',
      priority: 'high',
      category: 'document',
      description: 'Audit menyeluruh dokumen perusahaan dan kumpulkan eviden yang kurang',
      timeline: '7 hari',
      responsibleParty: 'Compliance Team',
      dependencies: [],
      successCriteria: 'Semua dokumen utama terkumpul dan tervalidasi'
    });
  }

  if (analysis.criticalGaps > 0) {
    actions.push({
      id: 'action-general-2',
      priority: 'high',
      category: 'certification',
      description: 'Konsultasikan dengan asesor LPJK untuk gap sertifikasi badan usaha',
      timeline: '3 hari',
      responsibleParty: 'Management',
      dependencies: ['Audit dokumen'],
      successCriteria: 'Jalur perbaikan sertifikasi jelas'
    });
  }

  return actions;
}

function identifyTenderRisks(analysis: any, personnelAnalysis: PersonnelEligibility[], entityData: any): string[] {
  const risks: string[] = [];

  if (analysis.criticalGaps > 0) {
    risks.push('Risiko gugur pada evaluasi administrasi');
  }

  if (analysis.unmet > 2) {
    risks.push('Risiko penolakan karena persyaratan tidak terpenuhi');
  }

  const ineligiblePersonnel = personnelAnalysis.filter(p => p.eligibilityStatus === 'not_eligible');
  if (ineligiblePersonnel.length > 0) {
    risks.push(`Risiko lemah pada evaluasi personel (${ineligiblePersonnel.length} personel tidak memenuhi)`);
  }

  if (!entityData.financials?.length) {
    risks.push('Risiko penilaian finansial karena laporan keuangan belum tersedia');
  }

  return risks;
}

function identifyKeyStrengths(analysis: any, entityData: any): string[] {
  const strengths: string[] = [];

  if (analysis.met > analysis.total * 0.7) {
    strengths.push('Kebanyakan persyaratan sudah terpenuhi');
  }

  if (entityData.certifications?.length > 0) {
    strengths.push('Sertifikasi badan usaha sudah tersedia');
  }

  if (entityData.licenses?.some((l: any) => l.status === 'active')) {
    strengths.push('Legalitas dan perizinan dalam kondisi baik');
  }

  return strengths;
}

function calculateTimeToEligibility(gaps: EligibilityGap[]): number {
  return Math.max(...gaps.map(g => g.estimatedResolutionTime), 7);
}

function calculateCostToEligibility(gaps: EligibilityGap[]): number {
  return gaps.reduce((total, gap) => total + gap.estimatedCost, 0);
}

// Utility functions
export function createMockTenderDocument(): TenderDocument {
  return {
    id: 'tender-001',
    title: 'Tender Pembangunan Gardu Induk 150 kV',
    content: 'Dokumen tender untuk pembangunan gardu induk',
    requirements: [],
    projectDetails: {
      sector: 'ketenagalistrikan',
      location: 'Jawa Barat',
      value: 50000000000, // 50 billion IDR
      deadline: '2024-12-31',
      owner: 'PT PLN'
    }
  };
}