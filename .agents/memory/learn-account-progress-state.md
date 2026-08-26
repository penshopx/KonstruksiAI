---
name: Learn account progress state
description: Rules for separating anonymous progress from unverified or signed-in account progress.
---

Account-scoped Learn progress has three distinct client states: confirmed anonymous/local, confirmed
account-backed, and unverified/error. Only the first two may accept a completion write; the
unverified state must stay read-only with a retryable explanation.

**Why:** Treating an unavailable account lookup as anonymous can write a completion only to device
storage for a signed-in learner, which makes the UI appear successful while cross-device progress is
not actually saved.

**How to apply:** Any later personal sync feature that checks identity asynchronously must preserve
the lookup result and disable account-sensitive mutations until identity and remote state are known.