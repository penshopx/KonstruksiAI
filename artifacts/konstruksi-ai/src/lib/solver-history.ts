export interface SolverAnalysisResult {
  id: string;
  executionId: string;
  workspaceId: string | null;
  problem: string;
  domain: string;
  context: string;
  approach: string;
  analysis: string;
  solution: string;
  regulations: string[];
  nextSteps: string[];
  outputFormat: string;
  createdAt: string;
  updatedAt: string;
}

export type SolverAnalysisHistorySummary = Pick<
  SolverAnalysisResult,
  "id" | "executionId" | "workspaceId" | "problem" | "domain" | "outputFormat" | "createdAt" | "updatedAt"
>;

export class SolverHistoryApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "SolverHistoryApiError";
  }
}

async function request<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input, { credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new SolverHistoryApiError(
      typeof data?.error === "string" ? data.error : "Riwayat hasil Solver tidak dapat dimuat.",
      response.status,
    );
  }
  return data as T;
}

export async function listSolverAnalysisHistory(params: {
  workspaceId?: string | null;
} = {}): Promise<SolverAnalysisHistorySummary[]> {
  const query = new URLSearchParams();
  if (params.workspaceId) query.set("workspaceId", params.workspaceId);
  const suffix = query.toString() ? `?${query}` : "";
  const data = await request<{ results: SolverAnalysisHistorySummary[] }>(`/api/solver/history${suffix}`);
  return data.results;
}

export async function getSolverAnalysisResult(id: string): Promise<SolverAnalysisResult> {
  const data = await request<{ result: SolverAnalysisResult }>(
    `/api/solver/history/${encodeURIComponent(id)}`,
  );
  return data.result;
}