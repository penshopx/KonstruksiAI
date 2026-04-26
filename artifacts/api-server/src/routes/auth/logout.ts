import { Router } from "express";

const router = Router();

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("auth-token", { path: "/" });
  res.json({ success: true });
});

export default router;
