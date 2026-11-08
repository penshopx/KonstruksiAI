/**
 * Opt-in live verification; uses the running development API and real provider
 * credits. Never register as an automatic gate. Creates a synthetic test user.
 * Run: pnpm --filter @workspace/konstruksi-ai exec tsx scripts/check-tender-live.ts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright-core";

const baseUrl = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const pageErrors: string[] = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  const anonymous = await context.request.post(`${baseUrl}/api/tender-intelligence/analyze`, {
    data: {},
  });
  assert.equal(anonymous.status(), 401);
  const registration = await context.request.post(`${baseUrl}/api/auth/register`, {
    data: {
      name: "Tender Verification",
      email: `tender-verification-${randomUUID()}@example.test`,
      password: randomUUID(),
    },
  });
  assert.equal(registration.status(), 200, "Synthetic user registration must succeed");
  const invalid = await context.request.post(`${baseUrl}/api/tender-intelligence/analyze`, {
    data: { projectName: "Verifikasi Tender", documents: [] },
  });
  assert.equal(invalid.status(), 400);

  await page.goto(`${baseUrl}/tender-intelligence`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Belum ada analisis" }).waitFor();
  await page.getByRole("button", { name: "⚠️ Risiko", exact: true }).click();
  await page.getByRole("heading", { name: "Belum ada analisis" }).waitFor();
  await page.getByRole("button", { name: "Buka Tab Kelengkapan" }).click();
  await page.getByLabel("Nama Proyek", { exact: true }).fill("Rehabilitasi Jembatan Sungai Citarum");
  await page.getByLabel("Jenis Tender", { exact: true }).fill("Tender Konstruksi Pemerintah");

  const notes = [
    "Akta dan perubahan terakhir lengkap, masih berlaku.",
    "NPWP aktif, identitas badan usaha sesuai.",
    "",
    "SBU kedaluwarsa dan belum sesuai bidang jembatan; baru mencakup gedung.",
    "",
    "",
    "Sertifikat kedaluwarsa, perpanjangan belum diajukan.",
    "Pengalaman hanya gedung, belum memiliki pengalaman jembatan.",
  ];
  const present = [true, true, false, true, false, false, true, true];
  const noteInputs = page.getByPlaceholder("Catatan (opsional): mis. masa berlaku, kesesuaian bidang, kendala...");
  assert.equal(await noteInputs.count(), 8);
  for (let index = 0; index < notes.length; index += 1) {
    await noteInputs.nth(index).fill(notes[index]);
    await page.getByRole("checkbox", { name: "Sudah tersedia", exact: true }).nth(index).setChecked(present[index]);
  }
  await page.locator("textarea").fill(
    "Rehabilitasi jembatan Sungai Citarum di Bandung, nilai Rp18 miliar, " +
    "durasi 90 hari pada musim hujan. Batas pemasukan penawaran 7 hari lagi. " +
    "Memerlukan SBU bidang jembatan, pengalaman jembatan, dan rencana K3 pekerjaan di atas sungai.",
  );
  const responsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/api/tender-intelligence/analyze")
      && response.request().method() === "POST",
    { timeout: 300_000 },
  );
  await page.getByRole("button", { name: "🚀 Jalankan Analisis AI", exact: true }).click();
  const response = await responsePromise;
  const submitted = response.request().postDataJSON();
  assert.deepEqual(submitted.documents.map((doc: { present: boolean }) => doc.present), present);
  assert.deepEqual(submitted.documents.map((doc: { notes: string }) => doc.notes), notes);
  const result = await response.json();
  if (!response.ok()) {
    assert.ok(
      ["AI_PROVIDER_NOT_CONFIGURED", "AI_PROVIDER_AUTHENTICATION_FAILED", "AI_PROVIDER_CREDITS_EXHAUSTED",
        "AI_PROVIDER_RATE_LIMITED", "AI_INVALID_MODEL_RESPONSE", "AI_PROVIDER_REQUEST_REJECTED",
        "AI_PROVIDER_UNAVAILABLE", "AI_INTERNAL_ERROR"]
        .includes(result.code),
      "Analysis failures must have a safe, documented category",
    );
    assert.equal(typeof result.error, "string");
    assert.equal(typeof result.action, "string");
    assert.doesNotMatch(
      result.error,
      /OPENROUTER_API_KEY|openrouter\.ai|invalid_api_key|insufficient_quota|sk-[\w-]+/i,
    );
    await page.getByTestId("status-tender-analysis-error").getByText(result.error, { exact: true }).waitFor();
    await page.getByTestId("status-tender-analysis-error").getByText(result.action, { exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Tender Intelligence Dashboard" }).count(), 0);
    await page.getByRole("button", { name: /Ulangi & Catat Pengulangan/ }).waitFor();
    await page.getByRole("button", { name: "📊 Overview", exact: true }).click();
    await page.getByRole("heading", { name: "Belum ada analisis" }).waitFor();
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({
      status: "BLOCKED",
      httpStatus: response.status(),
      error: result.error,
      passed: ["401 unauthenticated", "400 empty documents", "Overview/Risiko empty states",
        "actual browser input payload", "categorized safe error guidance", "retry button",
        "no fabricated results", "no browser crashes"],
    }, null, 2));
    process.exitCode = 2;
  } else {
    assert.equal(result.completenessChecks.length, 8);
    for (let index = 0; index < 8; index += 1) {
      const check = result.completenessChecks[index];
      assert.equal(check.documentType, submitted.documents[index].documentType);
      assert.equal(check.present, present[index]);
      if (!present[index]) assert.equal(check.completenessScore, 0);
      if (index <= 1) assert.ok(check.completenessScore >= 85, "Clean documents should score high");
      if ([3, 6, 7].includes(index)) {
        assert.ok(check.completenessScore < 50, "Problematic documents should score low");
        assert.ok(check.missingElements.length > 0);
      }
    }
    assert.ok(result.risks.length > 0);
    assert.match(JSON.stringify(result.risks), /jembatan|Citarum|sungai|hujan/i);
    assert.ok(result.recommendations.length > 0);
    await page.getByRole("heading", { name: "Tender Intelligence Dashboard" }).waitFor();
    for (const [key, text] of Object.entries(result.summary)) {
      assert.equal(
        (await page.getByTestId(`tender-summary-${key}`).locator("p").innerText()).trim(),
        String(text).trim(),
      );
    }
    const overview = await page.locator("body").innerText();
    assert.ok(overview.includes(`${result.overallCompleteness}%`));
    assert.ok(overview.includes(`${result.complianceScore}/100`));
    for (const recommendation of result.recommendations) assert.ok(overview.includes(recommendation));
    await page.getByRole("button", { name: "⚠️ Risiko", exact: true }).click();
    for (const risk of result.risks) {
      await page.getByRole("heading", { name: risk.description, exact: true }).waitFor();
      const text = await page.locator("body").innerText();
      assert.ok(text.includes(risk.impact));
      for (const mitigation of risk.mitigation) assert.ok(text.includes(mitigation));
    }
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({
      status: "PASSED",
      httpStatus: response.status(),
      checks: result.completenessChecks,
      overallCompleteness: result.overallCompleteness,
      complianceScore: result.complianceScore,
      risks: result.risks,
      summary: result.summary,
      passed: ["real AI input sensitivity", "Overview summary and scores", "Risiko content and mitigation",
        "empty states", "auth and validation", "no browser crashes"],
    }, null, 2));
  }
} finally {
  await browser.close();
}
