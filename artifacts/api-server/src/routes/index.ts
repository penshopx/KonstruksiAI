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
import radarRouter from "./radar";
import projectWorkspacesRouter from "./project-workspaces";
import learnRouter from "./learn";
import solverRouter from "./solver";
import tenderIntelligenceRouter from "./tender-intelligence";
import legalLicensingRouter from "./legal-licensing";

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
router.use(radarRouter);
router.use(projectWorkspacesRouter);
router.use(learnRouter);
router.use(solverRouter);
router.use(tenderIntelligenceRouter);
router.use(legalLicensingRouter);

export default router;
