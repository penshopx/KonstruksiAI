/**
 * Test Plans Document Library
 * Comprehensive electrical system testing procedures for Indonesian standards
 * Covers: Residential, Commercial, Industrial, Renewable Energy systems
 * Standards: PUIL 2011, IEC 60364, IEC 61850, IEC 61439, ISO 9001
 */

export interface TestParameter {
  name: string;
  description: string;
  method: string;
  acceptanceCriteria: string;
  reference: string;
}

export interface TestProcedure {
  id: string;
  name: string;
  category: string;
  voltageLevel: 'LV' | 'MV' | 'HV' | 'ALL';
  systemType: string[];
  parameters: TestParameter[];
  prerequisites: string[];
  safetyPrecautions: string[];
  documentation: string[];
}

export interface TestPlan {
  id: string;
  title: string;
  description: string;
  scope: string;
  applicableSystems: string[];
  voltageLevels: string[];
  standards: string[];
  projectType: string[];
  procedures: TestProcedure[];
  checklists: TestChecklist[];
  reports: TestReportTemplate[];
}

export interface TestChecklist {
  id: string;
  name: string;
  category: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  description: string;
  passed: boolean | null;
  notes: string;
  verifiedBy: string;
  date: string;
}

export interface TestReportTemplate {
  id: string;
  name: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  fields: ReportField[];
}

export interface ReportField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'signature';
  required: boolean;
}

// ============================================
// TEST PLAN CATEGORIES
// ============================================

export const TEST_PLAN_CATEGORIES = {
  COMMISSIONING: 'Commissioning Test',
  PERIODIC: 'Periodic Maintenance Test',
  COMPLIANCE: 'Compliance Verification Test',
  ACCEPTANCE: 'Acceptance Test',
} as const;

// ============================================
// VOLTAGE LEVEL DEFINITIONS
// ============================================

export const VOLTAGE_LEVELS = {
  LV: {
    code: 'LV',
    name: 'Low Voltage',
    range: '230V / 400V',
    description: 'Tegangan rendah untuk distribusi final',
  },
  MV: {
    code: 'MV',
    name: 'Medium Voltage',
    range: '6kV - 20kV',
    description: 'Tegangan menengah untuk distribusi primer',
  },
  HV: {
    code: 'HV',
    name: 'High Voltage',
    range: '>20kV',
    description: 'Tegangan tinggi untuk transmisi',
  },
} as const;

// ============================================
// SYSTEM TYPES
// ============================================

export const SYSTEM_TYPES = {
  RESIDENTIAL: {
    id: 'residential',
    name: 'Gedung Residensial',
    description: ' rumah tangga dan apartemen',
  },
  COMMERCIAL: {
    id: 'commercial',
    name: 'Gedung Komersial',
    description: 'mall, hotel, kantor, dan gedung perkantoran',
  },
  INDUSTRIAL: {
    id: 'industrial',
    name: 'Pabrik/Industrial',
    description: 'factory, warehouse, dan fasilitas industri',
  },
  RENEWABLE_ENERGY: {
    id: 'renewable',
    name: 'Energi Terbarukan',
    description: 'PLTS (Pembangkit Listrik Tenaga Surya), PLTB, PLTA',
  },
} as const;

// ============================================
// STANDARDS REFERENCES
// ============================================

export const STANDARDS = {
  PUIL_2011: {
    code: 'PUIL 2011',
    name: 'Persyaratan Umum Instalasi Listrik 2011',
    description: 'Standar nasional Indonesia untuk instalasi listrik',
  },
  IEC_60364: {
    code: 'IEC 60364',
    name: 'Electrical Installations of Buildings',
    description: 'Standar internasional untuk instalasi bangunan',
  },
  IEC_61850: {
    code: 'IEC 61850',
    name: 'Communication Networks and Systems for Power Utility Automation',
    description: 'Standar komunikasi untuk automasi gardu listrik',
  },
  IEC_61439: {
    code: 'IEC 61439',
    name: 'Low-voltage Switchgear and Controlgear Assemblies',
    description: 'Standar untuk perakitan switchgear tegangan rendah',
  },
  IEC_62271: {
    code: 'IEC 62271',
    name: 'High-voltage Switchgear and Controlgear',
    description: 'Standar untuk switchgear tegangan menengah dan tinggi',
  },
  ISO_9001: {
    code: 'ISO 9001',
    name: 'Quality Management Systems',
    description: 'Standar sistem manajemen mutu',
  },
} as const;

// ============================================
// TEST PROCEDURES - INCOMING POWER & TRANSFORMER
// ============================================

export const TRANSFORMER_TESTS: TestProcedure[] = [
  {
    id: 'TR-001',
    name: 'Insulation Resistance Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['residential', 'commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Transformer de-energized',
      'All terminations disconnected',
      'Ambient temperature recorded',
    ],
    safetyPrecautions: [
      'Lockout/Tagout applied',
      'Ensure no backfeed from secondary',
      'Use appropriate test equipment',
      'Wear appropriate PPE',
    ],
    parameters: [
      {
        name: 'Primary Winding Resistance',
        description: 'Mengukur resistansi isolasi belitan primer',
        method: 'Megger test using 5000V DC for HV, 1000V DC for LV',
        acceptanceCriteria: '> 1000 MΩ untuk sistem baru, > 100 MΩ untuk sistem existing',
        reference: 'IEC 60076-1, PUIL 2011 Pasal 7.3.2',
      },
      {
        name: 'Secondary Winding Resistance',
        description: 'Mengukur resistansi isolasi belitan sekunder',
        method: 'Megger test using 1000V DC',
        acceptanceCriteria: '> 1000 MΩ untuk sistem baru, > 100 MΩ untuk sistem existing',
        reference: 'IEC 60076-1, PUIL 2011 Pasal 7.3.2',
      },
      {
        name: 'Core Ground Resistance',
        description: 'Mengukur resistansi isolasi antara core dan ground',
        method: 'Megger test between core and grounded tank',
        acceptanceCriteria: '> 500 MΩ',
        reference: 'IEC 60076-1',
      },
    ],
    documentation: [
      'Test report form',
      'Equipment calibration certificate',
      'Weather conditions record',
      'Test personnel certification',
    ],
  },
  {
    id: 'TR-002',
    name: 'Transformer Ratio Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['residential', 'commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Transformer de-energized',
      'All bushings accessible',
    ],
    safetyPrecautions: [
      'Lockout/Tagout applied',
      'Maintain safe distance from bushings',
    ],
    parameters: [
      {
        name: 'Primary to Secondary Ratio',
        description: 'Memeriksa rasio tegangan primer-sekunder',
        method: 'TTR (Transformer Turns Ratio) test',
        acceptanceCriteria: 'Rasio harus sesuai nameplate ± 0.5%',
        reference: 'IEC 60076-1',
      },
      {
        name: 'Vector Group Verification',
        description: 'Memeriksa konfigurasi vector group',
        method: 'Polarity test menggunakan DC exciter',
        acceptanceCriteria: 'Sesuai dengan spesifikas: Dyn11, Yyn0, dll',
        reference: 'IEC 60076-1',
      },
    ],
    documentation: [
      'Ratio test report',
      'Vector group verification certificate',
      'Nameplate data copy',
    ],
  },
  {
    id: 'TR-003',
    name: 'Winding Resistance Measurement',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['residential', 'commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Transformer in unpowered state',
      'Winding temperature stabilized',
    ],
    safetyPrecautions: [
      'Allow winding to cool if recently energized',
      'Use low voltage ohmmeter',
    ],
    parameters: [
      {
        name: 'Primary Winding Resistance',
        description: 'Mengukur resistansi DC belitan primer',
        method: 'Four-wire Kelvin bridge method',
        acceptanceCriteria: 'Nilai harus sesuai desain pabrikan, deviasi antar fase < 2%',
        reference: 'IEC 60076-2',
      },
      {
        name: 'Secondary Winding Resistance',
        description: 'Mengukur resistansi DC belitan sekunder',
        method: 'Four-wire Kelvin bridge method',
        acceptanceCriteria: 'Nilai harus sesuai desain pabrikan, deviasi antar fase < 2%',
        reference: 'IEC 60076-2',
      },
    ],
    documentation: [
      'Winding resistance measurement record',
      'Temperature correction chart',
    ],
  },
  {
    id: 'TR-004',
    name: 'Oil Quality Test (Oil-Filled Transformer)',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'MV',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Oil sample collected from bottom valve',
      'Sample properly labeled and stored',
    ],
    safetyPrecautions: [
      'Handle oil with gloves',
      'Avoid skin contact with mineral oil',
      'Dispose of sample properly',
    ],
    parameters: [
      {
        name: 'Breakdown Voltage',
        description: 'Mengukur tegangan tembus minyak transformator',
        method: 'ASTM D877 atau IEC 60156',
        acceptanceCriteria: '> 30 kV untuk sistem 6-12kV, > 40 kV untuk sistem 20kV',
        reference: 'IEC 60296, PUIL 2011',
      },
      {
        name: 'Moisture Content',
        description: 'Mengukur kadar air dalam minyak',
        method: 'Karl Fischer titration',
        acceptanceCriteria: '< 35 ppm untuk seal, < 50 ppm untuk conservator',
        reference: 'IEC 60814',
      },
      {
        name: 'Color & Appearance',
        description: 'Pemeriksaan visual warna dan kejernihan',
        method: 'Visual inspection',
        acceptanceCriteria: 'Jernih, tidak berbau, warna < 1.5',
        reference: 'IEC 60296',
      },
    ],
    documentation: [
      'Oil analysis laboratory report',
      'Sample collection record',
    ],
  },
];

// ============================================
// TEST PROCEDURES - SWITCHGEAR & PROTECTION
// ============================================

export const SWITCHGEAR_TESTS: TestProcedure[] = [
  {
    id: 'SG-001',
    name: 'Insulation Resistance Test - Busbar',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Switchgear de-energized',
      'All removable components withdrawn',
    ],
    safetyPrecautions: [
      'Lockout/Tagout applied',
      'Discharge capacitive elements',
    ],
    parameters: [
      {
        name: 'Phase-to-Phase Insulation',
        description: 'Mengukur resistansi isolasi antar fase',
        method: 'Megger test 5000V DC untuk MV/HV, 1000V DC untuk LV',
        acceptanceCriteria: '> 1000 MΩ',
        reference: 'IEC 61439-1, PUIL 2011 Pasal 7.3',
      },
      {
        name: 'Phase-to-Ground Insulation',
        description: 'Mengukur resistansi isolasi fase ke ground',
        method: 'Megger test',
        acceptanceCriteria: '> 500 MΩ',
        reference: 'IEC 61439-1',
      },
    ],
    documentation: [
      'Insulation resistance test record',
      'Test equipment certificate',
    ],
  },
  {
    id: 'SG-002',
    name: 'High Voltage Withstand Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'MV',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'System completely isolated',
      'All protective devices in test mode',
    ],
    safetyPrecautions: [
      'Establish restricted zone',
      'Use HV test equipment with interlocks',
      'Personnel must be trained for HV work',
    ],
    parameters: [
      {
        name: 'Power Frequency Withstand',
        description: 'Menguji kemampuan isolasi terhadap tegangan kerja',
        method: 'AC Hi-Pot test sesuai IEC 62271-1',
        acceptanceCriteria: 'Tidak ada breakdown atau flashover selama 1 menit',
        reference: 'IEC 62271-1, IEC 62271-200',
      },
      {
        name: 'Impulse Voltage Test',
        description: 'Menguji kemampuan terhadap surge/petir',
        method: 'Lightning impulse 1.2/50 μs',
        acceptanceCriteria: 'Tidak ada breakdown pada 3 shots positif dan negatif',
        reference: 'IEC 62271-1',
      },
    ],
    documentation: [
      'Hi-Pot test certificate',
      'Test waveform records',
      'Safety observation log',
    ],
  },
  {
    id: 'SG-003',
    name: 'Circuit Breaker Timing Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Breaker mechanism charged',
      'Control power available',
    ],
    safetyPrecautions: [
      'Follow LOTO procedures',
      'Keep clear of mechanism during test',
    ],
    parameters: [
      {
        name: 'Opening Time',
        description: 'Mengukur waktu pembukaan circuit breaker',
        method: 'Circuit breaker analyzer',
        acceptanceCriteria: 'Sesuai spek pabrikan ± 10%',
        reference: 'IEC 62271-100',
      },
      {
        name: 'Closing Time',
        description: 'Mengukur waktu penutupan circuit breaker',
        method: 'Circuit breaker analyzer',
        acceptanceCriteria: 'Sesuai spek pabrikan ± 10%',
        reference: 'IEC 62271-100',
      },
      {
        name: 'Trip Coil Current',
        description: 'Mengukur arus coil trip saat beroperasi',
        method: 'Secondary injection test',
        acceptanceCriteria: 'Sesuai spek pabrikan',
        reference: 'IEC 62271-100',
      },
    ],
    documentation: [
      'Timing test report',
      'Breaker nameplate data',
    ],
  },
  {
    id: 'SG-004',
    name: 'Protection Relay Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'ALL',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Relay powered and warmed up',
      'Secondary injection test set available',
    ],
    safetyPrecautions: [
      'Isolate relay from primary during test',
      'Ensure CT shorting blocks are in place',
    ],
    parameters: [
      {
        name: 'Overcurrent Relay Pickup',
        description: 'Menguji titik pickup relay overcurrent',
        method: 'Secondary injection test',
        acceptanceCriteria: 'Pickup sesuai setting ± 5%',
        reference: 'IEC 60255',
      },
      {
        name: 'Time Delay Verification',
        description: 'Menguji waktu tunda relay',
        method: 'Secondary injection dengan timer',
        acceptanceCriteria: 'Waktu sesuai kurva yang dipilih ± 5%',
        reference: 'IEC 60255',
      },
      {
        name: 'Differential Protection Test',
        description: 'Menguji relay proteksi diferensial',
        method: 'Secondary injection pada semua input',
        acceptanceCriteria: 'Operates sesuai karakteristik restraint',
        reference: 'IEC 60255',
      },
    ],
    documentation: [
      'Relay setting coordination chart',
      'Test and commission report',
      'Protection coordination study',
    ],
  },
];

// ============================================
// TEST PROCEDURES - DISTRIBUTION & OUTLETS
// ============================================

export const DISTRIBUTION_TESTS: TestProcedure[] = [
  {
    id: 'DS-001',
    name: 'Continuity Test - Ring Main',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['residential', 'commercial', 'industrial'],
    prerequisites: [
      'All circuits de-energized',
      'All outlets and fixtures connected',
    ],
    safetyPrecautions: [
      'Ensure no live work',
      'Use low voltage continuity tester',
    ],
    parameters: [
      {
        name: 'Phase Continuity',
        description: 'Memastikan kontinuitas fase dari DB ke outlet',
        method: 'Low voltage continuity tester',
        acceptanceCriteria: 'Resistansi < 1 Ω, tidak ada interupsi',
        reference: 'IEC 60364-6, PUIL 2011 Pasal 6.2',
      },
      {
        name: 'Neutral Continuity',
        description: 'Memastikan kontinuitas netral',
        method: 'Low voltage continuity tester',
        acceptanceCriteria: 'Resistansi < 1 Ω, tidak ada interupsi',
        reference: 'IEC 60364-6',
      },
      {
        name: 'Earth Continuity',
        description: 'Memastikan kontinuitas grounding/earth',
        method: 'Low voltage continuity tester dari DB ke setiap outlet',
        acceptanceCriteria: 'Resistansi < 1 Ω untuk sirkuit utama, < 2 Ω untuk sub-circuit',
        reference: 'IEC 60364-6, PUIL 2011 Pasal 6.3',
      },
    ],
    documentation: [
      'Continuity test record per circuit',
      'Distribution board schedule',
    ],
  },
  {
    id: 'DS-002',
    name: 'Insulation Resistance Test - Circuit',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['residential', 'commercial', 'industrial'],
    prerequisites: [
      'All circuits isolated from supply',
      'All loads disconnected',
      'All switches in ON position',
    ],
    safetyPrecautions: [
      'De-energize before testing',
      'Do not test live circuits',
    ],
    parameters: [
      {
        name: 'Phase to Earth Insulation',
        description: 'Mengukur resistansi isolasi fase ke ground',
        method: '500V DC Megger',
        acceptanceCriteria: '> 1 MΩ untuk sistem baru, > 0.5 MΩ untuk sistem existing',
        reference: 'IEC 60364-6, PUIL 2011 Pasal 7.3',
      },
      {
        name: 'Neutral to Earth Insulation',
        description: 'Mengukur resistansi isolasi netral ke ground',
        method: '500V DC Megger',
        acceptanceCriteria: '> 1 MΩ untuk sistem baru, > 0.5 MΩ untuk sistem existing',
        reference: 'IEC 60364-6',
      },
      {
        name: 'Phase to Phase Insulation',
        description: 'Mengukur resistansi isolasi antar fase',
        method: '500V DC Megger',
        acceptanceCriteria: '> 1 MΩ',
        reference: 'IEC 60364-6',
      },
    ],
    documentation: [
      'Insulation resistance test log',
      'Circuit identification chart',
    ],
  },
  {
    id: 'DS-003',
    name: 'Earth Resistance Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['residential', 'commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Earth electrode system installed',
      'Soil condition stable (not during dry season for best results)',
    ],
    safetyPrecautions: [
      'Use earth resistance tester',
      'Avoid parallel earth paths',
    ],
    parameters: [
      {
        name: 'Earth Electrode Resistance',
        description: 'Mengukur resistansi elektroda grounding',
        method: 'Earth resistance tester (Fall of Potential method)',
        acceptanceCriteria: '< 5 Ω untuk sistem distribusi, < 1 Ω untuk sistem proteksi',
        reference: 'IEC 60364-5-54, PUIL 2011 Pasal 6.3',
      },
      {
        name: 'Earth Bonding Resistance',
        description: 'Mengukur resistansi bonding antar metal',
        method: 'Low current continuity test',
        acceptanceCriteria: '< 0.5 Ω untuk sambungan struktural',
        reference: 'IEC 60364-5-54',
      },
    ],
    documentation: [
      'Earth resistance test report',
      'Soil resistivity data',
      'Electrode installation record',
    ],
  },
  {
    id: 'DS-004',
    name: 'Polarity Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['residential', 'commercial'],
    prerequisites: [
      'Circuit energized',
      'Polarity indicator available',
    ],
    safetyPrecautions: [
      'Use proper test equipment',
      'Avoid direct contact',
    ],
    parameters: [
      {
        name: 'Single Pole Switch Verification',
        description: 'Memastikan saklar satu kutub memutus fase',
        method: 'Polarity tester atau voltmeter',
        acceptanceCriteria: 'Fase terputus saat saklar OFF',
        reference: 'IEC 60364-6, PUIL 2011',
      },
      {
        name: 'Socket Outlet Phase',
        description: 'Memeriksa polaritas stop kontak',
        method: 'Polarity tester',
        acceptanceCriteria: 'Fase pada pin kanan (sesuai standar Indonesia: kiri)',
        reference: 'IEC 60364-6, PUIL 2011',
      },
    ],
    documentation: [
      'Polarity test certificate',
    ],
  },
  {
    id: 'DS-005',
    name: 'Load Test - Distribution Board',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['residential', 'commercial', 'industrial'],
    prerequisites: [
      'All circuits connected to loads',
      'All protection devices in place',
    ],
    safetyPrecautions: [
      'Monitor temperature during test',
      'Have fire extinguisher ready',
    ],
    parameters: [
      {
        name: 'Board Loading',
        description: 'Mengukur beban pada setiap circuit breaker',
        method: 'Clamp meter pada setiap outgoing circuit',
        acceptanceCriteria: 'Tidak melebihi 80% kapasitas MCB, balance antar fase < 20%',
        reference: 'IEC 61439-3',
      },
      {
        name: 'Voltage Drop',
        description: 'Mengukur drop tegangan dari DB ke beban',
        method: 'Voltmeter pada kondisi beban penuh',
        acceptanceCriteria: 'Drop tegangan < 3% untuk lighting, < 5% untuk power',
        reference: 'IEC 60364-5-52, PUIL 2011',
      },
    ],
    documentation: [
      'Load balance report',
      'Voltage drop measurement record',
    ],
  },
];

// ============================================
// TEST PROCEDURES - RENEWABLE ENERGY (PLTS/PLTB)
// ============================================

export const RENEWABLE_TESTS: TestProcedure[] = [
  {
    id: 'RE-001',
    name: 'PV Array Performance Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['renewable'],
    prerequisites: [
      'PV modules installed and connected',
      'Inverter commissioned',
      'Irradiance > 800 W/m²',
    ],
    safetyPrecautions: [
      'PV array generates voltage when exposed to light',
      'Use appropriate PPE for DC work',
      'Cover modules when working on system',
    ],
    parameters: [
      {
        name: 'Open Circuit Voltage (Voc)',
        description: 'Mengukur tegangan open circuit panel surya',
        method: 'DC Voltmeter pada kondisi standar (STC dikoreksi)',
        acceptanceCriteria: 'Voc dalam toleransi nameplate ± 5%',
        reference: 'IEC 61215, IEC 61730',
      },
      {
        name: 'Short Circuit Current (Isc)',
        description: 'Mengukur arus short circuit panel surya',
        method: 'DC Amperemeter pada kondisi standar',
        acceptanceCriteria: 'Isc dalam toleransi nameplate ± 5%',
        reference: 'IEC 61215',
      },
      {
        name: 'Panel String Voltage',
        description: 'Memeriksa tegangan string panel',
        method: 'DC Voltmeter',
        acceptanceCriteria: 'Sesuai perhitungan desain ± 5%',
        reference: 'IEC 62548',
      },
    ],
    documentation: [
      'PV module test certificates',
      'Performance ratio report',
      'Irradiance measurement log',
    ],
  },
  {
    id: 'RE-002',
    name: 'Inverter Performance Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['renewable'],
    prerequisites: [
      'Inverter installed and connected',
      'Grid connection approved',
      'DC input from PV array',
    ],
    safetyPrecautions: [
      'Inverter contains high voltage capacitors',
      'Wait 5 minutes after disconnect before opening',
    ],
    parameters: [
      {
        name: 'Inverter Efficiency',
        description: 'Mengukur efisiensi inverter',
        method: 'Power analyzer pada input dan output',
        acceptanceCriteria: '> 95% untuk inverter string, > 98% untuk inverter central',
        reference: 'IEC 61683',
      },
      {
        name: 'Total Harmonic Distortion (THD)',
        description: 'Mengukur distorsi harmonik output',
        method: 'Power analyzer',
        acceptanceCriteria: 'THD < 5% pada beban penuh',
        reference: 'IEEE 519, PUIL 2011',
      },
      {
        name: 'Anti-Islanding Test',
        description: 'Memverifikasi proteksi anti-islanding',
        method: 'Simulasi kondisi grid loss',
        acceptanceCriteria: 'Inverter trip dalam 2 detik',
        reference: 'IEC 62116',
      },
    ],
    documentation: [
      'Inverter commissioning report',
      'Grid compliance certificate',
      'Harmonic measurement data',
    ],
  },
  {
    id: 'RE-003',
    name: 'Battery Energy Storage System (BESS) Test',
    category: TEST_PLAN_CATEGORIES.COMMISSIONING,
    voltageLevel: 'LV',
    systemType: ['renewable'],
    prerequisites: [
      'BESS installed according to design',
      'Battery management system (BMS) operational',
    ],
    safetyPrecautions: [
      'Follow battery manufacturer safety guidelines',
      'Have emergency procedures in place',
      'Ensure proper ventilation',
    ],
    parameters: [
      {
        name: 'Battery Capacity Test',
        description: 'Mengukur kapasitas aktual baterai',
        method: 'Discharge test pada C-rate tertentu',
        acceptanceCriteria: 'Kapasitas ≥ 95% rated capacity',
        reference: 'IEC 62620',
      },
      {
        name: 'BMS Communication',
        description: 'Memverifikasi komunikasi BMS ke inverter',
        method: 'Protocol analyzer atau monitoring system',
        acceptanceCriteria: 'Semua parameter terbaca dengan benar',
        reference: 'IEC 61850, manufacturer spec',
      },
      {
        name: 'Charge/Discharge Cycle',
        description: 'Menguji siklus charge/discharge',
        method: 'Full cycle test dengan logging',
        acceptanceCriteria: 'Round-trip efficiency > 85% untuk Li-ion',
        reference: 'IEC 62933-2-1',
      },
    ],
    documentation: [
      'BESS test report',
      'BMS configuration record',
      'Safety data sheet',
    ],
  },
];

// ============================================
// TEST PROCEDURES - PERIODIC MAINTENANCE
// ============================================

export const PERIODIC_MAINTENANCE_TESTS: TestProcedure[] = [
  {
    id: 'PM-001',
    name: 'Thermal Imaging Inspection',
    category: TEST_PLAN_CATEGORIES.PERIODIC,
    voltageLevel: 'ALL',
    systemType: ['residential', 'commercial', 'industrial', 'renewable'],
    prerequisites: [
      'System under normal load for minimum 1 hour',
      'Thermal camera calibrated',
    ],
    safetyPrecautions: [
      'Maintain safe distance from energized equipment',
      'Use appropriate thermal camera for voltage level',
    ],
    parameters: [
      {
        name: 'Connection Points',
        description: 'Memeriksa titik sambungan dengan thermal imaging',
        method: 'Thermal camera survey',
        acceptanceCriteria: 'Temperature rise < 15°C di atas ambient untuk koneksi baik',
        reference: 'ISO 10878, NETA MTS',
      },
      {
        name: 'Busbar & Cable Joints',
        description: 'Mengidentifikasi hot spots pada busbar dan kabel',
        method: 'Thermal imaging',
        acceptanceCriteria: 'Tidak ada hot spot yang menunjukkan resistansi tinggi',
        reference: 'IEEE 976, NETA MTS',
      },
    ],
    documentation: [
      'Thermal survey report with images',
      'Anomaly list with corrective actions',
    ],
  },
  {
    id: 'PM-002',
    name: 'Protective Device Coordination Study',
    category: TEST_PLAN_CATEGORIES.PERIODIC,
    voltageLevel: 'ALL',
    systemType: ['commercial', 'industrial', 'renewable'],
    prerequisites: [
      'Updated single line diagram available',
      'Fault level calculation current',
    ],
    safetyPrecautions: [
      'System can remain energized for study',
      'Backup settings before any changes',
    ],
    parameters: [
      {
        name: 'Time-Current Coordination',
        description: 'Memverifikasi koordinasi proteksi',
        method: 'Review setting dan kurva koordinasi',
        acceptanceCriteria: 'Selektivitas antar device terpenuhi',
        reference: 'IEC 60255, IEEE 242',
      },
      {
        name: 'Settings Verification',
        description: 'Memeriksa setting relay aktual vs desain',
        method: 'Secondary injection atau review setting',
        acceptanceCriteria: 'Setting sesuai dengan coordination study',
        reference: 'IEEE 3002',
      },
    ],
    documentation: [
      'Coordination study update',
      'Relay setting verification report',
    ],
  },
];

// ============================================
// COMPLETE TEST PLAN
// ============================================

export const COMPLETE_TEST_PLAN: TestPlan = {
  id: 'TP-COMPLETE-001',
  title: 'Dokumen Rencana Uji Sistem Kelistrikan Komprehensif',
  description: 'Rencana uji lengkap untuk sistem kelistrikan bangunan mencakup semua aspek pengujian dari incoming power hingga end-user outlets, sesuai standar PUIL 2011 dan IEC.',
  scope: 'Pengujian sistem penuh: dari incoming power distribution, transformator, switchgear, sistem proteksi, distribusi, hingga outlet end-user. Berlaku untuk semua level tegangan (LV, MV, HV) dan semua tipe bangunan.',
  applicableSystems: [
    'Incoming Power Distribution',
    'Transformator',
    'Switchgear & Controlgear',
    'Protection System',
    'Busbar & Trunking',
    'Cable Distribution Network',
    'Distribution Boards (DB)',
    'Lighting System',
    'Power Outlets',
    'Grounding & Earthing System',
    'Renewable Energy Systems (PLTS/PLTB)',
  ],
  voltageLevels: ['LV (230V/400V)', 'MV (6-20kV)', 'HV (>20kV)'],
  standards: ['PUIL 2011', 'IEC 60364', 'IEC 61850', 'IEC 61439', 'IEC 62271', 'ISO 9001'],
  projectType: [
    'Konstruksi Baru',
    'Renovasi/Retrofit',
    'Ekspansi Fasilitas',
    'Audit Compliance',
  ],
  procedures: [
    ...TRANSFORMER_TESTS,
    ...SWITCHGEAR_TESTS,
    ...DISTRIBUTION_TESTS,
    ...RENEWABLE_TESTS,
    ...PERIODIC_MAINTENANCE_TESTS,
  ],
  checklists: [
    {
      id: 'CK-001',
      name: 'Pre-Commissioning Checklist',
      category: 'Commissioning',
      items: [
        { id: 'CK-001-01', description: 'Dokumen desain telah direview dan disetujui', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-02', description: 'Single line diagram tersedia dan sesuai kondisi lapangan', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-03', description: 'Semua material terpasang sesuai spesifikasi', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-04', description: 'Kabel terpasang sesuai route plan', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-05', description: 'Sistem grounding terinstalasi lengkap', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-06', description: 'Semua terminasi dikencangkan dengan torque yang sesuai', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-07', description: 'Alat pengujian terkalibrasi dan tersedia', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-001-08', description: 'Tim pengujian memahami prosedur dan safety requirements', passed: null, notes: '', verifiedBy: '', date: '' },
      ],
    },
    {
      id: 'CK-002',
      name: 'Transformer Commissioning Checklist',
      category: 'Commissioning',
      items: [
        { id: 'CK-002-01', description: 'Visual inspection: tidak ada kerusakan fisik', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-02', description: 'Oil level normal (untuk oil-filled)', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-03', description: 'Bushing bersih dan tidak retak', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-04', description: 'Temperature gauge/indicator berfungsi', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-05', description: 'Oil sample test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-06', description: 'Insulation resistance test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-07', description: 'Transformer ratio test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-002-08', description: 'Grounding terhubung dengan baik', passed: null, notes: '', verifiedBy: '', date: '' },
      ],
    },
    {
      id: 'CK-003',
      name: 'Switchgear Commissioning Checklist',
      category: 'Commissioning',
      items: [
        { id: 'CK-003-01', description: 'Visual inspection: cleanliness dan condition', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-02', description: 'Mechanism operasi halus dan tidak ada obstruction', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-03', description: 'Auxiliary contacts berfungsi', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-04', description: 'Interlocking berfungsi dengan benar', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-05', description: 'Control wiring ter-check dan dilabel', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-06', description: 'Insulation resistance test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-07', description: 'Hi-pot test passed (untuk MV/HV)', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-003-08', description: 'Protection relay ter-setting dan di-test', passed: null, notes: '', verifiedBy: '', date: '' },
      ],
    },
    {
      id: 'CK-004',
      name: 'Distribution System Checklist',
      category: 'Commissioning',
      items: [
        { id: 'CK-004-01', description: 'Distribution board terlabel dengan jelas', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-02', description: 'MCB/MCCB terinstalasi sesuai rating', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-03', description: 'Continuity test passed untuk semua sirkuit', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-04', description: 'Insulation resistance test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-05', description: 'Earth resistance test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-06', description: 'Polarity test passed', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-07', description: 'Load test passed - tidak ada overheating', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-004-08', description: 'Voltage drop dalam batas yang diizinkan', passed: null, notes: '', verifiedBy: '', date: '' },
      ],
    },
    {
      id: 'CK-005',
      name: 'Final Acceptance Checklist',
      category: 'Acceptance',
      items: [
        { id: 'CK-005-01', description: 'Semua test procedure telah selesai', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-02', description: 'Semua defect telah diperbaiki', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-03', description: 'As-built diagram tersedia dan akurat', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-04', description: 'Operation & Maintenance Manual tersedia', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-05', description: 'Sertifikat kalibrasi alat pengujian tersedia', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-06', description: 'Personnel training telah dilaksanakan', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-07', description: 'Dokumentasi lengkap dan diarsipkan', passed: null, notes: '', verifiedBy: '', date: '' },
        { id: 'CK-005-08', description: 'Cliente telah menerima sistem', passed: null, notes: '', verifiedBy: '', date: '' },
      ],
    },
  ],
  reports: [
    {
      id: 'RPT-001',
      name: 'Test Summary Report',
      sections: [
        {
          title: 'Informasi Proyek',
          content: 'Bagian ini berisi informasi umum proyek',
          fields: [
            { name: 'projectName', label: 'Nama Proyek', type: 'text', required: true },
            { name: 'projectAddress', label: 'Alamat Proyek', type: 'text', required: true },
            { name: 'clientName', label: 'Nama Klien', type: 'text', required: true },
            { name: 'contractorName', label: 'Nama Kontraktor', type: 'text', required: true },
            { name: 'testDate', label: 'Tanggal Pengujian', type: 'date', required: true },
          ],
        },
        {
          title: 'Ringkasan Hasil Uji',
          content: 'Keseluruhan hasil pengujian',
          fields: [
            { name: 'totalTests', label: 'Total Pengujian', type: 'number', required: true },
            { name: 'passedTests', label: 'Berhasil', type: 'number', required: true },
            { name: 'failedTests', label: 'Gagal', type: 'number', required: true },
            { name: 'overallStatus', label: 'Status Overall', type: 'text', required: true },
          ],
        },
        {
          title: 'Tanda Tangan',
          content: 'Konfirmasi oleh pihak terkait',
          fields: [
            { name: 'testEngineer', label: 'Test Engineer', type: 'signature', required: true },
            { name: 'supervisor', label: 'Supervisor', type: 'signature', required: true },
            { name: 'clientRepresentative', label: 'Representative Klien', type: 'signature', required: true },
          ],
        },
      ],
    },
  ],
};

// ============================================
// EXPORT ALL TEST PLANS
// ============================================

export const TEST_PLANS = {
  complete: COMPLETE_TEST_PLAN,
  transformer: TRANSFORMER_TESTS,
  switchgear: SWITCHGEAR_TESTS,
  distribution: DISTRIBUTION_TESTS,
  renewable: RENEWABLE_TESTS,
  periodic: PERIODIC_MAINTENANCE_TESTS,
  categories: TEST_PLAN_CATEGORIES,
  voltageLevels: VOLTAGE_LEVELS,
  systemTypes: SYSTEM_TYPES,
  standards: STANDARDS,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTestPlanById(id: string): TestPlan | undefined {
  if (id === COMPLETE_TEST_PLAN.id) return COMPLETE_TEST_PLAN;
  return undefined;
}

export function getTestProceduresByCategory(category: string): TestProcedure[] {
  const allProcedures = [
    ...TRANSFORMER_TESTS,
    ...SWITCHGEAR_TESTS,
    ...DISTRIBUTION_TESTS,
    ...RENEWABLE_TESTS,
    ...PERIODIC_MAINTENANCE_TESTS,
  ];
  return allProcedures.filter(p => p.category === category);
}

export function getTestProceduresByVoltage(voltageLevel: string): TestProcedure[] {
  const allProcedures = [
    ...TRANSFORMER_TESTS,
    ...SWITCHGEAR_TESTS,
    ...DISTRIBUTION_TESTS,
    ...RENEWABLE_TESTS,
    ...PERIODIC_MAINTENANCE_TESTS,
  ];
  return allProcedures.filter(p => p.voltageLevel === voltageLevel || p.voltageLevel === 'ALL');
}

export function getTestProceduresBySystemType(systemType: string): TestProcedure[] {
  const allProcedures = [
    ...TRANSFORMER_TESTS,
    ...SWITCHGEAR_TESTS,
    ...DISTRIBUTION_TESTS,
    ...RENEWABLE_TESTS,
    ...PERIODIC_MAINTENANCE_TESTS,
  ];
  return allProcedures.filter(p => p.systemType.includes(systemType));
}

export function getChecklistById(id: string) {
  return COMPLETE_TEST_PLAN.checklists.find(c => c.id === id);
}

export function getReportTemplateById(id: string) {
  return COMPLETE_TEST_PLAN.reports.find(r => r.id === id);
}

export default TEST_PLANS;
