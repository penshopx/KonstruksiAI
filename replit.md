# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: SQLite (better-sqlite3) + Drizzle ORM (db file: `artifacts/api-server/konstruksi.db`)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle for api-server)
- **Frontend**: React + Vite + Tailwind CSS v4 + wouter routing

## Artifacts

### KonstruksiAI (`artifacts/konstruksi-ai`)
- **Kind**: Web app (React + Vite)
- **Preview path**: `/` (port 18233, external port 3000)
- **Description**: Indonesian construction AI assistant with many specialized pages
- **Key pages**: home, login, register, dashboard, chat, knowledge, bimtek, simulasi, tools, matriks, sertifikasi, tender-intelligence, tender-eligibility, evidence-mapping, workforce-assignment, legal-licensing, sbu-readiness, skk-readiness, and many more
- **Auth**: Uses JWT cookies from api-server
- **Next.js shims**: `src/shims/next-link.tsx`, `src/shims/next-navigation.ts`, `src/shims/next-image.tsx` (replace Next.js imports via Vite aliases)
- **API proxy**: Vite dev server proxies `/api` to `http://localhost:8080` (api-server)

### API Server (`artifacts/api-server`)
- **Kind**: Express API
- **Port**: 8080 (external port 80)
- **Database**: SQLite at `konstruksi.db` (initialized automatically on startup)
- **Auth**: JWT in httpOnly cookies (cookie name: `auth-token`), using `jose` library
- **Key routes**:
  - `POST /api/auth/register` — register new user
  - `POST /api/auth/login` — login
  - `GET /api/auth/me` — get current session
  - `POST /api/auth/logout` — logout
  - `GET/POST /api/conversations` — list/create conversations
  - `GET/PUT/DELETE /api/conversations/:id` — get/update/delete conversation
  - `POST /api/conversations/:id/messages` — add message
  - `GET/PUT /api/profile` — get/update user profile
  - `POST /api/chat` — AI chat (simulated responses)
  - `POST /api/upload` — file upload (mammoth for DOCX)
  - `POST /api/fetch-url` — fetch URL content
  - `POST /api/sbu-readiness/assess` — SBU readiness assessment
  - `POST /api/skk-readiness/assess` — SKK readiness assessment
  - `POST /api/tender-eligibility/assess` — tender eligibility assessment

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/konstruksi-ai run dev` — run frontend locally

## pnpm-workspace.yaml Notes

- `better-sqlite3` is in `onlyBuiltDependencies` to allow native compilation
- `next` package is intentionally installed but all `next/link`, `next/navigation`, `next/image`, `next/router` imports are redirected to local shims via Vite aliases

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
