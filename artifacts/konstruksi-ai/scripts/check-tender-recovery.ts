/** Offline browser regression: every API request is intercepted. */
import assert from "node:assert/strict";
import { chromium, type Browser } from "playwright-core";

const base = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
const storageKey = "tender-request:119:personal";
const storageCases = [
  "write-denied", "read-denied", "write-dropped", "read-after-write-denied",
  "invalid-json", "invalid-shape", "invalid-id", "invalid-digest", "null-reference",
  "begin-corrupt", "account-network", "account-server", "discovery-network", "extra-properties",
] as const;

async function checkStorageFailures(browser: Browser) {
  for (const scenario of storageCases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    let posts = 0;
    let accountFailure = false;
    await context.addInitScript({ content: `
      (() => {
        const scenario = ${JSON.stringify(scenario)};
        const key = ${JSON.stringify(storageKey)};
        const get = Storage.prototype.getItem;
        const set = Storage.prototype.setItem;
        let wrote = false;
        const broken = {
          "invalid-json": "{",
          "invalid-shape": JSON.stringify({id: "valid-request-id-123", fingerprint: null}),
          "invalid-id": JSON.stringify({id: "", fingerprint: "a".repeat(64)}),
          "invalid-digest": JSON.stringify({id: "valid-request-id-123", fingerprint: "project text"}),
          "null-reference": "null"
        }[scenario];
        if (broken !== undefined) set.call(localStorage, key, broken);
        Storage.prototype.getItem = function(k) {
          if (k === key && (scenario === "read-denied" ||
            (scenario === "read-after-write-denied" && wrote))) throw new DOMException("Read denied", "SecurityError");
          return get.call(this, k);
        };
        Storage.prototype.setItem = function(k, value) {
          if (k === key) {
            if (scenario === "write-denied") throw new DOMException("Full", "QuotaExceededError");
            if (scenario === "write-dropped") return;
            wrote = true;
          }
          return set.call(this, k, value);
        };
      })();
    ` });
    await context.route("**/api/**", async route => {
      const path = new URL(route.request().url()).pathname;
      if (path === "/api/auth/me") {
        if (accountFailure) {
          if (scenario === "account-network") return route.abort("internetdisconnected");
          return route.fulfill({ status: 503, json: { error: "Unavailable" } });
        }
        return route.fulfill({ json: { user: { userId: 119, role: "user", name: "Offline", email: "offline@example.test" } } });
      }
      if (path === "/api/tender-intelligence/requests/active") {
        if (scenario === "discovery-network") return route.abort("internetdisconnected");
        return route.fulfill({ json: { activeRequest: null } });
      }
      if (path === "/api/tender-intelligence/analyze") {
        posts++;
        const data = route.request().postDataJSON();
        const raw = await page.evaluate(key => localStorage.getItem(key), storageKey);
        assert.deepEqual(JSON.parse(raw!), {
          id: data.requestId,
          fingerprint: await page.evaluate(async input => {
            const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(input)));
            return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
          }, Object.fromEntries(Object.entries(data).filter(([key]) => key !== "requestId"))),
        }, "POST must have a durable, minimal identity with the exact input digest");
        return route.abort("connectionreset");
      }
      if (path.startsWith("/api/tender-intelligence/requests/")) {
        return route.fulfill({ status: 202, json: { status: "running", executionId: "offline-execution" } });
      }
      return route.fulfill({ status: 401, json: { error: "Unexpected API denied" } });
    });
    try {
      await page.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
      const name = page.getByTestId("input-tender-project-name");
      const input = `PRIVATE_FORM_${scenario}`;
      await name.fill(input);
      if (scenario === "account-network" || scenario === "account-server") {
        accountFailure = true;
        await page.getByRole("button", { name: "Periksa status", exact: true }).click();
        await page.getByTestId("status-tender-recovery").getByText(/Status akun belum dapat diperiksa/).waitFor();
      }
      if (scenario === "begin-corrupt") {
        await page.evaluate(key => localStorage.setItem(key, JSON.stringify({ id: "", fingerprint: null })), storageKey);
      }
      if (scenario === "extra-properties") {
        // Insert a valid reference after initial recovery, with untrusted extra input fields.
        await page.evaluate(async key => {
          const fingerprint = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",
            new TextEncoder().encode(JSON.stringify({
              projectName: "PRIVATE_FORM_extra-properties", tenderType: "Tender Konstruksi",
              projectDetails: "", workspaceId: null, retryOfId: null, checklistState: {},
              documents: ["Akta Perusahaan", "NPWP", "SIUP/TDP", "Sertifikat Badan Usaha (SBU)",
                "Laporan Keuangan Audited", "Surat Referensi Bank", "Sertifikat SMK3", "Daftar Pengalaman Proyek"]
                .map(documentType => ({ documentType, required: true, present: false, notes: "" })),
            })))), b => b.toString(16).padStart(2, "0")).join("");
          localStorage.setItem(key, JSON.stringify({ id: crypto.randomUUID(), fingerprint,
            projectName: "MUST_NOT_PERSIST", documents: ["PRIVATE_DOCUMENT"] }));
        }, storageKey);
      }
      const analyze = page.getByTestId("button-analyze-tender");
      if (await analyze.isEnabled()) {
        await analyze.click();
        await page.getByTestId("status-tender-analysis-error").waitFor();
      }
      assert.equal(await name.inputValue(), input, `${scenario}: failure must preserve form`);
      assert.equal(posts, scenario === "extra-properties" ? 1 : 0, `${scenario}: no unsafe POST`);
      assert.deepEqual(errors, [], `${scenario}: no unhandled exceptions`);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(posts, scenario === "extra-properties" ? 1 : 0, `${scenario}: reload never POSTs`);
      console.log(`PASS: ${scenario}`);
    } finally {
      await context.close();
    }
  }
}

// Exercise the real hook in an isolated React host. Controllable promises make
// the workspace/account races deterministic, without involving a real provider.
async function checkScopeRaces(browser: Browser) {
  for (const phase of ["account", "digest", "account-during-digest", "account-error-during-digest"] as const) {
    const context = await browser.newContext();
    const page = await context.newPage();
    let userId = 119;
    let posts = 0;
    let holdAccount = false;
    let failAccount = false;
    let releaseAccount!: () => void;
    let accountStarted!: () => void;
    const started = new Promise<void>(resolve => { accountStarted = resolve; });
    const held = new Promise<void>(resolve => { releaseAccount = resolve; });
    await context.route("**/api/**", async route => {
      const path = new URL(route.request().url()).pathname;
      if (path === "/api/auth/me") {
        if (holdAccount) {
          holdAccount = false;
          accountStarted();
          await held;
        }
        if (failAccount) return route.abort("internetdisconnected");
        return route.fulfill({ json: { user: { userId, role: "user", name: "Offline", email: "offline@example.test" } } });
      }
      if (route.request().method() === "POST") {
        posts++;
        return route.abort("blockedbyclient");
      }
      if (path.endsWith("/active")) return route.fulfill({ json: { activeRequest: null } });
      return route.fulfill({ status: 401, json: { error: "Unexpected API denied" } });
    });
    try {
      await page.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
      await page.evaluate(`(async () => {
        // These are Vite's existing optimized React modules, also used by the hook.
        const { default: React } = await import(/* @vite-ignore */ "/node_modules/.vite/deps/react.js");
        const { default: { createRoot } } = await import(/* @vite-ignore */ "/node_modules/.vite/deps/react-dom_client.js");
        const { useTenderRequest } = await import(/* @vite-ignore */ "/src/lib/use-tender-request.ts");
        const host = document.createElement("div");
        host.id = "race-host";
        document.body.append(host);
        function Host() {
          const [workspace, setWorkspace] = React.useState("workspace-a");
          const [input, setInput] = React.useState("");
          const [error, setError] = React.useState("");
          const request = useTenderRequest(workspace, () => {}, () => setInput(""));
          return React.createElement("div", null,
            React.createElement("span", { id: "race-state" }, request.state),
            React.createElement("span", { id: "race-error" }, error),
            React.createElement("input", { id: "race-input", value: input, onChange: e => setInput(e.target.value) }),
            React.createElement("button", { id: "race-switch", onClick: () => setWorkspace("workspace-b") }, "Switch"),
            React.createElement("button", { id: "race-send", onClick: async () => {
              try {
                const identity = await request.begin({ projectName: input, workspaceId: workspace });
                await fetch("/api/tender-intelligence/analyze", { method: "POST",
                  body: JSON.stringify({ projectName: input, workspaceId: workspace, requestId: identity.id }) });
              } catch (e) { setError(e.message); }
            } }, "Send"));
        }
        createRoot(host).render(React.createElement(Host));
      })()`);
      await page.locator("#race-state").getByText("empty", { exact: true }).waitFor();
      await page.locator("#race-input").fill("OLD_PRIVATE_INPUT");
      if (phase === "account") holdAccount = true;
      else await page.evaluate(() => {
        const digest = crypto.subtle.digest.bind(crypto.subtle);
        crypto.subtle.digest = async (...args) => {
          document.documentElement.dataset.digestStarted = "yes";
          await new Promise<void>(resolve => {
            document.addEventListener("release-digest", () => resolve(), { once: true });
          });
          return digest(...args);
        };
      });
      await page.locator("#race-send").click();
      if (phase === "account") await started;
      else await page.waitForFunction(() => document.documentElement.dataset.digestStarted === "yes");
      if (phase === "account" || phase === "digest") {
        await page.locator("#race-switch").click();
        await page.waitForFunction(() => (document.querySelector("#race-input") as HTMLInputElement).value === "");
        await page.locator("#race-input").fill("NEW_WORKSPACE_INPUT");
      } else if (phase === "account-during-digest") userId = 120;
      else failAccount = true;
      if (phase === "account") releaseAccount();
      else await page.evaluate(() => document.dispatchEvent(new Event("release-digest")));
      await page.locator("#race-error").getByText(/Konteks berubah|Akun berubah|Status akun belum dapat diperiksa/).waitFor();
      assert.equal(posts, 0, `${phase}: old input never POSTs`);
      assert.equal(await page.locator("#race-input").inputValue(),
        phase === "account-error-during-digest" ? "OLD_PRIVATE_INPUT"
          : phase === "account-during-digest" ? "" : "NEW_WORKSPACE_INPUT");
      const references = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("tender-request:")));
      assert.deepEqual(references, [], `${phase}: stale begin never persists a new identity`);
      console.log(`PASS: scope race during ${phase}`);
    } finally {
      releaseAccount();
      await context.close();
    }
  }
}

// Exercise handleAnalyze itself (not just the hook): the old POST fails only
// after a different account/workspace has its own message, form and result.
async function checkLateAnalysisFailures(browser: Browser) {
  for (const scope of ["workspace", "account"] as const) {
    for (const recovered of [false, true]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(15_000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      let userId = 119;
      let switched = false;
      let posts = 0;
      let recoveries = 0;
      let postedInput: Record<string, unknown> | undefined;
      let release!: () => void;
      let started!: () => void;
      const held = new Promise<void>(resolve => { release = resolve; });
      const postStarted = new Promise<void>(resolve => { started = resolve; });
      const oldKey = `tender-request:119:${scope === "workspace" ? "workspace-a" : "personal"}`;
      const newKey = `tender-request:${scope === "account" ? 120 : 119}:personal`;
      const savedResult = {
        id: "new-context-result", executionId: "new-context-execution", workspaceId: null,
        projectName: "PROYEK_KONTEKS_BARU", tenderType: "Tender Konstruksi",
        projectDetails: "DETAIL_KONTEKS_BARU",
        documents: [{ documentType: "NPWP", required: true, present: true, notes: "CATATAN_BARU" }],
        checklistState: {}, completenessChecks: [], overallCompleteness: 97, complianceScore: 96,
        risks: [], recommendations: ["HASIL_KONTEKS_BARU"], summary: {},
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      await context.route("**/api/**", async route => {
        const path = new URL(route.request().url()).pathname;
        if (path === "/api/auth/me") return route.fulfill({ json: {
          user: { userId, name: "Offline", email: "offline@example.test", role: "user" },
        } });
        if (path === "/api/project-workspaces/workspace-a") return route.fulfill({ json: {
          workspace: { id: "workspace-a", name: "Ruang Lama", stageId: "tender", notes: "",
            createdAt: savedResult.createdAt, updatedAt: savedResult.updatedAt, archivedAt: null },
        } });
        if (route.request().method() === "POST") {
          posts++;
          assert.equal(path, "/api/tender-intelligence/analyze");
          postedInput = route.request().postDataJSON();
          started();
          await held;
          return route.abort("internetdisconnected");
        }
        if (path.startsWith("/api/tender-intelligence/requests/")) {
          recoveries++;
          if (path.endsWith("/active")) {
            if (switched && !recovered) return route.fulfill({
              status: 503, json: { error: "STATUS_KONTEKS_BARU" },
            });
            return route.fulfill({ json: { activeRequest: switched
              ? { executionId: savedResult.executionId } : null } });
          }
          if (switched && recovered) return route.fulfill({ json: {
            status: "succeeded", executionId: savedResult.executionId, result: savedResult,
          } });
          return route.fulfill({ status: 202, json: { status: "running", executionId: "old-execution" } });
        }
        return route.fulfill({ status: 401, json: { error: "Unexpected API denied" } });
      });
      try {
        await page.goto(`${base}/tender-intelligence${scope === "workspace" ? "?workspace=workspace-a" : ""}`,
          { waitUntil: "networkidle" });
        const completeness = () => page.getByRole("button", { name: "✅ Kelengkapan", exact: true }).click();
        await completeness();
        const name = page.getByTestId("input-tender-project-name");
        await name.fill("INPUT_RUANG_LAMA");
        await page.getByTestId("button-analyze-tender").click();
        await postStarted;
        const oldIdentity = await page.evaluate(key => localStorage.getItem(key), oldKey);
        assert.equal(JSON.parse(oldIdentity!).id, postedInput!.requestId);
        assert.equal(postedInput!.workspaceId, scope === "workspace" ? "workspace-a" : null);

        switched = true;
        if (scope === "workspace") {
          await page.getByRole("button", { name: "Tanpa konteks", exact: true }).click();
        } else {
          userId = 120;
          await page.evaluate(() => window.dispatchEvent(new Event("storage")));
        }
        const recovery = page.getByTestId("status-tender-recovery");
        await recovery.getByText(recovered
          ? /Hasil tersimpan berhasil dipulihkan/ : "STATUS_KONTEKS_BARU").waitFor();
        if (recovered) {
          await page.getByText("HASIL_KONTEKS_BARU", { exact: true }).waitFor();
          await completeness();
          assert.equal(await name.inputValue(), savedResult.projectName);
        }
        await name.fill("INPUT_BARU_JANGAN_DITIMPA");
        const details = page.locator("textarea");
        await details.fill("DETAIL_BARU_JANGAN_DITIMPA");
        assert.equal(await page.getByTestId("button-analyze-tender").isEnabled(), true,
          "An old scope's pending POST must not keep the new scope busy");
        const messageBefore = await recovery.getByRole("status").innerText();
        const newIdentity = await page.evaluate(key => localStorage.getItem(key), newKey);
        const recoveryCount = recoveries;
        const failed = page.waitForEvent("requestfailed",
          request => new URL(request.url()).pathname === "/api/tender-intelligence/analyze");
        release();
        await failed;
        // Flush the rejected fetch's catch/finally and React's resulting render.
        await page.evaluate(`new Promise(resolve => requestAnimationFrame(() =>
          requestAnimationFrame(resolve)))`);
        assert.equal(await page.getByTestId("status-tender-analysis-error").count(), 0,
          `${scope}/${recovered}: a stale rejection must not show an error`);
        assert.equal(await recovery.getByRole("status").innerText(), messageBefore, "New scope's message is unchanged");
        assert.equal(await name.inputValue(), "INPUT_BARU_JANGAN_DITIMPA");
        assert.equal(await details.inputValue(), "DETAIL_BARU_JANGAN_DITIMPA");
        assert.equal(recoveries, recoveryCount, "Stale catch must not recover its old scope");
        assert.equal(posts, 1, "No analysis is dispatched again");
        assert.equal(await page.evaluate(key => localStorage.getItem(key), oldKey), oldIdentity,
          "The original request identity is immutable");
        assert.equal(await page.evaluate(key => localStorage.getItem(key), newKey), newIdentity);
        await page.getByRole("button", { name: "📊 Overview", exact: true }).click();
        assert.equal(await page.getByText("HASIL_KONTEKS_BARU", { exact: true }).count(), recovered ? 1 : 0);
        assert.deepEqual(errors, []);
        console.log(`PASS: late analysis rejection after ${scope} switch (${recovered ? "saved result" : "new message"})`);
      } finally {
        release();
        await context.close();
      }
    }
  }
}

const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE, headless: true,
});
try {
  await checkLateAnalysisFailures(browser);
  await checkStorageFailures(browser);
  await checkScopeRaces(browser);
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
