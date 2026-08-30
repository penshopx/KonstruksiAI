import { and, desc, eq, isNotNull, isNull, or, type SQL } from "drizzle-orm";
import {
  aiExecutionHistory,
  db,
  projectWorkspaceMembers,
  projectWorkspaces,
  tenderAnalysisResults,
  type TenderAnalysisResult as TenderAnalysisResultRow,
} from "../db";

export interface TenderDocument {
  documentType: string;
  required: boolean;
  present: boolean;
  notes: string;
}

export interface TenderChecklistState {
  [itemId: string]: { checked: boolean; notes: string };
}

export interface TenderCompletenessCheck extends TenderDocument {
  completenessScore: number;
  missingElements: string[];
}

export interface TenderRisk {
  id: string;
  category: string;
  description: string;
  severity: string;
  likelihood: string;
  mitigation: string[];
  impact: string;
}

export interface TenderAnalysisSummary {
  administrativeRequirements: string;
  technicalRequirements: string;
  financialRequirements: string;
  keyRisks: string;
  nextSteps: string;
}

export interface TenderAnalysisPayload {
  projectName: string;
  tenderType: string;
  projectDetails: string;
  documents: TenderDocument[];
  checklistState: TenderChecklistState;
  completenessChecks: TenderCompletenessCheck[];
  overallCompleteness: number;
  risks: TenderRisk[];
  recommendations: string[];
  complianceScore: number;
  summary: TenderAnalysisSummary;
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseArray<T>(value: string): T[] {
  const parsed = parseJson<unknown>(value, []);
  return Array.isArray(parsed) ? parsed as T[] : [];
}

function parseChecklistState(value: string): TenderChecklistState {
  const parsed = parseJson<unknown>(value, {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const state: TenderChecklistState = {};
  for (const [itemId, item] of Object.entries(parsed as Record<string, unknown>)) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    if (typeof candidate.checked === "boolean" && typeof candidate.notes === "string") {
      state[itemId] = { checked: candidate.checked, notes: candidate.notes };
    }
  }
  return state;
}

function parseSummary(value: string): TenderAnalysisSummary {
  const parsed = parseJson<unknown>(value, {});
  const candidate = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
  return {
    administrativeRequirements: typeof candidate.administrativeRequirements === "string" ? candidate.administrativeRequirements : "",
    technicalRequirements: typeof candidate.technicalRequirements === "string" ? candidate.technicalRequirements : "",
    financialRequirements: typeof candidate.financialRequirements === "string" ? candidate.financialRequirements : "",
    keyRisks: typeof candidate.keyRisks === "string" ? candidate.keyRisks : "",
    nextSteps: typeof candidate.nextSteps === "string" ? candidate.nextSteps : "",
  };
}

export function normalizeChecklistState(raw: unknown): TenderChecklistState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const normalized: TenderChecklistState = {};
  for (const [itemId, item] of Object.entries(raw as Record<string, unknown>).slice(0, 100)) {
    if (!item || typeof item !== "object" || itemId.length > 200) continue;
    const candidate = item as Record<string, unknown>;
    normalized[itemId] = {
      checked: candidate.checked === true,
      notes: typeof candidate.notes === "string" ? candidate.notes.trim().slice(0, 2_000) : "",
    };
  }
  return normalized;
}

export function toTenderAnalysisResult(record: TenderAnalysisResultRow) {
  return {
    id: record.id,
    executionId: record.executionId,
    workspaceId: record.workspaceId,
    projectName: record.projectName,
    tenderType: record.tenderType,
    projectDetails: record.projectDetails,
    documents: parseArray<TenderDocument>(record.documents),
    checklistState: parseChecklistState(record.checklistState),
    completenessChecks: parseArray<TenderCompletenessCheck>(record.completenessChecks),
    overallCompleteness: record.overallCompleteness,
    risks: parseArray<TenderRisk>(record.risks),
    recommendations: parseArray<string>(record.recommendations).filter((item) => typeof item === "string"),
    complianceScore: record.complianceScore,
    summary: parseSummary(record.summary),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toTenderAnalysisSummary(record: TenderAnalysisResultRow) {
  return {
    id: record.id,
    executionId: record.executionId,
    workspaceId: record.workspaceId,
    projectName: record.projectName,
    tenderType: record.tenderType,
    overallCompleteness: record.overallCompleteness,
    complianceScore: record.complianceScore,
    riskCount: parseArray<TenderRisk>(record.risks).length,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function persistSuccessfulTenderAnalysis(params: {
  executionId: string;
  userId: number;
  workspaceId: string | null;
  payload: TenderAnalysisPayload;
}): Promise<TenderAnalysisResultRow> {
  const now = new Date();
  return Promise.resolve(db.transaction((tx) => {
    const result = tx
      .insert(tenderAnalysisResults)
      .values({
        id: params.executionId,
        executionId: params.executionId,
        userId: params.userId,
        workspaceId: params.workspaceId,
        projectName: params.payload.projectName,
        tenderType: params.payload.tenderType,
        projectDetails: params.payload.projectDetails,
        documents: JSON.stringify(params.payload.documents),
        checklistState: JSON.stringify(params.payload.checklistState),
        completenessChecks: JSON.stringify(params.payload.completenessChecks),
        overallCompleteness: params.payload.overallCompleteness,
        risks: JSON.stringify(params.payload.risks),
        recommendations: JSON.stringify(params.payload.recommendations),
        complianceScore: params.payload.complianceScore,
        summary: JSON.stringify(params.payload.summary),
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();
    if (!result) throw new Error("Hasil analisis Tender tidak dapat disimpan");

    const transitioned = tx
      .update(aiExecutionHistory)
      .set({
        status: "succeeded",
        resultRef: `tender:${result.id}`,
        errorMessage: null,
        completedAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(aiExecutionHistory.id, params.executionId),
        eq(aiExecutionHistory.userId, params.userId),
        eq(aiExecutionHistory.module, "tender"),
        eq(aiExecutionHistory.status, "running"),
      ))
      .returning({ id: aiExecutionHistory.id })
      .get();
    if (!transitioned) throw new Error("Status eksekusi Tender tidak dapat diselesaikan");
    return result;
  }));
}

function accessibleFilters(userId: number, workspaceId?: string, id?: string): SQL[] {
  const filters: SQL[] = [
    eq(tenderAnalysisResults.userId, userId),
    eq(aiExecutionHistory.status, "succeeded"),
  ];
  if (workspaceId) filters.push(eq(tenderAnalysisResults.workspaceId, workspaceId));
  if (id) filters.push(eq(tenderAnalysisResults.id, id));
  filters.push(or(
    isNull(tenderAnalysisResults.workspaceId),
    eq(projectWorkspaces.userId, userId),
    isNotNull(projectWorkspaceMembers.id),
  )!);
  return filters;
}

export async function listTenderAnalysisHistory(params: {
  userId: number;
  workspaceId?: string;
}): Promise<TenderAnalysisResultRow[]> {
  return db
    .select({ record: tenderAnalysisResults })
    .from(tenderAnalysisResults)
    .innerJoin(aiExecutionHistory, eq(aiExecutionHistory.id, tenderAnalysisResults.executionId))
    .leftJoin(projectWorkspaces, eq(tenderAnalysisResults.workspaceId, projectWorkspaces.id))
    .leftJoin(projectWorkspaceMembers, and(
      eq(projectWorkspaceMembers.workspaceId, tenderAnalysisResults.workspaceId),
      eq(projectWorkspaceMembers.userId, params.userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ))
    .where(and(...accessibleFilters(params.userId, params.workspaceId)))
    .orderBy(desc(tenderAnalysisResults.createdAt))
    .limit(50)
    .then((rows) => rows.map(({ record }) => record));
}

export async function getTenderAnalysisResult(params: {
  userId: number;
  id: string;
}): Promise<TenderAnalysisResultRow | null> {
  const [row] = await db
    .select({ record: tenderAnalysisResults })
    .from(tenderAnalysisResults)
    .innerJoin(aiExecutionHistory, eq(aiExecutionHistory.id, tenderAnalysisResults.executionId))
    .leftJoin(projectWorkspaces, eq(tenderAnalysisResults.workspaceId, projectWorkspaces.id))
    .leftJoin(projectWorkspaceMembers, and(
      eq(projectWorkspaceMembers.workspaceId, tenderAnalysisResults.workspaceId),
      eq(projectWorkspaceMembers.userId, params.userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ))
    .where(and(...accessibleFilters(params.userId, undefined, params.id)))
    .limit(1);
  return row?.record ?? null;
}