export interface ProjectWorkspace {
  id: string;
  name: string;
  stageId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  accessRole?: "owner" | "viewer" | "editor";
  isOwner?: boolean;
}

export interface ProjectWorkspaceMember {
  id: string;
  userId: number;
  name: string;
  email: string;
  role: "viewer" | "editor";
  createdAt: string;
}

export interface ProjectWorkspaceInvitation {
  id: string;
  invitedEmail: string;
  role: "viewer" | "editor";
  expiresAt: string;
  createdAt: string;
  workspaceName?: string;
  inviteToken?: string;
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

export async function listWorkspaceMembers(id: string): Promise<{
  members: ProjectWorkspaceMember[];
  invitations: ProjectWorkspaceInvitation[];
}> {
  return request(`/api/project-workspaces/${encodeURIComponent(id)}/members`);
}

export async function createWorkspaceInvitation(
  id: string,
  payload: { email: string; role: "viewer" | "editor" },
): Promise<ProjectWorkspaceInvitation> {
  const data = await request<{ invitation: ProjectWorkspaceInvitation }>(
    `/api/project-workspaces/${encodeURIComponent(id)}/invitations`,
    { method: "POST", body: JSON.stringify(payload) },
  );
  return data.invitation;
}

export async function revokeWorkspaceMember(id: string, memberId: string): Promise<void> {
  await request(`/api/project-workspaces/${encodeURIComponent(id)}/members/${encodeURIComponent(memberId)}`, {
    method: "DELETE",
  });
}

export async function revokeWorkspaceInvitation(id: string, invitationId: string): Promise<void> {
  await request(`/api/project-workspaces/${encodeURIComponent(id)}/invitations/${encodeURIComponent(invitationId)}`, {
    method: "DELETE",
  });
}

export async function getWorkspaceInvitation(token: string): Promise<{
  invitedEmail: string;
  role: "viewer" | "editor";
  expiresAt: string;
  workspaceName: string;
}> {
  const data = await request<{ invitation: {
    invitedEmail: string;
    role: "viewer" | "editor";
    expiresAt: string;
    workspaceName: string;
  } }>("/api/project-workspace-invitations/inspect", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  return data.invitation;
}

export async function acceptWorkspaceInvitation(token: string): Promise<ProjectWorkspace> {
  const data = await request<{ workspace: ProjectWorkspace }>(
    "/api/project-workspace-invitations/accept",
    { method: "POST", body: JSON.stringify({ token }) },
  );
  return data.workspace;
}