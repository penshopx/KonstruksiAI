/**
 * Incident Reports Document
 * 
 * Comprehensive incident reporting and investigation framework
 * for electrical engineering projects in Indonesia.
 * 
 * Based on best practices from:
 * - Frank P. Lees (2012) - Incident Investigation and Accident Prevention
 * - Alan J. Stolzer et al. (2014) - Safety Management Systems in Aviation
 * - Joan van Emden & Lucinda Becker (2010) - Effective Communication for Science and Technology
 * 
 * Aligned with:
 * - K3 (Keselamatan dan Kesehatan Kerja) regulations
 * - PUIL 2011 (Standar Nasional Indonesia for electrical installations)
 * - ISO 45001:2018 - Occupational Health and Safety Management
 */

// Incident Types
export type IncidentType = 
  | 'electrical_accident'
  | 'fire_explosion'
  | 'fall_from_height'
  | 'mechanical_injury'
  | 'chemical_exposure'
  | 'equipment_failure'
  | 'near_miss'
  | 'property_damage'
  | 'environmental'
  | 'security'
  | 'other';

export type IncidentSeverity = 
  | '1' // Catastrophic - Death or permanent disability
  | '2' // Critical - Serious injury or major property damage
  | '3' // Moderate - Minor injury or moderate property damage
  | '4' // Minor - First aid treatment only
  | '5' // Insignificant - No injury, no property damage;

export type IncidentStatus = 
  | 'reported'
  | 'investigating'
  | 'corrective_action_required'
  | 'corrective_action_completed'
  | 'closed'
  | 'appeal';

// Incident Category Definitions
export const incidentCategories: Record<IncidentType, {
  name: string;
  description: string;
  examples: string[];
}> = {
  electrical_accident: {
    name: 'Electrical Accident',
    description: 'Incidents involving electrical shock, arc flash, electrical burns, or electrocution',
    examples: [
      'Worker receives electric shock from exposed conductor',
      'Arc flash causes burns to personnel',
      'Electrical equipment catches fire',
      'Improper grounding causes shock hazard',
      'Contact with overhead power lines'
    ]
  },
  fire_explosion: {
    name: 'Fire/Explosion',
    description: 'Fires or explosions occurring in the workplace',
    examples: [
      'Electrical fire in switchgear room',
      'Cable fire due to overload',
      'Transformer oil fire',
      'Explosion in confined space',
      'Spark from welding ignites materials'
    ]
  },
  fall_from_height: {
    name: 'Fall from Height',
    description: 'Falls from elevated work positions',
    examples: [
      'Fall from scaffolding during installation',
      'Fall from ladder while accessing equipment',
      'Fall into open shaft or excavation',
      'Fall from elevated platform'
    ]
  },
  mechanical_injury: {
    name: 'Mechanical Injury',
    description: 'Injuries caused by mechanical equipment or moving parts',
    examples: [
      'Caught in rotating equipment',
      'Struck by falling objects',
      'Crushed by heavy equipment',
      'Pinch points in machinery',
      'Cut from sharp edges or tools'
    ]
  },
  chemical_exposure: {
    name: 'Chemical Exposure',
    description: 'Exposure to hazardous chemicals or substances',
    examples: [
      'Skin contact with transformer oil',
      'Inhalation of fumes from welding',
      'Eye contact with cleaning chemicals',
      'Asbestos exposure during demolition',
      'Lead exposure from old cables'
    ]
  },
  equipment_failure: {
    name: 'Equipment Failure',
    description: 'Failure of electrical or mechanical equipment',
    examples: [
      'Transformer failure during operation',
      'Circuit breaker fails to trip',
      'Crane collapse or failure',
      'Scaffolding collapse',
      'Power system blackout'
    ]
  },
  near_miss: {
    name: 'Near Miss',
    description: 'Incidents that could have resulted in injury or damage but did not',
    examples: [
      'Worker almost contacts live conductor',
      'Object falls but misses personnel',
      'Equipment malfunctions but is caught in time',
      'Trip hazard identified before accident',
      'Arc flash almost occurs'
    ]
  },
  property_damage: {
    name: 'Property Damage',
    description: 'Damage to property, equipment, or structures',
    examples: [
      'Cable damage during excavation',
      'Equipment dropped during installation',
      'Vehicle collision with structure',
      'Water damage to electrical systems',
      'Lightning strike damage'
    ]
  },
  environmental: {
    name: 'Environmental Incident',
    description: 'Incidents affecting the environment',
    examples: [
      'Oil spill from transformer',
      'Chemical release to environment',
      'Improper waste disposal',
      'Air pollution incident',
      'Soil contamination'
    ]
  },
  security: {
    name: 'Security Incident',
    description: 'Security breaches or theft',
    examples: [
      'Theft of copper cables',
      'Unauthorized entry to site',
      'Vandalism of equipment',
      'Assault on personnel',
      'Intrusion detection'
    ]
  },
  other: {
    name: 'Other Incident',
    description: 'Incidents not fitting other categories',
    examples: [
      'Other workplace incidents',
      'Miscellaneous safety events',
      'Uncategorized near misses'
    ]
  }
};

// Severity Matrix
export const severityMatrix: Record<IncidentSeverity, {
  level: number;
  name: string;
  color: string;
  description: string;
  examples: string[];
}> = {
  '1': {
    level: 1,
    name: 'Catastrophic',
    color: '#DC2626',
    description: 'Death or permanent disability',
    examples: [
      "Worker's death due to electrocution",
      'Permanent disability from electrical burns',
      'Fall resulting in spinal injury',
      'Chemical exposure causing chronic illness'
    ]
  },
  '2': {
    level: 2,
    name: 'Critical',
    color: '#EA580C',
    description: 'Serious injury or major property damage',
    examples: [
      'Hospitalization required (more than 24 hours)',
      'Lost time injury (LTI)',
      'Major equipment destruction',
      'Significant fire damage'
    ]
  },
  '3': {
    level: 3,
    name: 'Moderate',
    color: '#CA8A04',
    description: 'Minor injury or moderate property damage',
    examples: [
      'Medical treatment required',
      'First aid beyond simple dressing',
      'Equipment damage requiring repair',
      'Minor fire contained quickly'
    ]
  },
  '4': {
    level: 4,
    name: 'Minor',
    color: '#16A34A',
    description: 'First aid treatment only',
    examples: [
      'Minor cuts or abrasions',
      'Simple first aid treatment',
      'Minor scratches or bruises',
      'No time lost'
    ]
  },
  '5': {
    level: 5,
    name: 'Insignificant',
    color: '#4B5563',
    description: 'No injury, no property damage',
    examples: [
      'Near miss with potential severity',
      'Property damage under threshold',
      'Minor irregularities noted',
      'Potential hazard identified'
    ]
  }
};

// Body Parts Affected
export const bodyParts = [
  'Head/Face',
  'Eyes',
  'Ears',
  'Neck',
  'Shoulder',
  'Upper Arm',
  'Elbow',
  'Forearm',
  'Wrist/Hand',
  'Fingers',
  'Chest',
  'Back/Spine',
  'Abdomen',
  'Hip/Thigh',
  'Knee',
  'Lower Leg',
  'Ankle/Foot',
  'Toes',
  'Multiple Parts',
  'Systemic/Whole Body'
];

// Injury Types
export const injuryTypes = [
  'Electric Shock',
  'Burn (Thermal)',
  'Burn (Chemical)',
  'Burn (Radiation)',
  'Cut/Laceration',
  'Abrasion/Scrapes',
  'Puncture',
  'Contusion/Bruise',
  'Sprain/Strain',
  'Dislocation',
  'Fracture',
  'Crushing Injury',
  'Amputation',
  'Asphyxiation',
  'Poisoning',
  'Hearing Loss',
  'Vision Loss',
  'Internal Injury',
  'Cardiac Event',
  'Heat/Cold Stress',
  'Psychological Trauma',
  'No Injury (Near Miss)'
];

// Incident Report Form Structure
export interface IncidentReport {
  // Basic Information
  reportId: string;
  incidentNumber: string;
  status: IncidentStatus;
  
  // Date & Time
  incidentDate: string;
  incidentTime: string;
  reportedDate: string;
  reportedTime: string;
  
  // Location
  projectName: string;
  projectLocation: string;
  specificLocation: string;
  locationDescription: string;
  
  // Incident Classification
  incidentType: IncidentType;
  severity: IncidentSeverity;
  bodyPartsAffected: string[];
  injuryTypes: string[];
  
  // Persons Involved
  personsInvolved: {
    name: string;
    position: string;
    department: string;
    employmentType: 'permanent' | 'contractor' | 'visitor' | 'third_party';
    yearsOfExperience: number;
    trainingCurrent: boolean;
    ppeUsed: string[];
    injured: boolean;
    hospitalized: boolean;
    fatalities: boolean;
  }[];
  
  // Incident Description
  incidentDescription: string;
  sequenceOfEvents: string;
  environmentalConditions: string;
  workBeingPerformed: string;
  
  // Immediate Actions
  immediateActionsTaken: string[];
  emergencyResponse: {
    firstAidAdministered: boolean;
    firstAidDescription: string;
    emergencyServicesCalled: boolean;
    emergencyServicesDetails: string;
    evacuationRequired: boolean;
    evacuationDetails: string;
  };
  
  // Root Cause Analysis
  rootCauseAnalysis: {
    immediateCause: string;
    underlyingCauses: string[];
    rootCause: string;
    contributingFactors: string[];
    analysisMethod: '5_why' | 'fishbone' | 'fault_tree' | 'other';
    analysisDetails: string;
  };
  
  // Corrective Actions
  correctiveActions: {
    id: string;
    action: string;
    responsibleParty: string;
    targetDate: string;
    completionDate: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_evaluated';
  }[];
  
  // Attachments
  attachments: {
    type: 'photo' | 'video' | 'document' | 'witness_statement' | 'medical_report' | 'police_report';
    description: string;
    fileName: string;
    uploadDate: string;
  }[];
  
  // Witnesses
  witnesses: {
    name: string;
    position: string;
    contactNumber: string;
    statement: string;
    statementDate: string;
  }[];
  
  // Reporting & Approval
  reportedBy: {
    name: string;
    position: string;
    department: string;
    signature: string;
    date: string;
  };
  
  investigatedBy: {
    name: string;
    position: string;
    department: string;
    signature: string;
    date: string;
  };
  
  approvedBy: {
    name: string;
    position: string;
    department: string;
    signature: string;
    date: string;
    decision: 'approved' | 'rejected' | 'needs_revision';
    comments: string;
  };
  
  // Follow-up
  lessonsLearned: string;
  recommendations: string;
  trendIndicators: string[];
  
  // Regulatory Reporting
  regulatoryReporting: {
    reportedToGovernment: boolean;
    governmentAgency: string;
    reportDate: string;
    reportNumber: string;
    reportedToInsurance: boolean;
    insuranceCompany: string;
    claimNumber: string;
    reportedToPolice: boolean;
    policeReportNumber: string;
  };
}

// Create new incident report
export function createIncidentReport(projectName: string): IncidentReport {
  const now = new Date();
  const reportId = `INC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  
  return {
    reportId,
    incidentNumber: reportId,
    status: 'reported',
    incidentDate: now.toISOString().split('T')[0],
    incidentTime: now.toTimeString().slice(0, 5),
    reportedDate: now.toISOString().split('T')[0],
    reportedTime: now.toTimeString().slice(0, 5),
    projectName,
    projectLocation: '',
    specificLocation: '',
    locationDescription: '',
    incidentType: 'other',
    severity: '5',
    bodyPartsAffected: [],
    injuryTypes: [],
    personsInvolved: [],
    incidentDescription: '',
    sequenceOfEvents: '',
    environmentalConditions: '',
    workBeingPerformed: '',
    immediateActionsTaken: [],
    emergencyResponse: {
      firstAidAdministered: false,
      firstAidDescription: '',
      emergencyServicesCalled: false,
      emergencyServicesDetails: '',
      evacuationRequired: false,
      evacuationDetails: ''
    },
    rootCauseAnalysis: {
      immediateCause: '',
      underlyingCauses: [],
      rootCause: '',
      contributingFactors: [],
      analysisMethod: '5_why',
      analysisDetails: ''
    },
    correctiveActions: [],
    attachments: [],
    witnesses: [],
    reportedBy: {
      name: '',
      position: '',
      department: '',
      signature: '',
      date: ''
    },
    investigatedBy: {
      name: '',
      position: '',
      department: '',
      signature: '',
      date: ''
    },
    approvedBy: {
      name: '',
      position: '',
      department: '',
      signature: '',
      date: '',
      decision: 'needs_revision',
      comments: ''
    },
    lessonsLearned: '',
    recommendations: '',
    trendIndicators: [],
    regulatoryReporting: {
      reportedToGovernment: false,
      governmentAgency: '',
      reportDate: '',
      reportNumber: '',
      reportedToInsurance: false,
      insuranceCompany: '',
      claimNumber: '',
      reportedToPolice: false,
      policeReportNumber: ''
    }
  };
}

// Root Cause Analysis Templates
export const rootCauseAnalysisTemplates = {
  fiveWhys: {
    name: '5 Whys Analysis',
    description: 'Iterative questioning technique to identify root cause',
    steps: [
      'Why #1: Why did this incident happen?',
      'Why #2: Why did that occur?',
      'Why #3: Why did that happen?',
      'Why #4: Why did that occur?',
      'Why #5: Why did that happen? (Root Cause)'
    ]
  },
  fishbone: {
    name: 'Ishikawa (Fishbone) Diagram',
    description: 'Categorize causes into major groups',
    categories: [
      'Man (Human Factors)',
      'Machine (Equipment)',
      'Method (Process)',
      'Material',
      'Measurement',
      'Environment'
    ]
  },
  faultTree: {
    name: 'Fault Tree Analysis',
    description: 'Top-down approach using logic gates',
    symbols: [
      'AND Gate: Both events must occur',
      'OR Gate: Either event can occur',
      'NOT Gate: Event is prevented',
      'Intermediate Event: Developed from basic events',
      'Basic Event: Root cause'
    ]
  }
};

// Corrective Action Categories
export const correctiveActionCategories = [
  'Engineering Controls',
  'Administrative Controls',
  'PPE Enhancement',
  'Training',
  'Procedural Changes',
  'Equipment Modification',
  'Supervision Enhancement',
  'Housekeeping',
  'Signage/Warning',
  'Monitoring/Surveillance',
  'Emergency Response',
  'Other'
];

// Reporting Timeline Requirements
export const reportingTimeline = {
  immediate: {
    description: 'Immediate verbal notification required',
    timeframe: 'Within 1 hour',
    notify: [
      'Site Supervisor',
      'HSE Manager',
      'Project Manager'
    ]
  },
  preliminary: {
    description: 'Preliminary written report',
    timeframe: 'Within 24 hours',
    details: [
      'Basic incident description',
      'Persons involved',
      'Immediate actions taken',
      'Preliminary severity assessment'
    ]
  },
  full: {
    description: 'Full incident investigation report',
    timeframe: 'Within 7 days (30 days for serious incidents)',
    details: [
      'Complete incident description',
      'Root cause analysis',
      'Corrective actions',
      'Regulatory reporting if required'
    ]
  }
};

// Regulatory Reporting Requirements (Indonesia)
export const regulatoryRequirements = {
  Kemenaker: {
    description: 'Ministry of Manpower',
    reportable: 'Accidents causing death or serious injury',
    timeframe: 'Within 2x24 hours',
    form: 'Form Pelaporan Kecelakaan Kerja'
  },
  POLRI: {
    description: 'Police',
    reportable: 'Any incident involving death or serious injury',
    timeframe: 'Immediately',
    form: 'Laporan Polisi (Police Report)'
  },
  insurance: {
    description: 'Insurance Company (BPJS TK / Jamsostek)',
    reportable: 'Any work-related injury',
    timeframe: 'Within 24 hours',
    form: 'Form Klaim Jaminan Kecelakaan Kerja'
  },
  DISNAKER: {
    description: 'Local Manpower Office',
    reportable: 'Any work accident',
    timeframe: 'Within 3 days',
    form: 'Laporan Kecelakaan Kerja'
  }
};

// Investigation Checklist
export const investigationChecklist = {
  sceneDocumentation: [
    'Photographs of incident scene',
    'Photographs of equipment involved',
    'Photographs of PPE used',
    'Photographs of environmental conditions',
    'Video documentation if available',
    'Sketch/diagram of incident scene',
    'Measurements and distances',
    'Weather conditions at time of incident'
  ],
  evidenceCollection: [
    'Equipment involved (preserved)',
    'PPE involved (preserved)',
    'Lockout/tagout records',
    'Permit to work documents',
    'Toolbox meeting records',
    'Training records of persons involved',
    'Medical records (with consent)',
    'Previous incident history'
  ],
  interviews: [
    'Person(s) involved',
    'Witnesses',
    'Supervisor',
    'Safety officer',
    'Equipment operator',
    'Any other relevant personnel'
  ],
  documentation: [
    'Daily log / progress report',
    'Shift reports',
    'Maintenance records',
    'Inspection records',
    'Pre-task analysis / JSA',
    'Emergency response records',
    'First aid records',
    'Previous hazard reports'
  ]
};

// Trend Analysis Categories
export const trendCategories = [
  'Incident Type',
  'Location/Area',
  'Time of Day',
  'Day of Week',
  'Department/Team',
  'Employment Type',
  'Experience Level',
  'Equipment Involved',
  'Weather Conditions',
  'Work Activity',
  'Severity',
  'Root Cause Category'
];

// KPI Metrics
export const kpiMetrics = {
  leading: [
    'Number of near-miss reports',
    'Number of hazard observations',
    'Safety training completion rate',
    'Safety meeting attendance',
    'PPE compliance rate',
    'Toolbox talk completion',
    'Pre-task analysis completion',
    'Safety inspection findings closed'
  ],
  lagging: [
    'Total Recordable Incident Rate (TRIR)',
    'Lost Time Injury Rate (LTIR)',
    'Severity Rate',
    'Lost Workday Rate',
    'First Aid Rate',
    'Property Damage Rate',
    'Days Away From Work (DAFW)',
    'Days of Restricted Work (DROW)'
  ]
};

// Form Fields for UI
export const formSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    fields: [
      'incidentNumber',
      'incidentDate',
      'incidentTime',
      'projectName',
      'projectLocation',
      'specificLocation'
    ]
  },
  {
    id: 'incident-details',
    title: 'Incident Details',
    fields: [
      'incidentType',
      'severity',
      'incidentDescription',
      'sequenceOfEvents',
      'environmentalConditions',
      'workBeingPerformed'
    ]
  },
  {
    id: 'persons-involved',
    title: 'Persons Involved',
    fields: [
      'personsInvolved'
    ]
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response',
    fields: [
      'immediateActionsTaken',
      'emergencyResponse'
    ]
  },
  {
    id: 'root-cause',
    title: 'Root Cause Analysis',
    fields: [
      'rootCauseAnalysis'
    ]
  },
  {
    id: 'corrective-actions',
    title: 'Corrective Actions',
    fields: [
      'correctiveActions'
    ]
  },
  {
    id: 'attachments',
    title: 'Attachments & Evidence',
    fields: [
      'attachments',
      'witnesses'
    ]
  },
  {
    id: 'approval',
    title: 'Reporting & Approval',
    fields: [
      'reportedBy',
      'investigatedBy',
      'approvedBy'
    ]
  }
];
