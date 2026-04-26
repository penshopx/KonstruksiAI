import { Router } from "express";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

function generateAssessmentResult(type: string, _data: unknown) {
  if (type === "sbu-readiness") {
    return {
      score: 72,
      status: "partial",
      recommendations: [
        "Lengkapi dokumen SBU yang expired",
        "Update data tenaga ahli bersertifikat",
        "Pastikan peralatan terdaftar dengan benar",
      ],
      details: "Perusahaan Anda memiliki kesiapan 72% untuk SBU. Diperlukan beberapa perbaikan dokumen.",
    };
  }
  if (type === "skk-readiness") {
    return {
      score: 85,
      status: "ready",
      recommendations: [
        "Siapkan portofolio proyek 5 tahun terakhir",
        "Ikuti pelatihan refresher sebelum asesmen",
      ],
      details: "Anda memiliki kesiapan 85% untuk SKK. Persiapkan portofolio lengkap.",
    };
  }
  if (type === "tender-eligibility") {
    return {
      eligible: true,
      score: 90,
      recommendations: [
        "Pastikan SBU masih berlaku saat pemasukan dokumen",
        "Siapkan referensi proyek sejenis",
      ],
      details: "Perusahaan Anda memenuhi syarat untuk mengikuti tender ini.",
    };
  }
  return { score: 0, status: "unknown", recommendations: [], details: "Assessment type tidak dikenali" };
}

router.post("/sbu-readiness/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const result = generateAssessmentResult("sbu-readiness", req.body);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /sbu-readiness/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/skk-readiness/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const result = generateAssessmentResult("skk-readiness", req.body);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /skk-readiness/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tender-eligibility/assess", async (req, res) => {
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const result = generateAssessmentResult("tender-eligibility", req.body);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "POST /tender-eligibility/assess error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
