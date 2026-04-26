/**
 * Civil Engineering Agent Pack for KonstruksiAI
 * 
 * This module exports all Civil Engineering agents and utilities
 * for integration with the Master Orchestrator.
 * 
 * Version: 2.0.0
 */

export const CIVIL_AGENTS = {
  // Core Expert
  civil_engineer_expert_agent: {
    id: "civil_engineer_expert_agent",
    name: "Civil Engineer Expert",
    description: "Konsultasi umum untuk semua hal terkait teknik sipil",
    category: "civil"
  },
  
  // Project Initiation
  civil_project_proposal_agent: {
    id: "civil_project_proposal_agent",
    name: "Civil Project Proposal Agent",
    description: "Menyusun proposal proyek sipil yang persuasif",
    category: "civil",
    focus: ["proposal", "business case", "project initiation"]
  },
  
  // Environmental
  civil_eia_agent: {
    id: "civil_eia_agent",
    name: "Civil EIA Agent",
    description: "AMDAL dan kajian dampak lingkungan",
    category: "civil",
    focus: ["AMDAL", "environmental", "Izin Lingkungan"]
  },
  
  // Scheduling
  civil_construction_schedule_agent: {
    id: "civil_construction_schedule_agent",
    name: "Civil Construction Schedule Agent",
    description: "Jadwal konstruksi dengan CPM",
    category: "civil",
    focus: ["schedule", "CPM", "jadwal", "timeline"]
  },
  
  // Design & Analysis
  civil_structural_analysis_agent: {
    id: "civil_structural_analysis_agent",
    name: "Civil Structural Analysis Agent",
    description: "Analisis struktural dan behavior struktur",
    category: "civil",
    focus: ["structural", "struktur", "analisis", "design"]
  },
  
  // Cost
  civil_cost_estimate_agent: {
    id: "civil_cost_estimate_agent",
    name: "Civil Cost Estimate Agent",
    description: "Estimasi biaya proyek sipil (RAB)",
    category: "civil",
    focus: ["cost", "RAB", "estimasi", "biaya", "budget"]
  },
  
  // Project Management
  civil_project_plan_agent: {
    id: "civil_project_plan_agent",
    name: "Civil Project Plan Agent",
    description: "Rencana proyek sipil",
    category: "civil",
    focus: ["project plan", "rencana proyek", "manajemen"]
  },
  
  // Quantity
  civil_quantity_takeoff_agent: {
    id: "civil_quantity_takeoff_agent",
    name: "Civil Quantity Takeoff Agent",
    description: "Quantity takeoff dan BoQ",
    category: "civil",
    focus: ["quantity", "BoQ", "takeoff", "volume"]
  },
  
  // Method Statement
  civil_method_statement_agent: {
    id: "civil_method_statement_agent",
    name: "Civil Method Statement Agent",
    description: "Rencana metode pelaksanaan",
    category: "civil",
    focus: ["method statement", "metode", "pelaksanaan", "construction method"]
  },
  
  // Site Logistics
  civil_site_logistics_agent: {
    id: "civil_site_logistics_agent",
    name: "Civil Site Logistics Agent",
    description: "Site logistics dan layout plan",
    category: "civil",
    focus: ["logistics", "site layout", "facilities"]
  },
  
  // Quality
  civil_quality_inspection_agent: {
    id: "civil_quality_inspection_agent",
    name: "Civil Quality Inspection Agent",
    description: "Quality inspection dan ITP",
    category: "civil",
    focus: ["quality", "inspection", "ITP", "QC"]
  },
  
  // Progress Reporting
  civil_progress_reporting_agent: {
    id: "civil_progress_reporting_agent",
    name: "Civil Progress Reporting Agent",
    description: "Laporan kemajuan proyek",
    category: "civil",
    focus: ["progress", "report", "laporan", "S-Curve"]
  }
};

/**
 * Get agent by ID
 */
export function getCivilAgent(agentId: string) {
  return CIVIL_AGENTS[agentId as keyof typeof CIVIL_AGENTS];
}

/**
 * Get all agents
 */
export function getAllCivilAgents() {
  return Object.values(CIVIL_AGENTS);
}

/**
 * Get agents by category
 */
export function getAgentsByCategory(category: string) {
  return getAllCivilAgents().filter(agent => agent.category === category);
}

/**
 * Search agents by keyword
 */
export function searchCivilAgents(keyword: string) {
  const lower = keyword.toLowerCase();
  return getAllCivilAgents().filter((agent: any) => 
    agent.id.toLowerCase().includes(lower) ||
    agent.name.toLowerCase().includes(lower) ||
    agent.description.toLowerCase().includes(lower) ||
    (agent.focus && agent.focus.some((f: string) => f.toLowerCase().includes(lower)))
  );
}

/**
 * Civil Knowledge Base
 */
export const CIVIL_KNOWLEDGE_BASE = {
  id: "civil_knowledge_base",
  version: "2.0.0",
  domains: [
    "Perencanaan Proyek Konstruksi",
    "Metode Pelaksanaan Pekerjaan Sipil",
    "Analisis Struktur Dasar",
    "Estimasi Biaya Proyek Sipil",
    "Manajemen Proyek",
    "Dampak Lingkungan",
    "Integrasi Multidisplin"
  ],
  regulations: [
    "SNI 2847:2019",
    "SNI 1726:2019",
    "SNI 1727:2020",
    "PP No. 34 Tahun 2021",
    "PermenPUPR No. 10 Tahun 2021",
    "PermenLH No. 5 Tahun 2012"
  ]
};

/**
 * Civil Output Contract
 */
export const CIVIL_OUTPUT_CONTRACT = {
  requiredSections: [
    "Tujuan",
    "Konteks / Ruang Lingkup",
    "Isi Utama / Temuan",
    "Risiko / Gap / Asumsi",
    "Rekomendasi / Tindakan",
    "Data tambahan yang dibutuhkan",
    "Tingkat keyakinan",
    "Catatan validasi profesional"
  ],
  confidenceLevels: ["tinggi", "sedang", "rendah"]
};

/**
 * Civil Routing Rules
 */
export const CIVIL_ROUTING = {
  rules: [
    { keyword: "proposal", agent: "civil_project_proposal_agent" },
    { keyword: "jadwal", agent: "civil_construction_schedule_agent" },
    { keyword: "AMDAL", agent: "civil_eia_agent" },
    { keyword: "lingkungan", agent: "civil_eia_agent" },
    { keyword: "struktur", agent: "civil_structural_analysis_agent" },
    { keyword: "biaya", agent: "civil_cost_estimate_agent" },
    { keyword: "RAB", agent: "civil_cost_estimate_agent" },
    { keyword: "method statement", agent: "civil_method_statement_agent" },
    { keyword: "logistics", agent: "civil_site_logistics_agent" },
    { keyword: "quality", agent: "civil_quality_inspection_agent" },
    { keyword: "progress", agent: "civil_progress_reporting_agent" },
    { keyword: "laporan", agent: "civil_progress_reporting_agent" },
    { keyword: "quantity", agent: "civil_quantity_takeoff_agent" },
    { keyword: "BoQ", agent: "civil_quantity_takeoff_agent" }
  ]
};

/**
 * Default export
 */
export default {
  agents: CIVIL_AGENTS,
  knowledgeBase: CIVIL_KNOWLEDGE_BASE,
  outputContract: CIVIL_OUTPUT_CONTRACT,
  routing: CIVIL_ROUTING,
  getAgent: getCivilAgent,
  getAllAgents: getAllCivilAgents,
  getByCategory: getAgentsByCategory,
  search: searchCivilAgents
};
