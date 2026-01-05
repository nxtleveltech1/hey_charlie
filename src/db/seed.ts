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
    tagline: "Golden hour on the Atlantic",
    description: "Watch the sun melt into the Atlantic Ocean as you cruise along the stunning Cape Town coastline. Complimentary sparkling wine and canapés included.",
    duration: "2.5 hours",
    pricePerPerson: "850",
    minGuests: 2,
    maxGuests: 12,
    category: "relaxation",
    highlights: [
      "Sparkling wine & canapés",
      "Professional skipper",
      "Music & Bluetooth speakers",
      "Photo opportunities at iconic landmarks",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "whale-watching",
    name: "Whale Watching Safari",
    tagline: "Giants of the deep",
    description: "Witness the majestic Southern Right Whales and Humpbacks in their natural habitat. Peak season June–November with near-guaranteed sightings.",
    duration: "3 hours",
    pricePerPerson: "1200",
    minGuests: 2,
    maxGuests: 10,
    category: "wildlife",
    highlights: [
      "Marine biologist guide",
      "Whale sighting guarantee*",
      "Hot beverages & snacks",
      "Waterproof jackets provided",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "crayfish-experience",
    name: "Catch & Cook Crayfish",
    tagline: "Ocean to plate in hours",
    description: "Dive for your own West Coast rock lobster, then feast on the beach as our chef prepares your catch with local flavors. An authentic Cape experience.",
    duration: "Full day (8 hours)",
    pricePerPerson: "2800",
    minGuests: 2,
    maxGuests: 6,
    category: "culinary",
    highlights: [
      "Snorkeling gear provided",
      "Professional dive guide",
      "Beach-side cooking station",
      "All sides & drinks included",
      "Crayfish permit included",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "deep-sea-fishing",
    name: "Deep Sea Fishing",
    tagline: "Battle the big ones",
    description: "Target Yellowfin Tuna, Cape Snoek, and the legendary Cape Yellowtail with our experienced crew. All skill levels welcome.",
    duration: "6 hours",
    pricePerPerson: "1800",
    minGuests: 2,
    maxGuests: 8,
    category: "adventure",
    highlights: [
      "All tackle & bait included",
      "Experienced fishing crew",
      "Keep your catch",
      "Light lunch & drinks",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "beach-hopper",
    name: "Beach Hopper",
    tagline: "Discover hidden coves",
    description: "Explore Cape Town's most beautiful and secluded beaches, only accessible by boat. Swim, snorkel, and sunbathe in paradise.",
    duration: "5 hours",
    pricePerPerson: "1500",
    minGuests: 4,
    maxGuests: 10,
    category: "adventure",
    highlights: [
      "3 exclusive beach stops",
      "Snorkeling equipment",
      "Picnic lunch & refreshments",
      "Beach games & paddleboards",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "private-charter",
    name: "Private Charter",
    tagline: "Your ocean, your rules",
    description: "Exclusive use of Hey Charlie for your group. Customize your itinerary, catering, and experience. Perfect for celebrations.",
    duration: "Custom",
    pricePerPerson: "12000",
    minGuests: 6,
    maxGuests: 20,
    category: "relaxation",
    highlights: [
      "Up to 12 guests",
      "Fully customizable itinerary",
      "Premium catering options",
      "Dedicated crew & service",
      "Special occasion packages",
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "coastline-explorer",
    name: "Coastline Explorer",
    tagline: "The full Cape experience",
    description: "From the V&A Waterfront to Cape Point, cruise the entire False Bay coastline. See seals, penguins, and dramatic cliff faces.",
    duration: "Full day (7 hours)",
    pricePerPerson: "2200",
    minGuests: 4,
    maxGuests: 8,
    category: "adventure",
    highlights: [
      "Cape Point & Boulders Beach views",
      "Seal Island stop",
      "Gourmet lunch onboard",
      "Commentary & history",
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "seafood-feast",
    name: "Seafood Beach Feast",
    tagline: "Gourmet dining on the sand",
    description: "A curated five-course seafood experience served on a private beach. Fresh oysters, grilled linefish, and local delicacies under the stars.",
    duration: "4 hours",
    pricePerPerson: "3500",
    minGuests: 4,
    maxGuests: 12,
    category: "culinary",
    highlights: [
      "5-course tasting menu",
      "Wine pairing included",
      "Private chef & service",
      "Bonfire & live music",
      "Sunset cruise included",
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

