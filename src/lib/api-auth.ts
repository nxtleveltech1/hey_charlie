import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";

type AdminCheck =
  | { user: User; response: null }
  | { user: null; response: NextResponse };

/**
 * Admin gate for API route handlers. Unlike `requireAdmin` in lib/auth.ts
 * (which redirects — page-only), this returns a JSON error response the
 * handler can return directly.
 */
export async function requireAdminForApi(): Promise<AdminCheck> {
  const { userId } = await auth();
  if (!userId) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, response: null };
}
