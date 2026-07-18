import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, bookingAddons } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { requireAdminForApi } from "@/lib/api-auth";

// DELETE - Permanently remove all cancelled bookings (admin only)
export async function DELETE() {
  try {
    const { response } = await requireAdminForApi();
    if (response) return response;

    const cancelled = await db.query.bookings.findMany({
      where: eq(bookings.status, "cancelled"),
      columns: { id: true },
    });

    if (cancelled.length === 0) {
      return NextResponse.json({ deleted: 0 });
    }

    const ids = cancelled.map((b) => b.id);
    await db.delete(bookingAddons).where(inArray(bookingAddons.bookingId, ids));
    await db.delete(bookings).where(inArray(bookings.id, ids));

    return NextResponse.json({ deleted: ids.length });
  } catch (error) {
    console.error("Failed to delete cancelled bookings:", error);
    return NextResponse.json(
      { error: "Failed to delete cancelled bookings" },
      { status: 500 }
    );
  }
}
