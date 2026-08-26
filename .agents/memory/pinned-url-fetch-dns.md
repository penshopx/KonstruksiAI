---
name: Pinned URL-fetch DNS
description: Security constraint for server-side URL imports that pin validated DNS answers at connection time.
---

For server-side URL imports, validate every resolved address and pin the outbound connection to that same validated set; do not let the HTTP client perform a later independent DNS resolution.

**Why:** A DNS answer can change between validation and connection (DNS rebinding). Node's HTTP(S) client may call a custom resolver with `all: true`, so a pinning resolver must support that callback form rather than returning an undefined single address.

**How to apply:** When modifying the document URL importer or its HTTP transport, retain validation for every A/AAAA result, return the validated list for `all: true`, and cover private IPv4 plus mapped/compatible IPv6 forms in regression tests.