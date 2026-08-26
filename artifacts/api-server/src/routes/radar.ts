import { Router } from "express";
import {
  getRadarArticles,
  getRadarSourceAlerts,
  getRadarSourceStatuses,
  RADAR_CATEGORIES,
  refreshRadar,
  type RadarSourceAlert,
} from "../lib/radar";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

function serializeDate(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function serializeAlert(alert: RadarSourceAlert) {
  return {
    ...alert,
    lastSuccessAt: serializeDate(alert.lastSuccessAt),
  };
}

router.get("/radar/articles", (_req, res) => {
  try {
    const category = typeof _req.query.category === "string" ? _req.query.category : undefined;
    const validCategory = !category || category === "all" || RADAR_CATEGORIES.includes(category as (typeof RADAR_CATEGORIES)[number]);

    if (!validCategory) {
      res.status(400).json({ error: "Kategori Radar tidak valid" });
      return;
    }

    const articles = getRadarArticles(category).map((article) => ({
      ...article,
      publishedAt: serializeDate(article.publishedAt),
      fetchedAt: serializeDate(article.fetchedAt),
    }));

    res.json({
      articles,
      categories: RADAR_CATEGORIES,
      sources: getRadarSourceStatuses().map((source) => ({
        ...source,
        lastAttemptAt: serializeDate(source.lastAttemptAt),
        lastSuccessAt: serializeDate(source.lastSuccessAt),
      })),
      alerts: getRadarSourceAlerts().map(serializeAlert),
    });
  } catch (error) {
    res.status(500).json({ error: "Feed Radar Konstruksi tidak dapat dimuat" });
  }
});

router.post("/radar/refresh", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Masuk diperlukan untuk memperbarui sumber Radar" });
    return;
  }

  try {
    const result = await refreshRadar();
    res.json({
      ...result,
      startedAt: result.startedAt.toISOString(),
      finishedAt: result.finishedAt.toISOString(),
      sources: result.sources.map((source) => ({
        ...source,
        lastAttemptAt: serializeDate(source.lastAttemptAt),
        lastSuccessAt: serializeDate(source.lastSuccessAt),
      })),
      alerts: result.alerts.map(serializeAlert),
    });
  } catch (error) {
    req.log.error({ err: error }, "POST /radar/refresh error");
    res.status(502).json({ error: "Sumber Radar tidak dapat diperbarui" });
  }
});

export default router;