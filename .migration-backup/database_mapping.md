# Database Mapping for Agent Contracts

Berikut adalah mapping lengkap antara field input/output agent dengan tabel database yang sudah didefinisikan sebelumnya.

## A. Agent Input Sources Mapping

### 1. Orchestrator Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
user_id → users.id
business_entity_id → business_entities.id
project_domain → business_entities.sector OR projects.sector
request_type → (derived from context)
documents → documents.id (WHERE entity_type = 'tender')
personnel_ids → personnel.id
```

### 2. Document Intake Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
documents[].document_id → documents.id
documents[].file_type → documents.mime_type
```

### 3. Tender Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
document_structure.document_id → documents.id
document_structure.text_index_ref → document_chunks.index_ref
sector → projects.sector OR tenders.sector
project_type → projects.project_type OR tenders.project_type
```

### 4. Legal Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
business_entity_id → business_entities.id
legal_documents[] → licenses_permits.id (WHERE business_entity_id = ?)
```

### 5. Licensing Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
active_licenses[] → licenses_permits.id
regulatory_requirements[] → regulatory_obligations.id
business_entity_id → business_entities.id
sector → business_entities.sector
location → business_entities.address.city
```

### 6. Business Certification Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
business_entity_id → business_entities.id
business_certifications[] → business_certifications.id
tender_requirements[] → (derived from Tender Agent output)
```

### 7. Competency Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
personnel_ids[] → personnel.id
personnel_profiles[] → personnel.* + person_competencies.*
person_certifications[] → person_certifications.id
tender_requirements[] → (derived from Tender Agent output)
```

### 8. Training and CPD Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
personnel_ids[] → personnel.id
training_records[] → training_records.id
cpd_records[] → cpd_records.id
role_requirements[] → (derived from Competency Agent context)
```

### 9. Evidence Mapping Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
requirements[] → (derived from multiple agents)
documents[] → documents.id
mappings[] → evidence_mappings.*
```

### 10. Verifier Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
agent_outputs[] → agent_runs.id + agent_task_outputs.*
```

---

## B. Agent Output Storage Mapping

### 1. Orchestrator Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id (PRIMARY KEY)
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.execution_plan[] → agent_task_outputs.result_json
confidence → agent_runs.confidence
sources[] → agent_task_outputs.sources_json
issues[] → agent_task_outputs.issues_json
```

### 2. Document Intake Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
documents[].document_id → documents.id
documents[].status → documents.processing_status
documents[].extracted_text → document_chunks.content
documents[].sections[] → document_chunks.section_metadata
sources[] → agent_task_outputs.sources_json
```

### 3. Tender Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
requirements[] → agent_task_outputs.result_json (stored as JSON)
sources[] → agent_task_outputs.sources_json
issues[] → agent_task_outputs.issues_json
```

### 4. Legal Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
business_entity_id → (stored in context)
result.items[] → compliance_findings.* (for each license)
result.gaps[] → compliance_findings.* (for gaps)
sources[] → agent_task_outputs.sources_json
```

### 5. Licensing Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
required_licenses[] → compliance_findings.* (for each requirement)
missing_licenses[] → compliance_findings.* (for gaps)
licensing_gap_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
```

### 6. Business Certification Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.matches[] → compliance_findings.* (for matches)
result.gaps[] → compliance_findings.* (for gaps)
result.readiness_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
```

### 7. Competency Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.personnel_evaluation[] → compliance_findings.* (for each personnel)
result.coverage_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
```

### 8. Training and CPD Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.personnel_training_status[] → compliance_findings.* (for each personnel)
result.training_gap_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
```

### 9. Evidence Mapping Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.evidence_matrix[] → evidence_mappings.* (INSERT new mappings)
result.evidence_completeness_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
```

### 10. Verifier Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.schema_valid → agent_task_outputs.result_json
result.consistency_status → agent_task_outputs.result_json
result.ambiguities[] → compliance_findings.* (for ambiguities)
sources[] → agent_task_outputs.sources_json
```

### 11. Final Aggregator Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
result.final_status → compliance_findings.overall_status
result.scores → compliance_findings.scores_json
result.key_strengths → compliance_findings.strengths_json
result.key_gaps → compliance_findings.gaps_json
result.priority_actions → compliance_findings.actions_json
sources[] → agent_task_outputs.sources_json
```

---

## C. Key Database Tables Used

Berikut adalah tabel database utama yang terlibat dalam agent orchestration:

### Core Agent Tables
```
agent_definitions
├── id (PK)
├── agent_name (UNIQUE)
├── agent_type
├── description
├── input_schema_json
├── output_schema_json
├── prompt_template
├── tools_allowed_json
├── risk_level
├── created_at
└── updated_at

agent_runs
├── id (PK)
├── task_id (UNIQUE per request)
├── request_id (FK)
├── agent_name
├── status (pending/running/completed/failed)
├── started_at
├── completed_at
├── confidence
├── error_message
├── created_at
└── updated_at

agent_task_outputs
├── id (PK)
├── agent_run_id (FK)
├── summary
├── result_json (JSONB)
├── sources_json (JSONB)
├── issues_json (JSONB)
├── recommended_actions_json (JSONB)
├── created_at
└── updated_at
```

### Evidence & Compliance Tables
```
evidence_mappings
├── id (PK)
├── document_id (FK)
├── requirement_id
├── requirement_type
├── entity_type
├── entity_id
├── mapping_confidence
├── extracted_evidence_json
├── validation_status
├── validation_notes
├── mapped_by
├── mapped_at
├── last_reviewed_by
├── last_reviewed_at
├── created_at
└── updated_at

compliance_findings
├── id (PK)
├── entity_type
├── entity_id
├── finding_type (gap/match/risk/recommendation)
├── severity (low/medium/high/critical)
├── category
├── title
├── description
├── evidence_json
├── recommended_action
├── status (open/in_progress/resolved)
├── assigned_to
├── due_date
├── resolved_at
├── created_at
└── updated_at
```

### Document Processing Tables
```
documents
├── id (PK)
├── filename
├── original_name
├── mime_type
├── size_bytes
├── checksum
├── uploaded_by
├── processing_status (uploaded/processing/processed/failed)
├── extracted_text_ref
├── ocr_text
├── processing_error
├── created_at
└── updated_at

document_chunks
├── id (PK)
├── document_id (FK)
├── chunk_index
├── content
├── section_metadata_json
├── embedding_vector
├── created_at
└── updated_at
```

---

## D. Agent Workflow Tables

### Request Orchestration
```
agent_requests
├── id (PK)
├── request_id (UNIQUE)
├── user_id (FK)
├── request_type
├── status (pending/processing/completed/failed)
├── input_payload_json
├── output_payload_json
├── total_agents
├── completed_agents
├── started_at
├── completed_at
├── created_at
└── updated_at

agent_request_agents
├── id (PK)
├── request_id (FK)
├── agent_name
├── task_id
├── status (pending/queued/running/completed/failed)
├── depends_on_json
├── input_payload_json
├── output_payload_json
├── started_at
├── completed_at
├── error_message
├── retry_count
├── created_at
└── updated_at
```

### Audit & Logging
```
audit_events
├── id (PK)
├── event_type
├── entity_type
├── entity_id
├── user_id
├── agent_name
├── action
├── old_value_json
├── new_value_json
├── ip_address
├── user_agent
├── timestamp
└── created_at

agent_performance_logs
├── id (PK)
├── agent_run_id (FK)
├── metric_name
├── metric_value
├── metric_unit
├── timestamp
└── created_at
```

---

## E. Data Flow Patterns

### 1. Agent Input Resolution Pattern
```
User Request → agent_requests (store)
           → Parse context → Query relevant tables
           → Build input_payload → agent_request_agents (queue)
           → Agent processes → Store output → Update status
```

### 2. Evidence Mapping Pattern
```
Document Upload → documents (store)
              → Document processing → document_chunks (store)
              → Agent analysis → evidence_mappings (create)
              → Validation → compliance_findings (create/update)
```

### 3. Compliance Tracking Pattern
```
Agent findings → compliance_findings (insert)
              → Link to entity → Update entity compliance status
              → Generate alerts → notification queue
              → Dashboard updates → cache invalidation
```

### 4. Audit Trail Pattern
```
All agent actions → audit_events (insert)
                → Agent runs → agent_runs + agent_task_outputs
                → Evidence changes → evidence_mappings history
                → Compliance changes → compliance_findings history
```

---

## F. Performance Optimization

### Indexing Strategy
```
agent_runs: INDEX ON (status, created_at)
agent_task_outputs: INDEX ON (agent_run_id)
evidence_mappings: INDEX ON (entity_type, entity_id, validation_status)
compliance_findings: INDEX ON (entity_type, entity_id, status, severity)
documents: INDEX ON (processing_status, uploaded_by)
audit_events: INDEX ON (entity_type, entity_id, timestamp)
```

### Caching Strategy
```
Agent definitions: Redis cache with TTL 24h
Frequently accessed documents: CDN with cache headers
Compliance dashboards: Redis cache with TTL 1h
User permissions: In-memory cache with TTL 30m
```

### Query Optimization
```
Use JSONB operators for complex agent result queries
Implement pagination for large result sets
Use database views for complex compliance aggregations
Archive old agent runs after 90 days
```

---

## G. Migration Scripts Structure

### Phase 1: Core Tables
```sql
-- Agent orchestration tables
CREATE TABLE agent_definitions (...);
CREATE TABLE agent_runs (...);
CREATE TABLE agent_task_outputs (...);

-- Evidence management
CREATE TABLE evidence_mappings (...);
CREATE TABLE compliance_findings (...);

-- Document processing
CREATE TABLE documents (...);
CREATE TABLE document_chunks (...);
```

### Phase 2: Workflow Tables
```sql
-- Request orchestration
CREATE TABLE agent_requests (...);
CREATE TABLE agent_request_agents (...);

-- Audit & performance
CREATE TABLE audit_events (...);
CREATE TABLE agent_performance_logs (...);
```

### Phase 3: Indexes & Constraints
```sql
-- Add all indexes
-- Add foreign key constraints
-- Add check constraints for enums
-- Add partial indexes for active records
```

Dengan mapping ini, sistem agent orchestration bisa langsung berinteraksi dengan database tanpa perlu transformation layer tambahan.