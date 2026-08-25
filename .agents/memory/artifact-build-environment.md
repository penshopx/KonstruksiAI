---
name: Artifact build environment
description: Deployment builds load Vite configuration before workflow runtime variables are available.
---

# Artifact build environment

Vite configuration must supply safe defaults for artifact-owned values such as the web port and base path, while still allowing managed workflow variables to override them at runtime.

**Why:** The artifact build runs before the production process starts. Runtime-only variables can therefore be absent when Vite evaluates its configuration, causing an otherwise valid deployment build to fail.

**How to apply:** When a Vite config uses `PORT` or `BASE_PATH`, use the artifact’s configured local port and `/` as defaults unless the artifact intentionally requires a non-root base path. Keep the managed workflow as the source of runtime overrides.