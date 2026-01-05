import { db } from "@/db";
import { bookings, users, packages } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import Link from "next/link";
import { formatPrice, formatShortDate, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/booking-utils";

export default async function AdminDashboard() {
  // Get stats
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalCustomers,
    recentBookings,
  ] = await Promise.all([
    db.select({ count: count() }).from(bookings),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "pending")),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "confirmed")),
    db.select({ count: count() }).from(users).where(eq(users.role, "user")),
    db.query.bookings.findMany({
      with: { package: true, user: true },
      orderBy: [desc(bookings.createdAt)],
      limit: 5,
    }),
  ]);

  // Calculate revenue from confirmed/completed bookings
  const revenueResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL)), 0)`,
    })
    .from(bookings)
    .where(sql`${bookings.status} IN ('confirmed', 'completed')`);

  const totalRevenue = parseFloat(revenueResult[0]?.total || "0");

  const stats = [
    { label: "Total Bookings", value: totalBookings[0].count, icon: "📅", color: "text-blue-500" },
    { label: "Pending", value: pendingBookings[0].count, icon: "⏳", color: "text-yellow-500" },
    { label: "Confirmed", value: confirmedBookings[0].count, icon: "✅", color: "text-green-500" },
    { label: "Customers", value: totalCustomers[0].count, icon: "👥", color: "text-purple-500" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Dashboard
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Welcome to Hey Charlie Charters Admin
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-[var(--theme-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--theme-text-muted)] mb-1">Total Revenue (Confirmed)</p>
            <p className="text-4xl font-bold text-orange-500">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="text-6xl opacity-50">💰</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--theme-border)] flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-surface)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--theme-text-muted)]">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[var(--theme-surface)] transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="font-mono text-sm hover:text-orange-500 transition-colors"
                      >
                        {booking.bookingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{booking.contactName}</p>
                        <p className="text-xs text-[var(--theme-text-muted)]">{booking.contactEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.package.name}</td>
                    <td className="px-6 py-4 text-sm">{formatShortDate(booking.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${BOOKING_STATUS_COLORS[booking.status]}`}>
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(booking.totalPrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

