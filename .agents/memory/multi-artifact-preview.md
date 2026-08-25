---
name: Multi-artifact preview
description: How artifact-to-artifact iframe embeds are made available in local preview and deployment.
---

# Multi-artifact Preview

When an artifact embeds another artifact by its preview route, the target artifact must be running during local development. Static target artifacts also need their production build output before the deployment router can serve the route.

**Why:** The proxy cannot return an artifact page from an inactive local service, and the deployment static handler has no page to serve without the target `dist` output.

**How to apply:** After adding or testing a cross-artifact iframe, restart both the host and target workflows locally. Before relying on the embed in deployment, run the target artifact's build.