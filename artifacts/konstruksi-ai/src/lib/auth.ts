export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
