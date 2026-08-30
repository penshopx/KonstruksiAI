import { Router } from "express";
import { getSessionFromRequest } from "../../lib/auth";
import { getUserPlan } from "../../lib/entitlements";

const router = Router();

router.get("/auth/me", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.json({ user: null });
    return;
  }
  const plan = await getUserPlan(session.userId);
  res.json({ user: { ...session, plan } });
});

export default router;
