/**
 * Workforce Assignment Eligibility Library
 * Advanced personnel matching for project assignments based on competency, certification, and availability
 * Integrates with SKK readiness and project requirements for optimal workforce allocation
 */

export interface ProjectPosition {
  id: string;
  projectId: string;
  positionName: string;
  positionCode: string; // SKK position code
  requiredCount: number;
  skillRequirements: SkillRequirement[];
  certificationRequirements: CertificationRequirement[];
  experienceRequirements: ExperienceRequirement[];
  availabilityRequirements: AvailabilityRequirement[];
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  location: string;
  workType: 'onsite' | 'remote' | 'hybrid';
}

export interface SkillRequirement {
  skillName: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  mandatory: boolean;
  yearsRequired: number;
}

export interface CertificationRequirement {
  certificationType: string;
  certificationLevel: string;
  mandatory: boolean;
  expiryBuffer: number; // months before expiry to be considered valid
}

export interface ExperienceRequirement {
  domain: string;
  yearsRequired: number;
  projectTypes: string[];
  mandatory: boolean;
}

export interface AvailabilityRequirement {
  availabilityType: 'full_time' | 'part_time' | 'contract';
  workHoursPerWeek: number;
  noticePeriodDays: number;
  locationPreference: string[];
}

export interface PersonnelProfile {
  id: string;
  name: string;
  currentPosition: string;
  skills: PersonnelSkill[];
  certifications: PersonnelCertification[];
  experience: PersonnelExperience[];
  availability: PersonnelAvailability;
  location: string;
  workPreferences: {
    workType: 'onsite' | 'remote' | 'hybrid';
    maxWorkHoursPerWeek: number;
    noticePeriodDays: number;
    willingToRelocate: boolean;
  };
  performanceRating: number; // 1-5 scale
  lastAssignmentDate?: string;
  skkReadinessScore: number; // 0-100 from SKK assessment
}

export interface PersonnelSkill {
  skillName: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsedDate: string;
  verified: boolean;
}

export interface PersonnelCertification {
  certificationType: string;
  certificationLevel: string;
  issuedDate: string;
  expiryDate: string;
  issuingAuthority: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
}

export interface PersonnelExperience {
  domain: string;
  yearsOfExperience: number;
  projectCount: number;
  projectTypes: string[];
  lastProjectDate: string;
  keyAchievements: string[];
}

export interface PersonnelAvailability {
  status: 'available' | 'partially_available' | 'unavailable' | 'on_leave';
  availableFrom: string;
  availableUntil?: string;
  currentCommitments: CurrentCommitment[];
  maxConcurrentProjects: number;
}

export interface CurrentCommitment {
  projectId: string;
  projectName: string;
  role: string;
  commitmentPercentage: number; // 0-100
  endDate: string;
}

export interface AssignmentMatch {
  personnelId: string;
  personnelName: string;
  positionId: string;
  positionName: string;
  matchScore: number; // 0-100
  matchBreakdown: {
    skills: number;
    certifications: number;
    experience: number;
    availability: number;
    location: number;
  };
  compatibilityLevel: 'excellent' | 'good' | 'fair' | 'poor';
  strengths: string[];
  gaps: string[];
  recommendedActions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedUtilization: number; // 0-100
}

export interface AssignmentRecommendation {
  positionId: string;
  positionName: string;
  requiredCount: number;
  availableCandidates: AssignmentMatch[];
  bestMatches: AssignmentMatch[];
  alternativeMatches: AssignmentMatch[];
  unfilledPositions: number;
  gapAnalysis: {
    skillGaps: string[];
    certificationGaps: string[];
    experienceGaps: string[];
    availabilityGaps: string[];
  };
  recommendations: {
    primaryCandidates: AssignmentMatch[];
    backupCandidates: AssignmentMatch[];
    trainingRecommendations: string[];
    hiringRecommendations: string[];
  };
}

export interface WorkforceAssignmentResult {
  projectId: string;
  projectName: string;
  analysisDate: string;
  overallAssignmentScore: number; // 0-100
  positionRecommendations: AssignmentRecommendation[];
  summary: {
    totalPositions: number;
    filledPositions: number;
    partiallyFilledPositions: number;
    unfilledPositions: number;
    overallReadiness: number;
    criticalGaps: string[];
    recommendedActions: string[];
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    mitigationStrategies: string[];
  };
  timeline: {
    immediateActions: string[];
    shortTermActions: string[];
    longTermActions: string[];
  };
}

// Matching Algorithms
export function calculateAssignmentMatch(
  personnel: PersonnelProfile,
  position: ProjectPosition
): AssignmentMatch {
  const matchBreakdown = {
    skills: calculateSkillsMatch(personnel.skills, position.skillRequirements),
    certifications: calculateCertificationsMatch(personnel.certifications, position.certificationRequirements),
    experience: calculateExperienceMatch(personnel.experience, position.experienceRequirements),
    availability: calculateAvailabilityMatch(personnel.availability, position.availabilityRequirements, position),
    location: calculateLocationMatch(personnel.location, position.location, personnel.workPreferences)
  };

  const matchScore = Math.round(
    (matchBreakdown.skills * 0.25) +
    (matchBreakdown.certifications * 0.25) +
    (matchBreakdown.experience * 0.25) +
    (matchBreakdown.availability * 0.15) +
    (matchBreakdown.location * 0.10)
  );

  const compatibilityLevel = matchScore >= 80 ? 'excellent' :
                            matchScore >= 60 ? 'good' :
                            matchScore >= 40 ? 'fair' : 'poor';

  const { strengths, gaps } = analyzeMatchStrengthsAndGaps(personnel, position, matchBreakdown);
  const recommendedActions = generateAssignmentActions(gaps, personnel, position);
  const riskLevel = assessAssignmentRisk(matchBreakdown, gaps, position.priority);

  // Estimate utilization based on availability and current commitments
  const estimatedUtilization = calculateEstimatedUtilization(personnel.availability, position);

  return {
    personnelId: personnel.id,
    personnelName: personnel.name,
    positionId: position.id,
    positionName: position.positionName,
    matchScore,
    matchBreakdown,
    compatibilityLevel,
    strengths,
    gaps,
    recommendedActions,
    riskLevel,
    estimatedUtilization
  };
}

function calculateSkillsMatch(
  personnelSkills: PersonnelSkill[],
  requiredSkills: SkillRequirement[]
): number {
  if (requiredSkills.length === 0) return 100;

  let totalScore = 0;
  let mandatoryMet = 0;
  let optionalMet = 0;

  requiredSkills.forEach(req => {
    const personnelSkill = personnelSkills.find(s =>
      s.skillName.toLowerCase() === req.skillName.toLowerCase()
    );

    if (personnelSkill) {
      let skillScore = 0;

      // Proficiency level matching
      const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const reqLevelIndex = proficiencyLevels.indexOf(req.proficiencyLevel);
      const personnelLevelIndex = proficiencyLevels.indexOf(personnelSkill.proficiencyLevel);

      if (personnelLevelIndex >= reqLevelIndex) {
        skillScore = 100;
      } else if (personnelLevelIndex >= reqLevelIndex - 1) {
        skillScore = 75; // Close enough
      } else {
        skillScore = 50; // Below requirement
      }

      // Experience bonus
      if (personnelSkill.yearsOfExperience >= req.yearsRequired) {
        skillScore += 10;
      }

      // Verification bonus
      if (personnelSkill.verified) {
        skillScore += 5;
      }

      if (req.mandatory) {
        mandatoryMet++;
        totalScore += skillScore;
      } else {
        optionalMet++;
        totalScore += skillScore * 0.5; // Optional skills weighted less
      }
    } else if (req.mandatory) {
      totalScore += 0; // Mandatory skill missing
    }
  });

  const maxScore = requiredSkills.reduce((sum, req) =>
    sum + (req.mandatory ? 100 : 50), 0
  );

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
}

function calculateCertificationsMatch(
  personnelCerts: PersonnelCertification[],
  requiredCerts: CertificationRequirement[]
): number {
  if (requiredCerts.length === 0) return 100;

  let totalScore = 0;

  requiredCerts.forEach(req => {
    const personnelCert = personnelCerts.find(c =>
      c.certificationType.toLowerCase().includes(req.certificationType.toLowerCase()) &&
      c.certificationLevel.toLowerCase().includes(req.certificationLevel.toLowerCase())
    );

    if (personnelCert) {
      let certScore = 70; // Base score for having certification

      // Check expiry
      const expiryDate = new Date(personnelCert.expiryDate);
      const now = new Date();
      const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (monthsUntilExpiry > req.expiryBuffer) {
        certScore += 20; // Well within buffer
      } else if (monthsUntilExpiry > 0) {
        certScore += 10; // Within buffer but close
      } else {
        certScore = 30; // Expired
      }

      // Verification status
      if (personnelCert.verificationStatus === 'verified') {
        certScore += 10;
      }

      totalScore += req.mandatory ? certScore : certScore * 0.7;
    } else if (req.mandatory) {
      totalScore += 0; // Mandatory certification missing
    }
  });

  const maxScore = requiredCerts.reduce((sum, req) =>
    sum + (req.mandatory ? 100 : 70), 0
  );

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
}

function calculateExperienceMatch(
  personnelExp: PersonnelExperience[],
  requiredExp: ExperienceRequirement[]
): number {
  if (requiredExp.length === 0) return 100;

  let totalScore = 0;

  requiredExp.forEach(req => {
    const relevantExp = personnelExp.find(e =>
      e.domain.toLowerCase() === req.domain.toLowerCase()
    );

    if (relevantExp) {
      let expScore = 0;

      // Years of experience
      if (relevantExp.yearsOfExperience >= req.yearsRequired) {
        expScore = 80;
      } else if (relevantExp.yearsOfExperience >= req.yearsRequired * 0.8) {
        expScore = 60;
      } else {
        expScore = 30;
      }

      // Project count bonus
      if (relevantExp.projectCount >= 3) {
        expScore += 10;
      }

      // Project type relevance
      const relevantProjectTypes = relevantExp.projectTypes.filter(type =>
        req.projectTypes.some(reqType =>
          reqType.toLowerCase().includes(type.toLowerCase())
        )
      );

      if (relevantProjectTypes.length > 0) {
        expScore += 10;
      }

      totalScore += req.mandatory ? expScore : expScore * 0.6;
    } else if (req.mandatory) {
      totalScore += 0; // Mandatory experience missing
    }
  });

  const maxScore = requiredExp.reduce((sum, req) =>
    sum + (req.mandatory ? 100 : 60), 0
  );

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
}

function calculateAvailabilityMatch(
  personnelAvail: PersonnelAvailability,
  requiredAvail: AvailabilityRequirement[],
  position: ProjectPosition
): number {
  if (requiredAvail.length === 0) return 100;

  let totalScore = 0;

  requiredAvail.forEach(req => {
    let availScore = 50; // Base score

    // Status check
    if (personnelAvail.status === 'available') {
      availScore += 30;
    } else if (personnelAvail.status === 'partially_available') {
      availScore += 15;
    } else {
      availScore = 10; // Unavailable
    }

    // Work hours compatibility
    const personnelMaxHours = personnelAvail.status === 'partially_available' ?
      req.workHoursPerWeek * 0.7 : req.workHoursPerWeek;

    if (personnelMaxHours >= req.workHoursPerWeek) {
      availScore += 10;
    }

    // Notice period
    if (personnelAvail.status !== 'unavailable' &&
        req.noticePeriodDays >= personnelAvail.currentCommitments.length * 30) {
      availScore += 10;
    }

    totalScore += availScore;
  });

  return Math.round(totalScore / requiredAvail.length);
}

function calculateLocationMatch(
  personnelLocation: string,
  positionLocation: string,
  preferences: any
): number {
  // Simple location matching - in real implementation, use geocoding
  const locationMatch = personnelLocation.toLowerCase().includes(positionLocation.toLowerCase()) ||
                        positionLocation.toLowerCase().includes(personnelLocation.toLowerCase());

  if (locationMatch) return 100;

  // Check if willing to relocate
  if (preferences.willingToRelocate) return 70;

  // Different location but same region
  if (personnelLocation.split(',')[1]?.trim() === positionLocation.split(',')[1]?.trim()) {
    return 50;
  }

  return 30;
}

function analyzeMatchStrengthsAndGaps(
  personnel: PersonnelProfile,
  position: ProjectPosition,
  matchBreakdown: any
): { strengths: string[]; gaps: string[] } {
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Skills analysis
  if (matchBreakdown.skills >= 80) {
    strengths.push('Excellent skill match for required competencies');
  } else if (matchBreakdown.skills < 60) {
    gaps.push('Skills gap in required technical competencies');
  }

  // Certifications analysis
  if (matchBreakdown.certifications >= 80) {
    strengths.push('Strong certification profile matching requirements');
  } else if (matchBreakdown.certifications < 60) {
    gaps.push('Missing or expired required certifications');
  }

  // Experience analysis
  if (matchBreakdown.experience >= 80) {
    strengths.push('Extensive relevant experience in required domains');
  } else if (matchBreakdown.experience < 60) {
    gaps.push('Limited experience in required project types');
  }

  // Availability analysis
  if (matchBreakdown.availability >= 80) {
    strengths.push('Good availability match for project timeline');
  } else if (matchBreakdown.availability < 60) {
    gaps.push('Availability constraints for project schedule');
  }

  // SKK readiness bonus
  if (personnel.skkReadinessScore >= 80) {
    strengths.push('High SKK readiness score indicates strong certification foundation');
  }

  // Performance rating
  if (personnel.performanceRating >= 4) {
    strengths.push('Strong performance history and ratings');
  }

  return { strengths, gaps };
}

function generateAssignmentActions(
  gaps: string[],
  personnel: PersonnelProfile,
  position: ProjectPosition
): string[] {
  const actions: string[] = [];

  if (gaps.some(g => g.includes('skill'))) {
    actions.push(`Provide targeted training for ${position.positionName} competencies`);
  }

  if (gaps.some(g => g.includes('certification'))) {
    actions.push('Arrange certification programs or renewal');
  }

  if (gaps.some(g => g.includes('experience'))) {
    actions.push('Assign as junior team member with mentoring');
  }

  if (gaps.some(g => g.includes('availability'))) {
    actions.push('Review current commitments and workload distribution');
  }

  return actions;
}

function assessAssignmentRisk(
  matchBreakdown: any,
  gaps: string[],
  priority: string
): 'low' | 'medium' | 'high' | 'critical' {
  let riskScore = 0;

  // Critical gaps increase risk
  riskScore += gaps.length * 20;

  // Low match scores increase risk
  if (matchBreakdown.overall < 60) riskScore += 30;
  else if (matchBreakdown.overall < 80) riskScore += 15;

  // High priority positions have higher risk threshold
  if (priority === 'high' && riskScore < 40) riskScore += 20;

  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
}

function calculateEstimatedUtilization(
  availability: PersonnelAvailability,
  position: ProjectPosition
): number {
  const currentUtilization = availability.currentCommitments.reduce(
    (sum, commitment) => sum + commitment.commitmentPercentage, 0
  );

  const positionUtilization = Math.min(100, 100 / position.requiredCount);
  const totalUtilization = Math.min(100, currentUtilization + positionUtilization);

  return Math.round(totalUtilization);
}

// Main workforce assignment analysis
export function analyzeWorkforceAssignment(
  projectId: string,
  projectName: string,
  positions: ProjectPosition[],
  availablePersonnel: PersonnelProfile[]
): WorkforceAssignmentResult {
  const positionRecommendations: AssignmentRecommendation[] = [];

  positions.forEach(position => {
    const candidates = availablePersonnel.map(personnel =>
      calculateAssignmentMatch(personnel, position)
    ).sort((a, b) => b.matchScore - a.matchScore);

    const bestMatches = candidates.filter(c => c.matchScore >= 80);
    const alternativeMatches = candidates.filter(c => c.matchScore >= 60 && c.matchScore < 80);
    const unfilledPositions = Math.max(0, position.requiredCount - bestMatches.length);

    const gapAnalysis = analyzePositionGaps(position, candidates);

    positionRecommendations.push({
      positionId: position.id,
      positionName: position.positionName,
      requiredCount: position.requiredCount,
      availableCandidates: candidates,
      bestMatches: bestMatches.slice(0, position.requiredCount * 2), // Include backups
      alternativeMatches: alternativeMatches.slice(0, position.requiredCount),
      unfilledPositions,
      gapAnalysis,
      recommendations: {
        primaryCandidates: bestMatches.slice(0, position.requiredCount),
        backupCandidates: bestMatches.slice(position.requiredCount, position.requiredCount * 2),
        trainingRecommendations: generateTrainingRecommendations(gapAnalysis, position),
        hiringRecommendations: unfilledPositions > 0 ? [`Hire ${unfilledPositions} ${position.positionName} specialists`] : []
      }
    });
  });

  const summary = calculateAssignmentSummary(positionRecommendations);
  const riskAssessment = assessOverallRisk(positionRecommendations);
  const timeline = generateActionTimeline(positionRecommendations);

  return {
    projectId,
    projectName,
    analysisDate: new Date().toISOString(),
    overallAssignmentScore: summary.overallReadiness,
    positionRecommendations,
    summary,
    riskAssessment,
    timeline
  };
}

function analyzePositionGaps(
  position: ProjectPosition,
  candidates: AssignmentMatch[]
): AssignmentRecommendation['gapAnalysis'] {
  const skillGaps: string[] = [];
  const certificationGaps: string[] = [];
  const experienceGaps: string[] = [];
  const availabilityGaps: string[] = [];

  candidates.forEach(candidate => {
    if (candidate.matchBreakdown.skills < 70) {
      skillGaps.push(`${candidate.personnelName}: ${position.skillRequirements.map(s => s.skillName).join(', ')}`);
    }
    if (candidate.matchBreakdown.certifications < 70) {
      certificationGaps.push(`${candidate.personnelName}: ${position.certificationRequirements.map(c => c.certificationType).join(', ')}`);
    }
    if (candidate.matchBreakdown.experience < 70) {
      experienceGaps.push(`${candidate.personnelName}: ${position.experienceRequirements.map(e => `${e.yearsRequired} years ${e.domain}`).join(', ')}`);
    }
    if (candidate.matchBreakdown.availability < 70) {
      availabilityGaps.push(`${candidate.personnelName}: Availability constraints`);
    }
  });

  return {
    skillGaps: [...new Set(skillGaps)],
    certificationGaps: [...new Set(certificationGaps)],
    experienceGaps: [...new Set(experienceGaps)],
    availabilityGaps: [...new Set(availabilityGaps)]
  };
}

function generateTrainingRecommendations(
  gapAnalysis: AssignmentRecommendation['gapAnalysis'],
  position: ProjectPosition
): string[] {
  const recommendations: string[] = [];

  if (gapAnalysis.skillGaps.length > 0) {
    recommendations.push(`Skill development program for ${position.positionName} competencies`);
  }

  if (gapAnalysis.certificationGaps.length > 0) {
    recommendations.push(`Certification preparation for ${position.certificationRequirements.map(c => c.certificationType).join(', ')}`);
  }

  if (gapAnalysis.experienceGaps.length > 0) {
    recommendations.push(`Mentorship program to build ${position.experienceRequirements.map(e => e.domain).join(', ')} experience`);
  }

  return recommendations;
}

function calculateAssignmentSummary(
  recommendations: AssignmentRecommendation[]
): WorkforceAssignmentResult['summary'] {
  const totalPositions = recommendations.reduce((sum, rec) => sum + rec.requiredCount, 0);
  const filledPositions = recommendations.reduce((sum, rec) => sum + Math.min(rec.requiredCount, rec.bestMatches.length), 0);
  const partiallyFilledPositions = recommendations.reduce((sum, rec) => {
    const filled = Math.min(rec.requiredCount, rec.bestMatches.length);
    const partial = Math.min(rec.requiredCount - filled, rec.alternativeMatches.length);
    return sum + partial;
  }, 0);
  const unfilledPositions = recommendations.reduce((sum, rec) => sum + rec.unfilledPositions, 0);

  const overallReadiness = totalPositions > 0 ?
    Math.round(((filledPositions + partiallyFilledPositions * 0.5) / totalPositions) * 100) : 100;

  const criticalGaps = recommendations.flatMap(rec =>
    rec.gapAnalysis.skillGaps.concat(rec.gapAnalysis.certificationGaps)
  ).slice(0, 5);

  const recommendedActions = recommendations.flatMap(rec =>
    rec.recommendations.trainingRecommendations.concat(rec.recommendations.hiringRecommendations)
  ).slice(0, 5);

  return {
    totalPositions,
    filledPositions,
    partiallyFilledPositions,
    unfilledPositions,
    overallReadiness,
    criticalGaps,
    recommendedActions
  };
}

function assessOverallRisk(
  recommendations: AssignmentRecommendation[]
): WorkforceAssignmentResult['riskAssessment'] {
  const riskFactors: string[] = [];
  const mitigationStrategies: string[] = [];

  const unfilledCriticalPositions = recommendations.filter(rec =>
    rec.unfilledPositions > 0 && rec.positionId.includes('critical')
  ).length;

  if (unfilledCriticalPositions > 0) {
    riskFactors.push(`Unfilled critical positions: ${unfilledCriticalPositions}`);
    mitigationStrategies.push('Accelerate recruitment for critical roles');
  }

  const highRiskMatches = recommendations.flatMap(rec =>
    rec.bestMatches.filter(match => match.riskLevel === 'high' || match.riskLevel === 'critical')
  ).length;

  if (highRiskMatches > 0) {
    riskFactors.push(`High-risk assignments: ${highRiskMatches} positions`);
    mitigationStrategies.push('Implement additional training and mentoring');
  }

  const overallRisk = riskFactors.length >= 3 ? 'critical' :
                     riskFactors.length >= 2 ? 'high' :
                     riskFactors.length >= 1 ? 'medium' : 'low';

  return {
    overallRisk,
    riskFactors,
    mitigationStrategies
  };
}

function generateActionTimeline(
  recommendations: AssignmentRecommendation[]
): WorkforceAssignmentResult['timeline'] {
  const immediateActions: string[] = [];
  const shortTermActions: string[] = [];
  const longTermActions: string[] = [];

  recommendations.forEach(rec => {
    if (rec.unfilledPositions > 0) {
      immediateActions.push(`Initiate recruitment for ${rec.unfilledPositions} ${rec.positionName} positions`);
    }

    if (rec.recommendations.trainingRecommendations.length > 0) {
      shortTermActions.push(`Start training programs for ${rec.positionName} roles`);
    }

    if (rec.gapAnalysis.certificationGaps.length > 0) {
      longTermActions.push(`Plan certification programs for ${rec.positionName} competencies`);
    }
  });

  return {
    immediateActions: [...new Set(immediateActions)],
    shortTermActions: [...new Set(shortTermActions)],
    longTermActions: [...new Set(longTermActions)]
  };
}