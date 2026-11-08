import assert from "node:assert/strict";
import test from "node:test";
import { fork, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import OpenAI from "openai";
import Database from "better-sqlite3";

// The same offline executable is booted in separate OS processes to exercise
// real file locks, response loss, and restarts, not just module-cache resets.
if (process.argv.includes("--offline-server")) {
  process.env.NODE_ENV = "production";
  process.env.OPENROUTER_API_KEY = "synthetic-not-a-real-key";
  OpenAI.prototype.request = (() => { throw new Error("Provider transport forbidden"); }) as never;
  OpenAI.Chat.Completions.prototype.create = (() => ({
    withResponse: async () => {
      process.send?.("provider-call");
      await new Promise(resolve => setTimeout(resolve, 700));
      return {
        data: { choices: [{ message: { content: JSON.stringify({
          completenessChecks: [{ documentType: "NPWP", completenessScore: 95, missingElements: [], notes: "Uji offline" }],
          risks: [], recommendations: ["Verifikasi NPWP"], complianceScore: 95, summary: {},
        }) } }] },
        response: { status: 200 }, request_id: "offline-request",
      };
    },
  })) as never;
  const { default: app } = await import("../app");
  const server = app.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (address && typeof address !== "string") process.send?.({ port: address.port });
  });
} else {
  test("durable Tender identity handles concurrency, response loss, restarts and authorization offline", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "tender-durable-"));
    const dbPath = path.join(dir, "test.db");
    const children: ChildProcess[] = [];
    let calls = 0;
    async function boot() {
      const child = fork(new URL(import.meta.url), ["--offline-server"], {
        env: { ...process.env, NODE_ENV: "production", API_SERVER_DB_PATH: dbPath, SESSION_SECRET: "offline-test-session-secret-123456789" },
        stdio: ["ignore", "ignore", "pipe", "ipc"],
      });
      children.push(child);
      child.on("message", message => { if (message === "provider-call") calls++; });
      let errors = "";
      child.stderr?.on("data", chunk => { errors += String(chunk); });
      const port = await new Promise<number>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Offline server did not start: ${errors}`)), 20_000);
        child.on("message", message => {
          if (message && typeof message === "object" && "port" in message) {
            clearTimeout(timeout); resolve(Number(message.port));
          }
        });
        child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${errors}`)); });
      });
      return { child, base: `http://127.0.0.1:${port}` };
    }
    const input = { projectName: "Proyek offline", documents: [
      { documentType: "NPWP", required: true, present: true, notes: "" },
    ] };
    const requestId = randomUUID();
    async function register(base: string) {
      const response = await fetch(`${base}/api/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Offline", email: `${randomUUID()}@example.test`, password: "offline-password-123" }),
      });
      assert.equal(response.status, 200);
      const body = await response.json() as { user: { id: number } };
      return { cookie: response.headers.get("set-cookie")!.split(";")[0], user: body.user };
    }
    function post(base: string, cookie: string, id = requestId, extra = {}, signal?: AbortSignal) {
      return fetch(`${base}/api/tender-intelligence/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify({ ...input, requestId: id, ...extra }), signal,
      });
    }
    function status(base: string, cookie: string, id = requestId, workspace = "") {
      return fetch(`${base}/api/tender-intelligence/requests/${id}${workspace ? `?workspaceId=${workspace}` : ""}`,
        { headers: { Cookie: cookie } });
    }
    async function waitCalls(expected: number) {
      const deadline = Date.now() + 5000;
      while (calls < expected && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(calls, expected);
    }
    async function kill(child: ChildProcess) {
      const exited = once(child, "exit");
      child.kill("SIGKILL");
      await exited;
    }
    try {
      let a = await boot();
      const owner = await register(a.base);
      const stranger = await register(a.base);
      const b = await boot();
      const first = post(a.base, owner.cookie);
      await waitCalls(1);
      const duplicates = await Promise.all([post(a.base, owner.cookie), post(b.base, owner.cookie)]);
      for (const duplicate of duplicates) assert.equal(duplicate.status, 202);
      assert.equal((await status(b.base, owner.cookie)).status, 202, "refresh reads running status");
      assert.equal((await post(b.base, owner.cookie, randomUUID())).status, 409, "different request blocked while active");
      assert.equal((await post(b.base, owner.cookie, requestId, { projectName: "Changed" })).status, 409);
      assert.equal((await first).status, 200);
      const replay = await (await post(b.base, owner.cookie)).json() as { executionId: string; result: { projectName: string } };
      assert.equal(replay.result.projectName, input.projectName);
      assert.equal(calls, 1);
      assert.equal((await status(b.base, stranger.cookie)).status, 404, "other account cannot read identity");

      // A dropped HTTP response does not cancel authoritative result storage.
      const lostId = randomUUID();
      const controller = new AbortController();
      const lost = post(a.base, owner.cookie, lostId, {}, controller.signal).catch(() => null);
      await waitCalls(2);
      controller.abort();
      await lost;
      let recovered = await status(b.base, owner.cookie, lostId);
      for (let i = 0; recovered.status === 202 && i < 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        recovered = await status(b.base, owner.cookie, lostId);
      }
      assert.equal(recovered.status, 200);
      assert.equal((await post(b.base, owner.cookie, lostId)).status, 200);
      assert.equal(calls, 2);
      await kill(a.child);
      a = await boot();
      assert.equal((await post(a.base, owner.cookie, lostId)).status, 200, "result survives process restart");
      assert.equal(calls, 2);

      // Crash after provider dispatch: never automatically invoke it again.
      const interruptedId = randomUUID();
      const interrupted = post(a.base, owner.cookie, interruptedId).catch(() => null);
      await waitCalls(3);
      await kill(a.child);
      await interrupted;
      a = await boot();
      assert.equal((await post(a.base, owner.cookie, interruptedId)).status, 202);
      assert.equal(calls, 3);
      const sqlite = new Database(dbPath);
      sqlite.prepare("UPDATE ai_execution_history SET updated_at = ? WHERE status = 'running'").run(Math.floor(Date.now() / 1000) - 1900);
      assert.equal((await post(a.base, owner.cookie, interruptedId)).status, 409, "interrupted terminal state is replayed");
      assert.equal(calls, 3);
      assert.equal((await post(a.base, owner.cookie, randomUUID())).status, 200, "new analysis is explicit");
      await waitCalls(4);

      const workspaceId = randomUUID();
      sqlite.prepare("INSERT INTO project_workspaces (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
        .run(workspaceId, owner.user.id, "Offline workspace", Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000));
      const scopedId = randomUUID();
      assert.equal((await post(a.base, stranger.cookie, scopedId, { workspaceId })).status, 403);
      assert.equal(calls, 4);
      assert.equal((await post(a.base, owner.cookie, scopedId, { workspaceId })).status, 200);
      assert.equal((await post(a.base, owner.cookie, scopedId)).status, 409, "cannot move identity to personal scope");
      assert.equal((await status(a.base, owner.cookie, scopedId)).status, 404);
      assert.equal((await status(a.base, stranger.cookie, scopedId, workspaceId)).status, 403);
      sqlite.prepare("UPDATE project_workspaces SET user_id = ? WHERE id = ?").run(stranger.user.id, workspaceId);
      assert.equal((await status(a.base, owner.cookie, scopedId, workspaceId)).status, 403, "current authorization required on replay");
      assert.equal((await post(a.base, owner.cookie, scopedId, { workspaceId })).status, 403);
      assert.equal(calls, 5);
      const independent = await post(a.base, stranger.cookie);
      assert.equal(independent.status, 200, "same opaque ID in another account creates an independent authorized run");
      const independentResult = await independent.json() as { executionId: string };
      assert.notEqual(independentResult.executionId, replay.executionId);
      assert.equal(calls, 6);
      sqlite.close();
    } finally {
      await Promise.all(children.filter(child => child.exitCode === null && child.signalCode === null).map(kill));
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
