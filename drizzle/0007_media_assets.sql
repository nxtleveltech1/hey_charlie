CREATE TABLE IF NOT EXISTS "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"data" text NOT NULL,
	"uploaded_by" uuid REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL
);
