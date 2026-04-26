import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ============================================================
// Master Data Tables
// ============================================================

export const businessEntities = sqliteTable("business_entities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityName: text("entity_name").notNull(),
  entityType: text("entity_type").notNull(),
  registrationNumber: text("registration_number"),
  taxId: text("tax_id"),
  address: text("address"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const licensesPermits = sqliteTable("licenses_permits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  licenseType: text("license_type").notNull(),
  licenseNumber: text("license_number").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
  expiryDate: integer("expiry_date", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("active"),
  requirementsMet: text("requirements_met", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const businessCertifications = sqliteTable("business_certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  certificationType: text("certification_type").notNull(),
  certificationBody: text("certification_body").notNull(),
  certificateNumber: text("certificate_number").notNull(),
  issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
  expiryDate: integer("expiry_date", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("active"),
  classificationDetails: text("classification_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const personnel = sqliteTable("personnel", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  fullName: text("full_name").notNull(),
  position: text("position").notNull(),
  employeeId: text("employee_id"),
  birthDate: integer("birth_date", { mode: "timestamp" }),
  educationLevel: text("education_level"),
  yearsExperience: integer("years_experience"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  skillsProfile: text("skills_profile", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const personCompetencies = sqliteTable("person_competencies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  personnelId: integer("personnel_id").notNull().references(() => personnel.id),
  competencyType: text("competency_type").notNull(),
  competencyLevel: text("competency_level").notNull(),
  issuingBody: text("issuing_body").notNull(),
  assessmentDate: integer("assessment_date", { mode: "timestamp" }).notNull(),
  expiryDate: integer("expiry_date", { mode: "timestamp" }),
  status: text("status").notNull().default("active"),
  assessmentDetails: text("assessment_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const personCertifications = sqliteTable("person_certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  personnelId: integer("personnel_id").notNull().references(() => personnel.id),
  certificationType: text("certification_type").notNull(),
  issuingBody: text("issuing_body").notNull(),
  certificateNumber: text("certificate_number").notNull(),
  issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
  expiryDate: integer("expiry_date", { mode: "timestamp" }),
  status: text("status").notNull().default("active"),
  certificationDetails: text("certification_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const trainingPrograms = sqliteTable("training_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  programName: text("program_name").notNull(),
  provider: text("provider").notNull(),
  programType: text("program_type").notNull(),
  durationHours: integer("duration_hours").notNull(),
  competencyFocus: text("competency_focus"),
  curriculumDetails: text("curriculum_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const trainingRecords = sqliteTable("training_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  personnelId: integer("personnel_id").notNull().references(() => personnel.id),
  trainingProgramId: integer("training_program_id").notNull().references(() => trainingPrograms.id),
  completionDate: integer("completion_date", { mode: "timestamp" }).notNull(),
  hoursCompleted: integer("hours_completed").notNull(),
  grade: text("grade"),
  certificateNumber: text("certificate_number"),
  trainingDetails: text("training_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const cpdRecords = sqliteTable("cpd_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  personnelId: integer("personnel_id").notNull().references(() => personnel.id),
  activityType: text("activity_type").notNull(),
  activityName: text("activity_name").notNull(),
  cpdPoints: integer("cpd_points").notNull(),
  activityDate: integer("activity_date", { mode: "timestamp" }).notNull(),
  provider: text("provider"),
  activityDetails: text("activity_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const regulations = sqliteTable("regulations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  regulationName: text("regulation_name").notNull(),
  regulationCode: text("regulation_code").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  effectiveDate: integer("effective_date", { mode: "timestamp" }).notNull(),
  category: text("category").notNull(),
  description: text("description"),
  requirements: text("requirements", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const regulatoryObligations = sqliteTable("regulatory_obligations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  regulationId: integer("regulation_id").notNull().references(() => regulations.id),
  obligationType: text("obligation_type").notNull(),
  entityType: text("entity_type").notNull(),
  frequency: text("frequency").notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("pending"),
  obligationDetails: text("obligation_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const tenders = sqliteTable("tenders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenderNumber: text("tender_number").notNull(),
  tenderName: text("tender_name").notNull(),
  procuringEntity: text("procuring_entity").notNull(),
  estimatedValue: real("estimated_value"),
  category: text("category").notNull(),
  submissionDeadline: integer("submission_deadline", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("open"),
  requirements: text("requirements", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(),
  contractValue: real("contract_value"),
  startDate: integer("start_date", { mode: "timestamp" }),
  completionDate: integer("completion_date", { mode: "timestamp" }),
  status: text("status").notNull().default("planning"),
  projectDetails: text("project_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(),
  filePath: text("file_path").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadSource: text("upload_source"),
  extractedText: text("extracted_text"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const complianceFindings = sqliteTable("compliance_findings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  regulationId: integer("regulation_id").references(() => regulations.id),
  findingType: text("finding_type").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("open"),
  description: text("description"),
  evidence: text("evidence", { mode: "json" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// ============================================================
// Runtime Tables
// ============================================================

export const agentRequests = sqliteTable("agent_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestType: text("request_type").notNull(),
  agentType: text("agent_type").notNull(),
  inputData: text("input_data", { mode: "json" }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workflowRuns = sqliteTable("workflow_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id").notNull().references(() => agentRequests.id),
  workflowType: text("workflow_type").notNull(),
  status: text("status").notNull().default("running"),
  workflowState: text("workflow_state", { mode: "json" }),
  startedAt: integer("started_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const agentTasks = sqliteTable("agent_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workflowRunId: integer("workflow_run_id").notNull().references(() => workflowRuns.id),
  agentName: text("agent_name").notNull(),
  taskType: text("task_type").notNull(),
  taskInput: text("task_input", { mode: "json" }),
  status: text("status").notNull().default("pending"),
  taskOutput: text("task_output", { mode: "json" }),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const agentTaskOutputs = sqliteTable("agent_task_outputs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentTaskId: integer("agent_task_id").notNull().references(() => agentTasks.id),
  outputType: text("output_type").notNull(),
  outputData: text("output_data", { mode: "json" }).notNull(),
  confidenceLevel: text("confidence_level"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const toolCalls = sqliteTable("tool_calls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentTaskId: integer("agent_task_id").notNull().references(() => agentTasks.id),
  toolName: text("tool_name").notNull(),
  toolInput: text("tool_input", { mode: "json" }),
  toolOutput: text("tool_output", { mode: "json" }),
  status: text("status").notNull().default("pending"),
  executedAt: integer("executed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const agentRuns = sqliteTable("agent_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentName: text("agent_name").notNull(),
  runType: text("run_type").notNull(),
  inputData: text("input_data", { mode: "json" }),
  outputData: text("output_data", { mode: "json" }),
  status: text("status").notNull().default("running"),
  startedAt: integer("started_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const evidenceMappings = sqliteTable("evidence_mappings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id").notNull().references(() => documents.id),
  requirementId: integer("requirement_id"),
  mappingType: text("mapping_type").notNull(),
  confidenceScore: real("confidence_score"),
  mappingDetails: text("mapping_details", { mode: "json" }),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const auditEvents = sqliteTable("audit_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  action: text("action").notNull(),
  oldValues: text("old_values", { mode: "json" }),
  newValues: text("new_values", { mode: "json" }),
  userId: text("user_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// ============================================================
// Evaluation Tables
// ============================================================

export const requirementItems = sqliteTable("requirement_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requirementType: text("requirement_type").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  criteria: text("criteria", { mode: "json" }),
  priority: text("priority").notNull().default("medium"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const requirementEvaluations = sqliteTable("requirement_evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requirementItemId: integer("requirement_item_id").notNull().references(() => requirementItems.id),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  evaluationType: text("evaluation_type").notNull(),
  status: text("status").notNull().default("pending"),
  score: real("score"),
  evaluationDetails: text("evaluation_details", { mode: "json" }),
  evaluatedAt: integer("evaluated_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const evidenceLinks = sqliteTable("evidence_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requirementEvaluationId: integer("requirement_evaluation_id").notNull().references(() => requirementEvaluations.id),
  documentId: integer("document_id").notNull().references(() => documents.id),
  linkType: text("link_type").notNull(),
  relevanceScore: real("relevance_score"),
  linkDetails: text("link_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const readinessScores = sqliteTable("readiness_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requirementEvaluationId: integer("requirement_evaluation_id").notNull().references(() => requirementEvaluations.id),
  scoreType: text("score_type").notNull(),
  scoreValue: real("score_value").notNull(),
  scoreCategory: text("score_category"),
  scoringDetails: text("scoring_details", { mode: "json" }),
  calculatedAt: integer("calculated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const verificationResults = sqliteTable("verification_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  readinessScoreId: integer("readiness_score_id").notNull().references(() => readinessScores.id),
  verificationMethod: text("verification_method").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  verificationDetails: text("verification_details", { mode: "json" }),
  verifiedBy: text("verified_by"),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const finalAssessments = sqliteTable("final_assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull().references(() => businessEntities.id),
  assessmentType: text("assessment_type").notNull(),
  overallStatus: text("overall_status").notNull(),
  overallScore: real("overall_score"),
  assessmentSummary: text("assessment_summary", { mode: "json" }),
  recommendations: text("recommendations", { mode: "json" }),
  assessedAt: integer("assessed_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// ============================================================
// Type Definitions
// ============================================================

export type BusinessEntity = typeof businessEntities.$inferSelect;
export type NewBusinessEntity = typeof businessEntities.$inferInsert;

export type LicensePermit = typeof licensesPermits.$inferSelect;
export type NewLicensePermit = typeof licensesPermits.$inferInsert;

export type BusinessCertification = typeof businessCertifications.$inferSelect;
export type NewBusinessCertification = typeof businessCertifications.$inferInsert;

export type Personnel = typeof personnel.$inferSelect;
export type NewPersonnel = typeof personnel.$inferInsert;

export type PersonCompetency = typeof personCompetencies.$inferSelect;
export type NewPersonCompetency = typeof personCompetencies.$inferInsert;

export type PersonCertification = typeof personCertifications.$inferSelect;
export type NewPersonCertification = typeof personCertifications.$inferInsert;

export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type NewTrainingProgram = typeof trainingPrograms.$inferInsert;

export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type NewTrainingRecord = typeof trainingRecords.$inferInsert;

export type CpdRecord = typeof cpdRecords.$inferSelect;
export type NewCpdRecord = typeof cpdRecords.$inferInsert;

export type Regulation = typeof regulations.$inferSelect;
export type NewRegulation = typeof regulations.$inferInsert;

export type RegulatoryObligation = typeof regulatoryObligations.$inferSelect;
export type NewRegulatoryObligation = typeof regulatoryObligations.$inferInsert;

export type Tender = typeof tenders.$inferSelect;
export type NewTender = typeof tenders.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type ComplianceFinding = typeof complianceFindings.$inferSelect;
export type NewComplianceFinding = typeof complianceFindings.$inferInsert;

export type AgentRequest = typeof agentRequests.$inferSelect;
export type NewAgentRequest = typeof agentRequests.$inferInsert;

export type WorkflowRun = typeof workflowRuns.$inferSelect;
export type NewWorkflowRun = typeof workflowRuns.$inferInsert;

export type AgentTask = typeof agentTasks.$inferSelect;
export type NewAgentTask = typeof agentTasks.$inferInsert;

export type AgentTaskOutput = typeof agentTaskOutputs.$inferSelect;
export type NewAgentTaskOutput = typeof agentTaskOutputs.$inferInsert;

export type ToolCall = typeof toolCalls.$inferSelect;
export type NewToolCall = typeof toolCalls.$inferInsert;

export type AgentRun = typeof agentRuns.$inferSelect;
export type NewAgentRun = typeof agentRuns.$inferInsert;

export type EvidenceMapping = typeof evidenceMappings.$inferSelect;
export type NewEvidenceMapping = typeof evidenceMappings.$inferInsert;

export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;

export type RequirementItem = typeof requirementItems.$inferSelect;
export type NewRequirementItem = typeof requirementItems.$inferInsert;

export type RequirementEvaluation = typeof requirementEvaluations.$inferSelect;
export type NewRequirementEvaluation = typeof requirementEvaluations.$inferInsert;

export type EvidenceLink = typeof evidenceLinks.$inferSelect;
export type NewEvidenceLink = typeof evidenceLinks.$inferInsert;

export type ReadinessScore = typeof readinessScores.$inferSelect;
export type NewReadinessScore = typeof readinessScores.$inferInsert;

export type VerificationResult = typeof verificationResults.$inferSelect;
export type NewVerificationResult = typeof verificationResults.$inferInsert;

export type FinalAssessment = typeof finalAssessments.$inferSelect;
export type NewFinalAssessment = typeof finalAssessments.$inferInsert;

// ============================================================
// Conversations — persisted chat sessions per user
// ============================================================
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(), // UUID
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Percakapan Baru"),
  agentId: text("agent_id").notNull().default("general"),
  label: text("label"), // "penting" | "proyek" | "referensi" | "arsip" | null
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

// ============================================================
// Messages — individual messages within a conversation
// ============================================================
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(), // UUID
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  attachmentName: text("attachment_name"),
  attachmentType: text("attachment_type"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
