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
  TIME_SLOTS,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking-utils";
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
    },
  });

  if (!booking) {
    redirect("/dashboard");
  }

  if (booking.userId !== user.id && user.role !== "admin") {
    redirect("/dashboard");
  }

  const timeSlot = TIME_SLOTS.find((s) => s.id === booking.timeSlot);
  const statusColor = BOOKING_STATUS_COLORS[booking.status];
  const statusLabel = BOOKING_STATUS_LABELS[booking.status];

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
              eyebrow="Booking submitted"
              title={
                <>
                  You&apos;re <span className="text-gradient-sunset">all set!</span>
                </>
              }
              subtitle="Your booking request has been submitted successfully. We'll be in touch within 24 hours."
            />
          </div>

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
                  <p className="font-medium">
                    {timeSlot?.name} ({timeSlot?.startTime} – {timeSlot?.endTime})
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

              <div className="mt-5 flex items-center justify-between border-t border-[var(--theme-border)] pt-4">
                <span className="text-[var(--theme-text-muted)]">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  {formatPrice(booking.totalPrice)}
                </span>
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
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-500">1.</span>
                Our team will review your booking and confirm availability
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-500">2.</span>
                You&apos;ll receive a confirmation email within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-500">3.</span>
                Payment details will be shared upon confirmation
              </li>
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
