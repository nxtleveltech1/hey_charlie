import { z } from "zod";

/**
 * Crew roster for Hey Charlie Charters.
 *
 * IMPORTANT:
 *  - "Hey Charlie" is the BRAND/BOAT name. There is no fictional "Captain Charlie".
 *  - The owner/operator is the real captain (Gareth Bew).
 *  - Certification NUMBERS are not fabricated: items default to `verified: false`
 *    and a REQUIRED note where a number/confirmation is pending.
 *  - Crew headshots live under `/public/images/` (see README there).
 *  - Crew contact numbers are the real mobile numbers (used by the DB seed / admin).
 */

export const certAuthoritySchema = z.enum(["SAMSA", "NSRI"]);

export const crewCertificationSchema = z.object({
  label: z.string(),
  authority: certAuthoritySchema.optional(),
  /** Certificate / licence number. Omitted until a real, verified value is supplied. */
  number: z.string().optional(),
  verified: z.boolean(),
  note: z.string().optional(),
});

export const crewMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  yearsExperience: z.number(),
  certifications: z.array(crewCertificationSchema),
  /** Photo asset path — REQUIRED marker until a real asset is supplied. */
  image: z.string(),
  /** Crew contact number (real). Stored in the DB; not surfaced on public pages. */
  phone: z.string(),
  order: z.number(),
  active: z.boolean(),
});

export type CrewCertification = z.infer<typeof crewCertificationSchema>;
export type CrewMember = z.infer<typeof crewMemberSchema>;

/** Shared REQUIRED sentinel for photos only (numbers are now real). Inserted into the DB seed so the requirement is loud. */
export const CREW_IMAGE_REQUIRED = "REQUIRED: crew photo asset pending (HCC_CREW_*)";

const crew: CrewMember[] = [
  {
    id: "gareth-bew",
    name: "Gareth Bew",
    role: "Captain, Founder & Owner",
    bio: "Gareth is the owner-operator behind Hey Charlie Charters and skipper aboard Hey Charlie. He has spent his career on the Cape coast and built the business around safe, well-run days on the water. He knows the peninsula's anchorages, fishing grounds and sheltered spots, and personally looks after every trip.",
    yearsExperience: 15,
    certifications: [
      {
        label: "SAMSA Skipper Licence",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: licence category and number pending verification.",
      },
      {
        label: "VHF Radio Operator",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate number pending verification.",
      },
      {
        label: "First Aid at Sea",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate currency pending verification.",
      },
    ],
    image: "/Gallery/HC%201%20(38).jpeg",
    phone: "+27 60 314 4873",
    order: 1,
    active: true,
  },
  {
    id: "jay-profe",
    name: "Jay Profe",
    role: "Owner & Operations",
    bio: "Jay has two years of experience in the marine industry and over 20 years in marketing, sales and customer service. He brings critical operational and customer-engagement experience to our operation, ensuring we offer not only quality but a guaranteed, professional customer experience on every charter.",
    yearsExperience: 2,
    certifications: [
      {
        label: "Sea Safety Certificate",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate number pending verification.",
      },
      {
        label: "First Aid at Sea",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate currency pending verification.",
      },
    ],
    image: "/images/Jay.png",
    phone: "+27 83 397 0407",
    order: 2,
    active: true,
  },
  {
    id: "wayne-laufs",
    name: "Wayne Laufs",
    role: "First Hand / Deckhand",
    bio: "Wayne is our first hand and a fixture on deck. He handles rigging, fishing setups, safety gear and guest experience — making sure everyone on board gets the most out of the day. A 4th-generation commercial fishing professional with over 30 years on the ocean, Wayne has been involved in almost every aspect of ocean adventures and deep-sea fishing, and brings an incredible knowledge of our oceans and getting the best out of a day on the water.",
    yearsExperience: 30,
    certifications: [
      {
        label: "SAMSA Deckhand Certificate",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate number pending verification.",
      },
      {
        label: "Sea Safety Certificate",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate number pending verification.",
      },
      {
        label: "First Aid at Sea",
        authority: "SAMSA",
        verified: false,
        note: "REQUIRED: certificate currency pending verification.",
      },
    ],
    image: "/images/wayne.png",
    phone: "+27 72 799 7341",
    order: 3,
    active: true,
  },
];

/** Active crew, ordered for display. */
export function getCrew(): CrewMember[] {
  return crew
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order);
}

export function getCrewMemberById(id: string): CrewMember | undefined {
  return crew.find((c) => c.id === id);
}

/** Placeholder sentinel in content — never pass to next/image. */
export function isValidCrewImage(
  src: string | null | undefined,
): src is string {
  return !!src && src.length > 0 && !src.startsWith("REQUIRED");
}

/** Content module photo wins over stale DB values (see crew page + public API). */
export function resolveCrewImageUrl(
  name: string,
  imageUrl: string | null | undefined,
): string | null {
  const fromContent = getCrew().find((c) => c.name === name)?.image;
  if (isValidCrewImage(fromContent)) return fromContent;
  if (isValidCrewImage(imageUrl)) return imageUrl;
  return null;
}

export { crew as crewRoster };
