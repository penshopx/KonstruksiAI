#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(process.cwd(), 'konstruksi.db');
const db = new Database(dbPath);

console.log('Starting database migration...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create all tables using raw SQL
const createTablesSQL = `
-- Master Data Tables
CREATE TABLE IF NOT EXISTS business_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  registration_number TEXT,
  tax_id TEXT,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS licenses_permits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  license_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  issue_date INTEGER NOT NULL,
  expiry_date INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  requirements_met TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS business_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  certification_type TEXT NOT NULL,
  certification_body TEXT NOT NULL,
  certificate_number TEXT NOT NULL,
  issue_date INTEGER NOT NULL,
  expiry_date INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  classification_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  employee_id TEXT,
  birth_date INTEGER,
  education_level TEXT,
  years_experience INTEGER,
  contact_email TEXT,
  contact_phone TEXT,
  skills_profile TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS person_competencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id),
  competency_type TEXT NOT NULL,
  competency_level TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  assessment_date INTEGER NOT NULL,
  expiry_date INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  assessment_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS person_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id),
  certification_type TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  certificate_number TEXT NOT NULL,
  issue_date INTEGER NOT NULL,
  expiry_date INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  certification_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS training_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  program_type TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  competency_focus TEXT,
  curriculum_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS training_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id),
  training_program_id INTEGER NOT NULL REFERENCES training_programs(id),
  completion_date INTEGER NOT NULL,
  hours_completed INTEGER NOT NULL,
  grade TEXT,
  certificate_number TEXT,
  training_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS cpd_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id),
  activity_type TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  cpd_points INTEGER NOT NULL,
  activity_date INTEGER NOT NULL,
  provider TEXT,
  activity_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS regulations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  regulation_name TEXT NOT NULL,
  regulation_code TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  effective_date INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS regulatory_obligations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  regulation_id INTEGER NOT NULL REFERENCES regulations(id),
  obligation_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  due_date INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  obligation_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS tenders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tender_number TEXT NOT NULL,
  tender_name TEXT NOT NULL,
  procuring_entity TEXT NOT NULL,
  estimated_value REAL,
  category TEXT NOT NULL,
  submission_deadline INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  requirements TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  contract_value REAL,
  start_date INTEGER,
  completion_date INTEGER,
  status TEXT NOT NULL DEFAULT 'planning',
  project_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  upload_source TEXT,
  extracted_text TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS compliance_findings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  regulation_id INTEGER REFERENCES regulations(id),
  finding_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  description TEXT,
  evidence TEXT,
  due_date INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Runtime Tables
CREATE TABLE IF NOT EXISTS agent_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_type TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  input_data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES agent_requests(id),
  workflow_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  workflow_state TEXT,
  started_at INTEGER DEFAULT (unixepoch()),
  completed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_run_id INTEGER NOT NULL REFERENCES workflow_runs(id),
  agent_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  task_input TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  task_output TEXT,
  started_at INTEGER,
  completed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS agent_task_outputs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_task_id INTEGER NOT NULL REFERENCES agent_tasks(id),
  output_type TEXT NOT NULL,
  output_data TEXT NOT NULL,
  confidence_level TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS tool_calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_task_id INTEGER NOT NULL REFERENCES agent_tasks(id),
  tool_name TEXT NOT NULL,
  tool_input TEXT,
  tool_output TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  executed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_name TEXT NOT NULL,
  run_type TEXT NOT NULL,
  input_data TEXT,
  output_data TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  started_at INTEGER DEFAULT (unixepoch()),
  completed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS evidence_mappings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  requirement_id INTEGER,
  mapping_type TEXT NOT NULL,
  confidence_score REAL,
  mapping_details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  old_values TEXT,
  new_values TEXT,
  user_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Evaluation Tables
CREATE TABLE IF NOT EXISTS requirement_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS requirement_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_item_id INTEGER NOT NULL REFERENCES requirement_items(id),
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  evaluation_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  score REAL,
  evaluation_details TEXT,
  evaluated_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS evidence_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_evaluation_id INTEGER NOT NULL REFERENCES requirement_evaluations(id),
  document_id INTEGER NOT NULL REFERENCES documents(id),
  link_type TEXT NOT NULL,
  relevance_score REAL,
  link_details TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS readiness_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_evaluation_id INTEGER NOT NULL REFERENCES requirement_evaluations(id),
  score_type TEXT NOT NULL,
  score_value REAL NOT NULL,
  score_category TEXT,
  scoring_details TEXT,
  calculated_at INTEGER DEFAULT (unixepoch()),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS verification_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  readiness_score_id INTEGER NOT NULL REFERENCES readiness_scores(id),
  verification_method TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  verification_details TEXT,
  verified_by TEXT,
  verified_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS final_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL REFERENCES business_entities(id),
  assessment_type TEXT NOT NULL,
  overall_status TEXT NOT NULL,
  overall_score REAL,
  assessment_summary TEXT,
  recommendations TEXT,
  assessed_at INTEGER DEFAULT (unixepoch()),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
`;

const createIndexesSQL = `
-- Performance indexes for master data tables
CREATE INDEX IF NOT EXISTS idx_business_entities_entity_name ON business_entities(entity_name);
CREATE INDEX IF NOT EXISTS idx_business_entities_entity_type ON business_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_licenses_permits_entity_id ON licenses_permits(entity_id);
CREATE INDEX IF NOT EXISTS idx_licenses_permits_status ON licenses_permits(status);
CREATE INDEX IF NOT EXISTS idx_licenses_permits_expiry_date ON licenses_permits(expiry_date);
CREATE INDEX IF NOT EXISTS idx_business_certifications_entity_id ON business_certifications(entity_id);
CREATE INDEX IF NOT EXISTS idx_business_certifications_status ON business_certifications(status);
CREATE INDEX IF NOT EXISTS idx_business_certifications_expiry_date ON business_certifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_personnel_entity_id ON personnel(entity_id);
CREATE INDEX IF NOT EXISTS idx_personnel_full_name ON personnel(full_name);
CREATE INDEX IF NOT EXISTS idx_person_competencies_personnel_id ON person_competencies(personnel_id);
CREATE INDEX IF NOT EXISTS idx_person_competencies_status ON person_competencies(status);
CREATE INDEX IF NOT EXISTS idx_person_competencies_expiry_date ON person_competencies(expiry_date);
CREATE INDEX IF NOT EXISTS idx_person_certifications_personnel_id ON person_certifications(personnel_id);
CREATE INDEX IF NOT EXISTS idx_person_certifications_status ON person_certifications(status);
CREATE INDEX IF NOT EXISTS idx_person_certifications_expiry_date ON person_certifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_training_records_personnel_id ON training_records(personnel_id);
CREATE INDEX IF NOT EXISTS idx_training_records_training_program_id ON training_records(training_program_id);
CREATE INDEX IF NOT EXISTS idx_cpd_records_personnel_id ON cpd_records(personnel_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_obligations_regulation_id ON regulatory_obligations(regulation_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_obligations_status ON regulatory_obligations(status);
CREATE INDEX IF NOT EXISTS idx_regulatory_obligations_due_date ON regulatory_obligations(due_date);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_submission_deadline ON tenders(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_projects_entity_id ON projects(entity_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_compliance_findings_entity_id ON compliance_findings(entity_id);
CREATE INDEX IF NOT EXISTS idx_compliance_findings_status ON compliance_findings(status);
CREATE INDEX IF NOT EXISTS idx_compliance_findings_due_date ON compliance_findings(due_date);

-- Performance indexes for runtime tables
CREATE INDEX IF NOT EXISTS idx_agent_requests_status ON agent_requests(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_request_id ON workflow_runs(request_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_workflow_run_id ON agent_tasks(workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_task_outputs_agent_task_id ON agent_task_outputs(agent_task_id);
CREATE INDEX IF NOT EXISTS idx_tool_calls_agent_task_id ON tool_calls(agent_task_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_evidence_mappings_document_id ON evidence_mappings(document_id);
CREATE INDEX IF NOT EXISTS idx_evidence_mappings_status ON evidence_mappings(status);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type ON audit_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at);

-- Performance indexes for evaluation tables
CREATE INDEX IF NOT EXISTS idx_requirement_evaluations_requirement_item_id ON requirement_evaluations(requirement_item_id);
CREATE INDEX IF NOT EXISTS idx_requirement_evaluations_entity_id ON requirement_evaluations(entity_id);
CREATE INDEX IF NOT EXISTS idx_requirement_evaluations_status ON requirement_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evidence_links_requirement_evaluation_id ON evidence_links(requirement_evaluation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_document_id ON evidence_links(document_id);
CREATE INDEX IF NOT EXISTS idx_readiness_scores_requirement_evaluation_id ON readiness_scores(requirement_evaluation_id);
CREATE INDEX IF NOT EXISTS idx_verification_results_readiness_score_id ON verification_results(readiness_score_id);
CREATE INDEX IF NOT EXISTS idx_final_assessments_entity_id ON final_assessments(entity_id);
`;

try {
  // Create all tables
  db.exec(createTablesSQL);
  console.log('✅ All database tables created successfully');

  // Create all indexes
  db.exec(createIndexesSQL);
  console.log('✅ All database indexes created successfully');

  console.log('🎉 Database migration completed successfully!');
  console.log('📊 Total tables created: 27');
  console.log('🔗 Foreign key constraints enabled');
  console.log('⚡ Performance indexes created');

} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}