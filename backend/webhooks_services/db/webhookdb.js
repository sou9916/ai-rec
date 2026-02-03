import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".ENV") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/neondb";
const pool = new Pool({ connectionString });

const ready = (async () => {
  const client = await pool.connect();
  try {
    await client.query("CREATE SCHEMA IF NOT EXISTS webhooks;");
    await client.query(`
      CREATE TABLE IF NOT EXISTS webhooks.apps (
        id SERIAL PRIMARY KEY,
        app_name TEXT,
        webhook_url TEXT,
        api_key TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS webhooks.usage (
        id SERIAL PRIMARY KEY,
        app_name TEXT UNIQUE,
        usage_count INTEGER DEFAULT 0
      );
    `);
    console.log("✅ PostgreSQL ready: schema webhooks (tables apps & usage)");
  } finally {
    client.release();
  }
  return pool;
})();

export default {
  get ready() {
    return ready;
  },
  async all(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
  },
  async get(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows[0] ?? null;
  },
  async run(sql, params = []) {
    const result = await pool.query(sql, params);
    const lastID = result.rows[0]?.id ?? null;
    return { lastID };
  },
};
