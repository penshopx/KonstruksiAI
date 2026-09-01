---
name: Browser validation resource locking
description: Why browser checks in this workspace must share a process lock during completion validation.
---

KonstruksiAI Playwright checks should share a single cross-process lock instead of launching Chromium instances concurrently.

**Why:** Completion validation runs registered gates in parallel. Multiple Chromium checks competing with the API build-race test caused silent browser exit 13 and native test process signals even though every check passed in isolation.

**How to apply:** Any new KonstruksiAI browser validation should use the existing shared lock. When diagnosing a completion-only failure with no assertion stack, reproduce the full parallel validation pattern before treating it as a product regression.