import { eq } from "drizzle-orm";
import { db, users } from "../db";

export type UserPlan = "free" | "pro";

export async function getUserPlan(userId: number): Promise<UserPlan> {
  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.plan === "pro" ? "pro" : "free";
}

export async function userHasProAccess(userId: number): Promise<boolean> {
  return (await getUserPlan(userId)) === "pro";
}