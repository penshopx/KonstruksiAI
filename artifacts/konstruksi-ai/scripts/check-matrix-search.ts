import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/matrix";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

async function getTrackedEventNames(page: import("playwright-core").Page) {
  return page.evaluate(
    () => (window as unknown as { __matrixEvents: Array<{ name: string }> }).__matrixEvents.map((event) => event.name),
  );
}

async function getTrackedEvents(page: import("playwright-core").Page) {
  return page.evaluate(
    () => (window as unknown as {
      __matrixEvents: Array<{ name: string; data?: Record<string, unknown> }>;
    }).__matrixEvents,
  );
}

async function main() {
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript({
    content: `
      window.__matrixEvents = [];
      window.umami = {
        track: (name, data) => window.__matrixEvents.push({ name, data }),
      };
    `,
  });

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.getByTestId("matrix-explorer").waitFor();

    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /210 kombinasi tersedia/,
      "Matriks awal harus tetap menampilkan 210 kombinasi",
    );

    await page.getByTestId("matrix-search").fill("HVAC");
    await page.getByTestId("matrix-search").press("Tab");
    await page.getByTestId("matrix-result-gedung-mekanikal").waitFor();
    assert.ok(
      (await getTrackedEventNames(page)).includes("matrix_search"),
      "Pencarian harus mengirim event analytics",
    );
    const keywordSearchEvent = (await getTrackedEvents(page)).find(
      (event) => event.name === "matrix_search" && event.data?.source === "keyword",
    );
    assert.deepEqual(
      keywordSearchEvent?.data,
      { source: "keyword", query_length: 4, result_count: 5 },
      "Analytics pencarian tidak boleh mengirim teks kata kunci bebas",
    );
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /5 kombinasi cocok/,
      "Pencarian HVAC harus menemukan kombinasi bertopik HVAC",
    );
    assert.equal(
      await page.getByTestId("matrix-table").getByRole("button").count(),
      5,
      "Grid hasil HVAC hanya boleh membuat lima sel yang cocok dapat dipilih",
    );
    assert.equal(
      await page.getByTestId("matrix-result-gedung-mekanikal").getByRole("link", { name: "Agent" }).getAttribute("href"),
      "/agent/gedung/mekanikal",
      "Hasil pencarian harus menyediakan link agent yang benar",
    );
    assert.match(
      await page.getByTestId("matrix-result-gedung-mekanikal").getByRole("link", { name: "Chat" }).getAttribute("href") ?? "",
      /^\/chat\?q=/,
      "Hasil pencarian harus menyediakan link chat dengan pertanyaan terisi",
    );
    const agentLink = page.getByTestId("matrix-result-gedung-mekanikal").getByRole("link", { name: "Agent" });
    await agentLink.evaluate((element) => {
      element.addEventListener("click", (event) => event.preventDefault(), { once: true });
    });
    await agentLink.click();
    assert.deepEqual(
      (await getTrackedEvents(page)).find((event) => event.name === "matrix_result_opened")?.data,
      {
        business_id: "gedung",
        engineering_id: "mekanikal",
        destination: "agent",
      },
      "Klik hasil harus mencatat kombinasi dan tujuan tanpa data sensitif",
    );
    await page.getByTestId("matrix-result-gedung-mekanikal").locator("button").first().click();
    assert.ok(
      (await getTrackedEventNames(page)).includes("matrix_cell_selected"),
      "Pemilihan sel harus mengirim event analytics",
    );

    await page.getByTestId("matrix-clear-filters").click();
    await page.getByTestId("matrix-business-filter").selectOption("desain");
    await page.getByTestId("matrix-engineering-filter").selectOption("mekanikal");
    assert.ok(
      (await getTrackedEventNames(page)).includes("matrix_filter_used"),
      "Penggunaan filter harus mengirim event analytics",
    );
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /1 kombinasi cocok/,
      "Filter fungsi dan bidang harus menyisakan satu kombinasi",
    );
    assert.equal(
      await page.getByTestId("matrix-result-desain-mekanikal").count(),
      1,
      "Kombinasi desain × mekanikal harus tampil di hasil teratas",
    );

    await page.getByTestId("matrix-clear-filters").click();
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /210 kombinasi tersedia/,
      "Reset harus mengembalikan seluruh matriks",
    );
    assert.ok(
      (await getTrackedEventNames(page)).includes("matrix_explorer_reset"),
      "Reset explorer harus mengirim event analytics",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByTestId("matrix-explorer").waitFor();
    for (const testId of ["matrix-search", "matrix-business-filter", "matrix-engineering-filter"]) {
      const box = await page.getByTestId(testId).boundingBox();
      assert.ok(box, `${testId} harus terlihat pada web mobile`);
      assert.ok(box.x >= 0 && box.x + box.width <= 390, `${testId} harus tetap berada di dalam viewport mobile`);
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true,
      "Matriks tidak boleh membuat seluruh halaman overflow horizontal pada web mobile",
    );
    await page.getByRole("button", { name: "Desain", exact: true }).click();
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /\d+ kombinasi cocok/,
      "Pencarian cepat harus tetap bekerja pada web mobile",
    );

    console.log("Matrix search regression passed on desktop and mobile web: search, cross-filters, direct links, reset, and responsive layout are consistent.");
  } finally {
    await page.close();
    await browser.close();
  }
}

await main();