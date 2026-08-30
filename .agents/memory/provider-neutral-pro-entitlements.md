---
name: Provider-neutral Pro entitlements
description: Records the product decision to separate Pro access control from the eventual external payment provider.
---

Keep Pro entitlements provider-neutral and server-owned. Do not embed an external payment provider or imply that checkout is live until a later integration is explicitly approved.

**Why:** The user explicitly deferred external payment integration. Pro access controls are needed now, while activation will be connected later through a trusted webhook or checkout mechanism.

**How to apply:** Default new accounts to Free, enforce Pro-only capabilities on the server, and only let a future authenticated server-side payment callback activate Pro. Keep “Segera Hadir” wording until that activation path is genuinely live.