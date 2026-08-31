---
name: Headless browser checks in this workspace
description: How to run a real headless-browser check (not just static/manifest analysis) inside an artifact package here.
---

Some regressions (e.g. a theme applied by client-side JS reading `document`
at runtime, or a computed layout size) cannot be caught by parsing source or
JSON manifests — they only show up after real browser JS execution.

- The workspace's Nix environment already provisions a working headless
  Chromium at `process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Add
  `playwright-core` (not full `playwright`, which tries to download its own
  browsers) as a devDependency of the specific artifact package, then launch
  with `chromium.launch({ executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE })`.
  No `playwright install` / browser download step is needed or possible in
  this environment.
- Such a script needs the target artifact's dev server already running
  (`WorkflowsRestart` its managed workflow first) since it navigates via HTTP
  to `localhost:<PORT><BASE_PATH>`.
- To make the check repeatable/triggerable (not just a one-off manual run),
  register it with the validation skill (`setValidationCommand` +
  `startValidationRun`) pointing at a `pnpm --filter @workspace/<slug> run
  <script>` command, mirroring how `validate-slides.ts`-style scripts are
  invoked via a package.json script + `tsx`.

**Why:** `playwright` (full package) fails/hangs trying to download browsers
in this sandboxed Nix environment; `playwright-core` + the pre-provisioned
executable path avoids that entirely and matches the already-installed
Chromium build.

For transient SSE states, do not promote a browser script that monkeypatches
`window.fetch` to a validation workflow until the exact package command passes
repeatedly. Keep retry/backoff/continuation policy in a deterministic server
helper test, and use the browser testing agent to verify short-lived UI states
when the local fetch-mocking script is not stable.

**Why:** In this workspace, equivalent init-script mocks could pass in an
isolated browser run and the testing agent but repeatedly miss the mocked stream
when packaged as a local validation command. A flaky validation would block
unrelated releases without increasing confidence.

**How to apply:** For streamed AI recovery, test attempt limits, backoff, partial
accumulation, and continuation messages without a browser. Use browser automation
for the visible retry/interrupted states, and only register it as a persistent
command after the command itself is repeatable.
