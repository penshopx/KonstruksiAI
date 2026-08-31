import assert from "node:assert/strict";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/chat";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const ZOOM_VIEWPORTS = [
  { zoom: 125, width: 1152 },
  { zoom: 150, width: 960 },
  { zoom: 175, width: 823 },
  { zoom: 200, width: 720 },
] as const;
const DESKTOP_HEIGHT = 720;
const SHORT_DESKTOP_VIEWPORTS = [
  { width: 1280, height: 600 },
  { width: 1280, height: 540 },
] as const;

const TEST_PROMPT = "Tes hit-test composer";
const TEST_RESPONSE = "Respons fixture untuk regression test.";
const COMPOSER_SENTINEL = "Draft tetap ada saat panel dibuka";

function json(routeBody: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(routeBody),
  };
}

async function installApiRoutes(page: Page) {
  await page.route("**/api/**", async route => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname === "/api/auth/me") {
      await route.fulfill(json({ user: null }));
      return;
    }

    if (url.pathname === "/api/chat" && request.method() === "POST") {
      const body = [
        `data: ${JSON.stringify({ content: TEST_RESPONSE })}`,
        `data: ${JSON.stringify({ done: true })}`,
        "",
        "",
      ].join("\n");
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body,
      });
      return;
    }

    if (url.pathname === "/api/radar/articles") {
      await route.fulfill(json({
        articles: [],
        sources: [],
      }));
      return;
    }

    await route.fulfill(json({}));
  });
}

async function assertHitTestTarget(locator: Locator, label: string) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} harus memiliki posisi yang terlihat`);

  const isTarget = await locator.evaluate((element, point) => {
    const target = document.elementFromPoint(point.x, point.y);
    return target === element || Boolean(target && element.contains(target));
  }, {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  });

  assert.equal(isTarget, true, `${label} harus menjadi target hit-test di titik tengahnya`);
  return box;
}

function overlaps(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
}

async function assertMainComposerUnchanged(
  page: Page,
  composer: Locator,
  expectedValue: string,
  expectedBox: { x: number; y: number; width: number; height: number },
  label: string,
) {
  assert.equal(await composer.locator("textarea").inputValue(), expectedValue, `${label}: isi composer utama berubah`);
  const nextBox = await composer.boundingBox();
  assert.ok(nextBox, `${label}: composer utama tidak terlihat`);
  for (const key of ["x", "y", "width", "height"] as const) {
    assert.ok(
      Math.abs(nextBox[key] - expectedBox[key]) < 1,
      `${label}: ukuran/posisi composer utama berubah pada ${key}`,
    );
  }
}

async function runViewportScenario(browser: Browser, viewport: (typeof ZOOM_VIEWPORTS)[number]) {
  const context = await browser.newContext({
    viewport: {
      width: viewport.width,
      height: DESKTOP_HEIGHT,
    },
  });
  const page = await context.newPage();
  await installApiRoutes(page);

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    const composer = page.getByTestId("chat-composer");
    await composer.waitFor();

    const sendButton = page.getByTestId("chat-send");
    await sendButton.waitFor();
    await composer.locator("textarea").fill(TEST_PROMPT);
    await assertHitTestTarget(sendButton, `${viewport.zoom}% send button`);
    await sendButton.click();

    await page.getByText(TEST_RESPONSE, { exact: true }).waitFor();
    assert.ok(
      (await page.getByText(TEST_PROMPT, { exact: true }).count()) >= 1,
      `${viewport.zoom}% harus menampilkan pesan pengguna setelah send`,
    );

    await composer.locator("textarea").fill(COMPOSER_SENTINEL);
    const composerBox = await composer.boundingBox();
    assert.ok(composerBox, `${viewport.zoom}% composer utama harus terlihat`);

    const radarLauncher = page.getByRole("button", { name: "Buka Radar Harian" });
    const radarBox = await assertHitTestTarget(radarLauncher, `${viewport.zoom}% Radar launcher`);
    assert.equal(
      overlaps(radarBox, composerBox),
      false,
      `${viewport.zoom}% Radar launcher tidak boleh menutupi composer utama`,
    );

    await radarLauncher.click();
    const radarDialog = page.getByRole("dialog", { name: "Radar Harian" });
    await radarDialog.waitFor();
    await assertMainComposerUnchanged(
      page,
      composer,
      COMPOSER_SENTINEL,
      composerBox,
      `${viewport.zoom}% setelah Radar dibuka`,
    );
    await radarDialog.getByRole("button", { name: "Tutup panel" }).click();
    await radarDialog.waitFor({ state: "detached" });
    await assertMainComposerUnchanged(
      page,
      composer,
      COMPOSER_SENTINEL,
      composerBox,
      `${viewport.zoom}% setelah Radar ditutup`,
    );

    const helpLauncher = page.getByRole("button", { name: "Buka Help Desk Aplikasi" });
    const helpBox = await assertHitTestTarget(helpLauncher, `${viewport.zoom}% Bantuan launcher`);
    assert.equal(
      overlaps(helpBox, composerBox),
      false,
      `${viewport.zoom}% Bantuan launcher tidak boleh menutupi composer utama: ${JSON.stringify({ helpBox, composerBox })}`,
    );

    await helpLauncher.click();
    const helpDialog = page.getByRole("dialog", { name: "Help Desk Aplikasi" });
    await helpDialog.waitFor();
    await assertMainComposerUnchanged(
      page,
      composer,
      COMPOSER_SENTINEL,
      composerBox,
      `${viewport.zoom}% setelah Bantuan dibuka`,
    );
    await helpDialog.getByRole("button", { name: "Tutup panel" }).click();
    await helpDialog.waitFor({ state: "detached" });
    await assertMainComposerUnchanged(
      page,
      composer,
      COMPOSER_SENTINEL,
      composerBox,
      `${viewport.zoom}% setelah Bantuan ditutup`,
    );

    console.log(`Zoomed chat controls passed at ${viewport.zoom}% (${viewport.width}x${DESKTOP_HEIGHT}).`);
  } finally {
    await context.close();
  }
}

async function assertPanelHeaderVisible(
  dialog: Locator,
  viewport: (typeof SHORT_DESKTOP_VIEWPORTS)[number],
  label: string,
) {
  const dialogBox = await dialog.boundingBox();
  assert.ok(dialogBox, `${label} panel harus terlihat`);
  assert.ok(dialogBox.y >= 0, `${label} panel header tidak boleh berada di atas viewport`);
  assert.ok(
    dialogBox.y + dialogBox.height <= viewport.height,
    `${label} panel harus tetap berada di dalam viewport`,
  );

  const closeButton = dialog.getByRole("button", { name: "Tutup panel" });
  const closeBox = await closeButton.boundingBox();
  assert.ok(closeBox, `${label} tombol tutup harus terlihat`);
  assert.ok(closeBox.y >= 0, `${label} tombol tutup tidak boleh berada di atas viewport`);
  assert.ok(
    closeBox.y + closeBox.height <= viewport.height,
    `${label} tombol tutup harus tetap berada di dalam viewport`,
  );
  return closeButton;
}

async function runShortDesktopViewportScenario(
  browser: Browser,
  viewport: (typeof SHORT_DESKTOP_VIEWPORTS)[number],
) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await installApiRoutes(page);

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

    const radarLauncher = page.getByRole("button", { name: "Buka Radar Harian" });
    await radarLauncher.click();
    const radarDialog = page.getByRole("dialog", { name: "Radar Harian" });
    await radarDialog.waitFor();
    const radarCloseButton = await assertPanelHeaderVisible(radarDialog, viewport, "Radar");
    await radarCloseButton.click();
    await radarDialog.waitFor({ state: "detached" });

    await radarLauncher.click();
    await radarDialog.waitFor();
    await assertPanelHeaderVisible(radarDialog, viewport, "Radar setelah dibuka ulang");
    await page.keyboard.press("Escape");
    await radarDialog.waitFor({ state: "detached" });

    const helpLauncher = page.getByRole("button", { name: "Buka Help Desk Aplikasi" });
    await helpLauncher.click();
    const helpDialog = page.getByRole("dialog", { name: "Help Desk Aplikasi" });
    await helpDialog.waitFor();
    const helpCloseButton = await assertPanelHeaderVisible(helpDialog, viewport, "Bantuan");
    await helpCloseButton.click();
    await helpDialog.waitFor({ state: "detached" });

    await helpLauncher.click();
    await helpDialog.waitFor();
    await assertPanelHeaderVisible(helpDialog, viewport, "Bantuan setelah dibuka ulang");
    await page.keyboard.press("Escape");
    await helpDialog.waitFor({ state: "detached" });

    console.log(`Short desktop chat panels passed at ${viewport.width}x${viewport.height}.`);
  } finally {
    await context.close();
  }
}

async function main() {
  assert.ok(EXECUTABLE_PATH, "REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE is required");
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });

  try {
    for (const viewport of ZOOM_VIEWPORTS) {
      await runViewportScenario(browser, viewport);
    }
    for (const viewport of SHORT_DESKTOP_VIEWPORTS) {
      await runShortDesktopViewportScenario(browser, viewport);
    }
  } finally {
    await browser.close();
  }
}

await main();