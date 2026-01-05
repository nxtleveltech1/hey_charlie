import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { formatPrice, formatShortDate, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/booking-utils";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const allBookings = await db.query.bookings.findMany({
    where: status ? eq(bookings.status, status as "pending" | "confirmed" | "cancelled" | "completed") : undefined,
    with: { package: true, user: true },
    orderBy: [desc(bookings.createdAt)],
  });

  const statusFilters = [
    { value: "", label: "All", count: null },
    { value: "pending", label: "Pending", count: null },
    { value: "confirmed", label: "Confirmed", count: null },
    { value: "cancelled", label: "Cancelled", count: null },
    { value: "completed", label: "Completed", count: null },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Bookings
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Manage all customer bookings
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value ? `/admin/bookings?status=${filter.value}` : "/admin/bookings"}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              status === filter.value || (!status && !filter.value)
                ? "bg-orange-500 text-white"
                : "bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-surface)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Booking #
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
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {allBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[var(--theme-text-muted)]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                allBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[var(--theme-surface)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{booking.bookingNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{booking.contactName}</p>
                        <p className="text-xs text-[var(--theme-text-muted)]">{booking.contactEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.package.name}</td>
                    <td className="px-6 py-4 text-sm">{formatShortDate(booking.date)}</td>
                    <td className="px-6 py-4 text-sm">{booking.guestCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${BOOKING_STATUS_COLORS[booking.status]}`}>
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(booking.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        View
                      </Link>
                    </td>
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

