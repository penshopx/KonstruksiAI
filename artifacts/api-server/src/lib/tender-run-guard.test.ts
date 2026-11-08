import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
process.env.API_SERVER_DB_PATH = path.join(os.tmpdir(), `tender-guard-unit-${randomUUID()}.db`);
process.env.NODE_ENV = "production";
const { tenderInputHash } = await import("./tender-run-guard.js");

test("object key ordering does not change canonical Tender input identity", () => {
  assert.equal(tenderInputHash({ projectName: "Proyek", checklist: { b: false, a: true } }),
    tenderInputHash({ checklist: { a: true, b: false }, projectName: "Proyek" }));
});

test("input changes and document ordering change identity", () => {
  assert.notEqual(tenderInputHash({ present: true }), tenderInputHash({ present: false }));
  assert.notEqual(tenderInputHash(["NPWP", "SBU"]), tenderInputHash(["SBU", "NPWP"]));
});
