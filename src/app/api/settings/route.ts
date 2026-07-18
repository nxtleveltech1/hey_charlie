import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, timeSlots } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getSiteSettings } from "@/lib/settings";
import { requireAdminForApi } from "@/lib/api-auth";

const updateSettingsSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    contactEmail: z.string().email("Enter a valid email"),
    contactPhone: z.string().min(7, "Enter a valid phone number"),
    location: z.string().min(1, "Location is required"),
    minAdvanceBookingDays: z.number().int().min(0).max(365),
    maxAdvanceBookingDays: z.number().int().min(1).max(730),
    autoConfirmBookings: z.boolean(),
    emailNotifications: z.boolean(),
    timeSlots: z
      .array(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
      .optional(),
  })
  .refine((s) => s.maxAdvanceBookingDays >= s.minAdvanceBookingDays, {
    message: "Maximum advance booking must be at least the minimum",
    path: ["maxAdvanceBookingDays"],
  });

// GET - Current site settings + time slots. Public-safe: everything here is
// already displayed on the marketing site.
export async function GET() {
  try {
    const settings = await getSiteSettings();
    const slots = await db.query.timeSlots.findMany({
      orderBy: [asc(timeSlots.startTime)],
    });
    return NextResponse.json({ settings, timeSlots: slots });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { response } = await requireAdminForApi();
    if (response) return response;

    const body = await request.json();
    const data = updateSettingsSchema.parse(body);

    // Row is guaranteed to exist after getSiteSettings()
    await getSiteSettings();
    const [updated] = await db
      .update(siteSettings)
      .set({
        businessName: data.businessName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        location: data.location,
        minAdvanceBookingDays: data.minAdvanceBookingDays,
        maxAdvanceBookingDays: data.maxAdvanceBookingDays,
        autoConfirmBookings: data.autoConfirmBookings,
        emailNotifications: data.emailNotifications,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1))
      .returning();

    if (data.timeSlots) {
      for (const slot of data.timeSlots) {
        await db
          .update(timeSlots)
          .set({ isActive: slot.isActive })
          .where(eq(timeSlots.id, slot.id));
      }
    }

    const slots = await db.query.timeSlots.findMany({
      orderBy: [asc(timeSlots.startTime)],
    });

    return NextResponse.json({ settings: updated, timeSlots: slots });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
