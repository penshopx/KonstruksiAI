# Database Mapping for Agent Contracts

Berikut adalah mapping lengkap antara field input/output agent dengan tabel database yang sudah didefinisikan sebelumnya. Setiap agent contract dihubungkan dengan sumber data dan penyimpanan hasil yang spesifik.

## A. Agent Input Sources Mapping

### 1. Orchestrator Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
user_id → users.id
business_entity_id → business_entities.id
project_domain → business_entities.sector OR projects.sector
request_type → (derived from context)
documents[] → documents.id (WHERE entity_type = 'tender')
personnel_ids[] → personnel.id
context.user_id → users.id
context.business_entity_id → business_entities.id
context.project_domain → business_entities.sector
inputs[].value (documents) → documents.id
inputs[].value (personnel) → personnel.id
```

### 2. Document Intake Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
documents[].document_id → documents.id
documents[].file_type → documents.mime_type
context.document_domain → documents.entity_type
inputs[].value[].document_id → documents.id
inputs[].value[].file_type → documents.mime_type
```

### 3. Tender Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
document_structure.document_id → documents.id
document_structure.text_index_ref → document_chunks.index_ref
context.sector → projects.sector OR tenders.sector
context.project_type → projects.project_type OR tenders.project_type
inputs[].value.document_id → documents.id
inputs[].value.text_index_ref → document_chunks.index_ref
```

### 4. Legal Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
business_entity_id → business_entities.id
legal_documents[] → licenses_permits.id (WHERE business_entity_id = ?)
context.business_entity_id → business_entities.id
inputs[].value.business_entity_id → business_entities.id
inputs[].value.legal_documents[] → licenses_permits.id
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
context.business_entity_id → business_entities.id
context.sector → business_entities.sector
context.location → business_entities.address.city
inputs[].value[] → licenses_permits.id
```

### 6. Business Certification Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
business_entity_id → business_entities.id
business_certifications[] → business_certifications.id
tender_requirements[] → (derived from Tender Agent output)
context.business_entity_id → business_entities.id
inputs[].value[] → business_certifications.id
inputs[].value[] → (from agent_task_outputs.result_json)
```

### 7. Competency Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
personnel_ids[] → personnel.id
personnel_profiles[] → personnel.* + person_competencies.*
person_certifications[] → person_certifications.id
tender_requirements[] → (derived from Tender Agent output)
context.personnel_ids[] → personnel.id
inputs[].value[] → personnel.id
inputs[].value[] → person_certifications.id
```

### 8. Training and CPD Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
personnel_ids[] → personnel.id
training_records[] → training_records.id
cpd_records[] → cpd_records.id
role_requirements[] → (derived from Competency Agent context)
context.personnel_ids[] → personnel.id
inputs[].value[] → training_records.id
inputs[].value[] → cpd_records.id
```

### 9. Evidence Mapping Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
requirements[] → (derived from multiple agents)
documents[] → documents.id
context → (various based on requirement type)
inputs[].value[] → (from agent_task_outputs.result_json)
inputs[].value[] → documents.id
```

### 10. Verifier Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
agent_outputs[] → agent_runs.id + agent_task_outputs.*
inputs[].value[] → agent_runs.id
```

### 11. Final Aggregator Agent
```
Input Field → Database Table.Field
─────────────────────────────────────
verified_outputs[] → agent_runs.id + agent_task_outputs.*
inputs[].value[] → agent_runs.id
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
recommended_next_actions[] → agent_task_outputs.recommended_actions_json
```

### 2. Document Intake Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.documents[] → documents.* (UPDATE status, extracted_text, etc.)
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 3. Tender Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.requirements[] → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
issues[] → agent_task_outputs.issues_json
confidence → agent_runs.confidence
```

### 4. Legal Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.business_entity_id → (stored in context)
result.items[] → compliance_findings.* (INSERT for each license)
result.gaps[] → compliance_findings.* (INSERT for gaps)
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 5. Licensing Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.required_licenses[] → compliance_findings.* (INSERT)
result.missing_licenses[] → compliance_findings.* (INSERT)
result.licensing_gap_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 6. Business Certification Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.matches[] → compliance_findings.* (INSERT)
result.gaps[] → compliance_findings.* (INSERT)
result.readiness_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 7. Competency Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.personnel_evaluation[] → compliance_findings.* (INSERT per personnel)
result.coverage_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 8. Training and CPD Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.personnel_training_status[] → compliance_findings.* (INSERT)
result.training_gap_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 9. Evidence Mapping Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.evidence_matrix[] → evidence_mappings.* (INSERT new mappings)
result.evidence_completeness_score → agent_task_outputs.result_json
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 10. Verifier Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.schema_valid → agent_task_outputs.result_json
result.consistency_status → agent_task_outputs.result_json
result.ambiguities[] → compliance_findings.* (INSERT)
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

### 11. Final Aggregator Agent
```
Output Field → Database Table.Field
─────────────────────────────────────
task_id → agent_runs.task_id
agent_name → agent_runs.agent_name
status → agent_runs.status
summary → agent_task_outputs.summary
result.final_status → compliance_findings.overall_status (UPDATE)
result.scores → compliance_findings.scores_json (UPDATE)
result.key_strengths → compliance_findings.strengths_json (UPDATE)
result.key_gaps → compliance_findings.gaps_json (UPDATE)
result.priority_actions → compliance_findings.actions_json (UPDATE)
sources[] → agent_task_outputs.sources_json
confidence → agent_runs.confidence
```

---

## C. Agent Workflow Data Flow

### 1. Request Initiation Flow
```
User Request → agent_requests (INSERT)
           → Parse inputs → Query relevant tables
           → Create agent_runs records → agent_request_agents (INSERT)
           → Queue for execution
```

### 2. Agent Execution Flow
```
Agent Triggered → agent_runs.status = 'running'
             → Query input data from mapped tables
             → Execute agent logic
             → Store results in agent_task_outputs
             → Update compliance_findings as needed
             → Update agent_runs.status = 'completed'
```

### 3. Orchestration Flow
```
Check dependencies → agent_request_agents.depends_on_json
                 → All dependencies complete?
                 → Yes: Trigger next agent
                 → No: Wait for dependencies
```

### 4. Evidence Processing Flow
```
Document Upload → documents (INSERT)
              → Agent processing → document_chunks (INSERT)
              → Evidence mapping → evidence_mappings (INSERT)
              → Compliance validation → compliance_findings (INSERT/UPDATE)
```

### 5. Audit Trail Flow
```
All operations → audit_events (INSERT)
             → Agent state changes → agent_runs history
             → Evidence validations → evidence_mappings.audit_trail
             → Compliance updates → compliance_findings history
```

---

## D. Performance Optimization Strategies

### Query Patterns by Agent Type

#### High-Frequency Agents (Orchestrator, Verifier)
```
- Use Redis cache for agent definitions
- Implement query result caching
- Use database connection pooling
- Optimize JOIN queries with proper indexing
```

#### Data-Intensive Agents (Document Intake, Evidence Mapping)
```
- Implement pagination for large datasets
- Use streaming for document processing
- Batch INSERT operations for evidence mappings
- Archive old document chunks after 6 months
```

#### Real-time Agents (Legal, Licensing, Certification)
```
- Cache regulatory data with TTL
- Use materialized views for compliance aggregations
- Implement read replicas for heavy queries
- Optimize geospatial queries for location-based requirements
```

### Indexing Strategy Enhancement

#### Composite Indexes for Agent Queries
```sql
-- For agent execution tracking
CREATE INDEX idx_agent_runs_status_created ON agent_runs(status, created_at);
CREATE INDEX idx_agent_request_agents_status ON agent_request_agents(status);

-- For compliance queries
CREATE INDEX idx_compliance_findings_entity ON compliance_findings(entity_type, entity_id, status);
CREATE INDEX idx_evidence_mappings_requirement ON evidence_mappings(requirement_type, requirement_id);

-- For audit queries
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id, timestamp);
```

#### Partial Indexes for Active Records
```sql
-- Only index active agent runs
CREATE INDEX idx_agent_runs_active ON agent_runs(task_id) WHERE status IN ('pending', 'running');

-- Only index valid evidence mappings
CREATE INDEX idx_evidence_mappings_valid ON evidence_mappings(entity_id, requirement_id)
WHERE validation_status = 'valid';
```

### Caching Strategy by Data Type

#### Static Reference Data
```
- Agent definitions: Redis TTL 24h
- Regulatory requirements: Redis TTL 12h
- Certification matrices: Redis TTL 6h
```

#### Dynamic Operational Data
```
- User permissions: In-memory TTL 30m
- Active agent runs: Redis TTL 1h
- Compliance dashboards: Redis TTL 30m
```

#### Computed Results
```
- Evidence completeness scores: Redis TTL 15m
- Personnel matching results: Redis TTL 1h
- Tender eligibility assessments: Redis TTL 2h
```

---

## E. Migration Scripts for Agent System

### Phase 1: Core Agent Infrastructure
```sql
-- Agent orchestration tables
CREATE TABLE agent_definitions (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(100) UNIQUE NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    description TEXT,
    input_schema_json JSONB,
    output_schema_json JSONB,
    prompt_template TEXT,
    tools_allowed_json JSONB,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_runs (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    request_id VARCHAR(100),
    agent_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    confidence DECIMAL(3,2),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_task_outputs (
    id SERIAL PRIMARY KEY,
    agent_run_id INTEGER REFERENCES agent_runs(id),
    summary TEXT,
    result_json JSONB,
    sources_json JSONB,
    issues_json JSONB,
    recommended_actions_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 2: Workflow Management
```sql
-- Request orchestration
CREATE TABLE agent_requests (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    input_payload_json JSONB,
    output_payload_json JSONB,
    total_agents INTEGER DEFAULT 0,
    completed_agents INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_request_agents (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) REFERENCES agent_requests(request_id),
    agent_name VARCHAR(100) NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed')),
    depends_on_json JSONB,
    input_payload_json JSONB,
    output_payload_json JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 3: Audit & Performance
```sql
-- Audit trails
CREATE TABLE audit_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    agent_name VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    old_value_json JSONB,
    new_value_json JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance monitoring
CREATE TABLE agent_performance_logs (
    id SERIAL PRIMARY KEY,
    agent_run_id INTEGER REFERENCES agent_runs(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 4: Agent Definition Seeds
```sql
-- Insert agent definitions
INSERT INTO agent_definitions (agent_name, agent_type, description, input_schema_json, output_schema_json, risk_level) VALUES
('orchestrator', 'orchestration', 'Request routing and task orchestration', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'low'),
('document_intake', 'processing', 'Document processing and text extraction', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'low'),
('tender_agent', 'analysis', 'Tender document analysis and requirement extraction', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'medium'),
('legal_agent', 'compliance', 'Legal compliance assessment', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'high'),
('licensing_agent', 'compliance', 'License requirements analysis', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'high'),
('business_certification_agent', 'compliance', 'Business certification assessment', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'high'),
('competency_agent', 'workforce', 'Personnel competency evaluation', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'medium'),
('training_cpd_agent', 'workforce', 'Training and CPD assessment', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'medium'),
('evidence_mapping_agent', 'validation', 'Evidence-to-requirement mapping', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'medium'),
('verifier_agent', 'validation', 'Output verification and quality assurance', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'low'),
('final_aggregator', 'synthesis', 'Result aggregation and final assessment', '{"type":"object","properties":{}}', '{"type":"object","properties":{}}', 'medium');
```

---

## F. Agent Monitoring & Alerting

### Key Metrics to Monitor
```
- Agent execution time by agent type
- Success/failure rates by agent
- Confidence score distribution
- Human review requirements by agent
- Data completeness scores
- Evidence mapping accuracy
```

### Alert Conditions
```
- Agent execution time > 5 minutes
- Agent failure rate > 10%
- Confidence score < 60% for high-risk agents
- Evidence completeness < 70%
- Human review queue > 20 items
```

### Dashboard Queries
```sql
-- Agent performance overview
SELECT
    agent_name,
    COUNT(*) as total_runs,
    AVG(confidence) as avg_confidence,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failures,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration
FROM agent_runs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY agent_name
ORDER BY total_runs DESC;

-- Compliance findings summary
SELECT
    entity_type,
    COUNT(*) as total_findings,
    COUNT(CASE WHEN status = 'open' THEN 1 END) as open_findings,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_findings,
    AVG(CASE WHEN scores_json IS NOT NULL THEN (scores_json->>'compliance_score')::decimal END) as avg_compliance
FROM compliance_findings
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY entity_type;
```

Dengan mapping database ini, sistem agent orchestration bisa langsung berinteraksi dengan database tanpa perlu transformation layer tambahan, memungkinkan implementasi end-to-end dari agent contracts ke persistent storage.