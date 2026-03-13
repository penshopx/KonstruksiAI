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

## 8 Main Application Modules

### A. Dashboard Utama
**Purpose**: Executive overview of compliance, certification, and project status
**Submodules**:
- Executive Dashboard (compliance radar, expiry alerts, project status)
- Compliance Dashboard (legal/licensing/certification gaps)
- Project Dashboard (tender readiness, project compliance)
- Workforce Dashboard (competency gaps, training needs)
- Renewal Radar (expiry tracking across all domains)

### B. Legalitas dan Perizinan
**Purpose**: Business entity legality and permit management
**Submodules**:
- Profil Badan Usaha (entity profile, sector classification)
- Daftar Izin (permit inventory with status tracking)
- Persyaratan Izin (requirements browser by license type)
- Status Kelengkapan (completeness analysis, gap identification)
- Renewal Tracker (expiry monitoring, renewal planning)
- Legal Document Vault (secure document storage)

### C. Sertifikasi Badan Usaha
**Purpose**: Business entity certification management
**Submodules**:
- Sertifikasi Aktif (active certifications, expiry tracking)
- Klasifikasi Usaha (SBU classification mapping)
- Persyaratan (requirements by certification type)
- Evidence Mapping (document-to-requirement linking)
- Gap Analysis (readiness assessment, missing documents)
- Audit Readiness (pre-audit checklist, evidence preparation)

### D. Kompetensi dan Sertifikasi Personel
**Purpose**: Workforce competency and certification management
**Submodules**:
- Master Personel (workforce database, profiles)
- Kompetensi (competency units, skill mapping)
- Sertifikasi Aktif (certifications, expiry tracking)
- Riwayat Pengalaman (project experience tracking)
- Eligibility Checker (qualification for assignments)
- Renewal Tracker (certification renewal planning)

### E. Training dan CPD
**Purpose**: Learning and professional development management
**Submodules**:
- Program Training (training catalog, requirements)
- Jadwal Training (upcoming sessions, enrollment)
- Learning Path (career development planning)
- CPD Record (continuing professional development tracking)
- Training Gap (needs assessment, recommendations)
- Training Recommendation (AI-powered suggestions)

### F. Tender dan Kualifikasi
**Purpose**: Tender document analysis and qualification readiness
**Submodules**:
- Tender Intake (document upload, initial analysis)
- Tender Review (requirement extraction, risk assessment)
- Checklist Kelengkapan (administrative/technical compliance)
- Eligibility Badan Usaha (entity qualification check)
- Eligibility Personel (workforce qualification check)
- Risk Register Tender (bid risk identification)

### G. Pelaksanaan Proyek
**Purpose**: Project execution support and compliance
**Submodules**:
- Project Setup (initial compliance setup)
- Method Statement (work method development)
- HIRADC/JSA (risk assessment tools)
- ITP/Checklist (inspection and test plans)
- Progress Reporting (compliance monitoring)
- Project Compliance (ongoing regulatory compliance)

### H. Knowledge and AI Workspace
**Purpose**: AI-powered knowledge management and document assistance
**Submodules**:
- AI Chat (conversational interface for all domains)
- Document Q&A (cross-document intelligent search)
- Regulation Library (regulatory knowledge base)
- Template Center (document templates and generators)
- Agent Console (agent orchestration and monitoring)
- Audit Trail (decision traceability and logging)

## Agent Contracts & Specifications (11 Core Agents)

### Standard Contract Patterns

All agents follow standardized input/output contracts for orchestrator integration:

#### Input Contract Pattern
```json
{
  "task_id": "string",
  "request_id": "string",
  "agent_name": "string",
  "objective": "string",
  "context": {},
  "inputs": [],
  "constraints": [],
  "expected_output_schema": "string",
  "metadata": {
    "priority": "low|medium|high",
    "risk_level": "low|medium|high",
    "requires_citation": true,
    "requires_human_review": false
  }
}
```

#### Output Contract Pattern
```json
{
  "task_id": "string",
  "agent_name": "string",
  "status": "completed|partial|failed",
  "summary": "string",
  "result": {},
  "sources": [],
  "issues": [],
  "confidence": 0.0,
  "recommended_next_actions": []
}
```

### Layer 1: Orchestration Agents (4 Agents)

#### 1. **Orchestrator Agent**
- **Function**: Request routing, task decomposition, result aggregation, workflow planning
- **Input**: User requests, intent classification, domain context
- **Output**: Execution plan with task graph, agent assignments, dependencies
- **Key Features**: Multi-domain orchestration, dependency resolution, approval workflow

#### 2. **Planner Agent**
- **Function**: Task graph creation, dependency mapping, timeline planning
- **Input**: Orchestrator plan, resource constraints, priority requirements
- **Output**: Detailed execution timeline, resource allocation, critical path
- **Key Features**: Workflow optimization, bottleneck identification, parallel processing

#### 3. **Verifier Agent**
- **Function**: Output validation, schema checking, consistency verification
- **Input**: Agent outputs, validation rules, cross-reference data
- **Output**: Validation results, consistency flags, quality metrics
- **Key Features**: Schema validation, cross-agent consistency, quality assurance

#### 4. **Critic Agent**
- **Function**: Gap identification, risk assessment, quality improvement suggestions
- **Input**: Verified outputs, domain knowledge, historical performance
- **Output**: Risk assessments, improvement recommendations, confidence adjustments
- **Key Features**: Risk analysis, alternative approaches, continuous learning

### Layer 2: Regulatory & Compliance Agents (4 Agents)

#### 5. **Legal Intelligence Agent**
- **Function**: Regulation analysis, obligation extraction, legal compliance mapping
- **Input**: Legal documents, regulatory references, compliance requirements
- **Output**: Legal obligations, compliance status, regulatory gaps
- **Key Features**: Regulatory interpretation, legal requirement extraction, compliance mapping

#### 6. **Licensing Agent**
- **Function**: Permit requirements analysis, license status tracking, renewal management
- **Input**: Business profiles, license inventories, regulatory requirements
- **Output**: License compliance status, renewal alerts, requirement gaps
- **Key Features**: License lifecycle management, expiry tracking, renewal planning

#### 7. **Business Certification Agent**
- **Function**: Entity certification assessment, readiness validation, evidence evaluation
- **Input**: Business entities, certification requirements, evidence documents
- **Output**: Certification readiness, gap analysis, compliance recommendations
- **Key Features**: Certification path analysis, evidence validation, readiness scoring

#### 8. **Compliance Gap Agent**
- **Function**: Cross-domain compliance gap identification, priority ranking, action planning
- **Input**: Multi-domain compliance data, regulatory requirements, evidence status
- **Output**: Compliance gap matrix, prioritized actions, remediation plans
- **Key Features**: Cross-domain analysis, gap prioritization, action sequencing

### Layer 3: Workforce & Capability Agents (4 Agents)

#### 9. **Competency Agent**
- **Function**: Workforce skill mapping, competency gap analysis, development planning
- **Input**: Personnel profiles, job requirements, competency frameworks
- **Output**: Competency assessments, skill gaps, development recommendations
- **Key Features**: Skill mapping, gap analysis, learning path recommendations

#### 10. **Certification Readiness Agent**
- **Function**: Individual certification assessment, evidence collection, preparation planning
- **Input**: Personnel data, certification requirements, evidence portfolios
- **Output**: Certification readiness, evidence gaps, preparation timelines
- **Key Features**: Readiness assessment, evidence validation, preparation planning

#### 11. **Training Agent**
- **Function**: Learning needs identification, training program recommendation, development path creation
- **Input**: Competency gaps, training catalogs, learning objectives
- **Output**: Training recommendations, learning paths, development plans
- **Key Features**: Needs assessment, program matching, path optimization

#### 12. **CPD Agent**
- **Function**: Continuing professional development tracking, requirement monitoring, compliance verification
- **Input**: Training records, certification requirements, CPD policies
- **Output**: CPD status, requirement gaps, compliance recommendations
- **Key Features**: CPD tracking, requirement monitoring, compliance alerting

### Layer 4: Operational Agents (7 Agents)

#### 13. **Tender Agent**
- **Function**: Tender document analysis, requirement extraction, bid preparation support
- **Input**: Tender documents, project specifications, requirement templates
- **Output**: Extracted requirements, compliance matrices, preparation guidance
- **Key Features**: Document analysis, requirement extraction, compliance mapping

#### 14. **Contract Agent**
- **Function**: Contract clause analysis, deviation identification, risk assessment
- **Input**: Contract documents, standard clauses, risk frameworks
- **Output**: Clause analysis, deviation reports, risk assessments
- **Key Features**: Clause comparison, deviation detection, risk evaluation

#### 15. **Construction Agent**
- **Function**: Construction method development, quality control planning, compliance monitoring
- **Input**: Project specifications, construction standards, quality requirements
- **Output**: Method statements, QC plans, compliance frameworks
- **Key Features**: Method development, QC planning, compliance integration

#### 16. **HSE Agent**
- **Function**: Health, safety, and environment risk assessment, safety planning, permit management
- **Input**: Project data, HSE regulations, risk frameworks
- **Output**: Risk assessments, safety plans, HSE compliance status
- **Key Features**: Risk analysis, safety planning, HSE compliance

#### 17. **Environmental Agent**
- **Function**: Environmental compliance assessment, impact analysis, permit tracking
- **Input**: Project data, environmental regulations, impact assessments
- **Output**: Environmental compliance, impact reports, permit status
- **Key Features**: Impact assessment, compliance verification, permit management

#### 18. **Commercial Agent**
- **Function**: Commercial analysis, cost assessment, financial risk evaluation
- **Input**: Project costs, financial data, commercial requirements
- **Output**: Cost analysis, financial assessments, commercial recommendations
- **Key Features**: Cost analysis, financial evaluation, commercial optimization

#### 19. **Document Intake Agent**
- **Function**: Document processing, text extraction, content structuring, metadata generation
- **Input**: Raw documents (PDF, DOCX, images), processing requirements
- **Output**: Processed documents, extracted content, structured metadata
- **Key Features**: Multi-format processing, OCR integration, content structuring

## MVP Roadmap (90 Days)

### Phase 1 (Days 1-30): Foundation
**Focus**: Core data model, document ingestion, basic compliance tracking
**Deliverables**:
- Master data for business entities, personnel, licenses, certifications
- Document upload and basic OCR/text extraction
- Regulation library with search capabilities
- Basic expiry alerts and renewal tracking
- Authentication and role-based access
- Simple dashboard with compliance overview

**Active Mini-Apps**:
- Legalitas & Perizinan Checker
- Sertifikasi Badan Usaha Readiness

### Phase 2 (Days 31-60): High-Value Use Cases
**Focus**: Qualification logic, evidence mapping, readiness assessment
**Deliverables**:
- Competency database and gap analysis engine
- Training record management
- Certification readiness assessment
- Compliance gap identification and prioritization
- Tender eligibility engine with evidence validation
- Workforce assignment qualification checking

**Active Mini-Apps**:
- Sertifikasi Kompetensi Readiness
- Tender Eligibility Checker
- Evidence Mapping App

### Phase 3 (Days 61-90): Verification & Expansion
**Focus**: Quality assurance, advanced features, executive insights
**Deliverables**:
- Approval workflows for critical recommendations
- Comprehensive audit logging and source traceability
- Advanced reminder and renewal radar system
- Executive compliance dashboard with predictive analytics
- Cross-domain eligibility and readiness scoring
- Training recommendation engine with AI insights

**Active Mini-Apps**:
- Renewal Radar
- Training & CPD Planner
- Executive Compliance Dashboard

## Priority Mini-Apps by Implementation Wave

### Wave 1: Core Compliance (Most Valuable)
1. **Legalitas & Perizinan Checker**: Permit requirements, completeness status, expiry tracking
2. **Sertifikasi Badan Usaha Readiness**: Certification mapping, gap analysis, document preparation
3. **Sertifikasi Kompetensi Readiness**: Competency assessment, evidence mapping, certification prep
4. **Tender Eligibility Checker**: Entity/personnel qualification, gap identification
5. **HIRADC/JSA Builder**: Risk assessment tools, safety planning support

### Wave 2: Operational Expansion
1. **Training & CPD Planner**: Learning needs, paths, renewal planning
2. **Contract Review App**: Clause analysis, deviation detection
3. **Method Statement Builder**: Work method development, compliance templates
4. **Project Compliance Checker**: Ongoing regulatory monitoring
5. **Document Requirement Mapper**: Cross-reference requirements to evidence

### Wave 3: Intelligence & Analytics
1. **Renewal Radar**: Predictive expiry management across all domains
2. **Workforce Assignment Eligibility**: Advanced qualification matching
3. **Evidence Mapping App**: Automated document-to-requirement linking
4. **Cross-Regulation Impact Checker**: Regulatory change impact analysis
5. **Executive Compliance Dashboard**: Strategic compliance insights and KPIs

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
