// src/lib/agent-roster.test.ts
import assert from "node:assert/strict";
import test from "node:test";

// src/lib/agent-roster.ts
var AGENT_ROSTER = [
  { id: "general", name: "KonstruksiAI", icon: "\u{1F3D7}\uFE0F", description: "Asisten umum konstruksi & engineering", color: "orange" },
  { id: "estimator", name: "Estimator RAB", icon: "\u{1F4B0}", description: "Spesialis estimasi biaya & RAB", color: "green" },
  { id: "tender", name: "Tender Expert", icon: "\u{1F4CB}", description: "Ahli tender & pengadaan LPSE", color: "blue" },
  { id: "k3", name: "Ahli K3", icon: "\u26D1\uFE0F", description: "Keselamatan & kesehatan kerja", color: "red" },
  { id: "perijinan", name: "Konsultan Perijinan", icon: "\u{1F4DC}", description: "SBU, SKK, PBG, AMDAL", color: "purple" },
  { id: "energi", name: "EBT Specialist", icon: "\u26A1", description: "Energi terbarukan & kelistrikan", color: "yellow" },
  { id: "migas", name: "Migas Expert", icon: "\u{1F6E2}\uFE0F", description: "Minyak, gas, pertambangan", color: "slate" },
  { id: "kontrak", name: "Legal Konstruksi", icon: "\u2696\uFE0F", description: "Kontrak, klaim, sengketa", color: "indigo" },
  { id: "electrical", name: "Electrical Engineer", icon: "\u{1F50C}", description: "Dokumen teknis & desain elektrikal", color: "amber" }
];
var AGENT_NAMES = Object.fromEntries(
  AGENT_ROSTER.map((agent) => [agent.id, agent.name])
);
function isValidAgentId(candidate) {
  return typeof candidate === "string" && Object.prototype.hasOwnProperty.call(AGENT_NAMES, candidate);
}

// src/lib/agent-roster.test.ts
test("agent roster has unique ids and a general fallback", () => {
  const ids = AGENT_ROSTER.map((agent) => agent.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes("general"));
  assert.equal(Object.keys(AGENT_NAMES).length, AGENT_ROSTER.length);
  for (const agent of AGENT_ROSTER) {
    assert.equal(AGENT_NAMES[agent.id], agent.name);
    assert.equal(isValidAgentId(agent.id), true);
  }
});
test("retired or malformed agent ids are rejected", () => {
  assert.equal(isValidAgentId("retired-agent"), false);
  assert.equal(isValidAgentId(""), false);
  assert.equal(isValidAgentId(null), false);
});
