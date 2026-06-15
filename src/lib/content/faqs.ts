import { z } from "zod";

/**
 * General + attachable FAQ bank for Hey Charlie Charters.
 *
 * Content is operational and safety-focused. No fabricated facts.
 * Each FAQ is tagged so packages / destinations / pages can pull a relevant subset.
 */

export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  /** Free-form tags used to attach FAQs to packages, destinations, or page sections. */
  tags: z.array(z.string()).default([]),
});

export type FaqItem = z.infer<typeof faqItemSchema>;

/** Compact {q,a} shape embedded directly inside packages and destinations. */
export const faqPairSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export type FaqPair = z.infer<typeof faqPairSchema>;

export const generalFaqs: FaqItem[] = [
  {
    id: "meeting-point",
    question: "Where do we meet for our charter?",
    answer:
      "All charters depart from the V&A Waterfront, Cape Town. We share the exact berth and a pin on Google Maps in your booking confirmation, and the crew meets you at the slip 15 minutes before departure.",
    tags: ["general", "logistics", "sundowner", "private", "coastal", "wildlife"],
  },
  {
    id: "arrival-time",
    question: "How early should we arrive?",
    answer:
      "Please arrive 15 minutes before your departure time for a short safety briefing and to settle any final details. Late arrivals reduce your time on the water.",
    tags: ["general", "logistics"],
  },
  {
    id: "what-to-bring",
    question: "What should we bring?",
    answer:
      "Sun protection (hat, sunscreen, sunglasses), a warm layer (it is noticeably cooler on the water), a windbreaker, and any personal drinks or snacks you would like. Towels and swimwear for trips with swim stops. Soft-soled, non-marking shoes are best on deck.",
    tags: ["general", "logistics", "sundowner", "fishing", "beach-hopping", "crayfish"],
  },
  {
    id: "group-size",
    question: "How many guests can join?",
    answer:
      "Capacity depends on the experience. Most shared charters take up to 12 guests; specialist trips like crayfish diving and deep-sea fishing run with smaller groups for safety and comfort. Private charter is exclusive use of the boat for up to 12 guests.",
    tags: ["general", "private", "fishing", "crayfish", "beach-hopping"],
  },
  {
    id: "seasickness",
    question: "What if someone is prone to seasickness?",
    answer:
      "Table Bay and the Atlantic Seaboard are generally sheltered, but conditions change. If you are sensitive to motion, take a non-drowsy remedy an hour before departure, eat lightly, and let the crew know so they can pick the calmest route. Longer offshore trips (Cape Point, deep-sea fishing) are more exposed.",
    tags: ["general", "safety", "fishing", "coastal", "whale-watching"],
  },
  {
    id: "weather-policy",
    question: "What happens if the weather is bad?",
    answer:
      "Safety comes first. The skipper makes the final call based on wind, sea and swell. If we cancel or cut a trip short for weather, you can reschedule to the next available date or receive a full refund — see our Cancellations & Weather policy for the details.",
    tags: ["general", "safety", "cancellations"],
  },
  {
    id: "cancellations",
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 14 or more days before departure receive a full refund. Within 7–14 days we retain 50%; within 7 days the booking is non-refundable. Weather cancellations by us are always fully refundable or rebookable. Full terms are on our Cancellations page.",
    tags: ["general", "cancellations"],
  },
  {
    id: "payment",
    question: "How do we pay?",
    answer:
      "A deposit secures your date with the balance due before departure. We will confirm accepted payment methods (card / EFT) at booking. Promo codes, where valid, are applied at checkout.",
    tags: ["general", "logistics"],
  },
  {
    id: "safety-equipment",
    question: "Is safety equipment provided?",
    answer:
      "Yes. Life jackets for adults and children, flares, VHF radio, first-aid kit and required safety gear are carried on every trip. The crew runs a short briefing before we cast off.",
    tags: ["general", "safety"],
  },
  {
    id: "children",
    question: "Are children welcome?",
    answer:
      "Yes. Cape Town coastal and wildlife trips are family-friendly, and we carry appropriately sized life jackets. For specialist trips (crayfish diving, offshore fishing) we will advise on the minimum age based on conditions.",
    tags: ["general", "wildlife", "coastal", "beach-hopping"],
  },
  {
    id: "wildlife-guarantee",
    question: "Will we definitely see whales, seals or penguins?",
    answer:
      "We cannot guarantee wild animals — they are wild. That said, the Cape Peninsula is one of the best places in the world for Southern Right and Humpback whales (roughly June–November), Cape fur seals are resident at Duiker Island year-round, and the Boulders penguin colony is reliable. We plan routes around the best current activity to give you the strongest chance.",
    tags: ["general", "wildlife", "whale-watching", "safety"],
  },
];

/** Return FAQs whose tags intersect the requested tags (or all FAQs if none given). */
export function getFaqs(tags?: string[]): FaqItem[] {
  if (!tags || tags.length === 0) return generalFaqs;
  return generalFaqs.filter((f) => f.tags.some((t) => tags.includes(t)));
}

export function getFaqById(id: string): FaqItem | undefined {
  return generalFaqs.find((f) => f.id === id);
}
