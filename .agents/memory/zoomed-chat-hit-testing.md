---
name: Zoomed chat hit-testing
description: Responsive placement rules for fixed floating launchers and the chat composer under browser zoom.
---

Floating launchers should move into a safe vertical zone above the chat composer at CSS widths below `xl`; keeping only a pointer-events-disabled wrapper is not enough when a launcher button overlaps the composer.

**Why:** Browser zoom reduces the CSS viewport width, so controls that are separated on a normal desktop can occupy the same physical area as the composer. Pointer-events protection applies to the wrapper's empty area, not to its interactive button children.

**How to apply:** When changing the floating controls or composer, validate send and launcher hit-testing at zoom-equivalent widths for 125–200% zoom, including a narrow desktop viewport.