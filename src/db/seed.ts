import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import "dotenv/config";
import {
  getPackages,
  getCrew,
  CREW_IMAGE_REQUIRED,
  type Package as ContentPackage,
  type PackageCategory,
} from "@/lib/content";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

/**
 * SOURCE OF TRUTH SPLIT (important for future waves):
 *
 *  - The canonical package + crew content lives in `@/lib/content`. Marketing
 *    reads directly from there (richer model: season, inclusions, exclusions,
 *    permits, FAQs, relatedSlugs, bestFor, offSeason, byRequest, etc.).
 *  - This seed maps the content module onto the EXISTING booking/admin DB
 *    schema, which currently has fewer columns. Fields the schema lacks
 *    (season, inclusions, exclusions, requiresPermit, faqs, relatedSlugs,
 *    bestFor, offSeason, byRequest, etc.) are intentionally NOT stored here —
 *    they live in the content module only. DB = booking/admin source;
 *    content module = marketing source.
 *  - Required DB columns are always satisfied. Crew phones are the real numbers
 *    from the content module; crew photos are seeded from `/public/images/`
 *    paths in `@/lib/content/crew.ts`.
 */

// Map canonical content categories onto the legacy booking/admin category
// vocabulary the current PackageCard / booking UI expects. The three new
// off-season categories map to the closest existing bucket.
const DB_CATEGORY_MAP: Record<PackageCategory, string> = {
  sundowner: "relaxation",
  private: "private",
  "whale-watching": "wildlife",
  fishing: "fishing",
  crayfish: "culinary",
  "beach-hopping": "adventure",
  corporate: "private",
  coastal: "adventure",
  wildlife: "wildlife",
  shipwreck: "adventure",
  "event-support": "private",
  custom: "private",
};

const packagesToSeed = getPackages().map((pkg: ContentPackage) => ({
  slug: pkg.slug,
  name: pkg.name,
  tagline: pkg.tagline,
  description: pkg.longDescription,
  duration: pkg.durationLabel,
  // NOTE: the DB only has `price_per_person`. For private-charter the content
  // price is the boat price for a half-day (priceUnit "per half-day"); the
  // booking layer must interpret `priceUnit` rather than assuming per-person.
  // For priceUnit "request" (off-season/on-request services) the content price
  // is 0 — the UI shows "Request a quote"; the booking layer should treat a
  // zero/`request` price as quote-on-request rather than free.
  pricePerPerson: pkg.price.toString(),
  minGuests: pkg.minGuests,
  maxGuests: pkg.maxGuests,
  category: DB_CATEGORY_MAP[pkg.category],
  highlights: pkg.highlights,
  // Store NULL for placeholder/sentinel hero images (e.g. "REQUIRED-ASSET: ...")
  // so the booking/admin DB never holds a broken placeholder path. The
  // marketing layer reads the real asset from the content module.
  imageUrl: pkg.heroImage.startsWith("REQUIRED-ASSET") ? null : pkg.heroImage,
  isActive: true,
  isFeatured: pkg.featured,
}));

const crewMembersToSeed = getCrew().map((member) => ({
  name: member.name,
  role: member.role,
  bio: member.bio,
  yearsExperience: member.yearsExperience,
  // Verified status lives in the content module; the DB stores labels only.
  certifications: member.certifications.map((c) => c.label),
  email: null, // REQUIRED: individual crew emails pending confirmation.
  phone: member.phone, // Real crew number from the content module.
  // Photo paths from the content module (e.g. /images/gareth.png).
  imageUrl: member.image === CREW_IMAGE_REQUIRED ? null : member.image,
  isActive: member.active,
  displayOrder: member.order,
}));

const addonsToSeed = [
  {
    slug: "shuttle-pickup",
    name: "Shuttle service — Pickup",
    description:
      "Collection from any hotel and brought to the launch location of the boat, up to 6 people.",
    price: "1500.00",
    priceUnit: "flat" as const,
    selectionGroup: null,
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: "shuttle-dropoff",
    name: "Shuttle service — Drop-off",
    description:
      "Drop-off after the day is done from the launch location back to your hotel, up to 6 people.",
    price: "1500.00",
    priceUnit: "flat" as const,
    selectionGroup: null,
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: "jetski-2-hours",
    name: "Jetski — 2 hours",
    description:
      "Book a jetski to accompany the boat for 2 hours. Play in the ocean with the safety of having the boat nearby.",
    price: "3000.00",
    priceUnit: "flat" as const,
    selectionGroup: "jetski",
    allowQuantity: true,
    maxQuantity: 4,
    displayOrder: 3,
    isActive: true,
  },
  {
    slug: "jetski-full-day",
    name: "Jetski — Full day",
    description:
      "Jetskis accompany the boat for the entire day. Amazing play time on the ocean with the safety of the boat nearby.",
    price: "6000.00",
    priceUnit: "flat" as const,
    selectionGroup: "jetski",
    allowQuantity: true,
    maxQuantity: 4,
    displayOrder: 4,
    isActive: true,
  },
  {
    slug: "catering",
    name: "Catering (breakfast + lunch)",
    description: "Full catering including breakfast and lunch for your charter.",
    price: "750.00",
    priceUnit: "per_person" as const,
    selectionGroup: null,
    displayOrder: 5,
    isActive: true,
  },
  {
    slug: "refreshments",
    name: "Refreshments",
    description:
      "A range of alcoholic refreshments on board for the entire day — beers, wines and coolers.",
    price: "1000.00",
    priceUnit: "per_person" as const,
    selectionGroup: null,
    displayOrder: 6,
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert packages — upsert on slug so content price/name changes sync to DB.
    for (const pkg of packagesToSeed) {
      await db
        .insert(schema.packages)
        .values(pkg)
        .onConflictDoUpdate({
          target: schema.packages.slug,
          set: {
            name: pkg.name,
            tagline: pkg.tagline,
            description: pkg.description,
            duration: pkg.duration,
            pricePerPerson: pkg.pricePerPerson,
            minGuests: pkg.minGuests,
            maxGuests: pkg.maxGuests,
            category: pkg.category,
            highlights: pkg.highlights,
            imageUrl: pkg.imageUrl,
            isActive: pkg.isActive,
            isFeatured: pkg.isFeatured,
            updatedAt: new Date(),
          },
        });
      console.log(`  ✓ Package: ${pkg.name}`);
    }

    // Insert default time slots (idempotent).
    const timeSlots = [
      { name: "Morning", startTime: "08:00", endTime: "12:00", isActive: true },
      { name: "Afternoon", startTime: "13:00", endTime: "17:00", isActive: true },
      { name: "Sunset", startTime: "17:00", endTime: "20:00", isActive: true },
    ];

    for (const slot of timeSlots) {
      await db.insert(schema.timeSlots).values(slot).onConflictDoNothing();
      console.log(`  ✓ Time slot: ${slot.name}`);
    }

    console.log("\n  Updating crew members...");
    await db.delete(schema.crewMembers);
    console.log("  ✓ Cleared existing crew");
    for (const member of crewMembersToSeed) {
      await db.insert(schema.crewMembers).values(member);
      console.log(`  ✓ Crew: ${member.name}`);
    }

    console.log("\n  Seeding package add-ons...");
    for (const addon of addonsToSeed) {
      await db.insert(schema.addons).values(addon).onConflictDoNothing();
      console.log(`  ✓ Add-on: ${addon.name}`);
    }

    console.log("\n✅ Seeding complete!");
    if (crewMembersToSeed.some((m) => m.imageUrl === null)) {
      console.log(
        "  ⚠️  Crew images are NULL — supply real owned photos in @/lib/content/crew.ts.",
      );
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
