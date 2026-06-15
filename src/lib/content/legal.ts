// LEGAL REVIEW REQUIRED — draft, not final law.
//
// The content below is operational copy drafted to be useful, not legal advice.
// Every section must be reviewed and approved by a qualified South African
// legal adviser before being presented as final. Permit/licence numbers are
// REQUIRED placeholders pending real, verified values.

import { z } from "zod";

export const legalSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Draft status so the UI can flag un-reviewed copy. */
  status: z.enum(["draft", "in-review", "approved"]).default("draft"),
  intro: z.string().optional(),
  /** Paragraphs of body copy. */
  body: z.array(z.string()),
  bullets: z.array(z.string()).optional(),
});

export type LegalSection = z.infer<typeof legalSectionSchema>;

const DRAFT_NOTE =
  "This is a draft for review by a qualified legal adviser and is not final legal advice.";

export const legalSections: LegalSection[] = [
  {
    id: "privacy",
    title: "Privacy Policy (POPIA / GDPR draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Hey Charlie Charters respects your privacy and protects your personal information in line with the South African Protection of Personal Information Act (POPIA) and, where applicable, the EU/UK General Data Protection Regulation (GDPR).",
      "We collect only the personal information needed to take and manage your booking — for example your name, contact details, group size and any dietary or accessibility requirements. We do not sell your personal information.",
      "We process your information for the purposes of confirming and running your charter, communicating with you about your booking, accounting and record-keeping, and meeting our legal obligations.",
      "Booking contact details may be shared with our payment processor, the skipper and crew handling your trip, and authorities where required by law (for example passenger manifests or safety compliance).",
      "We retain booking records for as long as reasonably required for legal, tax and operational purposes, then delete or anonymise them.",
      "You may request access to, correction of, or deletion of your personal information, and you may object to or restrict certain processing. To exercise these rights, contact us using the details on the Contact page.",
      "REQUIRED: confirm the appointed Information Officer and a dedicated privacy contact email before publishing.",
    ],
    bullets: [
      "Lawful basis: performance of a contract (your booking) and legal obligation.",
      "Cross-border: confirm whether any data leaves South Africa and document transfers.",
      "Cookies/analytics: confirm which analytics tools are used and disclose them.",
    ],
  },
  {
    id: "terms",
    title: "Terms of Service (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "These terms govern bookings made with Hey Charlie Charters. By booking a charter you accept these terms on behalf of yourself and your group.",
      "A booking is confirmed once the deposit is received and you have a written confirmation. The charter is operated by Hey Charlie Charters from the V&A Waterfront, Cape Town.",
      "You agree to provide accurate information, follow the skipper's safety instructions at all times, and behave in a way that does not endanger the vessel, crew or other guests.",
      "The skipper's decisions regarding safety, route and whether a trip can safely proceed are final.",
      "Prices are in South African Rand (ZAR) and are subject to change; the price confirmed at booking is binding for that booking.",
      "REQUIRED: confirm the registered legal entity name, registration number and registered address before publishing.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations & Refunds (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Cancellations 14 or more days before departure: full refund.",
      "Cancellations 7–14 days before departure: 50% of the booking value is retained.",
      "Cancellations fewer than 7 days before departure: the booking is non-refundable.",
      "Weather cancellations made by us: you may reschedule to the next available date or receive a full refund.",
      "No-shows and late arrivals are non-refundable, as late arrival reduces time on the water.",
      "REQUIRED: confirm deposit percentage, non-refundable deposit rules, and whether third-party booking platforms override these terms.",
    ],
  },
  {
    id: "weather-policy",
    title: "Weather & Sea Conditions Policy (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Safety is the deciding factor. The skipper makes the final call on whether a trip can safely proceed based on wind, sea state, swell and visibility.",
      "If conditions are unsuitable, we will offer to reschedule to the next suitable date or issue a full refund.",
      "If a trip must be shortened for safety once underway, we will offer a partial refund or a reschedule reflecting the time lost.",
      "Some destinations (for example rounding Cape Point) are only attempted in suitable conditions and may be adjusted on the day.",
      "REQUIRED: confirm how short-notice rescheduling and partial refunds are calculated.",
    ],
  },
  {
    id: "safety",
    title: "Safety On Board (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Every charter carries the required safety equipment, including life jackets for adults and children, flares, a VHF radio, a first-aid kit and the gear required by South African maritime regulations.",
      "A short safety briefing is given before departure. Passengers must follow the skipper and crew's instructions at all times.",
      "Please tell us in advance about any medical conditions, mobility considerations, or non-swimmers in your group so we can plan appropriately.",
      "REQUIRED: confirm the vessel's SAMSA survey category, passenger capacity certificate, and current safety equipment service dates.",
    ],
  },
  {
    id: "liability",
    title: "Liability (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Hey Charlie Charters carries marine liability insurance. Guests take part in marine activities at their own risk and should ensure they have suitable personal travel and medical cover.",
      "To the extent permitted by law, our liability for loss, damage or injury is limited to the scope of our insurance cover.",
      "We are not liable for circumstances outside our control, including adverse weather, wildlife behaviour, or third-party actions.",
      "REQUIRED: confirm insurer name, policy number and cover limits before publishing (see credentials).",
    ],
  },
  {
    id: "permits-and-regulations",
    title: "Permits & Regulations (draft)",
    status: "draft",
    intro: DRAFT_NOTE,
    body: [
      "Hey Charlie Charters operates under South African maritime regulations administered by SAMSA (South African Maritime Safety Authority). The vessel and skipper hold the licences required to operate commercial charters.",
      "Recreational fishing and crayfish (West Coast rock lobster) diving are regulated by the Department of Agriculture, Forestry and Fisheries (DAFF) / Department of Environment, Forestry and Fisheries. Recreational anglers require a valid recreational fishing permit, and crayfish diving is only permitted within the open season and daily bag and size limits.",
      "Wildlife viewing is conducted with respect for the animals and in line with responsible viewing guidelines.",
      "REQUIRED: the following reference numbers must be supplied and verified before publication:",
    ],
    bullets: [
      "REQUIRED: SAMSA vessel registration / survey number.",
      "REQUIRED: Skipper's SAMSA licence category and number (verified).",
      "REQUIRED: DAFF recreational fishing permit arrangement (for fishing charters).",
      "REQUIRED: DAFF recreational crayfish permit arrangement (for crayfish charters, in season).",
      "REQUIRED: Marine liability insurer name and policy number.",
    ],
  },
];

export function getLegalSection(id: string): LegalSection | undefined {
  return legalSections.find((s) => s.id === id);
}

export function getLegalSections(): LegalSection[] {
  return legalSections;
}
