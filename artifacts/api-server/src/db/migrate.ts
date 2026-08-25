import { db } from "./index";
import { users, conversations, messages, radarArticles } from "./schema";
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

    db.run(sql`CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      attachment_name TEXT,
      attachment_type TEXT,
      created_at INTEGER NOT NULL
    )`);

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

    console.log("[DB] Database initialized");
  } catch (err) {
    console.error("[DB] Error initializing database:", err);
    throw err;
  }
}
