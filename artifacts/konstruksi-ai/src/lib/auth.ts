export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export type SessionLookup =
  | { status: "authenticated"; user: JWTPayload }
  | { status: "anonymous" }
  | { status: "error"; error: string };

export async function getSessionLookup(): Promise<SessionLookup> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.status === 401) return { status: "anonymous" };
    if (!res.ok) {
      return {
        status: "error",
        error: "Status akun belum dapat diperiksa. Progress belum berubah.",
      };
    }

    const data = await res.json();
    if (data.user === null) return { status: "anonymous" };
    if (!data.user || typeof data.user !== "object") {
      return {
        status: "error",
        error: "Status akun belum dapat diperiksa. Progress belum berubah.",
      };
    }

    return { status: "authenticated", user: data.user as JWTPayload };
  } catch {
    return {
      status: "error",
      error: "Status akun belum dapat diperiksa. Periksa koneksi lalu coba lagi.",
    };
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const result = await getSessionLookup();
  return result.status === "authenticated" ? result.user : null;
}
