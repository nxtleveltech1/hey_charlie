import { requireUser } from "@/lib/auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import {
  formatPrice,
  formatDate,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking-utils";
import { formatTimeSlotSummary, resolveBookingTimeSlots } from "@/lib/time-slot-pricing";
import { formatDepartureLocation } from "@/lib/departure-locations";
import { CancelBookingButton } from "./cancel-booking-button";
import { CompletePaymentButton } from "./complete-payment-button";
import { isOnlinePaymentsEnabled } from "@/lib/payments";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DashboardPage() {
  const user = await requireUser();
  const onlinePayments = isOnlinePaymentsEnabled();

  const userBookings = await db.query.bookings.findMany({
    where: eq(bookings.userId, user.id),
    with: { package: true, bookingAddons: true },
    orderBy: [desc(bookings.createdAt)],
  });

  const upcomingBookings = userBookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.status !== "completed" &&
      new Date(b.date) >= new Date(),
  );
  const pastBookings = userBookings.filter(
    (b) => b.status === "completed" || new Date(b.date) < new Date(),
  );

  return (
    <div className="wide-shell py-6 lg:py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Bookings
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Welcome back, {user.firstName || "Guest"}!
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/packages" size="block" className="sm:w-auto">
            Book New Experience
          </Button>
          {user.role === "admin" && (
            <Button href="/admin" variant="secondary" size="block" className="sm:w-auto">
              Admin Dashboard
            </Button>
          )}
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Upcoming Experiences</h2>
        {upcomingBookings.length === 0 ? (
          <EmptyState
            title="No upcoming bookings"
            description="Ready for your next adventure? Browse our experiences!"
            action={
              <Button href="/packages" variant="primary">
                Explore Packages
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const slotSummary = formatTimeSlotSummary(
                resolveBookingTimeSlots(booking),
              );
              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${BOOKING_STATUS_COLORS[booking.status]}`}
                        >
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </span>
                        <span className="font-mono text-sm text-[var(--theme-text-muted)]">
                          {booking.bookingNumber}
                        </span>
                      </div>
                      <h3 className="mb-1 text-lg font-semibold">
                        {booking.package.name}
                      </h3>
                      <p className="mb-3 text-sm text-[var(--theme-text-muted)]">
                        {booking.package.tagline}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>📅 {formatDate(booking.date)}</span>
                        <span>⏰ {slotSummary}</span>
                        <span>📍 {formatDepartureLocation(booking.departureLocation)}</span>
                        <span>👥 {booking.guestCount} guests</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 lg:items-end">
                      <span className="text-2xl font-bold text-amber">
                        {formatPrice(booking.totalPrice)}
                      </span>
                      <div className="grid gap-2 sm:grid-flow-col">
                        {onlinePayments &&
                          booking.paymentStatus === "unpaid" &&
                          booking.status !== "cancelled" && (
                            <CompletePaymentButton bookingId={booking.id} />
                          )}
                        {!onlinePayments &&
                          booking.paymentStatus === "unpaid" &&
                          booking.status !== "cancelled" && (
                            <Button
                              href={`/booking/confirmation/${booking.id}`}
                              variant="primary"
                              size="sm"
                            >
                              EFT Details
                            </Button>
                          )}
                        <Button
                          href={`/booking/confirmation/${booking.id}`}
                          variant="secondary"
                          size="sm"
                        >
                          View Details
                        </Button>
                        {booking.status === "pending" && (
                          <CancelBookingButton bookingId={booking.id} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {pastBookings.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Past Experiences</h2>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-4 opacity-75"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{booking.package.name}</h3>
                    <p className="text-sm text-[var(--theme-text-muted)]">
                      {formatDate(booking.date)} · {booking.guestCount} guests
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-medium ${BOOKING_STATUS_COLORS[booking.status]}`}
                  >
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
