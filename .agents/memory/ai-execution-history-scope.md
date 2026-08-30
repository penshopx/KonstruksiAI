---
name: AI execution history scope
description: Boundary between operational run history and authoritative Solver or Tender result storage.
---

Execution history stores operational metadata only: lifecycle status, timestamps, bounded input summaries, retry lineage, safe errors, workspace context, and a result reference. Full Solver and Tender analysis payloads belong in their own authoritative result stores.

**Why:** Combining operational logs with full results would duplicate large payloads and create competing retention and access-control paths. A stable reference lets result-history features evolve independently while preserving an auditable execution trail.

**How to apply:** When extending Solver or Tender history, link the authoritative saved result to its execution record. Do not add full generated analyses to the execution metadata table.