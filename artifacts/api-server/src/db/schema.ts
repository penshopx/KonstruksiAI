import { sqliteTable, text, integer, uniqueIndex, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  plan: text("plan").notNull().default("free"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// No profile/contact details or provider payloads. Preserve internal actor IDs
// even if an account is later removed.
export const tenderProviderAudit = sqliteTable("tender_provider_audit", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id").notNull(),
  checkedAt: text("checked_at").notNull(),
  code: text("code").notNull(),
});

export const paymentSubscriptions = sqliteTable("payment_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerSubscriptionId: text("provider_subscription_id").notNull(),
  plan: text("plan").notNull().default("pro"),
  status: text("status").notNull(),
  lastEventAt: integer("last_event_at", { mode: "timestamp" }).notNull(),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  providerSubscriptionUnique: uniqueIndex("payment_subscriptions_provider_subscription_unique")
    .on(table.provider, table.providerSubscriptionId),
}));
export const learningProgress = sqliteTable("learning_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pathId: text("path_id").notNull(),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  userLessonUnique: uniqueIndex("learning_progress_user_lesson_unique")
    .on(table.userId, table.pathId, table.moduleId, table.lessonId),
}));

export type LearningProgress = typeof learningProgress.$inferSelect;
export type NewLearningProgress = typeof learningProgress.$inferInsert;

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").references(() => projectWorkspaces.id, { onDelete: "set null" }),
  title: text("title").notNull().default("Percakapan Baru"),
  agentId: text("agent_id").notNull().default("general"),
  label: text("label"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export const projectWorkspaces = sqliteTable("project_workspaces", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  stageId: text("stage_id").notNull().default("tender"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
});

export type ProjectWorkspace = typeof projectWorkspaces.$inferSelect;
export type NewProjectWorkspace = typeof projectWorkspaces.$inferInsert;

export const projectWorkspaceMembers = sqliteTable("project_workspace_members", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => projectWorkspaces.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("viewer"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  revokedAt: integer("revoked_at", { mode: "timestamp" }),
});

export type ProjectWorkspaceMember = typeof projectWorkspaceMembers.$inferSelect;
export type NewProjectWorkspaceMember = typeof projectWorkspaceMembers.$inferInsert;

export const aiExecutionHistory = sqliteTable("ai_execution_history", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").references(() => projectWorkspaces.id, { onDelete: "set null" }),
  module: text("module").notNull(),
  status: text("status").notNull().default("pending"),
  inputSummary: text("input_summary").notNull(),
  resultRef: text("result_ref"),
  retryOfId: text("retry_of_id"),
  errorMessage: text("error_message"),
  startedAt: integer("started_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type AiExecutionHistory = typeof aiExecutionHistory.$inferSelect;
export type NewAiExecutionHistory = typeof aiExecutionHistory.$inferInsert;

// Immutable scope survives workspace deletion (history's FK is SET NULL).
export const tenderAnalysisRequests = sqliteTable("tender_analysis_requests", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceScope: text("workspace_scope").notNull(),
  inputHash: text("input_hash").notNull(),
  executionId: text("execution_id").notNull().unique().references(() => aiExecutionHistory.id, { onDelete: "cascade" }),
});

export const solverAnalysisResults = sqliteTable("solver_analysis_results", {
  id: text("id").primaryKey(),
  executionId: text("execution_id").notNull().unique().references(() => aiExecutionHistory.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").references(() => projectWorkspaces.id, { onDelete: "set null" }),
  domain: text("domain").notNull(),
  problem: text("problem").notNull(),
  context: text("context").notNull().default(""),
  outputFormat: text("output_format").notNull(),
  approach: text("approach").notNull(),
  analysis: text("analysis").notNull(),
  solution: text("solution").notNull(),
  regulations: text("regulations").notNull().default("[]"),
  nextSteps: text("next_steps").notNull().default("[]"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type SolverAnalysisResult = typeof solverAnalysisResults.$inferSelect;
export type NewSolverAnalysisResult = typeof solverAnalysisResults.$inferInsert;

export const tenderAnalysisResults = sqliteTable("tender_analysis_results", {
  id: text("id").primaryKey(),
  executionId: text("execution_id").notNull().unique().references(() => aiExecutionHistory.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").references(() => projectWorkspaces.id, { onDelete: "set null" }),
  projectName: text("project_name").notNull(),
  tenderType: text("tender_type").notNull(),
  projectDetails: text("project_details").notNull().default(""),
  documents: text("documents").notNull().default("[]"),
  checklistState: text("checklist_state").notNull().default("{}"),
  completenessChecks: text("completeness_checks").notNull().default("[]"),
  overallCompleteness: integer("overall_completeness").notNull(),
  risks: text("risks").notNull().default("[]"),
  recommendations: text("recommendations").notNull().default("[]"),
  complianceScore: integer("compliance_score").notNull(),
  summary: text("summary").notNull().default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type TenderAnalysisResult = typeof tenderAnalysisResults.$inferSelect;
export type NewTenderAnalysisResult = typeof tenderAnalysisResults.$inferInsert;

export const projectWorkspaceInvitations = sqliteTable("project_workspace_invitations", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => projectWorkspaces.id, { onDelete: "cascade" }),
  invitedEmail: text("invited_email").notNull(),
  role: text("role").notNull().default("viewer"),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  acceptedAt: integer("accepted_at", { mode: "timestamp" }),
  revokedAt: integer("revoked_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type ProjectWorkspaceInvitation = typeof projectWorkspaceInvitations.$inferSelect;
export type NewProjectWorkspaceInvitation = typeof projectWorkspaceInvitations.$inferInsert;

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  agentId: text("agent_id"),
  domainFitLevel: text("domain_fit_level"),
  domainFitReason: text("domain_fit_reason"),
  recommendedAgentId: text("recommended_agent_id"),
  attachmentName: text("attachment_name"),
  attachmentType: text("attachment_type"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const radarArticles = sqliteTable("radar_articles", {
  id: text("id").primaryKey(),
  fingerprint: text("fingerprint").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  articleUrl: text("article_url").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).notNull(),
  importance: text("importance").notNull().default("normal"),
  status: text("status").notNull().default("published"),
});

export type RadarArticle = typeof radarArticles.$inferSelect;
export type NewRadarArticle = typeof radarArticles.$inferInsert;

export const radarSourceStatus = sqliteTable("radar_source_status", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("pending"),
  lastAttemptAt: integer("last_attempt_at", { mode: "timestamp" }),
  lastSuccessAt: integer("last_success_at", { mode: "timestamp" }),
  itemsFound: integer("items_found").notNull().default(0),
  itemsAdded: integer("items_added").notNull().default(0),
  error: text("error"),
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type RadarSourceStatusRow = typeof radarSourceStatus.$inferSelect;
export type NewRadarSourceStatusRow = typeof radarSourceStatus.$inferInsert;

export const legalEntities = sqliteTable("legal_entities", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  npwp: text("npwp").notNull(),
  nib: text("nib"),
  sector: text("sector").notNull(),
  subSector: text("sub_sector").notNull().default(""),
  region: text("region").notNull(),
  establishmentDate: text("establishment_date").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  userUnique: uniqueIndex("legal_entities_user_unique").on(table.userId),
}));

export type LegalEntityRow = typeof legalEntities.$inferSelect;
export type NewLegalEntityRow = typeof legalEntities.$inferInsert;

export const legalLicenses = sqliteTable("legal_licenses", {
  id: text("id").primaryKey(),
  entityId: text("entity_id").notNull().references(() => legalEntities.id, { onDelete: "cascade" }),
  licenseRequirementId: text("license_requirement_id").notNull(),
  status: text("status").notNull().default("not_applied"),
  applicationDate: text("application_date"),
  approvalDate: text("approval_date"),
  expiryDate: text("expiry_date"),
  licenseNumber: text("license_number"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  entityRequirementUnique: uniqueIndex("legal_licenses_entity_requirement_unique")
    .on(table.entityId, table.licenseRequirementId),
}));

export type LegalLicenseRow = typeof legalLicenses.$inferSelect;
export type NewLegalLicenseRow = typeof legalLicenses.$inferInsert;

export const evidenceDocuments = sqliteTable("evidence_documents", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  checksum: text("checksum").notNull(),
  data: blob("data", { mode: "buffer" }),
  extractedText: text("extracted_text"),
  status: text("status").notNull().default("uploaded"),
  processingError: text("processing_error"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type EvidenceDocumentRow = typeof evidenceDocuments.$inferSelect;
export type NewEvidenceDocumentRow = typeof evidenceDocuments.$inferInsert;

export const evidenceMappings = sqliteTable("evidence_mappings", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentId: text("document_id").notNull().references(() => evidenceDocuments.id, { onDelete: "cascade" }),
  entityId: text("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  requirementId: text("requirement_id").notNull(),
  requirementType: text("requirement_type").notNull(),
  mappingConfidence: integer("mapping_confidence").notNull().default(0),
  extractedEvidence: text("extracted_evidence").notNull().default("[]"),
  validationStatus: text("validation_status").notNull().default("pending"),
  validationNotes: text("validation_notes").notNull().default(""),
  mappedBy: text("mapped_by").notNull().default("system"),
  mappedAt: integer("mapped_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  lastReviewedBy: text("last_reviewed_by"),
  lastReviewedAt: integer("last_reviewed_at", { mode: "timestamp" }),
  auditTrail: text("audit_trail").notNull().default("[]"),
}, (table) => ({
  documentRequirementEntityUnique: uniqueIndex("evidence_mappings_document_requirement_entity_unique")
    .on(table.documentId, table.requirementId, table.entityId, table.entityType),
}));

export type EvidenceMappingRow = typeof evidenceMappings.$inferSelect;
export type NewEvidenceMappingRow = typeof evidenceMappings.$inferInsert;

export const examSets = sqliteTable("exam_sets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  skkniCode: text("skkni_code"),
  duration: integer("duration").notNull(),
  passingScore: integer("passing_score").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export type ExamSetRow = typeof examSets.$inferSelect;
export type NewExamSetRow = typeof examSets.$inferInsert;

export const examQuestions = sqliteTable("exam_questions", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull().references(() => examSets.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: text("options").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  reference: text("reference"),
  orderIndex: integer("order_index").notNull().default(0),
});

export type ExamQuestionRow = typeof examQuestions.$inferSelect;
export type NewExamQuestionRow = typeof examQuestions.$inferInsert;

export const examAttempts = sqliteTable("exam_attempts", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: text("exam_id").notNull().references(() => examSets.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("in_progress"),
  answers: text("answers").notNull().default("[]"),
  score: integer("score"),
  correctCount: integer("correct_count"),
  totalQuestions: integer("total_questions").notNull(),
  passed: integer("passed", { mode: "boolean" }),
  startedAt: integer("started_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }),
  timeSpentSeconds: integer("time_spent_seconds"),
});

export type ExamAttemptRow = typeof examAttempts.$inferSelect;
export type NewExamAttemptRow = typeof examAttempts.$inferInsert;

export type PaymentEvent = typeof paymentEvents.$inferSelect;

export type NewPaymentSubscription = typeof paymentSubscriptions.$inferInsert;

export const paymentCheckoutIntents = sqliteTable("payment_checkout_intents", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  planId: text("plan_id").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  consumedAt: integer("consumed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const paymentEvents = sqliteTable("payment_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  type: text("type").notNull(),
  subscriptionId: text("subscription_id"),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  payload: text("payload").notNull(),
  eventCreatedAt: integer("event_created_at", { mode: "timestamp" }).notNull(),
  receivedAt: integer("received_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  processedAt: integer("processed_at", { mode: "timestamp" }),
});

export type PaymentSubscription = typeof paymentSubscriptions.$inferSelect;

export type NewPaymentCheckoutIntent = typeof paymentCheckoutIntents.$inferInsert;

export type NewPaymentEvent = typeof paymentEvents.$inferInsert;

export type PaymentCheckoutIntent = typeof paymentCheckoutIntents.$inferSelect;
