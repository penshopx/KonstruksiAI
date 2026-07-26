---
name: KonstruksiAI migration notes
description: Key decisions made when porting this Next.js app to Replit pnpm workspace
---

# KonstruksiAI Migration

## Auth secret
The api-server's `src/lib/auth.ts` uses `JWT_SECRET || SESSION_SECRET` as the JWT signing key. `SESSION_SECRET` already existed as a Replit Secret so this avoids blocking on a new secret. If `JWT_SECRET` is set later it takes precedence.

**Why:** `JWT_SECRET` was required but missing; rather than block the task we fall back to the existing `SESSION_SECRET`.

**How to apply:** If the user wants to rotate the JWT key, add `JWT_SECRET` as a separate Replit Secret — the code already prefers it.

## Database
Uses SQLite (better-sqlite3) via Drizzle ORM, initialised inline in `artifacts/api-server/src/db/migrate.ts` with `CREATE TABLE IF NOT EXISTS`. No external DB needed.

## Shimmed Next.js imports
`artifacts/konstruksi-ai/vite.config.ts` aliases `next/link`, `next/image`, `next/navigation`, `next/router` to shim files under `src/shims/`. These must stay in place.

## Workflows
- API server: `artifacts/api-server: API Server` — port 8080
- Frontend: `artifacts/konstruksi-ai: web` — port 18233

Both were configured via `configureWorkflow` (not managed artifact restart) because `listArtifacts` returned empty on first run. Artifact files exist and serve correctly.
