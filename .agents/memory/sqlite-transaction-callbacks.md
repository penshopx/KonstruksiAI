---
name: SQLite transaction callbacks
description: Transaction behavior for the API server's Drizzle better-sqlite3 driver.
---

Use synchronous callbacks for Drizzle transactions backed by better-sqlite3. Inside the callback, execute queries with synchronous helpers such as `get()` and `run()` rather than returning an async promise.

**Why:** This driver rejects promise-returning transaction callbacks at runtime, which can leave a critical multi-step state transition unavailable despite passing TypeScript checks.

**How to apply:** For any atomic API flow on this database, keep all reads and writes inside one synchronous `db.transaction` callback; use conditional updates to claim state before performing dependent writes.