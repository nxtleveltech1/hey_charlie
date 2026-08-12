"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/booking-utils";
import { DEFAULT_DEPARTURE_LOCATION } from "@/lib/departure-locations";

interface CapeCourageBookingFormProps {
  packageData: {
    id: string;
    name: string;
    pricePerPerson: string;
    minGuests: number;
    maxGuests: number;
  };
}

const inputClass =
  "w-full min-h-11 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-base outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber";

export function CapeCourageBookingForm({ packageData }: CapeCourageBookingFormProps) {
  const { user } = useUser();
  const [spots, setSpots] = useState(packageData.minGuests);
  const [contactName, setContactName] = useState(user?.fullName ?? "");
  const [contactEmail, setContactEmail] = useState(
    user?.primaryEmailAddress?.emailAddress ?? "",
  );
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = Number(packageData.pricePerPerson) * spots;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    setIsLoading(true);

    try {
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: packageData.id,
          guestCount: spots,
          departureLocation: DEFAULT_DEPARTURE_LOCATION,
          contactName,
          contactEmail,
          contactPhone,
          specialRequests: specialRequests || undefined,
          addons: [],
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || "Unable to reserve your spots");
      }

      window.location.href = `/booking/confirmation/${bookingData.booking.id}`;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reserve your spots");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
          Choose your spots
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">{spots} {spots === 1 ? "spot" : "spots"}</p>
            <p className="text-sm text-[var(--theme-text-muted)]">
              {formatPrice(packageData.pricePerPerson)} per person
            </p>
          </div>
          <div className="flex items-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <button
              type="button"
              aria-label="Remove one spot"
              onClick={() => setSpots((value) => Math.max(packageData.minGuests, value - 1))}
              disabled={spots <= packageData.minGuests}
              className="h-11 w-11 text-xl disabled:opacity-30"
            >
              −
            </button>
            <span className="w-10 text-center font-bold">{spots}</span>
            <button
              type="button"
              aria-label="Add one spot"
              onClick={() => setSpots((value) => Math.min(packageData.maxGuests, value + 1))}
              disabled={spots >= packageData.maxGuests}
              className="h-11 w-11 text-xl disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cape-contact-name" className="mb-2 block text-sm font-medium">Full name</label>
          <input id="cape-contact-name" required value={contactName} onChange={(event) => setContactName(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cape-contact-email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="cape-contact-email" type="email" required value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cape-contact-phone" className="mb-2 block text-sm font-medium">Phone number</label>
          <input id="cape-contact-phone" type="tel" required minLength={10} value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cape-special-requests" className="mb-2 block text-sm font-medium">Dietary notes or requests</label>
          <textarea id="cape-special-requests" rows={3} value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} className={`${inputClass} resize-none`} />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-3xl font-bold text-orange-500">{formatPrice(total)}</span>
        </div>
        <Button type="submit" size="block" variant="coral" disabled={isLoading}>
          {isLoading ? "Reserving your spot…" : "Book Your Spot Now"}
        </Button>
        <p className="mt-3 text-center text-xs text-[var(--theme-text-muted)]">
          Your booking is reserved immediately. Use the booking reference and manual payment instructions on the next page.
        </p>
      </div>
    </form>
  );
}
