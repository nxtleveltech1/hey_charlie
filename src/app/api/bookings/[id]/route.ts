import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateBookingSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  adminNotes: z.string().optional(),
  date: z.string().datetime().optional(),
  timeSlot: z.string().optional(),
  guestCount: z.number().min(1).max(20).optional(),
});

// GET - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        package: true,
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user owns booking or is admin
    if (booking.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH - Update booking (admin only for most fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateBookingSchema.parse(body);

    const isAdmin = user.role === "admin";
    const isOwner = booking.userId === user.id;

    // Users can only cancel their own pending bookings
    if (!isAdmin && isOwner) {
      if (validatedData.status && validatedData.status !== "cancelled") {
        return NextResponse.json(
          { error: "You can only cancel your booking" },
          { status: 403 }
        );
      }
      if (booking.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending bookings can be cancelled" },
          { status: 400 }
        );
      }
    } else if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (validatedData.status) {
      updateData.status = validatedData.status;
      if (validatedData.status === "confirmed") {
        updateData.confirmedAt = new Date();
      } else if (validatedData.status === "cancelled") {
        updateData.cancelledAt = new Date();
      }
    }

    if (isAdmin) {
      if (validatedData.adminNotes !== undefined) {
        updateData.adminNotes = validatedData.adminNotes;
      }
      if (validatedData.date) {
        updateData.date = new Date(validatedData.date);
      }
      if (validatedData.timeSlot) {
        updateData.timeSlot = validatedData.timeSlot;
      }
      if (validatedData.guestCount) {
        updateData.guestCount = validatedData.guestCount;
      }
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(bookings).where(eq(bookings.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}

