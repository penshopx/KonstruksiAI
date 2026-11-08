import { desc } from "drizzle-orm";
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
  db.insert(tenderProviderAudit).values({ accountId, checkedAt, code: safeCode }).run();
}

export function listTenderProviderChecks() {
  return GetTenderProviderAuditResponse.parse({
    items: db.select().from(tenderProviderAudit)
      .orderBy(desc(tenderProviderAudit.id)).limit(50).all(),
  });
}
