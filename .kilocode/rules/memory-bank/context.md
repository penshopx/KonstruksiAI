# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ KonstruksiAI Application Built

The template has been expanded into a full construction AI assistant application (KonstruksiAI) with chat interface, landing page, and three specialized feature pages.

## Recently Completed

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
