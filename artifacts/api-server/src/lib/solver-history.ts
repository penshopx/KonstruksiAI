import { and, desc, eq, isNotNull, isNull, or, type SQL } from "drizzle-orm";
import {
  db,
  aiExecutionHistory,
  projectWorkspaceMembers,
  projectWorkspaces,
  solverAnalysisResults,
  type SolverAnalysisResult,
} from "../db";

export interface SolverAnalysisPayload {
  problem: string;
  domain: string;
  approach: string;
  analysis: string;
  solution: string;
  regulations: string[];
  nextSteps: string[];
  outputFormat: string;
  context: string;
}

export interface SolverAnalysisHistorySummary {
  id: string;
  executionId: string;
  workspaceId: string | null;
  domain: string;
  problem: string;
  outputFormat: string;
  createdAt: Date;
  updatedAt: Date;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function toPayload(record: SolverAnalysisResult): SolverAnalysisPayload {
  return {
    problem: record.problem,
    domain: record.domain,
    context: record.context,
    outputFormat: record.outputFormat,
    approach: record.approach,
    analysis: record.analysis,
    solution: record.solution,
    regulations: parseStringArray(record.regulations),
    nextSteps: parseStringArray(record.nextSteps),
  };
}

export function toSolverAnalysisResult(record: SolverAnalysisResult) {
  return {
    id: record.id,
    executionId: record.executionId,
    workspaceId: record.workspaceId,
    ...toPayload(record),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toSolverAnalysisSummary(record: SolverAnalysisResult): SolverAnalysisHistorySummary {
  return {
    id: record.id,
    executionId: record.executionId,
    workspaceId: record.workspaceId,
    domain: record.domain,
    problem: record.problem,
    outputFormat: record.outputFormat,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function persistSuccessfulSolverAnalysis(params: {
  executionId: string;
  userId: number;
  workspaceId: string | null;
  payload: SolverAnalysisPayload;
}): Promise<SolverAnalysisResult> {
  const now = new Date();
  return Promise.resolve(db.transaction((tx) => {
    const result = tx
      .insert(solverAnalysisResults)
      .values({
        id: params.executionId,
        executionId: params.executionId,
        userId: params.userId,
        workspaceId: params.workspaceId,
        domain: params.payload.domain,
        problem: params.payload.problem,
        context: params.payload.context,
        outputFormat: params.payload.outputFormat,
        approach: params.payload.approach,
        analysis: params.payload.analysis,
        solution: params.payload.solution,
        regulations: JSON.stringify(params.payload.regulations),
        nextSteps: JSON.stringify(params.payload.nextSteps),
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();
    if (!result) throw new Error("Hasil analisis Solver tidak dapat disimpan");

    const transitioned = tx
      .update(aiExecutionHistory)
      .set({
        status: "succeeded",
        resultRef: `solver:${result.id}`,
        errorMessage: null,
        completedAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(aiExecutionHistory.id, params.executionId),
        eq(aiExecutionHistory.userId, params.userId),
        eq(aiExecutionHistory.module, "solver"),
        eq(aiExecutionHistory.status, "running"),
      ))
      .returning({ id: aiExecutionHistory.id })
      .get();
    if (!transitioned) {
      throw new Error("Status eksekusi Solver tidak dapat diselesaikan");
    }
    return result;
  }));
}

function accessibleFilters(userId: number, workspaceId?: string, id?: string): SQL[] {
  const filters: SQL[] = [
    eq(solverAnalysisResults.userId, userId),
    eq(aiExecutionHistory.status, "succeeded"),
  ];
  if (workspaceId) filters.push(eq(solverAnalysisResults.workspaceId, workspaceId));
  if (id) filters.push(eq(solverAnalysisResults.id, id));
  filters.push(or(
    isNull(solverAnalysisResults.workspaceId),
    eq(projectWorkspaces.userId, userId),
    isNotNull(projectWorkspaceMembers.id),
  )!);
  return filters;
}

export async function listSolverAnalysisHistory(params: {
  userId: number;
  workspaceId?: string;
}): Promise<SolverAnalysisResult[]> {
  return db
    .select({ record: solverAnalysisResults })
    .from(solverAnalysisResults)
    .innerJoin(aiExecutionHistory, eq(aiExecutionHistory.id, solverAnalysisResults.executionId))
    .leftJoin(projectWorkspaces, eq(solverAnalysisResults.workspaceId, projectWorkspaces.id))
    .leftJoin(projectWorkspaceMembers, and(
      eq(projectWorkspaceMembers.workspaceId, solverAnalysisResults.workspaceId),
      eq(projectWorkspaceMembers.userId, params.userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ))
    .where(and(...accessibleFilters(params.userId, params.workspaceId)))
    .orderBy(desc(solverAnalysisResults.createdAt))
    .limit(50)
    .then((rows) => rows.map(({ record }) => record));
}

export async function getSolverAnalysisResult(params: {
  userId: number;
  id: string;
}): Promise<SolverAnalysisResult | null> {
  const [row] = await db
    .select({ record: solverAnalysisResults })
    .from(solverAnalysisResults)
    .innerJoin(aiExecutionHistory, eq(aiExecutionHistory.id, solverAnalysisResults.executionId))
    .leftJoin(projectWorkspaces, eq(solverAnalysisResults.workspaceId, projectWorkspaces.id))
    .leftJoin(projectWorkspaceMembers, and(
      eq(projectWorkspaceMembers.workspaceId, solverAnalysisResults.workspaceId),
      eq(projectWorkspaceMembers.userId, params.userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ))
    .where(and(...accessibleFilters(params.userId, undefined, params.id)))
    .limit(1);
  return row?.record ?? null;
}