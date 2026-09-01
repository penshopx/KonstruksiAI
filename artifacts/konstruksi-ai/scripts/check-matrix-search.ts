import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/matrix";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

async function main() {
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.getByTestId("matrix-explorer").waitFor();

    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /210 kombinasi tersedia/,
      "Matriks awal harus tetap menampilkan 210 kombinasi",
    );

    await page.getByTestId("matrix-search").fill("RAB");
    await page.getByTestId("matrix-result-estimasi-konstruksi_gedung").waitFor();
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /10 kombinasi cocok/,
      "Pencarian RAB harus menemukan seluruh bidang untuk fungsi estimasi",
    );
    assert.equal(
      await page.getByTestId("matrix-result-estimasi-konstruksi_gedung").getByRole("link", { name: "Agent" }).getAttribute("href"),
      "/agent/estimasi/konstruksi_gedung",
      "Hasil pencarian harus menyediakan link agent yang benar",
    );
    assert.match(
      await page.getByTestId("matrix-result-estimasi-konstruksi_gedung").getByRole("link", { name: "Chat" }).getAttribute("href") ?? "",
      /^\/chat\?q=/,
      "Hasil pencarian harus menyediakan link chat dengan pertanyaan terisi",
    );

    await page.getByTestId("matrix-business-filter").selectOption("estimasi");
    await page.getByTestId("matrix-engineering-filter").selectOption("elektrikal");
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /1 kombinasi cocok/,
      "Filter fungsi dan bidang harus menyisakan satu kombinasi",
    );
    assert.equal(
      await page.getByTestId("matrix-result-estimasi-elektrikal").count(),
      1,
      "Kombinasi estimasi × elektrikal harus tampil di hasil teratas",
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
    await page.getByRole("button", { name: "Tender", exact: true }).click();
    assert.match(
      await page.getByTestId("matrix-result-count").innerText(),
      /10 kombinasi cocok/,
      "Pencarian cepat harus tetap bekerja pada web mobile",
    );

    console.log("Matrix search regression passed on desktop and mobile web: search, cross-filters, direct links, reset, and responsive layout are consistent.");
  } finally {
    await page.close();
    await browser.close();
  }
}

await main();