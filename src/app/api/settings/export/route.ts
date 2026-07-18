import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdminForApi } from "@/lib/api-auth";
import { getSiteSettings } from "@/lib/settings";

// GET - Export all bookings + customer data as a downloadable JSON file (admin only)
export async function GET() {
  try {
    const { response } = await requireAdminForApi();
    if (response) return response;

    const [settings, allBookings, allCustomers] = await Promise.all([
      getSiteSettings(),
      db.query.bookings.findMany({
        with: { package: true, bookingAddons: true },
        orderBy: [desc(bookings.createdAt)],
      }),
      db.query.users.findMany({ orderBy: [desc(users.createdAt)] }),
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      counts: { bookings: allBookings.length, customers: allCustomers.length },
      bookings: allBookings,
      customers: allCustomers.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };

    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="hey-charlie-export-${date}.json"`,
      },
    });
  } catch (error) {
    console.error("Failed to export data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
