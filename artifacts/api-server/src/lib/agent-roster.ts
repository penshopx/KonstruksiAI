export interface AgentRosterEntry {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Canonical roster of agents KonstruksiAI can route between. API validation,
// persisted ids, and the web selector all derive from this list.
export const AGENT_ROSTER: readonly AgentRosterEntry[] = [
  { id: "general", name: "KonstruksiAI", icon: "🏗️", description: "Asisten umum konstruksi & engineering", color: "orange" },
  { id: "estimator", name: "Estimator RAB", icon: "💰", description: "Spesialis estimasi biaya & RAB", color: "green" },
  { id: "tender", name: "Tender Expert", icon: "📋", description: "Ahli tender & pengadaan LPSE", color: "blue" },
  { id: "k3", name: "Ahli K3", icon: "⛑️", description: "Keselamatan & kesehatan kerja", color: "red" },
  { id: "perijinan", name: "Konsultan Perijinan", icon: "📜", description: "SBU, SKK, PBG, AMDAL", color: "purple" },
  { id: "energi", name: "EBT Specialist", icon: "⚡", description: "Energi terbarukan & kelistrikan", color: "yellow" },
  { id: "migas", name: "Migas Expert", icon: "🛢️", description: "Minyak, gas, pertambangan", color: "slate" },
  { id: "kontrak", name: "Legal Konstruksi", icon: "⚖️", description: "Kontrak, klaim, sengketa", color: "indigo" },
  { id: "electrical", name: "Electrical Engineer", icon: "🔌", description: "Dokumen teknis & desain elektrikal", color: "amber" },
];

export const AGENT_NAMES: Readonly<Record<string, string>> = Object.fromEntries(
  AGENT_ROSTER.map((agent) => [agent.id, agent.name]),
);

export function isValidAgentId(candidate: unknown): candidate is string {
  return typeof candidate === "string" && Object.prototype.hasOwnProperty.call(AGENT_NAMES, candidate);
}
