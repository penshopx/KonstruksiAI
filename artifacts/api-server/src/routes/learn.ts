import { Router } from "express";
import { and, asc, eq } from "drizzle-orm";
import {
  CompleteLearnProgressBody,
  CompleteLearnProgressResponse,
  GetLearnProgressResponse,
  MergeLearnProgressBody,
  MergeLearnProgressResponse,
} from "@workspace/api-zod";
import { db, learningProgress } from "../db";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

function serializeProgress(record: typeof learningProgress.$inferSelect) {
  return {
    pathId: record.pathId,
    moduleId: record.moduleId,
    lessonId: record.lessonId,
    completedAt: record.completedAt,
  };
}

async function listUserProgress(userId: number) {
  return db
    .select()
    .from(learningProgress)
    .where(eq(learningProgress.userId, userId))
    .orderBy(asc(learningProgress.completedAt), asc(learningProgress.id));
}

router.get("/learn/progress", async (req, res): Promise<void> => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const progress = await listUserProgress(session.userId);
    res.json(GetLearnProgressResponse.parse({ progress: progress.map(serializeProgress) }));
  } catch (err) {
    req.log.error({ err }, "GET /learn/progress error");
    res.status(500).json({ error: "Progress belajar akun tidak dapat dimuat" });
  }
});

router.post("/learn/progress/sync", async (req, res): Promise<void> => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = MergeLearnProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Progress belajar tidak valid." });
    return;
  }

  const uniqueRecords = Array.from(
    new Map(
      parsed.data.progress.map((record) => [
        JSON.stringify([record.pathId, record.moduleId, record.lessonId]),
        record,
      ]),
    ).values(),
  );

  try {
    db.transaction((tx) => {
      for (const record of uniqueRecords) {
        tx.insert(learningProgress)
          .values({
            userId: session.userId,
            pathId: record.pathId,
            moduleId: record.moduleId,
            lessonId: record.lessonId,
          })
          .onConflictDoNothing({
            target: [
              learningProgress.userId,
              learningProgress.pathId,
              learningProgress.moduleId,
              learningProgress.lessonId,
            ],
          })
          .run();
      }
    });

    const progress = await listUserProgress(session.userId);
    res.json(MergeLearnProgressResponse.parse({ progress: progress.map(serializeProgress) }));
  } catch (err) {
    req.log.error({ err }, "POST /learn/progress/sync error");
    res.status(500).json({ error: "Progress belum berhasil dipindahkan ke akun" });
  }
});

router.post("/learn/progress/complete", async (req, res): Promise<void> => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CompleteLearnProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data pelajaran yang diselesaikan tidak valid" });
    return;
  }

  try {
    db.insert(learningProgress)
      .values({
        userId: session.userId,
        pathId: parsed.data.pathId,
        moduleId: parsed.data.moduleId,
        lessonId: parsed.data.lessonId,
      })
      .onConflictDoNothing({
        target: [
          learningProgress.userId,
          learningProgress.pathId,
          learningProgress.moduleId,
          learningProgress.lessonId,
        ],
      })
      .run();

    const [record] = await db
      .select()
      .from(learningProgress)
      .where(and(
        eq(learningProgress.userId, session.userId),
        eq(learningProgress.pathId, parsed.data.pathId),
        eq(learningProgress.moduleId, parsed.data.moduleId),
        eq(learningProgress.lessonId, parsed.data.lessonId),
      ))
      .limit(1);

    if (!record) {
      res.status(500).json({ error: "Progress belum berhasil disimpan" });
      return;
    }

    res.json(CompleteLearnProgressResponse.parse({ progress: serializeProgress(record) }));
  } catch (err) {
    req.log.error({ err }, "POST /learn/progress/complete error");
    res.status(500).json({ error: "Progress belum berhasil disimpan ke akun" });
  }
});

export default router;