/** Offline browser regression: every API request is intercepted. */
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE, headless: true,
});
try {
  const context = await browser.newContext();
  let userId = 119;
  let calls = 0;
  let currentId = "";
  let state: "running" | "succeeded" | "failed" = "running";
  const errors: string[] = [];
  const result = {
    id: "offline-result", executionId: "offline-execution", workspaceId: null,
    projectName: "Proyek Pulih Offline", tenderType: "Tender Konstruksi", projectDetails: "Input tersimpan",
    documents: [{ documentType: "NPWP", required: true, present: true, notes: "Catatan tersimpan" }],
    checklistState: {}, completenessChecks: [], overallCompleteness: 95, complianceScore: 95,
    risks: [], recommendations: ["HASIL_PULIH_OFFLINE"], summary: {},
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  await context.route("**/api/**", async route => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === "/api/auth/me") return route.fulfill({ json: {
      user: { userId, name: "Offline", email: "offline@example.test", role: "user" },
    } });
    if (pathname === "/api/tender-intelligence/analyze") {
      calls++;
      const data = route.request().postDataJSON();
      assert.match(data.requestId, /^[a-f0-9-]{36}$/);
      currentId = data.requestId;
      // Simulate a response lost after the server accepted the request.
      return route.abort("connectionreset");
    }
    if (pathname === "/api/tender-intelligence/requests/active") {
      return route.fulfill({ json: { activeRequest: userId === 119 && currentId && state === "running"
        ? { executionId: "offline-execution" } : null } });
    }
    if (pathname.startsWith("/api/tender-intelligence/requests/")) {
      assert.ok([currentId, "offline-execution"].includes(pathname.split("/").at(-1) ?? ""));
      if (userId !== 119) return route.fulfill({ status: 404, json: { error: "Tidak ditemukan" } });
      if (state === "running") return route.fulfill({ status: 202, json: {
        status: "running", executionId: "offline-execution",
      } });
      if (state === "failed") return route.fulfill({ status: 409, json: {
        status: "failed", executionId: "offline-execution", error: "Proses terhenti setelah restart.",
      } });
      return route.fulfill({ json: { status: "succeeded", executionId: "offline-execution", result } });
    }
    return route.fulfill({ status: 401, json: { error: "Offline test: unexpected API denied" } });
  });
  const base = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("dialog", dialog => dialog.accept());
  await page.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
  const completeness = () => page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
  await completeness();
  await page.getByTestId("input-tender-project-name").fill("Proyek Koneksi Terputus");
  await page.getByTestId("button-analyze-tender").click();
  await page.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).waitFor();
  await page.getByTestId("status-tender-analysis-error").getByText(
    "Koneksi terputus saat mengirim atau membaca respons analisis.", { exact: true },
  ).waitFor();
  assert.doesNotMatch(await page.locator("body").innerText(), /Failed to fetch|TypeError|SyntaxError|Unexpected token/);
  assert.equal(await page.getByTestId("input-tender-project-name").inputValue(), "Proyek Koneksi Terputus");
  await page.getByRole("button", { name: "📊 Overview", exact: true }).click();
  assert.equal(await page.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).isVisible(), true);
  await completeness();
  assert.equal(calls, 1);
  const raw = await page.evaluate(() => localStorage.getItem("tender-request:119:personal"));
  assert.ok(raw?.includes("offline-execution"));
  assert.ok(!raw?.includes("documents"), "No input text is stored for recovery");
  await page.reload({ waitUntil: "networkidle" });
  await completeness();
  await page.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).waitFor();
  assert.equal(calls, 1, "refresh never POSTs");
  assert.equal(await page.getByTestId("button-new-tender-analysis").isDisabled(), true);
  // A fresh browser context models a second device: no localStorage identity.
  const secondContext = await browser.newContext();
  let secondPosts = 0;
  let offline = false;
  let revoked = false;
  await secondContext.route("**/api/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/auth/me") return route.fulfill({ json: {
      user: { userId: 119, name: "Second device", email: "second@example.test", role: "user" },
    } });
    if (route.request().method() === "POST") {
      secondPosts++;
      return route.abort("blockedbyclient");
    }
    if (path.startsWith("/api/tender-intelligence/requests/")) {
      if (offline) return route.abort("internetdisconnected");
      if (revoked) return route.fulfill({ status: 403, json: { error: "Akses ruang proyek telah dicabut" } });
      if (path.endsWith("/active")) return route.fulfill({ json: {
        activeRequest: state === "running" ? { executionId: "offline-execution" } : null,
      } });
      assert.ok(path.endsWith("/executions/offline-execution"));
      if (state === "running") return route.fulfill({ status: 202, json: { status: "running", executionId: "offline-execution" } });
      return route.fulfill({ json: { status: "succeeded", executionId: "offline-execution", result } });
    }
    return route.fulfill({ status: 401, json: { error: "Unexpected API denied" } });
  });
  const second = await secondContext.newPage();
  second.on("pageerror", error => errors.push(error.message));
  await second.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
  await second.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).waitFor();
  assert.equal(secondPosts, 0, "new device discovers active run without POST");
  offline = true;
  await second.getByRole("button", { name: "Periksa status", exact: true }).click();
  await second.getByTestId("status-tender-recovery").getByText(/Koneksi terputus/).waitFor();
  assert.equal(secondPosts, 0);
  offline = false;
  await second.reload({ waitUntil: "networkidle" });
  await second.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).waitFor();
  state = "succeeded";
  await second.getByRole("button", { name: "Periksa status", exact: true }).click();
  await second.getByText("HASIL_PULIH_OFFLINE", { exact: true }).waitFor();
  assert.equal(secondPosts, 0, "completion is recovered from execution reference without POST");
  revoked = true;
  await second.getByRole("button", { name: "Periksa status", exact: true }).click();
  await second.getByTestId("status-tender-recovery").getByText(/Akses ruang proyek telah dicabut/).waitFor();
  assert.equal(await second.getByText("HASIL_PULIH_OFFLINE", { exact: true }).count(), 0);
  assert.equal(secondPosts, 0);
  await secondContext.close();
  await page.getByRole("button", { name: "Periksa status", exact: true }).click();
  await page.getByRole("heading", { name: "Tender Intelligence Dashboard", exact: true }).waitFor();
  assert.ok((await page.locator("body").innerText()).includes("HASIL_PULIH_OFFLINE"));
  await completeness();
  assert.equal(await page.getByTestId("input-tender-project-name").inputValue(), result.projectName);
  await page.getByTestId("input-tender-project-name").fill("Input diubah");
  await page.getByTestId("button-analyze-tender").click();
  await page.getByRole("heading", { name: "Tender Intelligence Dashboard", exact: true }).waitFor();
  assert.equal(calls, 1, "changed input cannot silently start a new run");
  await completeness();
  await page.getByTestId("button-new-tender-analysis").click();
  state = "running";
  await page.getByTestId("button-analyze-tender").click();
  await page.getByTestId("status-tender-recovery").getByText(/Analisis masih berjalan/).waitFor();
  assert.equal(calls, 2, "explicit new action permits another POST");
  state = "failed";
  await page.getByRole("button", { name: "Periksa status", exact: true }).click();
  await page.getByTestId("status-tender-recovery").getByText(/Proses terhenti setelah restart\./).waitFor();
  assert.equal(calls, 2, "A confirmed failure after response loss must not dispatch another analysis");
  await page.reload({ waitUntil: "networkidle" });
  await completeness();
  await page.getByTestId("status-tender-recovery").getByText(/Proses terhenti/).waitFor();
  await page.getByTestId("button-analyze-tender").click();
  assert.equal(calls, 2, "failed request is not automatically rerun");
  userId = 120;
  await page.getByRole("button", { name: "Periksa status", exact: true }).click();
  await page.getByTestId("button-new-tender-analysis").waitFor({ state: "hidden" });
  await page.getByTestId("status-tender-recovery").getByText(/Proses terhenti/).waitFor({ state: "hidden" });
  assert.equal(await page.getByTestId("button-new-tender-analysis").count(), 0, "other account has no recovery identity");
  assert.equal(calls, 2);
  assert.deepEqual(errors, []);
  console.log("PASS: offline response loss, refresh, saved result, changed input, explicit new run, failed restart and account isolation.");
  await context.close();
} finally {
  await browser.close();
}
