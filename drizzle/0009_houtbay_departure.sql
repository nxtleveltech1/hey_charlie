ALTER TABLE bookings ALTER COLUMN departure_location SET DEFAULT 'hout-bay';
--> statement-breakpoint
ALTER TABLE site_settings ALTER COLUMN location SET DEFAULT 'Houtbay Harbor, Cape Town';
--> statement-breakpoint
UPDATE bookings SET departure_location = 'hout-bay' WHERE departure_location = 'va-waterfront';
--> statement-breakpoint
