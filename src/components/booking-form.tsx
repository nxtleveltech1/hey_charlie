"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { TIME_SLOTS, formatPrice } from "@/lib/booking-utils";

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

export function BookingForm({ packageData }: BookingFormProps) {
  const router = useRouter();
  const { user } = useUser();
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

  const pricePerPerson = parseFloat(packageData.pricePerPerson);
  const totalPrice = pricePerPerson * formData.guestCount;

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
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          min={minDate}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Time Slot <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setFormData({ ...formData, timeSlot: slot.id })}
              className={`p-3 rounded-xl border text-center transition-all ${
                formData.timeSlot === slot.id
                  ? "border-orange-500 bg-orange-500/10 text-orange-500"
                  : "border-[var(--theme-border)] hover:border-orange-500/50"
              }`}
            >
              <div className="font-medium text-sm">{slot.name}</div>
              <div className="text-xs text-[var(--theme-text-muted)]">
                {slot.startTime} - {slot.endTime}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Number of Guests <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                guestCount: Math.max(packageData.minGuests, formData.guestCount - 1),
              })
            }
            className="w-12 h-12 rounded-xl border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] transition-colors"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="text-3xl font-bold">{formData.guestCount}</span>
            <span className="text-[var(--theme-text-muted)] ml-2">guests</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                guestCount: Math.min(packageData.maxGuests, formData.guestCount + 1),
              })
            }
            className="w-12 h-12 rounded-xl border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-xs text-[var(--theme-text-muted)] mt-2 text-center">
          Min: {packageData.minGuests} | Max: {packageData.maxGuests}
        </p>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">Contact Details</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            placeholder="+27 XX XXX XXXX"
            className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div className="space-y-4">
        <h3 className="font-semibold">Additional Information</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Special Requests
          </label>
          <textarea
            rows={3}
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            placeholder="Any special requests or celebrations?"
            className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Dietary Requirements
          </label>
          <textarea
            rows={2}
            value={formData.dietaryRequirements}
            onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
            placeholder="Any allergies or dietary restrictions?"
            className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Price Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[var(--theme-text-muted)]">
            {formatPrice(pricePerPerson)} × {formData.guestCount} guests
          </span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-orange-500/20">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-orange-500">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.date || !formData.timeSlot}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Confirm Booking"}
      </button>

      <p className="text-xs text-center text-[var(--theme-text-muted)]">
        By booking, you agree to our terms and conditions. 
        You will receive a confirmation email once your booking is reviewed.
      </p>
    </form>
  );
}

