/**
 * Browser regression for TenderProviderSetup mounted on the real Tender page.
 * Every API call is intercepted; no real account, database or paid AI is used.
 * Run via test:tender-provider-setup to share the workspace's Chromium lock.
 */
import assert from "node:assert/strict";
import { chromium, type Route } from "playwright-core";

const base = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80";
const endpoint = "/api/tender-intelligence/provider-setup";
const rawDetail = "PRIVATE_PROVIDER_DETAIL sk-synthetic-never-show <script>raw-sdk-error</script>";
const checkedAt = "2026-11-08T10:11:12.000Z";
const ready = {
  ready: true, code: "AI_PROVIDER_READY", checkedAt, retryable: false,
  message: "Provider AI siap menerima permintaan Tender.",
  action: "Hasil ini hanya memastikan koneksi saat pemeriksaan, bukan menjamin keberhasilan analisis.",
};
const failures = [
  {
    code: "AI_PROVIDER_NOT_CONFIGURED", retryable: false,
    message: "Kredensial layanan AI belum tersedia.",
    action: "Minta administrator memeriksa konfigurasi layanan AI.",
  },
  {
    code: "AI_PROVIDER_AUTHENTICATION_FAILED", retryable: false,
    message: "Provider AI menolak autentikasi aplikasi.",
    action: "Minta administrator memeriksa kredensial dan akses provider AI; mencoba ulang saja tidak akan memperbaikinya.",
  },
  {
    code: "AI_PROVIDER_CREDITS_EXHAUSTED", retryable: false,
    message: "Kredit atau kuota provider AI tidak mencukupi.",
    action: "Minta administrator memeriksa saldo, billing, atau batas penggunaan provider AI.",
  },
  {
    code: "AI_PROVIDER_RATE_LIMITED", retryable: true,
    message: "Provider AI sedang membatasi jumlah permintaan.",
    action: "Tunggu beberapa saat, lalu coba jalankan analisis kembali.",
  },
  {
    code: "AI_INVALID_MODEL_RESPONSE", retryable: true,
    message: "Respons model AI kosong atau tidak sesuai format analisis yang dibutuhkan.",
    action: "Coba jalankan analisis kembali. Jika terus terjadi, informasikan tim teknis.",
  },
  {
    code: "AI_PROVIDER_REQUEST_REJECTED", retryable: false,
    message: "Provider AI menolak konfigurasi model atau permintaan analisis.",
    action: "Minta administrator memeriksa konfigurasi model dan provider AI.",
  },
  {
    code: "AI_PROVIDER_UNAVAILABLE", retryable: true,
    message: "Layanan provider AI sedang tidak tersedia atau koneksinya terputus.",
    action: "Tunggu beberapa saat, lalu coba kembali.",
  },
  {
    code: "AI_INTERNAL_ERROR", retryable: true,
    message: "Layanan internal gagal memproses atau menyimpan hasil analisis.",
    action: "Coba kembali nanti. Jika masalah berlanjut, hubungi tim teknis.",
  },
];

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

const browser = await chromium.launch({
  executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  headless: true,
});
try {
  // Block service workers so no API request can bypass routing.
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const pageErrors: string[] = [];
  const unexpectedWrites: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  let role: string | null = "admin";
  let getCalls = 0;
  let postCalls = 0;
  let permissionReply: (route: Route) => Promise<void>;
  let probeReply: (route: Route) => Promise<void> = route => route.fulfill({ json: ready });

  await context.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === endpoint) {
        if (request.method() === "GET") {
          getCalls++;
          return permissionReply(route);
        }
        assert.equal(request.method(), "POST");
        postCalls++;
        assert.equal(request.postData(), null, "Diagnostics must not submit project documents");
        return probeReply(route);
      }
      if (request.method() !== "GET") unexpectedWrites.push(`${request.method()} ${url.pathname}`);
      if (url.pathname === "/api/auth/me" && role) {
        return route.fulfill({ json: { user: {
          userId: 119, name: "Offline", email: "offline@example.test", role,
        } } });
      }
      // Fail closed for unrelated history, analysis, recovery, or account calls.
      return route.fulfill({ status: 401, json: { error: "Offline regression: denied." } });
    }
    // Prevent direct provider calls as well as accidental unmocked third-party traffic.
    if (url.origin !== new URL(base).origin) return route.abort("blockedbyclient");
    return route.continue();
  });

  const section = page.getByRole("region", { name: "Konfigurasi AI administrator", exact: true });
  const button = section.getByRole("button", { name: "Periksa konfigurasi AI", exact: true });
  const status = section.getByRole("status");
  const navigate = async () => {
    const before = getCalls;
    await page.goto(`${base}/tender-intelligence`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "🎯 Tender Intelligence", exact: true }).waitFor();
    assert.equal(getCalls, before + 1, "Tender must check permission exactly once per mount");
  };
  const assertSafe = async () => {
    assert.doesNotMatch(await page.locator("body").innerText(), /PRIVATE_PROVIDER_DETAIL|sk-synthetic|raw-sdk-error/);
    assert.equal(unexpectedWrites.length, 0, "Diagnostics must never dispatch an analysis or save history");
  };

  // Include a stale admin client claim: server permission, not navbar role, wins.
  const denied = [
    { name: "non-admin", role: "user", status: 200 },
    { name: "stale admin claim", role: "admin", status: 200 },
    { name: "anonymous", role: null, status: 401 },
    { name: "forbidden", role: "admin", status: 403 },
    { name: "rate limited", role: "admin", status: 429 },
    { name: "server failure", role: "admin", status: 500 },
    { name: "connection lost", role: "admin", status: 0 },
  ];
  for (const scenario of denied) {
    role = scenario.role;
    permissionReply = route => scenario.status === 0
      ? route.abort("connectionreset")
      : route.fulfill({ status: scenario.status, json: { canCheck: false, error: rawDetail } });
    await navigate();
    assert.equal(await section.count(), 0, `${scenario.name}: admin controls must be absent`);
    assert.equal(await page.getByRole("button", { name: "Periksa konfigurasi AI", exact: true }).count(), 0);
    assert.equal(postCalls, 0, "Loading Tender must never spend provider quota");
    await assertSafe();
  }

  role = "admin";
  const permissionGate = deferred();
  permissionReply = async route => {
    await permissionGate.promise;
    await route.fulfill({ json: { canCheck: true } });
  };
  const navigation = navigate();
  await page.getByRole("heading", { name: "🎯 Tender Intelligence", exact: true }).waitFor();
  assert.equal(await section.count(), 0, "Fail closed while permission is still pending");
  permissionGate.resolve();
  await navigation;
  await button.waitFor();
  assert.equal(await status.getAttribute("aria-live"), "polite");
  await section.getByText(/tanpa mengirim dokumen proyek/).waitFor();
  assert.equal(postCalls, 0, "Authorization alone must not trigger a paid probe");

  const runProbe = async (reply: (route: Route) => Promise<void>, verify: () => Promise<void>) => {
    const gate = deferred();
    probeReply = async route => {
      await gate.promise;
      await reply(route);
    };
    const before = postCalls;
    const requestSent = page.waitForRequest(request =>
      new URL(request.url()).pathname === endpoint && request.method() === "POST");
    await button.click();
    const checking = section.getByRole("button", { name: "Memeriksa provider AI...", exact: true });
    await checking.waitFor();
    await requestSent;
    assert.equal(await checking.isDisabled(), true);
    assert.equal((await status.innerText()).trim(), "", "Clear previous result/error immediately");
    // Repeated synthetic clicks while disabled must not queue another paid probe.
    await checking.evaluate(element => {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    assert.equal(postCalls, before + 1, "Repeated clicks must send exactly one probe");
    gate.resolve();
    await verify();
    await button.waitFor();
    assert.equal(await button.isEnabled(), true, "Always release checking state");
    assert.equal(postCalls, before + 1, "No automatic retries after a result or failure");
    await assertSafe();
  };
  const verifyResult = async (result: typeof ready) => {
    await status.getByText(result.message, { exact: true }).waitFor();
    await status.getByText(result.action, { exact: true }).waitFor();
    const timestamp = await page.evaluate(value => new Date(value).toLocaleString("id-ID"), checkedAt);
    await status.getByText(`Diperiksa: ${timestamp}. Status dapat berubah.`, { exact: true }).waitFor();
    assert.equal(await status.isVisible(), true);
  };
  await runProbe(route => route.fulfill({ json: ready }), () => verifyResult(ready));
  // The setup panel and result remain visible across every Tender tab.
  for (const tab of ["✅ Kelengkapan", "⚠️ Risiko", "📋 Persyaratan", "📝 Checklist", "📊 Overview"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await verifyResult(ready);
  }
  assert.equal(postCalls, 1, "Switching Tender tabs must not repeat the probe");
  for (const failure of failures) {
    const result = { ...failure, ready: false, checkedAt };
    await runProbe(route => route.fulfill({ json: result }), () => verifyResult(result));
    assert.equal(await status.getByText(ready.message, { exact: true }).count(), 0);
  }

  const errors = [
    { status: 401, message: "Akses administrator tidak lagi tersedia. Muat ulang halaman atau masuk kembali." },
    { status: 403, message: "Akses administrator tidak lagi tersedia. Muat ulang halaman atau masuk kembali." },
    { status: 429, message: "Batas pemeriksaan tercapai. Tunggu satu menit lalu coba kembali." },
    { status: 500, message: "Pemeriksaan tidak berhasil. Coba kembali nanti." },
    { status: 0, message: "Tidak dapat menghubungi server. Periksa koneksi lalu coba kembali." },
  ];
  for (const scenario of errors) {
    // Seed a success each time: errors must not leave stale "ready" guidance.
    await runProbe(route => route.fulfill({ json: ready }), () => verifyResult(ready));
    await runProbe(
      route => scenario.status === 0
        ? route.abort("connectionreset")
        : route.fulfill({ status: scenario.status, contentType: "text/html", body: rawDetail }),
      async () => {
        await status.getByText(scenario.message, { exact: true }).waitFor();
        assert.equal(await status.innerText(), scenario.message, "Show only friendly local guidance, never raw HTTP text");
        assert.equal(await status.getByText(/Diperiksa:/).count(), 0, "Do not retain a stale timestamp");
      },
    );
  }
  // A failed connection must not leave the panel stuck: an explicit retry works.
  await runProbe(route => route.fulfill({ json: ready }), () => verifyResult(ready));
  assert.equal(postCalls, 20);
  assert.deepEqual(pageErrors, []);
  console.log("PASS: Tender admin permissions (7 denied cases + pending), single-flight checking, ready + 8 provider failures, all tabs, 401/403/429/500/disconnect, safe messages and explicit retry. All API traffic synthetic; no AI quota used.");
  await context.close();
} finally {
  await browser.close();
}
