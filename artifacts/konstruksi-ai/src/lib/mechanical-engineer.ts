// Mechanical Engineering Document Library
// Comprehensive technical documents for Mechanical Engineering
// Reference: Shigley's Mechanical Engineering Design (Budynas & Nisbett, 2020), Mott (2018), Bhandari (2010)

export interface CFDReport {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    projectNumber: string;
    client: string;
    date: string;
    engineer: string;
  };
  introduction: {
    purpose: string;
    scope: string;
    objectives: string[];
  };
  geometryDescription: {
    dimensions: Record<string, string>;
    boundaryConditions: string[];
    meshInformation: string;
  };
  materialProperties: {
    fluidType: string;
    density: string;
    viscosity: string;
    thermalConductivity?: string;
    specificHeat?: string;
  };
  boundaryConditions: {
    inlets: Array<{ name: string; velocity: string; temperature?: string }>;
    outlets: Array<{ name: string; pressure: string }>;
    walls: Array<{ name: string; condition: string; temperature?: string }>;
  };
  solverSettings: {
    solver: string;
    turbulenceModel: string;
    discretization: string;
    convergenceCriteria: string;
    iterations: number;
  };
  results: {
    velocityField: string;
    pressureDistribution: string;
    temperatureDistribution?: string;
    streamlines: string;
    vorticityAnalysis: string;
  };
  conclusions: string[];
  recommendations: string[];
  appendices: string[];
}

export interface DesignReviewPresentation {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    projectNumber: string;
    revision: string;
    date: string;
    presenter: string;
  };
  attendees: Array<{ name: string; role: string; company: string }>;
  agenda: string[];
  designOverview: {
    productDescription: string;
    targetApplications: string[];
    keyRequirements: string[];
    constraints: string[];
  };
  designAnalysis: {
    functionalAnalysis: string;
    materialSelection: string;
    manufacturingConsiderations: string;
    costAnalysis: string;
  };
  riskAssessment: {
    identifiedRisks: Array<{ risk: string; severity: string; mitigation: string }>;
    riskMatrix: string;
  };
  decisions: {
    approvedItems: string[];
    pendingItems: string[];
    actionItems: Array<{ item: string; owner: string; dueDate: string }>;
  };
  nextSteps: string[];
  appendices: string[];
}

export interface FailureAnalysisReport {
  id: string;
  title: string;
  projectInfo: {
    equipmentName: string;
    serialNumber: string;
    location: string;
    failureDate: string;
    reportDate: string;
    analyst: string;
  };
  executiveSummary: string;
  background: {
    equipmentDescription: string;
    operatingConditions: string;
    serviceHistory: string;
  };
  failureDescription: {
    failureMode: string;
    symptoms: string[];
    failureSequence: string;
    photographs: string[];
  };
  analysis: {
    visualInspection: string;
    metallurgicalAnalysis?: string;
    chemicalAnalysis?: string;
    mechanicalTesting?: string;
    finiteElementAnalysis?: string;
  };
  rootCause: {
    primaryCause: string;
    contributingFactors: string[];
    mechanism: string;
  };
  conclusions: string[];
  recommendations: Array<{
    recommendation: string;
    priority: string;
    estimatedCost?: string;
  }>;
  appendices: string[];
}

export interface ComponentSelectionReport {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    componentName: string;
    date: string;
    engineer: string;
  };
  selectionCriteria: {
    functionalRequirements: string[];
    performanceRequirements: string[];
    environmentalRequirements: string[];
    costConstraints: string[];
    regulatoryRequirements: string[];
  };
  candidateComponents: Array<{
    name: string;
    manufacturer: string;
    specifications: Record<string, string>;
    pros: string[];
    cons: string[];
    estimatedCost: string;
  }>;
  evaluationMatrix: Array<{
    criterion: string;
    weight: number;
    scores: Record<string, number>;
  }>;
  selectionDecision: {
    selectedComponent: string;
    justification: string;
    alternatives: string[];
  };
  implementationNotes: string[];
  appendices: string[];
}

export interface DesignValidationReport {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    productNumber: string;
    version: string;
    validationDate: string;
    validationTeam: string[];
  };
  designSpecifications: {
    dimensionalRequirements: Record<string, string>;
    materialRequirements: string[];
    performanceRequirements: Record<string, string>;
    safetyRequirements: string[];
  };
  validationPlan: {
    testMethods: string[];
    equipmentUsed: string[];
    testConditions: string;
    sampleSize: number;
  };
  results: {
    dimensionalChecks: Array<{ parameter: string; specification: string; result: string; status: string }>;
    performanceTests: Array<{ test: string; requirement: string; result: string; status: string }>;
    safetyTests: Array<{ test: string; result: string; status: string }>;
    environmentalTests: Array<{ test: string; conditions: string; result: string; status: string }>;
  };
  deviations: Array<{ issue: string; impact: string; resolution: string }>;
  conclusions: {
    overallStatus: string;
    summary: string;
    remainingIssues: string[];
  };
  approvals: Array<{ name: string; role: string; signature: string; date: string }>;
}

export interface FEAReport {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    componentName: string;
    analysisType: string;
    date: string;
    analyst: string;
  };
  introduction: {
    purpose: string;
    scope: string;
    objectives: string[];
  };
  modelDescription: {
    geometry: string;
    mesh: {
      elementType: string;
      elementSize: string;
      nodeCount: number;
      elementCount: number;
      meshQuality: string;
    };
    materialModels: Array<{ material: string; properties: Record<string, string> }>;
  };
  boundaryConditions: {
    loads: Array<{ type: string; magnitude: string; location: string }>;
    constraints: Array<{ type: string; location: string }>;
  };
  results: {
    displacement: {
      maxDisplacement: string;
      location: string;
      contourDescription: string;
    };
    stress: {
      maxVonMises: string;
      location: string;
      fsf: string;
      contourDescription: string;
    };
    strain: {
      maxStrain: string;
      location: string;
    };
    fatigueAnalysis?: string;
    bucklingAnalysis?: string;
    modalAnalysis?: string;
  };
  conclusions: {
    summary: string;
    designAdequacy: string;
    recommendations: string[];
  };
  appendices: string[];
}

export interface ProductPerformanceReport {
  id: string;
  title: string;
  projectInfo: {
    productName: string;
    modelNumber: string;
    testPeriod: string;
    reportDate: string;
  };
  executiveSummary: string;
  productDescription: string;
  testConditions: {
    environment: string;
    loading: string;
    duration: string;
    sampleSize: number;
  };
  performanceMetrics: {
    efficiency: Array<{ parameter: string; value: string; target: string; status: string }>;
    reliability: Array<{ metric: string; value: string; target: string; status: string }>;
    durability: Array<{ test: string; cycles: string; result: string; status: string }>;
  };
  testResults: {
    laboratoryTests: Array<{ test: string; result: string; notes: string }>;
    fieldTests: Array<{ location: string; duration: string; performance: string }>;
  };
  analysis: {
    statisticalAnalysis: string;
    trendAnalysis: string;
    comparisonWithSpecs: string;
  };
  conclusions: {
    overallPerformance: string;
    conformanceToSpecs: string;
    issuesIdentified: string[];
  };
  recommendations: string[];
}

export interface ToleranceAnalysisReport {
  id: string;
  title: string;
  projectInfo: {
    assemblyName: string;
    partNumbers: string[];
    date: string;
    engineer: string;
  };
  introduction: {
    purpose: string;
    scope: string;
    assemblyDescription: string;
  };
  toleranceStackup: {
    criticalDimensions: Array<{
      dimension: string;
      nominal: string;
      tolerance: string;
      contribution: string;
    }>;
    stackupAnalysis: string;
    worstCaseAnalysis: string;
    statisticalAnalysis: string;
  };
  gdntRequirements: {
    geometricControls: string[];
    datumReferences: string[];
    toleranceZones: string[];
  };
  analysis: {
    sensitivityAnalysis: string;
    processCapability: Array<{ dimension: string; cp: string; cpk: string }>;
    sigmaLevel: string;
  };
  conclusions: {
    feasibility: string;
    riskAssessment: string;
    recommendations: string[];
  };
  appendices: string[];
}

export interface ManufacturingProcessPlan {
  id: string;
  title: string;
  projectInfo: {
    partName: string;
    partNumber: string;
    revision: string;
    date: string;
    processPlanner: string;
  };
  partDescription: {
    material: string;
    materialSpecification: string;
    hardness?: string;
    weight: string;
    dimensions: Record<string, string>;
  };
  processSequence: Array<{
    operationNumber: number;
    operationName: string;
    machine: string;
    tooling: string[];
    setupTime: string;
    cycleTime: string;
    tolerances: string[];
    qualityChecks: string[];
  }>;
  materialRemoval: {
    initialWeight: string;
    finalWeight: string;
    removalPercentage: string;
  };
  qualityRequirements: {
    inspectionPoints: string[];
    criticalCharacteristics: string[];
    gaugeRequirements: string[];
  };
  safetyNotes: string[];
  appendices: string[];
}

export interface MaterialSelectionReport {
  id: string;
  title: string;
  projectInfo: {
    componentName: string;
    application: string;
    date: string;
    engineer: string;
  };
  designRequirements: {
    mechanicalRequirements: string[];
    thermalRequirements: string[];
    corrosionRequirements: string[];
    costConstraints: string[];
    manufacturingRequirements: string[];
  };
  candidateMaterials: Array<{
    material: string;
    designation: string;
    composition: string;
    mechanicalProperties: Record<string, string>;
    thermalProperties?: Record<string, string>;
    corrosionResistance: string;
    cost: string;
    availability: string;
  }>;
  evaluation: {
    weightedCriteria: Array<{ criterion: string; weight: number; scores: Record<string, number> }>;
    decisionMatrix: string;
  };
  recommendation: {
    selectedMaterial: string;
    justification: string;
    alternatives: string[];
  };
  specifications: {
    purchaseSpecification: string;
    incomingInspection: string;
    storageRequirements: string;
  };
  appendices: string[];
}

export interface EngineeringDrawing {
  id: string;
  title: string;
  drawingInfo: {
    drawingNumber: string;
    revision: string;
    scale: string;
    sheetSize: string;
    date: string;
    drafter: string;
    checker: string;
  };
  drawingType: string;
  views: Array<{
    viewName: string;
    orientation: string;
    scale: string;
    description: string;
  }>;
  dimensions: {
    generalTolerances: string;
    specificTolerances: Array<{ dimension: string; tolerance: string }>;
  };
  gdntSymbols: string[];
  notes: string[];
  materials: {
    materialSpecification: string;
    finish: string;
    treatment: string;
  };
  revisions: Array<{ revision: string; date: string; description: string }>;
}

export interface AssemblyInstructions {
  id: string;
  title: string;
  documentInfo: {
    assemblyNumber: string;
    assemblyName: string;
    revision: string;
    date: string;
    author: string;
  };
  scope: string;
  requiredTools: {
    handTools: string[];
    powerTools: string[];
    measuringInstruments: string[];
    specializedEquipment: string[];
  };
  requiredParts: Array<{
    partNumber: string;
    description: string;
    quantity: number;
    notes?: string;
  }>;
  safetyWarnings: string[];
  assemblySteps: Array<{
    stepNumber: number;
    instruction: string;
    torques?: string;
    adhesives?: string;
    criticalNotes?: string;
    illustrations: string[];
  }>;
  qualityChecks: Array<{ check: string; method: string; acceptanceCriteria: string }>;
  troubleshooting: Array<{ problem: string; cause: string; solution: string }>;
  appendices: string[];
}

export interface DesignRiskAssessment {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    productName: string;
    assessmentDate: string;
    assessmentTeam: string[];
  };
  scope: string;
  riskIdentification: {
    hazards: Array<{
      hazard: string;
      potentialHarm: string;
      severity: string;
      probability: string;
      riskLevel: string;
      controls: string[];
    }>;
  };
  riskEvaluation: {
    severityMatrix: string;
    probabilityMatrix: string;
    riskMatrix: string;
  };
  riskControl: {
    elimination: string[];
    substitution: string[];
    engineeringControls: string[];
    administrativeControls: string[];
    ppe: string[];
  };
  residualRisk: {
    remainingRisks: string[];
    acceptability: string;
  };
  conclusions: string[];
  approvals: Array<{ name: string; role: string; signature: string; date: string }>;
}

export interface TestProcedure {
  id: string;
  title: string;
  documentInfo: {
    procedureNumber: string;
    revision: string;
    effectiveDate: string;
    preparedBy: string;
    reviewedBy: string;
    approvedBy: string;
  };
  scope: string;
  referencedDocuments: string[];
  definitions: string[];
  testEquipment: Array<{
    equipment: string;
    model: string;
    serialNumber: string;
    calibrationDate: string;
    accuracy: string;
  }>;
  testSetup: {
    diagram: string;
    procedure: string;
    safetyPrecautions: string[];
  };
  testProcedure: Array<{
    stepNumber: number;
    instruction: string;
    acceptanceCriteria: string;
    dataToRecord: string;
  }>;
  dataSheet: string;
  acceptanceCriteria: string[];
  nonConformance: string;
  appendices: string[];
}

export interface EngineeringChangeOrder {
  id: string;
  title: string;
  changeInfo: {
    ecoNumber: string;
    dateInitiated: string;
    originator: string;
    affectedParts: string[];
  };
  descriptionOfChange: {
    before: string;
    after: string;
    reason: string;
    benefit: string;
  };
  affectedDocuments: Array<{
    documentNumber: string;
    title: string;
    changeRequired: string;
  }>;
  impactAssessment: {
    designImpact: string;
    manufacturingImpact: string;
    qualityImpact: string;
    costImpact: string;
    scheduleImpact: string;
  };
  implementation: {
    provisionalApproval: string;
    finalApproval: string;
    effectiveDate: string;
    rolloutPlan: string;
  };
  approvals: Array<{ name: string; role: string; signature: string; date: string }>;
  attachments: string[];
}

export interface HeatTransferAnalysis {
  id: string;
  title: string;
  projectInfo: {
    projectName: string;
    componentName: string;
    analysisType: string;
    date: string;
    analyst: string;
  };
  introduction: {
    purpose: string;
    scope: string;
    objectives: string[];
  };
  thermalModel: {
    geometry: string;
    materials: Array<{ material: string; thermalProperties: Record<string, string> }>;
    initialConditions: string;
  };
  boundaryConditions: {
    convection: Array<{ surface: string; h: string; Tinf: string }>;
    radiation: Array<{ surface: string; emissivity: string; viewFactor?: string }>;
    heatFlux: Array<{ surface: string; q: string }>;
    heatSources: Array<{ location: string; power: string }>;
  };
  results: {
    temperatureDistribution: string;
    maxTemperature: string;
    minTemperature: string;
    thermalGradients: string;
    heatFlowRates: string;
    thermalStresses?: string;
  };
  validation: {
    assumptions: string[];
    simplifications: string[];
    comparisonWithAnalytical?: string;
    comparisonWithTest?: string;
  };
  conclusions: {
    summary: string;
    thermalComfort?: string;
    thermalFatigue?: string;
    recommendations: string[];
  };
  appendices: string[];
}

export interface MaintenanceManual {
  id: string;
  title: string;
  documentInfo: {
    equipmentName: string;
    modelNumber: string;
    serialNumber: string;
    manualNumber: string;
    revision: string;
    date: string;
  };
  introduction: {
    purpose: string;
    scope: string;
    equipmentDescription: string;
  };
  safety: {
    generalSafetyWarnings: string[];
    specificHazards: string[];
    lockoutTagout: string;
    ppeRequirements: string[];
  };
  technicalData: {
    specifications: Record<string, string>;
    performanceData: Record<string, string>;
    lubricationSchedule: Array<{ component: string; lubricant: string; quantity: string; interval: string }>;
  };
  maintenance: {
    dailyChecks: string[];
    weeklyChecks: string[];
    monthlyChecks: string[];
    quarterlyChecks: string[];
    annualChecks: string[];
  };
  troubleshooting: Array<{
    fault: string;
    possibleCause: string;
    remedy: string;
  }>;
  partsList: Array<{
    partNumber: string;
    description: string;
    quantity: string;
    sparePartRating: string;
  }>;
  diagrams: {
    schematicDiagrams: string[];
    wiringDiagrams: string[];
    explodedViews: string[];
  };
  appendices: string[];
}

export interface ExpertConsultation {
  id: string;
  title: string;
  consultationInfo: {
    consultationDate: string;
    client: string;
    engineer: string;
    specialization: string;
  };
  query: {
    subject: string;
    description: string;
    context: string;
    constraints: string[];
  };
  analysis: {
    approach: string;
    methodology: string;
    considerations: string[];
  };
  recommendations: Array<{
    recommendation: string;
    rationale: string;
    alternatives?: string[];
    priority: string;
  }>;
  references: string[];
  limitations: string[];
  followUp: string;
}

// Document generators
export function generateCFDReport(data: Partial<CFDReport>): CFDReport {
  return {
    id: `CFD-${Date.now()}`,
    title: data.title || 'Computational Fluid Dynamics Analysis Report',
    projectInfo: data.projectInfo || {
      projectName: '',
      projectNumber: '',
      client: '',
      date: new Date().toISOString().split('T')[0],
      engineer: ''
    },
    introduction: data.introduction || {
      purpose: '',
      scope: '',
      objectives: []
    },
    geometryDescription: data.geometryDescription || {
      dimensions: {},
      boundaryConditions: [],
      meshInformation: ''
    },
    materialProperties: data.materialProperties || {
      fluidType: '',
      density: '',
      viscosity: ''
    },
    boundaryConditions: data.boundaryConditions || {
      inlets: [],
      outlets: [],
      walls: []
    },
    solverSettings: data.solverSettings || {
      solver: '',
      turbulenceModel: '',
      discretization: '',
      convergenceCriteria: '',
      iterations: 0
    },
    results: data.results || {
      velocityField: '',
      pressureDistribution: '',
      streamlines: '',
      vorticityAnalysis: ''
    },
    conclusions: data.conclusions || [],
    recommendations: data.recommendations || [],
    appendices: data.appendices || []
  };
}

export function generateDesignReviewPresentation(data: Partial<DesignReviewPresentation>): DesignReviewPresentation {
  return {
    id: `DRP-${Date.now()}`,
    title: data.title || 'Design Review Presentation',
    projectInfo: data.projectInfo || {
      projectName: '',
      projectNumber: '',
      revision: '',
      date: new Date().toISOString().split('T')[0],
      presenter: ''
    },
    attendees: data.attendees || [],
    agenda: data.agenda || [],
    designOverview: data.designOverview || {
      productDescription: '',
      targetApplications: [],
      keyRequirements: [],
      constraints: []
    },
    designAnalysis: data.designAnalysis || {
      functionalAnalysis: '',
      materialSelection: '',
      manufacturingConsiderations: '',
      costAnalysis: ''
    },
    riskAssessment: data.riskAssessment || {
      identifiedRisks: [],
      riskMatrix: ''
    },
    decisions: data.decisions || {
      approvedItems: [],
      pendingItems: [],
      actionItems: []
    },
    nextSteps: data.nextSteps || [],
    appendices: data.appendices || []
  };
}

export function generateFailureAnalysisReport(data: Partial<FailureAnalysisReport>): FailureAnalysisReport {
  return {
    id: `FAR-${Date.now()}`,
    title: data.title || 'Failure Analysis Report',
    projectInfo: data.projectInfo || {
      equipmentName: '',
      serialNumber: '',
      location: '',
      failureDate: '',
      reportDate: new Date().toISOString().split('T')[0],
      analyst: ''
    },
    executiveSummary: data.executiveSummary || '',
    background: data.background || {
      equipmentDescription: '',
      operatingConditions: '',
      serviceHistory: ''
    },
    failureDescription: data.failureDescription || {
      failureMode: '',
      symptoms: [],
      failureSequence: '',
      photographs: []
    },
    analysis: data.analysis || {
      visualInspection: ''
    },
    rootCause: data.rootCause || {
      primaryCause: '',
      contributingFactors: [],
      mechanism: ''
    },
    conclusions: data.conclusions || [],
    recommendations: data.recommendations || [],
    appendices: data.appendices || []
  };
}

export function generateComponentSelectionReport(data: Partial<ComponentSelectionReport>): ComponentSelectionReport {
  return {
    id: `CSR-${Date.now()}`,
    title: data.title || 'Component Selection Report',
    projectInfo: data.projectInfo || {
      projectName: '',
      componentName: '',
      date: new Date().toISOString().split('T')[0],
      engineer: ''
    },
    selectionCriteria: data.selectionCriteria || {
      functionalRequirements: [],
      performanceRequirements: [],
      environmentalRequirements: [],
      costConstraints: [],
      regulatoryRequirements: []
    },
    candidateComponents: data.candidateComponents || [],
    evaluationMatrix: data.evaluationMatrix || [],
    selectionDecision: data.selectionDecision || {
      selectedComponent: '',
      justification: '',
      alternatives: []
    },
    implementationNotes: data.implementationNotes || [],
    appendices: data.appendices || []
  };
}

export function generateDesignValidationReport(data: Partial<DesignValidationReport>): DesignValidationReport {
  return {
    id: `DVR-${Date.now()}`,
    title: data.title || 'Design Validation Report',
    projectInfo: data.projectInfo || {
      projectName: '',
      productNumber: '',
      version: '',
      validationDate: new Date().toISOString().split('T')[0],
      validationTeam: []
    },
    designSpecifications: data.designSpecifications || {
      dimensionalRequirements: {},
      materialRequirements: [],
      performanceRequirements: {},
      safetyRequirements: []
    },
    validationPlan: data.validationPlan || {
      testMethods: [],
      equipmentUsed: [],
      testConditions: '',
      sampleSize: 0
    },
    results: data.results || {
      dimensionalChecks: [],
      performanceTests: [],
      safetyTests: [],
      environmentalTests: []
    },
    deviations: data.deviations || [],
    conclusions: data.conclusions || {
      overallStatus: '',
      summary: '',
      remainingIssues: []
    },
    approvals: data.approvals || []
  };
}

export function generateFEAReport(data: Partial<FEAReport>): FEAReport {
  return {
    id: `FEA-${Date.now()}`,
    title: data.title || 'Finite Element Analysis Report',
    projectInfo: data.projectInfo || {
      projectName: '',
      componentName: '',
      analysisType: '',
      date: new Date().toISOString().split('T')[0],
      analyst: ''
    },
    introduction: data.introduction || {
      purpose: '',
      scope: '',
      objectives: []
    },
    modelDescription: data.modelDescription || {
      geometry: '',
      mesh: {
        elementType: '',
        elementSize: '',
        nodeCount: 0,
        elementCount: 0,
        meshQuality: ''
      },
      materialModels: []
    },
    boundaryConditions: data.boundaryConditions || {
      loads: [],
      constraints: []
    },
    results: data.results || {
      displacement: {
        maxDisplacement: '',
        location: '',
        contourDescription: ''
      },
      stress: {
        maxVonMises: '',
        location: '',
        fsf: '',
        contourDescription: ''
      },
      strain: {
        maxStrain: '',
        location: ''
      }
    },
    conclusions: data.conclusions || {
      summary: '',
      designAdequacy: '',
      recommendations: []
    },
    appendices: data.appendices || []
  };
}

export function generateProductPerformanceReport(data: Partial<ProductPerformanceReport>): ProductPerformanceReport {
  return {
    id: `PPR-${Date.now()}`,
    title: data.title || 'Product Performance Report',
    projectInfo: data.projectInfo || {
      productName: '',
      modelNumber: '',
      testPeriod: '',
      reportDate: new Date().toISOString().split('T')[0]
    },
    executiveSummary: data.executiveSummary || '',
    productDescription: data.productDescription || '',
    testConditions: data.testConditions || {
      environment: '',
      loading: '',
      duration: '',
      sampleSize: 0
    },
    performanceMetrics: data.performanceMetrics || {
      efficiency: [],
      reliability: [],
      durability: []
    },
    testResults: data.testResults || {
      laboratoryTests: [],
      fieldTests: []
    },
    analysis: data.analysis || {
      statisticalAnalysis: '',
      trendAnalysis: '',
      comparisonWithSpecs: ''
    },
    conclusions: data.conclusions || {
      overallPerformance: '',
      conformanceToSpecs: '',
      issuesIdentified: []
    },
    recommendations: data.recommendations || []
  };
}

export function generateToleranceAnalysisReport(data: Partial<ToleranceAnalysisReport>): ToleranceAnalysisReport {
  return {
    id: `TAR-${Date.now()}`,
    title: data.title || 'Tolerance Analysis Report',
    projectInfo: data.projectInfo || {
      assemblyName: '',
      partNumbers: [],
      date: new Date().toISOString().split('T')[0],
      engineer: ''
    },
    introduction: data.introduction || {
      purpose: '',
      scope: '',
      assemblyDescription: ''
    },
    toleranceStackup: data.toleranceStackup || {
      criticalDimensions: [],
      stackupAnalysis: '',
      worstCaseAnalysis: '',
      statisticalAnalysis: ''
    },
    gdntRequirements: data.gdntRequirements || {
      geometricControls: [],
      datumReferences: [],
      toleranceZones: []
    },
    analysis: data.analysis || {
      sensitivityAnalysis: '',
      processCapability: [],
      sigmaLevel: ''
    },
    conclusions: data.conclusions || {
      feasibility: '',
      riskAssessment: '',
      recommendations: []
    },
    appendices: data.appendices || []
  };
}

export function generateManufacturingProcessPlan(data: Partial<ManufacturingProcessPlan>): ManufacturingProcessPlan {
  return {
    id: `MPP-${Date.now()}`,
    title: data.title || 'Manufacturing Process Plan',
    projectInfo: data.projectInfo || {
      partName: '',
      partNumber: '',
      revision: '',
      date: new Date().toISOString().split('T')[0],
      processPlanner: ''
    },
    partDescription: data.partDescription || {
      material: '',
      materialSpecification: '',
      weight: '',
      dimensions: {}
    },
    processSequence: data.processSequence || [],
    materialRemoval: data.materialRemoval || {
      initialWeight: '',
      finalWeight: '',
      removalPercentage: ''
    },
    qualityRequirements: data.qualityRequirements || {
      inspectionPoints: [],
      criticalCharacteristics: [],
      gaugeRequirements: []
    },
    safetyNotes: data.safetyNotes || [],
    appendices: data.appendices || []
  };
}

export function generateMaterialSelectionReport(data: Partial<MaterialSelectionReport>): MaterialSelectionReport {
  return {
    id: `MSR-${Date.now()}`,
    title: data.title || 'Material Selection Report',
    projectInfo: data.projectInfo || {
      componentName: '',
      application: '',
      date: new Date().toISOString().split('T')[0],
      engineer: ''
    },
    designRequirements: data.designRequirements || {
      mechanicalRequirements: [],
      thermalRequirements: [],
      corrosionRequirements: [],
      costConstraints: [],
      manufacturingRequirements: []
    },
    candidateMaterials: data.candidateMaterials || [],
    evaluation: data.evaluation || {
      weightedCriteria: [],
      decisionMatrix: ''
    },
    recommendation: data.recommendation || {
      selectedMaterial: '',
      justification: '',
      alternatives: []
    },
    specifications: data.specifications || {
      purchaseSpecification: '',
      incomingInspection: '',
      storageRequirements: ''
    },
    appendices: data.appendices || []
  };
}

export function generateEngineeringDrawing(data: Partial<EngineeringDrawing>): EngineeringDrawing {
  return {
    id: `ED-${Date.now()}`,
    title: data.title || 'Engineering Drawing',
    drawingInfo: data.drawingInfo || {
      drawingNumber: '',
      revision: '',
      scale: '1:1',
      sheetSize: 'A4',
      date: new Date().toISOString().split('T')[0],
      drafter: '',
      checker: ''
    },
    drawingType: data.drawingType || '',
    views: data.views || [],
    dimensions: data.dimensions || {
      generalTolerances: '',
      specificTolerances: []
    },
    gdntSymbols: data.gdntSymbols || [],
    notes: data.notes || [],
    materials: data.materials || {
      materialSpecification: '',
      finish: '',
      treatment: ''
    },
    revisions: data.revisions || []
  };
}

export function generateAssemblyInstructions(data: Partial<AssemblyInstructions>): AssemblyInstructions {
  return {
    id: `AI-${Date.now()}`,
    title: data.title || 'Assembly Instructions',
    documentInfo: data.documentInfo || {
      assemblyNumber: '',
      assemblyName: '',
      revision: '',
      date: new Date().toISOString().split('T')[0],
      author: ''
    },
    scope: data.scope || '',
    requiredTools: data.requiredTools || {
      handTools: [],
      powerTools: [],
      measuringInstruments: [],
      specializedEquipment: []
    },
    requiredParts: data.requiredParts || [],
    safetyWarnings: data.safetyWarnings || [],
    assemblySteps: data.assemblySteps || [],
    qualityChecks: data.qualityChecks || [],
    troubleshooting: data.troubleshooting || [],
    appendices: data.appendices || []
  };
}

export function generateDesignRiskAssessment(data: Partial<DesignRiskAssessment>): DesignRiskAssessment {
  return {
    id: `DRA-${Date.now()}`,
    title: data.title || 'Design Risk Assessment',
    projectInfo: data.projectInfo || {
      projectName: '',
      productName: '',
      assessmentDate: new Date().toISOString().split('T')[0],
      assessmentTeam: []
    },
    scope: data.scope || '',
    riskIdentification: data.riskIdentification || {
      hazards: []
    },
    riskEvaluation: data.riskEvaluation || {
      severityMatrix: '',
      probabilityMatrix: '',
      riskMatrix: ''
    },
    riskControl: data.riskControl || {
      elimination: [],
      substitution: [],
      engineeringControls: [],
      administrativeControls: [],
      ppe: []
    },
    residualRisk: data.residualRisk || {
      remainingRisks: [],
      acceptability: ''
    },
    conclusions: data.conclusions || [],
    approvals: data.approvals || []
  };
}

export function generateTestProcedure(data: Partial<TestProcedure>): TestProcedure {
  return {
    id: `TP-${Date.now()}`,
    title: data.title || 'Test Procedure',
    documentInfo: data.documentInfo || {
      procedureNumber: '',
      revision: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      preparedBy: '',
      reviewedBy: '',
      approvedBy: ''
    },
    scope: data.scope || '',
    referencedDocuments: data.referencedDocuments || [],
    definitions: data.definitions || [],
    testEquipment: data.testEquipment || [],
    testSetup: data.testSetup || {
      diagram: '',
      procedure: '',
      safetyPrecautions: []
    },
    testProcedure: data.testProcedure || [],
    dataSheet: data.dataSheet || '',
    acceptanceCriteria: data.acceptanceCriteria || [],
    nonConformance: data.nonConformance || '',
    appendices: data.appendices || []
  };
}

export function generateEngineeringChangeOrder(data: Partial<EngineeringChangeOrder>): EngineeringChangeOrder {
  return {
    id: `ECO-${Date.now()}`,
    title: data.title || 'Engineering Change Order',
    changeInfo: data.changeInfo || {
      ecoNumber: '',
      dateInitiated: new Date().toISOString().split('T')[0],
      originator: '',
      affectedParts: []
    },
    descriptionOfChange: data.descriptionOfChange || {
      before: '',
      after: '',
      reason: '',
      benefit: ''
    },
    affectedDocuments: data.affectedDocuments || [],
    impactAssessment: data.impactAssessment || {
      designImpact: '',
      manufacturingImpact: '',
      qualityImpact: '',
      costImpact: '',
      scheduleImpact: ''
    },
    implementation: data.implementation || {
      provisionalApproval: '',
      finalApproval: '',
      effectiveDate: '',
      rolloutPlan: ''
    },
    approvals: data.approvals || [],
    attachments: data.attachments || []
  };
}

export function generateHeatTransferAnalysis(data: Partial<HeatTransferAnalysis>): HeatTransferAnalysis {
  return {
    id: `HTA-${Date.now()}`,
    title: data.title || 'Heat Transfer Analysis Report',
    projectInfo: data.projectInfo || {
      projectName: '',
      componentName: '',
      analysisType: '',
      date: new Date().toISOString().split('T')[0],
      analyst: ''
    },
    introduction: data.introduction || {
      purpose: '',
      scope: '',
      objectives: []
    },
    thermalModel: data.thermalModel || {
      geometry: '',
      materials: [],
      initialConditions: ''
    },
    boundaryConditions: data.boundaryConditions || {
      convection: [],
      radiation: [],
      heatFlux: [],
      heatSources: []
    },
    results: data.results || {
      temperatureDistribution: '',
      maxTemperature: '',
      minTemperature: '',
      thermalGradients: '',
      heatFlowRates: ''
    },
    validation: data.validation || {
      assumptions: [],
      simplifications: []
    },
    conclusions: data.conclusions || {
      summary: '',
      recommendations: []
    },
    appendices: data.appendices || []
  };
}

export function generateMaintenanceManual(data: Partial<MaintenanceManual>): MaintenanceManual {
  return {
    id: `MM-${Date.now()}`,
    title: data.title || 'Maintenance Manual',
    documentInfo: data.documentInfo || {
      equipmentName: '',
      modelNumber: '',
      serialNumber: '',
      manualNumber: '',
      revision: '',
      date: new Date().toISOString().split('T')[0]
    },
    introduction: data.introduction || {
      purpose: '',
      scope: '',
      equipmentDescription: ''
    },
    safety: data.safety || {
      generalSafetyWarnings: [],
      specificHazards: [],
      lockoutTagout: '',
      ppeRequirements: []
    },
    technicalData: data.technicalData || {
      specifications: {},
      performanceData: {},
      lubricationSchedule: []
    },
    maintenance: data.maintenance || {
      dailyChecks: [],
      weeklyChecks: [],
      monthlyChecks: [],
      quarterlyChecks: [],
      annualChecks: []
    },
    troubleshooting: data.troubleshooting || [],
    partsList: data.partsList || [],
    diagrams: data.diagrams || {
      schematicDiagrams: [],
      wiringDiagrams: [],
      explodedViews: []
    },
    appendices: data.appendices || []
  };
}

export function generateExpertConsultation(data: Partial<ExpertConsultation>): ExpertConsultation {
  return {
    id: `EC-${Date.now()}`,
    title: data.title || 'Expert Consultation: Mechanical Engineer',
    consultationInfo: data.consultationInfo || {
      consultationDate: new Date().toISOString().split('T')[0],
      client: '',
      engineer: '',
      specialization: ''
    },
    query: data.query || {
      subject: '',
      description: '',
      context: '',
      constraints: []
    },
    analysis: data.analysis || {
      approach: '',
      methodology: '',
      considerations: []
    },
    recommendations: data.recommendations || [],
    references: data.references || [],
    limitations: data.limitations || [],
    followUp: data.followUp || ''
  };
}

// Main function to generate any mechanical engineering document
export function generateMechanicalDocument(
  documentType: string,
  data?: Record<string, unknown>
): CFDReport | DesignReviewPresentation | FailureAnalysisReport | ComponentSelectionReport | DesignValidationReport | FEAReport | ProductPerformanceReport | ToleranceAnalysisReport | ManufacturingProcessPlan | MaterialSelectionReport | EngineeringDrawing | AssemblyInstructions | DesignRiskAssessment | TestProcedure | EngineeringChangeOrder | HeatTransferAnalysis | MaintenanceManual | ExpertConsultation {
  switch (documentType) {
    case 'cfd':
      return generateCFDReport(data as Partial<CFDReport>);
    case 'design-review':
      return generateDesignReviewPresentation(data as Partial<DesignReviewPresentation>);
    case 'failure-analysis':
      return generateFailureAnalysisReport(data as Partial<FailureAnalysisReport>);
    case 'component-selection':
      return generateComponentSelectionReport(data as Partial<ComponentSelectionReport>);
    case 'design-validation':
      return generateDesignValidationReport(data as Partial<DesignValidationReport>);
    case 'fea':
      return generateFEAReport(data as Partial<FEAReport>);
    case 'product-performance':
      return generateProductPerformanceReport(data as Partial<ProductPerformanceReport>);
    case 'tolerance-analysis':
      return generateToleranceAnalysisReport(data as Partial<ToleranceAnalysisReport>);
    case 'manufacturing-process':
      return generateManufacturingProcessPlan(data as Partial<ManufacturingProcessPlan>);
    case 'material-selection':
      return generateMaterialSelectionReport(data as Partial<MaterialSelectionReport>);
    case 'engineering-drawing':
      return generateEngineeringDrawing(data as Partial<EngineeringDrawing>);
    case 'assembly-instructions':
      return generateAssemblyInstructions(data as Partial<AssemblyInstructions>);
    case 'design-risk':
      return generateDesignRiskAssessment(data as Partial<DesignRiskAssessment>);
    case 'test-procedure':
      return generateTestProcedure(data as Partial<TestProcedure>);
    case 'engineering-change':
      return generateEngineeringChangeOrder(data as Partial<EngineeringChangeOrder>);
    case 'heat-transfer':
      return generateHeatTransferAnalysis(data as Partial<HeatTransferAnalysis>);
    case 'maintenance-manual':
      return generateMaintenanceManual(data as Partial<MaintenanceManual>);
    case 'expert-consultation':
      return generateExpertConsultation(data as Partial<ExpertConsultation>);
    default:
      throw new Error(`Unknown document type: ${documentType}`);
  }
}

// Document type metadata
export const mechanicalDocumentTypes = [
  { id: 'cfd', name: 'Computational Fluid Dynamics Report', icon: '🌊', category: 'Analysis' },
  { id: 'design-review', name: 'Design Review Presentation', icon: '🎨', category: 'Review' },
  { id: 'failure-analysis', name: 'Failure Analysis Report', icon: '📉', category: 'Analysis' },
  { id: 'component-selection', name: 'Component Selection Report', icon: '📊', category: 'Selection' },
  { id: 'design-validation', name: 'Design Validation Report', icon: '📊', category: 'Validation' },
  { id: 'fea', name: 'Finite Element Analysis Report', icon: '📊', category: 'Analysis' },
  { id: 'product-performance', name: 'Product Performance Report', icon: '📊', category: 'Performance' },
  { id: 'tolerance-analysis', name: 'Tolerance Analysis Report', icon: '📊', category: 'Analysis' },
  { id: 'manufacturing-process', name: 'Manufacturing Process Plans Document', icon: '📋', category: 'Manufacturing' },
  { id: 'material-selection', name: 'Material Selection Report', icon: '📋', category: 'Selection' },
  { id: 'engineering-drawing', name: 'Engineering Drawings', icon: '📐', category: 'Drawing' },
  { id: 'assembly-instructions', name: 'Assembly Instructions Document', icon: '📑', category: 'Documentation' },
  { id: 'design-risk', name: 'Design Risk Assessments Document', icon: '📝', category: 'Risk' },
  { id: 'test-procedure', name: 'Test Procedures Document', icon: '📝', category: 'Testing' },
  { id: 'engineering-change', name: 'Engineering Change Orders Document', icon: '📝', category: 'Change Management' },
  { id: 'heat-transfer', name: 'Heat Transfer Analysis Report', icon: '🔥', category: 'Analysis' },
  { id: 'expert-consultation', name: 'Consult an Expert: Mechanical Engineer', icon: '🔧', category: 'Consultation' },
  { id: 'maintenance-manual', name: 'Maintenance Manual', icon: '🔧', category: 'Maintenance' }
];

// Standards and references
export const mechanicalStandards = {
  asme: [
    'ASME Y14.5 - Dimensioning and Tolerancing',
    'ASME B31.1 - Power Piping',
    'ASME B31.3 - Process Piping',
    'ASME Section VIII - Pressure Vessels',
    'ASME PTC - Performance Test Codes'
  ],
  iso: [
    'ISO 9001 - Quality Management',
    'ISO 14001 - Environmental Management',
    'ISO 45001 - Occupational Health and Safety',
    'ISO 2768 - General Tolerances',
    'ISO 1101 - Geometrical Product Specifications'
  ],
  astm: [
    'ASTM A370 - Mechanical Testing of Steel Products',
    'ASTM E8 - Tension Testing of Metallic Materials',
    'ASTM E18 - Rockwell Hardness',
    'ASTM E10 - Brinell Hardness'
  ],
  references: [
    'Shigley\'s Mechanical Engineering Design (Budynas & Nisbett, 2020)',
    'Machine Design (Mott, 2018)',
    'Engineering Design: A Systematic Approach (Bhandari, 2010)',
    'Fundamentals of Heat and Mass Transfer (Incropera & DeWitt, 2020)',
    'Finite Element Analysis: Theory and Application with ANSYS (Moaveni, 2019)'
  ]
};
