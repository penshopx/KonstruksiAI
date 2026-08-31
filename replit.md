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

### Billing configuration
- `PAYMENT_PROVIDER` — provider identifier used by the signed webhook; the currently verified adapter is `stripe`
- `PAYMENT_WEBHOOK_SECRET` — server-only Stripe webhook signing secret (`whsec_...`)
- `PAYMENT_CHECKOUT_URL` — HTTPS Stripe-hosted checkout URL (`checkout.stripe.com` or `buy.stripe.com`); the server replaces any supplied `client_reference_id` with an opaque intent owned by the signed-in account
- `PAYMENT_PRO_PRICE_ID` — exact provider price/plan identifier for Pro
- `PAYMENT_PRO_AMOUNT` — exact Pro charge in the currency's smallest unit (for IDR, whole rupiah)
- `PAYMENT_CURRENCY` — expected three-letter ISO currency code (defaults to `IDR`)
- `PAYMENT_PROVIDER_VERIFIED` — set to `true` only after the selected provider's sandbox checkout and webhook scenarios pass end to end
- `POST /api/billing/webhook` — accepts only fresh HMAC-signed payment events and updates Pro entitlements atomically
- `GET /api/billing/config` exposes checkout as available only when all provider values are valid and sandbox verification is explicitly recorded; the pricing page must use both `configured` and `checkoutAvailable`
- Keep the provider values unset until its sandbox checkout and webhook are configured. Run `pnpm --filter @workspace/api-server run test:billing` before enabling checkout; it covers success, replay, failed payment, cancellation, delayed events, owner binding, and provider payload normalization.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/konstruksi-ai run dev` — run frontend locally

## pnpm-workspace.yaml Notes

- `better-sqlite3` is in `onlyBuiltDependencies` to allow native compilation
- `next` package is intentionally installed but all `next/link`, `next/navigation`, `next/image`, `next/router` imports are redirected to local shims via Vite aliases

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
