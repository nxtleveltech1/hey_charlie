import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import {
  formatPrice,
  formatShortDate,
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
} from "@/lib/booking-utils";
import { FilterChips } from "@/components/ui/filter-chips";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";

type BookingRow = Awaited<
  ReturnType<typeof db.query.bookings.findMany>
>[number] & {
  package: { name: string };
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const allBookings = (await db.query.bookings.findMany({
    where: status
      ? eq(
          bookings.status,
          status as "pending" | "confirmed" | "cancelled" | "completed",
        )
      : undefined,
    with: { package: true, user: true },
    orderBy: [desc(bookings.createdAt)],
  })) as BookingRow[];

  const statusFilters = [
    { value: "", label: "All", href: "/admin/bookings" },
    { value: "pending", label: "Pending", href: "/admin/bookings?status=pending" },
    {
      value: "confirmed",
      label: "Confirmed",
      href: "/admin/bookings?status=confirmed",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      href: "/admin/bookings?status=cancelled",
    },
    {
      value: "completed",
      label: "Completed",
      href: "/admin/bookings?status=completed",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bookings
        </h1>
        <p className="text-[var(--theme-text-muted)]">
          Manage all customer bookings
        </p>
      </div>

      <FilterChips
        chips={statusFilters}
        activeValue={status ?? ""}
        className="mb-6"
      />

      <ResponsiveDataList
        data={allBookings}
        rowKey={(b) => b.id}
        emptyTitle="No bookings yet"
        emptyMessage="No bookings found for this filter."
        columns={[
          {
            key: "number",
            header: "Booking #",
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
          {
            key: "package",
            header: "Package",
            cell: (b) => b.package.name,
          },
          {
            key: "date",
            header: "Date",
            cell: (b) => formatShortDate(b.date),
          },
          {
            key: "guests",
            header: "Guests",
            cell: (b) => b.guestCount,
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
          {
            key: "actions",
            header: "Actions",
            cell: (b) => (
              <Link
                href={`/admin/bookings/${b.id}`}
                className="text-sm text-amber hover:text-amber-deep"
              >
                View
              </Link>
            ),
          },
        ]}
        renderMobileCard={(b) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="font-mono text-sm font-medium text-amber"
                >
                  {b.bookingNumber}
                </Link>
                <p className="mt-1 font-medium">{b.contactName}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  {b.contactEmail}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${BOOKING_STATUS_COLORS[b.status]}`}
              >
                {BOOKING_STATUS_LABELS[b.status]}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--theme-text-muted)]">
              <span>{b.package.name}</span>
              <span>{formatShortDate(b.date)}</span>
              <span>{b.guestCount} guests</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-amber">
                {formatPrice(b.totalPrice)}
              </span>
              <Link
                href={`/admin/bookings/${b.id}`}
                className="min-h-11 rounded-xl border border-[var(--theme-border)] px-4 py-2 text-sm"
              >
                View details
              </Link>
            </div>
          </div>
        )}
      />
    </div>
  );
}
