import { getPublicSiteConfig } from "@/lib/content/site-config";
import { isOnlinePaymentsEnabled } from "@/lib/payments";

/**
 * Booking email notifications via Resend (https://resend.com).
 *
 * Gated on RESEND_API_KEY — when unset, notifications are skipped with a
 * one-time server warning so bookings never fail because email is not
 * configured yet. Uses plain fetch so no SDK dependency is needed.
 *
 * Env:
 *   RESEND_API_KEY      — required to actually send.
 *   RESEND_FROM_EMAIL   — verified sender, e.g. "Hey Charlie Charters <bookings@heycharliecharters.com>".
 *   HCC_BOOKING_NOTIFY_EMAIL — owner inbox for new-booking alerts (defaults to the site contact email).
 */

export interface BookingEmailData {
  bookingNumber: string;
  packageName: string;
  date: Date;
  dateLabel?: string;
  timeSlots: string[];
  timeLabel?: string;
  guestCount: number;
  totalPrice: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string | null;
}

let warnedMissingKey = false;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn(
        "[booking-notify] RESEND_API_KEY is not set — booking emails are disabled.",
      );
    }
    return;
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Hey Charlie Charters <bookings@heycharliecharters.com>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${body.slice(0, 300)}`);
  }
}

/**
 * Notify the owner and the guest about a new booking. Never throws — a failed
 * email must not fail the booking itself.
 */
export async function sendBookingNotifications(booking: BookingEmailData): Promise<void> {
  const site = getPublicSiteConfig();
  const ownerInbox =
    process.env.HCC_BOOKING_NOTIFY_EMAIL?.trim() || site.email;
  const when = booking.dateLabel ?? formatDate(booking.date);
  const slots = booking.timeLabel ?? booking.timeSlots.join(", ");

  const summaryLines = [
    `Booking number: ${booking.bookingNumber}`,
    `Package: ${booking.packageName}`,
    `Date: ${when}`,
    `Time slot(s): ${slots}`,
    `Guests: ${booking.guestCount}`,
    `Total: R${booking.totalPrice}`,
    `Contact: ${booking.contactName} — ${booking.contactEmail} — ${booking.contactPhone}`,
    booking.specialRequests ? `Special requests: ${booking.specialRequests}` : null,
  ].filter(Boolean);

  const ownerEmail = sendEmail(
    ownerInbox,
    `New booking ${booking.bookingNumber} — ${booking.packageName} on ${when}`,
    `A new booking has come in.\n\n${summaryLines.join("\n")}\n\nManage it at ${site.canonicalUrl}/admin/bookings`,
  );

  const paymentNote = isOnlinePaymentsEnabled()
    ? "You can complete payment online from your booking confirmation page."
    : `Banking details will be provided with your booking quotation. Please use ${booking.bookingNumber} as your payment reference — your reservation is held for 24 hours.`;

  const guestEmail = sendEmail(
    booking.contactEmail,
    `Your Hey Charlie Charters booking ${booking.bookingNumber}`,
    `Ahoy ${booking.contactName},\n\nThanks for booking with Hey Charlie Charters! Here are your details:\n\n${summaryLines
      .slice(0, 6)
      .join("\n")}\n\n${paymentNote}\n\nQuestions? WhatsApp us at https://wa.me/${site.whatsapp} or reply to this email.\n\nSee you on the water,\nThe Hey Charlie Charters crew\n${site.canonicalUrl}`,
  );

  const results = await Promise.allSettled([ownerEmail, guestEmail]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[booking-notify] Failed to send booking email:", result.reason);
    }
  }
}
