---
name: Tender provider administration
description: Authorization scope and cost boundaries for shared Tender AI setup diagnostics.
---

Treat provider setup diagnostics as application administration, not workspace administration. Check the current account role rather than relying on the long-lived token's role.

**Why:** Tender uses shared application-level provider credentials and billing. Owning a project must not grant access to provider diagnostics, and demoted administrators must immediately lose permission.

**How to apply:** Keep probes separate from project analyses and history; use a fixed, document-free prompt with a small token budget, a short timeout, no retries, and an application-wide request limit. A successful probe is only a point-in-time connectivity result, not a guarantee of analysis quality or future credit availability.
