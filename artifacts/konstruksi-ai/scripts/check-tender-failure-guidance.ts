/**
 * Offline regression: every API request is intercepted, including analysis.
 * No account creation, database writes, or real provider requests.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  headless: true,
});
try {
  const page = await browser.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  let outcome: "success" | "failure" = "success";
  let failure: { status: number; code: string; error: string; action: string; retryable: boolean };
  let analysisRequests = 0;
  let submitted: { projectName: string; tenderType: string; projectDetails: string; documents: { notes: string }[] };
  let releaseFailure: (() => void) | undefined;
  let pendingFailure: Promise<void>;
  let recoveryState = "empty";
  let savedResult: Record<string, unknown>;
  const marker = "HASIL_LAMA_TIDAK_BOLEH_TAMPIL";
  await page.route("**/api/**", async route => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === "/api/tender-intelligence/analyze") {
      analysisRequests++;
      submitted = route.request().postDataJSON();
      if (outcome === "failure") {
        recoveryState = "running";
        await pendingFailure;
        recoveryState = "failed";
        return route.fulfill({
          status: failure.status, json: {
            code: failure.code, error: failure.error, action: failure.action,
            retryable: failure.retryable, executionId: "synthetic-failed-execution",
          },
        });
      }
      recoveryState = "succeeded";
      savedResult = {
        id: "synthetic-result", executionId: "synthetic-success", workspaceId: null,
        projectName: submitted!.projectName, tenderType: submitted!.tenderType, projectDetails: submitted!.projectDetails,
        documents: submitted!.documents, checklistState: {},
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        resultRef: "synthetic-result",
        completenessChecks: [], overallCompleteness: 95, complianceScore: 95,
        risks: [{ id: "old-risk", category: "technical", description: marker, severity: "low", likelihood: "low", mitigation: ["Periksa"], impact: marker }],
        recommendations: [marker],
        summary: { administrativeRequirements: marker, technicalRequirements: marker, financialRequirements: marker, keyRisks: marker, nextSteps: marker },
      };
      return route.fulfill({ json: { ...savedResult, result: savedResult } });
    }
    if (pathname === "/api/tender-intelligence/requests/active") {
      return route.fulfill({ json: { activeRequest: recoveryState === "running"
        ? { executionId: "synthetic-failed-execution" } : null } });
    }
    if (pathname.startsWith("/api/tender-intelligence/requests/")) {
      if (recoveryState === "running") return route.fulfill({ status: 202, json: { status: "running" } });
      if (recoveryState === "failed") return route.fulfill({ status: 409, json: { status: "failed", executionId: "synthetic-failed-execution", error: failure!.error } });
      if (recoveryState === "succeeded") return route.fulfill({ json: { status: "succeeded", result: savedResult } });
      return route.fulfill({ status: 404, json: { error: "Belum dikirim." } });
    }
    // Fail closed: never let API requests escape into real accounts or providers.
    if (pathname === "/api/auth/me") return route.fulfill({ json: { user: { userId: 119, name: "Offline", email: "offline@example.test", role: "user" } } });
    return route.fulfill({ status: 401, json: { error: "Sesi uji anonim." } });
  });
  await page.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
  page.on("dialog", dialog => dialog.accept());
  const cases = [
    { status: 503, code: "AI_PROVIDER_NOT_CONFIGURED", error: "Kredensial layanan AI belum tersedia.", action: "Minta administrator memeriksa konfigurasi layanan AI.", retryable: false },
    { status: 502, code: "AI_PROVIDER_AUTHENTICATION_FAILED", error: "Provider AI menolak autentikasi aplikasi.", action: "Minta administrator memeriksa kredensial dan akses provider AI; mencoba ulang saja tidak akan memperbaikinya.", retryable: false },
    { status: 402, code: "AI_PROVIDER_CREDITS_EXHAUSTED", error: "Kredit atau kuota provider AI tidak mencukupi.", action: "Minta administrator memeriksa saldo, billing, atau batas penggunaan provider AI.", retryable: false },
    { status: 503, code: "AI_PROVIDER_UNAVAILABLE", error: "Layanan provider AI sedang tidak tersedia atau koneksinya terputus.", action: "Tunggu beberapa saat, lalu coba kembali.", retryable: true },
    { status: 502, code: "AI_INVALID_MODEL_RESPONSE", error: "Respons model AI kosong atau tidak sesuai format analisis yang dibutuhkan.", action: "Coba jalankan analisis kembali. Jika terus terjadi, informasikan tim teknis.", retryable: true },
  ];
  for (const [index, scenario] of cases.entries()) {
    await page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
    if (await page.getByTestId("button-new-tender-analysis").count()) {
      await page.getByTestId("button-new-tender-analysis").click();
    }
    outcome = "success";
    await page.getByTestId("input-tender-project-name").fill("Proyek Uji Panduan");
    await page.getByTestId("input-tender-type").fill("Tender EPC Uji");
    await page.getByPlaceholder("Lingkup pekerjaan, nilai kontrak, tenggat waktu, instansi/klien, atau kendala khusus yang perlu dipertimbangkan...").fill("Detail proyek tetap tersimpan");
    await page.getByPlaceholder("Catatan (opsional): mis. masa berlaku, kesesuaian bidang, kendala...").first().fill("Catatan tetap tersimpan");
    await page.getByTestId("button-analyze-tender").click();
    await page.getByRole("heading", { name: "Tender Intelligence Dashboard", exact: true }).waitFor();
    assert.ok((await page.locator("body").innerText()).includes(marker), "Seed a visible old analysis before each failed rerun");
    outcome = "failure";
    failure = scenario;
    pendingFailure = new Promise(resolve => { releaseFailure = resolve; });
    await page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
    await page.getByTestId("button-new-tender-analysis").click();
    await page.getByTestId("button-analyze-tender").click();
    await page.waitForFunction(() => (document.querySelector('[data-testid="button-analyze-tender"]') as HTMLButtonElement)?.disabled);
    // Clear stale analysis at request start, not only after the failure response.
    const pendingTab = index % 2 === 0 ? "📊 Overview" : "⚠️ Risiko";
    await page.getByRole("button", { name: pendingTab, exact: true }).click();
    await page.getByRole("heading", { name: "Belum ada analisis", exact: true }).waitFor();
    assert.ok(!(await page.locator("body").innerText()).includes(marker));
    releaseFailure!();
    const guidance = page.getByTestId("status-tender-analysis-error");
    await guidance.getByText(scenario.error, { exact: true }).waitFor();
    await guidance.getByText(scenario.action, { exact: true }).waitFor();
    assert.equal(await guidance.isVisible(), true, `Guidance must appear while still on ${pendingTab}`);
    assert.equal(await page.getByTestId("button-analyze-tender").count(), 0, "Failure must not force a tab change");
    const newAnalysis = page.getByTestId("button-new-tender-analysis");
    await page.waitForFunction(() => !(document.querySelector('[data-testid="button-new-tender-analysis"]') as HTMLButtonElement)?.disabled);
    assert.equal(await newAnalysis.innerText(), scenario.retryable ? "Analisis baru" : "Analisis baru setelah perbaikan");
    const beforeRecovery = analysisRequests;
    await page.getByRole("button", { name: "Periksa status", exact: true }).click();
    assert.equal(analysisRequests, beforeRecovery, "Status recovery must not dispatch AI again");
    await page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
    assert.equal(await page.getByTestId("button-analyze-tender").isEnabled(), true);
    assert.match(
      await page.getByTestId("button-analyze-tender").innerText(),
      /Pulihkan permintaan yang sama/,
      "Failures must recover the same request, not encourage blind paid retries",
    );
    assert.equal(await page.getByTestId("input-tender-project-name").inputValue(), "Proyek Uji Panduan");
    assert.equal(await page.getByTestId("input-tender-type").inputValue(), "Tender EPC Uji");
    assert.equal(await page.getByPlaceholder("Lingkup pekerjaan, nilai kontrak, tenggat waktu, instansi/klien, atau kendala khusus yang perlu dipertimbangkan...").inputValue(), "Detail proyek tetap tersimpan");
    assert.equal(await page.getByPlaceholder("Catatan (opsional): mis. masa berlaku, kesesuaian bidang, kendala...").first().inputValue(), "Catatan tetap tersimpan");
    assert.equal(submitted!.projectName, "Proyek Uji Panduan");
    assert.equal(submitted!.documents[0].notes, "Catatan tetap tersimpan");
    for (const tab of ["📊 Overview", "⚠️ Risiko", "📋 Persyaratan", "📝 Checklist", "✅ Kelengkapan"]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      if (tab === "📊 Overview" || tab === "⚠️ Risiko") {
        await page.getByRole("heading", { name: "Belum ada analisis", exact: true }).waitFor();
      }
      assert.equal(await guidance.count(), 1, "Exactly one failure alert across tabs");
      assert.equal(await guidance.isVisible(), true);
      assert.equal(await page.getByTestId("text-tender-failure-reason").innerText(), scenario.error);
      assert.equal(await page.getByTestId("text-tender-failure-action").innerText(), scenario.action);
      assert.equal(await page.getByTestId("status-tender-recovery").count(), 1);
      assert.equal(await newAnalysis.innerText(), scenario.retryable ? "Analisis baru" : "Analisis baru setelah perbaikan");
      assert.equal(await page.getByRole("heading", { name: "Tender Intelligence Dashboard", exact: true }).count(), 0);
      assert.ok(!(await page.locator("body").innerText()).includes(marker));
    }
  }
  assert.equal(analysisRequests, cases.length * 2, "Rendering guidance must not automatically resubmit");
  assert.deepEqual(pageErrors, []);
  console.log(`PASS: ${cases.length} categorized failures after successful analyses; switch to Overview/Risiko before failure, single shared guidance across all tabs, distinct recovery labels, preserved input, no AI resubmission. All API calls mocked.`);
} finally {
  await browser.close();
}
