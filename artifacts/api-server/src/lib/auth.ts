import { SignJWT, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "konstruksi-ai-secret-key-2024-change-in-production"
);

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k.trim(), decodeURIComponent(v.join("="))];
    })
  );
}

export async function getSessionFromRequest(req: Request): Promise<JWTPayload | null> {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["auth-token"];
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  getSessionFromRequest(req).then((session) => {
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as Request & { user: JWTPayload }).user = session;
    next();
  }).catch(() => {
    res.status(401).json({ error: "Unauthorized" });
  });
}
