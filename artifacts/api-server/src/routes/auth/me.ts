import { Router } from "express";
import { getSessionFromRequest } from "../../lib/auth";

const router = Router();

router.get("/auth/me", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.json({ user: null });
    return;
  }
  res.json({ user: session });
});

export default router;
