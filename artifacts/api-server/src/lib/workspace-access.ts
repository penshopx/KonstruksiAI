import { and, eq, isNull } from "drizzle-orm";
import { db, projectWorkspaceMembers, projectWorkspaces } from "../db";

export async function hasActiveWorkspaceAccess(workspaceId: string, userId: number): Promise<boolean> {
  const [ownedWorkspace] = await db
    .select({ id: projectWorkspaces.id })
    .from(projectWorkspaces)
    .where(and(eq(projectWorkspaces.id, workspaceId), eq(projectWorkspaces.userId, userId)));
  if (ownedWorkspace) return true;

  const [membership] = await db
    .select({ id: projectWorkspaceMembers.id })
    .from(projectWorkspaceMembers)
    .where(and(
      eq(projectWorkspaceMembers.workspaceId, workspaceId),
      eq(projectWorkspaceMembers.userId, userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ));
  return Boolean(membership);
}