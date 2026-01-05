import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice, formatDate, TIME_SLOTS, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/booking-utils";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    redirect("/sign-in");
  }

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
    with: {
      package: true,
    },
  });

  if (!booking) {
    redirect("/dashboard");
  }

  // Check if user owns this booking or is admin
  if (booking.userId !== user.id && user.role !== "admin") {
    redirect("/dashboard");
  }

  const timeSlot = TIME_SLOTS.find((s) => s.id === booking.timeSlot);
  const statusColor = BOOKING_STATUS_COLORS[booking.status];
  const statusLabel = BOOKING_STATUS_LABELS[booking.status];

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Booking Received!
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Your booking request has been submitted successfully.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="p-6 lg:p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-[var(--theme-text-muted)]">Booking Number</p>
              <p className="text-xl font-mono font-bold">{booking.bookingNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--theme-surface)]">
              <h3 className="font-semibold mb-1">{booking.package.name}</h3>
              <p className="text-sm text-[var(--theme-text-muted)]">{booking.package.tagline}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Date</p>
                <p className="font-medium">{formatDate(booking.date)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Time</p>
                <p className="font-medium">
                  {timeSlot?.name} ({timeSlot?.startTime} - {timeSlot?.endTime})
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Guests</p>
                <p className="font-medium">{booking.guestCount} people</p>
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Duration</p>
                <p className="font-medium">{booking.package.duration}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--theme-border)]">
              <div className="flex justify-between items-center">
                <span className="text-[var(--theme-text-muted)]">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] mb-6">
          <h3 className="font-semibold mb-4">Contact Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-muted)]">Name</span>
              <span>{booking.contactName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-muted)]">Email</span>
              <span>{booking.contactEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-muted)]">Phone</span>
              <span>{booking.contactPhone}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 mb-8">
          <h3 className="font-semibold mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">1.</span>
              Our team will review your booking and confirm availability
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">2.</span>
              You&apos;ll receive a confirmation email within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">3.</span>
              Payment details will be shared upon confirmation
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 text-center rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

