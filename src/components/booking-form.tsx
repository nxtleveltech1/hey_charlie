"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { TIME_SLOTS, formatPrice } from "@/lib/booking-utils";
import {
  calculateTimeSlotPricePerPerson,
  sortTimeSlotIds,
} from "@/lib/time-slot-pricing";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from "@/lib/booking-draft";
import { calculateBookingTotal, type SelectedAddonsMap } from "@/lib/addon-pricing";
import {
  DEFAULT_DEPARTURE_LOCATION,
  DEPARTURE_LOCATIONS,
  type DepartureLocationId,
} from "@/lib/departure-locations";
import { isOnlinePaymentsEnabled } from "@/lib/payments";
import { trackEvent } from "@/lib/analytics";
import { BookingAddonPicker } from "@/components/booking/booking-addon-picker";
import { BookingDateWeather } from "@/components/booking/booking-date-weather";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Addon } from "@/db/schema";

interface Package {
  id: string;
  slug: string;
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
  { id: 2, label: "Add-ons" },
  { id: 3, label: "Contact" },
] as const;

const inputClass =
  "w-full min-h-11 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-base outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber";

export function BookingForm({ packageData }: BookingFormProps) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonsMap>({});
  const [addonsCatalog, setAddonsCatalog] = useState<Addon[]>([]);

  const [formData, setFormData] = useState({
    date: "",
    timeSlots: [] as string[],
    guestCount: packageData.minGuests,
    departureLocation: DEFAULT_DEPARTURE_LOCATION as DepartureLocationId,
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
      setSelectedAddons(draft.selectedAddons ?? {});
      if (draft.step) {
        // Map legacy 4-step drafts to 3-step flow
        const mappedStep =
          draft.step === 1 ? 1 : draft.step === 2 ? 1 : draft.step - 1;
        setStep(Math.min(mappedStep, 3));
      }
    }
  }, [packageData.id]);

  useEffect(() => {
    saveBookingDraft(packageData.id, { formData, selectedAddons, step });
  }, [formData, selectedAddons, step, packageData.id]);

  useEffect(() => {
    trackEvent("booking_started", { packageId: packageData.id });
  }, [packageData.id]);

  useEffect(() => {
    fetch("/api/package-addons")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.addons) setAddonsCatalog(data.addons);
      })
      .catch(() => {});
  }, []);

  const slotPricing = useMemo(() => {
    if (formData.timeSlots.length === 0) return null;
    try {
      return calculateTimeSlotPricePerPerson(
        packageData.pricePerPerson,
        formData.timeSlots,
      );
    } catch {
      return null;
    }
  }, [packageData.pricePerPerson, formData.timeSlots]);

  const pricing = useMemo(() => {
    const effectivePricePerPerson =
      slotPricing?.pricePerPerson ?? parseFloat(packageData.pricePerPerson);

    try {
      const totals = calculateBookingTotal(
        effectivePricePerPerson,
        formData.guestCount,
        selectedAddons,
        addonsCatalog,
      );
      return {
        ...totals,
        slotPricing,
        effectivePricePerPerson,
      };
    } catch {
      const packageSubtotal =
        effectivePricePerPerson * formData.guestCount;
      return {
        packageSubtotal,
        addonsTotal: 0,
        totalPrice: packageSubtotal,
        lines: [],
        slotPricing,
        effectivePricePerPerson,
      };
    }
  }, [
    packageData.pricePerPerson,
    formData.guestCount,
    formData.timeSlots,
    selectedAddons,
    addonsCatalog,
    slotPricing,
  ]);

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const canProceedStep1 =
    Boolean(formData.date && formData.timeSlots.length > 0 && formData.departureLocation) &&
    formData.guestCount >= packageData.minGuests &&
    formData.guestCount <= packageData.maxGuests;

  const toggleTimeSlot = (slotId: string) => {
    setFormData((prev) => {
      const isSelected = prev.timeSlots.includes(slotId);
      const nextSlots = isSelected
        ? prev.timeSlots.filter((id) => id !== slotId)
        : sortTimeSlotIds([...prev.timeSlots, slotId]);
      return { ...prev, timeSlots: nextSlots };
    });
  };

  const basePrice = parseFloat(packageData.pricePerPerson);

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
          timeSlots: formData.timeSlots,
          guestCount: formData.guestCount,
          departureLocation: formData.departureLocation,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          specialRequests: formData.specialRequests || undefined,
          dietaryRequirements: formData.dietaryRequirements || undefined,
          addons: Object.entries(selectedAddons).map(([addonId, quantity]) => ({
            addonId,
            quantity,
          })),
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

      if (isOnlinePaymentsEnabled()) {
        const checkoutRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.id }),
        });

        if (!checkoutRes.ok) {
          const data = await checkoutRes.json();
          throw new Error(
            data.error ||
              "Booking created but payment could not be started. Complete payment from your dashboard.",
          );
        }

        const { checkoutUrl } = await checkoutRes.json();
        window.location.href = checkoutUrl;
        return;
      }

      window.location.href = `/booking/confirmation/${booking.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      trackEvent("booking_error", { packageId: packageData.id });
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
          <BookingDateWeather selectedDate={formData.date} />
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
          <div>
            <p className="mb-2 text-sm font-medium">
              Departure Location <span className="text-red-500">*</span>
            </p>
            <p className="mb-3 text-xs text-[var(--theme-text-muted)]">
              Where would you like to board the charter?
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {DEPARTURE_LOCATIONS.map((location) => {
                const isSelected = formData.departureLocation === location.id;
                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        departureLocation: location.id,
                      })
                    }
                    className={cn(
                      "min-h-16 rounded-xl border p-3 text-center transition-all",
                      isSelected
                        ? "border-amber bg-amber/10 text-amber"
                        : "border-[var(--theme-border)] hover:border-amber/50",
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className="text-sm font-medium">{location.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              Time Slots <span className="text-red-500">*</span>
            </p>
            <p className="mb-3 text-xs text-[var(--theme-text-muted)]">
              Select one or more slots. Two slots = double rate per person. All
              three = full day + sunset bundle with a discount.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = formData.timeSlots.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleTimeSlot(slot.id)}
                    className={cn(
                      "min-h-16 rounded-xl border p-3 text-center transition-all",
                      isSelected
                        ? "border-amber bg-amber/10 text-amber"
                        : "border-[var(--theme-border)] hover:border-amber/50",
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className="text-sm font-medium">{slot.name}</div>
                    <div className="text-xs text-[var(--theme-text-muted)]">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="mt-1 text-xs font-medium">
                      {formatPrice(basePrice)}/person
                    </div>
                  </button>
                );
              })}
            </div>
            {slotPricing?.isFullDayBundle && (
              <div className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm">
                <p className="font-medium text-green-600">
                  Full day + sunset bundle applied
                </p>
                <p className="text-[var(--theme-text-muted)]">
                  Save {formatPrice(slotPricing.discountPerPerson)} per person (
                  {formatPrice(slotPricing.undiscountedPricePerPerson)} →{" "}
                  {formatPrice(slotPricing.pricePerPerson)})
                </p>
              </div>
            )}
            {slotPricing && slotPricing.slotCount === 2 && (
              <p className="mt-2 text-xs text-[var(--theme-text-muted)]">
                {slotPricing.label}: {formatPrice(slotPricing.pricePerPerson)} per
                person
              </p>
            )}
          </div>
          <Button
            type="button"
            size="block"
            disabled={!canProceedStep1}
            onClick={goNext}
          >
            Continue to add-ons
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <BookingAddonPicker
            guestCount={formData.guestCount}
            selectedAddons={selectedAddons}
            onSelectionChange={setSelectedAddons}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" onClick={goNext}>
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
          {!isOnlinePaymentsEnabled() && (
            <p className="text-sm text-[var(--theme-text-muted)]">
              No card payment required now. After you confirm, we&apos;ll hold
              your date for 24 hours while you complete an EFT using the banking
              details on the next screen.
            </p>
          )}
          <Button type="button" variant="secondary" onClick={() => setStep(2)}>
            Back
          </Button>
        </div>
      )}

      <div className="sticky bottom-3 z-30 space-y-3 rounded-2xl border border-amber/20 bg-[var(--theme-bg)]/90 p-4 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
        <div className="rounded-xl border border-amber/20 bg-amber/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--theme-text-muted)]">
              {packageData.name}
              {slotPricing
                ? ` · ${slotPricing.label}`
                : formData.timeSlots.length > 0
                  ? ""
                  : ""}{" "}
              × {formData.guestCount}
            </span>
            <span className="font-medium">
              {formatPrice(pricing.packageSubtotal)}
            </span>
          </div>
          {slotPricing?.isFullDayBundle && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>Full day discount</span>
              <span>
                −{formatPrice(slotPricing.discountPerPerson * formData.guestCount)}
              </span>
            </div>
          )}
          {pricing.lines.map((line) => (
            <div
              key={line.addonId}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[var(--theme-text-muted)] truncate pr-2">
                {line.name}
              </span>
              <span className="font-medium shrink-0">
                {formatPrice(line.lineTotal)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-amber/20 pt-2">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-amber">
              {formatPrice(pricing.totalPrice)}
            </span>
          </div>
        </div>

        {step === 3 && (
          <Button type="submit" size="block" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : isOnlinePaymentsEnabled()
                ? "Proceed to Payment"
                : "Confirm Booking"}
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
