---
name: API test output isolation
description: Concurrency constraint for the API server's bundled regression-test runners.
---

When API regression runners can execute concurrently, each validation process must write its
bundles to a distinct directory rather than cleaning or reusing a shared `.test-dist`.

**Why:** the build-race validation runs every API test script in parallel, and workspace validation
can also run an individual API test at the same time. A shared output directory lets one process
delete or overwrite another process's bundle between esbuild and `node --test`.

**How to apply:** keep `.test-dist` as the standalone default, but provide an environment override
for aggregate or parallel validation and include that directory in the cleanup boundary.