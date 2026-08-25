---
name: Conversation context budgeting
description: Rules for preserving chat history safely when an LLM prompt needs compaction.
---

When a conversation exceeds the prompt budget, choose the retained recent-message suffix **once** after reserving the complete system-prompt wrapper and summary budget. Summarize exactly the omitted prefix in **one bounded model call**; do not recalculate a smaller suffix afterward, because that can silently drop boundary messages.

**Why:** System wrappers and per-message protocol overhead can displace a message at the context boundary. A separate final selection risks excluding that message from both the retained history and the summary. Unbounded chunk-and-merge compaction can turn one user request into many model calls, increasing latency and cost beyond the request limiter's protection.

**How to apply:** Validate aggregate history tokens before compaction so the omitted prefix fits one summary input, count system/message/retry-continuation overhead with the same conservative estimator used for truncation, and delimit the result as reference data with an instruction to ignore commands embedded inside it.