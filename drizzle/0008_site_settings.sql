CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1,
	"business_name" text DEFAULT 'Hey Charlie Charters' NOT NULL,
	"contact_email" text DEFAULT 'ahoy@heycharliecharters.co.za' NOT NULL,
	"contact_phone" text DEFAULT '060 314 4873' NOT NULL,
	"location" text DEFAULT 'Hout Bay & V&A Waterfront, Cape Town' NOT NULL,
	"min_advance_booking_days" integer DEFAULT 1 NOT NULL,
	"max_advance_booking_days" integer DEFAULT 90 NOT NULL,
	"auto_confirm_bookings" boolean DEFAULT false NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
