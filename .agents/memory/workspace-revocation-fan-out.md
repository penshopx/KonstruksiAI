---
name: Workspace revocation fan-out
description: Security invariant for removing revoked workspace context from every active and persisted client surface.
---

Treat a confirmed workspace access denial as an account-wide browser invalidation for that workspace. Remove its visible context, workspace-bound conversations, drafts, and pending writes across open tabs and persisted client state, while preserving unrelated personal conversations.

**Why:** A server-side permission check prevents new data access, but another already-open tab can still display trusted names, notes, or cached messages and can keep retrying queued writes until it learns about the revocation.

**How to apply:** Any new workspace-aware client cache, offline queue, history surface, or browser tab must subscribe to the same invalidation boundary and filter strictly by workspace identity. Guard late hydration responses with the invalidated workspace set, and never persist a temporary anonymous/empty state before authentication resolves. Authentication failures are not workspace revocations and must not trigger this purge.