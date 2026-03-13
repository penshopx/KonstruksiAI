# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ KonstruksiAI Application Built — Mechanical Engineering Document Library

The template has been expanded into a comprehensive construction AI assistant application (KonstruksiAI) with chat interface, landing page, solver, tools, Knowledge Base, Energy Efficiency Analysis, Test Plans, and now a full Mechanical Engineering Document system.

## Recently Completed (Session 16 — Product Blueprint Definition)

- [x] Defined 8 main application modules: Dashboard, Legalitas/Perizinan, Sertifikasi Badan Usaha, Kompetensi/Sertifikasi Personel, Training/CPD, Tender/Kualifikasi, Pelaksanaan Proyek, Knowledge/AI Workspace
- [x] Structured agent architecture in 4 layers: Orchestration (4 agents), Regulatory/Compliance (4 agents), Workforce/Capability (4 agents), Operational (7 agents)
- [x] Created 90-day MVP roadmap in 3 phases: Foundation (data/auth), High-Value Use Cases (eligibility/readiness), Verification/Expansion (dashboards/analytics)
- [x] Prioritized 15 mini-apps in 3 implementation waves based on business value and technical feasibility
- [x] Positioned product as "AI Platform for Compliance, Qualification, Competency, and Execution Readiness" for construction/energy/mining sectors
- [x] Designed core database schema with 15 tables: business_entities, licenses_permits, business_certifications, personnel, person_competencies, person_certifications, training_programs, training_records, cpd_records, regulations, regulatory_obligations, tenders, projects, compliance_findings, documents
- [x] Established key relationships for cross-domain intelligence: entity-licensing-certification, personnel-competency-training, regulation-obligation-compliance
- [x] Defined product differentiators: evidence-based eligibility, time-aware compliance, cross-domain intelligence, actionable outputs, full auditability
- [x] Created realistic MVP scope focusing on 4 core domains: legal/licensing, business certification, personnel certification, tender eligibility
- [x] Developed comprehensive UI/UX specification with 25+ detailed page designs across all 8 modules
- [x] Established common UI patterns: navigation, data display, forms, status indicators, responsive design
- [x] Created UI_UX_SPECIFICATION.md as implementation blueprint for frontend development
- [x] Implemented SBU Readiness Wizard mini-app with 5-step assessment process for construction business certification
- [x] Created sbu-readiness.ts library with comprehensive SBU classification matrix based on PP No. 28 Tahun 2025 and SK Dirjen Bina Konstruksi No. 37 Tahun 2025
- [x] Built SBU assessment engine with personnel, equipment, experience, and financial requirement validation
- [x] Added SBU Readiness to navbar navigation with interactive step-by-step wizard interface
- [x] Implemented regulatory baseline updates: PP No. 28 Tahun 2025 (replaces PP No. 5 Tahun 2021), Permen PUPR No. 6 Tahun 2025, SK Dirjen 37/2025 for SBU, SK Dirjen 114/2024 for SKK
- [x] Implemented Tender Eligibility Checker end-to-end with comprehensive cross-domain analysis: legal/licensing, certification, personnel, experience, financial compliance
- [x] Created tender-eligibility.ts library with full eligibility assessment engine including gap analysis, risk identification, and action planning
- [x] Built Tender Eligibility Checker mini-app with 4-tab interface: Input Data, Analysis, Gap Analysis, Recommended Actions
- [x] Added Tender Eligibility Checker to navbar navigation as strategic MVP feature for construction tender readiness
- [x] Implemented evidence-based eligibility assessment with structured JSON output for executive decision-making
- [x] Implemented SKK Readiness Wizard mini-app with 5-step assessment process for workforce competency certification
- [x] Created skk-readiness.ts library with comprehensive SKK job position matrix based on SK Dirjen Bina Konstruksi No. 114 Tahun 2024
- [x] Built SKK assessment engine with education, experience, training, certification, assessment, and portfolio validation
- [x] Added SKK Readiness to navbar navigation with interactive step-by-step wizard interface for personnel certification readiness
- [x] Completed trilogy of core mini-apps: SBU Readiness (business), SKK Readiness (personnel), Tender Eligibility (integration)
- [x] Implemented Evidence Mapping App as centralized document management system with automated evidence-to-requirement mapping
- [x] Created evidence-mapping.ts library with comprehensive document processing, text extraction, mapping confidence calculation, and compliance analysis
- [x] Built Evidence Mapping mini-app with 4-tab interface: Upload Documents, Document Library, Evidence Mappings, Compliance Analysis
- [x] Added Evidence Mapping to navbar navigation as foundation for document management across all mini-apps
- [x] Implemented audit trails, validation workflows, and gap identification for evidence-based compliance assessment
- [x] Implemented Workforce Assignment Eligibility as advanced personnel matching system for project assignments
- [x] Created workforce-assignment.ts library with comprehensive matching algorithms for skills, certifications, experience, and availability
- [x] Built Workforce Assignment mini-app with 5-step wizard: Project Setup, Position Requirements, Personnel Database, Analysis, Recommendations
- [x] Added Workforce Assignment to navbar navigation as strategic feature for optimal project team composition
- [x] Implemented intelligent personnel matching with compatibility scoring, risk assessment, and utilization optimization
- [x] Designed complete agent contracts with standardized input/output schemas for 11 core agents: Orchestrator, Document Intake, Tender, Legal, Licensing, Business Certification, Competency, Training/CPD, Evidence Mapping, Verifier, Final Aggregator
- [x] Created detailed JSON contract specifications with examples for each agent including task orchestration, evidence processing, compliance analysis, and final aggregation
- [x] Developed database mapping specification linking all agent input/output fields to database tables: agent_runs, agent_task_outputs, evidence_mappings, compliance_findings, documents, audit_events
- [x] Created agent-database-mapping.md with complete field-to-table mappings, performance optimization strategies, and migration script structure
- [x] Established data flow patterns for agent orchestration, evidence mapping, compliance tracking, and audit trails
- [x] Defined indexing strategy, caching patterns, and query optimization for agent-driven database operations
- [x] Created comprehensive JSON Schema formal specifications for all 11 agent contracts with strict validation rules, reusable definitions, and enterprise-grade schema design
- [x] Developed agent-json-schemas.md with complete input/output schemas, validation examples, schema registry structure, TypeScript interface generation, and validation implementation
- [x] Established schema versioning strategy with major/minor/patch version format and backward compatibility rules
- [x] Implemented reusable schema components ($defs) for common field types, enums, and object patterns
- [x] Created schema validation examples for Node.js and Python with error handling and comprehensive test cases
- [x] Designed complete agent contracts with standardized input/output schemas for 11 core agents: Orchestrator, Document Intake, Tender, Legal, Licensing, Business Certification, Competency, Training/CPD, Evidence Mapping, Verifier, Final Aggregator
- [x] Created detailed JSON contract specifications with examples for each agent including task orchestration, evidence processing, compliance analysis, and final aggregation
- [x] Developed database mapping specification linking all agent input/output fields to database tables: agent_runs, agent_task_outputs, evidence_mappings, compliance_findings, documents, audit_events
- [x] Created database_mapping.md with complete field-to-table mappings, performance optimization strategies, and migration script structure
- [x] Established data flow patterns for agent orchestration, evidence mapping, compliance tracking, and audit trails
- [x] Defined indexing strategy, caching patterns, and query optimization for agent-driven database operations

## Recently Completed (Session 13 — Mechanical Engineering Documents)

- [x] Mechanical Engineering library (`src/lib/mechanical-engineer.ts`) — comprehensive document framework
- [x] 18 document types:
  - 🌊 CFD (Computational Fluid Dynamics) Report
  - 🎨 Design Review Presentation
  - 📉 Failure Analysis Report
  - 📊 Component Selection Report
  - 📊 Design Validation Report
  - 📊 FEA (Finite Element Analysis) Report
  - 📊 Product Performance Report
  - 📊 Tolerance Analysis Report
  - 📋 Manufacturing Process Plans
  - 📋 Material Selection Report
  - 📐 Engineering Drawings
  - 📑 Assembly Instructions
  - 📝 Design Risk Assessments
  - 📝 Test Procedures
  - 📝 Engineering Change Orders
  - 🔥 Heat Transfer Analysis
  - 🔧 Expert Consultation: Mechanical Engineer
  - 🔧 Maintenance Manual
- [x] Response generator (`src/lib/mechanical-engineer-response.ts`) — chat API integration
- [x] Chat API route updated — supports keywords: mechanical, cfd, fea, heat transfer, failure analysis, dll
- [x] Based on reference materials: Shigley's Mechanical Engineering Design (Budynas & Nisbett, 2020), Mott (2018), Incropera & DeWitt (2020)

## Recently Completed (Session 12 — Energy Efficiency Analysis Document)

- [x] Energy Efficiency Analysis library (`src/lib/energy-efficiency.ts`) — comprehensive energy audit framework
- [x] 7 energy categories: Lighting, HVAC, Motors, Production Equipment, Building Envelope, Renewable Energy, Power Quality
- [x] Typical consumption breakdown per category
- [x] Improvement measures with savings, payback periods, complexity ratings
- [x] Evaluation criteria: Technical (25%), Financial (30%), Environmental (15%), Operational (15%), Implementation (15%)
- [x] Compliance standards: PUIL 2011, ISO 50001:2018, ISO 14001:2015, SNI 6389:2020
- [x] Report templates with financial analysis (NPV, IRR, payback), implementation roadmap
- [x] Helper functions: calculateEnergyIntensity, calculateSavingsScore, rankRecommendations, generateEnergyBalance
- [x] Response generator (`src/lib/energy-efficiency-response.ts`) — chat API integration
- [x] Chat API route updated — supports keywords: energy efficiency, efisiensi energi, audit energi, manajemen energi, dll
- [x] Based on reference materials: Turner & Doty (2012), Wilson (2019), Turner & Turner (2017)

- [x] Test Plans Document library (`src/lib/test-plans.ts`) — comprehensive electrical testing procedures
- [x] 5 categories: Transformer, Switchgear, Distribution, Renewable Energy, Periodic Maintenance
- [x] Covers all voltage levels: LV (230V/400V), MV (6-20kV), HV (>20kV)
- [x] Standards: PUIL 2011, IEC 60364, IEC 61850, IEC 61439, ISO 9001
- [x] Test procedures include prerequisites, parameters, acceptance criteria, references
- [x] Complete checklists: Pre-Commissioning, Transformer, Switchgear, Distribution, Final Acceptance
- [x] Report templates: Test Summary Report with project info, results, signatures
- [x] Response generator (`src/lib/test-plans-response.ts`) — chat API integration
- [x] Chat API route updated — supports keywords: test plan, rencana uji, prosedur uji, dll

## Recently Completed (Session 10 — User Profile Page)

- [x] API route `GET /api/profile` — returns user info + stats (conversation count, message count, most active agent, member since)
- [x] API route `PATCH /api/profile` — update name and/or password (with bcrypt verification)
- [x] Profile page `/profile` — account info card, 3-stat grid, recent conversations list, edit form with password change
- [x] NavbarAuth updated — ⚙️ profile icon link added next to user name
- [x] Dashboard updated — "Profil & Pengaturan" card added linking to `/profile`
- [x] Danger zone on profile settings — delete all conversations button

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
