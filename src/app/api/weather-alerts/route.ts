import { db } from "@/db";
import { weatherAlerts, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq, and, gte, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET weather alerts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";

  try {
    let whereClause;

    if (activeOnly) {
      const now = new Date();
      whereClause = and(
        eq(weatherAlerts.isActive, true),
        lte(weatherAlerts.activeFrom, now),
        gte(weatherAlerts.activeTo, now)
      );
    }

    const alerts = await db.query.weatherAlerts.findMany({
      where: whereClause,
      with: { createdByUser: true },
      orderBy: [desc(weatherAlerts.createdAt)],
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new weather alert
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, severity, activeFrom, activeTo, isActive } = body;

    // Validate required fields
    if (!title || !message || !activeFrom || !activeTo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create alert
    const [newAlert] = await db.insert(weatherAlerts).values({
      title,
      message,
      severity: severity || "info",
      activeFrom: new Date(activeFrom),
      activeTo: new Date(activeTo),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: user.id,
    }).returning();

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error("Error creating weather alert:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

