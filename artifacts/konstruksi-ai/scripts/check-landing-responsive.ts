import assert from "node:assert/strict";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const RESPONSIVE_VIEWPORTS = [
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const HERO_CARDS = [
  {
    href: "/tools",
    text: "RAB & Estimasi",
    marker: /Kalkulator Teknik/,
  },
  {
    href: "/tender",
    text: "Tender & Dokumen",
    marker: /Tender Pemerintah/,
  },
  {
    href: "/legal-licensing",
    text: "Legal & K3",
    marker: /Legal & Licensing/,
  },
] as const;

const LAUNCHER_SELECTOR =
  'button[aria-label="Buka Radar Harian"], button[aria-label="Buka Help Desk Aplikasi"]';

function json(routeBody: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(routeBody),
  };
}

async function installApiRoutes(page: Page) {
  await page.route("**/api/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === "/api/auth/me") {
      await route.fulfill(json({ user: null }));
      return;
    }

    if (pathname === "/api/radar/articles") {
      await route.fulfill(json({ articles: [], sources: [] }));
      return;
    }

    await route.fulfill(json({}));
  });
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

async function assertTargetIsTouchable(
  page: Page,
  locator: Locator,
  viewport: (typeof RESPONSIVE_VIEWPORTS)[number],
  label: string,
) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  assert.ok(box, `${label} harus memiliki posisi yang terlihat`);
  assert.ok(box.width > 0 && box.height > 0, `${label} harus memiliki ukuran yang terlihat`);
  assert.ok(box.y < viewport.height && box.y + box.height > 0, `${label} harus berada di viewport`);

  const isTarget = await locator.evaluate((element, point) => {
    const target = document.elementFromPoint(point.x, point.y);
    return target === element || Boolean(target && element.contains(target));
  }, {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  });
  assert.equal(isTarget, true, `${label} tidak boleh tertutup overlay saat disentuh`);

  const launchers = page.locator(LAUNCHER_SELECTOR);
  for (let index = 0; index < await launchers.count(); index += 1) {
    const launcher = launchers.nth(index);
    if (!(await launcher.isVisible())) continue;

    const launcherBox = await launcher.boundingBox();
    assert.ok(launcherBox, `${label}: launcher harus memiliki posisi yang dapat diperiksa`);
    assert.equal(
      overlaps(box, launcherBox),
      false,
      `${label} tidak boleh bertumpuk dengan launcher Radar/Bantuan`,
    );
  }

  return box;
}

async function assertNoLauncherOverlap(
  page: Page,
  locator: Locator,
  viewport: (typeof RESPONSIVE_VIEWPORTS)[number],
  label: string,
) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} harus memiliki posisi`);
  if (box.y >= viewport.height || box.y + box.height <= 0) return;

  const launchers = page.locator(LAUNCHER_SELECTOR);
  for (let index = 0; index < await launchers.count(); index += 1) {
    const launcher = launchers.nth(index);
    if (!(await launcher.isVisible())) continue;
    const launcherBox = await launcher.boundingBox();
    assert.ok(launcherBox, `${label}: launcher harus memiliki posisi yang dapat diperiksa`);
    assert.equal(
      overlaps(box, launcherBox),
      false,
      `${label} tidak boleh tertutup launcher saat berada di viewport awal`,
    );
  }
}

async function assertLaunchersAreTouchable(
  page: Page,
  viewport: (typeof RESPONSIVE_VIEWPORTS)[number],
) {
  const launchers = page.locator(LAUNCHER_SELECTOR);
  assert.equal(await launchers.count(), 2, `${viewport.name}: launcher Radar dan Bantuan harus tersedia`);

  for (let index = 0; index < await launchers.count(); index += 1) {
    const launcher = launchers.nth(index);
    await launcher.waitFor();
    const box = await launcher.boundingBox();
    assert.ok(box, `${viewport.name}: launcher harus memiliki posisi`);
    assert.ok(box.width >= 44 && box.height >= 44, `${viewport.name}: launcher harus memenuhi target sentuh minimum`);
    assert.ok(box.x >= 0 && box.x + box.width <= viewport.width, `${viewport.name}: launcher harus berada dalam lebar viewport`);
    assert.ok(box.y >= 0 && box.y + box.height <= viewport.height, `${viewport.name}: launcher harus berada dalam tinggi viewport`);

    const isTarget = await launcher.evaluate((element, point) => {
      const target = document.elementFromPoint(point.x, point.y);
      return target === element || Boolean(target && element.contains(target));
    }, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    });
    assert.equal(isTarget, true, `${viewport.name}: launcher harus menjadi target hit-test`);
  }
}

async function assertRouteAndContent(
  page: Page,
  locator: Locator,
  expectedPath: string,
  marker: RegExp,
  label: string,
) {
  await locator.click();
  await page.waitForURL((url) => new URL(url).pathname === expectedPath);
  assert.equal(new URL(page.url()).pathname, expectedPath, `${label} harus menuju ${expectedPath}`);
  await page.getByText(marker).first().waitFor();
  assert.match(await page.locator("body").innerText(), marker, `${label} tidak boleh membuka halaman kosong`);
}

async function runResponsiveScenario(
  browser: Browser,
  viewport: (typeof RESPONSIVE_VIEWPORTS)[number],
) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await installApiRoutes(page);

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

    const positioningBadge = page.getByText("● ASISTEN AI KHUSUS KETEKNIAN INDONESIA", { exact: true });
    const heroHeading = page.getByRole("heading", {
      level: 1,
      name: /RAB, tender, dan dokumen proyek lebih terarah dengan AI/,
    });
    await positioningBadge.waitFor();
    await heroHeading.waitFor();
    assert.match(
      await heroHeading.innerText(),
      /RAB, tender, dan dokumen proyek\s+lebih terarah dengan AI/,
      `${viewport.name}: teks hero berubah`,
    );
    assert.equal(pageErrors.length, 0, `${viewport.name} memunculkan error browser: ${pageErrors.join("; ")}`);
    await assertLaunchersAreTouchable(page, viewport);

    const registerCta = page.getByRole("link", { name: "Mulai Gratis →" });
    assert.equal(await registerCta.getAttribute("href"), "/register", `${viewport.name}: CTA pendaftaran harus menuju /register`);
    await assertTargetIsTouchable(page, registerCta, viewport, `${viewport.name}: CTA pendaftaran`);
    await assertRouteAndContent(
      page,
      registerCta,
      "/register",
      /Buat Akun Baru/,
      `${viewport.name}: CTA pendaftaran`,
    );

    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    const problemCta = page.getByRole("link", { name: "Lihat masalah yang bisa dirapikan" });
    assert.equal(await problemCta.getAttribute("href"), "#problem", `${viewport.name}: CTA masalah harus menjadi anchor #problem`);
    await assertTargetIsTouchable(page, problemCta, viewport, `${viewport.name}: CTA masalah`);
    await problemCta.click();
    await page.waitForURL((url) => new URL(url).hash === "#problem");
    const problemSection = page.locator("#problem");
    const problemBox = await problemSection.boundingBox();
    assert.ok(problemBox, `${viewport.name}: anchor #problem harus memiliki target`);
    assert.ok(problemBox.y < viewport.height && problemBox.y + problemBox.height > 0, `${viewport.name}: anchor #problem harus terlihat`);

    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    for (const card of HERO_CARDS) {
      const cardLink = page.locator(`a[href="${card.href}"]`).filter({ hasText: card.text });
      await assertNoLauncherOverlap(page, cardLink, viewport, `${viewport.name}: kartu ${card.text}`);
    }

    for (const card of HERO_CARDS) {
      await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
      const cardLink = page.locator(`a[href="${card.href}"]`).filter({ hasText: card.text });
      assert.equal(await cardLink.count(), 1, `${viewport.name}: kartu ${card.text} harus unik di hero`);
      assert.equal(await cardLink.getAttribute("href"), card.href, `${viewport.name}: kartu ${card.text} harus menuju ${card.href}`);
      await assertTargetIsTouchable(page, cardLink, viewport, `${viewport.name}: kartu ${card.text}`);
      await assertRouteAndContent(page, cardLink, card.href, card.marker, `${viewport.name}: kartu ${card.text}`);
    }

    console.log(`Responsive landing hero passed at ${viewport.name} (${viewport.width}x${viewport.height}).`);
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
    for (const viewport of RESPONSIVE_VIEWPORTS) {
      await runResponsiveScenario(browser, viewport);
    }
  } finally {
    await browser.close();
  }
}

await main();