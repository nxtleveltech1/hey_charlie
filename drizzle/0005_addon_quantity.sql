ALTER TABLE "addons" ADD COLUMN "allow_quantity" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "addons" ADD COLUMN "max_quantity" integer DEFAULT 4 NOT NULL;--> statement-breakpoint
UPDATE "addons" SET "allow_quantity" = true WHERE "selection_group" = 'jetski';
