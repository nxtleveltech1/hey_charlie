import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const packagesToSeed = [
  {
    slug: "sundowner-cruise",
    name: "Sundowner Cruise",
    tagline: "Golden hour magic on the Atlantic",
    description: "Watch the sun dip below the horizon as you cruise along the stunning Cape Town coastline. Enjoy complimentary champagne and canapés while taking in views of Table Mountain bathed in golden light.",
    duration: "2.5 hours",
    pricePerPerson: "850",
    minGuests: 2,
    maxGuests: 12,
    category: "relaxation",
    highlights: [
      "Sunset views of Table Mountain",
      "Complimentary champagne & canapés",
      "Professional photography included",
      "Coastal wildlife spotting",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "whale-watching-expedition",
    name: "Whale Watching Expedition",
    tagline: "Witness giants of the deep",
    description: "Join us during whale season (June-November) for an unforgettable encounter with Southern Right whales, Humpbacks, and Bryde's whales. Our expert marine biologist guide ensures an educational and thrilling experience.",
    duration: "3 hours",
    pricePerPerson: "1200",
    minGuests: 2,
    maxGuests: 10,
    category: "wildlife",
    highlights: [
      "Expert marine biologist guide",
      "High success rate sightings",
      "Hydrophone for whale sounds",
      "Hot beverages included",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "crayfish-catch-cook",
    name: "Crayfish Catch & Cook",
    tagline: "From ocean to plate",
    description: "An authentic Cape Town experience! Dive for your own West Coast rock lobster (crayfish) in crystal-clear waters, then feast on your catch prepared by our onboard chef on a secluded beach.",
    duration: "5 hours",
    pricePerPerson: "2500",
    minGuests: 2,
    maxGuests: 6,
    category: "culinary",
    highlights: [
      "Guided crayfish diving",
      "All diving equipment provided",
      "Beach BBQ with sides & drinks",
      "Fishing permits included",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "fishing-charter",
    name: "Deep Sea Fishing Charter",
    tagline: "Reel in the big one",
    description: "Head out into the Atlantic for world-class deep sea fishing. Target Yellowtail, Snoek, Cape Salmon, and more. All equipment provided, and our experienced crew will help both beginners and seasoned anglers.",
    duration: "4 hours",
    pricePerPerson: "1500",
    minGuests: 2,
    maxGuests: 8,
    category: "fishing",
    highlights: [
      "Professional fishing gear",
      "Experienced fishing crew",
      "Keep your catch",
      "Snacks & drinks included",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "beach-hopping-adventure",
    name: "Beach Hopping Adventure",
    tagline: "Discover hidden coves",
    description: "Explore the Cape Peninsula's secret beaches accessible only by boat. Visit pristine coves, swim in turquoise waters, and enjoy a gourmet picnic on a private stretch of sand.",
    duration: "6 hours",
    pricePerPerson: "1800",
    minGuests: 4,
    maxGuests: 10,
    category: "adventure",
    highlights: [
      "3-4 secluded beaches",
      "Snorkeling equipment",
      "Gourmet picnic lunch",
      "SUP boards available",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "private-celebration",
    name: "Private Celebration Charter",
    tagline: "Your event, our ocean",
    description: "Make your special occasion unforgettable with a private charter. Perfect for birthdays, proposals, anniversaries, or corporate events. Fully customizable with catering and entertainment options.",
    duration: "4 hours",
    pricePerPerson: "2000",
    minGuests: 6,
    maxGuests: 20,
    category: "private",
    highlights: [
      "Exclusive boat hire",
      "Custom catering available",
      "Music system & decorations",
      "Photography package optional",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "coastline-crawler",
    name: "Coastline Crawler",
    tagline: "The ultimate coastal tour",
    description: "A leisurely cruise along the entire Cape Peninsula. From the V&A Waterfront to Cape Point and back, with stops for swimming, snorkeling, and a beach lunch.",
    duration: "Full day (8 hours)",
    pricePerPerson: "3500",
    minGuests: 4,
    maxGuests: 8,
    category: "adventure",
    highlights: [
      "Full Cape Peninsula tour",
      "Multiple swimming stops",
      "3-course beach lunch",
      "All refreshments included",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "seafood-beach-feast",
    name: "Seafood Beach Feast",
    tagline: "Fine dining on the shore",
    description: "A culinary journey featuring the freshest Cape Town seafood. Our chef prepares a multi-course meal on a private beach, paired with local wines. Pure indulgence.",
    duration: "4 hours",
    pricePerPerson: "2200",
    minGuests: 4,
    maxGuests: 12,
    category: "culinary",
    highlights: [
      "5-course seafood menu",
      "Local wine pairings",
      "Private beach setup",
      "Live music optional",
    ],
    isActive: true,
    isFeatured: false,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert packages
    for (const pkg of packagesToSeed) {
      await db.insert(schema.packages).values(pkg).onConflictDoNothing();
      console.log(`  ✓ Package: ${pkg.name}`);
    }

    // Insert default time slots
    const timeSlots = [
      { name: "Morning", startTime: "08:00", endTime: "12:00", isActive: true },
      { name: "Afternoon", startTime: "13:00", endTime: "17:00", isActive: true },
      { name: "Sunset", startTime: "17:00", endTime: "20:00", isActive: true },
    ];

    for (const slot of timeSlots) {
      await db.insert(schema.timeSlots).values(slot).onConflictDoNothing();
      console.log(`  ✓ Time slot: ${slot.name}`);
    }

    console.log("\n✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();

