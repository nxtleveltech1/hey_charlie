import { z } from "zod";

/**
 * Promotional offers for Hey Charlie Charters.
 *
 * IMPORTANT: `getActiveOffers()` is the ONLY accessor that should feed the UI.
 * It filters by date so expired offers can never render. Promo-code redemption
 * (pricing/cart logic) is a separate concern and is intentionally NOT built here.
 *
 * The previously-present "Summer Sizzler" (expired 2026-03-31) has been removed.
 */

export const offerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  code: z.string(),
  /** ISO 8601 expiry timestamp. Ignored when `ongoing` is true. */
  validUntil: z.string().optional(),
  /** Human-readable label for display, e.g. "Ongoing" or "Until 30 Sep 2026". */
  validUntilDisplay: z.string(),
  ongoing: z.boolean(),
});

export type Offer = z.infer<typeof offerSchema>;

const offers: Offer[] = [
  {
    id: "group-discount",
    title: "Squad Goals",
    description: "Groups of 8 or more receive a complimentary bottle of sparkling wine on board.",
    code: "SQUAD8",
    ongoing: true,
    validUntilDisplay: "Ongoing",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Book 30 or more days in advance and save 10% on your charter.",
    code: "EARLY10",
    ongoing: true,
    validUntilDisplay: "Ongoing",
  },
];

/** Whether an offer is active at the given time (defaults to now). */
export function isOfferActive(offer: Offer, now: Date = new Date()): boolean {
  if (offer.ongoing) return true;
  if (!offer.validUntil) return false;
  return now.getTime() <= new Date(offer.validUntil).getTime();
}

/** All currently-active offers. Expired offers are filtered out. */
export function getActiveOffers(now: Date = new Date()): Offer[] {
  return offers.filter((o) => isOfferActive(o, now));
}

/** All offers regardless of status — use sparingly, prefer getActiveOffers(). */
export function getAllOffers(): Offer[] {
  return offers;
}

export function getOfferByCode(code: string): Offer | undefined {
  return offers.find((o) => o.code.toUpperCase() === code.toUpperCase());
}
