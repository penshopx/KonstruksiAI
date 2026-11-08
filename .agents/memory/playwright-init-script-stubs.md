---
name: Playwright init-script stubs
description: Reliable browser-global test doubles in TypeScript Playwright scripts.
---

Use `page.addInitScript({ content: "..." })` for browser-global test doubles when a TypeScript callback appears to install successfully but receives no calls.

**Why:** In this workspace, a callback passed from a `tsx` regression script produced no visible error yet failed to install an Umami tracker stub; an equivalent literal content script worked deterministically.

**How to apply:** Prefer the callback form normally. If a direct JavaScript probe works but the TypeScript test records nothing, switch only the init stub to literal content and keep assertions against browser state.

The same serialization issue applies to `page.evaluate` callbacks that define named functions, including small React test hosts: tsx may inject a `__name` helper unavailable in the browser.

**Why:** An isolated hook host failed before rendering despite the browser successfully loading all modules; literal JavaScript evaluation removed the missing-helper dependency.

**How to apply:** Use a literal JavaScript expression for such hosts rather than adding compiler helpers to the application's global scope.