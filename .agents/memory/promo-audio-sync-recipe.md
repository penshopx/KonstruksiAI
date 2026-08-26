---
name: Video promo composite audio sync recipe
description: How to keep a multi-track audio mix (music + per-scene voiceover + transition cues) in sync with a video's scene-duration config.
---

A composite background-music + voiceover + transition-cue mix for an animated video artifact should never be a hand-mixed static file committed alongside a scene-duration config. The moment a scene duration, scene count, or a raw stem changes, a hand-mixed file silently drifts and nothing catches it.

**Why:** Checking sync by re-measuring the *output audio* (duration, loudness at expected cue points) is not reliable on its own — an edit can coincidentally preserve total duration, or ambient loudness can mask a missing cue, so a stale mix can still pass a purely acoustic check.

**How to apply:**
- Generate the composite mix with a script driven directly by the scene-timing config (single source of truth for scene start/boundary times), not by hand.
- Alongside the generated audio, write a small fingerprint manifest capturing exactly what it was built from: the scene durations, any mix-level constants, and a content hash of every raw stem file used.
- Make the validation step compare that manifest against the *current* config and stems and fail immediately on any mismatch — this is the deterministic, authoritative check. Use output-level checks (duration, per-cue loudness) only as a secondary sanity layer on top of it, never as the sole gate.
- Wire the validation into the artifact's build script (not just left as an optional manual command) so a drifted mix cannot reach a shipped build.
