# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ KonstruksiAI Application Built — Session 9 Conversation History Persistence

The template has been expanded into a comprehensive construction AI assistant application (KonstruksiAI) with chat interface, landing page, solver, tools, and now a full Knowledge Base system.

## Recently Completed (Session 9 — Conversation History Persistence)

- [x] Add `conversations` and `messages` tables to SQLite DB schema
- [x] Create API routes: `GET/POST/DELETE /api/conversations`, `GET/PATCH/DELETE /api/conversations/[id]`, `POST /api/conversations/[id]/messages`
- [x] Update chat page — detect login status via `/api/auth/me`, load conversations from DB when logged in
- [x] Lazy-load messages per conversation from DB when user selects a conversation
- [x] Save new conversations and messages to DB in real-time when logged in
- [x] Sidebar shows "Tersinkron ke cloud" indicator when logged in
- [x] Fallback to localStorage when not logged in (backward compatible)

## Recently Completed (Session 8 — Enhanced Document Upload)

- [x] Client-side PDF extraction using `pdfjs-dist` — handles compressed/modern PDFs properly
- [x] Google Drive URL input — paste share link to load document directly
- [x] Multiple file upload — up to 5 files simultaneously (PDF, DOCX, TXT, XLSX, CSV)
- [x] DOCX/Word support — server-side extraction using `mammoth`
- [x] New API route `/api/fetch-url` — proxy for Google Drive and public URLs
- [x] Updated upload UI — file type icons, remove individual files, add more files button
- [x] Updated `src/lib/pdf-client.ts` — browser-side PDF text extraction utility

## Recently Completed (Session 7 — Bimtek & Simulasi Uji Kompetensi)

- [x] Fix build error — replaced pdf-parse (incompatible with Cloudflare) with native PDF text extractor
- [x] Bimtek library (`src/lib/bimtek.ts`) — 8 modul bimtek: Struktur Beton, Manajemen Proyek, Instalasi Listrik, PLTS, K3, Pengadaan, PBG, Mekanikal
- [x] Simulasi library (`src/lib/simulasi.ts`) — 6 paket ujian: Ahli Struktur, Ahli K3, Teknisi Listrik, Manajemen Proyek, Teknisi PLTS, Pengadaan LKPP
- [x] Bimtek page (`/bimtek`) — modul pembelajaran dengan topik expandable, referensi SNI, contoh penerapan
- [x] Simulasi page (`/simulasi`) — ujian interaktif dengan timer, navigasi soal, penjelasan, review hasil
- [x] Navbar updated — Bimtek (🎓) dan Simulasi (🎯) links ditambahkan
- [x] Landing page updated — Bimtek & Simulasi section ditambahkan
- [x] Certify page updated — CTA cards untuk Bimtek dan Simulasi di OverviewTab

## Recently Completed (Session 6 — Knowledge Base Development)

- [x] Knowledge Base data structure — 6 categories, 6+ detailed articles with markdown content
- [x] Knowledge Base main page (/knowledge) — search, category filters, tabs (Articles/Videos/Templates)
- [x] Article detail pages (/knowledge/article/[slug]) — markdown rendering, related articles, downloads
- [x] Video tutorials section — 6 video cards with placeholder content
- [x] Document templates library — 10 downloadable templates (PDF, DOCX, XLSX)
- [x] Landing page updated — Knowledge Base feature section with gradient card
- [x] Navbar updated — Knowledge Base link added with purple styling
- [x] Footer updated — Knowledge Base link in platform section

## Recently Completed (Session 5 — Platform Expansion)

- [x] Engineering Solver page (/solver) — multi-step problem solver with 6 domains, structured AI output
- [x] Engineering Tools page (/tools) — 6 calculators: RAB, balok, PLTS, beton, tender, IPAL
- [x] Pricing page (/pricing) — Freemium/Pro/Enterprise tiered model with comparison table
- [x] Landing page enhanced — Solver & Tools feature section, updated navbar, improved footer
- [x] Navbar updated — Solver, Tools, Matriks, Harga links added
- [x] Chat page upgraded — enhanced streaming simulation, copy code button, PDF/Word export

## Recently Completed (Session 3 — Next Level)

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] KonstruksiAI application built — full construction/engineering AI assistant
- [x] Landing page with 3 engineering sectors + 3 main service features
- [x] Chat interface with AI responses for construction, energy, mining topics
- [x] Teknik Konstruksi page (/konstruksi) — 10 sub-fields
- [x] Ketenagalistrikan & EBT page (/energi) — 8 sub-fields
- [x] Migas & Pertambangan page (/migas) — 8 sub-fields
- [x] Tender page (/tender), Manajemen page (/manajemen), Perijinan page (/perijinan)
- [x] Interactive Matrix page (/matrix) — 21 business functions × 6 engineering columns = 126 connection points
- [x] Matrix section added to landing page with preview
- [x] Navigation updated with Matrix link
- [x] Authentication system added — login, register, dashboard pages
- [x] Drizzle ORM + SQLite database setup (konstruksi.db)
- [x] JWT-based session management via httpOnly cookies
- [x] NavbarAuth component for dynamic auth state in navbar

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page with 3 sectors + 3 services | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles + chat animations | ✅ Ready |
| `src/app/chat/page.tsx` | Full chat interface with AI responses | ✅ Ready |
| `src/app/konstruksi/page.tsx` | Teknik Konstruksi — 10 sub-bidang | ✅ Ready |
| `src/app/energi/page.tsx` | Ketenagalistrikan & EBT — 8 sub-bidang | ✅ Ready |
| `src/app/migas/page.tsx` | Migas & Pertambangan — 8 sub-bidang | ✅ Ready |
| `src/app/tender/page.tsx` | Tender & Pengadaan | ✅ Ready |
| `src/app/manajemen/page.tsx` | Manajemen Bisnis Konstruksi | ✅ Ready |
| `src/app/perijinan/page.tsx` | Perijinan & Sertifikasi | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Engineering Sectors Covered

### 1. Teknik Konstruksi (10 sub-bidang)
Arsitektur, Teknik Sipil, Mekanikal, Elektrikal, Tata Lingkungan, Rekayasa Teknik, Lanskap, Desain Interior, Iluminasi, Perencanaan Wilayah & Kota

### 2. Ketenagalistrikan & EBT (8 sub-bidang)
Energi Surya, Energi Angin, Energi Air, Panas Bumi, BESS, Pembangkit Listrik, Transmisi & Distribusi, Biomassa & Biogas

### 3. Migas & Pertambangan (8 sub-bidang)
Minyak & Gas Bumi, Pertambangan Mineral, Geologi & Eksplorasi, Konstruksi Migas, Pipeline & Fasilitas, K3 Migas, Lingkungan Hidup, Ekonomi & Regulasi

## Current Focus

Application is complete. Potential future enhancements:
1. Connect to real LLM API (OpenAI/Anthropic)
2. Add user authentication
3. Add conversation history persistence
4. Add document templates for each sector

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
