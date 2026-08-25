---
name: Conversation context budgeting
description: Rules for preserving chat history safely when an LLM prompt needs compaction.
---

When a conversation exceeds the prompt budget, choose the retained recent-message suffix **once** after reserving the complete system-prompt wrapper and summary budget. Summarize exactly the omitted prefix; do not recalculate a smaller suffix afterward, because that can silently drop boundary messages.

**Why:** System wrappers and per-message protocol overhead can displace a message at the context boundary. A separate final selection risks excluding that message from both the retained history and the summary.

**How to apply:** Count system, message, and retry-continuation overhead with the same conservative estimator used for truncation. Split oversized historical messages into bounded source chunks before summarizing, and delimit the resulting summary as reference data with an instruction to ignore commands embedded inside it.