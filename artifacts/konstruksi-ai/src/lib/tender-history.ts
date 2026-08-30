export class TenderHistoryApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "TenderHistoryApiError";
  }
}

export interface TenderAnalysisHistorySummary {
  id: string;
  executionId: string;
  workspaceId: string | null;
  projectName: string;
  tenderType: string;
  overallCompleteness: number;
  complianceScore: number;
  riskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenderAnalysisResult {
  id: string;
  executionId: string;
  workspaceId: string | null;
  projectName: string;
  tenderType: string;
  projectDetails: string;
  documents: {
    documentType: string;
    required: boolean;
    present: boolean;
    notes: string;
  }[];
  checklistState: Record<string, { checked: boolean; notes: string }>;
  completenessChecks: {
    documentType: string;
    required: boolean;
    present: boolean;
    completenessScore: number;
    missingElements: string[];
    notes: string;
  }[];
  overallCompleteness: number;
  risks: {
    id: string;
    category: "compliance" | "technical" | "financial" | "schedule" | "contractual";
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    likelihood: "low" | "medium" | "high";
    mitigation: string[];
    impact: string;
  }[];
  recommendations: string[];
  complianceScore: number;
  summary: {
    administrativeRequirements: string;
    technicalRequirements: string;
    financialRequirements: string;
    keyRisks: string;
    nextSteps: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function listTenderAnalysisHistory(options?: { workspaceId?: string | null }): Promise<TenderAnalysisHistorySummary[]> {
  const url = new URL("/api/tender-intelligence/history", window.location.origin);
  if (options?.workspaceId) {
    url.searchParams.set("workspaceId", options.workspaceId);
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new TenderHistoryApiError(
      typeof body?.error === "string" ? body.error : `Gagal mengambil riwayat tender: ${response.statusText}`,
      response.status,
    );
  }

  const body = await response.json() as { results?: TenderAnalysisHistorySummary[] };
  return body.results ?? [];
}

export async function getTenderAnalysisResult(id: string): Promise<TenderAnalysisResult> {
  const response = await fetch(`/api/tender-intelligence/history/${id}`, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new TenderHistoryApiError(
      typeof body?.error === "string" ? body.error : `Gagal mengambil hasil tender: ${response.statusText}`,
      response.status,
    );
  }

  const body = await response.json() as { result?: TenderAnalysisResult };
  if (!body.result) {
    throw new TenderHistoryApiError("Hasil Tender Intelligence tidak valid.", response.status);
  }
  return body.result;
}
