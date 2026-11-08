import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { sql } from "drizzle-orm";

process.env.API_SERVER_DB_PATH = ":memory:";
process.env.NODE_ENV = "production";
const { db, tenderProviderAudit, users, aiExecutionHistory, tenderAnalysisResults } = await import("../db");
const { initializeDatabase } = await import("../db/migrate");
const {
  recordTenderProviderCheck, listTenderProviderChecks, pruneTenderProviderAuditBatch,
  PROVIDER_AUDIT_RETENTION_MS, PROVIDER_AUDIT_BATCH_SIZE,
} = await import("./tender-provider-audit");
const { startTenderProviderAuditScheduler, PROVIDER_AUDIT_CLEANUP_INTERVAL_MS } =
  await import("./tender-provider-audit-scheduler");
const { logger } = await import("./logger");

initializeDatabase();
const now = new Date("2026-11-08T07:30:00.000Z");
const cutoff = new Date(now.getTime() - PROVIDER_AUDIT_RETENTION_MS);
const old = new Date(cutoff.getTime() - 1).toISOString();
function seed(checkedAt: string) {
  db.insert(tenderProviderAudit).values({ accountId: 123, checkedAt, code: "AI_PROVIDER_READY" }).run();
}
beforeEach(() => {
  db.delete(tenderProviderAudit).run();
});

test("migration preserves legacy audits and adds its index idempotently", () => {
  seed(old);
  db.run(sql`DROP INDEX tender_provider_audit_checked_at_idx`);
  initializeDatabase();
  initializeDatabase();
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
  const indexes = db.all(sql`PRAGMA index_list(tender_provider_audit)`) as Array<{ name: string }>;
  assert.ok(indexes.some(({ name }) => name === "tender_provider_audit_checked_at_idx"));
});

test("strict elapsed-time boundary keeps exact cutoff, newer and future rows", () => {
  seed(old);
  seed(cutoff.toISOString());
  seed(new Date(cutoff.getTime() + 1).toISOString());
  seed("2099-01-01T00:00:00.000Z");
  assert.equal(pruneTenderProviderAuditBatch(now), 1);
  assert.deepEqual(db.select().from(tenderProviderAudit).all().map((r) => r.checkedAt), [
    cutoff.toISOString(), new Date(cutoff.getTime() + 1).toISOString(), "2099-01-01T00:00:00.000Z",
  ]);
  assert.equal(pruneTenderProviderAuditBatch(now), 0);
  assert.equal(pruneTenderProviderAuditBatch(new Date(now.getTime() + 1)), 1);
});

test("retention spans leap day and UTC midnight without calendar-day rounding", () => {
  const leapNow = new Date("2024-08-27T00:00:00.000Z");
  const leapCutoff = new Date(leapNow.getTime() - PROVIDER_AUDIT_RETENTION_MS);
  assert.equal(leapCutoff.toISOString(), "2024-02-29T00:00:00.000Z");
  seed(leapCutoff.toISOString());
  seed(new Date(leapCutoff.getTime() - 1).toISOString());
  assert.equal(pruneTenderProviderAuditBatch(leapNow), 1);
  assert.equal(db.select().from(tenderProviderAudit).all()[0].checkedAt, leapCutoff.toISOString());
});

test("ambiguous legacy timestamps and invalid clocks cannot cause accidental deletion", () => {
  for (const timestamp of ["not-a-date", "", "2000-01-01", "2000-01-01T07:00:00.000+07:00"]) seed(timestamp);
  assert.equal(pruneTenderProviderAuditBatch(now), 0);
  assert.throws(() => pruneTenderProviderAuditBatch(new Date(NaN)), RangeError);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 4);
  assert.throws(() => recordTenderProviderCheck(1, "2000-01-01", "AI_PROVIDER_READY"));
  assert.throws(() => recordTenderProviderCheck(1, "invalid", "AI_PROVIDER_READY"));
  recordTenderProviderCheck(1, now.toISOString(), "AI_PROVIDER_READY");
});

test("bounded deletion and the 50-row display limit are separate policies", () => {
  db.transaction(() => {
    for (let i = 0; i < PROVIDER_AUDIT_BATCH_SIZE + 7; i++) seed(old);
    for (let i = 0; i < 55; i++) seed(now.toISOString());
  });
  assert.equal(pruneTenderProviderAuditBatch(now), PROVIDER_AUDIT_BATCH_SIZE);
  assert.equal(pruneTenderProviderAuditBatch(now), 7);
  assert.equal(pruneTenderProviderAuditBatch(now), 0);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 55);
  const items = listTenderProviderChecks().items;
  assert.equal(items.length, 50);
  assert.ok(items.every((r, i) => i === 0 || r.id < items[i - 1].id));
});

test("provider retention never deletes account, execution history or Tender results", () => {
  const [user] = db.insert(users).values({
    name: "Retention test", email: "retention@example.test", password: "test-only",
  }).returning().all();
  const oldDate = new Date("2000-01-01T00:00:00.000Z");
  db.insert(aiExecutionHistory).values({
    id: "retained-execution", userId: user.id, module: "tender", status: "completed",
    inputSummary: "Retain", startedAt: oldDate, createdAt: oldDate, updatedAt: oldDate,
  }).run();
  db.insert(tenderAnalysisResults).values({
    id: "retained-tender", executionId: "retained-execution", userId: user.id,
    projectName: "Retain", tenderType: "construction", overallCompleteness: 80,
    complianceScore: 80, createdAt: oldDate, updatedAt: oldDate,
  }).run();
  const before = {
    accounts: db.select().from(users).all(),
    history: db.select().from(aiExecutionHistory).all(),
    results: db.select().from(tenderAnalysisResults).all(),
  };
  seed(old);
  assert.equal(pruneTenderProviderAuditBatch(now), 1);
  assert.deepEqual({
    accounts: db.select().from(users).all(),
    history: db.select().from(aiExecutionHistory).all(),
    results: db.select().from(tenderAnalysisResults).all(),
  }, before);
});

test("scheduler catches up in batches, runs daily, avoids duplicates, and stops", (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: now.getTime() });
  db.transaction(() => {
    for (let i = 0; i < PROVIDER_AUDIT_BATCH_SIZE + 1; i++) seed(old);
  });
  const stop = startTenderProviderAuditScheduler();
  t.after(() => { stop(); t.mock.timers.reset(); });
  assert.equal(startTenderProviderAuditScheduler(), stop);
  t.mock.timers.tick(1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
  t.mock.timers.tick(1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 0);
  seed(old);
  t.mock.timers.tick(PROVIDER_AUDIT_CLEANUP_INTERVAL_MS - 1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
  t.mock.timers.tick(1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 0);
  stop();
  seed(old);
  t.mock.timers.tick(PROVIDER_AUDIT_CLEANUP_INTERVAL_MS);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
});

test("failed batch rolls back, logs failure, and retries on the next day", (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: now.getTime() });
  const errors = t.mock.method(logger, "error", () => {});
  seed(old);
  db.run(sql`CREATE TRIGGER retention_test_abort BEFORE DELETE ON tender_provider_audit
    BEGIN SELECT RAISE(ABORT, 'test failure'); END`);
  const stop = startTenderProviderAuditScheduler();
  t.after(() => {
    stop();
    db.run(sql`DROP TRIGGER IF EXISTS retention_test_abort`);
    t.mock.timers.reset();
  });
  t.mock.timers.tick(1);
  assert.equal(errors.mock.callCount(), 1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
  db.run(sql`DROP TRIGGER retention_test_abort`);
  t.mock.timers.tick(PROVIDER_AUDIT_CLEANUP_INTERVAL_MS - 1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 1);
  t.mock.timers.tick(1);
  assert.equal(db.select().from(tenderProviderAudit).all().length, 0);
});

