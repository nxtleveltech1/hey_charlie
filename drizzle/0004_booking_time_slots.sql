ALTER TABLE "bookings" ADD COLUMN "time_slots" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
UPDATE "bookings" SET "time_slots" = ARRAY["time_slot"] WHERE cardinality("time_slots") = 0 OR "time_slots" = '{}';
