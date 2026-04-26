import { Router } from "express";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

router.post("/upload", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { filename, type, data } = req.body;

    if (!filename || !type || !data) {
      res.status(400).json({ error: "filename, type, and data are required" });
      return;
    }

    if (!ALLOWED_TYPES.includes(type)) {
      res.status(400).json({ error: "File type tidak didukung" });
      return;
    }

    const buffer = Buffer.from(data, "base64");
    if (buffer.length > MAX_FILE_SIZE) {
      res.status(400).json({ error: "File terlalu besar (maksimal 20MB)" });
      return;
    }

    let content = "";
    let pageCount: number | undefined;

    if (type === "text/plain" || type === "text/markdown" || type === "text/csv") {
      content = buffer.toString("utf-8");
    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } catch {
        content = "[Gagal membaca dokumen Word]";
      }
    } else if (type === "application/pdf") {
      return res.json({
        filename,
        content: "",
        type,
        size: buffer.length,
        needsClientProcessing: true,
        base64Data: data,
      });
    } else {
      content = `[File ${filename} diupload - ${buffer.length} bytes]`;
    }

    res.json({
      filename,
      content: content.slice(0, 50000),
      type,
      size: buffer.length,
      pageCount,
    });
  } catch (err) {
    req.log.error({ err }, "POST /upload error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/fetch-url", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { url } = req.body;
    if (!url) { res.status(400).json({ error: "url required" }); return; }

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 KonstruksiAI/1.0" },
    });

    const text = await response.text();
    const plainText = text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50000);

    res.json({ content: plainText, url });
  } catch (err) {
    req.log.error({ err }, "POST /fetch-url error");
    res.status(500).json({ error: "Gagal mengambil konten dari URL" });
  }
});

export default router;
