import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  bookings,
  users,
  packages,
  addons,
  bookingAddons,
  blockedDates,
} from "@/db/schema";
import { and, eq, desc, gte, lt, ne, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { generateBookingNumber } from "@/lib/booking-utils";
import { calculateBookingTotal } from "@/lib/addon-pricing";
import {
  calculateTimeSlotPricePerPerson,
  validateTimeSlotSelection,
} from "@/lib/time-slot-pricing";
import { departureLocationSchema } from "@/lib/departure-locations";
import { getSiteSettings } from "@/lib/settings";
import { sendBookingNotifications } from "@/lib/booking-notify";

const createBookingSchema = z.object({
  packageId: z.string().uuid(),
  date: z.string().datetime(),
  timeSlots: z.array(z.string()).min(1).max(3),
  guestCount: z.number().min(1).max(20),
  departureLocation: departureLocationSchema,
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  specialRequests: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  addons: z
    .array(
      z.object({
        addonId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20).default(1),
      }),
    )
    .default([]),
  /** @deprecated use addons */
  addonIds: z.array(z.string().uuid()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = user.role === "admin";
    const showAll = searchParams.get("all") === "true" && isAdmin;

    const userBookings = await db.query.bookings.findMany({
      where: showAll ? undefined : eq(bookings.userId, user.id),
      with: {
        package: true,
        user: true,
        bookingAddons: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    return NextResponse.json({ bookings: userBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, validatedData.packageId),
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: "This package is not available" },
        { status: 400 },
      );
    }

    if (
      validatedData.guestCount < pkg.minGuests ||
      validatedData.guestCount > pkg.maxGuests
    ) {
      return NextResponse.json(
        {
          error: `Guest count must be between ${pkg.minGuests} and ${pkg.maxGuests}`,
        },
        { status: 400 },
      );
    }

    const settings = await getSiteSettings();

    // Enforce the admin-configured advance-booking window (compared by day)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const bookingDay = new Date(validatedData.date);
    bookingDay.setHours(0, 0, 0, 0);
    const daysAhead = Math.round(
      (bookingDay.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
    );

    if (daysAhead < settings.minAdvanceBookingDays) {
      return NextResponse.json(
        {
          error: `Bookings must be made at least ${settings.minAdvanceBookingDays} day(s) in advance`,
        },
        { status: 400 },
      );
    }

    if (daysAhead > settings.maxAdvanceBookingDays) {
      return NextResponse.json(
        {
          error: `Bookings can be made at most ${settings.maxAdvanceBookingDays} day(s) in advance`,
        },
        { status: 400 },
      );
    }

    const slotValidation = validateTimeSlotSelection(validatedData.timeSlots);
    if (!slotValidation.valid) {
      return NextResponse.json({ error: slotValidation.error }, { status: 400 });
    }

    // Availability: one boat — reject dates the admin has blocked and time
    // slots already held by another active booking on the same day.
    const dayStart = new Date(validatedData.date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const blocked = await db.query.blockedDates.findFirst({
      where: and(
        gte(blockedDates.date, dayStart),
        lt(blockedDates.date, dayEnd),
        or(
          isNull(blockedDates.packageId),
          eq(blockedDates.packageId, validatedData.packageId),
        ),
      ),
    });

    if (blocked) {
      return NextResponse.json(
        { error: "This date is unavailable. Please choose another date." },
        { status: 409 },
      );
    }

    const sameDayBookings = await db.query.bookings.findMany({
      where: and(
        gte(bookings.date, dayStart),
        lt(bookings.date, dayEnd),
        ne(bookings.status, "cancelled"),
      ),
      columns: { timeSlots: true, timeSlot: true },
    });

    const requestedSlots = new Set(slotValidation.slots);
    const slotTaken = sameDayBookings.some((existing) => {
      const existingSlots =
        existing.timeSlots && existing.timeSlots.length > 0
          ? existing.timeSlots
          : (existing.timeSlot ?? "").split(",");
      return existingSlots.some((slot) => requestedSlots.has(slot.trim()));
    });

    if (slotTaken) {
      return NextResponse.json(
        {
          error:
            "One or more of the selected time slots is already booked for this date. Please choose a different time.",
        },
        { status: 409 },
      );
    }

    const basePricePerPerson = parseFloat(pkg.pricePerPerson);
    let slotPricing;
    try {
      slotPricing = calculateTimeSlotPricePerPerson(
        basePricePerPerson,
        slotValidation.slots,
      );
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error ? err.message : "Invalid time slot selection",
        },
        { status: 400 },
      );
    }

    const allAddons = await db.query.addons.findMany({
      where: eq(addons.isActive, true),
    });

    let pricing;
    try {
      const selectedAddons =
        validatedData.addons.length > 0
          ? validatedData.addons
          : (validatedData.addonIds ?? []).map((addonId) => ({
              addonId,
              quantity: 1,
            }));

      pricing = calculateBookingTotal(
        slotPricing.pricePerPerson,
        validatedData.guestCount,
        selectedAddons,
        allAddons,
      );
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error ? err.message : "Invalid add-on selection",
        },
        { status: 400 },
      );
    }

    const [newBooking] = await db
      .insert(bookings)
      .values({
        bookingNumber: generateBookingNumber(),
        userId: user.id,
        packageId: validatedData.packageId,
        date: new Date(validatedData.date),
        timeSlot: slotValidation.slots.join(","),
        timeSlots: slotValidation.slots,
        guestCount: validatedData.guestCount,
        departureLocation: validatedData.departureLocation,
        pricePerPerson: slotPricing.pricePerPerson.toString(),
        addonsTotal: pricing.addonsTotal.toString(),
        totalPrice: pricing.totalPrice.toString(),
        contactName: validatedData.contactName,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        specialRequests: validatedData.specialRequests || null,
        dietaryRequirements: validatedData.dietaryRequirements || null,
        status: settings.autoConfirmBookings ? "confirmed" : "pending",
        confirmedAt: settings.autoConfirmBookings ? new Date() : null,
        paymentStatus: "unpaid",
      })
      .returning();

    if (pricing.lines.length > 0) {
      await db.insert(bookingAddons).values(
        pricing.lines.map((line) => ({
          bookingId: newBooking.id,
          addonId: line.addonId,
          name: line.name,
          priceUnit: line.priceUnit,
          unitPrice: line.unitPrice.toString(),
          quantity: line.quantity,
          lineTotal: line.lineTotal.toString(),
        })),
      );
    }

    // Fire booking emails (owner alert + guest confirmation). Never fails the
    // booking — sendBookingNotifications swallows and logs its own errors.
    await sendBookingNotifications({
      bookingNumber: newBooking.bookingNumber,
      packageName: pkg.name,
      date: newBooking.date,
      timeSlots: slotValidation.slots,
      guestCount: newBooking.guestCount,
      totalPrice: newBooking.totalPrice,
      contactName: newBooking.contactName,
      contactEmail: newBooking.contactEmail,
      contactPhone: newBooking.contactPhone,
      specialRequests: newBooking.specialRequests,
    });

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
