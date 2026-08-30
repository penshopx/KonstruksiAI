import { Router } from "express";
import { and, desc, eq, isNotNull, isNull, or, type SQL } from "drizzle-orm";
import {
  db,
  aiExecutionHistory,
  projectWorkspaceMembers,
  projectWorkspaces,
} from "../db";
import { getSessionFromRequest } from "../lib/auth";
import {
  EXECUTION_MODULES,
  parseExecutionInputSummary,
  reconcileStaleExecutionRecords,
  resolveExecutionWorkspace,
  type ExecutionModule,
} from "../lib/execution-history";

const router = Router();
const MAX_HISTORY_ITEMS = 50;

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toPublicRecord(record: typeof aiExecutionHistory.$inferSelect) {
  return {
    id: record.id,
    userId: record.userId,
    workspaceId: record.workspaceId,
    module: record.module,
    status: record.status,
    inputSummary: parseExecutionInputSummary(record.inputSummary),
    resultRef: record.resultRef,
    retryOfId: record.retryOfId,
    errorMessage: record.errorMessage,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function findAccessibleRecords(params: {
  userId: number;
  id?: string;
  module?: ExecutionModule;
  workspaceId?: string;
  limit?: number;
}) {
  const filters: SQL[] = [eq(aiExecutionHistory.userId, params.userId)];
  if (params.id) filters.push(eq(aiExecutionHistory.id, params.id));
  if (params.module) filters.push(eq(aiExecutionHistory.module, params.module));
  if (params.workspaceId) filters.push(eq(aiExecutionHistory.workspaceId, params.workspaceId));
  filters.push(or(
    isNull(aiExecutionHistory.workspaceId),
    eq(projectWorkspaces.userId, params.userId),
    isNotNull(projectWorkspaceMembers.id),
  )!);

  return db
    .select({ record: aiExecutionHistory })
    .from(aiExecutionHistory)
    .leftJoin(projectWorkspaces, eq(aiExecutionHistory.workspaceId, projectWorkspaces.id))
    .leftJoin(projectWorkspaceMembers, and(
      eq(projectWorkspaceMembers.workspaceId, aiExecutionHistory.workspaceId),
      eq(projectWorkspaceMembers.userId, params.userId),
      isNull(projectWorkspaceMembers.revokedAt),
    ))
    .where(and(...filters))
    .orderBy(desc(aiExecutionHistory.createdAt))
    .limit(params.limit ?? MAX_HISTORY_ITEMS);
}

router.get("/execution-history", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requestedModule = typeof req.query.module === "string" ? req.query.module : undefined;
  if (requestedModule && !EXECUTION_MODULES.includes(requestedModule as ExecutionModule)) {
    res.status(400).json({ error: "Modul eksekusi tidak valid" });
    return;
  }

  const workspaceResolution = await resolveExecutionWorkspace(req.query.workspaceId, session.userId);
  if ("error" in workspaceResolution) {
    res.status(workspaceResolution.status).json({ error: workspaceResolution.error });
    return;
  }

  try {
    await reconcileStaleExecutionRecords(session.userId);
    const rows = await findAccessibleRecords({
      userId: session.userId,
      ...(workspaceResolution.workspaceId ? { workspaceId: workspaceResolution.workspaceId } : {}),
      ...(requestedModule ? { module: requestedModule as ExecutionModule } : {}),
    });
    res.json({ executions: rows.map(({ record }) => toPublicRecord(record)) });
  } catch (err) {
    req.log.error({ err }, "GET /execution-history error");
    res.status(500).json({ error: "Riwayat eksekusi tidak dapat dimuat" });
  }
});

router.get("/execution-history/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = getParam(req.params.id);
  if (!id || id.length > 128) {
    res.status(400).json({ error: "ID eksekusi tidak valid" });
    return;
  }

  try {
    await reconcileStaleExecutionRecords(session.userId);
    const [row] = await findAccessibleRecords({ userId: session.userId, id, limit: 1 });
    if (!row) {
      res.status(404).json({ error: "Eksekusi tidak ditemukan" });
      return;
    }
    res.json({ execution: toPublicRecord(row.record) });
  } catch (err) {
    req.log.error({ err }, "GET /execution-history/:id error");
    res.status(500).json({ error: "Detail eksekusi tidak dapat dimuat" });
  }
});

export default router;