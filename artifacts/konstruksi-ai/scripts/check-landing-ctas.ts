import assert from "node:assert/strict";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const DESKTOP_VIEWPORTS = [
  { name: "wide desktop", width: 1440, height: 900 },
  { name: "short desktop", width: 1280, height: 600 },
  { name: "compact desktop", width: 1024, height: 768 },
] as const;

const HERO_TEXT = "RAB, tender, dan dokumen proyek";
const OUTCOMES = [
  { name: "RAB & Estimasi", href: "/tools" },
  { name: "Tender & Dokumen", href: "/tender" },
  { name: "Legal & K3", href: "/legal-licensing" },
] as const;

function json(body: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  };
}

async function installApiRoutes(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname === "/api/auth/me") {
      await route.fulfill(json({ user: null }));
      return;
    }

    if (url.pathname === "/api/radar/articles") {
      await route.fulfill(json({ articles: [], sources: [] }));
      return;
    }

    await route.fulfill(json({}));
  });
}

async function assertHitTestTarget(locator: Locator, label: string) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  assert.ok(box, `${label} harus terlihat`);

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

async function assertCtaNotCoveredByLaunchers(
  page: Page,
  cta: Locator,
  label: string,
) {
  const ctaBox = await assertHitTestTarget(cta, label);
  for (const launcherName of ["Buka Radar Harian", "Buka Help Desk Aplikasi"]) {
    const launcher = page.getByRole("button", { name: launcherName });
    const launcherBox = await launcher.boundingBox();
    assert.ok(launcherBox, `${label}: ${launcherName} harus memiliki posisi`);
    assert.equal(
      overlaps(ctaBox, launcherBox),
      false,
      `${label}: ${launcherName} tidak boleh menutupi CTA`,
    );
  }
}

async function assertLanding(page: Page, viewport: (typeof DESKTOP_VIEWPORTS)[number]) {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") pageErrors.push(message.text());
  });

  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  const heroHeading = page.getByRole("heading", { name: new RegExp(HERO_TEXT) });
  await heroHeading.waitFor();

  assert.equal(pageErrors.length, 0, `${viewport.name} memunculkan error browser: ${pageErrors.join("; ")}`);

  const registerCta = page.getByRole("link", { name: /Mulai Gratis/ });
  assert.equal(await registerCta.getAttribute("href"), "/register", "CTA Mulai Gratis harus menuju /register");
  await assertCtaNotCoveredByLaunchers(page, registerCta, `${viewport.name} CTA Mulai Gratis`);

  const problemLink = page.getByRole("link", { name: "Lihat masalah yang bisa dirapikan" });
  assert.equal(await problemLink.getAttribute("href"), "#problem", "CTA masalah harus menuju #problem");
  await assertHitTestTarget(problemLink, `${viewport.name} CTA masalah`);

  for (const outcome of OUTCOMES) {
    const card = page.getByRole("link", { name: new RegExp(outcome.name) });
    assert.equal(await card.getAttribute("href"), outcome.href, `${outcome.name} harus menuju ${outcome.href}`);
    await assertCtaNotCoveredByLaunchers(page, card, `${viewport.name} kartu ${outcome.name}`);
  }
}

async function assertNavigation(page: Page) {
  const navigationCases = [
    { name: /Mulai Gratis/, href: "/register", label: "CTA Mulai Gratis" },
    { name: /RAB & Estimasi/, href: "/tools", label: "kartu RAB & Estimasi" },
    { name: /Tender & Dokumen/, href: "/tender", label: "kartu Tender & Dokumen" },
    { name: /Legal & K3/, href: "/legal-licensing", label: "kartu Legal & K3" },
  ] as const;

  for (const item of navigationCases) {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    const link = page.getByRole("link", { name: item.name });
    await Promise.all([
      page.waitForURL((url) => url.pathname === item.href),
      link.click(),
    ]);
    assert.equal(page.url().endsWith(item.href), true, `${item.label} harus membuka ${item.href}`);
    assert.equal(await page.locator("body").innerText().then((text) => text.trim().length > 0), true, `${item.label} membuka halaman blank`);
  }
}

async function main() {
  assert.ok(EXECUTABLE_PATH, "REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE is required");
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });

  try {
    const context = await browser.newContext({ viewport: DESKTOP_VIEWPORTS[0] });
    const page = await context.newPage();
    await installApiRoutes(page);
    await assertLanding(page, DESKTOP_VIEWPORTS[0]);
    await assertNavigation(page);
    await context.close();

    for (const viewport of DESKTOP_VIEWPORTS.slice(1)) {
      const viewportContext = await browser.newContext({ viewport });
      const viewportPage = await viewportContext.newPage();
      await installApiRoutes(viewportPage);
      await assertLanding(viewportPage, viewport);
      await viewportContext.close();
      console.log(`Landing CTA check passed at ${viewport.name} (${viewport.width}x${viewport.height}).`);
    }

    console.log("Landing CTA navigation passed for /register, /tools, /tender, and /legal-licensing.");
  } finally {
    await browser.close();
  }
}

await main();