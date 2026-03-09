import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "konstruksi.db");

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

// Log database creation
console.log("[DB] Database path:", dbPath);
console.log("[DB] Database exists:", fs.existsSync(dbPath));

export const db = drizzle(sqlite, { schema });

// Initialize tables with better error handling
try {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  console.log("[DB] Users table ready");
} catch (error) {
  console.error("[DB] Error creating users table:", error);
}

try {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Percakapan Baru',
      agent_id TEXT NOT NULL DEFAULT 'general',
      label TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  console.log("[DB] Conversations table ready");
} catch (error) {
  console.error("[DB] Error creating conversations table:", error);
}

try {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      attachment_name TEXT,
      attachment_type TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  console.log("[DB] Messages table ready");
} catch (error) {
  console.error("[DB] Error creating messages table:", error);
}

console.log("[DB] Database initialization complete");
