---
name: Tender request recovery boundaries
description: Why unknown provider outcomes must not be automatically dispatched again and the storage boundary for durable admission.
---

Recover an existing Tender request by reading its stored lifecycle and authoritative result; never redispatch that identity, including after a crash or timeout. A new attempt must be an explicit user action with a new identity.

**Why:** Without provider-side idempotency, a terminated HTTP connection or API process cannot prove whether a provider already performed billable work. Expiring a local execution is not proof that redispatch is free or safe.

**How to apply:** Keep request identity durable and scoped to the initiating account and immutable workspace context. Keep browser recovery references separate from project text. Treat input changes as a conflict, not permission to reuse an old identity.

SQLite admission protects processes sharing the same existing database file, not replicas with independent files.

**Why:** The project explicitly retains its current storage; a local SQLite transaction cannot coordinate independent deployment filesystems.

**How to apply:** Do not advertise cross-replica exactly-once execution without a separately approved shared-storage deployment design. Test process restarts and concurrent processes against one isolated shared file with provider transport blocked.

Cross-device discovery is for active requests, not a second completed-results history.

**Why:** The user explicitly requested recovery without overlapping the completed-results list. A fresh device needs enough information to follow an existing run, not permission to submit its input again.

**How to apply:** Keep discovered references read-only, retain account and immutable workspace boundaries, and let a device that already discovered a run read its eventual terminal status. Do not offer completed runs through active discovery.
