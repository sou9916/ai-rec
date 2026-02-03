/**
 * One-time setup for Neon (Option A: one database, separate schemas).
 * Run once with your Neon DATABASE_URL to create schemas: auth, webhooks, recommender.
 *
 * Usage (run from backend/auth or backend/webhooks_services so pg is available):
 *   Windows: set DATABASE_URL=postgresql://...&& node ../../scripts/init-neon-schemas.mjs
 *   Mac/Linux: DATABASE_URL=postgresql://... node ../../scripts/init-neon-schemas.mjs
 */
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ Set DATABASE_URL (your Neon connection string) and run again.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query("CREATE SCHEMA IF NOT EXISTS auth;");
  await client.query("CREATE SCHEMA IF NOT EXISTS webhooks;");
  await client.query("CREATE SCHEMA IF NOT EXISTS recommender;");
  console.log("✅ Schemas created: auth, webhooks, recommender");
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
