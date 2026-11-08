---
name: api-server HTTP integration tests
description: How to write a real end-to-end Express test for artifacts/api-server (boots the actual app over HTTP) without hanging or touching the dev database.
---

Pattern for testing `artifacts/api-server` routes end-to-end (not just pure
functions) via the real `app.ts`, following the existing `node:test` +
esbuild-bundle convention used by `test:radar` / `test:upload-security`:

- `src/db/index.ts` reads its SQLite path from `process.env.API_SERVER_DB_PATH`,
  falling back to the real dev `konstruksi.db`. A test must set this env var
  to a throwaway temp-file path, then **dynamically** `await import("../app")`
  (not a static top-level import) so the env var is set before the DB module's
  module-load side effects run.
- Bundling `app.ts` pulls in Express (and other CJS deps) through esbuild in
  `--format=esm` mode, which throws `Dynamic require of "node:events" is not
  supported` unless the bundle also gets a banner that shims a global
  `require` via `createRequire(import.meta.url)`.
- Set `NODE_ENV=production` for the test run so pino skips its
  worker-thread `pino-pretty` transport, which the plain esbuild test bundle
  isn't set up to resolve (avoids needing the `esbuildPluginPino` plugin used
  by the real `build.mjs`).

**Why:** several route files (`chat.ts`, `solver.ts`, `tender-intelligence.ts`)
register module-scope `setInterval(...)` rate-limit pruning without `.unref()`.
Importing `app.ts` starts these immediately, so once a test boots the app and
later force-closes the HTTP server, the Node process still never exits —
`node --test` just hangs with no error until an external timeout kills it.
These intervals were changed to `.unref()`'d as part of fixing this; if a
similar hang shows up after adding a new background timer to an api-server
route, unref it too.

**How to apply:** also call `server.closeAllConnections()` before
`server.close()` in the test's `after()` hook — `fetch()`'s keep-alive
connection pool otherwise keeps sockets open and `server.close()` alone waits
forever for them to drain.

## SDK import identity in bundled tests

Use the same public SDK entry point as runtime code when replacing provider
resource methods in an offline test.

**Why:** deep resource imports in the OpenAI SDK can pass TypeScript checks but
produce undefined exports through circular initialization in an esbuild bundle.
This is a test-bundle initialization issue, not a reason to add test hooks to
production routes.

**How to apply:** obtain SDK resource classes through the public SDK export;
keep a transport-level tripwire and synthetic credentials so an incorrectly
installed test double cannot make a real provider request.
