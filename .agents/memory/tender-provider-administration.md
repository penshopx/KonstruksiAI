---
name: Tender provider administration
description: Authorization scope and cost boundaries for shared Tender AI setup diagnostics.
---

Treat provider setup diagnostics as application administration, not workspace administration. Check the current account role rather than relying on the long-lived token's role.

**Why:** Tender uses shared application-level provider credentials and billing. Owning a project must not grant access to provider diagnostics, and demoted administrators must immediately lose permission.

**How to apply:** Keep probes separate from project analyses and history; use a fixed, document-free prompt with a small token budget, a short timeout, no retries, and an application-wide request limit. A successful probe is only a point-in-time connectivity result, not a guarantee of analysis quality or future credit availability.

Administrative audit attribution should survive account removal without retaining profile or contact snapshots.

**Why:** Removing an administrator account should not erase accountability for earlier shared-provider checks; retaining names or email addresses is unnecessary for this internal audit.

**How to apply:** Attribute checks to internal account IDs, not contact information, and keep the audit independent of account-deletion cascades.

Reconcile unfinished provider checks only after a bounded window longer than
the provider timeout, not merely because a new API process starts. An
interrupted check means its provider outcome is unknown, not that it was free
or safe to resend.

**Why:** Multiple processes can share the same SQLite file. Immediate startup
reconciliation would incorrectly terminate a live peer's check; automatic
redispatch could duplicate a billable request whose response was lost.

**How to apply:** Commit the minimal audit before provider I/O, finalize that
same row atomically, and let startup plus periodic recovery mark expired
checks interrupted without sending any probe.
