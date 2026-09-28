import { z } from "zod";
import { TIME_SLOTS } from "./booking-utils";
import type { TimeSlotPricing } from "./time-slot-pricing";

export const PRIVATE_CHARTER_SLUG = "private-celebration";
export const privateDurationSchema = z.enum(["one-hour", "three-hours", "full-day"]);
export type PrivateDuration = z.infer<typeof privateDurationSchema>;
export const PRIVATE_OPTIONS = [
  { id: "one-hour", label: "1 hour", price: 950 },
  { id: "three-hours", label: "3 hours", price: 1350 },
  { id: "full-day", label: "Full day", price: 2000 },
] satisfies { id: PrivateDuration; label: string; price: number }[];
export const PRIVATE_ADDON_SLUGS = ["private-lunch", "private-drinks"];

export function privateCharterPricing(duration: unknown, slots: string[]): TimeSlotPricing {
  const id = privateDurationSchema.parse(duration);
  const option = PRIVATE_OPTIONS.find((item) => item.id === id);
  if (!option) throw new Error("Choose a charter duration");
  if (id === "full-day") {
    if (slots.length !== TIME_SLOTS.length || !TIME_SLOTS.every((slot) => slots.includes(slot.id))) {
      throw new Error("Full-day charters reserve all departure windows");
    }
  } else if (slots.length !== 1 || !TIME_SLOTS.some((slot) => slot.id === slots[0])) {
    throw new Error("Choose one departure window for your private charter");
  }
  return { pricePerPerson: option.price, slotCount: slots.length, discountPerPerson: 0,
    undiscountedPricePerPerson: option.price, isFullDayBundle: false, label: option.label };
}

export function addonsForPackage<T extends { slug: string }>(items: T[], slug: string): T[] {
  return items.filter((item) => slug === PRIVATE_CHARTER_SLUG
    ? !["catering", "refreshments", "catering-refreshments"].includes(item.slug)
    : !PRIVATE_ADDON_SLUGS.includes(item.slug));
}
