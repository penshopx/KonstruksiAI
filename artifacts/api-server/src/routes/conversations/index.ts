import { Router } from "express";
import { db, conversations, messages } from "../../db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getSessionFromRequest } from "../../lib/auth";

const router = Router();

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

    res.json({ conversations: convs });
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
    const { title, agentId } = req.body;
    const id = randomUUID();
    const now = new Date();

    await db.insert(conversations).values({
      id,
      userId: session.userId,
      title: title || "Percakapan Baru",
      agentId: agentId || "general",
      createdAt: now,
      updatedAt: now,
    });

    res.json({ id, title: title || "Percakapan Baru", agentId: agentId || "general" });
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

    const { role, content, attachmentName, attachmentType } = req.body;
    if (!role || !content) { res.status(400).json({ error: "role and content are required" }); return; }

    const msgId = randomUUID();
    const now = new Date();

    await db.insert(messages).values({
      id: msgId,
      conversationId: req.params.id,
      role,
      content,
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
