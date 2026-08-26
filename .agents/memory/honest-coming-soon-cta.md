---
name: Honest coming-soon CTA pattern
description: How to word pricing/marketing content for a tier that has no real payment system yet, without misleading users.
---

When a pricing or plan-comparison surface describes a tier that isn't actually purchasable yet (no billing integration, no gating), never let the CTA or FAQ text imply an active purchase/trial flow (e.g. "Start your 7-day free trial", specific payment methods, upgrade/downgrade billing cycles). That is a false claim, not just optimistic copy.

Instead: label the tier consistently (e.g. "Segera Hadir" / "Coming soon") on every surface that mentions it, route its CTA to something that is actually true today (e.g. sign up for the free tier that already works, or a real contact-sales mailto), and answer FAQ questions about payment/trials honestly ("not available yet").

**Why:** KonstruksiAI's pricing page showed Pro as immediately purchasable ("Mulai Pro — 7 Hari Gratis", specific payment methods in FAQ) while the landing page's own comparison table already said Pro was "Segera hadir" — a direct contradiction, and no billing system exists anywhere in the codebase.

**How to apply:** Before editing plan/pricing copy, grep for tier-gating logic (subscription/billing/isPro fields) in the codebase. If none exists, every surface describing that tier must consistently say "coming soon" and every CTA/FAQ claim about it must be checked against what's actually implemented (e.g. verify the LLM model name claimed is the one actually called server-side).
