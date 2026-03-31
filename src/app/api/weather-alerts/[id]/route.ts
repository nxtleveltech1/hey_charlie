import { db } from "@/db";
import { weatherAlerts, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single weather alert
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const alert = await db.query.weatherAlerts.findFirst({
      where: eq(weatherAlerts.id, id),
      with: { createdByUser: true },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error fetching weather alert:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update weather alert
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingAlert = await db.query.weatherAlerts.findFirst({
      where: eq(weatherAlerts.id, id),
    });

    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, message, severity, activeFrom, activeTo, isActive } = body;

    const [updatedAlert] = await db.update(weatherAlerts)
      .set({
        title,
        message,
        severity,
        activeFrom: new Date(activeFrom),
        activeTo: new Date(activeTo),
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(weatherAlerts.id, id))
      .returning();

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error("Error updating weather alert:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE weather alert
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingAlert = await db.query.weatherAlerts.findFirst({
      where: eq(weatherAlerts.id, id),
    });

    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await db.delete(weatherAlerts).where(eq(weatherAlerts.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting weather alert:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

