import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";

// Admin emails list - keep in sync with webhook
const ADMIN_EMAILS = ["admin@heycharliec.com"]; // Update with actual admin emails

/**
 * Ensures a Clerk user exists in the local database.
 * This is a fallback mechanism for when the Clerk webhook fails or hasn't fired yet.
 * 
 * @param clerkUserId - The Clerk user ID (from auth())
 * @returns The user record from the database, or null if sync fails
 */
export async function ensureUserInDatabase(clerkUserId: string): Promise<User | null> {
  // First, check if user already exists in database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });

  if (existingUser) {
    return existingUser;
  }

  // User not in database - fetch from Clerk and create
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    if (!clerkUser) {
      console.error(`[user-sync] Clerk user not found: ${clerkUserId}`);
      return null;
    }

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    const email = primaryEmail?.emailAddress || "";

    // Get primary phone
    const primaryPhone = clerkUser.phoneNumbers?.find(
      (p) => p.id === clerkUser.primaryPhoneNumberId
    );

    // Determine role based on admin emails list
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";

    // Insert user into database
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: clerkUserId,
        email,
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
        phone: primaryPhone?.phoneNumber || null,
        role,
      })
      .returning();

    console.log(`[user-sync] Created user: ${clerkUserId} (role: ${role})`);
    return newUser;
  } catch (error) {
    // Handle race condition where user was created between our check and insert
    if (error instanceof Error && error.message.includes("unique constraint")) {
      // Try to fetch the user again
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUserId),
      });
      return user || null;
    }

    console.error(`[user-sync] Failed to sync user ${clerkUserId}:`, error);
    return null;
  }
}

