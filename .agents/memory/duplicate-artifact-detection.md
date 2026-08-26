---
name: Duplicate artifact detection
description: How to tell which of two near-identical artifacts is the live one before touching either.
---

When a project has two similarly-named artifacts that look like they do the same job (e.g. two "promo video" artifacts), don't assume which is canonical from naming or git recency alone.

Grep the rest of the codebase for literal references to each artifact's slug/path (iframe `src`, links, imports). The one actually referenced by production-facing code (e.g. the landing page) is the live one; an artifact with zero references is very likely an abandoned duplicate left over from earlier iteration, even if it still has a running workflow.

**Why:** Two konstruksi-promo* video artifacts existed side by side; only a grep for the artifact's path confirmed the landing page pointed at the more feature-complete one and the other had no references anywhere.

**How to apply:** Before reusing, fixing, or recommending removal of any artifact that looks like a duplicate, grep for its slug/path across the workspace first.
