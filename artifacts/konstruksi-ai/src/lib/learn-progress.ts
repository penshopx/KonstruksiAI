export interface LocalLearningProgress {
  pathId: string;
  moduleId: string;
  lessonId: string;
  completedAt: string;
}

export class LearningProgressApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LearningProgressApiError";
  }
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

export function clearLocalLearningProgress(): { error: string | null } {
  if (typeof window === "undefined") return { error: null };

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { error: null };
  } catch {
    return {
      error: "Progress perangkat belum dapat dihapus. Progress akun tetap sudah tersimpan.",
    };
  }
}

function parseProgressResponse(value: unknown): LocalLearningProgress[] {
  if (!value || typeof value !== "object") {
    throw new Error("Respons progress akun tidak valid");
  }

  const progress = (value as { progress?: unknown }).progress;
  if (!Array.isArray(progress) || !progress.every(isProgressRecord)) {
    throw new Error("Respons progress akun tidak valid");
  }

  return progress;
}

async function accountProgressRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new LearningProgressApiError(
      "Koneksi ke progress akun gagal. Progress belum berubah.",
      0,
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new LearningProgressApiError(
      typeof data?.error === "string"
        ? data.error
        : "Progress akun belum dapat diproses.",
      response.status,
    );
  }

  return data as T;
}

export async function fetchAccountLearningProgress(): Promise<LocalLearningProgress[]> {
  const data = await accountProgressRequest<unknown>("/api/learn/progress");
  return parseProgressResponse(data);
}

export async function mergeLocalLearningProgress(
  progress: LocalLearningProgress[],
): Promise<LocalLearningProgress[]> {
  const data = await accountProgressRequest<unknown>("/api/learn/progress/sync", {
    method: "POST",
    body: JSON.stringify({
      progress: progress.map(({ pathId, moduleId, lessonId }) => ({
        pathId,
        moduleId,
        lessonId,
      })),
    }),
  });
  return parseProgressResponse(data);
}

export async function completeAccountLesson(
  lesson: Omit<LocalLearningProgress, "completedAt">,
): Promise<LocalLearningProgress> {
  const data = await accountProgressRequest<unknown>("/api/learn/progress/complete", {
    method: "POST",
    body: JSON.stringify(lesson),
  });

  if (!data || typeof data !== "object" || !isProgressRecord((data as { progress?: unknown }).progress)) {
    throw new Error("Respons penyimpanan progress akun tidak valid");
  }

  return (data as { progress: LocalLearningProgress }).progress;
}