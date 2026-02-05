import { pgSchema, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const webhooksSchema = pgSchema("webhooks");

export const apps = webhooksSchema.table("apps", {
  id: serial("id").primaryKey(),
  app_name: text("app_name"),
  webhook_url: text("webhook_url"),
  api_key: text("api_key"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usage = webhooksSchema.table("usage", {
  id: serial("id").primaryKey(),
  app_name: text("app_name").notNull().unique(),
  usage_count: integer("usage_count").default(0),
});
