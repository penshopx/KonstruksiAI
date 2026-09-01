import assert from "node:assert/strict";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const HERO_VIEWPORTS = [
  { name: "desktop lebar", width: 1440, height: 900 },
  { name: "desktop pendek", width: 1280, height: 560 },
  { name: "tablet", width: 834, height: 768 },
  { name: "mobile web", width: 390, height: 844 },
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

function json(routeBody: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(routeBody),
  };
}

async function installApiRoutes(page: Page) {
  await page.route("**/api/**", async route => {
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

async function assertVisibleInViewport(
  locator: Locator,
  viewport: (typeof HERO_VIEWPORTS)[number],
  label: string,
) {
  await locator.waitFor();
  const box = await locator.boundingBox();
  assert.ok(box, `${label} harus memiliki posisi yang terlihat`);
  assert.ok(box.width > 0 && box.height > 0, `${label} harus memiliki ukuran yang terlihat`);
  assert.ok(box.y >= 0 && box.y < viewport.height, `${label} harus berada di viewport`);
  return box;
}

async function assertHitTestTarget(
  page: Page,
  locator: Locator,
  viewport: (typeof HERO_VIEWPORTS)[number],
  label: string,
) {
  await locator.scrollIntoViewIfNeeded();
  const box = await assertVisibleInViewport(locator, viewport, label);
  const isTarget = await locator.evaluate((element, point) => {
    const target = document.elementFromPoint(point.x, point.y);
    return target === element || Boolean(target && element.contains(target));
  }, {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  });

  assert.equal(isTarget, true, `${label} tidak boleh tertutup overlay saat diklik`);

  const chatbotLaunchers = page.locator(
    'button[aria-label="Buka Radar Harian"], button[aria-label="Buka Help Desk Aplikasi"]',
  );
  for (let index = 0; index < await chatbotLaunchers.count(); index += 1) {
    const launcher = chatbotLaunchers.nth(index);
    if (!(await launcher.isVisible())) continue;
    const launcherBox = await launcher.boundingBox();
    assert.ok(launcherBox, `${label}: tombol chatbot harus memiliki posisi yang dapat diperiksa`);
    assert.equal(
      overlaps(box, launcherBox),
      false,
      `${label} tidak boleh bertumpuk dengan tombol chatbot`,
    );
  }

  return box;
}

async function assertRouteAndContent(
  page: Page,
  locator: Locator,
  expectedPath: string,
  marker: RegExp,
  label: string,
) {
  await locator.click();
  await page.waitForURL(url => new URL(url).pathname === expectedPath);
  assert.equal(new URL(page.url()).pathname, expectedPath, `${label} harus menuju ${expectedPath}`);
  await page.getByText(marker).first().waitFor();
  const bodyText = await page.locator("body").innerText();
  assert.match(bodyText, marker, `${label} tidak boleh membuka halaman kosong`);
}

async function runViewportScenario(
  browser: Browser,
  viewport: (typeof HERO_VIEWPORTS)[number],
) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  await installApiRoutes(page);

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

    const positioningBadge = page.getByText("● ASISTEN AI KHUSUS KETEKNIAN INDONESIA", { exact: true });
    const heroHeading = page.getByRole("heading", {
      level: 1,
      name: /RAB, tender, dan dokumen proyek lebih terarah dengan AI/,
    });
    await assertVisibleInViewport(positioningBadge, viewport, `${viewport.name}: positioning badge`);
    const headingBox = await assertVisibleInViewport(heroHeading, viewport, `${viewport.name}: hero heading`);
    assert.ok(
      Math.abs(headingBox.x + headingBox.width / 2 - viewport.width / 2) < 2,
      `${viewport.name}: hero heading harus diposisikan di tengah`,
    );
    assert.match(
      await heroHeading.innerText(),
      /RAB, tender, dan dokumen proyek\s+lebih terarah dengan AI/,
      `${viewport.name}: teks hero berubah`,
    );

    const registerCta = page.getByRole("link", { name: "Mulai Gratis →" });
    assert.equal(await registerCta.getAttribute("href"), "/register", "CTA pendaftaran harus tetap menuju /register");
    await assertHitTestTarget(page, registerCta, viewport, `${viewport.name}: CTA pendaftaran`);
    await assertRouteAndContent(
      page,
      registerCta,
      "/register",
      /Buat Akun Baru/,
      `${viewport.name}: CTA pendaftaran`,
    );

    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    const problemCta = page.getByRole("link", { name: "Lihat masalah yang bisa dirapikan" });
    assert.equal(await problemCta.getAttribute("href"), "#problem", "CTA masalah harus tetap menjadi anchor #problem");
    await problemCta.click();
    await page.waitForURL(url => new URL(url).hash === "#problem");
    const problemSection = page.locator("#problem");
    const problemBox = await assertVisibleInViewport(problemSection, viewport, `${viewport.name}: anchor #problem`);
    assert.ok(problemBox.y >= 0, `${viewport.name}: anchor #problem harus menggulir ke bagian masalah`);

    for (const card of HERO_CARDS) {
      await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
      const cardLink = page.locator(`a[href="${card.href}"]`).filter({ hasText: card.text });
      assert.equal(await cardLink.count(), 1, `${viewport.name}: kartu ${card.text} harus unik di hero`);
      assert.match(
        await cardLink.innerText(),
        new RegExp(`${card.text}|Buka alatnya`),
        `${viewport.name}: teks kartu ${card.text} berubah`,
      );
      await assertHitTestTarget(page, cardLink, viewport, `${viewport.name}: kartu ${card.text}`);
      await assertRouteAndContent(
        page,
        cardLink,
        card.href,
        card.marker,
        `${viewport.name}: kartu ${card.text}`,
      );
    }

    console.log(`Landing hero passed at ${viewport.name} (${viewport.width}x${viewport.height}).`);
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
    for (const viewport of HERO_VIEWPORTS) {
      await runViewportScenario(browser, viewport);
    }
  } finally {
    await browser.close();
  }
}

await main();