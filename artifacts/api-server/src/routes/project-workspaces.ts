import { Router } from "express";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { createHash, randomBytes, randomUUID } from "crypto";
import {
  db,
  projectWorkspaceInvitations,
  projectWorkspaceMembers,
  projectWorkspaces,
  users,
} from "../db";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

const VALID_STAGE_IDS = new Set(["tender", "planning", "execution", "monitoring", "handover"]);
const VALID_MEMBER_ROLES = new Set(["viewer", "editor"]);
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function validateText(value: unknown, maxLength: number): { value: string | null; tooLong: boolean } {
  if (typeof value !== "string") return { value: null, tooLong: false };
  const normalized = value.trim();
  return { value: normalized, tooLong: normalized.length > maxLength };
}

function validateStageId(value: unknown): string | null {
  return typeof value === "string" && VALID_STAGE_IDS.has(value) ? value : null;
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function validateMemberRole(value: unknown): "viewer" | "editor" | null {
  return typeof value === "string" && VALID_MEMBER_ROLES.has(value)
    ? value as "viewer" | "editor"
    : null;
}

function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

type WorkspaceAccess = {
  workspace: typeof projectWorkspaces.$inferSelect;
  role: "owner" | "viewer" | "editor";
};

async function findWorkspaceAccess(workspaceId: string, userId: number): Promise<WorkspaceAccess | null> {
  const [ownedWorkspace] = await db
    .select()
    .from(projectWorkspaces)
    .where(and(eq(projectWorkspaces.id, workspaceId), eq(projectWorkspaces.userId, userId)));
  if (ownedWorkspace) return { workspace: ownedWorkspace, role: "owner" };

  const [membership] = await db
    .select({ workspace: projectWorkspaces, role: projectWorkspaceMembers.role })
    .from(projectWorkspaceMembers)
    .innerJoin(projectWorkspaces, eq(projectWorkspaceMembers.workspaceId, projectWorkspaces.id))
    .where(and(
      eq(projectWorkspaceMembers.workspaceId, workspaceId),
      eq(projectWorkspaceMembers.userId, userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ));

  if (!membership || !VALID_MEMBER_ROLES.has(membership.role)) return null;
  return { workspace: membership.workspace, role: membership.role as "viewer" | "editor" };
}

async function findOwnedWorkspace(workspaceId: string, userId: number) {
  const [workspace] = await db
    .select()
    .from(projectWorkspaces)
    .where(and(eq(projectWorkspaces.id, workspaceId), eq(projectWorkspaces.userId, userId)));
  return workspace ?? null;
}

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

router.get("/project-workspaces", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const includeArchived = req.query.includeArchived === "true";
    const ownedWorkspaces = await db
      .select()
      .from(projectWorkspaces)
      .where(
        includeArchived ? eq(projectWorkspaces.userId, session.userId) : and(
          eq(projectWorkspaces.userId, session.userId),
          isNull(projectWorkspaces.archivedAt),
        ),
      )
      .orderBy(desc(projectWorkspaces.updatedAt));

    const sharedWorkspaces = await db
      .select({ workspace: projectWorkspaces, accessRole: projectWorkspaceMembers.role })
      .from(projectWorkspaceMembers)
      .innerJoin(projectWorkspaces, eq(projectWorkspaceMembers.workspaceId, projectWorkspaces.id))
      .where(and(
        eq(projectWorkspaceMembers.userId, session.userId),
        isNull(projectWorkspaceMembers.revokedAt),
        ...(includeArchived ? [] : [isNull(projectWorkspaces.archivedAt)]),
      ))
      .orderBy(desc(projectWorkspaces.updatedAt));

    res.json({
      workspaces: [
        ...ownedWorkspaces.map((workspace) => ({ ...workspace, accessRole: "owner" as const, isOwner: true })),
        ...sharedWorkspaces
          .filter(({ accessRole }) => VALID_MEMBER_ROLES.has(accessRole))
          .map(({ workspace, accessRole }) => ({
            ...workspace,
            accessRole: accessRole as "viewer" | "editor",
            isOwner: false,
          })),
      ],
    });
  } catch (err) {
    req.log.error({ err }, "GET /project-workspaces error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/project-workspaces/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const workspaceId = getParam(req.params.id);
  if (!workspaceId) {
    res.status(400).json({ error: "Ruang proyek tidak valid" });
    return;
  }

  try {
    const access = await findWorkspaceAccess(workspaceId, session.userId);
    if (!access) {
      res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
      return;
    }

    res.json({
      workspace: {
        ...access.workspace,
        accessRole: access.role,
        isOwner: access.role === "owner",
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /project-workspaces/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/project-workspaces", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const nameResult = validateText(req.body?.name, 160);
  const notesResult = validateText(req.body?.notes, 2000);
  const stageId = validateStageId(req.body?.stageId);

  if (nameResult.tooLong) {
    res.status(400).json({ error: "Nama ruang proyek maksimal 160 karakter" });
    return;
  }
  if (!nameResult.value) {
    res.status(400).json({ error: "Nama ruang proyek harus diisi" });
    return;
  }
  if (notesResult.tooLong) {
    res.status(400).json({ error: "Catatan ruang proyek maksimal 2.000 karakter" });
    return;
  }
  if (notesResult.value === null) {
    res.status(400).json({ error: "Catatan ruang proyek tidak valid" });
    return;
  }
  if (!stageId) {
    res.status(400).json({ error: "Tahap ruang proyek tidak valid" });
    return;
  }

  try {
    const now = new Date();
    const [workspace] = await db.insert(projectWorkspaces).values({
      id: randomUUID(),
      userId: session.userId,
      name: nameResult.value,
      stageId,
      notes: notesResult.value,
      createdAt: now,
      updatedAt: now,
    }).returning();

    res.status(201).json({ workspace: { ...workspace, accessRole: "owner", isOwner: true } });
  } catch (err) {
    req.log.error({ err }, "POST /project-workspaces error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/project-workspaces/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const workspaceId = getParam(req.params.id);
  const access = await findWorkspaceAccess(workspaceId, session.userId);
  if (!access) {
    res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
    return;
  }
  if (req.body?.archived !== undefined && access.role !== "owner") {
    res.status(403).json({ error: "Hanya pemilik yang dapat mengarsipkan ruang proyek" });
    return;
  }
  if (access.role === "viewer" && ["name", "notes", "stageId"].some((field) => req.body?.[field] !== undefined)) {
    res.status(403).json({ error: "Akses Anda hanya dapat melihat ruang proyek" });
    return;
  }

  const updates: Partial<typeof projectWorkspaces.$inferInsert> = {};
  if (req.body?.name !== undefined) {
    const nameResult = validateText(req.body.name, 160);
    if (nameResult.tooLong) {
      res.status(400).json({ error: "Nama ruang proyek maksimal 160 karakter" });
      return;
    }
    if (!nameResult.value) {
      res.status(400).json({ error: "Nama ruang proyek harus diisi" });
      return;
    }
    updates.name = nameResult.value;
  }
  if (req.body?.notes !== undefined) {
    const notesResult = validateText(req.body.notes, 2000);
    if (notesResult.tooLong) {
      res.status(400).json({ error: "Catatan ruang proyek maksimal 2.000 karakter" });
      return;
    }
    if (notesResult.value === null) {
      res.status(400).json({ error: "Catatan ruang proyek tidak valid" });
      return;
    }
    updates.notes = notesResult.value;
  }
  if (req.body?.stageId !== undefined) {
    const stageId = validateStageId(req.body.stageId);
    if (!stageId) {
      res.status(400).json({ error: "Tahap ruang proyek tidak valid" });
      return;
    }
    updates.stageId = stageId;
  }
  if (req.body?.archived !== undefined) {
    if (typeof req.body.archived !== "boolean") {
      res.status(400).json({ error: "Status arsip tidak valid" });
      return;
    }
    updates.archivedAt = req.body.archived ? new Date() : null;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Tidak ada perubahan yang dikirim" });
    return;
  }

  try {
    const [workspace] = await db
      .update(projectWorkspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(projectWorkspaces.id, workspaceId), eq(projectWorkspaces.userId, access.workspace.userId)))
      .returning();

    if (!workspace) {
      res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
      return;
    }

    res.json({
      workspace: {
        ...workspace,
        accessRole: access.role,
        isOwner: access.role === "owner",
      },
    });
  } catch (err) {
    req.log.error({ err }, "PATCH /project-workspaces/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/project-workspaces/:id/members", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const workspaceId = getParam(req.params.id);
  try {
    const workspace = await findOwnedWorkspace(workspaceId, session.userId);
    if (!workspace) {
      res.status(403).json({ error: "Hanya pemilik yang dapat mengelola anggota" });
      return;
    }

    const members = await db
      .select({
        id: projectWorkspaceMembers.id,
        userId: users.id,
        name: users.name,
        email: users.email,
        role: projectWorkspaceMembers.role,
        createdAt: projectWorkspaceMembers.createdAt,
      })
      .from(projectWorkspaceMembers)
      .innerJoin(users, eq(projectWorkspaceMembers.userId, users.id))
      .where(and(eq(projectWorkspaceMembers.workspaceId, workspaceId), isNull(projectWorkspaceMembers.revokedAt)))
      .orderBy(projectWorkspaceMembers.createdAt);
    const invitations = await db
      .select({
        id: projectWorkspaceInvitations.id,
        invitedEmail: projectWorkspaceInvitations.invitedEmail,
        role: projectWorkspaceInvitations.role,
        expiresAt: projectWorkspaceInvitations.expiresAt,
        createdAt: projectWorkspaceInvitations.createdAt,
      })
      .from(projectWorkspaceInvitations)
      .where(and(
        eq(projectWorkspaceInvitations.workspaceId, workspaceId),
        isNull(projectWorkspaceInvitations.acceptedAt),
        isNull(projectWorkspaceInvitations.revokedAt),
      ))
      .orderBy(desc(projectWorkspaceInvitations.createdAt));

    res.json({ members, invitations });
  } catch (err) {
    req.log.error({ err }, "GET /project-workspaces/:id/members error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/project-workspaces/:id/invitations", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const workspaceId = getParam(req.params.id);
  const email = normalizeEmail(req.body?.email);
  const requestedRole = req.body?.role;
  const role = requestedRole === undefined ? "viewer" : validateMemberRole(requestedRole);
  if (!email) {
    res.status(400).json({ error: "Email anggota tidak valid" });
    return;
  }
  if (!role) {
    res.status(400).json({ error: "Peran anggota tidak valid" });
    return;
  }
  if (email === session.email.toLowerCase()) {
    res.status(400).json({ error: "Pemilik tidak perlu diundang sebagai anggota" });
    return;
  }

  try {
    const workspace = await findOwnedWorkspace(workspaceId, session.userId);
    if (!workspace) {
      res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
      return;
    }
    const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (existingUser) {
      const [existingMember] = await db
        .select()
        .from(projectWorkspaceMembers)
        .where(and(eq(projectWorkspaceMembers.workspaceId, workspaceId), eq(projectWorkspaceMembers.userId, existingUser.id)));
      if (existingMember && !existingMember.revokedAt) {
        res.status(409).json({ error: "Pengguna tersebut sudah menjadi anggota ruang proyek" });
        return;
      }
    }

    await db.update(projectWorkspaceInvitations)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(projectWorkspaceInvitations.workspaceId, workspaceId),
        eq(projectWorkspaceInvitations.invitedEmail, email),
        isNull(projectWorkspaceInvitations.acceptedAt),
        isNull(projectWorkspaceInvitations.revokedAt),
      ));
    const rawToken = randomBytes(32).toString("base64url");
    const invitation = {
      id: randomUUID(),
      workspaceId,
      invitedEmail: email,
      role,
      tokenHash: hashInvitationToken(rawToken),
      expiresAt: new Date(Date.now() + INVITATION_TTL_MS),
      createdAt: new Date(),
    };
    await db.insert(projectWorkspaceInvitations).values(invitation);

    res.status(201).json({
      invitation: {
        id: invitation.id,
        invitedEmail: invitation.invitedEmail,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        inviteToken: rawToken,
        workspaceName: workspace.name,
      },
    });
  } catch (err) {
    req.log.error({ err }, "POST /project-workspaces/:id/invitations error");
    res.status(500).json({ error: "Undangan gagal dibuat" });
  }
});

router.delete("/project-workspaces/:id/members/:memberId", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const workspaceId = getParam(req.params.id);
  const memberId = getParam(req.params.memberId);
  try {
    const workspace = await findOwnedWorkspace(workspaceId, session.userId);
    if (!workspace) {
      res.status(403).json({ error: "Hanya pemilik yang dapat mencabut akses" });
      return;
    }
    const [member] = await db
      .update(projectWorkspaceMembers)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(projectWorkspaceMembers.workspaceId, workspaceId),
        eq(projectWorkspaceMembers.id, memberId),
        isNull(projectWorkspaceMembers.revokedAt),
      ))
      .returning({ id: projectWorkspaceMembers.id });
    if (!member) {
      res.status(404).json({ error: "Anggota tidak ditemukan" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /project-workspaces/:id/members/:memberId error");
    res.status(500).json({ error: "Akses anggota gagal dicabut" });
  }
});

router.delete("/project-workspaces/:id/invitations/:invitationId", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const workspaceId = getParam(req.params.id);
  const invitationId = getParam(req.params.invitationId);
  try {
    const workspace = await findOwnedWorkspace(workspaceId, session.userId);
    if (!workspace) {
      res.status(403).json({ error: "Hanya pemilik yang dapat membatalkan undangan" });
      return;
    }
    const [invitation] = await db
      .update(projectWorkspaceInvitations)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(projectWorkspaceInvitations.id, invitationId),
        eq(projectWorkspaceInvitations.workspaceId, workspaceId),
        isNull(projectWorkspaceInvitations.revokedAt),
      ))
      .returning({ id: projectWorkspaceInvitations.id });
    if (!invitation) {
      res.status(404).json({ error: "Undangan tidak ditemukan" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /project-workspaces/:id/invitations/:invitationId error");
    res.status(500).json({ error: "Undangan gagal dibatalkan" });
  }
});

router.post("/project-workspace-invitations/inspect", async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  if (!token || token.length > 200) {
    res.status(400).json({ error: "Undangan tidak valid" });
    return;
  }
  try {
    const [invitation] = await db
      .select({
        id: projectWorkspaceInvitations.id,
        invitedEmail: projectWorkspaceInvitations.invitedEmail,
        role: projectWorkspaceInvitations.role,
        expiresAt: projectWorkspaceInvitations.expiresAt,
        acceptedAt: projectWorkspaceInvitations.acceptedAt,
        revokedAt: projectWorkspaceInvitations.revokedAt,
        workspaceName: projectWorkspaces.name,
      })
      .from(projectWorkspaceInvitations)
      .innerJoin(projectWorkspaces, eq(projectWorkspaceInvitations.workspaceId, projectWorkspaces.id))
      .where(eq(projectWorkspaceInvitations.tokenHash, hashInvitationToken(token)));
    if (!invitation || invitation.revokedAt || invitation.acceptedAt || invitation.expiresAt.getTime() <= Date.now()) {
      res.status(410).json({ error: "Undangan sudah tidak berlaku" });
      return;
    }
    res.json({
      invitation: {
        invitedEmail: invitation.invitedEmail,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        workspaceName: invitation.workspaceName,
      },
    });
  } catch (err) {
    req.log.error({ err }, "POST /project-workspace-invitations/inspect error");
    res.status(500).json({ error: "Undangan tidak dapat dibaca" });
  }
});

router.post("/project-workspace-invitations/accept", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Masuk terlebih dahulu untuk menerima undangan" });
    return;
  }
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  if (!token || token.length > 200) {
    res.status(400).json({ error: "Undangan tidak valid" });
    return;
  }
  try {
    const now = new Date();
    const accepted = db.transaction((tx) => {
      const invitation = tx
        .select()
        .from(projectWorkspaceInvitations)
        .where(eq(projectWorkspaceInvitations.tokenHash, hashInvitationToken(token)))
        .get();
      if (!invitation || session.email.toLowerCase() !== invitation.invitedEmail) {
        return { kind: "invalid" as const };
      }
      const claimedInvitation = tx
        .update(projectWorkspaceInvitations)
        .set({ acceptedAt: now })
        .where(and(
          eq(projectWorkspaceInvitations.id, invitation.id),
          isNull(projectWorkspaceInvitations.revokedAt),
          isNull(projectWorkspaceInvitations.acceptedAt),
          gt(projectWorkspaceInvitations.expiresAt, now),
        ))
        .returning()
        .get();
      if (!claimedInvitation) return { kind: "expired" as const };

      const existingMember = tx
        .select()
        .from(projectWorkspaceMembers)
        .where(and(
          eq(projectWorkspaceMembers.workspaceId, invitation.workspaceId),
          eq(projectWorkspaceMembers.userId, session.userId),
        ))
        .get();
      if (existingMember) {
        tx.update(projectWorkspaceMembers)
          .set({ role: invitation.role, revokedAt: null })
          .where(eq(projectWorkspaceMembers.id, existingMember.id))
          .run();
      } else {
        tx.insert(projectWorkspaceMembers).values({
          id: randomUUID(),
          workspaceId: invitation.workspaceId,
          userId: session.userId,
          role: invitation.role,
          createdAt: now,
        }).run();
      }
      return {
        kind: "accepted" as const,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
      };
    });
    if (accepted.kind === "invalid") {
      res.status(403).json({ error: "Undangan tidak tersedia untuk akun ini" });
      return;
    }
    if (accepted.kind === "expired") {
      res.status(410).json({ error: "Undangan sudah tidak berlaku" });
      return;
    }

    const [workspace] = await db
      .select()
      .from(projectWorkspaces)
      .where(eq(projectWorkspaces.id, accepted.workspaceId));
    res.json({
      workspace: workspace
        ? { ...workspace, accessRole: accepted.role, isOwner: false }
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "POST /project-workspace-invitations/accept error");
    res.status(500).json({ error: "Undangan gagal diterima" });
  }
});

export default router;