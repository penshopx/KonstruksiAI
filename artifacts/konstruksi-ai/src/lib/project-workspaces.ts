export interface ProjectWorkspace {
  id: string;
  name: string;
  stageId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface ProjectWorkspacePayload {
  name: string;
  stageId: string;
  notes: string;
}

export class ProjectWorkspaceApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ProjectWorkspaceApiError";
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
    throw new ProjectWorkspaceApiError(
      typeof data?.error === "string" ? data.error : "Gagal memproses ruang proyek",
      response.status,
    );
  }

  return data as T;
}

export async function listProjectWorkspaces(includeArchived = false): Promise<ProjectWorkspace[]> {
  const suffix = includeArchived ? "?includeArchived=true" : "";
  const data = await request<{ workspaces: ProjectWorkspace[] }>(`/api/project-workspaces${suffix}`);
  return data.workspaces;
}

export async function getProjectWorkspace(id: string): Promise<ProjectWorkspace> {
  const data = await request<{ workspace: ProjectWorkspace }>(`/api/project-workspaces/${encodeURIComponent(id)}`);
  return data.workspace;
}

export async function createProjectWorkspace(payload: ProjectWorkspacePayload): Promise<ProjectWorkspace> {
  const data = await request<{ workspace: ProjectWorkspace }>("/api/project-workspaces", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.workspace;
}

export async function updateProjectWorkspace(
  id: string,
  payload: Partial<ProjectWorkspacePayload> & { archived?: boolean },
): Promise<ProjectWorkspace> {
  const data = await request<{ workspace: ProjectWorkspace }>(`/api/project-workspaces/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.workspace;
}