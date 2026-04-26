/**
 * Energy Efficiency Analysis Document Library
 * 
 * Based on reference materials:
 * - Turner & Doty (2012) - Energy Management Handbook
 * - Wilson (2019) - Energy Efficiency: Principles and Practices
 * - Turner & Turner (2017) - Industrial Energy Management
 * 
 * Provides comprehensive energy efficiency analysis frameworks,
 * audit methodologies, and improvement recommendations.
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface EnergyAnalysisProject {
  id: string;
  projectName: string;
  facilityType: FacilityType;
  location: string;
  analysisDate: string;
  analyst: string;
  scope: AnalysisScope;
  objectives: string[];
  baselinePeriod: BaselinePeriod;
}

export type FacilityType = 
  | 'industrial'
  | 'commercial'
  | 'residential'
  | 'utility'
  | 'mixed-use';

export interface AnalysisScope {
  entireFacility: boolean;
  systems: string[];
  buildings?: string[];
  areaSqM?: number;
}

export interface BaselinePeriod {
  startDate: string;
  endDate: string;
  utilityBills: UtilityBill[];
  energyIntensity?: number;
}

export interface UtilityBill {
  period: string;
  electricityKWh: number;
  electricityCost: number;
  gasM3?: number;
  gasCost?: number;
  dieselLiters?: number;
  dieselCost?: number;
}

export interface EnergyAudit {
  id: string;
  projectId: string;
  auditType: AuditType;
  conductedBy: string;
  date: string;
  methodology: string;
  findings: AuditFinding[];
  energyBalance: EnergyBalance;
}

export type AuditType = 
  | 'preliminary'
  | 'general'
  | 'detailed'
  | 'verification';

export interface AuditFinding {
  id: string;
  category: string;
  description: string;
  currentCondition: string;
  potentialSavings: SavingsEstimate;
  priority: Priority;
  implementationComplexity: Complexity;
  paybackPeriod: number;
  recommendation: string;
}

export interface SavingsEstimate {
  annualKWh: number;
  annualCost: number;
  reductionPercent: number;
  co2Reduction: number;
}

export type Priority = 'high' | 'medium' | 'low';
export type Complexity = 'simple' | 'moderate' | 'complex';

export interface EnergyBalance {
  totalInput: number;
  totalOutput: number;
  losses: EnergyLoss[];
  efficiency: number;
}

export interface EnergyLoss {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

// ============================================================================
// Energy Categories and Systems
// ============================================================================

export interface EnergyCategoryData {
  id: string;
  name: string;
  nameId: string;
  description: string;
  typicalConsumption: number;
  commonIssues: string[];
  improvementMeasures: ImprovementMeasure[];
}

export const energyCategories: EnergyCategoryData[] = [
  {
    id: 'lighting',
    name: 'Lighting System',
    nameId: 'Sistem Pencahayaan',
    description: 'Analysis of artificial lighting systems including fixtures, controls, and daylight integration',
    typicalConsumption: 15,
    commonIssues: [
      'Using outdated incandescent or fluorescent fixtures',
      'No occupancy sensors or daylight harvesting',
      'Over-illumination in unused areas',
      'Poor maintenance leading to reduced efficiency',
      'Inappropriate color temperature for applications'
    ],
    improvementMeasures: [
      {
        measure: 'LED Lighting Retrofit',
        description: 'Replace existing fixtures with LED alternatives',
        savings: '40-60% energy reduction',
        payback: 2,
        complexity: 'simple'
      },
      {
        measure: 'Occupancy Sensors',
        description: 'Install motion sensors in low-traffic areas',
        savings: '20-30% energy reduction',
        payback: 1,
        complexity: 'simple'
      },
      {
        measure: 'Daylight Harvesting',
        description: 'Implement daylight sensors to reduce artificial lighting',
        savings: '20-40% energy reduction',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'Lighting Controls & Scheduling',
        description: 'Install timers and dimming systems',
        savings: '15-25% energy reduction',
        payback: 1.5,
        complexity: 'simple'
      }
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC System',
    nameId: 'Sistem HVAC',
    description: 'Heating, ventilation, and air conditioning systems analysis',
    typicalConsumption: 30,
    commonIssues: [
      'Oversized or undersized equipment',
      'Poor insulation and air leakage',
      'Inefficient temperature controls',
      'Lack of preventive maintenance',
      'Poor zone control'
    ],
    improvementMeasures: [
      {
        measure: 'Variable Frequency Drives (VFD)',
        description: 'Install VFDs on motors and fans',
        savings: '20-50% energy reduction',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'Smart Thermostats',
        description: 'Install programmable/smart temperature controls',
        savings: '10-20% energy reduction',
        payback: 1,
        complexity: 'simple'
      },
      {
        measure: 'Duct Sealing & Insulation',
        description: 'Repair leaks and improve duct insulation',
        savings: '10-25% energy reduction',
        payback: 1.5,
        complexity: 'moderate'
      },
      {
        measure: 'Heat Recovery Ventilation',
        description: 'Implement heat exchangers for exhaust air',
        savings: '15-30% energy reduction',
        payback: 3,
        complexity: 'complex'
      },
      {
        measure: 'Regular Maintenance',
        description: 'Clean filters, coils, and check refrigerants',
        savings: '5-15% energy reduction',
        payback: 0.5,
        complexity: 'simple'
      }
    ]
  },
  {
    id: 'motors',
    name: 'Electric Motors & Drives',
    nameId: 'Motor Listrik & Penggerak',
    description: 'Analysis of electric motor systems and variable speed drives',
    typicalConsumption: 25,
    commonIssues: [
      'Oversized motors operating at low load',
      'No variable speed drives',
      'Poor power factor',
      'Inefficient motor starters',
      'Lack of preventive maintenance'
    ],
    improvementMeasures: [
      {
        measure: 'Variable Frequency Drives (VFD)',
        description: 'Install VFDs for variable load applications',
        savings: '20-50% energy reduction',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'Motor Sizing Optimization',
        description: 'Replace oversized motors with properly sized units',
        savings: '5-15% energy reduction',
        payback: 3,
        complexity: 'complex'
      },
      {
        measure: 'Premium Efficiency Motors',
        description: 'Replace old motors with IE3/IE4 efficiency class',
        savings: '2-5% energy reduction',
        payback: 5,
        complexity: 'moderate'
      },
      {
        measure: 'Power Factor Correction',
        description: 'Install capacitor banks for PF improvement',
        savings: 'Demand charge reduction',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'Soft Starters',
        description: 'Replace star-delta starters with soft starters',
        savings: '3-8% energy reduction',
        payback: 3,
        complexity: 'moderate'
      }
    ]
  },
  {
    id: 'production',
    name: 'Production Equipment',
    nameId: 'Peralatan Produksi',
    description: 'Industrial production equipment and process optimization',
    typicalConsumption: 35,
    commonIssues: [
      'Inefficient production scheduling',
      'Equipment operating at partial load',
      'Lack of process monitoring',
      'Heat recovery opportunities missed',
      'Compressed air leaks'
    ],
    improvementMeasures: [
      {
        measure: 'Compressed Air Leak Reduction',
        description: 'Fix leaks and optimize system pressure',
        savings: '20-30% compressor energy',
        payback: 0.5,
        complexity: 'simple'
      },
      {
        measure: 'Heat Recovery Systems',
        description: 'Capture waste heat for preheating or heating',
        savings: '10-30% energy reduction',
        payback: 2,
        complexity: 'complex'
      },
      {
        measure: 'Production Scheduling Optimization',
        description: 'Optimize batch operations and equipment sequencing',
        savings: '5-15% energy reduction',
        payback: 1,
        complexity: 'moderate'
      },
      {
        measure: 'Process Controls Upgrade',
        description: 'Implement advanced process control systems',
        savings: '5-20% energy reduction',
        payback: 2,
        complexity: 'complex'
      }
    ]
  },
  {
    id: 'building',
    name: 'Building Envelope',
    nameId: 'Selubung Bangunan',
    description: 'Walls, roofs, windows, and thermal insulation analysis',
    typicalConsumption: 10,
    commonIssues: [
      'Poor thermal insulation',
      'Air leakage through windows and doors',
      'Inadequate shading',
      'Single-pane windows',
      'Poor roof insulation'
    ],
    improvementMeasures: [
      {
        measure: 'Window Replacement',
        description: 'Install double/triple-pane insulated windows',
        savings: '10-25% HVAC energy',
        payback: 10,
        complexity: 'complex'
      },
      {
        measure: 'Wall & Roof Insulation',
        description: 'Add or upgrade insulation materials',
        savings: '10-30% HVAC energy',
        payback: 5,
        complexity: 'complex'
      },
      {
        measure: 'Air Sealing',
        description: 'Seal gaps, cracks, and infiltration points',
        savings: '5-15% HVAC energy',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'External Shading',
        description: 'Install blinds, awnings, or exterior shading',
        savings: '10-20% cooling energy',
        payback: 4,
        complexity: 'moderate'
      }
    ]
  },
  {
    id: ' renewables',
    name: 'Renewable Energy Integration',
    nameId: 'Integrasi Energi Terbarukan',
    description: 'Solar PV, wind, and other renewable energy systems',
    typicalConsumption: 0,
    commonIssues: [
      'No on-site renewable generation',
      'Grid-tied systems without storage',
      'Poor system sizing',
      'Lack of net metering consideration'
    ],
    improvementMeasures: [
      {
        measure: 'Solar PV Installation',
        description: 'Install grid-tied solar photovoltaic system',
        savings: '20-50% electricity cost',
        payback: 5,
        complexity: 'complex'
      },
      {
        measure: 'Battery Energy Storage',
        description: 'Add battery storage for peak shaving',
        savings: '15-30% peak demand',
        payback: 8,
        complexity: 'complex'
      },
      {
        measure: 'Solar Water Heating',
        description: 'Install solar thermal for hot water',
        savings: '50-80% water heating energy',
        payback: 4,
        complexity: 'moderate'
      }
    ]
  },
  {
    id: 'power-quality',
    name: 'Power Quality & Distribution',
    nameId: 'Kualitas Daya & Distribusi',
    description: 'Electrical distribution, power factor, and harmonic analysis',
    typicalConsumption: 5,
    commonIssues: [
      'Poor power factor',
      'Harmonic distortion',
      'Unbalanced loads',
      'Voltage drops',
      'Inefficient transformer operation'
    ],
    improvementMeasures: [
      {
        measure: 'Power Factor Correction',
        description: 'Install automatic capacitor banks',
        savings: 'Demand charge reduction',
        payback: 2,
        complexity: 'moderate'
      },
      {
        measure: 'Harmonic Filtering',
        description: 'Install harmonic filters for VFDs',
        savings: 'Equipment longevity',
        payback: 3,
        complexity: 'complex'
      },
      {
        measure: 'Load Balancing',
        description: 'Redistribute loads across phases',
        savings: '2-5% energy reduction',
        payback: 1,
        complexity: 'simple'
      },
      {
        measure: 'Transformer Upgrade',
        description: 'Replace old transformers with efficient units',
        savings: '1-3% energy reduction',
        payback: 10,
        complexity: 'complex'
      }
    ]
  }
];

export interface ImprovementMeasure {
  measure: string;
  description: string;
  savings: string;
  payback: number;
  complexity: Complexity;
}

// ============================================================================
// Evaluation Criteria
// ============================================================================

export interface EvaluationCriteria {
  id: string;
  name: string;
  nameId: string;
  weight: number;
  description: string;
}

export const evaluationCriteria: EvaluationCriteria[] = [
  {
    id: 'technical',
    name: 'Technical Feasibility',
    nameId: 'Kelayakan Teknis',
    weight: 25,
    description: 'Assessment of technical viability, compatibility with existing systems, and required modifications'
  },
  {
    id: 'financial',
    name: 'Financial Impact',
    nameId: 'Dampak Finansial',
    weight: 30,
    description: 'Initial investment cost, operating cost savings, ROI, and payback period analysis'
  },
  {
    id: 'environmental',
    name: 'Environmental Benefits',
    nameId: 'Manfaat Lingkungan',
    weight: 15,
    description: 'CO2 emissions reduction, environmental compliance, and sustainability impact'
  },
  {
    id: 'operational',
    name: 'Operational Impact',
    nameId: 'Dampak Operasional',
    weight: 15,
    description: 'Effect on operations, maintenance requirements, and reliability'
  },
  {
    id: 'implementation',
    name: 'Implementation Complexity',
    nameId: 'Kompleksitas Implementasi',
    weight: 15,
    description: 'Timeline, disruption to operations, and resource requirements'
  }
];

// ============================================================================
// Compliance Standards
// ============================================================================

export interface ComplianceStandard {
  id: string;
  name: string;
  nameId: string;
  region: string;
  description: string;
  requirements: string[];
}

export const complianceStandards: ComplianceStandard[] = [
  {
    id: 'puil',
    name: 'PUIL 2011',
    nameId: 'PUIL 2011',
    region: 'Indonesia',
    description: 'Persyaratan Umum Instalasi Listrik - National electrical installation standard',
    requirements: [
      'Electrical safety requirements for installations',
      'Protection against electric shock',
      'Protection against overcurrent',
      'Selection and erection of equipment',
      'Inspection and testing requirements'
    ]
  },
  {
    id: 'iso-50001',
    name: 'ISO 50001:2018',
    nameId: 'ISO 50001:2018',
    region: 'International',
    description: 'Energy Management Systems - Requirements with guidance for use',
    requirements: [
      'Energy policy development',
      'Energy planning and review',
      'Implementation and operation',
      'Measurement and monitoring',
      'Continual improvement'
    ]
  },
  {
    id: 'iso-14001',
    name: 'ISO 14001:2015',
    nameId: 'ISO 14001:2015',
    region: 'International',
    description: 'Environmental Management Systems',
    requirements: [
      'Environmental aspect identification',
      'Legal compliance',
      'Environmental objectives setting',
      'Implementation and operation',
      'Monitoring and corrective action'
    ]
  },
  {
    id: 'sni-6389',
    name: 'SNI 6389:2020',
    nameId: 'SNI 6389:2020',
    region: 'Indonesia',
    description: 'Conservancy Energy Management System - Requirements',
    requirements: [
      'Energy policy and planning',
      'Energy review and baseline',
      'Energy performance indicators',
      'Energy management action plans',
      'Monitoring and measurement'
    ]
  }
];

// ============================================================================
// Report Templates
// ============================================================================

export interface EnergyEfficiencyReport {
  projectInfo: EnergyAnalysisProject;
  executiveSummary: ExecutiveSummary;
  auditResults: EnergyAudit;
  recommendations: RankedRecommendation[];
  implementationPlan: ImplementationPlan;
  financialAnalysis: FinancialAnalysis;
  complianceStatus: ComplianceStatus;
  appendices: Appendix[];
}

export interface ExecutiveSummary {
  keyFindings: string[];
  totalPotentialSavings: SavingsEstimate;
  totalInvestmentRequired: number;
  averagePaybackPeriod: number;
  co2ReductionPotential: number;
  priorityActions: string[];
}

export interface RankedRecommendation {
  rank: number;
  finding: AuditFinding;
  score: number;
  justification: string;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  totalDuration: number;
  milestones: Milestone[];
}

export interface ImplementationPhase {
  phase: number;
  name: string;
  nameId: string;
  duration: number;
  measures: string[];
  investment: number;
  expectedSavings: number;
}

export interface Milestone {
  date: string;
  description: string;
  deliverable: string;
}

export interface FinancialAnalysis {
  measures: FinancialMeasure[];
  summary: FinancialSummary;
  npv: number;
  irr: number;
  simplePayback: number;
}

export interface FinancialMeasure {
  measureId: string;
  investment: number;
  annualSavings: number;
  lifetimeSavings: number;
  npv: number;
  irr: number;
  payback: number;
}

export interface FinancialSummary {
  totalInvestment: number;
  totalAnnualSavings: number;
  totalLifetimeSavings: number;
  netPresentValue: number;
  internalRateOfReturn: number;
}

export interface ComplianceStatus {
  standards: StandardCompliance[];
  gaps: ComplianceGap[];
  actionPlan: string[];
}

export interface StandardCompliance {
  standardId: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  findings: string[];
}

export interface ComplianceGap {
  requirement: string;
  currentStatus: string;
  remediation: string;
  priority: Priority;
}

export interface Appendix {
  id: string;
  title: string;
  titleId: string;
  content: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateEnergyIntensity(
  totalEnergyKWh: number,
  areaSqM: number
): number {
  return totalEnergyKWh / areaSqM;
}

export function calculateSavingsScore(
  savings: SavingsEstimate,
  investment: number,
  priority: Priority,
  complexity: Complexity
): number {
  let score = 0;
  
  // Financial impact (40%)
  const roi = savings.annualCost / investment;
  score += Math.min(roi * 20, 40);
  
  // Priority (30%)
  const priorityScore = priority === 'high' ? 30 : priority === 'medium' ? 20 : 10;
  score += priorityScore;
  
  // Complexity (20%)
  const complexityScore = complexity === 'simple' ? 20 : complexity === 'moderate' ? 10 : 5;
  score += complexityScore;
  
  // Environmental (10%)
  score += Math.min(savings.co2Reduction / 10, 10);
  
  return Math.round(score);
}

export function rankRecommendations(
  findings: AuditFinding[],
  budget?: number
): RankedRecommendation[] {
  const ranked = findings.map((finding, index) => {
    const investment = finding.paybackPeriod * finding.potentialSavings.annualCost;
    const score = calculateSavingsScore(
      finding.potentialSavings,
      investment,
      finding.priority,
      finding.implementationComplexity
    );
    
    return {
      rank: 0,
      finding,
      score,
      justification: `Score: ${score} - Payback: ${finding.paybackPeriod} years, Savings: ${finding.potentialSavings.annualCost}/year`
    };
  });
  
  // Sort by score descending
  ranked.sort((a, b) => b.score - a.score);
  
  // Assign ranks
  ranked.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  // Filter by budget if provided
  if (budget) {
    let runningTotal = 0;
    return ranked.filter(item => {
      const investment = item.finding.paybackPeriod * item.finding.potentialSavings.annualCost;
      runningTotal += investment;
      return runningTotal <= budget;
    });
  }
  
  return ranked;
}

export function generateEnergyBalance(
  utilityBills: UtilityBill[]
): EnergyBalance {
  const totalInput = utilityBills.reduce((sum, bill) => sum + bill.electricityKWh, 0);
  
  // Typical distribution based on facility type
  const losses = [
    { category: 'Lighting', amount: totalInput * 0.12, percentage: 12, description: 'Inefficient lighting fixtures and controls' },
    { category: 'HVAC', amount: totalInput * 0.18, percentage: 18, description: 'Inefficient cooling/heating systems' },
    { category: 'Motors', amount: totalInput * 0.15, percentage: 15, description: 'Oversized motors and no VFDs' },
    { category: 'Production', amount: totalInput * 0.20, percentage: 20, description: 'Process inefficiencies and waste' },
    { category: 'Other', amount: totalInput * 0.10, percentage: 10, description: 'Miscellaneous losses' }
  ];
  
  const totalLosses = losses.reduce((sum, loss) => sum + loss.amount, 0);
  const totalOutput = totalInput - totalLosses;
  const efficiency = (totalOutput / totalInput) * 100;
  
  return {
    totalInput,
    totalOutput,
    losses,
    efficiency
  };
}

export function createEnergyAnalysisReport(
  project: EnergyAnalysisProject,
  audit: EnergyAudit
): EnergyEfficiencyReport {
  const rankedRecommendations = rankRecommendations(audit.findings);
  
  const totalSavings = audit.findings.reduce(
    (sum, finding) => ({
      annualKWh: sum.annualKWh + finding.potentialSavings.annualKWh,
      annualCost: sum.annualCost + finding.potentialSavings.annualCost,
      reductionPercent: 0,
      co2Reduction: sum.co2Reduction + finding.potentialSavings.co2Reduction
    }),
    { annualKWh: 0, annualCost: 0, reductionPercent: 0, co2Reduction: 0 }
  );
  
  const totalInvestment = audit.findings.reduce((sum, finding) => {
    return sum + (finding.paybackPeriod * finding.potentialSavings.annualCost);
  }, 0);
  
  const avgPayback = audit.findings.length > 0
    ? audit.findings.reduce((sum, f) => sum + f.paybackPeriod, 0) / audit.findings.length
    : 0;
  
  // Calculate financial metrics
  const financialMeasures: FinancialMeasure[] = audit.findings.map(finding => {
    const investment = finding.paybackPeriod * finding.potentialSavings.annualCost;
    const lifetimeSavings = finding.potentialSavings.annualCost * 10; // 10-year analysis
    const npv = lifetimeSavings - investment;
    const irr = (finding.potentialSavings.annualCost / investment) * 100;
    
    return {
      measureId: finding.id,
      investment,
      annualSavings: finding.potentialSavings.annualCost,
      lifetimeSavings,
      npv,
      irr,
      payback: finding.paybackPeriod
    };
  });
  
  const totalAnnualSavings = financialMeasures.reduce((sum, m) => sum + m.annualSavings, 0);
  const totalLifetimeSavings = financialMeasures.reduce((sum, m) => sum + m.lifetimeSavings, 0);
  const totalNPV = financialMeasures.reduce((sum, m) => sum + m.npv, 0);
  const avgIRR = financialMeasures.length > 0
    ? financialMeasures.reduce((sum, m) => sum + m.irr, 0) / financialMeasures.length
    : 0;
  
  const executiveSummary: ExecutiveSummary = {
    keyFindings: [
      `Identified ${audit.findings.length} energy efficiency opportunities`,
      `Total potential annual savings: ${totalSavings.annualCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`,
      `Estimated CO2 reduction: ${totalSavings.co2Reduction.toFixed(0)} tonnes/year`,
      `Average payback period: ${avgPayback.toFixed(1)} years`
    ],
    totalPotentialSavings: totalSavings,
    totalInvestmentRequired: totalInvestment,
    averagePaybackPeriod: avgPayback,
    co2ReductionPotential: totalSavings.co2Reduction,
    priorityActions: rankedRecommendations.slice(0, 5).map(r => r.finding.recommendation)
  };
  
  const implementationPlan: ImplementationPlan = {
    phases: [
      {
        phase: 1,
        name: 'Quick Wins',
        nameId: 'Kemenangan Cepat',
        duration: 3,
        measures: audit.findings.filter(f => f.implementationComplexity === 'simple').map(f => f.recommendation),
        investment: totalInvestment * 0.15,
        expectedSavings: totalAnnualSavings * 0.25
      },
      {
        phase: 2,
        name: 'Medium-term Improvements',
        nameId: 'Perbaikan Jangka Menengah',
        duration: 12,
        measures: audit.findings.filter(f => f.implementationComplexity === 'moderate').map(f => f.recommendation),
        investment: totalInvestment * 0.35,
        expectedSavings: totalAnnualSavings * 0.40
      },
      {
        phase: 3,
        name: 'Long-term Projects',
        nameId: 'Proyek Jangka Panjang',
        duration: 24,
        measures: audit.findings.filter(f => f.implementationComplexity === 'complex').map(f => f.recommendation),
        investment: totalInvestment * 0.50,
        expectedSavings: totalAnnualSavings * 0.35
      }
    ],
    totalDuration: 39,
    milestones: [
      { date: 'Month 3', description: 'Complete quick wins implementation', deliverable: 'Phase 1 report' },
      { date: 'Month 15', description: 'Complete medium-term improvements', deliverable: 'Phase 2 report' },
      { date: 'Month 39', description: 'Complete all projects', deliverable: 'Final verification report' }
    ]
  };
  
  const financialAnalysis: FinancialAnalysis = {
    measures: financialMeasures,
    summary: {
      totalInvestment,
      totalAnnualSavings,
      totalLifetimeSavings,
      netPresentValue: totalNPV,
      internalRateOfReturn: avgIRR
    },
    npv: totalNPV,
    irr: avgIRR,
    simplePayback: avgPayback
  };
  
  const complianceStatus: ComplianceStatus = {
    standards: complianceStandards.map(std => ({
      standardId: std.id,
      status: 'partial' as const,
      findings: ['Energy management system implementation recommended']
    })),
    gaps: [
      {
        requirement: 'ISO 50001 Energy Policy',
        currentStatus: 'Not implemented',
        remediation: 'Develop and implement energy policy',
        priority: 'medium'
      }
    ],
    actionPlan: [
      'Conduct baseline energy review',
      'Develop energy policy',
      'Establish energy performance indicators',
      'Implement monitoring and measurement'
    ]
  };
  
  const appendices: Appendix[] = [
    {
      id: 'a',
      title: 'Utility Bill Analysis',
      titleId: 'Analisis Tagihan Listrik',
      content: 'Detailed breakdown of utility bills for baseline period'
    },
    {
      id: 'b',
      title: 'Equipment Inventory',
      titleId: 'Inventaris Peralatan',
      content: 'Complete list of energy-consuming equipment'
    },
    {
      id: 'c',
      title: 'Measurement and Verification Plan',
      titleId: 'Rencana Pengukuran dan Verifikasi',
      content: 'M&V plan for tracking energy savings'
    }
  ];
  
  return {
    projectInfo: project,
    executiveSummary,
    auditResults: audit,
    recommendations: rankedRecommendations,
    implementationPlan,
    financialAnalysis,
    complianceStatus,
    appendices
  };
}

// ============================================================================
// Query Functions for Chat API
// ============================================================================

export function getEnergyCategoryById(id: string): EnergyCategoryData | undefined {
  return energyCategories.find(cat => cat.id === id);
}

export function getCategoriesByFacilityType(facilityType: FacilityType): string[] {
  const baseCategories = energyCategories.map(c => c.id);
  
  switch (facilityType) {
    case 'industrial':
      return [...baseCategories, 'production'];
    case 'commercial':
      return baseCategories.filter(c => c !== 'production');
    case 'residential':
      return ['lighting', 'hvac', 'building'];
    case 'utility':
      return ['power-quality', 'renewables'];
    case 'mixed-use':
      return baseCategories;
    default:
      return baseCategories;
  }
}

export function getImprovementMeasuresByCategory(categoryId: string): ImprovementMeasure[] {
  const category = getEnergyCategoryById(categoryId);
  return category?.improvementMeasures || [];
}

export function getComplianceRequirements(standardId: string): string[] {
  const standard = complianceStandards.find(s => s.id === standardId);
  return standard?.requirements || [];
}
