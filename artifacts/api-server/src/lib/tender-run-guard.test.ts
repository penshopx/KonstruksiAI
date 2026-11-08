import assert from "node:assert/strict";
import test from "node:test";
import { acquireTenderAnalysisRun } from "./tender-run-guard.js";

test("only one concurrent run per account is admitted and different accounts remain independent", async () => {
  let finish!: () => void;
  const waiting = new Promise<void>(resolve => { finish = resolve; });
  let calls = 0;
  const run = async () => {
    const release = acquireTenderAnalysisRun(1001);
    if (!release) return "busy";
    try {
      calls++;
      await waiting;
      return "done";
    } finally {
      release();
    }
  };
  const first = run();
  try {
    assert.deepEqual(await Promise.all([run(), run(), run()]), ["busy", "busy", "busy"]);
    assert.equal(calls, 1);
    const otherUser = acquireTenderAnalysisRun(1002);
    assert.ok(otherUser);
    otherUser();
  } finally {
    finish();
    await first;
  }
  const next = acquireTenderAnalysisRun(1001);
  assert.ok(next);
  next();
});

test("release after an error permits a new run and repeated old releases are harmless", () => {
  const release = acquireTenderAnalysisRun(1003);
  assert.ok(release);
  assert.throws(() => {
    try { throw new Error("provider failed"); } finally { release(); }
  });
  const next = acquireTenderAnalysisRun(1003);
  assert.ok(next);
  release();
  assert.equal(acquireTenderAnalysisRun(1003), null);
  next();
});
