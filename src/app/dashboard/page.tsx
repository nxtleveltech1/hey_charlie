import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { users, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatPrice, formatDate, TIME_SLOTS, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/booking-utils";
import { CancelBookingButton } from "./cancel-booking-button";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    redirect("/sign-in");
  }

  const userBookings = await db.query.bookings.findMany({
    where: eq(bookings.userId, user.id),
    with: { package: true },
    orderBy: [desc(bookings.createdAt)],
  });

  const upcomingBookings = userBookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "completed" && new Date(b.date) >= new Date()
  );
  const pastBookings = userBookings.filter(
    (b) => b.status === "completed" || new Date(b.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="Hey Charlie Charters"
              width={50}
              height={50}
              className="rounded-xl"
            />
            <div>
              <span className="text-xl font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Hey Charlie
              </span>
              <span className="block text-xs font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                CHARTERS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              My Bookings
            </h1>
            <p className="text-[var(--theme-text-muted)]">
              Welcome back, {user.firstName || "Guest"}!
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/#packages"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Book New Experience
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="px-6 py-3 rounded-xl border border-orange-500/20 text-orange-500 hover:bg-orange-500/10 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Upcoming Experiences</h2>
          {upcomingBookings.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
              <div className="text-4xl mb-4">⛵</div>
              <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
              <p className="text-[var(--theme-text-muted)] mb-4">
                Ready for your next adventure? Browse our experiences!
              </p>
              <Link
                href="/#packages"
                className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Explore Packages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const timeSlot = TIME_SLOTS.find((s) => s.id === booking.timeSlot);
                return (
                  <div
                    key={booking.id}
                    className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${BOOKING_STATUS_COLORS[booking.status]}`}>
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </span>
                          <span className="text-sm font-mono text-[var(--theme-text-muted)]">
                            {booking.bookingNumber}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{booking.package.name}</h3>
                        <p className="text-[var(--theme-text-muted)] text-sm mb-3">
                          {booking.package.tagline}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            📅 {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏰ {timeSlot?.name} ({timeSlot?.startTime})
                          </span>
                          <span className="flex items-center gap-1">
                            👥 {booking.guestCount} guests
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-2xl font-bold text-orange-500">
                          {formatPrice(booking.totalPrice)}
                        </span>
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/booking/confirmation/${booking.id}`}
                            className="px-4 py-2 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm"
                          >
                            View Details
                          </Link>
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

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Past Experiences</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] opacity-75"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{booking.package.name}</h3>
                      <p className="text-sm text-[var(--theme-text-muted)]">
                        {formatDate(booking.date)} • {booking.guestCount} guests
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${BOOKING_STATUS_COLORS[booking.status]}`}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
