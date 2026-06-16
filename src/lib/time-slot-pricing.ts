import { TIME_SLOTS } from "@/lib/booking-utils";

/** Reference package used to derive the full-day + sunset bundle ratio (R2 200 → R5 000). */
export const FULL_DAY_BUNDLE_REFERENCE = {
  basePricePerPerson: 2200,
  bundlePricePerPerson: 5000,
} as const;

const SLOT_ORDER = TIME_SLOTS.map((s) => s.id);

export type TimeSlotPricing = {
  pricePerPerson: number;
  slotCount: number;
  /** Per-person discount when all three slots are selected (0 otherwise). */
  discountPerPerson: number;
  /** Undiscounted per-person price before bundle discount. */
  undiscountedPricePerPerson: number;
  isFullDayBundle: boolean;
  label: string;
};

export function sortTimeSlotIds(slotIds: string[]): string[] {
  return [...slotIds].sort(
    (a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b),
  );
}

export function validateTimeSlotSelection(
  slotIds: string[],
): { valid: true; slots: string[] } | { valid: false; error: string } {
  if (slotIds.length === 0) {
    return { valid: false, error: "Select at least one time slot" };
  }

  const unique = [...new Set(slotIds)];
  if (unique.length !== slotIds.length) {
    return { valid: false, error: "Duplicate time slots are not allowed" };
  }

  for (const id of unique) {
    if (!SLOT_ORDER.includes(id)) {
      return { valid: false, error: "Invalid time slot selection" };
    }
  }

  return { valid: true, slots: sortTimeSlotIds(unique) };
}

export function calculateTimeSlotPricePerPerson(
  basePricePerPerson: number | string,
  slotIds: string[],
): TimeSlotPricing {
  const validation = validateTimeSlotSelection(slotIds);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const base = parseFloat(String(basePricePerPerson));
  const slots = validation.slots;
  const count = slots.length;
  const label = formatTimeSlotNames(slots);

  if (count === 1) {
    return {
      pricePerPerson: base,
      slotCount: 1,
      discountPerPerson: 0,
      undiscountedPricePerPerson: base,
      isFullDayBundle: false,
      label,
    };
  }

  if (count === 2) {
    return {
      pricePerPerson: base * 2,
      slotCount: 2,
      discountPerPerson: 0,
      undiscountedPricePerPerson: base * 2,
      isFullDayBundle: false,
      label,
    };
  }

  const undiscountedPricePerPerson = base * 3;
  const bundleRatio =
    FULL_DAY_BUNDLE_REFERENCE.bundlePricePerPerson /
    FULL_DAY_BUNDLE_REFERENCE.basePricePerPerson;
  const pricePerPerson = Math.round(base * bundleRatio * 100) / 100;
  const discountPerPerson = undiscountedPricePerPerson - pricePerPerson;

  return {
    pricePerPerson,
    slotCount: 3,
    discountPerPerson,
    undiscountedPricePerPerson,
    isFullDayBundle: true,
    label: "Full day + sunset",
  };
}

export function resolveBookingTimeSlots(booking: {
  timeSlots?: string[] | null;
  timeSlot: string;
}): string[] {
  if (booking.timeSlots && booking.timeSlots.length > 0) {
    return sortTimeSlotIds(booking.timeSlots);
  }

  if (!booking.timeSlot) return [];

  if (booking.timeSlot.includes(",")) {
    return sortTimeSlotIds(booking.timeSlot.split(",").map((s) => s.trim()));
  }

  return [booking.timeSlot];
}

export function formatTimeSlotNames(slotIds: string[]): string {
  return resolveBookingTimeSlots({ timeSlots: slotIds, timeSlot: "" })
    .map((id) => TIME_SLOTS.find((s) => s.id === id)?.name ?? id)
    .join(", ");
}

export function formatTimeSlotSummary(slotIds: string[]): string {
  const sorted = sortTimeSlotIds(slotIds);
  return sorted
    .map((id) => {
      const slot = TIME_SLOTS.find((s) => s.id === id);
      if (!slot) return id;
      return `${slot.name} (${slot.startTime} – ${slot.endTime})`;
    })
    .join(" · ");
}
