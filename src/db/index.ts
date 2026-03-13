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

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Log database initialization
console.log("[DB] Database path:", dbPath);
console.log("[DB] Database exists:", fs.existsSync(dbPath));

export const db = drizzle(sqlite, { schema });

// Database schema is initialized via migration script
// Run 'node migrate-db.js' to apply schema changes

console.log("[DB] Database initialization complete");
