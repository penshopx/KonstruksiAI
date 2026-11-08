import { db } from "./index";
import {
  users,
  conversations,
  messages,
  radarArticles,
  projectWorkspaceMembers,
  projectWorkspaceInvitations,
  aiExecutionHistory,
  solverAnalysisResults,
  tenderAnalysisResults,
  examSets,
  examQuestions,
} from "./schema";
import { sql } from "drizzle-orm";
import { SKK_EXAM_BANK } from "../data/skk-exam-bank";

export function initializeDatabase() {
  try {
    db.run(sql`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
      created_at INTEGER NOT NULL
    )`);
    const userColumns = new Set(
      (db.all(sql`PRAGMA table_info(users)`) as Array<{ name: string }>)
        .map(({ name }) => name),
    );
    if (!userColumns.has("plan")) {
      db.run(sql.raw("ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro'))"));
    }

    db.run(sql`CREATE TABLE IF NOT EXISTS payment_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_subscription_id TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'pro',
      status TEXT NOT NULL,
      last_event_at INTEGER NOT NULL,
      current_period_end INTEGER,
      cancelled_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS payment_subscriptions_provider_subscription_unique
      ON payment_subscriptions(provider, provider_subscription_id)`);
    const paymentSubscriptionColumns = new Set(
      (db.all(sql`PRAGMA table_info(payment_subscriptions)`) as Array<{ name: string }>)
        .map(({ name }) => name),
    );
    if (!paymentSubscriptionColumns.has("last_event_at")) {
      db.run(sql.raw("ALTER TABLE payment_subscriptions ADD COLUMN last_event_at INTEGER NOT NULL DEFAULT 0"));
    }
    db.run(sql`CREATE TABLE IF NOT EXISTS payment_checkout_intents (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      consumed_at INTEGER,
      created_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE TABLE IF NOT EXISTS payment_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      type TEXT NOT NULL,
      subscription_id TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      payload TEXT NOT NULL,
      event_created_at INTEGER NOT NULL,
      received_at INTEGER NOT NULL,
      processed_at INTEGER
    )`);
    const paymentEventColumns = new Set(
      (db.all(sql`PRAGMA table_info(payment_events)`) as Array<{ name: string }>)
        .map(({ name }) => name),
    );
    if (!paymentEventColumns.has("event_created_at")) {
      db.run(sql.raw("ALTER TABLE payment_events ADD COLUMN event_created_at INTEGER NOT NULL DEFAULT 0"));
    }

    db.run(sql`CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Percakapan Baru',
      agent_id TEXT NOT NULL DEFAULT 'general',
      label TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS learning_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      path_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS learning_progress_user_lesson_unique
      ON learning_progress(user_id, path_id, module_id, lesson_id)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS project_workspaces (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      stage_id TEXT NOT NULL DEFAULT 'tender',
      notes TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      archived_at INTEGER
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS project_workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES project_workspaces(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'viewer',
      created_at INTEGER NOT NULL,
      revoked_at INTEGER
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS project_workspace_members_workspace_user_unique
      ON project_workspace_members(workspace_id, user_id)`);
    db.run(sql`CREATE TABLE IF NOT EXISTS project_workspace_invitations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES project_workspaces(id) ON DELETE CASCADE,
      invited_email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'viewer',
      token_hash TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      accepted_at INTEGER,
      revoked_at INTEGER,
      created_at INTEGER NOT NULL
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS ai_execution_history (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id TEXT REFERENCES project_workspaces(id) ON DELETE SET NULL,
      module TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      input_summary TEXT NOT NULL,
      result_ref TEXT,
      retry_of_id TEXT,
      error_message TEXT,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE INDEX IF NOT EXISTS ai_execution_history_user_created_idx
      ON ai_execution_history(user_id, created_at)`);
    db.run(sql`CREATE INDEX IF NOT EXISTS ai_execution_history_workspace_created_idx
      ON ai_execution_history(workspace_id, created_at)`);
    db.run(sql`CREATE TABLE IF NOT EXISTS tender_analysis_requests (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_scope TEXT NOT NULL,
      input_hash TEXT NOT NULL,
      execution_id TEXT NOT NULL UNIQUE REFERENCES ai_execution_history(id) ON DELETE CASCADE
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS solver_analysis_results (
      id TEXT PRIMARY KEY,
      execution_id TEXT NOT NULL UNIQUE REFERENCES ai_execution_history(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id TEXT REFERENCES project_workspaces(id) ON DELETE SET NULL,
      domain TEXT NOT NULL,
      problem TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      output_format TEXT NOT NULL,
      approach TEXT NOT NULL,
      analysis TEXT NOT NULL,
      solution TEXT NOT NULL,
      regulations TEXT NOT NULL DEFAULT '[]',
      next_steps TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE INDEX IF NOT EXISTS solver_analysis_results_user_created_idx
      ON solver_analysis_results(user_id, created_at)`);
    db.run(sql`CREATE INDEX IF NOT EXISTS solver_analysis_results_workspace_created_idx
      ON solver_analysis_results(workspace_id, created_at)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS tender_analysis_results (
      id TEXT PRIMARY KEY,
      execution_id TEXT NOT NULL UNIQUE REFERENCES ai_execution_history(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id TEXT REFERENCES project_workspaces(id) ON DELETE SET NULL,
      project_name TEXT NOT NULL,
      tender_type TEXT NOT NULL,
      project_details TEXT NOT NULL DEFAULT '',
      documents TEXT NOT NULL DEFAULT '[]',
      checklist_state TEXT NOT NULL DEFAULT '{}',
      completeness_checks TEXT NOT NULL DEFAULT '[]',
      overall_completeness INTEGER NOT NULL,
      risks TEXT NOT NULL DEFAULT '[]',
      recommendations TEXT NOT NULL DEFAULT '[]',
      compliance_score INTEGER NOT NULL,
      summary TEXT NOT NULL DEFAULT '{}',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE INDEX IF NOT EXISTS tender_analysis_results_user_created_idx
      ON tender_analysis_results(user_id, created_at)`);
    db.run(sql`CREATE INDEX IF NOT EXISTS tender_analysis_results_workspace_created_idx
      ON tender_analysis_results(workspace_id, created_at)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      agent_id TEXT,
      domain_fit_level TEXT,
      domain_fit_reason TEXT,
      recommended_agent_id TEXT,
      attachment_name TEXT,
      attachment_type TEXT,
      created_at INTEGER NOT NULL
    )`);
    const messageColumns = new Set(
      (db.all(sql`PRAGMA table_info(messages)`) as Array<{ name: string }>)
        .map(({ name }) => name),
    );
    for (const [name, definition] of [
      ["agent_id", "agent_id TEXT"],
      ["domain_fit_level", "domain_fit_level TEXT"],
      ["domain_fit_reason", "domain_fit_reason TEXT"],
      ["recommended_agent_id", "recommended_agent_id TEXT"],
    ]) {
      if (!messageColumns.has(name)) {
        db.run(sql.raw(`ALTER TABLE messages ADD COLUMN ${definition}`));
      }
    }
    const conversationColumns = new Set(
      (db.all(sql`PRAGMA table_info(conversations)`) as Array<{ name: string }>)
        .map(({ name }) => name),
    );
    if (!conversationColumns.has("workspace_id")) {
      db.run(sql.raw("ALTER TABLE conversations ADD COLUMN workspace_id TEXT REFERENCES project_workspaces(id) ON DELETE SET NULL"));
    }

    db.run(sql`CREATE TABLE IF NOT EXISTS radar_articles (
      id TEXT PRIMARY KEY,
      fingerprint TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      article_url TEXT NOT NULL,
      published_at INTEGER,
      fetched_at INTEGER NOT NULL,
      importance TEXT NOT NULL DEFAULT 'normal',
      status TEXT NOT NULL DEFAULT 'published'
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS radar_articles_fingerprint_unique ON radar_articles(fingerprint)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS radar_source_status (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      last_attempt_at INTEGER,
      last_success_at INTEGER,
      items_found INTEGER NOT NULL DEFAULT 0,
      items_added INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      consecutive_failures INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS legal_entities (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      npwp TEXT NOT NULL,
      nib TEXT,
      sector TEXT NOT NULL,
      sub_sector TEXT NOT NULL DEFAULT '',
      region TEXT NOT NULL,
      establishment_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS legal_entities_user_unique ON legal_entities(user_id)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS legal_licenses (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
      license_requirement_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'not_applied',
      application_date TEXT,
      approval_date TEXT,
      expiry_date TEXT,
      license_number TEXT,
      notes TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS legal_licenses_entity_requirement_unique
      ON legal_licenses(entity_id, license_requirement_id)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS evidence_documents (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      checksum TEXT NOT NULL,
      data BLOB,
      extracted_text TEXT,
      status TEXT NOT NULL DEFAULT 'uploaded',
      processing_error TEXT,
      uploaded_at INTEGER NOT NULL
    )`);
    if (
      !(db.all(sql`PRAGMA table_info(evidence_documents)`) as Array<{ name: string }>)
        .some((col) => col.name === "data")
    ) {
      db.run(sql.raw("ALTER TABLE evidence_documents ADD COLUMN data BLOB"));
    }

    db.run(sql`CREATE TABLE IF NOT EXISTS evidence_mappings (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      document_id TEXT NOT NULL REFERENCES evidence_documents(id) ON DELETE CASCADE,
      entity_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      requirement_id TEXT NOT NULL,
      requirement_type TEXT NOT NULL,
      mapping_confidence INTEGER NOT NULL DEFAULT 0,
      extracted_evidence TEXT NOT NULL DEFAULT '[]',
      validation_status TEXT NOT NULL DEFAULT 'pending',
      validation_notes TEXT NOT NULL DEFAULT '',
      mapped_by TEXT NOT NULL DEFAULT 'system',
      mapped_at INTEGER NOT NULL,
      last_reviewed_by TEXT,
      last_reviewed_at INTEGER,
      audit_trail TEXT NOT NULL DEFAULT '[]'
    )`);
    db.run(sql`DROP INDEX IF EXISTS evidence_mappings_document_requirement_unique`);
    db.run(sql`DROP INDEX IF EXISTS evidence_mappings_document_requirement_entity_unique`);
    db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS evidence_mappings_document_requirement_entity_type_unique
      ON evidence_mappings(document_id, requirement_id, entity_id, entity_type)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS exam_sets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      skkni_code TEXT,
      duration INTEGER NOT NULL,
      passing_score INTEGER NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0
    )`);

    db.run(sql`CREATE TABLE IF NOT EXISTS exam_questions (
      id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      reference TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    )`);
    db.run(sql`CREATE INDEX IF NOT EXISTS exam_questions_exam_id_idx ON exam_questions(exam_id)`);

    db.run(sql`CREATE TABLE IF NOT EXISTS exam_attempts (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exam_id TEXT NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'in_progress',
      answers TEXT NOT NULL DEFAULT '[]',
      score INTEGER,
      correct_count INTEGER,
      total_questions INTEGER NOT NULL,
      passed INTEGER,
      started_at INTEGER NOT NULL,
      submitted_at INTEGER,
      time_spent_seconds INTEGER
    )`);
    db.run(sql`CREATE INDEX IF NOT EXISTS exam_attempts_user_exam_idx ON exam_attempts(user_id, exam_id)`);

    // Seed the SKK exam bank. Each row is inserted with onConflictDoNothing
    // keyed on its own primary key, so re-running this on every boot is safe
    // (existing rows are left untouched) while still picking up any new exam
    // sets/questions added to SKK_EXAM_BANK in future deploys.
    for (const [setIndex, examSet] of SKK_EXAM_BANK.entries()) {
      db.insert(examSets)
        .values({
          id: examSet.id,
          title: examSet.title,
          description: examSet.description,
          category: examSet.category,
          level: examSet.level,
          skkniCode: examSet.skkniCode ?? null,
          duration: examSet.duration,
          passingScore: examSet.passingScore,
          icon: examSet.icon,
          color: examSet.color,
          orderIndex: setIndex,
        })
        .onConflictDoNothing({ target: examSets.id })
        .run();

      for (const [questionIndex, question] of examSet.questions.entries()) {
        db.insert(examQuestions)
          .values({
            id: question.id,
            examId: examSet.id,
            question: question.question,
            options: JSON.stringify(question.options),
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            topic: question.topic,
            difficulty: question.difficulty,
            reference: question.reference ?? null,
            orderIndex: questionIndex,
          })
          .onConflictDoNothing({ target: examQuestions.id })
          .run();
      }
    }

    console.log("[DB] Database initialized");
  } catch (err) {
    console.error("[DB] Error initializing database:", err);
    throw err;
  }
}
