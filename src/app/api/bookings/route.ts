import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { bookings, users, packages } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { generateBookingNumber } from "@/lib/booking-utils";

const createBookingSchema = z.object({
  packageId: z.string().uuid(),
  date: z.string().datetime(),
  timeSlot: z.string(),
  guestCount: z.number().min(1).max(20),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  specialRequests: z.string().optional(),
  dietaryRequirements: z.string().optional(),
});

// GET - List bookings for current user (or all if admin)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = user.role === "admin";
    const showAll = searchParams.get("all") === "true" && isAdmin;

    // Get bookings
    const userBookings = await db.query.bookings.findMany({
      where: showAll ? undefined : eq(bookings.userId, user.id),
      with: {
        package: true,
        user: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    return NextResponse.json({ bookings: userBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Find user in database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get package details
    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, validatedData.packageId),
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: "This package is not available" },
        { status: 400 }
      );
    }

    // Check guest count limits
    if (validatedData.guestCount < pkg.minGuests || validatedData.guestCount > pkg.maxGuests) {
      return NextResponse.json(
        { error: `Guest count must be between ${pkg.minGuests} and ${pkg.maxGuests}` },
        { status: 400 }
      );
    }

    // Calculate total price
    const pricePerPerson = parseFloat(pkg.pricePerPerson);
    const totalPrice = pricePerPerson * validatedData.guestCount;

    // Create booking
    const [newBooking] = await db.insert(bookings).values({
      bookingNumber: generateBookingNumber(),
      userId: user.id,
      packageId: validatedData.packageId,
      date: new Date(validatedData.date),
      timeSlot: validatedData.timeSlot,
      guestCount: validatedData.guestCount,
      pricePerPerson: pricePerPerson.toString(),
      totalPrice: totalPrice.toString(),
      contactName: validatedData.contactName,
      contactEmail: validatedData.contactEmail,
      contactPhone: validatedData.contactPhone,
      specialRequests: validatedData.specialRequests || null,
      dietaryRequirements: validatedData.dietaryRequirements || null,
      status: "pending",
    }).returning();

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

