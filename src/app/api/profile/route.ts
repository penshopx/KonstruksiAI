import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, conversations, messages } from "@/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

// GET /api/profile — returns user info + stats
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user info
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count conversations
    const [convCount] = await db
      .select({ count: count() })
      .from(conversations)
      .where(eq(conversations.userId, session.userId));

    // Count messages (only user messages)
    const [msgCount] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .where(eq(conversations.userId, session.userId));

    // Most active agent (agent with most conversations)
    const agentStats = await db
      .select({
        agentId: conversations.agentId,
        count: count(),
      })
      .from(conversations)
      .where(eq(conversations.userId, session.userId))
      .groupBy(conversations.agentId)
      .orderBy(desc(sql`count(*)`))
      .limit(1);

    // Recent conversations (last 5)
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

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        conversationCount: convCount?.count ?? 0,
        messageCount: msgCount?.count ?? 0,
        mostActiveAgent: agentStats[0]?.agentId ?? null,
      },
      recentConversations: recentConvs,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/profile — update name and/or password
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    // Validate at least one field
    if (!name && !newPassword) {
      return NextResponse.json({ error: "Tidak ada perubahan yang dikirim" }, { status: 400 });
    }

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Password saat ini diperlukan" }, { status: 400 });
      }

      const [user] = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Password saat ini tidak sesuai" }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
      }
    }

    // Build update object
    const updateData: Record<string, string> = {};
    if (name && name.trim()) {
      updateData.name = name.trim();
    }
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, session.userId));

    return NextResponse.json({ success: true, name: updateData.name ?? session.name });
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
