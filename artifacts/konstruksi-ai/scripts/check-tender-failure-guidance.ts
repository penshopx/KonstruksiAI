/**
 * Offline regression: every API request is intercepted, including analysis.
 * No account creation, database writes, or real provider requests.
 */
import assert from "node:assert/strict";
import { chromium, type Locator, type Page } from "playwright-core";

async function assertReachable(locator: Locator, label: string) {
  await locator.scrollIntoViewIfNeeded();
  // A normal click (never force) must also pass Playwright's obstruction check.
  await locator.click({ trial: true });
  const reachable = await locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return rect.left >= 0 && rect.right <= document.documentElement.clientWidth
      && rect.top >= 0 && rect.bottom <= window.innerHeight
      && Boolean(target && (target === element || element.contains(target)));
  });
  assert.equal(reachable, true, `${label}: fully in viewport and not covered`);
}

async function assertMobileGuidance(page: Page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    overflowing: Array.from(document.querySelectorAll("body *"))
      .filter(element => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(-8).map(element => ({ tag: element.tagName, text: element.textContent?.slice(0, 80) })),
  }));
  assert.ok(overflow.document <= overflow.viewport + 1 && overflow.body <= overflow.viewport + 1,
    `No horizontal page overflow: ${JSON.stringify(overflow)}`);
  for (const testId of ["text-tender-failure-reason", "text-tender-failure-action"]) {
    const text = page.getByTestId(testId);
    await text.scrollIntoViewIfNeeded();
    const layout = await text.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      const lines = Array.from(range.getClientRects());
      const style = getComputedStyle(element);
      return {
        wrapped: lines.length > 1,
        fits: element.scrollWidth <= element.clientWidth + 1
          && element.scrollHeight <= element.clientHeight + 1
          && rect.left >= 0 && rect.right <= document.documentElement.clientWidth
          && lines.every(line => line.left >= rect.left - 1 && line.right <= rect.right + 1
            && line.top >= rect.top - 1 && line.bottom <= rect.bottom + 1),
        unclamped: style.getPropertyValue("-webkit-line-clamp") === "none"
          && style.textOverflow !== "ellipsis",
      };
    });
    assert.equal(layout.wrapped, true, `${testId}: long text must wrap`);
    assert.equal(layout.fits && layout.unclamped, true, `${testId}: all text readable, not clipped`);
    await assertReachable(text, testId);
  }
  await assertReachable(page.getByRole("button", { name: "Periksa status", exact: true }), "Periksa status");
  await assertReachable(page.getByTestId("button-new-tender-analysis"), "Analisis baru setelah perbaikan");
}

const base = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  headless: true,
});
try {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 360, height: 740 },
  ]) {
  const mobile = viewport.width < 600;
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, serviceWorkers: "block" });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  let outcome: "success" | "failure" = "success";
  let failure: { status: number; code: string; error: string; action: string; retryable: boolean };
  let analysisRequests = 0;
  let statusRequests = 0;
  let submitted: { projectName: string; tenderType: string; projectDetails: string; documents: { notes: string }[] };
  let releaseFailure: (() => void) | undefined;
  let pendingFailure: Promise<void>;
  let recoveryState = "empty";
  let savedResult: Record<string, unknown>;
  const marker = "HASIL_LAMA_TIDAK_BOLEH_TAMPIL";
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    if (!pathname.startsWith("/api/")) {
      if (url.origin !== new URL(base).origin) return route.abort("blockedbyclient");
      return route.continue();
    }
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
      statusRequests++;
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
  const cases = mobile ? [
    {
      status: 502, code: "AI_PROVIDER_AUTHENTICATION_FAILED", retryable: false,
      error: "Provider AI menolak autentikasi aplikasi sehingga dokumen administrasi, persyaratan teknis, dan rincian keuangan proyek belum dapat diperiksa. Hasil analisis sebelumnya tidak boleh digunakan untuk mengambil keputusan pada pengajuan Tender ini.",
      action: "Minta administrator memeriksa kredensial, izin akses, status akun, serta konfigurasi layanan provider AI yang digunakan oleh aplikasi. Setelah administrator memastikan perbaikan selesai, periksa status permintaan terlebih dahulu sebelum memulai analisis baru agar dokumen tidak dikirim berulang kali.",
    },
  ] : [
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
    const beforeStatus = statusRequests;
    if (mobile) await assertMobileGuidance(page);
    const recovered = page.waitForResponse(response =>
      new URL(response.url()).pathname.startsWith("/api/tender-intelligence/requests/")
      && !response.url().includes("/requests/active") && response.status() === 409);
    await page.getByRole("button", { name: "Periksa status", exact: true }).click();
    await recovered;
    assert.equal(statusRequests, beforeStatus + 1, "Status control must actually request recovery");
    await newAnalysis.waitFor({ state: "visible" });
    await page.waitForFunction(() => !(document.querySelector('[data-testid="button-new-tender-analysis"]') as HTMLButtonElement)?.disabled);
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
      const tabButton = page.getByRole("button", { name: tab, exact: true });
      if (mobile) await assertReachable(tabButton, tab);
      await tabButton.click();
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
      if (mobile) await assertMobileGuidance(page);
    }
    if (mobile) {
      await newAnalysis.click();
      await guidance.waitFor({ state: "hidden" });
      assert.equal(await page.getByTestId("button-analyze-tender").isEnabled(), true,
        "New analysis control opens an editable form");
      assert.equal(await page.getByTestId("input-tender-project-name").inputValue(), "Proyek Uji Panduan");
      assert.equal(analysisRequests, beforeRecovery, "Starting a new draft must not dispatch AI");
    }
  }
  assert.equal(analysisRequests, cases.length * 2, "Rendering guidance must not automatically resubmit");
  assert.deepEqual(pageErrors, []);
  console.log(`PASS ${viewport.width}x${viewport.height}: ${cases.length} failures, shared guidance across all tabs, preserved input, no AI resubmission.${mobile ? " Long text wraps without horizontal overflow; recovery, new draft and tabs are reachable and unobstructed." : ""} All API calls mocked.`);
  await context.close();
  }
} finally {
  await browser.close();
}
