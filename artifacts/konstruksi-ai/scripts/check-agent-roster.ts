import assert from "node:assert/strict";
import { chromium, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/chat";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const TEST_AGENTS = [
  {
    id: "general",
    name: "KonstruksiAI",
    icon: "🏗️",
    description: "Asisten umum konstruksi & engineering",
    color: "orange",
  },
  {
    id: "tender",
    name: "Tender Expert",
    icon: "📋",
    description: "Ahli tender & pengadaan LPSE",
    color: "blue",
  },
];

function json(body: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  };
}

async function installApiRoutes(page: Page) {
  let chatRequestCount = 0;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname === "/api/chat/agents") {
      await route.fulfill(json({ agents: TEST_AGENTS }));
      return;
    }

    if (url.pathname === "/api/auth/me") {
      await route.fulfill(json({ user: null }));
      return;
    }

    if (url.pathname === "/api/chat" && request.method() === "POST") {
      chatRequestCount += 1;
      const isRetiredRecommendation = chatRequestCount === 1;
      const message = isRetiredRecommendation
        ? "Jawaban dengan rekomendasi lama. [[RECOMMENDED_AGENT: retired-agent]]"
        : "Jawaban dengan rekomendasi aktif.";
      const recommendedAgentId = isRetiredRecommendation ? "retired-agent" : "tender";
      const body = [
        `data: ${JSON.stringify({ agentId: "general", agentName: "KonstruksiAI" })}`,
        `data: ${JSON.stringify({ done: true, message, recommendedAgentId })}`,
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
      await route.fulfill(json({ articles: [], sources: [] }));
      return;
    }

    await route.fulfill(json({}));
  });
}

async function sendMessage(page: Page, message: string) {
  const composer = page.getByTestId("chat-composer");
  await composer.locator("textarea").fill(message);
  await page.getByTestId("chat-send").click();
}

async function main() {
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await installApiRoutes(page);

  try {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.getByTestId("chat-composer").waitFor();

    await page.getByRole("button", { name: /KonstruksiAI/ }).first().click();
    await page.getByRole("button", { name: /Tender Expert/ }).waitFor();
    assert.equal(await page.getByText("Estimator RAB", { exact: true }).count(), 0);
    await page.keyboard.press("Escape");

    await sendMessage(page, "Uji rekomendasi retired");
    await page.getByText("Jawaban dengan rekomendasi lama.", { exact: true }).waitFor();
    assert.equal(
      await page.getByRole("button", { name: /Beralih ke/ }).count(),
      0,
      "ID retired tidak boleh menghasilkan tombol rekomendasi",
    );
    assert.equal(
      await page.getByText("[[RECOMMENDED_AGENT:", { exact: false }).count(),
      0,
      "Marker teknis tidak boleh terlihat",
    );

    await sendMessage(page, "Uji rekomendasi valid");
    await page.getByText("Jawaban dengan rekomendasi aktif.", { exact: true }).waitFor();
    const switchButton = page.getByRole("button", { name: "Beralih ke Tender Expert" });
    await switchButton.waitFor();
    await switchButton.click();

    await page.getByRole("button", { name: /Tender Expert/ }).first().waitFor();
    console.log("Agent roster regression passed: retired recommendations are hidden and active agents remain switchable.");
  } finally {
    await context.close();
    await browser.close();
  }
}

await main();