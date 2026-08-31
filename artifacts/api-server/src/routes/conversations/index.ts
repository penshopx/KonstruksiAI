import { Router, type Response } from "express";
import { db, conversations, messages, projectWorkspaceMembers, projectWorkspaces } from "../../db";
import { eq, desc, and, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getSessionFromRequest } from "../../lib/auth";
import { hasActiveWorkspaceAccess } from "../../lib/workspace-access";
import { isValidAgentId } from "../../lib/agent-roster";
import { userHasProAccess } from "../../lib/entitlements";

const router = Router();

router.use("/conversations", async (req, res, next) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!await userHasProAccess(session.userId)) {
    res.status(403).json({
      error: "Riwayat cloud tersedia untuk paket Pro.",
      code: "PRO_REQUIRED",
      feature: "cloud_history",
    });
    return;
  }
  next();
});

async function canAccessConversation(
  conversation: typeof conversations.$inferSelect,
  userId: number,
): Promise<boolean> {
  return !conversation.workspaceId || hasActiveWorkspaceAccess(conversation.workspaceId, userId);
}

function sendWorkspaceAccessRevoked(
  res: Response,
  workspaceId: string,
) {
  res.status(403).json({
    error: "Akses ruang proyek telah dicabut",
    code: "WORKSPACE_ACCESS_REVOKED",
    workspaceId,
  });
}

// GET /api/conversations
router.get("/conversations", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const convs = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, session.userId))
      .orderBy(desc(conversations.updatedAt));

    const visibleConversations = [];
    for (const conversation of convs) {
      if (await canAccessConversation(conversation, session.userId)) {
        visibleConversations.push(conversation);
      }
    }
    res.json({ conversations: visibleConversations });
  } catch (err) {
    req.log.error({ err }, "GET /conversations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/conversations
router.post("/conversations", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { title, agentId, workspaceId, clientConversationId } = req.body;
    const requestedId = typeof clientConversationId === "string" && clientConversationId.length <= 128
      ? clientConversationId
      : null;
    if (requestedId) {
      const [existing] = await db
        .select()
        .from(conversations)
        .where(and(eq(conversations.id, requestedId), eq(conversations.userId, session.userId)));
      if (existing) {
        if (!await canAccessConversation(existing, session.userId)) {
          sendWorkspaceAccessRevoked(res, existing.workspaceId!);
          return;
        }
        res.json({
          id: existing.id,
          title: existing.title,
          agentId: existing.agentId,
          workspaceId: existing.workspaceId,
        });
        return;
      }
    }
    let validatedWorkspaceId: string | null = null;
    if (workspaceId !== undefined && workspaceId !== null) {
      if (typeof workspaceId !== "string" || !workspaceId.trim()) {
        res.status(400).json({ error: "Konteks ruang proyek tidak valid" });
        return;
      }
      if (!await hasActiveWorkspaceAccess(workspaceId, session.userId)) {
        res.status(404).json({
          error: "Ruang proyek tidak ditemukan",
          code: "WORKSPACE_ACCESS_REVOKED",
          workspaceId,
        });
        return;
      }
      validatedWorkspaceId = workspaceId;
    }
    const id = requestedId ?? randomUUID();
    const now = new Date();

    await db.insert(conversations).values({
      id,
      userId: session.userId,
      workspaceId: validatedWorkspaceId,
      title: title || "Percakapan Baru",
      agentId: agentId || "general",
      createdAt: now,
      updatedAt: now,
    });

    res.json({ id, title: title || "Percakapan Baru", agentId: agentId || "general", workspaceId: validatedWorkspaceId });
  } catch (err) {
    req.log.error({ err }, "POST /conversations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/conversations
router.delete("/conversations", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const convs = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.userId, session.userId));

    for (const conv of convs) {
      await db.delete(messages).where(eq(messages.conversationId, conv.id));
    }
    await db.delete(conversations).where(eq(conversations.userId, session.userId));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /conversations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/conversations/:id
router.get("/conversations/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));

    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    if (!await canAccessConversation(conv, session.userId)) {
      sendWorkspaceAccessRevoked(res, conv.workspaceId!);
      return;
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, req.params.id))
      .orderBy(messages.createdAt);

    res.json({ conversation: conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "GET /conversations/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/conversations/:id
router.delete("/conversations/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));

    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    if (!await canAccessConversation(conv, session.userId)) {
      sendWorkspaceAccessRevoked(res, conv.workspaceId!);
      return;
    }

    await db.delete(messages).where(eq(messages.conversationId, req.params.id));
    await db.delete(conversations).where(eq(conversations.id, req.params.id));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /conversations/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/conversations/:id
router.patch("/conversations/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { title, label } = req.body;
    const now = new Date();

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));
    if (!conversation) { res.status(404).json({ error: "Not found" }); return; }
    if (!await canAccessConversation(conversation, session.userId)) {
      sendWorkspaceAccessRevoked(res, conversation.workspaceId!);
      return;
    }

    await db
      .update(conversations)
      .set({ ...(title && { title }), ...(label !== undefined && { label }), updatedAt: now })
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "PATCH /conversations/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/conversations/:id/messages
router.post("/conversations/:id/messages", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));

    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    if (!await canAccessConversation(conv, session.userId)) {
      sendWorkspaceAccessRevoked(res, conv.workspaceId!);
      return;
    }

    const {
      role,
      content,
      agentId,
      domainFit,
      recommendedAgentId,
      attachmentName,
      attachmentType,
      clientMessageId,
    } = req.body;
    if (!role || !content) { res.status(400).json({ error: "role and content are required" }); return; }

    const requestedId = typeof clientMessageId === "string" && clientMessageId.length <= 128
      ? clientMessageId
      : null;
    if (requestedId) {
      const [existing] = await db
        .select({ id: messages.id, conversationId: messages.conversationId })
        .from(messages)
        .where(eq(messages.id, requestedId));
      if (existing) {
        if (existing.conversationId !== req.params.id) {
          res.status(409).json({ error: "Message id belongs to another conversation" });
          return;
        }
        res.json({ id: existing.id });
        return;
      }
    }

    const msgId = requestedId ?? randomUUID();
    const now = new Date();

    await db.insert(messages).values({
      id: msgId,
      conversationId: req.params.id,
      role,
      content,
      agentId: role === "assistant" && typeof agentId === "string" ? agentId : null,
      domainFitLevel: role === "assistant" && ["high", "medium", "low"].includes(domainFit?.level)
        ? domainFit.level
        : null,
      domainFitReason: role === "assistant" && typeof domainFit?.reason === "string"
        ? domainFit.reason.slice(0, 500)
        : null,
      recommendedAgentId: role === "assistant" && isValidAgentId(recommendedAgentId)
        ? recommendedAgentId
        : null,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null,
      createdAt: now,
    });

    await db.update(conversations).set({ updatedAt: now }).where(eq(conversations.id, req.params.id));

    res.json({ id: msgId });
  } catch (err) {
    req.log.error({ err }, "POST /conversations/:id/messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/conversations/:id/messages
router.get("/conversations/:id/messages", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, req.params.id), eq(conversations.userId, session.userId)));

    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    if (!await canAccessConversation(conv, session.userId)) {
      sendWorkspaceAccessRevoked(res, conv.workspaceId!);
      return;
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, req.params.id))
      .orderBy(messages.createdAt);

    res.json({ messages: msgs });
  } catch (err) {
    req.log.error({ err }, "GET /conversations/:id/messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
