import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

const initDB = async () => {
  // ✅ Absolute path fix so it always points to the correct DB file
  const dbPath = path.join(__dirname, "webhooks.db");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Create the "apps" table if it doesn’t exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT,
      webhook_url TEXT,
      api_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create the "usage" table if it doesn’t exist
 await db.exec(`
  CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_name TEXT UNIQUE,
    usage_count INTEGER DEFAULT 0
  );
`);

  console.log("✅ SQLite ready: tables apps & usage");
  console.log("📁 Database file path:", dbPath);

  return db;
};

// Initialize and export the DB connection
export default await initDB();
