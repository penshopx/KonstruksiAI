import { Router, type IRouter } from "express";
import healthRouter from "./health";
import loginRouter from "./auth/login";
import registerRouter from "./auth/register";
import meRouter from "./auth/me";
import logoutRouter from "./auth/logout";
import conversationsRouter from "./conversations";
import profileRouter from "./profile";
import chatRouter from "./chat";
import uploadRouter from "./upload";
import assessmentRouter from "./assessment";

const router: IRouter = Router();

router.use(healthRouter);
router.use(loginRouter);
router.use(registerRouter);
router.use(meRouter);
router.use(logoutRouter);
router.use(conversationsRouter);
router.use(profileRouter);
router.use(chatRouter);
router.use(uploadRouter);
router.use(assessmentRouter);

export default router;
