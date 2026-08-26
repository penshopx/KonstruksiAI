/// <reference types="node" />
/**
 * Browser-level check that the screen and print handout renderings of the
 * deck stay in sync.
 *
 * A slide edit can silently desynchronize `/allslides` (screen) from
 * `/allslides?theme=print` (the print handout) — e.g. a slide added only to
 * one theme's DOM, a broken 1920x1080 export frame, or the print theme
 * failing to apply. Static analysis can't catch this because the theme is
 * applied by client-side JS (`src/theme.ts`) reading `document.documentElement`
 * at runtime, so this script drives a real headless browser.
 *
 * Usage:
 *   pnpm --filter @workspace/konstruksi-pitch-deck run check-print-sync
 *
 * Requires the deck's dev server to be running (see `DECK_BASE_URL` below).
 */
import { chromium } from 'playwright-core';

const port = process.env.PORT ?? '26128';
const basePath = process.env.BASE_PATH ?? '/konstruksi-pitch-deck/';
const baseUrl =
  process.env.DECK_BASE_URL ??
  `http://localhost:${port}${basePath.endsWith('/') ? basePath : `${basePath}/`}`;

type ExportSnapshot = {
  deckTheme: string | undefined;
  slideCount: number;
  slideSizes: { width: number; height: number }[];
};

async function readExport(
  page: import('playwright-core').Page,
  url: string,
): Promise<ExportSnapshot> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.slide', { timeout: 10_000 });

  return page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    return {
      deckTheme: document.documentElement.dataset.deckTheme,
      slideCount: slides.length,
      slideSizes: slides.map((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      }),
    };
  });
}

function describeSizeMismatches(
  snapshot: ExportSnapshot,
  label: string,
  issues: string[],
) {
  snapshot.slideSizes.forEach((size, index) => {
    if (size.width !== 1920 || size.height !== 1080) {
      issues.push(
        `${label}: slide ${index + 1} export frame is ${size.width}x${size.height}, expected 1920x1080`,
      );
    }
  });
}

async function main() {
  const chromiumExecutable = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (!chromiumExecutable) {
    console.error(
      'Missing REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE — this script requires the ' +
        'Replit-provisioned headless Chromium to run.',
    );
    process.exitCode = 1;
    return;
  }

  const issues: string[] = [];
  const browser = await chromium.launch({ executablePath: chromiumExecutable });

  try {
    const page = await browser.newPage();

    let screenExport: ExportSnapshot;
    let printExport: ExportSnapshot;
    try {
      screenExport = await readExport(page, `${baseUrl}allslides`);
      printExport = await readExport(page, `${baseUrl}allslides?theme=print`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to load the deck at ${baseUrl} — is the dev server running? (${message})`,
      );
      process.exitCode = 1;
      return;
    }

    if (screenExport.slideCount === 0) {
      issues.push('/allslides rendered zero .slide elements');
    }

    if (screenExport.slideCount !== printExport.slideCount) {
      issues.push(
        `Slide count mismatch: /allslides has ${screenExport.slideCount} slides, ` +
          `/allslides?theme=print has ${printExport.slideCount} slides`,
      );
    }

    describeSizeMismatches(screenExport, '/allslides', issues);
    describeSizeMismatches(printExport, '/allslides?theme=print', issues);

    if (screenExport.deckTheme !== 'screen') {
      issues.push(
        `/allslides should be screen-themed (data-deck-theme="screen"), found "${screenExport.deckTheme}"`,
      );
    }

    if (printExport.deckTheme !== 'print') {
      issues.push(
        `/allslides?theme=print should be print-themed (data-deck-theme="print"), found "${printExport.deckTheme}"`,
      );
    }

    if (issues.length > 0) {
      console.error(`Screen/print sync check failed (${issues.length} issue(s)):\n`);
      for (const issue of issues) {
        console.error(`- ${issue}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log(
      `✓ Screen and print exports are in sync (${screenExport.slideCount} slides, ` +
        `1920x1080, screen/print themes both applied)`,
    );
  } finally {
    await browser.close();
  }
}

await main();
