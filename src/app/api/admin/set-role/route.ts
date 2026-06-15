import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAILS } from "@/lib/admin-emails";

/**
 * Shared admin guard. Looks the Clerk user up in the DB (same pattern as the
 * sibling `/api/packages` and `/api/crew` handlers) and requires role "admin".
 * ALL role changes (including demotion) require an admin caller.
 */
async function requireAdmin(): Promise<"ok" | "unauthorized" | "forbidden"> {
  const { userId } = await auth();
  if (!userId) return "unauthorized";

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });
  if (!user || user.role !== "admin") return "forbidden";

  return "ok";
}

function adminGuardResponse(status: "unauthorized" | "forbidden") {
  if (status === "unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const status = await requireAdmin();
    if (status !== "ok") return adminGuardResponse(status);

    const body = await req.json();
    const { email, role } = body as { email?: string; role?: string };

    if (!email || !role) {
      return NextResponse.json(
        { error: "email and role are required" },
        { status: 400 },
      );
    }

    // Only the existing enum values are valid roles.
    if (role !== "user" && role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Only pre-approved emails may be promoted to admin.
    if (role === "admin" && !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: "Email not authorized for admin role" },
        { status: 403 },
      );
    }

    const result = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: { email: result[0].email, role: result[0].role },
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — current role lookup. Admin-only. Returns minimal info only; never
// exposes clerkId to any caller.
export async function GET(req: NextRequest) {
  try {
    const status = await requireAdmin();
    if (status !== "ok") return adminGuardResponse(status);

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ email: user.email, role: user.role });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
