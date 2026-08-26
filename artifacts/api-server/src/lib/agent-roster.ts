// Canonical roster of agent ids KonstruksiAI can route between. This is the
// single source of truth for validating any agent id that gets persisted or
// echoed back to clients (active agent, recommended agent, etc).
export const AGENT_NAMES: Record<string, string> = {
  general: "KonstruksiAI",
  estimator: "Estimator RAB",
  tender: "Tender Expert",
  k3: "Ahli K3",
  perijinan: "Konsultan Perijinan",
  energi: "EBT Specialist",
  migas: "Migas Expert",
  kontrak: "Legal Konstruksi",
  electrical: "Electrical Engineer",
};

export function isValidAgentId(candidate: unknown): candidate is string {
  return typeof candidate === "string" && Object.prototype.hasOwnProperty.call(AGENT_NAMES, candidate);
}
