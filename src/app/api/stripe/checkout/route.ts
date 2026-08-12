import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type Stripe from "stripe";
import { getSiteUrl, getStripe, toStripeAmount } from "@/lib/stripe";
import { formatTimeSlotSummary, resolveBookingTimeSlots } from "@/lib/time-slot-pricing";
import { formatDepartureLocation } from "@/lib/departure-locations";
import { isCapeCourage } from "@/lib/cape-courage";

const checkoutSchema = z.object({
  bookingId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { isOnlinePaymentsEnabled } = await import("@/lib/payments");

    if (!isOnlinePaymentsEnabled()) {
      return NextResponse.json(
        { error: "Online payments are not enabled. Please pay via EFT." },
        { status: 503 },
      );
    }

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

    const body = await request.json();
    const { bookingId } = checkoutSchema.parse(body);

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        package: true,
        bookingAddons: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This booking has already been paid" },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const slotIds = resolveBookingTimeSlots(booking);
    const slotSummary = formatTimeSlotSummary(slotIds);
    const departureLabel = formatDepartureLocation(booking.departureLocation);
    const lineItemDescription = isCapeCourage(booking.package.slug)
      ? `${booking.guestCount} VIP spot(s) · full event day · event date confirmed on the official call`
      : `${booking.guestCount} guest(s) · ${slotSummary} · ${departureLabel}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "zar",
          product_data: {
            name: booking.package.name,
            description: lineItemDescription,
          },
          unit_amount: toStripeAmount(parseFloat(booking.pricePerPerson)),
        },
        quantity: booking.guestCount,
      },
      ...booking.bookingAddons.map((addon) => ({
        price_data: {
          currency: "zar" as const,
          product_data: {
            name: addon.name,
          },
          unit_amount: toStripeAmount(parseFloat(addon.unitPrice)),
        },
        quantity: addon.quantity,
      })),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.contactEmail,
      line_items: lineItems,
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
      },
      success_url: `${siteUrl}/booking/confirmation/${booking.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking/${booking.package.slug}?payment=cancelled`,
    });

    await db
      .update(bookings)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}
