import { z } from "zod";

/**
 * Crew roster for Hey Charlie Charters.
 *
 * IMPORTANT:
 *  - "Hey Charlie" is the BRAND/BOAT name. There is no fictional "Captain Charlie".
 *  - The owner/operator is the real captain (Gareth Bew).
 *  - Certification NUMBERS are not fabricated: items default to `verified: false`
 *    and a REQUIRED note where a number/confirmation is pending.
 *  - Photos are REQUIRED markers pending real assets.
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
    image: CREW_IMAGE_REQUIRED,
    phone: "+27 60 314 4873",
    order: 1,
    active: true,
  },
  {
    id: "justin-profer",
    name: "Justin Profer",
    role: "Owner & Operations",
    bio: "Justin co-owns Hey Charlie Charters and looks after the day-to-day running of the operation. From bookings and logistics to making sure every charter comes together smoothly, he keeps the business side watertight so the crew can focus on guests.",
    yearsExperience: 10,
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
    image: CREW_IMAGE_REQUIRED,
    phone: "+27 83 397 0407",
    order: 2,
    active: true,
  },
  {
    id: "wayne-laufs",
    name: "Wayne Laufs",
    role: "First Hand / Deckhand",
    bio: "Wayne is our first hand and a fixture on deck. He handles rigging, fishing setups, safety gear and guest experience — making sure everyone on board gets the most out of the day, whether cruising, fishing or swimming.",
    yearsExperience: 8,
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
    image: CREW_IMAGE_REQUIRED,
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

export { crew as crewRoster };
