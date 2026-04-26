import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

// GET /api/conversations — list all conversations for the current user
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const convs = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, session.userId))
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json({ conversations: convs });
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/conversations — create a new conversation
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, agentId } = body;

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

    return NextResponse.json({ id, title: title || "Percakapan Baru", agentId: agentId || "general" });
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/conversations — delete all conversations for the current user
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all conversation IDs for this user
    const convs = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.userId, session.userId));

    // Delete messages for each conversation
    for (const conv of convs) {
      await db.delete(messages).where(eq(messages.conversationId, conv.id));
    }

    // Delete all conversations
    await db.delete(conversations).where(eq(conversations.userId, session.userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/conversations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
