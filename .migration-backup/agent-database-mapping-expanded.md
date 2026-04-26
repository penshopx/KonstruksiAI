# Database Mapping untuk Agent Contracts

Berikut adalah mapping lengkap antara semua 11 kontrak agent dengan tabel database, termasuk tabel runtime baru yang perlu ditambahkan untuk mendukung agentic workflow.

## A. Tabel Runtime Agentic Workflow (Ditambahkan)

### 1. `requests`
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type VARCHAR(50) NOT NULL,
  requested_by UUID REFERENCES users(id),
  business_entity_id UUID REFERENCES business_entities(id),
  project_id UUID REFERENCES projects(id),
  tender_id UUID REFERENCES tenders(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  input_payload JSONB,
  output_payload JSONB,
  total_agents INTEGER DEFAULT 0,
  completed_agents INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### 2. `workflow_runs`
```sql
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  workflow_type VARCHAR(100) NOT NULL,
  orchestrator_version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `agent_tasks`
```sql
CREATE TABLE agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID REFERENCES workflow_runs(id),
  parent_task_id UUID REFERENCES agent_tasks(id),
  agent_name VARCHAR(100) NOT NULL,
  task_type VARCHAR(50),
  objective TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled')),
  depends_on JSONB, -- Array of task IDs
  input_payload JSONB,
  output_payload JSONB,
  confidence DECIMAL(3,2),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. `agent_task_outputs`
```sql
CREATE TABLE agent_task_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES agent_tasks(id),
  output_schema VARCHAR(100),
  output_payload JSONB,
  summary TEXT,
  sources_json JSONB,
  issues_json JSONB,
  recommended_actions_json JSONB,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. `tool_calls`
```sql
CREATE TABLE tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES agent_tasks(id),
  tool_name VARCHAR(100) NOT NULL,
  input_payload JSONB,
  output_payload JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  duration_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## B. Tabel Evaluation & Compliance (Ditambahkan)

### 6. `requirement_items`
```sql
CREATE TABLE requirement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  source_type VARCHAR(50), -- 'tender', 'regulation', 'manual'
  source_id UUID,
  category VARCHAR(50) CHECK (category IN ('administrative', 'technical', 'legal', 'personnel', 'certification', 'experience', 'financial')),
  description TEXT NOT NULL,
  mandatory BOOLEAN DEFAULT false,
  evidence_required JSONB, -- Array of evidence types
  evaluation_type VARCHAR(50) CHECK (evaluation_type IN ('document_check', 'classification_match', 'personnel_match', 'calculation')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  source_document_id UUID REFERENCES documents(id),
  source_page INTEGER,
  source_excerpt TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. `requirement_evaluations`
```sql
CREATE TABLE requirement_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  requirement_id UUID REFERENCES requirement_items(id),
  agent_name VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) CHECK (entity_type IN ('business_entity', 'personnel', 'tender', 'project')),
  entity_id UUID,
  evaluation_status VARCHAR(20) DEFAULT 'pending' CHECK (evaluation_status IN ('pending', 'evaluating', 'evaluated', 'failed')),
  match_status VARCHAR(20) CHECK (match_status IN ('match', 'partial_match', 'mismatch', 'not_applicable')),
  evidence_status VARCHAR(20) CHECK (evidence_status IN ('available', 'partial', 'missing', 'expired', 'invalid')),
  confidence DECIMAL(3,2),
  notes TEXT,
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. `evidence_links`
```sql
CREATE TABLE evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  requirement_id UUID REFERENCES requirement_items(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  document_id UUID REFERENCES documents(id),
  evidence_type VARCHAR(50), -- 'license', 'certificate', 'training_record', etc.
  evidence_status VARCHAR(20) CHECK (evidence_status IN ('available', 'partial', 'missing', 'expired', 'invalid')),
  confidence DECIMAL(3,2),
  valid_until DATE,
  extracted_evidence TEXT,
  validation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. `compliance_findings`
```sql
CREATE TABLE compliance_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  finding_type VARCHAR(50), -- 'gap', 'risk', 'recommendation', 'compliance'
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category VARCHAR(50),
  title VARCHAR(200),
  description TEXT,
  evidence_json JSONB,
  recommended_action TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed')),
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. `readiness_scores`
```sql
CREATE TABLE readiness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  score_type VARCHAR(50), -- 'readiness_score', 'compliance_score', 'evidence_completeness_score', etc.
  score_value DECIMAL(5,2), -- 0-100 scale
  score_breakdown JSONB, -- Detailed breakdown
  calculated_by VARCHAR(100), -- Agent name
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(request_id, entity_type, entity_id, score_type)
);
```

### 11. `verification_results`
```sql
CREATE TABLE verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  task_id UUID REFERENCES agent_tasks(id),
  schema_valid BOOLEAN DEFAULT false,
  consistency_status VARCHAR(20) CHECK (consistency_status IN ('consistent', 'mostly_consistent', 'inconsistent')),
  missing_evaluations INTEGER DEFAULT 0,
  ambiguity_count INTEGER DEFAULT 0,
  verification_passed BOOLEAN DEFAULT false,
  verification_notes TEXT,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. `final_assessments`
```sql
CREATE TABLE final_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  final_status VARCHAR(50), -- 'eligible', 'conditionally_eligible', 'not_eligible'
  readiness_score DECIMAL(5,2),
  compliance_score DECIMAL(5,2),
  evidence_completeness_score DECIMAL(5,2),
  summary_json JSONB,
  key_strengths JSONB,
  critical_issues JSONB,
  next_steps JSONB,
  requires_human_review BOOLEAN DEFAULT false,
  confidence_level VARCHAR(20) CHECK (confidence_level IN ('high', 'medium', 'low')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## C. Agent-to-Table Mapping Specifications

### 1. Orchestrator Agent Mapping

#### **Reads From:**
- `requests` (request_type, business_entity_id, input_payload)
- `business_entities` (sector, status)
- `tenders` (sector, location, deadline, status)
- `projects` (sector, location, status)
- `documents` (entity_type, entity_id, processing_status)

#### **Writes To:**
- `workflow_runs` (workflow_type, status, orchestrator_version)
- `agent_tasks` (agent_name, task_type, objective, depends_on, input_payload)
- `audit_events` (action='orchestration_started', details about task graph)

#### **Example Query Pattern:**
```sql
-- Create workflow run
INSERT INTO workflow_runs (request_id, workflow_type, status)
VALUES ($request_id, 'tender_eligibility_check', 'running');

-- Create agent tasks based on orchestration plan
INSERT INTO agent_tasks (workflow_run_id, agent_name, task_type, objective, depends_on, input_payload)
SELECT $workflow_run_id, agent_name, task_type, objective, depends_on, input_payload
FROM jsonb_array_elements($execution_plan) AS plan;
```

---

### 2. Document Intake Agent Mapping

#### **Reads From:**
- `documents` (id, filename, mime_type, size_bytes, uploaded_by)

#### **Writes To:**
- `documents` (processing_status, extracted_text, ocr_text, document_type, page_count)
- `document_chunks` (document_id, chunk_index, content, section_metadata)
- `document_sections` (document_id, section_title, start_page, end_page)
- `document_tables` (document_id, page, table_json)
- `tool_calls` (task_id, tool_name, input_payload, output_payload, status, duration_ms)

#### **Example Query Pattern:**
```sql
-- Update document processing status
UPDATE documents
SET processing_status = 'processed',
    extracted_text = $extracted_text,
    document_type = $document_type,
    page_count = $page_count
WHERE id = $document_id;

-- Insert document chunks
INSERT INTO document_chunks (document_id, chunk_index, content, section_metadata)
VALUES ($document_id, $chunk_index, $content, $section_metadata);
```

---

### 3. Tender Agent Mapping

#### **Reads From:**
- `tenders` (id, title, sector, location, value, deadline, owner)
- `documents` (id, extracted_text, ocr_text)
- `document_chunks` (document_id, content, section_metadata)
- `document_tables` (document_id, table_json)

#### **Writes To:**
- `requirement_items` (request_id, source_type, source_id, category, description, mandatory, evidence_required, evaluation_type, priority, source_document_id, source_page, source_excerpt)
- `agent_task_outputs` (task_id, output_schema, output_payload, summary, sources_json)

#### **Example Query Pattern:**
```sql
-- Insert extracted requirements
INSERT INTO requirement_items (
  request_id, source_type, source_id, category, description,
  mandatory, evidence_required, evaluation_type, priority,
  source_document_id, source_page, source_excerpt
)
SELECT $request_id, 'tender', $tender_id, category, description,
       mandatory, evidence_required, evaluation_type, priority,
       $document_id, source_page, source_excerpt
FROM jsonb_array_elements($requirements_array) AS req;
```

---

### 4. Legal Agent Mapping

#### **Reads From:**
- `business_entities` (id, name, sector, legal_status)
- `licenses_permits` (business_entity_id, name, category, expiry_date, status, authority)
- `requirement_items` (request_id, category='legal', description, evidence_required)
- `documents` (entity_type='license', entity_id)

#### **Writes To:**
- `requirement_evaluations` (request_id, requirement_id, agent_name, entity_type, entity_id, evaluation_status, match_status, evidence_status, confidence, notes)
- `compliance_findings` (request_id, entity_type, entity_id, finding_type, severity, category, title, description, evidence_json, recommended_action, status)

#### **Example Query Pattern:**
```sql
-- Evaluate legal requirements
INSERT INTO requirement_evaluations (
  request_id, requirement_id, agent_name, entity_type, entity_id,
  evaluation_status, match_status, evidence_status, confidence, notes
)
SELECT $request_id, ri.id, 'legal_agent', 'business_entity', $entity_id,
       'evaluated', 
       CASE WHEN lp.id IS NOT NULL THEN 'match' ELSE 'mismatch' END,
       CASE WHEN lp.id IS NOT NULL THEN 'available' ELSE 'missing' END,
       0.95, $evaluation_notes
FROM requirement_items ri
LEFT JOIN licenses_permits lp ON lp.business_entity_id = $entity_id 
  AND lp.name ILIKE '%' || ri.description || '%'
WHERE ri.request_id = $request_id AND ri.category = 'legal';
```

---

### 5. Licensing Agent Mapping

#### **Reads From:**
- `business_entities` (id, sector, location)
- `licenses_permits` (business_entity_id, name, category, authority, region, status)
- `regulatory_obligations` (subjek, trigger_kondisi, evidence_required, sector)
- `requirement_items` (request_id, category='legal', description)

#### **Writes To:**
- `requirement_evaluations` (evaluation of licensing requirements)
- `compliance_findings` (licensing gaps and recommendations)
- `readiness_scores` (licensing_gap_score)

#### **Example Query Pattern:**
```sql
-- Check licensing compliance
INSERT INTO compliance_findings (
  request_id, entity_type, entity_id, finding_type, severity,
  category, title, description, recommended_action
)
SELECT $request_id, 'business_entity', $entity_id, 'gap', 
       CASE WHEN ro.severity = 'high' THEN 'high' ELSE 'medium' END,
       'licensing', 
       'Missing Required License: ' || ro.description,
       'Business requires ' || ro.description || ' based on regulatory obligations',
       'Obtain ' || ro.description || ' from ' || ro.authority
FROM regulatory_obligations ro
WHERE ro.subjek = 'business_entity' 
  AND ro.sector = $business_sector
  AND NOT EXISTS (
    SELECT 1 FROM licenses_permits lp 
    WHERE lp.business_entity_id = $entity_id 
    AND lp.category = ro.category
  );
```

---

### 6. Business Certification Agent Mapping

#### **Reads From:**
- `business_entities` (id, sector, classification)
- `business_certifications` (business_entity_id, name, classification, sub_classification, expiry_date, status)
- `requirement_items` (request_id, category='business_certification')

#### **Writes To:**
- `requirement_evaluations` (certification requirement evaluations)
- `compliance_findings` (certification gaps and expiry warnings)
- `readiness_scores` (certification readiness scores)

#### **Example Query Pattern:**
```sql
-- Evaluate certification requirements
INSERT INTO requirement_evaluations (
  request_id, requirement_id, agent_name, entity_type, entity_id,
  evaluation_status, match_status, evidence_status, confidence, notes
)
SELECT $request_id, ri.id, 'business_certification_agent', 'business_entity', $entity_id,
       'evaluated',
       CASE 
         WHEN bc.classification = ri.required_classification THEN 'match'
         WHEN bc.classification IS NOT NULL THEN 'partial_match'
         ELSE 'mismatch'
       END,
       CASE WHEN bc.id IS NOT NULL THEN 'available' ELSE 'missing' END,
       CASE 
         WHEN bc.expiry_date > CURRENT_DATE + INTERVAL '90 days' THEN 0.95
         WHEN bc.expiry_date > CURRENT_DATE THEN 0.80
         ELSE 0.60
       END,
       CASE 
         WHEN bc.expiry_date <= CURRENT_DATE THEN 'Certificate expired'
         WHEN bc.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Certificate expires soon'
         ELSE 'Certificate valid'
       END
FROM requirement_items ri
LEFT JOIN business_certifications bc ON bc.business_entity_id = $entity_id
WHERE ri.request_id = $request_id AND ri.category = 'business_certification';
```

---

### 7. Competency Agent Mapping

#### **Reads From:**
- `personnel` (id, name, position, skills, certifications, experience)
- `person_competencies` (personnel_id, skill_name, proficiency_level, verified)
- `person_certifications` (personnel_id, certification_type, expiry_date, status)
- `training_records` (personnel_id, program_name, completion_date)
- `requirement_items` (request_id, category='personnel')

#### **Writes To:**
- `requirement_evaluations` (personnel requirement evaluations)
- `compliance_findings` (personnel competency gaps)
- `readiness_scores` (personnel coverage scores)

#### **Example Query Pattern:**
```sql
-- Evaluate personnel requirements
INSERT INTO requirement_evaluations (
  request_id, requirement_id, agent_name, entity_type, entity_id,
  evaluation_status, match_status, evidence_status, confidence, notes
)
SELECT $request_id, ri.id, 'competency_agent', 'personnel', p.id,
       'evaluated',
       CASE 
         WHEN p.experience_years >= ri.required_experience AND pc.id IS NOT NULL THEN 'match'
         WHEN p.experience_years >= ri.required_experience THEN 'partial_match'
         ELSE 'mismatch'
       END,
       CASE WHEN pc.id IS NOT NULL THEN 'available' ELSE 'missing' END,
       0.85,
       CASE 
         WHEN p.experience_years < ri.required_experience THEN 'Insufficient experience'
         WHEN pc.id IS NULL THEN 'Missing required certification'
         ELSE 'Requirements met'
       END
FROM requirement_items ri
CROSS JOIN personnel p
LEFT JOIN person_certifications pc ON pc.personnel_id = p.id 
  AND pc.certification_type = ri.required_certification
WHERE ri.request_id = $request_id AND ri.category = 'personnel';
```

---

### 8. Evidence Mapping Agent Mapping

#### **Reads From:**
- `requirement_items` (request_id, id, category, evidence_required)
- `requirement_evaluations` (requirement_id, evidence_status, confidence)
- `documents` (id, entity_type, entity_id, extracted_text)
- `evidence_links` (existing mappings for cross-referencing)

#### **Writes To:**
- `evidence_links` (requirement_id, document_id, evidence_status, confidence, extracted_evidence)
- `readiness_scores` (evidence_completeness_score)
- `compliance_findings` (evidence gaps and recommendations)

#### **Example Query Pattern:**
```sql
-- Create evidence mappings
INSERT INTO evidence_links (
  request_id, requirement_id, entity_type, entity_id, document_id,
  evidence_type, evidence_status, confidence, extracted_evidence, validation_notes
)
SELECT $request_id, ri.id, 'business_entity', $entity_id, d.id,
       ri.category, 'available', 0.90, 
       substring(d.extracted_text from 'evidence_pattern'),
       'Auto-mapped with high confidence'
FROM requirement_items ri
JOIN documents d ON d.entity_id = $entity_id
WHERE ri.request_id = $request_id 
  AND d.extracted_text ILIKE '%' || ri.evidence_required[1] || '%';
```

---

### 9. Final Aggregator Agent Mapping

#### **Reads From:**
- `requirement_items` (all requirements for the request)
- `requirement_evaluations` (all evaluations)
- `evidence_links` (evidence completeness)
- `compliance_findings` (gaps and issues)
- `readiness_scores` (component scores)
- `verification_results` (quality assurance)

#### **Writes To:**
- `final_assessments` (final_status, scores, summary, key_strengths, critical_issues, next_steps)
- `readiness_scores` (overall readiness_score)
- `audit_events` (final assessment logged)

#### **Example Query Pattern:**
```sql
-- Calculate final assessment
INSERT INTO final_assessments (
  request_id, final_status, readiness_score, compliance_score, 
  evidence_completeness_score, summary_json, key_strengths, 
  critical_issues, next_steps, requires_human_review, confidence_level
)
SELECT 
  $request_id,
  CASE 
    WHEN rs.readiness_score >= 80 AND cf.critical_count = 0 THEN 'eligible'
    WHEN rs.readiness_score >= 60 THEN 'conditionally_eligible'
    ELSE 'not_eligible'
  END,
  rs.readiness_score,
  rs.compliance_score,
  rs.evidence_completeness_score,
  $summary_json,
  $key_strengths_json,
  $critical_issues_json,
  $next_steps_json,
  CASE WHEN rs.readiness_score < 70 OR cf.critical_count > 2 THEN true ELSE false END,
  CASE 
    WHEN rs.evidence_completeness_score > 80 THEN 'high'
    WHEN rs.evidence_completeness_score > 60 THEN 'medium'
    ELSE 'low'
  END
FROM readiness_scores rs
LEFT JOIN (
  SELECT request_id, COUNT(*) as critical_count 
  FROM compliance_findings 
  WHERE severity = 'critical' AND status = 'open'
) cf ON cf.request_id = rs.request_id
WHERE rs.request_id = $request_id AND rs.score_type = 'overall_readiness';
```

---

## D. End-to-End Data Flow for Tender Eligibility

### Phase 1: Request Initiation
```
User Request → requests (INSERT)
           → workflow_runs (INSERT)
           → agent_tasks (INSERT for orchestrator)
```

### Phase 2: Document Processing
```
Orchestrator → agent_tasks (UPDATE status)
           → Document Intake → documents (UPDATE)
           → document_chunks (INSERT)
           → document_sections (INSERT)
```

### Phase 3: Requirement Extraction
```
Tender Agent → requirement_items (INSERT)
            → agent_task_outputs (INSERT)
```

### Phase 4: Domain Evaluations
```
Legal Agent → requirement_evaluations (INSERT)
           → compliance_findings (INSERT)
           → readiness_scores (INSERT)

Licensing Agent → requirement_evaluations (INSERT)
               → compliance_findings (INSERT)

Business Cert Agent → requirement_evaluations (INSERT)
                    → compliance_findings (INSERT)

Competency Agent → requirement_evaluations (INSERT)
                 → compliance_findings (INSERT)
```

### Phase 5: Evidence Mapping
```
Evidence Mapping → evidence_links (INSERT)
                 → readiness_scores (UPDATE)
```

### Phase 6: Verification & Aggregation
```
Verifier Agent → verification_results (INSERT)
              → agent_task_outputs (UPDATE)

Final Aggregator → final_assessments (INSERT)
                 → readiness_scores (INSERT final scores)
                 → audit_events (INSERT)
```

### Phase 7: Completion
```
requests (UPDATE status = 'completed')
workflow_runs (UPDATE status = 'completed')
agent_tasks (UPDATE status = 'completed')
```

---

## E. Key Relationships & Constraints

### Foreign Key Relationships
```sql
-- Core workflow relationships
requests.id → workflow_runs.request_id
workflow_runs.id → agent_tasks.workflow_run_id
agent_tasks.id → agent_task_outputs.task_id
agent_tasks.id → tool_calls.task_id

-- Evaluation relationships
requests.id → requirement_items.request_id
requirement_items.id → requirement_evaluations.requirement_id
requirement_items.id → evidence_links.requirement_id
requests.id → compliance_findings.request_id
requests.id → readiness_scores.request_id
requests.id → final_assessments.request_id

-- Entity relationships (existing)
business_entities.id → licenses_permits.business_entity_id
business_entities.id → business_certifications.business_entity_id
personnel.id → person_certifications.personnel_id
personnel.id → training_records.personnel_id
```

### Data Integrity Constraints
```sql
-- Status transition constraints
CHECK (requests.status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
CHECK (workflow_runs.status IN ('pending', 'running', 'completed', 'failed'))
CHECK (agent_tasks.status IN ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled'))

-- Score range constraints
CHECK (readiness_scores.score_value >= 0 AND readiness_scores.score_value <= 100)
CHECK (requirement_evaluations.confidence >= 0 AND requirement_evaluations.confidence <= 1)

-- Enum constraints
CHECK (requirement_items.category IN ('administrative', 'technical', 'legal', 'personnel', 'certification', 'experience', 'financial'))
CHECK (compliance_findings.severity IN ('low', 'medium', 'high', 'critical'))
CHECK (evidence_links.evidence_status IN ('available', 'partial', 'missing', 'expired', 'invalid'))
```

---

## F. Performance Optimization

### Indexing Strategy
```sql
-- Workflow performance indexes
CREATE INDEX idx_agent_tasks_workflow_status ON agent_tasks(workflow_run_id, status);
CREATE INDEX idx_agent_task_outputs_task ON agent_task_outputs(task_id);
CREATE INDEX idx_requests_status_created ON requests(status, created_at);

-- Evaluation performance indexes
CREATE INDEX idx_requirement_evaluations_request ON requirement_evaluations(request_id, requirement_id);
CREATE INDEX idx_evidence_links_requirement ON evidence_links(request_id, requirement_id);
CREATE INDEX idx_compliance_findings_request_severity ON compliance_findings(request_id, severity, status);
CREATE INDEX idx_readiness_scores_request_type ON readiness_scores(request_id, score_type);

-- Composite indexes for common queries
CREATE INDEX idx_agent_tasks_status_created ON agent_tasks(status, created_at) WHERE status IN ('pending', 'running');
CREATE INDEX idx_compliance_findings_entity_severity ON compliance_findings(entity_type, entity_id, severity) WHERE status = 'open';
```

### Query Optimization Patterns
```sql
-- Paginated agent task retrieval
SELECT * FROM agent_tasks 
WHERE workflow_run_id = $workflow_id AND status = 'pending'
ORDER BY created_at ASC
LIMIT $page_size OFFSET $offset;

-- Compliance dashboard aggregation
SELECT 
  entity_type,
  COUNT(*) as total_findings,
  COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_findings,
  AVG(CASE WHEN scores.score_type = 'readiness_score' THEN scores.score_value END) as avg_readiness
FROM compliance_findings cf
LEFT JOIN readiness_scores scores ON scores.request_id = cf.request_id
WHERE cf.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY entity_type;

-- Evidence completeness calculation
SELECT 
  request_id,
  COUNT(*) as total_requirements,
  COUNT(CASE WHEN evidence_status = 'available' THEN 1 END) as available_evidence,
  ROUND(
    COUNT(CASE WHEN evidence_status = 'available' THEN 1 END)::decimal / 
    COUNT(*)::decimal * 100, 2
  ) as completeness_percentage
FROM evidence_links
WHERE request_id = $request_id
GROUP BY request_id;
```

---

## G. Data Archiving Strategy

### Archive Triggers
- Requests older than 2 years
- Completed workflows older than 1 year
- Agent tasks older than 6 months (keep summaries)
- Document chunks older than 1 year (keep metadata)

### Archive Tables Structure
```sql
-- Archive tables with same structure as active tables
CREATE TABLE requests_archive (LIKE requests INCLUDING ALL);
CREATE TABLE agent_tasks_archive (LIKE agent_tasks INCLUDING ALL);
CREATE TABLE compliance_findings_archive (LIKE compliance_findings INCLUDING ALL);

-- Archive partition function
CREATE OR REPLACE FUNCTION archive_old_data() RETURNS void AS $$
BEGIN
  -- Archive completed requests older than 2 years
  INSERT INTO requests_archive 
  SELECT * FROM requests 
  WHERE status = 'completed' AND created_at < CURRENT_DATE - INTERVAL '2 years';
  
  DELETE FROM requests 
  WHERE status = 'completed' AND created_at < CURRENT_DATE - INTERVAL '2 years';
  
  -- Similar for other tables...
END;
$$ LANGUAGE plpgsql;
```

---

## H. Monitoring & Alerting Queries

### System Health Monitoring
```sql
-- Agent performance monitoring
SELECT 
  agent_name,
  COUNT(*) as total_runs,
  AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) as avg_duration_seconds,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failures,
  MAX(finished_at) as last_run
FROM agent_tasks
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY agent_name
ORDER BY total_runs DESC;

-- Workflow bottleneck detection
SELECT 
  workflow_type,
  AVG(EXTRACT(EPOCH FROM (finished_at - started_at))/3600) as avg_duration_hours,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failures,
  COUNT(*) as total_workflows
FROM workflow_runs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY workflow_type
ORDER BY avg_duration_hours DESC;
```

### Business Intelligence Queries
```sql
-- Compliance trends
SELECT 
  DATE_TRUNC('month', created_at) as month,
  AVG(rs.score_value) as avg_readiness_score,
  COUNT(cf.id) as total_findings,
  COUNT(CASE WHEN cf.severity = 'critical' THEN 1 END) as critical_findings
FROM requests r
LEFT JOIN readiness_scores rs ON rs.request_id = r.id AND rs.score_type = 'readiness_score'
LEFT JOIN compliance_findings cf ON cf.request_id = r.id
WHERE r.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Top compliance gaps
SELECT 
  cf.category,
  cf.title,
  COUNT(*) as occurrence_count,
  AVG(rs.score_value) as avg_readiness_impact
FROM compliance_findings cf
LEFT JOIN readiness_scores rs ON rs.request_id = cf.request_id AND rs.score_type = 'readiness_score'
WHERE cf.created_at >= CURRENT_DATE - INTERVAL '90 days'
  AND cf.status = 'open'
GROUP BY cf.category, cf.title
ORDER BY occurrence_count DESC, avg_readiness_impact ASC
LIMIT 20;
```

Dengan database mapping ini, sistem agent orchestration memiliki fondasi yang solid untuk menjalankan complex workflows dengan proper data persistence, audit trails, dan performance optimization.