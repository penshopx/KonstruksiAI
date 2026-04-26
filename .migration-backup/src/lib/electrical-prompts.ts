// ============================================================
// KonstruksiAI — Electrical Engineering Prompts
// Professional document templates for Electrical Engineers
// ============================================================

export interface ElectricalPrompt {
  id: string;
  title: string;
  icon: string;
  description: string;
  examplePrompt: string;
  category: string;
}

export const electricalPrompts: ElectricalPrompt[] = [
  {
    id: "consult-expert",
    title: "Consult an Expert: Electrical Engineer",
    icon: "💡",
    description: "Konsultasi dengan ahli teknik elektro untuk masalah teknis",
    examplePrompt: "Saya butuh konsultasi tentang desain sistem proteksi untuk gedung bertingkat. Apa pertimbangan utamanya?",
    category: "consultation"
  },
  {
    id: "project-proposal",
    title: "Create A Project Proposal Document",
    icon: "📃",
    description: "Dokumen proposal proyek instalasi listrik",
    examplePrompt: "Buat proposal proyek instalasi listrik untuk gedung perkantoran 10 lantai dengan luas total 15.000 m²",
    category: "documents"
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Document",
    icon: "⚠️",
    description: "Dokumen penilaian risiko pekerjaan elektrikal",
    examplePrompt: "Buatkan Risk Assessment untuk pekerjaan instalasi panel distribusi di gedung komersial",
    category: "documents"
  },
  {
    id: "risk-assessment",
    title: "Create A Risk Assessments Document",
    icon: "📊",
    description: "Dokumen penilaian risiko pekerjaan elektrikal",
    examplePrompt: "Buat risk assessment untuk pekerjaan instalasi listrik di proyek gedung bertingkat tinggi",
    category: "documents"
  },
  {
    id: "safety-procedures",
    title: "Create A Safety Procedures Document",
    icon: "📋",
    description: "Prosedur keselamatan kerja instalasi listrik",
    examplePrompt: "Buat prosedur K3 untuk pekerjaan instalasi listrik di area basah (wet area)",
    category: "documents"
  },
  {
    id: "test-reports",
    title: "Create A Test Reports Document",
    icon: "📋",
    description: "Laporan pengujian instalasi listrik",
    examplePrompt: "Buat format laporan pengujian tahanan isolasi dan kontinuitas grounding untuk instalasi listrik gedung",
    category: "documents"
  },
  {
    id: "bill-of-materials",
    title: "Create A Bill Of Materials",
    icon: "📑",
    description: "Daftar material instalasi kelistrikan",
    examplePrompt: "Buat BOM untuk instalasi listrik gedung kantor 5 lantai dengan luas 8.000 m²",
    category: "documents"
  },
  {
    id: "equipment-manuals",
    title: "Create An Equipment Manuals Document",
    icon: "📚",
    description: "Manual operasional peralatan listrik",
    examplePrompt: "Buat manual operasi untuk panel distribusi utama (Main Distribution Panel) 400V",
    category: "documents"
  },
  {
    id: "change-requests",
    title: "Create A Change Requests Document",
    icon: "📝",
    description: "Dokumen permintaan perubahan desain",
    examplePrompt: "Buat format change request untuk penambahan kapasitas panel listrik dari 630A menjadi 800A",
    category: "documents"
  },
  {
    id: "regulatory-compliance",
    title: "Create A Regulatory Compliance Documentation",
    icon: "📝",
    description: "Dokumen kepatuhan regulasi ketenagalistrikan",
    examplePrompt: "Buat checklist kepatuhan untuk standar PUIL 2011 pada instalasi listrik gedung",
    category: "documents"
  },
  {
    id: "test-plans",
    title: "Create A Test Plans Document",
    icon: "📝",
    description: "Rencana pengujian sistem kelistrikan",
    examplePrompt: "Buat test plan untuk commissioning sistem PLTS on-grid 100 kWp",
    category: "documents"
  },
  {
    id: "vendor-evaluations",
    title: "Create A Vendor Evaluations Document",
    icon: "📝",
    description: "Evaluasi vendor peralatan listrik",
    examplePrompt: "Buat kriteria evaluasi vendor untuk pembelian panel listrik LV",
    category: "documents"
  },
  {
    id: "incident-reports",
    title: "Create An Incident Reports Document",
    icon: "📝",
    description: "Laporan insiden keselamatan kerja",
    examplePrompt: "Buat format laporan insiden sengatan listrik di lokasi proyek konstruksi",
    category: "documents"
  },
  {
    id: "energy-efficiency",
    title: "Create An Energy Efficiency Analysis Document",
    icon: "🔋",
    description: "Analisis efisiensi energi listrik",
    examplePrompt: "Buat analisis efisiensi energi untuk gedung perkantoran dengan sistem AC VRV dan pencahayaan LED",
    category: "technical"
  },
  {
    id: "circuit-diagrams",
    title: "Create A Circuit Diagrams Document",
    icon: "🔌",
    description: "Diagram rangkaian listrik",
    examplePrompt: "Buat single line diagram untuk distribusi listrik gedung bertingkat dengangenset backup",
    category: "technical"
  },
  {
    id: "wiring-diagrams",
    title: "Create A Wiring Diagrams Document",
    icon: "🔌",
    description: "Diagram pengawatan instalasi listrik",
    examplePrompt: "Buat wiring diagram untuk panel distribusi lantai (floor distribution panel) dengan 12 sirkuit",
    category: "technical"
  },
  {
    id: "design-specifications",
    title: "Create An Electrical Design Specifications Document",
    icon: "🔌",
    description: "Spesifikasi desain sistem kelistrikan",
    examplePrompt: "Buat electrical design specification untuk proyek gedung komersial dengan sistem PLN 1977 kVA dan genset 1000 kVA",
    category: "technical"
  },
  {
    id: "maintenance-schedules",
    title: "Create A Maintenance Schedules Document",
    icon: "🔧",
    description: "Jadwal pemeliharaan sistem kelistrikan",
    examplePrompt: "Buat preventive maintenance schedule untuk instalasi listrik gedung selama 1 tahun",
    category: "technical"
  },
  {
    id: "technical-presentation",
    title: "Create a Technical Presentation",
    icon: "🖥️",
    description: "Presentasi teknis sistem kelistrikan",
    examplePrompt: "Buat presentasi teknis tentang sistem proteksi petir untuk gedung tinggi",
    category: "presentation"
  }
];

// Category grouping
export const electricalPromptsByCategory = {
  consultation: electricalPrompts.filter(p => p.category === "consultation"),
  documents: electricalPrompts.filter(p => p.category === "documents"),
  technical: electricalPrompts.filter(p => p.category === "technical"),
  presentation: electricalPrompts.filter(p => p.category === "presentation")
};

// Quick access - get prompt by ID
export function getElectricalPromptById(id: string): ElectricalPrompt | undefined {
  return electricalPrompts.find(p => p.id === id);
}

// Quick access - get all prompts in a category
export function getElectricalPromptsByCategory(category: string): ElectricalPrompt[] {
  return electricalPrompts.filter(p => p.category === category);
}
