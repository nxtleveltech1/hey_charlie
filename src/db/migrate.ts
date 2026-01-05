import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("🔧 Running migrations...");
  
  try {
    // Create enums
    console.log("  Creating enums...");
    await sql`
      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM('pending', 'confirmed', 'cancelled', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `;

    // Create users table
    console.log("  Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id text NOT NULL UNIQUE,
        email text NOT NULL,
        first_name text,
        last_name text,
        phone text,
        image_url text,
        role user_role DEFAULT 'user' NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;

    // Create packages table
    console.log("  Creating packages table...");
    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug text NOT NULL UNIQUE,
        name text NOT NULL,
        tagline text,
        description text NOT NULL,
        duration text NOT NULL,
        price_per_person numeric(10, 2) NOT NULL,
        min_guests integer DEFAULT 1 NOT NULL,
        max_guests integer DEFAULT 12 NOT NULL,
        category text NOT NULL,
        highlights text[],
        image_url text,
        is_active boolean DEFAULT true NOT NULL,
        is_featured boolean DEFAULT false NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;

    // Create bookings table
    console.log("  Creating bookings table...");
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_number text NOT NULL UNIQUE,
        user_id uuid NOT NULL REFERENCES users(id),
        package_id uuid NOT NULL REFERENCES packages(id),
        date timestamp NOT NULL,
        time_slot text NOT NULL,
        guest_count integer NOT NULL,
        price_per_person numeric(10, 2) NOT NULL,
        total_price numeric(10, 2) NOT NULL,
        contact_name text NOT NULL,
        contact_email text NOT NULL,
        contact_phone text NOT NULL,
        special_requests text,
        dietary_requirements text,
        status booking_status DEFAULT 'pending' NOT NULL,
        admin_notes text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL,
        confirmed_at timestamp,
        cancelled_at timestamp
      )
    `;

    // Create time_slots table
    console.log("  Creating time_slots table...");
    await sql`
      CREATE TABLE IF NOT EXISTS time_slots (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        start_time text NOT NULL,
        end_time text NOT NULL,
        is_active boolean DEFAULT true NOT NULL
      )
    `;

    // Create blocked_dates table
    console.log("  Creating blocked_dates table...");
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_dates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        date timestamp NOT NULL,
        reason text,
        package_id uuid REFERENCES packages(id),
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;

    console.log("✅ Migrations complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
