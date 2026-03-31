/**
 * Script to set admin role for a user
 * Run with: npx tsx scripts/set-admin-role.ts
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

// Define the users table schema inline for the script
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  imageUrl: text("image_url"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not found in environment");
    process.exit(1);
  }

  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  const email = "gambew@gmail.com";

  console.log(`Looking for user with email: ${email}`);

  // First, find the user
  const existingUsers = await db.select().from(users).where(eq(users.email, email));
  
  if (existingUsers.length === 0) {
    console.error(`User with email ${email} not found`);
    process.exit(1);
  }

  const user = existingUsers[0];
  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);
  console.log(`Current role: ${user.role}`);

  if (user.role === "admin") {
    console.log("User is already an admin. No changes needed.");
    process.exit(0);
  }

  // Update to admin
  console.log("Updating role to admin...");
  
  const result = await db
    .update(users)
    .set({ role: "admin", updatedAt: new Date() })
    .where(eq(users.email, email))
    .returning();

  if (result.length > 0) {
    console.log(`✅ Success! User ${email} is now an admin.`);
    console.log(`New role: ${result[0].role}`);
  } else {
    console.error("Failed to update user role");
    process.exit(1);
  }
}

main().catch(console.error);

