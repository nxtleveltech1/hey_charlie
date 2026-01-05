import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate, TIME_SLOTS, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/booking-utils";
import { BookingStatusForm } from "./booking-status-form";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
    with: { package: true, user: true },
  });

  if (!booking) {
    notFound();
  }

  const timeSlot = TIME_SLOTS.find((s) => s.id === booking.timeSlot);
  const statusColor = BOOKING_STATUS_COLORS[booking.status];
  const statusLabel = BOOKING_STATUS_LABELS[booking.status];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            href="/admin/bookings"
            className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors mb-2 inline-block"
          >
            ← Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {booking.bookingNumber}
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Created on {formatDate(booking.createdAt)}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Details */}
          <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <h2 className="text-lg font-semibold mb-4">Package Details</h2>
            <div className="p-4 rounded-xl bg-[var(--theme-surface)] mb-4">
              <h3 className="font-semibold">{booking.package.name}</h3>
              <p className="text-sm text-[var(--theme-text-muted)]">{booking.package.tagline}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Date</p>
                <p className="font-medium">{formatDate(booking.date)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-muted)]">Time Slot</p>
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
          </div>

          {/* Contact Details */}
          <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--theme-text-muted)]">Name</span>
                <span className="font-medium">{booking.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--theme-text-muted)]">Email</span>
                <a href={`mailto:${booking.contactEmail}`} className="font-medium text-orange-500 hover:text-orange-400">
                  {booking.contactEmail}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--theme-text-muted)]">Phone</span>
                <a href={`tel:${booking.contactPhone}`} className="font-medium text-orange-500 hover:text-orange-400">
                  {booking.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {(booking.specialRequests || booking.dietaryRequirements) && (
            <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
              {booking.specialRequests && (
                <div className="mb-4">
                  <p className="text-sm text-[var(--theme-text-muted)] mb-1">Special Requests</p>
                  <p className="p-3 rounded-lg bg-[var(--theme-surface)]">{booking.specialRequests}</p>
                </div>
              )}
              {booking.dietaryRequirements && (
                <div>
                  <p className="text-sm text-[var(--theme-text-muted)] mb-1">Dietary Requirements</p>
                  <p className="p-3 rounded-lg bg-[var(--theme-surface)]">{booking.dietaryRequirements}</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-[var(--theme-text-muted)]">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
              {booking.confirmedAt && (
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium">Booking Confirmed</p>
                    <p className="text-sm text-[var(--theme-text-muted)]">{formatDate(booking.confirmedAt)}</p>
                  </div>
                </div>
              )}
              {booking.cancelledAt && (
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                  <div>
                    <p className="font-medium">Booking Cancelled</p>
                    <p className="text-sm text-[var(--theme-text-muted)]">{formatDate(booking.cancelledAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="p-6 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-pink-500/10">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--theme-text-muted)]">Price per person</span>
                <span>{formatPrice(booking.pricePerPerson)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--theme-text-muted)]">Guests</span>
                <span>× {booking.guestCount}</span>
              </div>
              <div className="pt-3 border-t border-orange-500/20 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <BookingStatusForm bookingId={booking.id} currentStatus={booking.status} />
          </div>

          {/* Admin Notes */}
          <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <h2 className="text-lg font-semibold mb-4">Admin Notes</h2>
            <textarea
              placeholder="Add internal notes..."
              defaultValue={booking.adminNotes || ""}
              className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors resize-none h-32"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <a
              href={`mailto:${booking.contactEmail}?subject=Your Hey Charlie Charters Booking ${booking.bookingNumber}`}
              className="w-full py-3 px-4 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors flex items-center justify-center gap-2"
            >
              ✉️ Email Customer
            </a>
            <a
              href={`https://wa.me/${booking.contactPhone.replace(/\D/g, "")}?text=Hi ${booking.contactName}, regarding your Hey Charlie Charters booking ${booking.bookingNumber}...`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

