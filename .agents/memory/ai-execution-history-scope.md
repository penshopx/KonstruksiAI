---
name: AI execution history scope
description: Boundary between operational run history and authoritative Solver or Tender result storage.
---

Execution history stores operational metadata only: lifecycle status, timestamps, bounded input summaries, retry lineage, safe errors, workspace context, and a result reference. Full Solver and Tender analysis payloads belong in their own authoritative result stores.

**Why:** Combining operational logs with full results would duplicate large payloads and create competing retention and access-control paths. A stable reference lets result-history features evolve independently while preserving an auditable execution trail.

Saving the authoritative result, writing its reference, and marking the execution successful must be one transaction. Persisted model output must be rendered with raw HTML disabled or escaped before formatter-controlled markup is added.

**Why:** A partial write creates hidden results attached to failed executions, while prompt-influenced persisted HTML turns a one-time model response into stored XSS whenever the result is reopened.

**How to apply:** When extending Solver or Tender history, link the authoritative saved result to its execution record without adding full analyses to the metadata table. Reuse the atomic completion and safe-rendering rules for every reopenable model result.