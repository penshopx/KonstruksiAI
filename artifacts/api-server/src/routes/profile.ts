import { Router } from "express";
import { db, users, conversations, messages } from "../db";
import { eq, count, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

router.get("/profile", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const [convCount] = await db
      .select({ count: count() })
      .from(conversations)
      .where(eq(conversations.userId, session.userId));

    const [msgCount] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .where(eq(conversations.userId, session.userId));

    const agentStats = await db
      .select({ agentId: conversations.agentId, count: count() })
      .from(conversations)
      .where(eq(conversations.userId, session.userId))
      .groupBy(conversations.agentId)
      .orderBy(desc(sql`count(*)`))
      .limit(1);

    const recentConvs = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        agentId: conversations.agentId,
        label: conversations.label,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, session.userId))
      .orderBy(desc(conversations.updatedAt))
      .limit(5);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      stats: {
        conversationCount: convCount?.count ?? 0,
        messageCount: msgCount?.count ?? 0,
        mostActiveAgent: agentStats[0]?.agentId ?? null,
      },
      recentConversations: recentConvs,
    });
  } catch (err) {
    req.log.error({ err }, "GET /profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/profile", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { name, currentPassword, newPassword } = req.body;

    if (!name && !newPassword) {
      res.status(400).json({ error: "Tidak ada perubahan yang dikirim" });
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: "Password saat ini diperlukan" });
        return;
      }

      const [user] = await db.select({ password: users.password }).from(users).where(eq(users.id, session.userId)).limit(1);
      if (!user) { res.status(404).json({ error: "User not found" }); return; }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) { res.status(400).json({ error: "Password saat ini tidak sesuai" }); return; }

      if (newPassword.length < 6) { res.status(400).json({ error: "Password baru minimal 6 karakter" }); return; }
    }

    const updateData: Record<string, string> = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

    await db.update(users).set(updateData).where(eq(users.id, session.userId));

    res.json({ success: true, name: updateData.name ?? session.name });
  } catch (err) {
    req.log.error({ err }, "PATCH /profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
