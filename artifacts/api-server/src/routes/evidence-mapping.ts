import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { randomUUID, createHash } from "crypto";
import { createRequire } from "module";
import { db, evidenceDocuments, evidenceMappings } from "../db";
import { getSessionFromRequest } from "../lib/auth";

const _require = createRequire(import.meta.url);
const { PDFParse: _PDFParse } = _require("pdf-parse") as {
  PDFParse: new (opts: { data: Buffer | Uint8Array; verbosity?: number }) => {
    getText(params?: { partial?: number[] }): Promise<{ text: string; total: number }>;
    destroy(): Promise<void>;
  };
};

const router = Router();

// ─── Static requirement reference data ───────────────────────────────────────
// Mirrors artifacts/konstruksi-ai/src/app/evidence-mapping/page.tsx MOCK_REQUIREMENTS.
// Kept as a local copy per this project's convention of each backend feature
// owning its reference data rather than importing across the workspace boundary.

interface EvidenceRequirement {
  id: string;
  type: "sbu" | "skk" | "legal" | "certification";
  text: string;
  requiredEvidence: string[];
}

const EVIDENCE_REQUIREMENTS: EvidenceRequirement[] = [
  {
    id: "sbu-admin-1",
    type: "sbu",
    text: "Akta Pendirian Perusahaan yang masih berlaku",
    requiredEvidence: ["Akta Pendirian", "SK Menkumham"],
  },
  {
    id: "sbu-admin-2",
    type: "sbu",
    text: "NPWP Perusahaan aktif",
    requiredEvidence: ["NPWP"],
  },
  {
    id: "skk-edu-1",
    type: "skk",
    text: "Ijazah pendidikan sesuai jabatan",
    requiredEvidence: ["Ijazah", "Transkrip Nilai"],
  },
  {
    id: "skk-cert-1",
    type: "skk",
    text: "Sertifikat kompetensi kerja",
    requiredEvidence: ["SKK", "Sertifikat Kompetensi"],
  },
];

const REQUIREMENT_BY_ID = new Map(EVIDENCE_REQUIREMENTS.map((r) => [r.id, r]));

const VALID_ENTITY_TYPES = new Set(["business_entity", "personnel", "tender"]);
const VALID_REQUIREMENT_TYPES = new Set(["sbu", "skk", "legal", "certification"]);
const VALID_VALIDATION_STATUSES = new Set(["valid", "invalid", "partial"]);

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

function validateText(value: unknown, maxLength: number): { value: string | null; tooLong: boolean } {
  if (typeof value !== "string") return { value: null, tooLong: false };
  const normalized = value.trim();
  return { value: normalized, tooLong: normalized.length > maxLength };
}

// ─── Text extraction (server-side, mirrors routes/chat.ts attachment handling) ─

async function extractText(buffer: Buffer, mimeType: string): Promise<{ text: string | null; error: string | null }> {
  try {
    if (mimeType === "text/plain" || mimeType === "text/markdown" || mimeType === "text/csv") {
      return { text: buffer.toString("utf-8").slice(0, 50_000), error: null };
    }

    if (mimeType === "application/pdf") {
      const parser = new _PDFParse({ data: buffer });
      try {
        const pages = Array.from({ length: 50 }, (_, i) => i + 1);
        const info = await parser.getText({ partial: pages });
        const text = info.text.replace(/\s+/g, " ").trim();
        if (!text || text.length < 20) {
          return { text: null, error: "PDF berisi gambar/scan tanpa teks yang dapat dibaca" };
        }
        return { text: text.slice(0, 50_000), error: null };
      } finally {
        await parser.destroy();
      }
    }

    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value.slice(0, 50_000), error: null };
    }

    if (mimeType.startsWith("image/")) {
      // OCR/document-parsing beyond basic text extraction is out of scope for this
      // feature. Images are stored as evidence without extracted text, so mapping
      // will not match them by keyword until a real OCR pipeline is added.
      return { text: null, error: null };
    }

    return { text: null, error: "Tipe file tidak didukung untuk ekstraksi teks" };
  } catch (err) {
    return { text: null, error: err instanceof Error ? err.message : "Gagal memproses dokumen" };
  }
}

// ─── Mapping / compliance logic (ported from src/lib/evidence-mapping.ts) ────

function findRelevantDocuments(
  documents: Array<{ id: string; extractedText: string | null }>,
  requirement: EvidenceRequirement,
): Array<{ id: string; extractedText: string | null }> {
  return documents.filter((doc) => {
    const text = (doc.extractedText || "").toLowerCase();
    if (!text) return false;
    const keywords = requirement.requiredEvidence.concat(
      requirement.text.split(" ").filter((word) => word.length > 3),
    );
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });
}

function extractEvidenceFromDocument(text: string, requirement: EvidenceRequirement): string[] {
  const evidence: string[] = [];
  requirement.requiredEvidence.forEach((required) => {
    if (text.toLowerCase().includes(required.toLowerCase())) {
      const sentences = text.split(/[.!?]+/);
      const relevantSentence = sentences.find((sentence) => sentence.toLowerCase().includes(required.toLowerCase()));
      if (relevantSentence) evidence.push(relevantSentence.trim());
    }
  });
  return evidence;
}

function calculateMappingConfidence(extractedEvidence: string[], requirement: EvidenceRequirement): number {
  if (extractedEvidence.length === 0) return 0;
  const found = requirement.requiredEvidence.filter((required) =>
    extractedEvidence.some((evidence) => evidence.toLowerCase().includes(required.toLowerCase())),
  );
  return Math.round((found.length / requirement.requiredEvidence.length) * 100);
}

function generateSuggestedDocuments(missingEvidence: string[]): string[] {
  const suggestions: string[] = [];
  missingEvidence.forEach((evidence) => {
    const lower = evidence.toLowerCase();
    if (lower.includes("akta") || lower.includes("pendirian")) suggestions.push("Akta Pendirian Perusahaan");
    else if (lower.includes("npwp")) suggestions.push("NPWP Perusahaan");
    else if (lower.includes("sertifikat") && lower.includes("kompetensi")) suggestions.push("Sertifikat Keahlian Kerja (SKK)");
    else if (lower.includes("ijazah") || lower.includes("pendidikan")) suggestions.push("Ijazah/Dokumen Pendidikan");
    else if (lower.includes("pengalaman") || lower.includes("riwayat")) suggestions.push("Daftar Riwayat Pekerjaan");
    else if (lower.includes("sbu")) suggestions.push("Sertifikat Badan Usaha (SBU)");
    else suggestions.push(`${evidence} - Dokumen terkait`);
  });
  return [...new Set(suggestions)];
}

function generateEvidenceRecommendations(gaps: unknown[], requirementType: string): string[] {
  const recommendations: string[] = [];
  if (gaps.length === 0) {
    recommendations.push("Semua persyaratan sudah memiliki eviden yang memadai.");
    return recommendations;
  }
  recommendations.push("Upload dokumen pendukung yang masih kurang ke sistem.");
  recommendations.push("Pastikan dokumen dalam format yang dapat diproses (PDF, DOCX, gambar).");
  if (requirementType === "sbu" || requirementType === "skk") {
    recommendations.push("Koordinasikan dengan tim legal dan SDM untuk melengkapi eviden sertifikasi.");
  }
  return recommendations;
}

function shapeDocument(row: typeof evidenceDocuments.$inferSelect) {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    uploadedAt: row.uploadedAt.toISOString(),
    checksum: row.checksum,
    extractedText: row.extractedText ?? undefined,
    status: row.status,
    processingError: row.processingError ?? undefined,
  };
}

function shapeMapping(row: typeof evidenceMappings.$inferSelect) {
  let extractedEvidence: string[] = [];
  let auditTrail: unknown[] = [];
  try { extractedEvidence = JSON.parse(row.extractedEvidence); } catch { /* leave empty */ }
  try { auditTrail = JSON.parse(row.auditTrail); } catch { /* leave empty */ }
  return {
    id: row.id,
    documentId: row.documentId,
    requirementId: row.requirementId,
    requirementType: row.requirementType,
    entityType: row.entityType,
    entityId: row.entityId,
    mappingConfidence: row.mappingConfidence,
    extractedEvidence,
    validationStatus: row.validationStatus,
    validationNotes: row.validationNotes,
    mappedBy: row.mappedBy,
    mappedAt: row.mappedAt.toISOString(),
    lastReviewedBy: row.lastReviewedBy ?? undefined,
    lastReviewedAt: row.lastReviewedAt ? row.lastReviewedAt.toISOString() : undefined,
    auditTrail,
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.post("/evidence/documents", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { filename, type, data } = req.body ?? {};
  if (!filename || typeof filename !== "string" || !type || typeof type !== "string" || !data || typeof data !== "string") {
    res.status(400).json({ error: "filename, type, dan data wajib diisi" });
    return;
  }
  if (!ALLOWED_TYPES.has(type)) {
    res.status(400).json({ error: "Tipe file tidak didukung" });
    return;
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(data, "base64");
  } catch {
    res.status(400).json({ error: "Data file tidak valid" });
    return;
  }
  if (buffer.length === 0 || buffer.length > MAX_FILE_SIZE) {
    res.status(400).json({ error: "File terlalu besar (maksimal 20MB) atau kosong" });
    return;
  }

  try {
    const checksum = createHash("sha256").update(buffer).digest("hex");
    const { text, error } = await extractText(buffer, type);
    const id = randomUUID();
    const ext = filename.includes(".") ? filename.split(".").pop() : "";
    const now = new Date();

    const [row] = await db
      .insert(evidenceDocuments)
      .values({
        id,
        userId: session.userId,
        filename: `${id}.${ext}`,
        originalName: filename,
        mimeType: type,
        size: buffer.length,
        checksum,
        data: buffer,
        extractedText: text,
        status: error ? "failed" : "processed",
        processingError: error,
        uploadedAt: now,
      })
      .returning();

    res.status(201).json({ document: shapeDocument(row) });
  } catch (err) {
    req.log.error({ err }, "POST /evidence/documents error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/evidence/documents", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(evidenceDocuments).where(eq(evidenceDocuments.userId, session.userId));
    res.json({ documents: rows.map(shapeDocument).sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt)) });
  } catch (err) {
    req.log.error({ err }, "GET /evidence/documents error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/evidence/documents/:id/content", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [existing] = await db
      .select()
      .from(evidenceDocuments)
      .where(and(eq(evidenceDocuments.id, req.params.id), eq(evidenceDocuments.userId, session.userId)));
    if (!existing) {
      res.status(404).json({ error: "Dokumen tidak ditemukan" });
      return;
    }
    if (!existing.data) {
      res.status(404).json({ error: "Isi file tidak tersedia untuk dokumen ini" });
      return;
    }
    res.setHeader("Content-Type", existing.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(existing.originalName)}"`);
    res.send(Buffer.from(existing.data));
  } catch (err) {
    req.log.error({ err }, "GET /evidence/documents/:id/content error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/evidence/documents/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [existing] = await db
      .select()
      .from(evidenceDocuments)
      .where(and(eq(evidenceDocuments.id, req.params.id), eq(evidenceDocuments.userId, session.userId)));
    if (!existing) {
      res.status(404).json({ error: "Dokumen tidak ditemukan" });
      return;
    }
    // evidence_mappings rows cascade-delete via the documentId foreign key.
    await db.delete(evidenceDocuments).where(eq(evidenceDocuments.id, existing.id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "DELETE /evidence/documents/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/evidence/mappings/auto", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const entityId = typeof req.body?.entityId === "string" ? req.body.entityId.trim() : "";
  const entityType = req.body?.entityType;
  const requirementType = req.body?.requirementType;

  if (!entityId || entityId.length > 200) {
    res.status(400).json({ error: "Entity ID wajib diisi (maksimal 200 karakter)" });
    return;
  }
  if (typeof entityType !== "string" || !VALID_ENTITY_TYPES.has(entityType)) {
    res.status(400).json({ error: "Entity type tidak valid" });
    return;
  }
  if (typeof requirementType !== "string" || !VALID_REQUIREMENT_TYPES.has(requirementType)) {
    res.status(400).json({ error: "Requirement type tidak valid" });
    return;
  }

  try {
    const requirements = EVIDENCE_REQUIREMENTS.filter((r) => r.type === requirementType);
    const docs = await db
      .select()
      .from(evidenceDocuments)
      .where(and(eq(evidenceDocuments.userId, session.userId), eq(evidenceDocuments.status, "processed")));

    const created: ReturnType<typeof shapeMapping>[] = [];
    const now = new Date();

    for (const requirement of requirements) {
      const relevant = findRelevantDocuments(docs, requirement);
      for (const doc of relevant) {
        const text = doc.extractedText || "";
        const extractedEvidence = extractEvidenceFromDocument(text, requirement);
        const confidence = calculateMappingConfidence(extractedEvidence, requirement);
        if (confidence <= 30) continue;

        const validationStatus = confidence > 80 ? "valid" : "requires_review";
        const validationNotes = confidence > 80 ? "Auto-validated with high confidence" : "Requires manual review";
        const auditEntry = {
          id: `audit-${randomUUID()}`,
          timestamp: now.toISOString(),
          action: "created",
          userId: "system",
          userName: "AI Mapping Engine",
          notes: `Auto-mapped with ${confidence}% confidence`,
        };

        const [existing] = await db
          .select()
          .from(evidenceMappings)
          .where(and(
            eq(evidenceMappings.documentId, doc.id),
            eq(evidenceMappings.requirementId, requirement.id),
            eq(evidenceMappings.entityId, entityId),
            eq(evidenceMappings.entityType, entityType),
          ));

        let row: typeof evidenceMappings.$inferSelect;
        if (existing) {
          [row] = await db
            .update(evidenceMappings)
            .set({
              entityId,
              entityType,
              requirementType,
              mappingConfidence: confidence,
              extractedEvidence: JSON.stringify(extractedEvidence),
              validationStatus,
              validationNotes,
              mappedBy: "system",
              mappedAt: now,
              auditTrail: JSON.stringify([...JSON.parse(existing.auditTrail || "[]"), auditEntry]),
            })
            .where(eq(evidenceMappings.id, existing.id))
            .returning();
        } else {
          [row] = await db
            .insert(evidenceMappings)
            .values({
              id: randomUUID(),
              userId: session.userId,
              documentId: doc.id,
              entityId,
              entityType,
              requirementId: requirement.id,
              requirementType,
              mappingConfidence: confidence,
              extractedEvidence: JSON.stringify(extractedEvidence),
              validationStatus,
              validationNotes,
              mappedBy: "system",
              mappedAt: now,
              auditTrail: JSON.stringify([auditEntry]),
            })
            .returning();
        }
        created.push(shapeMapping(row));
      }
    }

    res.status(201).json({ mappings: created });
  } catch (err) {
    req.log.error({ err }, "POST /evidence/mappings/auto error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/evidence/mappings", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(evidenceMappings).where(eq(evidenceMappings.userId, session.userId));
    res.json({ mappings: rows.map(shapeMapping).sort((a, b) => a.mappedAt.localeCompare(b.mappedAt)) });
  } catch (err) {
    req.log.error({ err }, "GET /evidence/mappings error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/evidence/mappings/:id/validate", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const status = req.body?.status;
  if (typeof status !== "string" || !VALID_VALIDATION_STATUSES.has(status)) {
    res.status(400).json({ error: "Status validasi tidak valid" });
    return;
  }
  const notesResult = validateText(req.body?.notes, 1000);
  if (notesResult.tooLong) {
    res.status(400).json({ error: "Catatan maksimal 1.000 karakter" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(evidenceMappings)
      .where(and(eq(evidenceMappings.id, req.params.id), eq(evidenceMappings.userId, session.userId)));
    if (!existing) {
      res.status(404).json({ error: "Mapping tidak ditemukan" });
      return;
    }

    const now = new Date();
    let auditTrail: unknown[] = [];
    try { auditTrail = JSON.parse(existing.auditTrail || "[]"); } catch { /* start fresh */ }
    auditTrail.push({
      id: `audit-${randomUUID()}`,
      timestamp: now.toISOString(),
      action: "validated",
      userId: String(session.userId),
      userName: session.name,
      previousValue: existing.validationStatus,
      newValue: status,
      notes: notesResult.value ?? "",
    });

    const [row] = await db
      .update(evidenceMappings)
      .set({
        validationStatus: status,
        validationNotes: notesResult.value ?? "",
        lastReviewedBy: session.name,
        lastReviewedAt: now,
        auditTrail: JSON.stringify(auditTrail),
      })
      .where(eq(evidenceMappings.id, existing.id))
      .returning();

    res.json({ mapping: shapeMapping(row) });
  } catch (err) {
    req.log.error({ err }, "PATCH /evidence/mappings/:id/validate error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/evidence/mappings/:id", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [existing] = await db
      .select()
      .from(evidenceMappings)
      .where(and(eq(evidenceMappings.id, req.params.id), eq(evidenceMappings.userId, session.userId)));
    if (!existing) {
      res.status(404).json({ error: "Mapping tidak ditemukan" });
      return;
    }
    await db.delete(evidenceMappings).where(eq(evidenceMappings.id, existing.id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "DELETE /evidence/mappings/:id error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/evidence/compliance", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }

  const entityId = typeof req.query.entityId === "string" ? req.query.entityId.trim() : "";
  const entityType = req.query.entityType;
  const requirementType = req.query.requirementType;

  if (!entityId) {
    res.status(400).json({ error: "entityId wajib diisi" });
    return;
  }
  if (typeof entityType !== "string" || !VALID_ENTITY_TYPES.has(entityType)) {
    res.status(400).json({ error: "entityType tidak valid" });
    return;
  }
  if (typeof requirementType !== "string" || !VALID_REQUIREMENT_TYPES.has(requirementType)) {
    res.status(400).json({ error: "requirementType tidak valid" });
    return;
  }

  try {
    const requirements = EVIDENCE_REQUIREMENTS.filter((r) => r.type === requirementType);
    const allMappings = await db
      .select()
      .from(evidenceMappings)
      .where(and(
        eq(evidenceMappings.userId, session.userId),
        eq(evidenceMappings.entityId, entityId),
        eq(evidenceMappings.entityType, entityType),
        eq(evidenceMappings.requirementType, requirementType),
      ));
    const mappings = allMappings.map(shapeMapping);

    const totalRequirements = requirements.length;
    const mappedRequirements = new Set(mappings.map((m) => m.requirementId)).size;
    const validatedMappings = mappings.filter((m) => m.validationStatus === "valid");
    const validatedRequirements = new Set(validatedMappings.map((m) => m.requirementId)).size;

    const complianceScore = totalRequirements > 0 ? Math.round((validatedRequirements / totalRequirements) * 100) : 0;
    const evidenceCompleteness = totalRequirements > 0 ? Math.round((mappedRequirements / totalRequirements) * 100) : 0;

    const gaps = requirements
      .map((requirement) => {
        const requirementMappings = mappings.filter((m) => m.requirementId === requirement.id);
        const mappedEvidence = requirementMappings.flatMap((m) => m.extractedEvidence);
        const missingEvidence = requirement.requiredEvidence.filter(
          (required) => !mappedEvidence.some((evidence) => evidence.toLowerCase().includes(required.toLowerCase())),
        );
        if (missingEvidence.length === 0) return null;
        const priority = missingEvidence.length === requirement.requiredEvidence.length ? "high"
          : missingEvidence.length > requirement.requiredEvidence.length / 2 ? "medium" : "low";
        return {
          requirementId: requirement.id,
          requirementText: requirement.text,
          missingEvidence,
          suggestedDocuments: generateSuggestedDocuments(missingEvidence),
          priority,
          estimatedCost: missingEvidence.length * 100_000,
          estimatedTime: missingEvidence.length * 7,
        };
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);

    const recommendations = generateEvidenceRecommendations(gaps, requirementType);
    const pendingValidations = mappings.filter((m) => m.validationStatus === "pending" || m.validationStatus === "requires_review").length;
    const requiresReview = mappings.filter((m) => m.validationStatus === "requires_review").length;

    res.json({
      result: {
        entityId,
        entityType,
        requirementType,
        totalRequirements,
        mappedRequirements,
        validatedRequirements,
        complianceScore,
        evidenceCompleteness,
        mappings,
        gaps,
        recommendations,
        auditSummary: {
          totalMappings: mappings.length,
          pendingValidations,
          requiresReview,
          lastAuditDate: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /evidence/compliance error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
