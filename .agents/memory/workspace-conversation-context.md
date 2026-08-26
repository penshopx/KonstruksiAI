---
name: Workspace conversation context
description: Safe propagation and reconciliation of project workspace context across routed features and chat history.
---

Workspace context must use the browser query string rather than assuming a client router location includes it. In Chat, the saved workspace origin of the selected conversation is authoritative over any ambient URL context; an unscoped conversation actively clears an older context.

**Why:** Some client router location hooks expose only the pathname. Retaining a prior workspace while opening another conversation can display or send the wrong project’s notes to AI.

**How to apply:** Validate workspace ownership server-side, keep only the workspace ID in navigation URLs, and disable project-scoped actions until the resolved workspace ID exactly matches the selected conversation’s saved origin.