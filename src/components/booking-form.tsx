"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { TIME_SLOTS, formatPrice } from "@/lib/booking-utils";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from "@/lib/booking-draft";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  pricePerPerson: string;
  minGuests: number;
  maxGuests: number;
  duration: string;
}

interface BookingFormProps {
  packageData: Package;
}

const STEPS = [
  { id: 1, label: "When" },
  { id: 2, label: "Guests" },
  { id: 3, label: "Contact" },
] as const;

const inputClass =
  "w-full min-h-11 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-base outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber";

export function BookingForm({ packageData }: BookingFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    guestCount: packageData.minGuests,
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
    specialRequests: "",
    dietaryRequirements: "",
  });

  useEffect(() => {
    const draft = loadBookingDraft(packageData.id);
    if (draft) {
      setFormData((prev) => ({ ...prev, ...draft.formData }));
      if (draft.step) setStep(draft.step);
    }
  }, [packageData.id]);

  useEffect(() => {
    saveBookingDraft(packageData.id, { formData, step });
  }, [formData, step, packageData.id]);

  useEffect(() => {
    trackEvent("booking_started", { packageId: packageData.id });
  }, [packageData.id]);

  const pricePerPerson = parseFloat(packageData.pricePerPerson);
  const totalPrice = pricePerPerson * formData.guestCount;

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const canProceedStep1 = Boolean(formData.date && formData.timeSlot);
  const canProceedStep2 = formData.guestCount >= packageData.minGuests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: packageData.id,
          date: new Date(formData.date).toISOString(),
          timeSlot: formData.timeSlot,
          guestCount: formData.guestCount,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          specialRequests: formData.specialRequests || undefined,
          dietaryRequirements: formData.dietaryRequirements || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const { booking } = await response.json();
      clearBookingDraft(packageData.id);
      trackEvent("booking_completed", {
        packageId: packageData.id,
        bookingId: booking.id,
      });
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      trackEvent("booking_error", { packageId: packageData.id });
    } finally {
      setIsLoading(false);
    }
  };

  function goNext() {
    trackEvent("booking_step_completed", {
      packageId: packageData.id,
      step,
    });
    setStep((s) => Math.min(3, s + 1));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex gap-2" aria-label="Booking progress">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={cn(
              "flex-1 rounded-full py-2 text-center text-xs font-medium",
              step === s.id
                ? "bg-amber text-ink"
                : step > s.id
                  ? "bg-amber/20 text-amber"
                  : "bg-[var(--theme-surface)] text-[var(--theme-text-muted)]",
            )}
            aria-current={step === s.id ? "step" : undefined}
          >
            {s.label}
          </div>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
        >
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="booking-date" className="mb-2 block text-sm font-medium">
              Select Date <span className="text-red-500">*</span>
            </label>
            <input
              id="booking-date"
              type="date"
              required
              min={tomorrow}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              Time Slot <span className="text-red-500">*</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, timeSlot: slot.id })
                  }
                  className={cn(
                    "min-h-16 rounded-xl border p-3 text-center transition-all",
                    formData.timeSlot === slot.id
                      ? "border-amber bg-amber/10 text-amber"
                      : "border-[var(--theme-border)] hover:border-amber/50",
                  )}
                  aria-pressed={formData.timeSlot === slot.id}
                >
                  <div className="text-sm font-medium">{slot.name}</div>
                  <div className="text-xs text-[var(--theme-text-muted)]">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            size="block"
            disabled={!canProceedStep1}
            onClick={goNext}
          >
            Continue to guests
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">
              Number of Guests <span className="text-red-500">*</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Decrease guest count"
                onClick={() =>
                  setFormData({
                    ...formData,
                    guestCount: Math.max(
                      packageData.minGuests,
                      formData.guestCount - 1,
                    ),
                  })
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)]"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold">{formData.guestCount}</span>
                <span className="ml-2 text-[var(--theme-text-muted)]">
                  guests
                </span>
              </div>
              <button
                type="button"
                aria-label="Increase guest count"
                onClick={() =>
                  setFormData({
                    ...formData,
                    guestCount: Math.min(
                      packageData.maxGuests,
                      formData.guestCount + 1,
                    ),
                  })
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)]"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-[var(--theme-text-muted)]">
              Min: {packageData.minGuests} | Max: {packageData.maxGuests}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              type="button"
              disabled={!canProceedStep2}
              onClick={goNext}
            >
              Continue to contact
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                className={inputClass}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                placeholder="+27 XX XXX XXXX"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="special-requests" className="mb-2 block text-sm font-medium">
                Special Requests
              </label>
              <textarea
                id="special-requests"
                rows={3}
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
                className={cn(inputClass, "resize-none")}
              />
            </div>
            <div>
              <label htmlFor="dietary" className="mb-2 block text-sm font-medium">
                Dietary Requirements
              </label>
              <textarea
                id="dietary"
                rows={2}
                value={formData.dietaryRequirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRequirements: e.target.value,
                  })
                }
                className={cn(inputClass, "resize-none")}
              />
            </div>
          </div>
          <Button type="button" variant="secondary" onClick={() => setStep(2)}>
            Back
          </Button>
        </div>
      )}

      {/* Sticky price summary */}
      <div className="sticky bottom-3 z-30 space-y-3 rounded-2xl border border-amber/20 bg-[var(--theme-bg)]/90 p-4 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
        <div className="rounded-xl border border-amber/20 bg-amber/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">
              {formatPrice(pricePerPerson)} × {formData.guestCount} guests
            </span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-amber/20 pt-2">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-amber">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {step === 3 && (
          <Button type="submit" size="block" disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-[var(--theme-text-muted)]">
        By booking, you agree to our terms. Draft saved automatically on this
        device.
      </p>
    </form>
  );
}
