import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureUserInDatabase } from "@/lib/user-sync";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ role: "guest" });
    }

    const user = await ensureUserInDatabase(userId);

    if (!user) {
      return NextResponse.json({ role: "user" });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: "user" });
  }
}

