import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

// POST /api/conversations/[id]/messages — add a message to a conversation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify ownership
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, session.userId)));

    if (!conv) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { role, content, attachmentName, attachmentType } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "role and content are required" }, { status: 400 });
    }

    const msgId = randomUUID();
    const now = new Date();

    await db.insert(messages).values({
      id: msgId,
      conversationId: id,
      role,
      content,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null,
      createdAt: now,
    });

    // Update conversation's updatedAt
    await db
      .update(conversations)
      .set({ updatedAt: now })
      .where(eq(conversations.id, id));

    return NextResponse.json({ id: msgId });
  } catch (error) {
    console.error("POST /api/conversations/[id]/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
