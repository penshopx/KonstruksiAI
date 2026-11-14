import { and, desc, eq, sql } from "drizzle-orm";
import { GetTenderProviderAuditResponse } from "@workspace/api-zod";
import { db, tenderProviderAudit } from "../db";
import type { TenderAnalysisErrorCode } from "./tender-analysis-errors";

type ProviderCheckResult = TenderAnalysisErrorCode | "AI_PROVIDER_READY" | "AI_SETUP_RATE_LIMITED";
// Longer than the 15s provider timeout. Shared-file processes must not mark a
// live peer's probe interrupted just because another process has started.
export const PROVIDER_CHECK_MAX_DURATION_MS = 30_000;

export function recordTenderProviderCheck(
  accountId: number,
  checkedAt: string,
  code: ProviderCheckResult | "AI_SETUP_IN_PROGRESS",
) {
  // Runtime allowlist as well as static types: never persist SDK error text.
  const safeCode = GetTenderProviderAuditResponse.shape.items.element.shape.code.parse(code);
  // Lexical retention comparisons require the canonical UTC millisecond format.
  if (new Date(checkedAt).toISOString() !== checkedAt) {
    throw new Error("Provider audit timestamp must be canonical UTC ISO");
  }
  if (!Number.isSafeInteger(accountId) || accountId < 1) {
    throw new Error("Provider audit requires an internal account ID");
  }
  return db.insert(tenderProviderAudit).values({ accountId, checkedAt, code: safeCode })
    .returning({ id: tenderProviderAudit.id }).get().id;
}

export function beginTenderProviderCheck(accountId: number, checkedAt: string) {
  return recordTenderProviderCheck(accountId, checkedAt, "AI_SETUP_IN_PROGRESS");
}

/** A single compare-and-set: never append a second row or replace a terminal outcome. */
export function finishTenderProviderCheck(id: number, code: ProviderCheckResult) {
  const safeCode = GetTenderProviderAuditResponse.shape.items.element.shape.code
    .exclude(["AI_SETUP_IN_PROGRESS", "AI_SETUP_INTERRUPTED"]).parse(code);
  const updated = db.update(tenderProviderAudit).set({ code: safeCode })
    .where(and(eq(tenderProviderAudit.id, id), eq(tenderProviderAudit.code, "AI_SETUP_IN_PROGRESS")))
    .run().changes;
  if (updated !== 1) throw new Error("Provider audit check is no longer in progress");
}

/** Unknown outcomes are terminal and are never dispatched again. */
export function reconcileTenderProviderChecks(now: Date = new Date()) {
  const cutoff = new Date(now.getTime() - PROVIDER_CHECK_MAX_DURATION_MS).toISOString();
  return db.run(sql`UPDATE tender_provider_audit SET code = 'AI_SETUP_INTERRUPTED'
    WHERE code = 'AI_SETUP_IN_PROGRESS' AND checked_at <= ${cutoff}
      AND strftime('%Y-%m-%dT%H:%M:%fZ', checked_at) = checked_at`).changes;
}

// Product-owner-approved policy: 180 elapsed days, strictly older than cutoff.
export const PROVIDER_AUDIT_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;
export const PROVIDER_AUDIT_BATCH_SIZE = 500;

/** One atomic, bounded batch. No analysis/history table is part of this query. */
export function pruneTenderProviderAuditBatch(now: Date = new Date()) {
  const cutoff = new Date(now.getTime() - PROVIDER_AUDIT_RETENTION_MS).toISOString();
  return db.run(sql`DELETE FROM tender_provider_audit WHERE id IN (
    SELECT id FROM tender_provider_audit
    WHERE checked_at < ${cutoff}
      AND strftime('%Y-%m-%dT%H:%M:%fZ', checked_at) = checked_at
    ORDER BY checked_at, id
    LIMIT ${PROVIDER_AUDIT_BATCH_SIZE}
  )`).changes;
}

export function listTenderProviderChecks() {
  reconcileTenderProviderChecks();
  return GetTenderProviderAuditResponse.parse({
    items: db.select().from(tenderProviderAudit)
      .orderBy(desc(tenderProviderAudit.id)).limit(50).all(),
  });
}
