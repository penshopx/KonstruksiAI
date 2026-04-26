/**
 * Vendor Evaluations Document
 * 
 * Comprehensive evaluation framework for electrical equipment vendors
 * in Indonesian construction and infrastructure projects.
 * 
 * Based on best practices from:
 * - Joseph A. Fleming (2018) - The Vendor Management Handbook
 * - David E. Schwab (2019) - The Vendor Selection Process
 * - Sherry R. Gordon (2014) - Vendor Evaluation and Selection
 */

export interface VendorCategory {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  description: string;
  subcriteria: {
    id: string;
    name: string;
    weight: number;
    questions: string[];
  }[];
}

export interface VendorInfo {
  id: string;
  name: string;
  category: string;
  country: string;
  yearEstablished: number;
  headquarters: string;
  certifications: string[];
  offices: string[];
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
}

export interface VendorScore {
  vendorId: string;
  criteria: {
    criteriaId: string;
    score: number;
    notes: string;
    evidence: string[];
  }[];
  totalScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  riskAssessment: 'Low' | 'Medium' | 'High';
}

export interface VendorEvaluationReport {
  projectName: string;
  projectNumber: string;
  evaluationDate: string;
  evaluatedBy: string;
  vendors: VendorInfo[];
  scores: VendorScore[];
  recommendation: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  signatures: {
    preparedBy: string;
    preparedDate: string;
    reviewedBy: string;
    reviewedDate: string;
    approvedBy: string;
    approvedDate: string;
  };
}

// Vendor Categories for Electrical Engineering Projects
export const vendorCategories: VendorCategory[] = [
  {
    id: 'transformer',
    name: 'Transformers',
    description: 'Power transformers, distribution transformers, instrument transformers',
    subcategories: [
      'Power Transformer (HV/MV)',
      'Distribution Transformer (MV/LV)',
      'Current Transformer (CT)',
      'Voltage Transformer (VT)',
      'Auto-transformer',
      'Dry-type Transformer'
    ]
  },
  {
    id: 'switchgear',
    name: 'Switchgear & Protection',
    description: 'Circuit breakers, disconnectors, protection relays, controlgear',
    subcategories: [
      'HV Switchgear (GIS/AIS)',
      'MV Switchgear',
      'LV Switchgear',
      'Circuit Breakers',
      'Protection Relays',
      'Control & Monitoring Systems'
    ]
  },
  {
    id: 'cables',
    name: 'Cables & Conductors',
    description: 'Power cables, control cables, overhead conductors, cable accessories',
    subcategories: [
      'HV Cables',
      'MV Cables',
      'LV Cables',
      'Control & Instrumentation Cables',
      'Overhead Conductors',
      'Cable Joints & Terminations'
    ]
  },
  {
    id: 'generating',
    name: 'Generating Sets',
    description: 'Diesel generators, gas turbines, emergency power systems',
    subcategories: [
      'Diesel Generator Set',
      'Gas Generator',
      'Synchronous Condenser',
      'UPS System',
      'Battery Charger',
      'Emergency Power System'
    ]
  },
  {
    id: 'renewable',
    name: 'Renewable Energy Equipment',
    description: 'Solar PV systems, wind turbines, energy storage systems',
    subcategories: [
      'Solar PV Modules',
      'Inverters (String/Central)',
      'Wind Turbine Generator',
      'Battery Energy Storage System (BESS)',
      'Grid-tie Controller',
      'Mounting Structures'
    ]
  },
  {
    id: 'lighting',
    name: 'Lighting Systems',
    description: 'Interior lighting, exterior lighting, industrial lighting, emergency lighting',
    subcategories: [
      'LED Fixtures',
      'Street Lighting',
      'Flood Lighting',
      'Industrial Lighting',
      'Emergency & Exit Lighting',
      'Lighting Control Systems'
    ]
  },
  {
    id: 'earthing',
    name: 'Earthing & Lightning Protection',
    description: 'Grounding systems, lightning arresters, earth electrodes',
    subcategories: [
      'Grounding Electrodes',
      'Grounding Conductors',
      'Lightning Arresters',
      'Earth Pit Maintenance',
      'Exothermic Welding',
      'Testing Equipment'
    ]
  },
  {
    id: 'materials',
    name: 'Electrical Materials',
    description: 'Cable trays, conduits, junction boxes, accessories',
    subcategories: [
      'Cable Trays & Ladder',
      'Conduits & Accessories',
      'Junction Boxes',
      'Enclosures',
      'Support Hardware',
      'Warning Signs & Labels'
    ]
  }
];

// Standard Evaluation Criteria
export const evaluationCriteria: EvaluationCriteria[] = [
  {
    id: 'technical',
    name: 'Technical Capability',
    weight: 25,
    description: 'Assessment of vendor technical expertise and product specifications',
    subcriteria: [
      {
        id: 'technical_specs',
        name: 'Product Specifications',
        weight: 40,
        questions: [
          'Do products meet required technical specifications?',
          'Are products certified for Indonesian standards (PUIL)?',
          'What is the quality of technical documentation provided?'
        ]
      },
      {
        id: 'technical_support',
        name: 'Technical Support',
        weight: 30,
        questions: [
          'Is there local technical support available?',
          'What is the response time for technical inquiries?',
          'Are training and commissioning services offered?'
        ]
      },
      {
        id: 'innovation',
        name: 'Innovation & Development',
        weight: 30,
        questions: [
          'What is the vendor R&D capability?',
          'Are there recent product innovations or improvements?',
          'Is there a roadmap for product development?'
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Terms',
    weight: 25,
    description: 'Evaluation of pricing, payment terms, and commercial conditions',
    subcriteria: [
      {
        id: 'pricing',
        name: 'Pricing Competitiveness',
        weight: 40,
        questions: [
          'Is the pricing competitive with market rates?',
          'Are there volume discounts available?',
          'What is the price stability/history?'
        ]
      },
      {
        id: 'payment',
        name: 'Payment Terms',
        weight: 30,
        questions: [
          'Are payment terms acceptable?',
          'Is there flexibility in payment structure?',
          'What are the credit facilities available?'
        ]
      },
      {
        id: 'warranty',
        name: 'Warranty Terms',
        weight: 30,
        questions: [
          'What is the standard warranty period?',
          'What does warranty coverage include?',
          'How are warranty claims handled?'
        ]
      }
    ]
  },
  {
    id: 'delivery',
    name: 'Delivery & Logistics',
    weight: 15,
    description: 'Assessment of delivery capabilities and supply chain',
    subcriteria: [
      {
        id: 'lead_time',
        name: 'Lead Time',
        weight: 40,
        questions: [
          'What is the standard delivery lead time?',
          'Can urgent orders be accommodated?',
          'What is the on-time delivery record?'
        ]
      },
      {
        id: 'logistics',
        name: 'Logistics Capability',
        weight: 30,
        questions: [
          'How is transportation and handling managed?',
          'What is the packaging quality?',
          'Are there any shipping constraints?'
        ]
      },
      {
        id: 'supply_chain',
        name: 'Supply Chain Reliability',
        weight: 30,
        questions: [
          'Is the vendor the manufacturer or distributor?',
          'What is the inventory management system?',
          'Are there alternative supply sources?'
        ]
      }
    ]
  },
  {
    id: 'quality',
    name: 'Quality Assurance',
    weight: 20,
    description: 'Evaluation of quality systems and certifications',
    subcriteria: [
      {
        id: 'certifications',
        name: 'Certifications',
        weight: 40,
        questions: [
          'What quality certifications are held (ISO 9001, etc.)?',
          'Are products certified by relevant authorities?',
          'Is there third-party testing verification?'
        ]
      },
      {
        id: 'quality_control',
        name: 'Quality Control Processes',
        weight: 30,
        questions: [
          'What is the QC process for manufacturing?',
          'Are factory acceptance tests available?',
          'How are defects and returns handled?'
        ]
      },
      {
        id: 'track_record',
        name: 'Quality Track Record',
        weight: 30,
        questions: [
          'What is the defect rate history?',
          'Are there any major quality incidents?',
          'References from similar projects?'
        ]
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Stability',
    weight: 10,
    description: 'Assessment of vendor financial health and stability',
    subcriteria: [
      {
        id: 'financial_health',
        name: 'Financial Health',
        weight: 50,
        questions: [
          'What is the vendor financial rating?',
          'Is audited financial information available?',
          'What is the company size and market share?'
        ]
      },
      {
        id: 'stability',
        name: 'Business Stability',
        weight: 50,
        questions: [
          'How long has the vendor been in business?',
          'What is the employee retention rate?',
          'Any merger/acquisition risks?'
        ]
      }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Compliance',
    weight: 5,
    description: 'Evaluation of safety standards and regulatory compliance',
    subcriteria: [
      {
        id: 'safety_standards',
        name: 'Safety Standards',
        weight: 50,
        questions: [
          'What safety certifications are held?',
          'Is there an HSE management system?',
          'What is the safety incident record?'
        ]
      },
      {
        id: 'regulatory',
        name: 'Regulatory Compliance',
        weight: 50,
        questions: [
          'Are products compliant with Indonesian regulations?',
          'Is there proper import documentation?',
          'Are there any pending legal issues?'
        ]
      }
    ]
  }
];

// Calculate weighted score
export function calculateVendorScore(
  vendor: VendorInfo,
  criteriaScores: { criteriaId: string; score: number; notes: string; evidence: string[] }[]
): VendorScore {
  let totalScore = 0;
  let totalWeight = 0;

  const scoredCriteria = criteriaScores.map(cs => {
    const criteria = evaluationCriteria.find(c => c.id === cs.criteriaId);
    const weight = criteria?.weight || 0;
    totalScore += cs.score * weight;
    totalWeight += weight;
    return {
      criteriaId: cs.criteriaId,
      score: cs.score,
      notes: cs.notes,
      evidence: cs.evidence
    };
  });

  const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  // Determine risk assessment
  let riskAssessment: 'Low' | 'Medium' | 'High' = 'Low';
  if (normalizedScore < 5) riskAssessment = 'High';
  else if (normalizedScore < 7) riskAssessment = 'Medium';

  return {
    vendorId: vendor.id,
    criteria: scoredCriteria,
    totalScore: Math.round(normalizedScore * 10) / 10,
    strengths: [],
    weaknesses: [],
    recommendations: [],
    riskAssessment
  };
}

// Generate evaluation report template
export function createEvaluationReport(projectName: string, projectNumber: string): VendorEvaluationReport {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    projectName,
    projectNumber,
    evaluationDate: today,
    evaluatedBy: '',
    vendors: [],
    scores: [],
    recommendation: '',
    approvalStatus: 'Pending',
    signatures: {
      preparedBy: '',
      preparedDate: '',
      reviewedBy: '',
      reviewedDate: '',
      approvedBy: '',
      approvedDate: ''
    }
  };
}

// Scoring guide
export const scoringGuide = {
  1: 'Very Poor - Does not meet requirements, significant gaps',
  2: 'Poor - Major deficiencies, high risk',
  3: 'Below Average - Several deficiencies, moderate risk',
  4: 'Slightly Below Average - Minor improvements needed',
  5: 'Average - Meets basic requirements adequately',
  6: 'Slightly Above Average - Good with minor areas for improvement',
  7: 'Good - Meets requirements well, reliable',
  8: 'Very Good - Exceeds requirements in many areas',
  9: 'Excellent - Outstanding performance, recommended',
  10: 'Exceptional - Best in class, exemplary'
};

// Weight distribution summary
export const weightSummary = {
  technical: 25,
  commercial: 25,
  delivery: 15,
  quality: 20,
  financial: 10,
  safety: 5,
  total: 100
};

// Recommended minimum scores
export const minimumScores = {
  transformer: 7.0,
  switchgear: 7.0,
  cables: 6.5,
  generating: 7.0,
  renewable: 7.0,
  lighting: 6.0,
  earthing: 6.5,
  materials: 6.0
};

// Compliance requirements for Indonesian market
export const complianceRequirements = {
  required: [
    'SNI (Standar Nasional Indonesia) certification',
    'PUIL 2011 compliance',
    'KEPKERS (for electrical work)',
    'IUJK (Izin Usaha Jasa Konstruksi) - for contractor vendors'
  ],
  recommended: [
    'ISO 9001:2015 Quality Management System',
    'ISO 14001:2015 Environmental Management',
    'ISO 45001:2018 Occupational Health & Safety',
    'K3 Certificate for personnel',
    'ISO 27001 for IT/automation vendors'
  ],
  testingStandards: [
    'IEC 60076 - Power Transformers',
    'IEC 62271 - High-voltage switchgear',
    'IEC 60502 - Power cables',
    'IEC 61215 - Solar PV modules',
    'SNI IEC standards where available'
  ]
};

// Site visit checklist
export const siteVisitChecklist = {
  manufacturing: [
    'Production capacity verification',
    'Quality control laboratory inspection',
    'Raw material storage conditions',
    'Finished product storage and packaging',
    'Workforce competence and training records',
    'Safety equipment and procedures',
    'Environmental compliance measures'
  ],
  warehouse: [
    'Inventory management system',
    'Storage conditions and capacity',
    'Order fulfillment process',
    'Loading and dispatch facilities',
    'Sample products inspection'
  ],
  office: [
    'Organization structure',
    'Key personnel qualifications',
    'After-sales support capability',
    'Financial stability indicators',
    'Reference project documentation'
  ]
};

// Reference check questions
export const referenceCheckQuestions = [
  'How would you rate the quality of products/services provided?',
  'Was the delivery on time and complete?',
  'How was the communication and responsiveness?',
  'Were there any issues and how were they resolved?',
  'Would you work with this vendor again?',
  'What are the strengths and weaknesses observed?',
  'Was the documentation complete and accurate?',
  'How was the after-sales support?'
];
