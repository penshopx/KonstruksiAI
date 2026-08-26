---
name: Attachment size boundary precision
description: How to keep client and server agreeing exactly at a base64 upload size limit, and where the Expo document picker can silently skip a pre-check.
---

- Approximating decoded base64 size with `length * 0.75` can be off by 1-2 bytes near a hard limit, letting client and server disagree right at the boundary. Compute the exact decoded size (account for `=`/`==` padding) on both sides so a file just under the limit is never rejected by one side but not the other.
- Expo's `DocumentPicker` result `asset.size` can be `undefined` for some files/platforms. Relying on it alone silently skips the pre-read size check. Fall back to `FileSystem.getInfoAsync(uri)` to get an exact size before reading/base64-decoding a potentially large file, so oversized files are still caught before the expensive read.
- **Why:** discovered while hardening a 10 MB document-attachment limit in the KonstruksiAI mobile chat (task: confirm mobile stops oversized project documents before upload) — the API server and mobile client each independently estimated decoded size and could disagree by a few bytes at the boundary.
- **How to apply:** any future attachment/upload size limit shared between a mobile/web client and an API server should use this same exact-size + fallback pattern, not a rough multiplier.
