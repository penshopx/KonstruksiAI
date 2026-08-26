import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, examSets, examQuestions, examAttempts } from "../db";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function shapeExamSet(row: typeof examSets.$inferSelect, questionCount: number) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    level: row.level,
    skkniCode: row.skkniCode ?? undefined,
    duration: row.duration,
    passingScore: row.passingScore,
    icon: row.icon,
    color: row.color,
    questionCount,
  };
}

// Question shape sent BEFORE grading: never includes correctAnswer or
// explanation, so the exam bank cannot be read out of the client bundle or
// network responses ahead of time the way the old hardcoded frontend data was.
function shapeQuestionForAttempt(row: typeof examQuestions.$inferSelect) {
  return {
    id: row.id,
    question: row.question,
    options: parseJsonArray<string>(row.options, []),
    topic: row.topic,
    difficulty: row.difficulty,
  };
}

function shapeAttemptSummary(row: typeof examAttempts.$inferSelect) {
  return {
    id: row.id,
    examId: row.examId,
    status: row.status,
    score: row.score ?? undefined,
    correctCount: row.correctCount ?? undefined,
    totalQuestions: row.totalQuestions,
    passed: row.passed ?? undefined,
    startedAt: row.startedAt.toISOString(),
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : undefined,
    timeSpentSeconds: row.timeSpentSeconds ?? undefined,
  };
}

router.get("/simulasi/exams", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const sets = await db.select().from(examSets).orderBy(examSets.orderIndex);
    const questions = await db.select().from(examQuestions);
    const questionCountByExam = new Map<string, number>();
    for (const q of questions) {
      questionCountByExam.set(q.examId, (questionCountByExam.get(q.examId) ?? 0) + 1);
    }

    const attempts = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.userId, session.userId), eq(examAttempts.status, "completed")));

    const lastAttemptByExam = new Map<string, typeof examAttempts.$inferSelect>();
    for (const attempt of attempts) {
      const current = lastAttemptByExam.get(attempt.examId);
      if (!current || (attempt.submittedAt?.getTime() ?? 0) > (current.submittedAt?.getTime() ?? 0)) {
        lastAttemptByExam.set(attempt.examId, attempt);
      }
    }

    res.json({
      exams: sets.map((row) => ({
        ...shapeExamSet(row, questionCountByExam.get(row.id) ?? 0),
        lastAttempt: (() => {
          const attempt = lastAttemptByExam.get(row.id);
          return attempt ? shapeAttemptSummary(attempt) : undefined;
        })(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "GET /simulasi/exams error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/simulasi/exams/:examId/attempts", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [examSet] = await db.select().from(examSets).where(eq(examSets.id, req.params.examId));
    if (!examSet) {
      res.status(404).json({ error: "Paket ujian tidak ditemukan" });
      return;
    }

    const questions = await db
      .select()
      .from(examQuestions)
      .where(eq(examQuestions.examId, examSet.id))
      .orderBy(examQuestions.orderIndex);

    if (questions.length === 0) {
      res.status(409).json({ error: "Paket ujian ini belum memiliki soal" });
      return;
    }

    const now = new Date();
    const [attempt] = await db
      .insert(examAttempts)
      .values({
        id: randomUUID(),
        userId: session.userId,
        examId: examSet.id,
        status: "in_progress",
        answers: JSON.stringify(new Array(questions.length).fill(-1)),
        totalQuestions: questions.length,
        startedAt: now,
      })
      .returning();

    res.status(201).json({
      attempt: shapeAttemptSummary(attempt),
      exam: shapeExamSet(examSet, questions.length),
      questions: questions.map(shapeQuestionForAttempt),
    });
  } catch (err) {
    req.log.error({ err }, "POST /simulasi/exams/:examId/attempts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/simulasi/attempts/:attemptId/answers", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const questionIndex = req.body?.questionIndex;
  const answerIndex = req.body?.answerIndex;
  if (typeof questionIndex !== "number" || !Number.isInteger(questionIndex) || questionIndex < 0) {
    res.status(400).json({ error: "questionIndex tidak valid" });
    return;
  }
  if (typeof answerIndex !== "number" || !Number.isInteger(answerIndex) || answerIndex < 0) {
    res.status(400).json({ error: "answerIndex tidak valid" });
    return;
  }

  try {
    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.id, req.params.attemptId), eq(examAttempts.userId, session.userId)));
    if (!attempt) {
      res.status(404).json({ error: "Percobaan ujian tidak ditemukan" });
      return;
    }
    if (attempt.status !== "in_progress") {
      res.status(409).json({ error: "Percobaan ujian ini sudah selesai" });
      return;
    }
    if (questionIndex >= attempt.totalQuestions) {
      res.status(400).json({ error: "questionIndex di luar jangkauan soal" });
      return;
    }

    const questions = await db
      .select()
      .from(examQuestions)
      .where(eq(examQuestions.examId, attempt.examId))
      .orderBy(examQuestions.orderIndex);
    const question = questions[questionIndex];
    if (!question) {
      res.status(404).json({ error: "Soal tidak ditemukan" });
      return;
    }
    const options = parseJsonArray<string>(question.options, []);
    if (answerIndex >= options.length) {
      res.status(400).json({ error: "answerIndex di luar jangkauan pilihan" });
      return;
    }

    const answers = parseJsonArray<number>(attempt.answers, new Array(attempt.totalQuestions).fill(-1));
    // A question's answer is locked in on first submission. Without this,
    // a client could repeatedly call this endpoint with a different
    // answerIndex for the same question to read off every explanation
    // until it finds the correct one, then lock in that answer before
    // submitting -- defeating the point of withholding the answer key.
    if (answers[questionIndex] !== -1) {
      res.status(409).json({ error: "Soal ini sudah dijawab dan tidak dapat diubah" });
      return;
    }
    answers[questionIndex] = answerIndex;

    await db
      .update(examAttempts)
      .set({ answers: JSON.stringify(answers) })
      .where(eq(examAttempts.id, attempt.id));

    res.json({
      correct: answerIndex === question.correctAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      reference: question.reference ?? undefined,
    });
  } catch (err) {
    req.log.error({ err }, "POST /simulasi/attempts/:attemptId/answers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/simulasi/attempts/:attemptId/submit", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.id, req.params.attemptId), eq(examAttempts.userId, session.userId)));
    if (!attempt) {
      res.status(404).json({ error: "Percobaan ujian tidak ditemukan" });
      return;
    }

    if (attempt.status === "completed") {
      res.json({ attempt: shapeAttemptSummary(attempt) });
      return;
    }

    const [examSet] = await db.select().from(examSets).where(eq(examSets.id, attempt.examId));
    const questions = await db
      .select()
      .from(examQuestions)
      .where(eq(examQuestions.examId, attempt.examId))
      .orderBy(examQuestions.orderIndex);
    const answers = parseJsonArray<number>(attempt.answers, new Array(attempt.totalQuestions).fill(-1));

    let correctCount = 0;
    questions.forEach((question, i) => {
      if (answers[i] === question.correctAnswer) correctCount++;
    });
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = examSet ? score >= examSet.passingScore : false;
    const now = new Date();
    const timeSpentSeconds = Math.max(0, Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000));

    const [updated] = await db
      .update(examAttempts)
      .set({
        status: "completed",
        score,
        correctCount,
        passed,
        submittedAt: now,
        timeSpentSeconds,
      })
      .where(eq(examAttempts.id, attempt.id))
      .returning();

    res.json({ attempt: shapeAttemptSummary(updated) });
  } catch (err) {
    req.log.error({ err }, "POST /simulasi/attempts/:attemptId/submit error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/simulasi/attempts/:attemptId", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.id, req.params.attemptId), eq(examAttempts.userId, session.userId)));
    if (!attempt) {
      res.status(404).json({ error: "Percobaan ujian tidak ditemukan" });
      return;
    }

    const questions = await db
      .select()
      .from(examQuestions)
      .where(eq(examQuestions.examId, attempt.examId))
      .orderBy(examQuestions.orderIndex);
    const answers = parseJsonArray<number>(attempt.answers, new Array(attempt.totalQuestions).fill(-1));

    // Only completed attempts reveal every correct answer/explanation; an
    // in_progress attempt only reveals what the per-question answer endpoint
    // already exposed for questions the user has answered.
    const revealAll = attempt.status === "completed";
    res.json({
      attempt: shapeAttemptSummary(attempt),
      answers,
      questions: questions.map((q, i) => ({
        ...shapeQuestionForAttempt(q),
        ...(revealAll || answers[i] !== -1
          ? { correctAnswer: q.correctAnswer, explanation: q.explanation, reference: q.reference ?? undefined }
          : {}),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "GET /simulasi/attempts/:attemptId error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/simulasi/attempts", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const rows = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.userId, session.userId), eq(examAttempts.status, "completed")));
    res.json({
      attempts: rows
        .map(shapeAttemptSummary)
        .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? "")),
    });
  } catch (err) {
    req.log.error({ err }, "GET /simulasi/attempts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
