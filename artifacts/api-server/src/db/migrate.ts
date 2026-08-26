import { db } from "./index";
import {
  users,
  conversations,
  messages,
  radarArticles,
  projectWorkspaceMembers,
  projectWorkspaceInvitations,
} from "./schema";
import { sql } from "drizzle-orm";

export function initializeDatabase() {
  try {
    db.run(sql`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at INTEGER NOT NULL
    )`);

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

    db.run(sql`CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      agent_id TEXT,
      domain_fit_level TEXT,
      domain_fit_reason TEXT,
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

    console.log("[DB] Database initialized");
  } catch (err) {
    console.error("[DB] Error initializing database:", err);
    throw err;
  }
}
