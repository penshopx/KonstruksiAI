---
name: Provider-neutral Pro entitlements
description: Records the product decision to separate Pro access control from the eventual external payment provider.
---

Keep Pro entitlements provider-neutral and server-owned. A new paid subscription must bind to an opaque, expiring checkout intent created for the signed-in account. Validate the exact plan, amount, currency, paid status, and event time before changing access. Never let later webhook metadata transfer an existing subscription between accounts, and derive the account plan from all active subscriptions rather than the last event alone.

**Why:** Payment metadata can be replayed, reordered, or changed between events. Directly trusting mutable identifiers or applying the latest received event can grant Pro to the wrong account, resurrect cancelled access, or revoke access while another valid subscription remains active.

**How to apply:** Default new accounts to Free and enforce Pro capabilities on the server. Keep checkout disabled and clearly labeled until a real provider, signed webhook secret, product terms, and checkout URL are configured and tested end to end.