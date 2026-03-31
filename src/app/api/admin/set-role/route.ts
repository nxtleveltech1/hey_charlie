import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAILS } from "@/lib/admin-emails";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, role } = body;

    // Security check: only allow setting admin for pre-approved emails
    if (role === "admin" && !ADMIN_EMAILS.includes(email?.toLowerCase())) {
      return NextResponse.json({ error: "Email not authorized for admin role" }, { status: 403 });
    }

    // Update the user's role
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
      user: { 
        email: result[0].email, 
        role: result[0].role 
      } 
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint to check current role
export async function GET(req: NextRequest) {
  try {
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

    return NextResponse.json({ 
      email: user.email, 
      role: user.role,
      clerkId: user.clerkId 
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

