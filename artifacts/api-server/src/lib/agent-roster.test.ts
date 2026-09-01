import assert from "node:assert/strict";
import test from "node:test";
import { AGENT_NAMES, AGENT_ROSTER, isValidAgentId } from "./agent-roster";

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