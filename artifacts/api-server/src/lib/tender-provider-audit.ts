import { desc, sql } from "drizzle-orm";
import { GetTenderProviderAuditResponse } from "@workspace/api-zod";
import { db, tenderProviderAudit } from "../db";
import type { TenderAnalysisErrorCode } from "./tender-analysis-errors";

export function recordTenderProviderCheck(
  accountId: number,
  checkedAt: string,
  code: TenderAnalysisErrorCode | "AI_PROVIDER_READY" | "AI_SETUP_RATE_LIMITED",
) {
  // Runtime allowlist as well as static types: never persist SDK error text.
  const safeCode = GetTenderProviderAuditResponse.shape.items.element.shape.code.parse(code);
  // Lexical retention comparisons require the canonical UTC millisecond format.
  if (new Date(checkedAt).toISOString() !== checkedAt) {
    throw new Error("Provider audit timestamp must be canonical UTC ISO");
  }
  db.insert(tenderProviderAudit).values({ accountId, checkedAt, code: safeCode }).run();
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
  return GetTenderProviderAuditResponse.parse({
    items: db.select().from(tenderProviderAudit)
      .orderBy(desc(tenderProviderAudit.id)).limit(50).all(),
  });
}
