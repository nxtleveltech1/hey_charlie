import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  formatPrice,
  formatDate,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "@/lib/booking-utils";
import {
  formatTimeSlotSummary,
  resolveBookingTimeSlots,
} from "@/lib/time-slot-pricing";
import { formatDepartureLocation } from "@/lib/departure-locations";
import {
  formatProvisionalHoldExpiry,
  getBankDetails,
  isOnlinePaymentsEnabled,
} from "@/lib/payments";
import { BankingDetailsCard } from "@/components/booking/banking-details-card";
import { resolvePackageImageUrl } from "@/lib/packages";
import { PublicPageShell } from "@/components/public-page-shell";
import { SectionHeader } from "@/components/home/section-header";

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
      bookingAddons: true,
    },
  });

  if (!booking) {
    redirect("/dashboard");
  }

  if (booking.userId !== user.id && user.role !== "admin") {
    redirect("/dashboard");
  }

  const onlinePayments = isOnlinePaymentsEnabled();
  const isProvisional = !onlinePayments && booking.paymentStatus === "unpaid";
  const slotIds = resolveBookingTimeSlots(booking);
  const slotSummary = formatTimeSlotSummary(slotIds);
  const statusColor = BOOKING_STATUS_COLORS[booking.status];
  const statusLabel = isProvisional
    ? "Provisional"
    : BOOKING_STATUS_LABELS[booking.status];
  const paymentLabel = isProvisional
    ? "Awaiting EFT"
    : PAYMENT_STATUS_LABELS[booking.paymentStatus];
  const paymentColor = isProvisional
    ? "bg-amber/10 text-amber border-amber/30"
    : PAYMENT_STATUS_COLORS[booking.paymentStatus];
  const packageSubtotal =
    parseFloat(booking.pricePerPerson) * booking.guestCount;
  const holdExpiresLabel = formatProvisionalHoldExpiry(booking.createdAt);
  const bankDetails = getBankDetails();

  const imageSrc = resolvePackageImageUrl(
    booking.package.imageUrl,
    booking.package.slug,
  );

  return (
    <PublicPageShell active="packages" showStickyActions={false}>
      <section className="section-pad pt-28 lg:pt-36">
        <div className="narrow-shell">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 ring-4 ring-green-500/10">
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <SectionHeader
              compact
              className="mx-auto max-w-xl"
              eyebrow={
                isProvisional
                  ? "Provisional booking confirmed"
                  : booking.paymentStatus === "paid"
                    ? "Payment received"
                    : "Booking submitted"
              }
              title={
                <>
                  {isProvisional ? (
                    <>
                      Booking{" "}
                      <span className="text-gradient-sunset">reserved!</span>
                    </>
                  ) : (
                    <>
                      You&apos;re{" "}
                      <span className="text-gradient-sunset">
                        {booking.paymentStatus === "paid"
                          ? "confirmed!"
                          : "almost there!"}
                      </span>
                    </>
                  )}
                </>
              }
              subtitle={
                isProvisional
                  ? `Your booking number is ${booking.bookingNumber}. Complete an EFT within 24 hours using the banking details below to secure your charter.`
                  : booking.paymentStatus === "paid"
                    ? "Your payment was successful and your booking is confirmed. We'll send a confirmation email shortly."
                    : "Your booking is reserved. Complete payment to confirm your charter."
              }
            />
          </div>

          {isProvisional && (
            <BankingDetailsCard
              className="mb-6"
              bank={bankDetails}
              bookingNumber={booking.bookingNumber}
              amountDue={booking.totalPrice}
              holdExpiresLabel={holdExpiresLabel}
            />
          )}

          <div className="glass-panel mb-6 overflow-hidden rounded-2xl border border-[var(--theme-border)] light-card">
            <div className="flex flex-col gap-3 border-b border-[var(--theme-border)] p-5 sm:flex-row sm:items-start sm:justify-between lg:p-6">
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Booking Number</p>
                <p className="font-mono text-xl font-bold">{booking.bookingNumber}</p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${statusColor}`}
              >
                {statusLabel}
              </span>
              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${paymentColor}`}
              >
                {paymentLabel}
              </span>
            </div>

            <div className="p-5 lg:p-6">
              <div className="mb-5 flex gap-4 rounded-xl bg-[var(--theme-surface)] p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={booking.package.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{booking.package.name}</h3>
                  {booking.package.tagline && (
                    <p className="text-sm text-orange-500">{booking.package.tagline}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">Date</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">Time</p>
                  <p className="font-medium">{slotSummary}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">Guests</p>
                  <p className="font-medium">{booking.guestCount} people</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">Departure</p>
                  <p className="font-medium">
                    {formatDepartureLocation(booking.departureLocation)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)]">Duration</p>
                  <p className="font-medium">{booking.package.duration}</p>
                </div>
              </div>

              {booking.bookingAddons.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-[var(--theme-border)] pt-4">
                  <p className="text-sm font-medium">Add-ons</p>
                  {booking.bookingAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[var(--theme-text-muted)]">
                        {addon.name}
                      </span>
                      <span>{formatPrice(addon.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-2 border-t border-[var(--theme-border)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">
                    Package ({booking.guestCount} guests)
                  </span>
                  <span>{formatPrice(packageSubtotal)}</span>
                </div>
                {parseFloat(booking.addonsTotal) > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--theme-text-muted)]">Add-ons</span>
                    <span>{formatPrice(booking.addonsTotal)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 light-card lg:p-6">
            <h3 className="mb-4 font-semibold">Contact Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-[var(--theme-text-muted)]">Name</span>
                <span>{booking.contactName}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-[var(--theme-text-muted)]">Email</span>
                <span>{booking.contactEmail}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-[var(--theme-text-muted)]">Phone</span>
                <span>{booking.contactPhone}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel mb-8 rounded-2xl border border-orange-500/20 p-5 lg:p-6">
            <h3 className="mb-3 font-semibold">What happens next?</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
              {isProvisional ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">1.</span>
                    Transfer {formatPrice(booking.totalPrice)} via EFT using
                    reference {booking.bookingNumber}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">2.</span>
                    Your date is held for 24 hours until {holdExpiresLabel}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">3.</span>
                    Once payment clears, we&apos;ll confirm your charter by email
                  </li>
                </>
              ) : booking.paymentStatus === "paid" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">1.</span>
                    You&apos;ll receive a confirmation email with your booking details
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">2.</span>
                    Our team will contact you with pre-trip information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">3.</span>
                    See you on the water!
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">1.</span>
                    Complete payment from your dashboard to confirm your booking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">2.</span>
                    Our team will review availability and confirm your date
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-orange-500">3.</span>
                    You&apos;ll receive a confirmation email once payment is received
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/dashboard"
              className="btn-primary flex-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 py-3.5 text-center font-semibold text-white transition-opacity hover:opacity-90"
            >
              View My Bookings
            </Link>
            <Link
              href="/packages"
              className="flex-1 rounded-full border border-[var(--theme-border)] py-3.5 text-center font-semibold transition-colors hover:bg-[var(--theme-surface)]"
            >
              Browse Packages
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
