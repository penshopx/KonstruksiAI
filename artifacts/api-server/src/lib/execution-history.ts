import { randomUUID } from "node:crypto";
import { and, eq, inArray, lt } from "drizzle-orm";
import { db, aiExecutionHistory, type AiExecutionHistory } from "../db";
import { hasActiveWorkspaceAccess } from "./workspace-access";

export const EXECUTION_MODULES = ["solver", "tender"] as const;
export const EXECUTION_STATUSES = ["pending", "running", "succeeded", "failed"] as const;

export type ExecutionModule = typeof EXECUTION_MODULES[number];
export type ExecutionStatus = typeof EXECUTION_STATUSES[number];

export interface ExecutionInputSummary {
  label: string;
  details?: string;
  metadata?: Record<string, string | number | boolean>;
}

export type ExecutionWorkspaceResolution =
  | { workspaceId: string | null }
  | { error: string; status: 400 | 403 };

const MAX_SUMMARY_VALUE_CHARS = 320;
const STALE_EXECUTION_MS = 30 * 60 * 1000;
const STALE_EXECUTION_ERROR = "Proses terhenti sebelum selesai. Silakan jalankan ulang analisis.";

function trimSummaryValue(value: unknown): string | number | boolean | null {
  if (typeof value === "string") return value.trim().slice(0, MAX_SUMMARY_VALUE_CHARS);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  return null;
}

export function serializeExecutionInputSummary(summary: ExecutionInputSummary): string {
  const metadata = summary.metadata
    ? Object.fromEntries(
      Object.entries(summary.metadata)
        .map(([key, value]) => [key, trimSummaryValue(value)] as const)
        .filter(([, value]) => value !== null),
    )
    : undefined;

  return JSON.stringify({
    label: summary.label.trim().slice(0, MAX_SUMMARY_VALUE_CHARS),
    ...(summary.details ? { details: summary.details.trim().slice(0, MAX_SUMMARY_VALUE_CHARS) } : {}),
    ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
  });
}

export function parseExecutionInputSummary(value: string): ExecutionInputSummary {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const metadata: Record<string, string | number | boolean> = {};
    if (parsed.metadata && typeof parsed.metadata === "object") {
      for (const [key, item] of Object.entries(parsed.metadata as Record<string, unknown>)) {
        const normalized = trimSummaryValue(item);
        if (normalized !== null) metadata[key] = normalized;
      }
    }
    return {
      label: typeof parsed.label === "string" ? parsed.label : "Eksekusi AI",
      details: typeof parsed.details === "string" ? parsed.details : undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
  } catch {
    return { label: "Eksekusi AI" };
  }
}

export async function resolveExecutionWorkspace(
  rawWorkspaceId: unknown,
  userId: number,
): Promise<ExecutionWorkspaceResolution> {
  if (rawWorkspaceId === undefined || rawWorkspaceId === null || rawWorkspaceId === "") {
    return { workspaceId: null };
  }
  if (typeof rawWorkspaceId !== "string" || !rawWorkspaceId.trim() || rawWorkspaceId.length > 128) {
    return { error: "Konteks ruang proyek tidak valid", status: 400 };
  }
  if (!await hasActiveWorkspaceAccess(rawWorkspaceId, userId)) {
    return { error: "Akses ruang proyek telah dicabut", status: 403 };
  }
  return { workspaceId: rawWorkspaceId };
}

export async function validateRetryReference(
  retryOfId: unknown,
  userId: number,
  module: ExecutionModule,
  workspaceId: string | null,
): Promise<{ retryOfId: string | null } | { error: string }> {
  if (retryOfId === undefined || retryOfId === null || retryOfId === "") {
    return { retryOfId: null };
  }
  if (typeof retryOfId !== "string" || !retryOfId.trim() || retryOfId.length > 128) {
    return { error: "Referensi pengulangan eksekusi tidak valid" };
  }

  const [previous] = await db
    .select({
      id: aiExecutionHistory.id,
      workspaceId: aiExecutionHistory.workspaceId,
      module: aiExecutionHistory.module,
    })
    .from(aiExecutionHistory)
    .where(and(eq(aiExecutionHistory.id, retryOfId), eq(aiExecutionHistory.userId, userId)));
  if (!previous || previous.module !== module || previous.workspaceId !== workspaceId) {
    return { error: "Eksekusi yang akan diulang tidak ditemukan" };
  }
  return { retryOfId: previous.id };
}

export async function createExecutionRecord(params: {
  userId: number;
  workspaceId: string | null;
  module: ExecutionModule;
  inputSummary: ExecutionInputSummary;
  retryOfId?: string | null;
}): Promise<AiExecutionHistory> {
  const now = new Date();
  const [record] = await db
    .insert(aiExecutionHistory)
    .values({
      id: randomUUID(),
      userId: params.userId,
      workspaceId: params.workspaceId,
      module: params.module,
      status: "pending",
      inputSummary: serializeExecutionInputSummary(params.inputSummary),
      retryOfId: params.retryOfId ?? null,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  if (!record) throw new Error("Catatan eksekusi tidak dapat dibuat");
  return record;
}

export async function transitionExecutionRecord(
  id: string,
  fromStatus: ExecutionStatus | ExecutionStatus[],
  patch: {
    status: ExecutionStatus;
    resultRef?: string | null;
    errorMessage?: string | null;
    completedAt?: Date | null;
  },
): Promise<void> {
  const expectedStatuses = Array.isArray(fromStatus) ? fromStatus : [fromStatus];
  const [updated] = await db
    .update(aiExecutionHistory)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(
      eq(aiExecutionHistory.id, id),
      inArray(aiExecutionHistory.status, expectedStatuses),
    ))
    .returning({ id: aiExecutionHistory.id });
  if (!updated) {
    throw new Error("Status eksekusi sudah berubah dan tidak dapat diperbarui");
  }
}

export async function reconcileStaleExecutionRecords(userId: number): Promise<void> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - STALE_EXECUTION_MS);
  await db
    .update(aiExecutionHistory)
    .set({
      status: "failed",
      errorMessage: STALE_EXECUTION_ERROR,
      completedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(aiExecutionHistory.userId, userId),
      inArray(aiExecutionHistory.status, ["pending", "running"]),
      lt(aiExecutionHistory.updatedAt, cutoff),
    ));
}