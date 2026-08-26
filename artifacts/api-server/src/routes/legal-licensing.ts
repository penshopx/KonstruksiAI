import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, legalEntities, legalLicenses } from "../db";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

// ─── Static Indonesian license requirement database ──────────────────────────
// Mirrors artifacts/konstruksi-ai/src/lib/legal-licensing.ts LICENSE_REQUIREMENTS.
// Kept as a local copy per this project's convention of each backend feature
// owning its reference data rather than importing across the workspace boundary.

export interface LicenseRequirement {
  id: string;
  name: string;
  category: "business" | "sectoral" | "environmental" | "safety" | "labor" | "regional";
  authority: string;
  legalBasis: string;
  mandatory: boolean;
  sectorApplicability: string[];
  regionApplicability: string[];
  validityPeriod: number;
  renewalNoticePeriod: number;
  requirements: {
    id: string;
    description: string;
    documentType: string;
    mandatory: boolean;
    verificationMethod: string;
    validityPeriod?: number;
  }[];
  fees: { initial: number; renewal: number; latePenalty: number };
}

export const LICENSE_REQUIREMENTS: LicenseRequirement[] = [
  {
    id: "nib",
    name: "Nomor Induk Berusaha (NIB)",
    category: "business",
    authority: "BKPM/OSS",
    legalBasis: "UU No. 11 Tahun 2020 tentang Cipta Kerja",
    mandatory: true,
    sectorApplicability: ["all"],
    regionApplicability: ["national"],
    validityPeriod: 0,
    renewalNoticePeriod: 0,
    requirements: [
      { id: "ktp_director", description: "KTP Direktur/Penanggung Jawab", documentType: "identity", mandatory: true, verificationMethod: "document_upload" },
      { id: "akta_pendirian", description: "Akta Pendirian Perusahaan", documentType: "legal", mandatory: true, verificationMethod: "document_upload" },
      { id: "npwp", description: "NPWP Perusahaan", documentType: "tax", mandatory: true, verificationMethod: "api_verification" },
      { id: "surat_domisili", description: "Surat Keterangan Domisili", documentType: "address", mandatory: true, verificationMethod: "document_upload" },
    ],
    fees: { initial: 0, renewal: 0, latePenalty: 0 },
  },
  {
    id: "siup",
    name: "Surat Izin Usaha Perdagangan (SIUP)",
    category: "business",
    authority: "Kementerian Perdagangan",
    legalBasis: "PP No. 7 Tahun 2021",
    mandatory: true,
    sectorApplicability: ["trade", "services"],
    regionApplicability: ["provincial"],
    validityPeriod: 60,
    renewalNoticePeriod: 3,
    requirements: [
      { id: "nib", description: "NIB yang masih berlaku", documentType: "license", mandatory: true, verificationMethod: "api_verification" },
      { id: "akta_perusahaan", description: "Akta Perusahaan yang masih berlaku", documentType: "legal", mandatory: true, verificationMethod: "document_upload" },
      { id: "npwp", description: "NPWP Perusahaan aktif", documentType: "tax", mandatory: true, verificationMethod: "api_verification" },
      { id: "surat_domisili", description: "Surat Keterangan Domisili", documentType: "address", mandatory: true, verificationMethod: "document_upload" },
    ],
    fees: { initial: 2500000, renewal: 2500000, latePenalty: 500000 },
  },
  {
    id: "sbu",
    name: "Sertifikat Badan Usaha (SBU)",
    category: "sectoral",
    authority: "LPJK",
    legalBasis: "PP No. 28 Tahun 2015",
    mandatory: true,
    sectorApplicability: ["construction"],
    regionApplicability: ["national"],
    validityPeriod: 36,
    renewalNoticePeriod: 3,
    requirements: [
      { id: "siup", description: "SIUP yang masih berlaku", documentType: "license", mandatory: true, verificationMethod: "api_verification" },
      { id: "akta_perusahaan", description: "Akta Perusahaan", documentType: "legal", mandatory: true, verificationMethod: "document_upload" },
      { id: "pengalaman_proyek", description: "Daftar Pengalaman Proyek", documentType: "experience", mandatory: true, verificationMethod: "document_upload" },
      { id: "tenaga_ahli", description: "Sertifikat Tenaga Ahli", documentType: "certification", mandatory: true, verificationMethod: "document_upload" },
      { id: "peralatan", description: "Daftar Peralatan", documentType: "asset", mandatory: true, verificationMethod: "document_upload" },
    ],
    fees: { initial: 5000000, renewal: 3000000, latePenalty: 1000000 },
  },
  {
    id: "smk3",
    name: "Sertifikat Sistem Manajemen Keselamatan Kerja (SMK3)",
    category: "safety",
    authority: "Kementerian Ketenagakerjaan",
    legalBasis: "PP No. 50 Tahun 2012",
    mandatory: true,
    sectorApplicability: ["construction", "mining", "oil_gas", "manufacturing"],
    regionApplicability: ["provincial"],
    validityPeriod: 36,
    renewalNoticePeriod: 6,
    requirements: [
      { id: "kebijakan_k3", description: "Kebijakan Keselamatan Kerja", documentType: "policy", mandatory: true, verificationMethod: "document_upload" },
      { id: "struktur_k3", description: "Struktur Organisasi K3", documentType: "organizational", mandatory: true, verificationMethod: "document_upload" },
      { id: "program_k3", description: "Program K3", documentType: "program", mandatory: true, verificationMethod: "document_upload" },
      { id: "pelatihan_k3", description: "Daftar Pelatihan K3", documentType: "training", mandatory: true, verificationMethod: "document_upload" },
    ],
    fees: { initial: 1500000, renewal: 1000000, latePenalty: 500000 },
  },
  {
    id: "amdal",
    name: "Analisis Mengenai Dampak Lingkungan (AMDAL)",
    category: "environmental",
    authority: "KLHK",
    legalBasis: "UU No. 32 Tahun 2009",
    mandatory: false,
    sectorApplicability: ["construction", "mining", "oil_gas", "industry"],
    regionApplicability: ["provincial"],
    validityPeriod: 0,
    renewalNoticePeriod: 0,
    requirements: [
      { id: "ukl_upl", description: "UKL-UPL atau AMDAL", documentType: "environmental", mandatory: true, verificationMethod: "document_upload" },
      { id: "rkl_rpl", description: "RKL-RPL", documentType: "environmental", mandatory: true, verificationMethod: "document_upload" },
    ],
    fees: { initial: 50000000, renewal: 25000000, latePenalty: 10000000 },
  },
];

const LICENSE_REQUIREMENT_IDS = new Set(LICENSE_REQUIREMENTS.map((r) => r.id));

const VALID_ENTITY_TYPES = new Set(["PT", "CV", "UD", "Firma", "Koperasi", "Perorangan"]);
const VALID_ENTITY_STATUSES = new Set(["active", "inactive", "suspended", "dissolved"]);
const VALID_SECTORS = new Set([
  "construction", "mining", "oil_gas", "manufacturing", "trade", "services", "industry",
]);
const VALID_LICENSE_STATUSES = new Set([
  "not_applied", "applied", "approved", "rejected", "expired", "suspended",
]);

function getApplicableRequirements(sector: string): LicenseRequirement[] {
  const normalized = sector.toLowerCase();
  return LICENSE_REQUIREMENTS.filter(
    (req) => req.sectorApplicability.includes("all") || req.sectorApplicability.includes(normalized),
  );
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function validateText(value: unknown, maxLength: number): { value: string | null; tooLong: boolean } {
  if (typeof value !== "string") return { value: null, tooLong: false };
  const normalized = value.trim();
  return { value: normalized, tooLong: normalized.length > maxLength };
}

function optionalDate(value: unknown): { ok: boolean; value: string | null } {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  if (typeof value !== "string" || !isValidIsoDate(value)) return { ok: false, value: null };
  return { ok: true, value };
}

async function findEntityForUser(userId: number) {
  const [entity] = await db.select().from(legalEntities).where(eq(legalEntities.userId, userId));
  return entity ?? null;
}

function shapeEntity(row: typeof legalEntities.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    npwp: row.npwp,
    nib: row.nib ?? undefined,
    sector: row.sector,
    subSector: row.subSector,
    region: row.region,
    establishmentDate: row.establishmentDate,
    status: row.status,
  };
}

function shapeLicense(entityId: string, requirementId: string, row: typeof legalLicenses.$inferSelect | null) {
  return {
    id: row?.id ?? `license-${entityId}-${requirementId}`,
    licenseRequirementId: requirementId,
    entityId,
    status: row?.status ?? "not_applied",
    applicationDate: row?.applicationDate ?? undefined,
    approvalDate: row?.approvalDate ?? undefined,
    expiryDate: row?.expiryDate ?? undefined,
    licenseNumber: row?.licenseNumber ?? undefined,
    notes: row?.notes ?? "",
    documents: [] as unknown[],
    renewalHistory: [] as unknown[],
  };
}

// Merge persisted license rows with the applicable requirement set so the
// caller always sees one entry per applicable requirement (defaulting to
// "not_applied" for anything the user hasn't touched yet), without needing
// to pre-seed rows in the database.
async function getMergedLicenses(entity: typeof legalEntities.$inferSelect) {
  const applicable = getApplicableRequirements(entity.sector);
  const persisted = await db.select().from(legalLicenses).where(eq(legalLicenses.entityId, entity.id));
  const byRequirementId = new Map(persisted.map((row) => [row.licenseRequirementId, row]));
  return applicable.map((req) => shapeLicense(entity.id, req.id, byRequirementId.get(req.id) ?? null));
}

// ─── Compliance calculation (moved from the frontend mock logic) ────────────

interface LicenseComplianceEntry {
  licenseId: string;
  licenseName: string;
  required: boolean;
  status: "compliant" | "non_compliant" | "expired" | "pending";
  expiryDate?: string;
  daysUntilExpiry?: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

function computeCompliance(
  entity: typeof legalEntities.$inferSelect,
  licenses: Awaited<ReturnType<typeof getMergedLicenses>>,
) {
  const applicable = getApplicableRequirements(entity.sector);

  const licenseCompliance: LicenseComplianceEntry[] = applicable.map((req) => {
    const license = licenses.find((l) => l.licenseRequirementId === req.id);
    const entry: LicenseComplianceEntry = {
      licenseId: req.id,
      licenseName: req.name,
      required: req.mandatory,
      status: "non_compliant",
      riskLevel: "medium",
    };

    if (license && license.status !== "not_applied") {
      entry.status = license.status === "approved" ? "compliant" : "non_compliant";
      entry.expiryDate = license.expiryDate;

      if (license.expiryDate) {
        const daysUntilExpiry = Math.ceil(
          (new Date(license.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        entry.daysUntilExpiry = daysUntilExpiry;
        if (daysUntilExpiry < 0) {
          entry.status = "expired";
          entry.riskLevel = "critical";
        } else if (daysUntilExpiry < 30) {
          entry.riskLevel = "high";
        } else if (daysUntilExpiry < 90) {
          entry.riskLevel = "medium";
        } else {
          entry.riskLevel = "low";
        }
      }
    } else if (req.mandatory) {
      entry.status = "non_compliant";
      entry.riskLevel = "high";
    }

    return entry;
  });

  const compliantCount = licenseCompliance.filter((l) => l.status === "compliant").length;
  const overallCompliance = applicable.length > 0
    ? Math.round((compliantCount / applicable.length) * 100)
    : 0;

  const gaps = licenseCompliance
    .filter((l) => l.status !== "compliant")
    .map((l) => {
      const req = applicable.find((r) => r.id === l.licenseId)!;
      return {
        id: `gap-${l.licenseId}`,
        licenseId: l.licenseId,
        gapDescription: `Belum memiliki ${l.licenseName}`,
        impact: l.riskLevel === "critical" ? "Bisnis tidak bisa beroperasi"
          : l.riskLevel === "high" ? "Risiko penalti dan denda tinggi"
          : "Risiko administratif",
        priority: (l.riskLevel === "critical" || l.riskLevel === "high" ? "high" : "medium") as "high" | "medium" | "low",
        estimatedCost: req.fees.initial,
        estimatedTime: 30,
        responsibleParty: "Management",
      };
    });

  const recommendations = [
    "Segera lengkapi semua izin wajib yang masih kurang",
    "Monitor masa berlaku izin dan siapkan perpanjangan",
    "Persiapkan dokumen pendukung untuk renewal",
    "Konsultasikan dengan konsultan legal untuk compliance",
  ];

  return {
    entityId: entity.id,
    checkDate: new Date().toISOString(),
    overallCompliance,
    licenseCompliance,
    gaps,
    recommendations,
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get("/legal/entity", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const entity = await findEntityForUser(session.userId);
    res.json({ entity: entity ? shapeEntity(entity) : null });
  } catch (err) {
    req.log.error({ err }, "GET /legal/entity error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/legal/entity", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const nameResult = validateText(req.body?.name, 200);
  const npwpResult = validateText(req.body?.npwp, 30);
  const regionResult = validateText(req.body?.region, 100);
  const subSectorResult = validateText(req.body?.subSector, 100);
  const type = req.body?.type;
  const sector = typeof req.body?.sector === "string" ? req.body.sector.trim().toLowerCase() : "";
  const status = req.body?.status === undefined ? "active" : req.body.status;
  const establishmentDate = req.body?.establishmentDate;
  const nib = req.body?.nib;

  if (!nameResult.value || nameResult.tooLong) {
    res.status(400).json({ error: "Nama perusahaan wajib diisi (maksimal 200 karakter)" });
    return;
  }
  if (typeof type !== "string" || !VALID_ENTITY_TYPES.has(type)) {
    res.status(400).json({ error: "Jenis badan usaha tidak valid" });
    return;
  }
  if (!npwpResult.value || npwpResult.tooLong) {
    res.status(400).json({ error: "NPWP wajib diisi (maksimal 30 karakter)" });
    return;
  }
  if (nib !== undefined && nib !== null && nib !== "" && (typeof nib !== "string" || nib.trim().length > 30)) {
    res.status(400).json({ error: "NIB tidak valid" });
    return;
  }
  if (!VALID_SECTORS.has(sector)) {
    res.status(400).json({ error: "Sektor tidak valid" });
    return;
  }
  if (subSectorResult.tooLong) {
    res.status(400).json({ error: "Sub-sektor maksimal 100 karakter" });
    return;
  }
  if (!regionResult.value || regionResult.tooLong) {
    res.status(400).json({ error: "Wilayah wajib diisi (maksimal 100 karakter)" });
    return;
  }
  if (typeof establishmentDate !== "string" || !isValidIsoDate(establishmentDate)) {
    res.status(400).json({ error: "Tanggal pendirian tidak valid" });
    return;
  }
  if (typeof status !== "string" || !VALID_ENTITY_STATUSES.has(status)) {
    res.status(400).json({ error: "Status entitas tidak valid" });
    return;
  }

  try {
    const existing = await findEntityForUser(session.userId);
    const now = new Date();
    const values = {
      name: nameResult.value,
      type,
      npwp: npwpResult.value,
      nib: nib ? String(nib).trim() : null,
      sector,
      subSector: subSectorResult.value ?? "",
      region: regionResult.value,
      establishmentDate,
      status,
      updatedAt: now,
    };

    let entity: typeof legalEntities.$inferSelect;
    if (existing) {
      [entity] = await db
        .update(legalEntities)
        .set(values)
        .where(eq(legalEntities.id, existing.id))
        .returning();
    } else {
      [entity] = await db
        .insert(legalEntities)
        .values({ id: randomUUID(), userId: session.userId, createdAt: now, ...values })
        .returning();
    }

    res.status(existing ? 200 : 201).json({ entity: shapeEntity(entity) });
  } catch (err) {
    req.log.error({ err }, "PUT /legal/entity error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/legal/entity", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const entity = await findEntityForUser(session.userId);
    if (!entity) {
      res.status(404).json({ error: "Belum ada data entitas perusahaan" });
      return;
    }
    // legal_licenses rows cascade-delete via the entityId foreign key.
    await db.delete(legalEntities).where(eq(legalEntities.id, entity.id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "DELETE /legal/entity error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/legal/licenses", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const entity = await findEntityForUser(session.userId);
    if (!entity) {
      res.status(404).json({ error: "Belum ada data entitas perusahaan" });
      return;
    }
    const licenses = await getMergedLicenses(entity);
    res.json({ licenses });
  } catch (err) {
    req.log.error({ err }, "GET /legal/licenses error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/legal/licenses/:requirementId", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requirementId = String(req.params.requirementId ?? "");
  if (!LICENSE_REQUIREMENT_IDS.has(requirementId)) {
    res.status(400).json({ error: "Jenis izin tidak dikenal" });
    return;
  }

  const status = req.body?.status;
  if (typeof status !== "string" || !VALID_LICENSE_STATUSES.has(status)) {
    res.status(400).json({ error: "Status izin tidak valid" });
    return;
  }
  const applicationDate = optionalDate(req.body?.applicationDate);
  const approvalDate = optionalDate(req.body?.approvalDate);
  const expiryDate = optionalDate(req.body?.expiryDate);
  if (!applicationDate.ok || !approvalDate.ok || !expiryDate.ok) {
    res.status(400).json({ error: "Format tanggal tidak valid (gunakan YYYY-MM-DD)" });
    return;
  }
  const licenseNumberResult = validateText(req.body?.licenseNumber, 100);
  const notesResult = validateText(req.body?.notes, 1000);
  if (licenseNumberResult.tooLong) {
    res.status(400).json({ error: "Nomor izin maksimal 100 karakter" });
    return;
  }
  if (notesResult.tooLong) {
    res.status(400).json({ error: "Catatan maksimal 1.000 karakter" });
    return;
  }

  try {
    const entity = await findEntityForUser(session.userId);
    if (!entity) {
      res.status(404).json({ error: "Belum ada data entitas perusahaan" });
      return;
    }

    const [existing] = await db
      .select()
      .from(legalLicenses)
      .where(and(eq(legalLicenses.entityId, entity.id), eq(legalLicenses.licenseRequirementId, requirementId)));

    const now = new Date();
    const values = {
      status,
      applicationDate: applicationDate.value,
      approvalDate: approvalDate.value,
      expiryDate: expiryDate.value,
      licenseNumber: licenseNumberResult.value || null,
      notes: notesResult.value ?? "",
      updatedAt: now,
    };

    let row: typeof legalLicenses.$inferSelect;
    if (existing) {
      [row] = await db
        .update(legalLicenses)
        .set(values)
        .where(eq(legalLicenses.id, existing.id))
        .returning();
    } else {
      [row] = await db
        .insert(legalLicenses)
        .values({
          id: randomUUID(),
          entityId: entity.id,
          licenseRequirementId: requirementId,
          createdAt: now,
          ...values,
        })
        .returning();
    }

    res.status(existing ? 200 : 201).json({ license: shapeLicense(entity.id, requirementId, row) });
  } catch (err) {
    req.log.error({ err }, "PUT /legal/licenses/:requirementId error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/legal/licenses/:requirementId", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requirementId = String(req.params.requirementId ?? "");
  if (!LICENSE_REQUIREMENT_IDS.has(requirementId)) {
    res.status(400).json({ error: "Jenis izin tidak dikenal" });
    return;
  }

  try {
    const entity = await findEntityForUser(session.userId);
    if (!entity) {
      res.status(404).json({ error: "Belum ada data entitas perusahaan" });
      return;
    }

    const [existing] = await db
      .select()
      .from(legalLicenses)
      .where(and(eq(legalLicenses.entityId, entity.id), eq(legalLicenses.licenseRequirementId, requirementId)));

    if (!existing) {
      res.status(404).json({ error: "Belum ada data izin untuk jenis ini" });
      return;
    }

    await db.delete(legalLicenses).where(eq(legalLicenses.id, existing.id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "DELETE /legal/licenses/:requirementId error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/legal/compliance", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const entity = await findEntityForUser(session.userId);
    if (!entity) {
      res.status(404).json({ error: "Belum ada data entitas perusahaan" });
      return;
    }
    const licenses = await getMergedLicenses(entity);
    const complianceCheck = computeCompliance(entity, licenses);
    const requirements = getApplicableRequirements(entity.sector);
    res.json({ complianceCheck, requirements, licenses });
  } catch (err) {
    req.log.error({ err }, "GET /legal/compliance error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
