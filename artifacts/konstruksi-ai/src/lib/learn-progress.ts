export interface LocalLearningProgress {
  pathId: string;
  moduleId: string;
  lessonId: string;
  completedAt: string;
}

const STORAGE_KEY = "konstruksi-ai:learn-progress:v1";

function isProgressRecord(value: unknown): value is LocalLearningProgress {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.pathId === "string" &&
    typeof record.moduleId === "string" &&
    typeof record.lessonId === "string" &&
    typeof record.completedAt === "string"
  );
}

export function readLocalLearningProgress(): {
  progress: LocalLearningProgress[];
  error: string | null;
} {
  if (typeof window === "undefined") return { progress: [], error: null };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { progress: [], error: null };

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return {
        progress: [],
        error: "Progress belajar belum dapat dibaca. Materi tetap dapat dipelajari.",
      };
    }

    return {
      progress: parsed.filter(isProgressRecord),
      error: null,
    };
  } catch {
    return {
      progress: [],
      error: "Progress belajar belum dapat dibaca. Materi tetap dapat dipelajari.",
    };
  }
}

export function markLocalLessonComplete(
  lesson: Omit<LocalLearningProgress, "completedAt">,
): { progress: LocalLearningProgress[]; error: string | null } {
  const current = readLocalLearningProgress();
  if (current.error) return current;

  const nextRecord: LocalLearningProgress = {
    ...lesson,
    completedAt: new Date().toISOString(),
  };
  const next = [
    ...current.progress.filter(
      (record) =>
        !(
          record.pathId === lesson.pathId &&
          record.moduleId === lesson.moduleId &&
          record.lessonId === lesson.lessonId
        ),
    ),
    nextRecord,
  ];

  if (typeof window === "undefined") return { progress: next, error: null };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { progress: next, error: null };
  } catch {
    return {
      progress: current.progress,
      error: "Progress belum tersimpan di perangkat ini. Materi tetap dapat dilanjutkan.",
    };
  }
}