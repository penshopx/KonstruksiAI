import { Router } from "express";
import { getSessionFromRequest } from "../lib/auth";
import {
  assessSbuReadiness,
  validateSbuApplicationType,
  type BusinessEntityProfile,
  type SbuApplicationType,
  type SbuClassification,
} from "@workspace/assessment/sbu-readiness";
import {
  assessSkkReadiness,
  validateSkkApplicationType,
  type WorkforceProfile,
  type SkkApplicationType,
  type JobPosition,
} from "@workspace/assessment/skk-readiness";
import {
  assessTenderEligibility,
  type TenderDocument,
} from "@workspace/assessment/tender-eligibility";

const router = Router();

router.post("/sbu-readiness/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { entity, applicationType, classification, evidence } = req.body ?? {};
  if (!entity || !applicationType || !classification) {
    res.status(400).json({ error: "entity, applicationType, and classification are required" });
    return;
  }

  try {
    const validation = validateSbuApplicationType(
      entity as BusinessEntityProfile,
      applicationType as SbuApplicationType,
    );
    if (!validation.valid) {
      res.status(400).json({ error: "validation_failed", issues: validation.issues });
      return;
    }

    const result = assessSbuReadiness(
      entity as BusinessEntityProfile,
      applicationType as SbuApplicationType,
      classification as SbuClassification,
      (evidence as Record<string, unknown>) ?? {},
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /sbu-readiness/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/skk-readiness/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { workforce, applicationType, position, evidence } = req.body ?? {};
  if (!workforce || !applicationType || !position) {
    res.status(400).json({ error: "workforce, applicationType, and position are required" });
    return;
  }

  try {
    const validation = validateSkkApplicationType(
      workforce as WorkforceProfile,
      applicationType as SkkApplicationType,
    );
    if (!validation.valid) {
      res.status(400).json({ error: "validation_failed", issues: validation.issues });
      return;
    }

    const result = assessSkkReadiness(
      workforce as WorkforceProfile,
      applicationType as SkkApplicationType,
      position as JobPosition,
      (evidence as Record<string, unknown>) ?? {},
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /skk-readiness/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tender-eligibility/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { businessEntityId, tenderDocument, personnelIds, evidence } = req.body ?? {};
  if (!businessEntityId || !tenderDocument) {
    res.status(400).json({ error: "businessEntityId and tenderDocument are required" });
    return;
  }

  try {
    const result = assessTenderEligibility(
      businessEntityId as string,
      tenderDocument as TenderDocument,
      (personnelIds as string[]) ?? [],
      (evidence as Record<string, unknown>) ?? {},
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /tender-eligibility/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
