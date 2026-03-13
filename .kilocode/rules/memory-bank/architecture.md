# System Architecture: KonstruksiAI Agentic Platform

## Overview

KonstruksiAI is evolving into a powerful agentic AI platform for construction and engineering using a layered architecture with orchestrator-driven multi-agent systems.

## 6-Layer Architecture

### 1. Interaction Layer
- **Purpose**: User interfaces for different use cases
- **Components**:
  - Chat interface (`/chat`)
  - Mini-apps for specific workflows
  - Dashboard for project management
  - Document workspace
- **Examples**:
  - Tender Intelligence mini-app
  - Construction Document Copilot
  - HSE Compliance Copilot
  - Project Knowledge Engine

### 2. Orchestration Layer (Core Engine)
- **Purpose**: Coordinate multi-agent workflows
- **Components**:
  - **Intent Classifier**: Determine user intent and route to appropriate workflow
  - **Planner**: Break down tasks into sub-tasks and dependencies
  - **Agent Router**: Select and dispatch specialist agents
  - **Workflow Engine**: Manage execution flow with retry/timeout/approval
  - **Result Aggregator**: Combine outputs from multiple agents
  - **Critic/Verifier**: Validate outputs and flag issues
- **Implementation**: State machine or workflow graph-based

### 3. Knowledge Layer
- **Purpose**: Domain knowledge management and retrieval
- **Structure**:
  - **Regulasi**: UU, PP, Permen, standar nasional/industri, SOP, HSE standards
  - **Dokumen Proyek**: RKS, gambar, BOQ, kontrak, addendum, notulen, progress reports, NCR, HIRADC/JSA, permit to work
  - **Knowledge Bisnis**: Histori tender/proyek, vendor database, pricing database, lessons learned, proposal templates
  - **Knowledge Teknis Terstruktur**: Work classifications, equipment types, materials, methods, risk profiles, engineering parameters
- **Retrieval**: Hybrid (semantic + keyword/BM25), metadata filtering, source traceability
- **Metadata**: Sector, discipline, project phase, document type, jurisdiction, year/revision, authority level

### 4. Domain Model Layer
- **Purpose**: Ontology and knowledge graph for entity relationships
- **Entities**: Proyek, paket tender, owner, kontraktor, vendor, item pekerjaan, material, alat, tenaga kerja, risiko, permit, insiden, dokumen, klausul kontrak, milestone, WBS, lokasi, regulasi
- **Relations**: Tender contains documents, documents reference regulations, work items have risks, risks have mitigations, BOQ items relate to specifications, activities require equipment/personnel, contracts have deliverables, vendors have categories
- **Benefits**: Enables cross-document reasoning and relationship-aware queries

### 5. Execution and Verification Layer
- **Purpose**: Deterministic execution and output validation
- **Modes**:
  - **Reasoning Mode**: For analysis, drafting, multi-step reasoning
  - **Deterministic Mode**: For calculations, parsing, validation, formatting
- **Components**:
  - **Rule Engine**: Validate against business rules
  - **Calculation Engine**: BOQ, cost estimates, risk assessments
  - **Document Validator**: Check completeness and compliance
  - **Policy Checker**: Verify against standards and regulations
  - **Consistency Checker**: Cross-reference document integrity
- **Output**: Structured JSON with confidence scores, sources, next actions

### 6. Governance, Safety, and Audit Layer
- **Purpose**: Security, compliance, and accountability
- **Components**:
  - Role-based access control
  - Audit logs per task
  - Document versioning
  - Source traceability
  - Confidence scoring
  - Approval workflows for critical outputs
  - Red flags for high-risk recommendations
- **Human-in-the-loop**: Required for critical decisions (methods, safety assessments, legal compliance, high-value tenders)

## Specialist Agents by Domain

### Klaster 1: Core Orchestration
- **Orchestrator Agent**: Workflow coordination, task routing, state management
- **Planner Agent**: Task decomposition, dependency mapping, timeline planning
- **Critic Agent**: Output validation, risk assessment, quality review
- **Verifier Agent**: Schema validation, consistency checking, citation verification

### Klaster 2: Project Execution
- **Tender Agent**: Document analysis, requirement extraction, compliance checking
- **Estimation/BOQ Agent**: Cost calculation, quantity take-off, pricing analysis
- **Contract Agent**: Clause analysis, risk identification, commercial terms review
- **Construction Agent**: Technical specifications, method statements, quality control
- **Commercial Agent**: Payment terms, claim analysis, vendor evaluation
- **Procurement Agent**: Supplier selection, contract management, vendor performance

### Klaster 3: Safety and Environment
- **HSE Agent**: Risk assessment, safety planning, permit management
- **Environmental Agent**: Environmental impact, compliance monitoring, permit tracking

### Klaster 4: Legal and Regulatory
- **Legal Agent**: Regulatory compliance, legal requirement analysis
- **Licensing Agent**: Permit management, renewal tracking, jurisdiction mapping
- **Regulatory Intelligence Agent**: Standard updates, compliance gap analysis

### Klaster 5: Certification and Competency
- **Business Certification Agent**: Entity qualification, certification readiness
- **Workforce Competency Agent**: Skills assessment, certification tracking
- **Certification Readiness Agent**: Gap analysis, evidence mapping, renewal planning

### Klaster 6: Learning and Development
- **Training Agent**: Learning needs assessment, training recommendation
- **CPD Agent**: Continuing professional development tracking
- **Professional Development Agent**: Career path planning, skill development

### Klaster 7: Cross-Domain Support
- **Document Intake Agent**: File processing, metadata extraction
- **Classification Agent**: Content categorization, sector mapping
- **Metadata Enrichment Agent**: Entity linking, relationship mapping
- **Summarizer Agent**: Content synthesis, key point extraction
- **Citation Agent**: Source verification, evidence linking

### Agent Workflow Pattern
**Planner → Specialist → Critic → Consolidator**
- Planner decomposes problems
- Specialists execute sub-tasks using toolbox
- Critic reviews for weaknesses and risks
- Consolidator integrates final output

## Toolbox/Action Layer

### Core Tools
- PDF parser and extractor
- OCR for images and scans
- Technical specification extractor
- BOQ calculator
- HPS/RAB analyzer
- K3 risk matrix generator
- Method statement planner
- Technical document generator
- Compliance evaluator
- Vendor comparator
- Meeting summarizer

## Multi-Model Strategy

- **Small Models**: Classification, tagging, basic extraction, routing (cost-effective)
- **Medium Models**: Summarization, standard drafting, document Q&A
- **Large Models**: Complex cross-document reasoning, tender analysis, contract review, sensitive technical tasks

## Domain Coverage

### 1. Legal and Licensing Domain
- Business entity legality
- NIB and operational permits
- Sectoral licenses
- Renewal requirements
- Cross-sector compliance
- Regional jurisdiction rules

### 2. Business Entity Certification Domain
- Business certification status
- Classification and sub-classification
- Administrative requirements
- Personnel requirements
- Experience requirements
- Equipment/facility requirements
- Audit/assessment history
- Renewal and recertification needs

### 3. Workforce Competency and Individual Certification Domain
- Workforce profiles
- Competency units
- Certification schemes
- Certificate management
- Expiry tracking
- Competency gaps
- Training needs
- Project experience
- Evidence portfolios

### 4. Continuing Professional Development and Training Domain
- Training needs mapping
- Learning paths
- Training history recording
- Certification-training linkage
- Project risk-training linkage
- CPD monitoring

### 5. Cross-Domain Compliance Intelligence
- Legal-technical-HSE-environment synchronization
- Entity-project-personnel compliance graphs
- Evidence-to-requirement mapping
- Compliance gap detection
- Renewal and validity tracking

## Priority Mini-Apps by Domain

### Legal & Licensing
1. **Legalitas and Perizinan Checker**: Permit requirements analysis, completeness status, expiry tracking, action priorities

### Certification & Competency
2. **Sertifikasi Badan Usaha Readiness App**: Certification requirements mapping, gap analysis, document preparation lists
3. **Sertifikasi Kompetensi Readiness App**: Competency assessment, evidence mapping, certification preparation plans

### Learning & Development
4. **Training and CPD Planner**: Training needs assessment, learning paths, renewal planning, professional development tracking

### Project Execution
5. **Eligibility for Tender and Project Assignment**: Entity and personnel qualification checking, gap identification, corrective action plans

### Legacy Mini-Apps (Enhanced)
6. **Tender Intelligence**: Document completeness check, requirement summary, risk identification, compliance checklist
7. **Construction Document Copilot**: Method statements, ITPs, inspection checklists, progress reports
8. **HSE and Compliance Copilot**: HIRADC/JSA creation, risk matrices, permit checklists, audit recommendations
9. **Commercial and Contract Analyzer**: Deviation analysis, clause extraction, payment risks, contractual obligations
10. **Project Knowledge Engine**: Cross-document Q&A, historical decisions, lessons learned, quick project searches

## Original Next.js Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind imports + global styles
│   └── favicon.ico         # Site icon
└── (expand as needed)
    ├── components/         # React components (add when needed)
    ├── lib/                # Utilities and helpers (add when needed)
    └── db/                 # Database files (add via recipe)
```

## Key Design Patterns

### 1. App Router Pattern

Uses Next.js App Router with file-based routing:
```
src/app/
├── page.tsx           # Route: /
├── about/page.tsx     # Route: /about
├── blog/
│   ├── page.tsx       # Route: /blog
│   └── [slug]/page.tsx # Route: /blog/:slug
└── api/
    └── route.ts       # API Route: /api
```

### 2. Component Organization Pattern (When Expanding)

```
src/components/
├── ui/                # Reusable UI components (Button, Card, etc.)
├── layout/            # Layout components (Header, Footer)
├── sections/          # Page sections (Hero, Features, etc.)
└── forms/             # Form components
```

### 3. Server Components by Default

All components are Server Components unless marked with `"use client"`:
```tsx
// Server Component (default) - can fetch data, access DB
export default function Page() {
  return <div>Server rendered</div>;
}

// Client Component - for interactivity
"use client";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 4. Layout Pattern

Layouts wrap pages and can be nested:
```tsx
// src/app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// src/app/dashboard/layout.tsx - Nested layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Styling Conventions

### Tailwind CSS Usage
- Utility classes directly on elements
- Component composition for repeated patterns
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

### Common Patterns
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox centering
<div className="flex items-center justify-center">
```

## File Naming Conventions

- Components: PascalCase (`Button.tsx`, `Header.tsx`)
- Utilities: camelCase (`utils.ts`, `helpers.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`)
- Directories: kebab-case (`api-routes/`) or lowercase (`components/`)

## State Management

For simple needs:
- `useState` for local component state
- `useContext` for shared state
- Server Components for data fetching

For complex needs (add when necessary):
- Zustand for client state
- React Query for server state
