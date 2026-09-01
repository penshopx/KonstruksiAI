---
name: Zoomed chat hit-testing
description: Responsive placement rules for fixed floating launchers and the chat composer under browser zoom.
---

Floating launchers need route-aware safe zones at narrow CSS widths: landing content may require a low edge position, while fixed chat composers require launchers to sit above them. A pointer-events-disabled wrapper is not enough when a launcher button overlaps another target.

**Why:** Browser zoom reduces the CSS viewport width, while stacked landing cards can also intersect a fixed launcher before the user scrolls. One global offset can protect the composer but cover a landing CTA, or protect the landing CTA but cover the composer.

**How to apply:** Validate launcher overlap and center-point hit-testing on every route with a fixed bottom target, including the initial landing viewport and zoom-equivalent chat widths at 125–200%. Keep short-window panel behavior as a separate scenario.