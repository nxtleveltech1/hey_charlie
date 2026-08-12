export const CAPE_COURAGE_SLUG = "cape-courage-vip";
export const CAPE_COURAGE_PRICE = 3250;
export const CAPE_COURAGE_CAPACITY = 7;
export const CAPE_COURAGE_SLOT = "event-day";

// The competition date is called at short notice during the waiting period.
// Existing charter bookings require a date, so event tickets use the end of
// the published waiting period internally and render the event-call label in UI.
export const CAPE_COURAGE_BOOKING_DATE = "2026-08-31T10:00:00.000Z";
export const CAPE_COURAGE_DATE_LABEL = "Event day confirmed on the Cape Courage call";
export const CAPE_COURAGE_TIME_LABEL = "Full event day";

export function isCapeCourage(slug: string): boolean {
  return slug === CAPE_COURAGE_SLUG;
}
