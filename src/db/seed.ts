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
 *    from the content module; crew photos are NOT seeded (no owned assets yet —
 *    in particular the missing justin-profer.png is never inserted) and are
 *    stored as NULL with a loud warning until real assets are supplied.
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
  // REQUIRED: real owned crew photo pending (do NOT seed the missing
  // justin-profer.png or any other unowned asset). NULL until supplied.
  imageUrl: member.image === CREW_IMAGE_REQUIRED ? null : member.image,
  isActive: member.active,
  displayOrder: member.order,
}));

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert packages (idempotent on slug).
    for (const pkg of packagesToSeed) {
      await db.insert(schema.packages).values(pkg).onConflictDoNothing();
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
