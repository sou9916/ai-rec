CREATE SCHEMA IF NOT EXISTS "webhooks";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks"."apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_name" text,
	"webhook_url" text,
	"api_key" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks"."usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_name" text NOT NULL UNIQUE,
	"usage_count" integer DEFAULT 0
);
