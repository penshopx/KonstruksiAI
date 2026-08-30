export type ExecutionModule = "solver" | "tender";
export type ExecutionStatus = "pending" | "running" | "succeeded" | "failed";

export interface ExecutionInputSummary {
  label: string;
  details?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ExecutionHistoryEntry {
  id: string;
  userId: number;
  workspaceId: string | null;
  module: ExecutionModule;
  status: ExecutionStatus;
  inputSummary: ExecutionInputSummary;
  resultRef: string | null;
  retryOfId: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export class ExecutionHistoryApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ExecutionHistoryApiError";
  }
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ExecutionHistoryApiError(
      typeof data?.error === "string" ? data.error : "Riwayat eksekusi tidak dapat dimuat",
      response.status,
    );
  }
  return data as T;
}

export async function listExecutionHistory(params: {
  workspaceId?: string | null;
  module?: ExecutionModule;
} = {}): Promise<ExecutionHistoryEntry[]> {
  const query = new URLSearchParams();
  if (params.workspaceId) query.set("workspaceId", params.workspaceId);
  if (params.module) query.set("module", params.module);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const data = await request<{ executions: ExecutionHistoryEntry[] }>(`/api/execution-history${suffix}`);
  return data.executions;
}

export async function getExecutionHistory(id: string): Promise<ExecutionHistoryEntry> {
  const data = await request<{ execution: ExecutionHistoryEntry }>(
    `/api/execution-history/${encodeURIComponent(id)}`,
  );
  return data.execution;
}