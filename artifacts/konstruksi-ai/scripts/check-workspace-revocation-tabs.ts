import assert from "node:assert/strict";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";

const APP_URL = process.env.KONSTRUKSI_AI_TEST_URL ?? "http://localhost:80/chat";
const EXECUTABLE_PATH = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const WORKSPACE_ID = "workspace-revocation-browser-test";
const WORKSPACE_NAME = "Workspace Revocation Browser Test";
const WORKSPACE_NOTES = "Catatan workspace yang wajib hilang setelah revocation";
const PRIVATE_CONVERSATION_ID = "private-revocation-browser-test";
const WORKSPACE_CONVERSATION_ID = "workspace-conversation-revocation-browser-test";
const PRIVATE_TITLE = "PRIVATE REVOCATION BROWSER TEST";
const WORKSPACE_TITLE = "WORKSPACE REVOCATION BROWSER TEST";
const PENDING_SYNC_KEY = "konstruksi_pending_chat_sync_v1";
const LOCAL_CONVERSATIONS_KEY = "konstruksi_conversations";

interface AccessState {
  allowed: boolean;
}

interface RouteOptions {
  holdConversationList?: Promise<void>;
}

const now = new Date().toISOString();
const conversations = [
  {
    id: PRIVATE_CONVERSATION_ID,
    title: PRIVATE_TITLE,
    agentId: "general",
    workspaceId: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: WORKSPACE_CONVERSATION_ID,
    title: WORKSPACE_TITLE,
    agentId: "general",
    workspaceId: WORKSPACE_ID,
    createdAt: now,
    updatedAt: now,
  },
];
const storedConversations = conversations.map(conversation => ({
  ...conversation,
  messages: [],
}));

function json(routeBody: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    body: JSON.stringify(routeBody),
  };
}

async function installApiRoutes(
  page: Page,
  access: AccessState,
  options: RouteOptions = {},
) {
  await page.route("**/api/**", async route => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname === "/api/auth/me") {
      await route.fulfill(json({
        user: {
          userId: 101,
          id: 101,
          email: "revocation-browser@example.test",
          plan: "pro",
        },
      }));
      return;
    }

    if (url.pathname === `/api/project-workspaces/${WORKSPACE_ID}`) {
      if (!access.allowed) {
        await route.fulfill(json({
          error: "Ruang proyek tidak ditemukan",
          code: "WORKSPACE_ACCESS_REVOKED",
          workspaceId: WORKSPACE_ID,
        }, 404));
        return;
      }
      await route.fulfill(json({
        workspace: {
          id: WORKSPACE_ID,
          name: WORKSPACE_NAME,
          notes: WORKSPACE_NOTES,
          stageId: "execution",
          archivedAt: null,
          createdAt: now,
          updatedAt: now,
          accessRole: "editor",
          isOwner: false,
        },
      }));
      return;
    }

    if (url.pathname === "/api/conversations" && request.method() === "GET") {
      if (options.holdConversationList) await options.holdConversationList;
      await route.fulfill(json({ conversations }));
      return;
    }

    if (url.pathname === `/api/conversations/${WORKSPACE_CONVERSATION_ID}`) {
      if (!access.allowed) {
        await route.fulfill(json({
          error: "Akses ruang proyek telah dicabut",
          code: "WORKSPACE_ACCESS_REVOKED",
          workspaceId: WORKSPACE_ID,
        }, 403));
        return;
      }
      await route.fulfill(json({
        conversation: conversations[1],
        messages: [{
          id: "workspace-message",
          role: "assistant",
          content: "Pesan workspace yang wajib hilang.",
          createdAt: now,
        }],
      }));
      return;
    }

    if (url.pathname === "/api/upload") {
      await route.fulfill(json({
        filename: "workspace-evidence.txt",
        type: "text/plain",
        size: 18,
        content: "workspace evidence",
      }));
      return;
    }

    await route.fulfill(json({}));
  });
}

async function seedPersistedClientState(context: BrowserContext) {
  await context.addInitScript((seed) => {
    if (localStorage.getItem("__workspace_revocation_test_seeded")) return;
    localStorage.setItem("__workspace_revocation_test_seeded", "1");
    localStorage.setItem(seed.localConversationsKey, JSON.stringify(seed.conversations));
    localStorage.setItem(seed.pendingSyncKey, JSON.stringify([
      {
        id: "pending-private",
        ownerId: 999,
        localConversationId: seed.privateConversationId,
        title: seed.privateTitle,
        agentId: "general",
        workspaceId: null,
        role: "user",
        content: "private pending",
        createdAt: Date.now(),
      },
      {
        id: "pending-workspace",
        ownerId: 999,
        localConversationId: seed.workspaceConversationId,
        title: seed.workspaceTitle,
        agentId: "general",
        workspaceId: seed.workspaceId,
        role: "user",
        content: "workspace pending",
        createdAt: Date.now(),
      },
    ]));
  }, {
    localConversationsKey: LOCAL_CONVERSATIONS_KEY,
    pendingSyncKey: PENDING_SYNC_KEY,
    conversations: storedConversations,
    privateConversationId: PRIVATE_CONVERSATION_ID,
    privateTitle: PRIVATE_TITLE,
    workspaceConversationId: WORKSPACE_CONVERSATION_ID,
    workspaceTitle: WORKSPACE_TITLE,
    workspaceId: WORKSPACE_ID,
  });
}

async function attachWorkspaceEvidence(page: Page) {
  await page.locator('input[type="file"]').setInputFiles({
    name: "workspace-evidence.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("workspace evidence"),
  });
  await page.getByText("workspace-evidence.txt", { exact: true }).waitFor();
}

async function restorePersistedConversationFixture(page: Page) {
  await page.evaluate(({ key, conversations }) => {
    localStorage.setItem(key, JSON.stringify(conversations));
  }, { key: LOCAL_CONVERSATIONS_KEY, conversations: storedConversations });
}

async function assertRevokedState(page: Page, draftKey: string) {
  await page.waitForFunction(
    ({ workspaceId, privateTitle, workspaceTitle }) =>
      !new URL(window.location.href).searchParams.has("workspace")
      && document.body.innerText.includes(privateTitle)
      && !document.body.innerText.includes(workspaceTitle)
      && !document.body.innerText.includes(workspaceId),
    { workspaceId: WORKSPACE_ID, privateTitle: PRIVATE_TITLE, workspaceTitle: WORKSPACE_TITLE },
  );

  assert.equal(await page.locator("textarea").inputValue(), "");
  assert.equal(await page.getByText("workspace-evidence.txt", { exact: true }).count(), 0);
  assert.equal(await page.getByText(WORKSPACE_NAME, { exact: true }).count(), 0);
  assert.equal(await page.getByText(WORKSPACE_NOTES, { exact: true }).count(), 0);

  const persisted = await page.evaluate(({ pendingSyncKey, localConversationsKey, draftKey }) => ({
    draft: localStorage.getItem(draftKey),
    pending: JSON.parse(localStorage.getItem(pendingSyncKey) ?? "[]") as Array<{
      id: string;
      workspaceId?: string | null;
    }>,
    localConversations: JSON.parse(localStorage.getItem(localConversationsKey) ?? "[]") as Array<{
      id: string;
      workspaceId?: string | null;
    }>,
  }), {
    pendingSyncKey: PENDING_SYNC_KEY,
    localConversationsKey: LOCAL_CONVERSATIONS_KEY,
    draftKey,
  });

  assert.equal(persisted.draft, null);
  assert.deepEqual(persisted.pending.map(item => item.id), ["pending-private"]);
  assert.ok(persisted.pending.every(item => item.workspaceId !== WORKSPACE_ID));
  assert.deepEqual(persisted.localConversations.map(item => item.id), [PRIVATE_CONVERSATION_ID]);
}

async function runActiveConversationScenario(browser: Browser) {
  const context = await browser.newContext();
  await seedPersistedClientState(context);
  const access = { allowed: true };
  const detector = await context.newPage();
  const observer = await context.newPage();
  await Promise.all([
    installApiRoutes(detector, access),
    installApiRoutes(observer, access),
  ]);

  await Promise.all([
    detector.goto(`${APP_URL}?workspace=${WORKSPACE_ID}`),
    observer.goto(`${APP_URL}?workspace=${WORKSPACE_ID}`),
  ]);
  await observer.getByText(WORKSPACE_TITLE, { exact: true }).waitFor();
  await observer.getByText(WORKSPACE_TITLE, { exact: true }).click();
  await observer.getByText(WORKSPACE_NAME, { exact: true }).waitFor();
  await observer.locator("textarea").fill("Draft aktif workspace");
  await observer.waitForFunction(
    key => localStorage.getItem(key) === "Draft aktif workspace",
    `konstruksi_draft_${WORKSPACE_CONVERSATION_ID}`,
  );
  await attachWorkspaceEvidence(observer);
  await restorePersistedConversationFixture(observer);

  access.allowed = false;
  await detector.reload();
  await assertRevokedState(observer, `konstruksi_draft_${WORKSPACE_CONVERSATION_ID}`);
  await context.close();
}

async function runNewConversationAndLateHydrationScenario(browser: Browser) {
  const context = await browser.newContext();
  await seedPersistedClientState(context);
  const access = { allowed: true };
  let releaseConversationList!: () => void;
  const heldConversationList = new Promise<void>(resolve => {
    releaseConversationList = resolve;
  });
  const detector = await context.newPage();
  const observer = await context.newPage();
  await installApiRoutes(detector, access);
  await installApiRoutes(observer, access, { holdConversationList: heldConversationList });

  await detector.goto(`${APP_URL}?workspace=${WORKSPACE_ID}`);
  await observer.goto(`${APP_URL}?workspace=${WORKSPACE_ID}`, { waitUntil: "domcontentloaded" });
  await observer.getByText(WORKSPACE_NAME, { exact: true }).waitFor();
  await observer.locator("textarea").fill("Draft chat baru workspace");
  await observer.waitForFunction(
    key => localStorage.getItem(key) === "Draft chat baru workspace",
    "konstruksi_draft_new",
  );
  await attachWorkspaceEvidence(observer);
  await restorePersistedConversationFixture(observer);

  access.allowed = false;
  await detector.reload();
  await observer.waitForFunction(() => !new URL(window.location.href).searchParams.has("workspace"));
  releaseConversationList();
  await assertRevokedState(observer, "konstruksi_draft_new");
  await context.close();
}

async function main() {
  assert.ok(EXECUTABLE_PATH, "REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE is required");
  const browser = await chromium.launch({ executablePath: EXECUTABLE_PATH, headless: true });
  try {
    await runActiveConversationScenario(browser);
    await runNewConversationAndLateHydrationScenario(browser);
    console.log("Workspace revocation cross-tab browser checks passed.");
  } finally {
    await browser.close();
  }
}

await main();