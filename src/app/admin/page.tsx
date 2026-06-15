import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import Link from "next/link";
import {
  formatPrice,
  formatShortDate,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking-utils";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalCustomers,
    recentBookings,
  ] = await Promise.all([
    db.select({ count: count() }).from(bookings),
    db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, "pending")),
    db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, "confirmed")),
    db.select({ count: count() }).from(users).where(eq(users.role, "user")),
    db.query.bookings.findMany({
      with: { package: true, user: true },
      orderBy: [desc(bookings.createdAt)],
      limit: 5,
    }),
  ]);

  const revenueResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL)), 0)`,
    })
    .from(bookings)
    .where(sql`${bookings.status} IN ('confirmed', 'completed')`);

  const totalRevenue = parseFloat(revenueResult[0]?.total || "0");
  const pendingCount = pendingBookings[0].count;

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings[0].count,
      icon: "📅",
      color: "text-blue-500",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: "⏳",
      color: "text-yellow-500",
    },
    {
      label: "Confirmed",
      value: confirmedBookings[0].count,
      icon: "✅",
      color: "text-green-500",
    },
    {
      label: "Customers",
      value: totalCustomers[0].count,
      icon: "👥",
      color: "text-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-[var(--theme-text-muted)]">
          Welcome to Hey Charlie Charters Admin
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-yellow-500">
                {pendingCount} pending booking{pendingCount === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-[var(--theme-text-muted)]">
                Review and confirm from your phone while at the marina.
              </p>
            </div>
            <Button href="/admin/bookings?status=pending" variant="primary" size="sm">
              Review pending
            </Button>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-4 lg:p-6"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xl lg:text-2xl" aria-hidden="true">
                {stat.icon}
              </span>
              <span className={`text-2xl font-bold lg:text-3xl ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-[var(--theme-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-amber/20 bg-amber/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm text-[var(--theme-text-muted)]">
              Total Revenue (Confirmed)
            </p>
            <p className="text-3xl font-bold text-amber sm:text-4xl">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="text-5xl opacity-50" aria-hidden="true">
            💰
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <Link href="/admin/bookings" className="text-sm text-amber hover:text-amber-deep">
          View All →
        </Link>
      </div>

      <ResponsiveDataList
        data={recentBookings}
        rowKey={(b) => b.id}
        emptyTitle="No bookings yet"
        emptyMessage="New bookings will appear here."
        columns={[
          {
            key: "booking",
            header: "Booking",
            cell: (b) => (
              <Link
                href={`/admin/bookings/${b.id}`}
                className="font-mono text-sm hover:text-amber"
              >
                {b.bookingNumber}
              </Link>
            ),
          },
          {
            key: "customer",
            header: "Customer",
            cell: (b) => (
              <div>
                <p className="text-sm font-medium">{b.contactName}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  {b.contactEmail}
                </p>
              </div>
            ),
          },
          { key: "package", header: "Package", cell: (b) => b.package.name },
          {
            key: "date",
            header: "Date",
            cell: (b) => formatShortDate(b.date),
          },
          {
            key: "status",
            header: "Status",
            cell: (b) => (
              <span
                className={`rounded-full border px-2 py-1 text-xs font-medium ${BOOKING_STATUS_COLORS[b.status]}`}
              >
                {BOOKING_STATUS_LABELS[b.status]}
              </span>
            ),
          },
          {
            key: "total",
            header: "Total",
            cell: (b) => formatPrice(b.totalPrice),
          },
        ]}
        renderMobileCard={(b) => (
          <Link href={`/admin/bookings/${b.id}`} className="block space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-sm text-amber">{b.bookingNumber}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${BOOKING_STATUS_COLORS[b.status]}`}
              >
                {BOOKING_STATUS_LABELS[b.status]}
              </span>
            </div>
            <p className="font-medium">{b.contactName}</p>
            <p className="text-sm text-[var(--theme-text-muted)]">
              {b.package.name} · {formatShortDate(b.date)}
            </p>
            <p className="font-bold text-amber">{formatPrice(b.totalPrice)}</p>
          </Link>
        )}
      />
    </div>
  );
}
