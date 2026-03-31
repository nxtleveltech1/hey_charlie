-- Migration: Add crew_members, articles, weather_alerts, and user_alert_preferences tables

-- Create enums
DO $$ BEGIN
  CREATE TYPE "article_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "article_category" AS ENUM('fishing-reports', 'species-spotlight', 'charter-updates', 'gear-tackle', 'weather-updates', 'tips-techniques');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "alert_severity" AS ENUM('info', 'warning', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "alert_type" AS ENUM('weather', 'news', 'trip-reminder', 'fishing-conditions');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create crew_members table
CREATE TABLE IF NOT EXISTS "crew_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "role" text NOT NULL,
  "bio" text,
  "years_experience" integer,
  "certifications" text[],
  "email" text,
  "phone" text,
  "image_url" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "display_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create articles table
CREATE TABLE IF NOT EXISTS "articles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image" text,
  "category" "article_category" NOT NULL,
  "tags" text[],
  "author_id" uuid REFERENCES "users"("id"),
  "status" "article_status" DEFAULT 'draft' NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "view_count" integer DEFAULT 0 NOT NULL,
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create weather_alerts table
CREATE TABLE IF NOT EXISTS "weather_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "severity" "alert_severity" DEFAULT 'info' NOT NULL,
  "active_from" timestamp NOT NULL,
  "active_to" timestamp NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_by" uuid REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create user_alert_preferences table
CREATE TABLE IF NOT EXISTS "user_alert_preferences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id"),
  "email_alerts" boolean DEFAULT true NOT NULL,
  "sms_alerts" boolean DEFAULT false NOT NULL,
  "alert_types" "alert_type"[],
  "phone" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles"("slug");
CREATE INDEX IF NOT EXISTS "articles_status_idx" ON "articles"("status");
CREATE INDEX IF NOT EXISTS "articles_category_idx" ON "articles"("category");
CREATE INDEX IF NOT EXISTS "articles_published_at_idx" ON "articles"("published_at");
CREATE INDEX IF NOT EXISTS "weather_alerts_active_idx" ON "weather_alerts"("is_active", "active_from", "active_to");
CREATE INDEX IF NOT EXISTS "crew_members_active_idx" ON "crew_members"("is_active", "display_order");

