import { createHash, randomUUID } from "node:crypto";
import { and, eq, inArray, lt } from "drizzle-orm";
import { db, aiExecutionHistory, tenderAnalysisRequests } from "../db";
import { serializeExecutionInputSummary, type ExecutionInputSummary } from "./execution-history";

// Canonical object ordering; document array order remains meaningful.
export function tenderInputHash(input: unknown): string {
  function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
        .map(([key, item]) => [key, canonical(item)]));
    }
    return value;
  }
  return createHash("sha256").update(JSON.stringify(canonical(input))).digest("hex");
}

function key(userId: number, requestId: string): string {
  return tenderInputHash([userId, requestId]);
}

export function findTenderRequest(userId: number, requestId: string, workspaceId: string | null) {
  const row = db.select().from(tenderAnalysisRequests)
    .innerJoin(aiExecutionHistory, eq(tenderAnalysisRequests.executionId, aiExecutionHistory.id))
    .where(and(eq(tenderAnalysisRequests.id, key(userId, requestId)),
      eq(tenderAnalysisRequests.userId, userId),
      eq(tenderAnalysisRequests.workspaceScope, workspaceId ?? ""))).get();
  return row ? { request: row.tender_analysis_requests, execution: row.ai_execution_history } : null;
}

// Never resume a provider call after a lease expires: its outcome is unknown.
// All instances must use the same existing SQLite file; independent files are
// independent deployments, not a distributed lock.
export function reconcileTenderRequests(userId: number) {
  const now = new Date();
  db.update(aiExecutionHistory).set({
    status: "failed", completedAt: now, updatedAt: now,
    errorMessage: "Proses terhenti atau melewati batas waktu. Hasil provider tidak dapat dipastikan.",
  }).where(and(eq(aiExecutionHistory.userId, userId), eq(aiExecutionHistory.module, "tender"),
    inArray(aiExecutionHistory.status, ["pending", "running"]),
    lt(aiExecutionHistory.updatedAt, new Date(now.getTime() - 30 * 60_000)))).run();
}

export function claimTenderRequest(params: {
  userId: number; requestId: string; workspaceId: string | null; inputHash: string;
  retryOfId: string | null; inputSummary: ExecutionInputSummary;
}) {
  // IMMEDIATE serializes admission across processes, before any reads.
  return db.transaction((tx) => {
    reconcileTenderRequests(params.userId);
    const existing = tx.select().from(tenderAnalysisRequests)
      .where(eq(tenderAnalysisRequests.id, key(params.userId, params.requestId))).get();
    if (existing) {
      if (existing.workspaceScope !== (params.workspaceId ?? "") || existing.inputHash !== params.inputHash) {
        return { kind: "conflict" } as const;
      }
      return { kind: "replay" } as const;
    }
    const active = tx.select({ id: aiExecutionHistory.id }).from(aiExecutionHistory).where(and(
      eq(aiExecutionHistory.userId, params.userId), eq(aiExecutionHistory.module, "tender"),
      inArray(aiExecutionHistory.status, ["pending", "running"]),
    )).get();
    if (active) return { kind: "busy" } as const;
    const now = new Date();
    const execution = tx.insert(aiExecutionHistory).values({
      id: randomUUID(), userId: params.userId, workspaceId: params.workspaceId, module: "tender",
      status: "running", inputSummary: serializeExecutionInputSummary(params.inputSummary),
      retryOfId: params.retryOfId, startedAt: now, createdAt: now, updatedAt: now,
    }).returning().get();
    tx.insert(tenderAnalysisRequests).values({
      id: key(params.userId, params.requestId), userId: params.userId,
      workspaceScope: params.workspaceId ?? "", inputHash: params.inputHash, executionId: execution.id,
    }).run();
    return { kind: "claimed", execution } as const;
  }, { behavior: "immediate" });
}
