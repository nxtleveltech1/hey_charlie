import { db } from "@/db";
import { userAlertPreferences, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ensureUserInDatabase } from "@/lib/user-sync";

// GET user's alert preferences
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    const user = await ensureUserInDatabase(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferences = await db.query.userAlertPreferences.findFirst({
      where: eq(userAlertPreferences.userId, user.id),
    });

    // Return default preferences if none exist
    if (!preferences) {
      return NextResponse.json({
        emailAlerts: true,
        smsAlerts: false,
        alertTypes: ["weather", "trip-reminder"],
        phone: null,
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching user alert preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update user's alert preferences
export async function PUT(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    const user = await ensureUserInDatabase(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { emailAlerts, smsAlerts, alertTypes, phone } = body;

    // Check if preferences exist
    const existingPreferences = await db.query.userAlertPreferences.findFirst({
      where: eq(userAlertPreferences.userId, user.id),
    });

    let updatedPreferences;

    if (existingPreferences) {
      // Update existing preferences
      [updatedPreferences] = await db.update(userAlertPreferences)
        .set({
          emailAlerts: emailAlerts !== undefined ? emailAlerts : existingPreferences.emailAlerts,
          smsAlerts: smsAlerts !== undefined ? smsAlerts : existingPreferences.smsAlerts,
          alertTypes: alertTypes !== undefined ? alertTypes : existingPreferences.alertTypes,
          phone: phone !== undefined ? phone : existingPreferences.phone,
          updatedAt: new Date(),
        })
        .where(eq(userAlertPreferences.userId, user.id))
        .returning();
    } else {
      // Create new preferences
      [updatedPreferences] = await db.insert(userAlertPreferences)
        .values({
          userId: user.id,
          emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
          smsAlerts: smsAlerts !== undefined ? smsAlerts : false,
          alertTypes: alertTypes || ["weather", "trip-reminder"],
          phone: phone || null,
        })
        .returning();
    }

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error("Error updating user alert preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

