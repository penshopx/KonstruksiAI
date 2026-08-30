---
name: Concurrent task merges
description: Workspace behavior to account for when an assigned task merge happens during implementation.
---

When an automatic task merge occurs while local changes are uncommitted, re-check the working tree and the exact target files before continuing; overlapping route/page edits can be replaced while unrelated schema or newly added files remain.

**Why:** A Tender history implementation had to be reapplied after a concurrent task merge replaced the latest route and page changes, which was only visible through typecheck and git status.

**How to apply:** After any task-state update during an active build, run a focused status/diff check before relying on earlier edits, and reapply only the missing hunks against the current file contents.