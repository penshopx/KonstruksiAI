import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/matrix";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

type AnalyticsEvent = {
  name: string;
  data?: Record<string, string | number | boolean>;
};

async function main() {
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    await page.addInitScript(() => {
      const analyticsWindow = window as typeof window & {
        __matrixAnalyticsEvents: AnalyticsEvent[];
      };
      analyticsWindow.__matrixAnalyticsEvents = [];
      analyticsWindow.umami = {
        track(name, data) {
          analyticsWindow.__matrixAnalyticsEvents.push({ name, data });
        },
      };
    });

    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.getByTestId("matrix-explorer").waitFor();

    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /210 kombinasi tersedia/,
      "Matriks awal harus tetap menampilkan 210 kombinasi",
    );

    await page.getByTestId("matrix-search").fill("HVAC");
    await page.getByTestId("matrix-result-gedung-mekanikal").waitFor();
    await page.waitForTimeout(600);
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
    const searchEvent = await page.evaluate(() => {
      const analyticsWindow = window as typeof window & {
        __matrixAnalyticsEvents: AnalyticsEvent[];
      };
      return analyticsWindow.__matrixAnalyticsEvents.find((event) => event.name === "matrix_search_used");
    });
    assert.ok(searchEvent, "Pencarian Matriks harus mencatat event analytics");
    assert.equal(searchEvent.data?.result_count, 5, "Event pencarian harus mencatat jumlah hasil");
    assert.equal(
      JSON.stringify(searchEvent.data).includes("HVAC"),
      false,
      "Event pencarian tidak boleh mengirim kata kunci bebas",
    );

    await page.getByTestId("matrix-clear-filters").click();
    await page.getByTestId("matrix-business-filter").selectOption("desain");
    await page.getByTestId("matrix-engineering-filter").selectOption("mekanikal");
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
    const filterEvents = await page.evaluate(() => {
      const analyticsWindow = window as typeof window & {
        __matrixAnalyticsEvents: AnalyticsEvent[];
      };
      return analyticsWindow.__matrixAnalyticsEvents.filter((event) => event.name === "matrix_filter_used");
    });
    assert.equal(filterEvents.length, 2, "Kedua filter Matriks harus mencatat event analytics");
    assert.deepEqual(
      filterEvents.map((event) => [event.data?.filter_type, event.data?.result_count]),
      [["business_function", 10], ["engineering_domain", 1]],
      "Event filter harus mencatat jenis filter dan jumlah hasil setelah perubahan",
    );

    const matchedResult = page.getByTestId("matrix-result-desain-mekanikal");
    await matchedResult.getByRole("button").click();
    const selectedEvent = await page.evaluate(() => {
      const analyticsWindow = window as typeof window & {
        __matrixAnalyticsEvents: AnalyticsEvent[];
      };
      return analyticsWindow.__matrixAnalyticsEvents.find((event) => event.name === "matrix_cell_selected");
    });
    assert.deepEqual(
      selectedEvent?.data,
      {
        business_id: "desain",
        engineering_id: "mekanikal",
        selection_source: "search_result",
        result_count: 1,
      },
      "Pemilihan hasil harus mencatat kombinasi tanpa teks topik",
    );

    await page.evaluate(() => {
      document.addEventListener("click", (event) => event.preventDefault(), { capture: true, once: true });
    });
    await matchedResult.getByRole("link", { name: "Agent" }).click();
    await page.evaluate(() => {
      document.addEventListener("click", (event) => event.preventDefault(), { capture: true, once: true });
    });
    await matchedResult.getByRole("link", { name: "Chat" }).click();
    const destinationEvents = await page.evaluate(() => {
      const analyticsWindow = window as typeof window & {
        __matrixAnalyticsEvents: AnalyticsEvent[];
      };
      return analyticsWindow.__matrixAnalyticsEvents.filter(
        (event) => event.name === "matrix_agent_opened" || event.name === "matrix_chat_opened",
      );
    });
    assert.deepEqual(
      destinationEvents.map((event) => [event.name, event.data?.business_id, event.data?.engineering_id]),
      [
        ["matrix_agent_opened", "desain", "mekanikal"],
        ["matrix_chat_opened", "desain", "mekanikal"],
      ],
      "Link Agent dan Chat harus mencatat business id dan engineering id",
    );

    await page.getByTestId("matrix-clear-filters").click();
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /210 kombinasi tersedia/,
      "Reset harus mengembalikan seluruh matriks",
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