import { Router } from "express";
import { and, desc, eq, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, projectWorkspaces } from "../db";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

const VALID_STAGE_IDS = new Set(["tender", "planning", "execution", "monitoring", "handover"]);

function validateText(value: unknown, maxLength: number): { value: string | null; tooLong: boolean } {
  if (typeof value !== "string") return { value: null, tooLong: false };
  const normalized = value.trim();
  return { value: normalized, tooLong: normalized.length > maxLength };
}

function validateStageId(value: unknown): string | null {
  return typeof value === "string" && VALID_STAGE_IDS.has(value) ? value : null;
}

router.get("/project-workspaces", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const includeArchived = req.query.includeArchived === "true";
    const workspaces = await db
      .select()
      .from(projectWorkspaces)
      .where(
        includeArchived
          ? eq(projectWorkspaces.userId, session.userId)
          : and(eq(projectWorkspaces.userId, session.userId), isNull(projectWorkspaces.archivedAt)),
      )
      .orderBy(desc(projectWorkspaces.updatedAt));

    res.json({ workspaces });
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

  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!workspaceId) {
    res.status(400).json({ error: "Ruang proyek tidak valid" });
    return;
  }

  try {
    const [workspace] = await db
      .select()
      .from(projectWorkspaces)
      .where(and(eq(projectWorkspaces.id, workspaceId), eq(projectWorkspaces.userId, session.userId)));

    if (!workspace) {
      res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
      return;
    }

    res.json({ workspace });
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

    res.status(201).json({ workspace });
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
      .where(and(eq(projectWorkspaces.id, req.params.id), eq(projectWorkspaces.userId, session.userId)))
      .returning();

    if (!workspace) {
      res.status(404).json({ error: "Ruang proyek tidak ditemukan" });
      return;
    }

    res.json({ workspace });
  } catch (err) {
    req.log.error({ err }, "PATCH /project-workspaces/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;