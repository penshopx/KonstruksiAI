# UI/UX Page Structure per Module

## A. Dashboard Utama

### 1. Executive Dashboard (`/dashboard`)
**Purpose**: High-level overview for executives and management
**Layout**: Grid-based dashboard with KPI cards and charts

#### Header Section
- Welcome message with user name
- Last updated timestamp
- Quick action buttons (Add Entity, Upload Document, Generate Report)

#### KPI Cards Row 1 (4 columns)
- **Compliance Score**: Overall compliance percentage (0-100%) with trend indicator
- **Active Licenses**: Number of valid licenses vs total
- **Expiring Soon**: Count of items expiring within 90 days
- **Pending Renewals**: Items requiring immediate attention

#### KPI Cards Row 2 (4 columns)
- **Active Certifications**: Business entity certifications
- **Certified Personnel**: Personnel with valid certifications
- **Training Completion**: Recent training completion rate
- **Active Projects**: Current project count

#### Charts Section (2 columns)
- **Compliance Trend**: Line chart showing compliance score over time
- **Expiry Calendar**: Calendar heatmap of upcoming expirations

#### Alerts Section
- **Critical Alerts**: Red alerts for immediate action (expirations <30 days)
- **Warning Alerts**: Yellow alerts for items needing attention (30-90 days)
- **Info Alerts**: Blue alerts for general notifications

#### Quick Actions
- **Entity Management**: Add/edit business entities
- **Document Upload**: Quick document upload
- **Report Generation**: Generate compliance reports
- **AI Assistant**: Access to conversational AI

### 2. Compliance Dashboard (`/dashboard/compliance`)
**Purpose**: Detailed compliance monitoring and gap analysis

#### Filter Section
- Entity type selector (Business Entity, Personnel)
- Sector filter
- Region filter
- Date range picker

#### Compliance Matrix
- Table showing entities vs compliance requirements
- Color coding: Green (compliant), Yellow (partial), Red (non-compliant)
- Clickable cells for detailed view

#### Gap Analysis Panel
- List of compliance gaps with priority levels
- Estimated cost and time to resolve
- Assigned responsible parties
- Progress tracking

### 3. Renewal Radar (`/dashboard/renewals`)
**Purpose**: Centralized expiry and renewal management

#### Calendar View
- Monthly calendar showing expiry dates
- Color coding by urgency (red: critical, yellow: urgent, green: normal)
- Clickable dates for detailed item lists

#### Expiry Timeline
- Horizontal timeline showing items by expiry date
- Grouped by category (licenses, certifications, training)
- Drag-and-drop for rescheduling

#### Renewal Queue
- Prioritized list of items needing renewal
- Status tracking (not started, in progress, completed)
- Document checklist for each item

---

## B. Legalitas dan Perizinan

### 1. Profil Badan Usaha (`/legal/business-profile`)
**Purpose**: Manage business entity information and basic details

#### Entity Information Form
- **Basic Info Tab**:
  - Company name (required)
  - Entity type dropdown (PT, CV, UD, etc.)
  - NPWP number with validation
  - NIB number (if applicable)
  - Establishment date (date picker)
  - Business sector (dropdown with sub-sector)
  - Operating region (province/city)

- **Contact Info Tab**:
  - Registered address (textarea)
  - Operational address (if different)
  - Phone numbers
  - Email addresses
  - Key personnel contacts

- **Classification Tab**:
  - KBLI codes (multi-select)
  - Business scale (micro/small/medium/large)
  - Special designations (if any)

#### Status Indicators
- Profile completeness percentage
- Last updated date
- Verification status (verified/pending/rejected)

### 2. Daftar Izin (`/legal/licenses`)
**Purpose**: Comprehensive license inventory and status tracking

#### License Table
- Columns: License Name, Number, Authority, Issue Date, Expiry Date, Status, Actions
- Filter bar: Status (active/expired/pending), Authority, Expiry range
- Sort options: By expiry date, by status, by authority

#### License Detail Modal/Card
- License information display
- Document attachments
- Renewal history timeline
- Related requirements checklist
- Status change log

#### Bulk Actions
- Export to Excel/PDF
- Bulk status update
- Bulk renewal reminders

### 3. Status Kelengkapan (`/legal/completeness`)
**Purpose**: Visual compliance status and gap identification

#### Completeness Overview
- Progress bars for each license category
- Overall compliance score with grade (A/B/C/D/F)
- Radar chart showing category performance

#### Gap Analysis Table
- License/Requirement | Status | Missing Items | Priority | Action
- Color coding: Red (critical), Orange (high), Yellow (medium), Green (low)
- Expandable rows for detailed gap information

#### Action Plan Generator
- AI-generated recommendations for closing gaps
- Estimated timeline and cost
- Responsible party assignment
- Progress tracking checkboxes

---

## C. Sertifikasi Badan Usaha

### 1. Sertifikasi Aktif (`/certification/business/active`)
**Purpose**: Current business certifications overview

#### Certification Cards Grid
- Each card shows: Certification name, number, expiry date, status
- Status indicators: Valid (green), Expiring Soon (yellow), Expired (red)
- Quick actions: View details, Download certificate, Schedule renewal

#### Filter and Search
- Search by certification name or number
- Filter by status, authority, expiry date range
- Group by category (SBU, ISO, industry-specific)

### 2. Klasifikasi Usaha (`/certification/business/classification`)
**Purpose**: SBU classification mapping and management

#### Classification Matrix
- Table showing business activities vs required classifications
- Current vs required classification comparison
- Gap identification with upgrade recommendations

#### Classification Details
- Detailed requirements for each classification level
- Document checklist for application
- Cost and timeline estimates
- Success rate statistics

### 3. Gap Analysis (`/certification/business/gaps`)
**Purpose**: Certification readiness assessment

#### Readiness Scorecard
- Overall readiness percentage
- Category breakdown (documents, experience, personnel, etc.)
- Progress bars with detailed breakdowns

#### Missing Requirements List
- Expandable sections for each certification type
- Specific missing items with collection instructions
- Priority ranking and estimated effort

#### Evidence Mapping Interface
- Drag-and-drop document upload
- Automatic requirement matching
- Validation status indicators
- Completion progress tracking

---

## D. Kompetensi dan Sertifikasi Personel

### 1. Master Personel (`/personnel/master`)
**Purpose**: Workforce database management

#### Personnel Table
- Columns: Name, Position, Department, Certifications, Competency Level, Status
- Advanced filters: Department, certification status, competency gaps
- Bulk actions: Export, assign training, update status

#### Personnel Profile Cards
- Photo and basic info
- Current certifications with expiry dates
- Competency matrix
- Training history summary
- Performance indicators

### 2. Sertifikasi Aktif (`/personnel/certifications`)
**Purpose**: Personnel certification tracking

#### Certification Matrix
- Personnel vs certification requirements
- Expiry date calendar view
- Renewal status tracking
- Competency coverage analysis

#### Certification Details
- Individual certification records
- Evidence documentation
- Renewal requirements
- Related competency units

### 3. Eligibility Checker (`/personnel/eligibility`)
**Purpose**: Assignment qualification verification

#### Project/Tender Input
- Project requirements input form
- Required competencies selection
- Certification requirements checklist

#### Personnel Matching Results
- Ranked list of eligible personnel
- Gap analysis for each candidate
- Training recommendations for qualification
- Assignment confidence score

#### Qualification Report
- Detailed eligibility assessment
- Required vs available competencies comparison
- Recommended training plan
- Timeline for qualification completion

---

## E. Training dan CPD

### 1. Program Training (`/training/programs`)
**Purpose**: Training catalog and program management

#### Training Catalog Grid
- Course cards with: Title, Duration, Provider, Target Audience
- Filter by: Category, duration, certification relevance
- Search by keywords

#### Program Details Modal
- Course description and objectives
- Prerequisites and target competencies
- Schedule options and pricing
- Enrollment status and capacity

### 2. Learning Path (`/training/paths`)
**Purpose**: Career development planning

#### Path Builder Interface
- Drag-and-drop competency building
- Training sequence visualization
- Timeline planning
- Cost estimation

#### Individual Path View
- Current progress tracking
- Next recommended courses
- Certification alignment
- Career milestone mapping

### 3. CPD Record (`/training/cpd`)
**Purpose**: Continuing professional development tracking

#### CPD Dashboard
- Total CPD hours earned
- Hours by category
- Progress toward annual requirements
- Expiration tracking

#### Activity Logging
- Add CPD activity form
- Evidence upload (certificates, reports)
- Category classification
- Hour calculation

#### CPD Planning
- Annual requirement calculator
- Upcoming activities calendar
- Gap analysis and recommendations

---

## F. Tender dan Kualifikasi

### 1. Tender Intake (`/tender/intake`)
**Purpose**: Initial tender document processing

#### Document Upload Zone
- Drag-and-drop file upload
- Support for PDF, DOCX, XLSX
- Batch upload capability
- Progress indicators

#### Tender Information Form
- Tender name and number
- Owner/Procuring entity
- Sector and category
- Estimated value
- Deadline dates
- Key requirements summary

#### Initial Analysis Results
- Document completeness check
- Automatic requirement extraction
- Risk level assessment
- Estimated preparation effort

### 2. Eligibility Badan Usaha (`/tender/entity-eligibility`)
**Purpose**: Business entity qualification for tenders

#### Tender Requirements Input
- Required licenses and certifications
- Experience requirements
- Financial capability thresholds
- Technical qualifications

#### Entity Assessment Results
- Qualification score (0-100%)
- Missing requirements list
- Gap closure recommendations
- Timeline for qualification

#### Comparative Analysis
- Entity vs requirements matrix
- Strength/weakness analysis
- Competitive positioning
- Improvement recommendations

### 3. Risk Register Tender (`/tender/risks`)
**Purpose**: Tender participation risk assessment

#### Risk Identification
- Automatic risk detection from tender documents
- Manual risk addition capability
- Risk categorization (compliance, technical, financial, schedule)

#### Risk Assessment Matrix
- Risk | Probability | Impact | Mitigation | Owner | Status
- Color-coded severity levels
- Progress tracking for mitigation actions

#### Risk Dashboard
- Risk heat map
- Risk trend analysis
- Mitigation effectiveness tracking
- Overall tender risk score

---

## G. Pelaksanaan Proyek

### 1. Project Setup (`/project/setup`)
**Purpose**: Initial project compliance configuration

#### Project Information
- Project name, number, location
- Client and contractor details
- Project value and duration
- Sector and complexity level

#### Compliance Requirements Mapping
- Applicable regulations identification
- Required permits and approvals
- HSE requirements setup
- Reporting schedule configuration

#### Initial Document Checklist
- Contract documents
- Permits and approvals
- HSE plans
- Technical specifications

### 2. HIRADC/JSA Builder (`/project/hse/hiradc`)
**Purpose**: Risk assessment tool for project activities

#### Activity Input
- Activity description
- Location and conditions
- Equipment and personnel involved
- Potential hazards identification

#### Risk Assessment Matrix
- Hazard | Risk | Existing Controls | Additional Controls | Residual Risk
- Semi-quantitative risk scoring
- Control hierarchy application

#### JSA Document Generation
- Formatted JSA document output
- Approval workflow integration
- Revision tracking
- Training record linkage

### 3. Progress Reporting (`/project/progress`)
**Purpose**: Compliance monitoring during execution

#### Progress Dashboard
- Overall project progress
- Compliance milestone tracking
- Upcoming reporting deadlines
- Issue and non-conformance tracking

#### Report Generation
- Automated report templates
- Compliance status integration
- Evidence attachment capability
- Approval workflow

---

## H. Knowledge and AI Workspace

### 1. AI Chat (`/ai/chat`)
**Purpose**: Conversational AI interface for all domains

#### Chat Interface
- Message input with file attachment
- Conversation history sidebar
- Context awareness indicators
- Response streaming

#### Domain Context Switching
- Dropdown to select active domain
- Context preservation across domains
- Related document suggestions

### 2. Document Q&A (`/ai/qa`)
**Purpose**: Intelligent document search and analysis

#### Query Interface
- Natural language query input
- Document scope selection
- Result confidence indicators
- Source citation display

#### Results Display
- Answer highlighting
- Source document links
- Related questions suggestions
- Export capabilities

### 3. Agent Console (`/ai/console`)
**Purpose**: Agent orchestration monitoring and management

#### Active Agents View
- Currently running agents
- Queue status
- Performance metrics

#### Agent Configuration
- Agent enable/disable controls
- Parameter tuning
- Model selection
- Prompt management

#### Execution History
- Past agent runs
- Success/failure rates
- Performance analytics
- Error logs and debugging

---

## Common UI Patterns

### Navigation
- **Top Navigation**: Module tabs with icons
- **Breadcrumb**: Current page location
- **Quick Actions**: Floating action button for common tasks

### Data Display
- **Cards**: For overview and summary information
- **Tables**: For detailed lists with sorting/filtering
- **Charts**: For analytics and progress visualization
- **Timelines**: For expiry and renewal tracking

### Forms
- **Progressive Disclosure**: Show advanced options when needed
- **Validation**: Real-time field validation with helpful error messages
- **Auto-save**: Draft saving to prevent data loss
- **Bulk Operations**: Multi-select actions for efficiency

### Status Indicators
- **Color Coding**: Red (critical), Orange (urgent), Yellow (warning), Green (good)
- **Icons**: Clear visual indicators for different states
- **Progress Bars**: For completion and compliance tracking
- **Badges**: For priority levels and categories

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop Enhancement**: Additional features for larger screens

This UI/UX structure provides a comprehensive, user-friendly interface that supports the complex compliance and certification workflows while maintaining ease of use and clear information hierarchy.