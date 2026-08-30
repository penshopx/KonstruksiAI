// Regression tests for the "revoked member" boundary: once an owner cancels a
// workspace member's access, every workspace-tied surface (workspace reads,
// conversation list/read/write/replay, and chat context injection) must deny
// it immediately, even for rows created before the revocation. These tests
// exercise the real Express app end-to-end over HTTP against a throwaway
// SQLite database so future changes to conversation sync or chat routing
// cannot silently reopen access.
import assert from "node:assert/strict";
import test, { before, after } from "node:test";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Point the app at a throwaway database *before* anything imports "../db",
// so this suite never touches the real development database.
process.env.API_SERVER_DB_PATH = path.join(
  os.tmpdir(),
  `konstruksi-workspace-access-test-${randomUUID()}.db`,
);
// Avoid pino's worker-thread pretty-transport, which esbuild's test bundle
// does not set up; production mode logs synchronously to stdout instead.
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const { default: app } = await import("../app");
const { hasActiveWorkspaceAccess } = await import("../lib/workspace-access");
const { db, users } = await import("../db");
const { eq } = await import("drizzle-orm");
const { getEntitledChatMessages, canUseTokenStreaming } = await import("./chat");

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  // fetch() keeps idle keep-alive sockets open in its connection pool, so a
  // plain server.close() would hang waiting for them. Force-close every
  // connection first so the process can exit cleanly.
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

interface Session {
  userId: number;
  email: string;
  cookie: string;
}

let userCounter = 0;

async function registerUser(namePrefix: string): Promise<Session> {
  userCounter += 1;
  const email = `${namePrefix}-${userCounter}-${randomUUID()}@example.test`;
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: namePrefix, email, password: "password123" }),
  });
  assert.equal(res.status, 200, `register should succeed for ${email}`);
  const setCookie = res.headers.get("set-cookie");
  const match = /auth-token=([^;]+)/.exec(setCookie ?? "");
  assert.ok(match, "register response must set an auth-token cookie");
  const body = await res.json() as { user: { id: number; email: string } };
  return { userId: body.user.id, email: body.user.email, cookie: `auth-token=${match[1]}` };
}

async function grantProAccess(session: Session) {
  await db.update(users).set({ plan: "pro" }).where(eq(users.id, session.userId));
}

function authedFetch(session: Session, urlPath: string, init: RequestInit = {}) {
  return fetch(`${baseUrl}${urlPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: session.cookie,
      ...init.headers,
    },
  });
}

async function createWorkspace(owner: Session, name: string) {
  const res = await authedFetch(owner, "/api/project-workspaces", {
    method: "POST",
    body: JSON.stringify({ name, stageId: "tender", notes: "Catatan rahasia proyek" }),
  });
  assert.equal(res.status, 201);
  const { workspace } = await res.json() as { workspace: { id: string } };
  return workspace.id;
}

async function inviteMember(owner: Session, workspaceId: string, email: string, role: "viewer" | "editor" = "editor") {
  const res = await authedFetch(owner, `/api/project-workspaces/${workspaceId}/invitations`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  assert.equal(res.status, 201);
  const { invitation } = await res.json() as { invitation: { id: string; inviteToken: string } };
  return invitation;
}

async function acceptInvitation(member: Session, token: string) {
  return authedFetch(member, "/api/project-workspace-invitations/accept", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

async function revokeMember(owner: Session, workspaceId: string, memberId: string) {
  const res = await authedFetch(owner, `/api/project-workspaces/${workspaceId}/members/${memberId}`, {
    method: "DELETE",
  });
  assert.equal(res.status, 200);
}

async function getMemberRowId(owner: Session, workspaceId: string, member: Session) {
  const res = await authedFetch(owner, `/api/project-workspaces/${workspaceId}/members`);
  assert.equal(res.status, 200);
  const { members } = await res.json() as { members: Array<{ id: string; userId: number }> };
  const row = members.find((candidate) => candidate.userId === member.userId);
  assert.ok(row, "expected an active membership row for the invited member");
  return row.id;
}

async function setUpActiveMembership(namePrefix: string, memberNeedsCloud = false) {
  const owner = await registerUser(`${namePrefix}-owner`);
  const member = await registerUser(`${namePrefix}-member`);
  if (memberNeedsCloud) await grantProAccess(member);
  const workspaceId = await createWorkspace(owner, `${namePrefix} Workspace`);
  const invitation = await inviteMember(owner, workspaceId, member.email);
  const acceptRes = await acceptInvitation(member, invitation.inviteToken);
  assert.equal(acceptRes.status, 200);
  const memberId = await getMemberRowId(owner, workspaceId, member);
  return { owner, member, workspaceId, memberId };
}

test("new Free accounts are denied cloud conversation storage", async () => {
  const member = await registerUser("free-entitlement");

  const meRes = await authedFetch(member, "/api/auth/me");
  assert.equal(meRes.status, 200);
  const meBody = await meRes.json() as { user: { plan: string } };
  assert.equal(meBody.user.plan, "free");

  for (const [method, urlPath] of [
    ["GET", "/api/conversations"],
    ["POST", "/api/conversations"],
  ] as const) {
    const response = await authedFetch(member, urlPath, {
      method,
      ...(method === "POST" && {
        body: JSON.stringify({ title: "Tidak boleh tersimpan", agentId: "general" }),
      }),
    });
    assert.equal(response.status, 403);
    const body = await response.json() as { code?: string; feature?: string };
    assert.equal(body.code, "PRO_REQUIRED");
    assert.equal(body.feature, "cloud_history");
  }
});

test("Pro accounts can create and list cloud conversations", async () => {
  const member = await registerUser("pro-entitlement");
  await grantProAccess(member);

  const createRes = await authedFetch(member, "/api/conversations", {
    method: "POST",
    body: JSON.stringify({ title: "Percakapan Pro", agentId: "general" }),
  });
  assert.equal(createRes.status, 200);
  const { id } = await createRes.json() as { id: string };

  const listRes = await authedFetch(member, "/api/conversations");
  assert.equal(listRes.status, 200);
  const { conversations: listed } = await listRes.json() as {
    conversations: Array<{ id: string }>;
  };
  assert.ok(listed.some((conversation) => conversation.id === id));
});

test("Free chat retains five latest messages and never token-streams", () => {
  const history = Array.from({ length: 8 }, (_, index) => `message-${index + 1}`);
  assert.deepEqual(
    getEntitledChatMessages(history, false),
    ["message-4", "message-5", "message-6", "message-7", "message-8"],
  );
  assert.deepEqual(getEntitledChatMessages(history, true), history);
  assert.equal(canUseTokenStreaming(true, false), false);
  assert.equal(canUseTokenStreaming(true, true), true);
  assert.equal(canUseTokenStreaming(false, true), false);
});

test("member sees active workspace access before revocation", async () => {
  const { member, workspaceId } = await setUpActiveMembership("baseline");
  assert.equal(await hasActiveWorkspaceAccess(workspaceId, member.userId), true);

  const listRes = await authedFetch(member, "/api/project-workspaces");
  const { workspaces } = await listRes.json() as { workspaces: Array<{ id: string }> };
  assert.ok(workspaces.some((w) => w.id === workspaceId), "workspace should be listed while access is active");

  const getRes = await authedFetch(member, `/api/project-workspaces/${workspaceId}`);
  assert.equal(getRes.status, 200);
});

test("revoked member loses workspace list, read, and detail access", async () => {
  const { owner, member, workspaceId, memberId } = await setUpActiveMembership("revoke-workspace");

  await revokeMember(owner, workspaceId, memberId);

  assert.equal(await hasActiveWorkspaceAccess(workspaceId, member.userId), false);

  const listRes = await authedFetch(member, "/api/project-workspaces");
  assert.equal(listRes.status, 200);
  const { workspaces } = await listRes.json() as { workspaces: Array<{ id: string }> };
  assert.ok(!workspaces.some((w) => w.id === workspaceId), "revoked workspace must disappear from the member's list");

  const getRes = await authedFetch(member, `/api/project-workspaces/${workspaceId}`);
  assert.equal(getRes.status, 404, "revoked member must not be able to fetch the workspace directly");
  const getBody = await getRes.json() as { error?: string; workspace?: unknown };
  assert.equal(getBody.workspace, undefined);
});

test("revoked member is denied list, read, write, and replay on an existing workspace conversation", async () => {
  const { owner, member, workspaceId, memberId } = await setUpActiveMembership("revoke-conversation", true);

  // The member creates a conversation and a message while access is active.
  const createConvRes = await authedFetch(member, "/api/conversations", {
    method: "POST",
    body: JSON.stringify({ title: "Diskusi Proyek", agentId: "general", workspaceId }),
  });
  assert.equal(createConvRes.status, 200);
  const { id: conversationId } = await createConvRes.json() as { id: string };

  const postMsgRes = await authedFetch(member, `/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ role: "user", content: "Berapa estimasi biaya pondasi?" }),
  });
  assert.equal(postMsgRes.status, 200);

  // Sanity check: everything still works before revocation.
  const preRevokeRes = await authedFetch(member, `/api/conversations/${conversationId}`);
  assert.equal(preRevokeRes.status, 200);

  await revokeMember(owner, workspaceId, memberId);

  // Daftar (list): the workspace-tied conversation must not surface at all.
  const listRes = await authedFetch(member, "/api/conversations");
  assert.equal(listRes.status, 200);
  const { conversations } = await listRes.json() as { conversations: Array<{ id: string }> };
  assert.ok(
    !conversations.some((c) => c.id === conversationId),
    "revoked workspace conversation must not appear in the member's conversation list",
  );

  // Baca (read): fetching the conversation directly is rejected.
  const readRes = await authedFetch(member, `/api/conversations/${conversationId}`);
  assert.equal(readRes.status, 403);
  const readBody = await readRes.json() as { error?: string; conversation?: unknown; messages?: unknown };
  assert.equal(readBody.conversation, undefined, "403 body must not leak conversation data");
  assert.equal(readBody.messages, undefined, "403 body must not leak message data");

  // Replay: fetching just the message transcript is rejected the same way.
  const replayRes = await authedFetch(member, `/api/conversations/${conversationId}/messages`);
  assert.equal(replayRes.status, 403);
  const replayBody = await replayRes.json() as { messages?: unknown };
  assert.equal(replayBody.messages, undefined, "403 body must not leak message transcripts");

  // Tulis (write): appending a new message is rejected.
  const writeRes = await authedFetch(member, `/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ role: "user", content: "Masih bisa akses?" }),
  });
  assert.equal(writeRes.status, 403);

  // Renaming/labeling the conversation is rejected too.
  const patchRes = await authedFetch(member, `/api/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify({ title: "Rename setelah dicabut" }),
  });
  assert.equal(patchRes.status, 403);
});

test("chat endpoint always returns 403 for a revoked workspaceId and never injects its context", async () => {
  const { owner, member, workspaceId, memberId } = await setUpActiveMembership("revoke-chat", true);

  await revokeMember(owner, workspaceId, memberId);

  const chatRes = await authedFetch(member, "/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: [{ role: "user", content: "Halo, apa status proyek ini?" }],
      agentId: "general",
      stream: false,
      workspaceId,
    }),
  });
  assert.equal(chatRes.status, 403);
  const chatBody = await chatRes.json() as { error?: string };
  assert.ok(chatBody.error, "expected an explicit access-revoked error");

  // Creating a brand-new conversation against the revoked workspace must also
  // fail, so a client cannot route around the block by starting fresh.
  const newConvRes = await authedFetch(member, "/api/conversations", {
    method: "POST",
    body: JSON.stringify({ title: "Percakapan baru", agentId: "general", workspaceId }),
  });
  assert.equal(newConvRes.status, 404);
});

test("owner and unrelated third parties are unaffected by another workspace's revocation", async () => {
  const { owner, member, workspaceId, memberId } = await setUpActiveMembership("revoke-isolation");
  await revokeMember(owner, workspaceId, memberId);

  // The owner's own access is untouched.
  const ownerGet = await authedFetch(owner, `/api/project-workspaces/${workspaceId}`);
  assert.equal(ownerGet.status, 200);

  // An unrelated user never had access and still gets a clean 404, not a 403
  // that would confirm the workspace exists.
  const outsider = await registerUser("revoke-isolation-outsider");
  const outsiderGet = await authedFetch(outsider, `/api/project-workspaces/${workspaceId}`);
  assert.equal(outsiderGet.status, 404);
});

test("an invitation cancelled before acceptance always wins the race: the member never gains access", async () => {
  const owner = await registerUser("race-cancel-owner");
  const member = await registerUser("race-cancel-member");
  const workspaceId = await createWorkspace(owner, "Race Cancel Workspace");
  const invitation = await inviteMember(owner, workspaceId, member.email);

  const cancelRes = await authedFetch(owner, `/api/project-workspaces/${workspaceId}/invitations/${invitation.id}`, {
    method: "DELETE",
  });
  assert.equal(cancelRes.status, 200);

  const acceptRes = await acceptInvitation(member, invitation.inviteToken);
  assert.equal(acceptRes.status, 410, "accepting a cancelled invitation must fail");

  assert.equal(await hasActiveWorkspaceAccess(workspaceId, member.userId), false);
  const getRes = await authedFetch(member, `/api/project-workspaces/${workspaceId}`);
  assert.equal(getRes.status, 404);
});

test("accepting before a later cancel keeps the member's already-granted access", async () => {
  const owner = await registerUser("race-accept-owner");
  const member = await registerUser("race-accept-member");
  const workspaceId = await createWorkspace(owner, "Race Accept Workspace");
  const invitation = await inviteMember(owner, workspaceId, member.email);

  const acceptRes = await acceptInvitation(member, invitation.inviteToken);
  assert.equal(acceptRes.status, 200);

  // The owner's cancel arrives too late to matter: it only marks the
  // invitation record, it must not revoke the membership already granted.
  const cancelRes = await authedFetch(owner, `/api/project-workspaces/${workspaceId}/invitations/${invitation.id}`, {
    method: "DELETE",
  });
  assert.equal(cancelRes.status, 200);

  assert.equal(await hasActiveWorkspaceAccess(workspaceId, member.userId), true);
  const getRes = await authedFetch(member, `/api/project-workspaces/${workspaceId}`);
  assert.equal(getRes.status, 200);
});

test("concurrent accept-vs-cancel dispatch never leaves an inconsistent access state", async () => {
  const owner = await registerUser("race-concurrent-owner");
  const member = await registerUser("race-concurrent-member");
  const workspaceId = await createWorkspace(owner, "Race Concurrent Workspace");
  const invitation = await inviteMember(owner, workspaceId, member.email);

  const [acceptRes, cancelRes] = await Promise.all([
    acceptInvitation(member, invitation.inviteToken),
    authedFetch(owner, `/api/project-workspaces/${workspaceId}/invitations/${invitation.id}`, { method: "DELETE" }),
  ]);

  assert.ok([200, 410].includes(acceptRes.status), `unexpected accept status ${acceptRes.status}`);
  assert.equal(cancelRes.status, 200, "the owner's cancel request itself must always succeed");

  const hasAccess = await hasActiveWorkspaceAccess(workspaceId, member.userId);
  if (acceptRes.status === 200) {
    assert.equal(hasAccess, true, "a successful accept must always leave the member with real access");
  } else {
    assert.equal(hasAccess, false, "a rejected accept must never leave the member with access");
  }

  // The member-facing surface must agree with the underlying access check.
  const getRes = await authedFetch(member, `/api/project-workspaces/${workspaceId}`);
  assert.equal(getRes.status, hasAccess ? 200 : 404);
});
