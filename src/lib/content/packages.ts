import { z } from "zod";
import { faqPairSchema } from "./faqs";

/**
 * Canonical package catalogue for Hey Charlie Charters.
 *
 * This module is the single source of truth for marketing package data.
 * `src/db/seed.ts` and the marketing layer import from here so the catalogue,
 * the database seed, and the website never drift.
 *
 * Copy rules: premium, Cape-Town-specific, confident, safety-aware.
 * No "magic", no "unforgettable", no "near-guaranteed", no guarantees.
 */

export const packageCategorySchema = z.enum([
  "sundowner",
  "private",
  "whale-watching",
  "fishing",
  "crayfish",
  "beach-hopping",
  "corporate",
  "coastal",
  "wildlife",
  "shipwreck",
  "event-support",
  "custom",
]);

export const priceUnitSchema = z.enum([
  "per person",
  "per charter",
  "per hour",
  "per half-day",
  "request",
]);

export const packageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  price: z.number(),
  priceUnit: priceUnitSchema,
  durationHours: z.number(),
  durationLabel: z.string(),
  minGuests: z.number(),
  maxGuests: z.number(),
  departurePoint: z.string(),
  bestSeason: z.string(),
  /** Months 1–12 when the experience is at its best. */
  seasonMonths: z.array(z.number().min(1).max(12)).optional(),
  seasonNote: z.string(),
  category: packageCategorySchema,
  bestFor: z.array(z.string()),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  highlights: z.array(z.string()),
  safetyNotes: z.array(z.string()),
  gallery: z.array(z.string()),
  heroImage: z.string(),
  featured: z.boolean(),
  popular: z.boolean(),
  bestValue: z.boolean(),
  /** Promoted/available during the Cape Town off-season (cooler months, ~May–Sep). */
  offSeason: z.boolean().default(false),
  /** Offered strictly "on request" — not a standard scheduled product. */
  byRequest: z.boolean().default(false),
  requiresPermit: z.boolean(),
  permitType: z.string().optional(),
  /** Reference key into the legal cancellation policies block. */
  cancellationPolicyRef: z.string(),
  faqs: z.array(faqPairSchema),
  relatedSlugs: z.array(z.string()),
});

export type PackageCategory = z.infer<typeof packageCategorySchema>;
export type PriceUnit = z.infer<typeof priceUnitSchema>;
export type Package = z.infer<typeof packageSchema>;

/** Local image assets keyed by slug. Keep these in sync with /public. */
export const PACKAGE_IMAGES = {
  sundowner: "/images/sundown-cruise-hero.png",
  crayfish: "/images/catch-cook-crayfish.jpg",
  whale: "/images/whale-watching.jpg",
  beachHopper: "/images/clifton-beaches.jpg",
  seafoodFeast: "/images/seafood-feast.jpg",
  deepSeaFishing: "/images/Yellowfin Tuna Hunt.jpg",
  coastlineExplorer: "/images/cape point drop off.png",
  privateCharter: "/images/private-charter-guests.jpeg",
  sealIsland: "/images/seal-island.jpg",
} as const;

const DEPARTURE = "V&A Waterfront, Cape Town";

// Typed as the schema INPUT so the optional/defaulted fields (offSeason,
// byRequest, seasonMonths, permitType) can be omitted on individual entries;
// the catalogue below is then parsed once so defaults are applied and the
// full Package shape is guaranteed at runtime.
const packageData: z.input<typeof packageSchema>[] = [
  {
    id: "sundowner-cruise",
    slug: "sundowner-cruise",
    name: "Atlantic Sundowner Cruise",
    tagline: "Golden hour on the Atlantic Seaboard",
    shortDescription:
      "A relaxed evening cruise past Clifton and Camps Bay as the sun sets over the Atlantic.",
    longDescription:
      "Cast off from the V&A Waterfront in the late afternoon and glide along the Atlantic Seaboard toward Clifton and Camps Bay. With the Twelve Apostles behind you and the sun dropping into the ocean ahead, this is the Cape Town skyline at its warmest. Sparkling wine and light canapés are served on board while the crew handles the sailing — you simply take in the view.",
    price: 850,
    priceUnit: "per person",
    durationHours: 2.5,
    durationLabel: "2.5 hours",
    minGuests: 2,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "September–April for the warmest evenings; spectacular year-round.",
    seasonMonths: [9, 10, 11, 12, 1, 2, 3, 4],
    seasonNote:
      "Sunset times vary through the year — departures are timed to golden hour, so winter trips leave earlier. Cruises run year-round, including the cooler off-season months.",
    category: "sundowner",
    offSeason: true,
    bestFor: ["Couples", "Small groups", "First-time visitors", "Photographers"],
    inclusions: [
      "Sparkling wine & canapés",
      "Licensed skipper and crew",
      "Soft drinks & water",
      "Bluetooth sound system",
      "Safety briefing and life jackets",
    ],
    exclusions: ["Hotel transfers", "Additional catering on request"],
    highlights: [
      "Clifton & Camps Bay from the water",
      "Twelve Apostles mountain backdrop",
      "Sparkling wine & canapés",
      "Golden-hour photography",
    ],
    safetyNotes: [
      "Trip runs in calm conditions; the skipper may reroute or reschedule for wind and sea state.",
    ],
    gallery: [PACKAGE_IMAGES.sundowner],
    heroImage: PACKAGE_IMAGES.sundowner,
    featured: true,
    popular: true,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "What time do we depart?",
        a: "Departure shifts with sunset — you will receive the exact meeting time in your confirmation.",
      },
      {
        q: "Is it cold on the water?",
        a: "It is usually a few degrees cooler offshore. Bring a warm layer and a windbreaker.",
      },
    ],
    relatedSlugs: ["private-charter", "coastline-explorer", "seal-island"],
  },
  {
    id: "crayfish-experience",
    slug: "crayfish-experience",
    name: "Catch & Cook Crayfish",
    tagline: "Dive for West Coast rock lobster, then feast on the shore",
    shortDescription:
      "A guided snorkel dive for crayfish in season, followed by a beach-side braai of your catch.",
    longDescription:
      "Head out with a dive guide to freedive for West Coast rock lobster (kreef) during the recreational season. We provide the snorkel gear, the guidance, and the required recreational permit arrangement. After the dive we find a sheltered stretch of coast and cook your catch over coals with fresh sides — a proper Cape beach feast. This is hands-on, weather-dependent and run in small groups for safety.",
    price: 2800,
    priceUnit: "per person",
    durationHours: 8,
    durationLabel: "Full day (8 hours)",
    minGuests: 2,
    maxGuests: 6,
    departurePoint: DEPARTURE,
    bestSeason: "Crayfish season opens mid-November and runs to April — see season note.",
    seasonMonths: [11, 12, 1, 2, 3, 4],
    seasonNote:
      "Strictly within the DAFF recreational crayfish season and daily bag limits. Outside the open season this trip is unavailable.",
    category: "crayfish",
    bestFor: ["Adventurous eaters", "Small groups", "Experienced snorkellers"],
    inclusions: [
      "Snorkel & dive gear",
      "Professional dive guide",
      "Beach-side cooking station & coals",
      "Sides, bread and soft drinks",
      "Recreational crayfish permit arrangement (in season)",
    ],
    exclusions: ["Wetsuit hire (available on request)", "Alcohol", "Transfers"],
    highlights: [
      "Freedive for your own crayfish",
      "Beach braai of your catch",
      "Small group, hands-on guidance",
    ],
    safetyNotes: [
      "You must be a confident swimmer and comfortable snorkelling. Conditions determine whether diving is safe on the day.",
      "Size and bag limits are strictly observed; undersized or berried crayfish are returned.",
    ],
    gallery: [PACKAGE_IMAGES.crayfish],
    heroImage: PACKAGE_IMAGES.crayfish,
    featured: true,
    popular: false,
    bestValue: true,
    requiresPermit: true,
    permitType: "DAFF recreational crayfish (rock lobster) permit",
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Do I need my own permit?",
        a: "The recreational crayfish permit arrangement is included in season. You will need to bring photo ID.",
      },
      {
        q: "What if I have never freedived?",
        a: "Basic snorkelling confidence is required. The guide coaches you, but this is best for comfortable swimmers.",
      },
    ],
    relatedSlugs: ["deep-sea-fishing", "seafood-feast", "private-charter"],
  },
  {
    id: "whale-watching",
    slug: "whale-watching",
    name: "Whale Watching",
    tagline: "Southern Right and Humpback whales in season",
    shortDescription:
      "A dedicated whale-watching run along the peninsula during the June–November season.",
    longDescription:
      "Between roughly June and November, Southern Right whales arrive to calve in the sheltered bays of the Cape Peninsula, and Humpbacks pass through on their migration. We run respectful, distance-aware approaches in line with responsible viewing guidelines, with the crew sharing what we are seeing along the way. Sightings are never guaranteed — they are wild animals — but we plan the route around the latest reported activity to give you the best chance.",
    price: 1200,
    priceUnit: "per person",
    durationHours: 3,
    durationLabel: "3 hours",
    minGuests: 2,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "June–November is peak Southern Right season.",
    seasonMonths: [6, 7, 8, 9, 10, 11],
    seasonNote:
      "Whale season (June–November) falls in the Cape Town off-season, making this a flagship winter experience. Outside the season we recommend coastal or wildlife trips instead.",
    category: "whale-watching",
    offSeason: true,
    bestFor: ["Wildlife lovers", "Families", "Photographers"],
    inclusions: [
      "Licensed skipper and knowledgeable crew",
      "Hot beverages & light snacks",
      "Waterproof jackets on request",
      "On-board binoculars",
    ],
    exclusions: ["Transfers", "Additional catering"],
    highlights: [
      "Southern Right & Humpback whales in season",
      "Responsible, distance-aware approaches",
      "Boulders penguins and seals often on the route",
      "Crew commentary on marine life",
    ],
    safetyNotes: [
      "We follow responsible whale-watching distances and approach rules. Sea conditions must be suitable to run.",
    ],
    gallery: [PACKAGE_IMAGES.whale],
    heroImage: PACKAGE_IMAGES.whale,
    featured: true,
    popular: true,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Will we definitely see whales?",
        a: "No — they are wild animals and we never guarantee sightings. June–November offers the best chance, and we route around current activity.",
      },
      {
        q: "Is this suitable for children?",
        a: "Yes, with appropriately sized life jackets. Let us know ages when booking.",
      },
    ],
    relatedSlugs: ["coastline-explorer", "seal-island", "private-charter"],
  },
  {
    id: "beach-hopper",
    slug: "beach-hopper",
    name: "Beach Hopper",
    tagline: "Atlantic coves and sheltered swim stops",
    shortDescription:
      "A half-day hopping between sheltered Atlantic beaches and swim stops reachable only by boat.",
    longDescription:
      "Spend a half-day exploring the Atlantic Seaboard's quieter corners — beaches and coves that are far easier to reach by water than by road. We anchor in sheltered bays for swimming and snorkelling in the clear, cold Atlantic water, with a picnic lunch and refreshments on board. Routes flex with the wind to keep you in the calmest water.",
    price: 1500,
    priceUnit: "per person",
    durationHours: 5,
    durationLabel: "5 hours",
    minGuests: 4,
    maxGuests: 10,
    departurePoint: DEPARTURE,
    bestSeason: "October–April for warm, calm days.",
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    seasonNote:
      "Best on low-wind days; routes are chosen for shelter. Also offered year-round on calm winter days for beach viewing and coastal scenery.",
    category: "beach-hopping",
    offSeason: true,
    bestFor: ["Families", "Small groups", "Swimmers", "Sun-seekers"],
    inclusions: [
      "Snorkel equipment",
      "Picnic lunch & refreshments",
      "Stand-up paddleboards",
      "Licensed skipper and crew",
    ],
    exclusions: ["Wetsuit hire", "Transfers"],
    highlights: [
      "Sheltered swim & snorkel stops",
      "Coves reachable mainly by boat",
      "Picnic lunch on board",
      "Paddleboards & beach games",
    ],
    safetyNotes: [
      "Swim stops depend on conditions; the skipper chooses the calmest, safest bays on the day.",
    ],
    gallery: [PACKAGE_IMAGES.beachHopper],
    heroImage: PACKAGE_IMAGES.beachHopper,
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Is the water cold?",
        a: "The Atlantic is brisk — roughly 13–17°C. A wetsuit helps for longer swims; we can arrange hire.",
      },
    ],
    relatedSlugs: ["sundowner-cruise", "coastline-explorer", "private-charter"],
  },
  {
    id: "seafood-feast",
    slug: "seafood-feast",
    name: "Seafood Beach Feast",
    tagline: "A private chef seafood spread on a secluded shore",
    shortDescription:
      "A curated multi-course seafood experience prepared by a private chef on a sheltered stretch of coast.",
    longDescription:
      "An exclusive beach dining experience: a private chef prepares a multi-course seafood spread — fresh oysters, grilled linefish and local seasonal favourites — served on a sheltered stretch of coast reachable by boat. Pair it with a sunset cruise on the way out or back. Pricing scales with the menu and group size, so we confirm the final per-group quote at booking.",
    price: 3500,
    priceUnit: "per person",
    durationHours: 4,
    durationLabel: "4 hours",
    minGuests: 4,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "October–April for warm evenings; available year-round weather permitting.",
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    seasonNote: "Final menu and per-group price are confirmed at booking.",
    category: "private",
    bestFor: ["Celebrations", "Couples", "Small private groups"],
    inclusions: [
      "Multi-course chef-prepared seafood menu",
      "Private chef & service",
      "Sunset cruise component",
      "Soft drinks & water",
    ],
    exclusions: ["Alcohol (available on request)", "Wine pairing (optional add-on)", "Transfers"],
    highlights: [
      "Private chef seafood menu",
      "Secluded shore reachable by boat",
      "Sunset cruise component",
      "Tailored to your group",
    ],
    safetyNotes: [
      "Beach landing and dining depend on tide and swell; the crew selects a safe, accessible spot.",
    ],
    gallery: [PACKAGE_IMAGES.seafoodFeast],
    heroImage: PACKAGE_IMAGES.seafoodFeast,
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Can the menu be customised?",
        a: "Yes — tell us dietary requirements and preferences and the chef tailors the menu. Final per-group pricing is confirmed at booking.",
      },
    ],
    relatedSlugs: ["crayfish-experience", "sundowner-cruise", "private-charter"],
  },
  {
    id: "deep-sea-fishing",
    slug: "deep-sea-fishing",
    name: "Deep-Sea Fishing",
    tagline: "Yellowfin tuna, yellowtail and snoek offshore",
    shortDescription:
      "A full day of offshore sport fishing for tuna, yellowtail and snoek with experienced crew.",
    longDescription:
      "Steam out past Cape Point into the productive waters where the cold Benguela and warm Agulhas currents meet. Target Yellowfin tuna, Cape yellowtail and snoek depending on the season and what is running. All bait, tackle and deckhand support are provided, and you keep your catch within daily bag limits. This is an offshore trip — expect a longer day and potentially punchier conditions than our coastal cruises.",
    price: 1800,
    priceUnit: "per person",
    durationHours: 6,
    durationLabel: "6 hours",
    minGuests: 2,
    maxGuests: 8,
    departurePoint: DEPARTURE,
    bestSeason: "Yellowfin tuna runs are typically late summer–autumn; yellowtail and snoek year-round.",
    seasonMonths: [1, 2, 3, 4, 5, 10, 11, 12],
    seasonNote:
      "Target species depend on what is running; recreational limits and permits apply. Off-season (cooler months) fishing is offered by request only, subject to conditions and what is running.",
    category: "fishing",
    offSeason: true,
    byRequest: true,
    bestFor: ["Anglers", "Adventurous groups", "Experienced fishers"],
    inclusions: [
      "All rods, reels, bait & tackle",
      "Experienced fishing skipper and deckhand",
      "Light lunch & drinks",
      "Keep your catch (within daily bag limits)",
    ],
    exclusions: ["Recreational fishing permit (see permit requirement)", "Fish cleaning / packing"],
    highlights: [
      "Yellowfin tuna, yellowtail & snoek",
      "All tackle and bait included",
      "Offshore waters off Cape Point",
      "Experienced fishing crew",
    ],
    safetyNotes: [
      "This is an exposed offshore trip. If you are prone to seasickness, take a remedy beforehand. The skipper will not run in unsafe sea states.",
    ],
    gallery: [PACKAGE_IMAGES.deepSeaFishing],
    heroImage: PACKAGE_IMAGES.deepSeaFishing,
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: true,
    permitType: "DAFF recreational fishing permit",
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Do I need a fishing permit?",
        a: "Yes — a valid DAFF recreational fishing permit is required for each angler. We can advise on where to obtain one; please arrange it before the trip.",
      },
      {
        q: "Can beginners join?",
        a: "Yes. The crew rigs and coaches, though this is a long offshore day best suited to people who enjoy fishing.",
      },
    ],
    relatedSlugs: ["crayfish-experience", "coastline-explorer", "private-charter"],
  },
  {
    id: "coastline-explorer",
    slug: "coastline-explorer",
    name: "Coastline Explorer",
    tagline: "V&A to Cape Point — the full peninsula",
    shortDescription:
      "A full day along the peninsula: seals, penguins, dramatic cliffs and (in season) whales.",
    longDescription:
      "The big one. From the V&A Waterfront we run the length of the peninsula — past Clifton and Camps Bay, around to Hout Bay and the seal colony at Duiker Island, then down toward Simon's Town, Boulders and the cliffs of Cape Point. It is a full, varied day of scenery and wildlife with a gourmet lunch on board and commentary on the history and marine life of the coast. In whale season (June–November) we route around the latest sightings.",
    price: 2200,
    priceUnit: "per person",
    durationHours: 7,
    durationLabel: "Full day (7 hours)",
    minGuests: 4,
    maxGuests: 8,
    departurePoint: DEPARTURE,
    bestSeason: "October–April for calmer seas; June–November adds whales.",
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    seasonNote:
      "Cape Point rounding depends on sea state; the skipper may adjust the route. Runs year-round, weather permitting — the winter coastline is at its most dramatic.",
    category: "coastal",
    offSeason: true,
    bestFor: ["First-time visitors", "Photographers", "Wildlife lovers", "Day-trippers"],
    inclusions: [
      "Gourmet lunch on board",
      "Drinks & refreshments",
      "Crew commentary on history & marine life",
      "Stops at seal colony & penguin vantage points",
    ],
    exclusions: ["Transfers", "Additional catering"],
    highlights: [
      "Full peninsula from V&A to Cape Point",
      "Seal colony at Duiker Island",
      "Boulders penguin vantage",
      "Gourmet lunch on board",
    ],
    safetyNotes: [
      "A full-day, long-range trip. Conditions around Cape Point can be rough — the skipper adjusts or shortens the route for safety.",
    ],
    gallery: [PACKAGE_IMAGES.coastlineExplorer],
    heroImage: PACKAGE_IMAGES.coastlineExplorer,
    featured: true,
    popular: true,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Do we go all the way to Cape Point?",
        a: "We aim to, but the final rounding depends on sea state. The skipper makes the call on the day for safety.",
      },
    ],
    relatedSlugs: ["whale-watching", "seal-island", "sundowner-cruise"],
  },
  {
    id: "private-charter",
    slug: "private-charter",
    name: "Private Charter",
    tagline: "Exclusive use of Hey Charlie, your itinerary",
    shortDescription:
      "The whole boat, your group of up to 12, and a route built around what you want.",
    longDescription:
      "Exclusive use of Hey Charlie for your group of up to 12 guests. Build the day around you — a sunset cruise, a swim-hop along the Atlantic, a wildlife run, or a celebration with catering and drinks. The base rate covers a half-day with a dedicated skipper and crew; we tailor catering, route and timings to the occasion. Tell us what you are celebrating and we shape the trip.",
    price: 12000,
    priceUnit: "per half-day",
    durationHours: 4,
    durationLabel: "Half day (custom)",
    minGuests: 2,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "Year-round, weather permitting.",
    seasonNote:
      "Route and duration are tailored; full-day options available on request. Available year-round, including the off-season, for private functions and events.",
    category: "private",
    offSeason: true,
    bestFor: ["Celebrations", "Corporate groups", "Families", "Special occasions"],
    inclusions: [
      "Exclusive use of the boat",
      "Dedicated skipper and crew",
      "Up to 12 guests",
      "Tailored route & timing",
      "Drinks & water",
    ],
    exclusions: ["Premium catering & bar (available on request)", "Transfers", "Specialist permits"],
    highlights: [
      "Exclusive use for up to 12 guests",
      "Fully tailored itinerary",
      "Premium catering options",
      "Dedicated crew",
    ],
    safetyNotes: [
      "Final route is confirmed with the skipper based on conditions and your group's preferences.",
    ],
    gallery: [PACKAGE_IMAGES.privateCharter],
    heroImage: PACKAGE_IMAGES.privateCharter,
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "How many guests can join?",
        a: "Up to 12 guests for exclusive use of the boat.",
      },
      {
        q: "Can we extend to a full day?",
        a: "Yes — full-day and custom itineraries are available on request and quoted per trip.",
      },
    ],
    relatedSlugs: ["sundowner-cruise", "seafood-feast", "coastline-explorer"],
  },
  {
    id: "seal-island",
    slug: "seal-island",
    name: "Seal Island Tour",
    tagline: "Cape fur seals at Duiker Island",
    shortDescription:
      "A short, family-friendly run to the Cape fur seal colony at Duiker Island off Hout Bay.",
    longDescription:
      "A shorter trip ideal for families and first-timers: we cruise to Duiker Island off Hout Bay, home to a large resident colony of Cape fur seals. You will see them hauled out on the rocks and porpoising around the boat, with the Sentinel and Chapman's Peak as backdrop. The crew shares context on the colony and the coast along the way. A great intro to the Atlantic side in a compact outing.",
    price: 450,
    priceUnit: "per person",
    durationHours: 1.5,
    durationLabel: "1.5 hours",
    minGuests: 2,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "Year-round; seals are resident.",
    seasonNote: "A good option on days when longer offshore trips are not advisable.",
    category: "wildlife",
    bestFor: ["Families", "First-time visitors", "Photographers", "Short on time"],
    inclusions: [
      "Licensed skipper and crew",
      "Crew commentary",
      "Drinks & water",
      "Close-up seal viewing",
    ],
    exclusions: ["Transfers", "Additional catering"],
    highlights: [
      "Cape fur seal colony at Duiker Island",
      "Sentinel & Chapman's Peak backdrop",
      "Short, family-friendly outing",
      "Great for photography",
    ],
    safetyNotes: [
      "We keep a respectful distance from the colony and only land where permitted.",
    ],
    gallery: [PACKAGE_IMAGES.sealIsland],
    heroImage: PACKAGE_IMAGES.sealIsland,
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Is this good for kids?",
        a: "Yes — it is a short, sheltered trip and one of our most family-friendly options.",
      },
    ],
    relatedSlugs: ["coastline-explorer", "whale-watching", "sundowner-cruise"],
  },
  {
    id: "shipwreck-tour",
    slug: "shipwreck-tour",
    name: "Shipwreck Coastline Tour",
    tagline: "The 'Cape of Storms' — a boat-based heritage tour of the wreck coast",
    shortDescription:
      "A coastal-viewing tour along the wrecks and wild shoreline of the Cape Peninsula, framed by centuries of maritime history.",
    longDescription:
      "The sea off the Cape Peninsula earned its old name — the Cape of Storms — for good reason. On this coastal heritage run we trace the shoreline where well-documented vessels came to grief, including the wreck of the SS Maori (lost near Hout Bay in 1909) and the cluster of wrecks along the Cape Point and Cape of Good Hope coast, among them the Thomas T Tucker and the Nolloth. We approach by boat for a viewing-and-commentary angle you cannot get from the road, with the crew sharing the history of each site. This is a weather-dependent tour: winter swells make the coastline dramatic, but conditions decide whether we can run and how close we can safely get. Where the route enters the marine protected area near Cape Point, the relevant conditions and any required permits apply.",
    price: 1500,
    priceUnit: "per person",
    durationHours: 3,
    durationLabel: "Half day (~3 hours)",
    minGuests: 2,
    maxGuests: 12,
    departurePoint: DEPARTURE,
    bestSeason: "Year-round, weather permitting — dramatic in winter swells.",
    seasonNote:
      "Run as a custom, weather-dependent tour. Winter (May–September) brings the biggest swell and the most dramatic coastline; departures are confirmed on the day based on sea state. From R1,500 per person — final rate confirmed for your date and group size.",
    category: "shipwreck",
    offSeason: true,
    bestFor: ["History enthusiasts", "Photographers", "Private groups", "Off-season explorers"],
    inclusions: [
      "Licensed skipper and crew",
      "On-board commentary on the wrecks and maritime history",
      "Drinks & water",
      "Safety briefing and life jackets",
    ],
    exclusions: [
      "Transfers",
      "Diving or wreck penetration (not offered)",
      "Additional catering on request",
    ],
    highlights: [
      "Boat-based view of the Cape of Storms coastline",
      "Wreck of the SS Maori area off Hout Bay",
      "Cape Point / Cape of Good Hope wreck cluster",
      "Crew commentary on the peninsula's maritime history",
    ],
    safetyNotes: [
      "This is a coastal viewing tour from the vessel — not a dive. We do not enter or penetrate wrecks.",
      "Conditions around Cape Point and Hout Bay can turn quickly; the skipper may reroute, shorten, or reschedule for safety.",
      "Where the route passes through the marine protected area near Cape Point, the applicable conditions and any required permits apply.",
    ],
    gallery: [],
    heroImage: "/images/cape point drop off.png",
    featured: false,
    popular: true,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Do we dive on the wrecks?",
        a: "No — this is a boat-based coastal viewing and heritage tour. We do not offer wreck diving or entry.",
      },
      {
        q: "What will we actually see?",
        a: "We view the coastline and wreck sites from the water where it is safe to do so, with crew commentary on each wreck's history. Visibility of wreckage above or below the waterline depends on conditions and tide.",
      },
      {
        q: "Is this weather dependent?",
        a: "Very. The wreck coast is exposed, and winter swells are part of what makes it dramatic. The skipper confirms the route on the day and may adjust for sea state.",
      },
    ],
    relatedSlugs: ["coastline-explorer", "private-charter", "beach-hopper"],
  },
  {
    id: "mobile-refreshment-station",
    slug: "mobile-refreshment-station",
    name: "Mobile Refreshments & Beach Base",
    tagline: "Shore-side hospitality support for jetski tours and beach events",
    shortDescription:
      "A shore-based support service: mobile refreshments plus a sheltered dry changing and rest station, run alongside jetski tours and beach or cliff events.",
    longDescription:
      "This is a shore-side hospitality service, not a boat charter. We set up a mobile refreshments and base station on the beach or at a coastal event site — providing drinks and light refreshments, a shaded dry area for changing and drying off, seating to rest between sessions, and a tidy handover with waste removed at the end. It is designed to partner with jetski tour operators and beach, cliff or coastal events: we look after your guests on land while the watercraft activity is run by the partner operator. The setup is mobile and configured to your event, group size and location. Quote on request.",
    price: 650,
    priceUnit: "per person",
    durationHours: 4,
    durationLabel: "Per event / from 4 hours",
    minGuests: 1,
    maxGuests: 50,
    departurePoint: "By arrangement (mobile — shore-based, not a boat charter)",
    bestSeason: "Year-round, by arrangement.",
    seasonNote:
      "Offered as a partner service to jetski tour operators and beach or coastal events. From R650 per person depending on group size, setup and catering level.",
    category: "event-support",
    offSeason: true,
    byRequest: true,
    bestFor: [
      "Jetski tour operators",
      "Beach event organisers",
      "Film & production crews",
      "Private beach days",
    ],
    inclusions: [
      "Mobile refreshments (drinks and light catering, tailored to the event)",
      "Sheltered, shaded dry changing and drying area",
      "Seating and rest station for guests",
      "Setup and pack-down, with waste removed on handover",
    ],
    exclusions: [
      "Jetskis and watercraft (provided by the partner operator — not included)",
      "On-water supervision or lifeguarding (the operator's responsibility)",
      "Transfers",
    ],
    highlights: [
      "Shore-side hospitality, not a boat charter",
      "Sheltered dry changing and rest base",
      "Tailored refreshments for your event",
      "Clean handover with waste removed",
    ],
    safetyNotes: [
      "This is a land-based hospitality service. All on-water activity and its supervision remain the responsibility of the partner jetski or watercraft operator.",
      "Setup location is confirmed with you in advance; access to some public beaches may require local authority permission (see permit note).",
    ],
    gallery: [],
    heroImage: "REQUIRED-ASSET: mobile-refreshment-station image",
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: true,
    permitType: "Local authority event / refreshment permit (REQUIRED — verified: false)",
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "Are the jetskis included?",
        a: "No. We provide the shore-side refreshments and dry base. The jetskis, watercraft and their on-water supervision come from the partner tour operator and are booked separately through them.",
      },
      {
        q: "Where do you set up?",
        a: "The base is mobile. We agree the location with you in advance based on your event and the operator's launch point; access to some public beaches may require local authority permission.",
      },
      {
        q: "How many guests can it serve?",
        a: "From small private groups up to event-scale gatherings. We scale the refreshments and shelter to your group size — tell us the numbers and we quote accordingly.",
      },
    ],
    relatedSlugs: ["private-charter", "custom-services"],
  },
  {
    id: "custom-services",
    slug: "custom-services",
    name: "Custom & Bespoke Charters",
    tagline: "If it's not listed, ask — we build the trip to your brief",
    shortDescription:
      "A catch-all for anything we don't list: proposals, film and photography boats, ash scatterings and memorials, specialised fishing, research support and logistics.",
    longDescription:
      "Have something in mind that isn't on the menu? Tell us what you need and the crew will build it. Custom and bespoke charters cover the requests that don't fit a standard product — a proposal or celebration on the water, a stable platform for film and photography crews, ash scatterings and memorial trips handled with care, specialised or targeted fishing, marine-research support, and marine logistics. Everything is planned around your brief, the conditions on the day, and the relevant permits. Share the details and we will scope it, quote it, and confirm what is possible.",
    price: 2500,
    priceUnit: "per person",
    durationHours: 6,
    durationLabel: "Tailored to you (from ~6 hours)",
    minGuests: 1,
    maxGuests: 20,
    departurePoint: DEPARTURE,
    bestSeason: "Year-round, subject to conditions.",
    seasonNote:
      "Available year-round and into the off-season. From R2,500 per person — final quote depends on duration, crew, catering and permits for your brief.",
    category: "custom",
    offSeason: true,
    byRequest: true,
    bestFor: [
      "Bespoke requests",
      "Productions & film crews",
      "Special occasions",
      "Marine research",
      "Logistics",
    ],
    inclusions: [
      "Dedicated skipper and crew",
      "Vessel use tailored to your brief",
      "Route, timing and equipment planned to the request",
      "Drinks & water",
    ],
    exclusions: [
      "Specialist permits or permissions (assessed per enquiry)",
      "Bespoke catering and equipment hire (quoted separately)",
      "Transfers",
    ],
    highlights: [
      "Built around your brief, not a fixed itinerary",
      "Stable platform for film, photography and research",
      "Sensitive occasions handled with care",
      "Clear scoping and quoting up front",
    ],
    safetyNotes: [
      "Every bespoke trip is planned and risk-assessed against the conditions and the specific request. The skipper confirms feasibility and any required permits before we commit.",
      "Some bespoke requests may require specialist permits or permissions; these are identified and arranged (or flagged) during scoping rather than assumed.",
    ],
    gallery: [],
    heroImage: "/images/private-charter-guests.jpeg",
    featured: false,
    popular: false,
    bestValue: false,
    requiresPermit: false,
    cancellationPolicyRef: "standard",
    faqs: [
      {
        q: "How do I request a custom charter?",
        a: "Send us the details — what you want to do, the date(s), guest numbers and any special requirements. We scope it, confirm what is possible, and send a quote.",
      },
      {
        q: "How much lead time do you need?",
        a: "It depends on the request. Simple bespoke trips can often be arranged on short notice; anything needing permits, specialist crew or equipment benefits from more lead time — we will tell you up front.",
      },
      {
        q: "How is it priced?",
        a: "Custom charters are quoted per brief based on duration, vessel use, crew, catering and any permits or hire. There is no fixed rate — we send a clear quote before you commit.",
      },
    ],
    relatedSlugs: ["private-charter", "deep-sea-fishing", "shipwreck-tour"],
  },
];

/** All packages, validated against the schema (defaults applied). */
const packages: Package[] = packageData.map((p) => packageSchema.parse(p));

/** All packages, in catalogue order. */
export function getPackages(): Package[] {
  return packages;
}

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getPackageById(id: string): Package | undefined {
  return packages.find((p) => p.id === id);
}

/** Packages flagged for the featured / spotlight section. */
export function getFeaturedPackages(): Package[] {
  return packages.filter((p) => p.featured);
}

export function getRelatedPackages(slug: string): Package[] {
  const pkg = getPackageBySlug(slug);
  if (!pkg) return [];
  return pkg.relatedSlugs
    .map((s) => getPackageBySlug(s))
    .filter((p): p is Package => Boolean(p));
}

export function getPackagesByCategory(category: PackageCategory): Package[] {
  return packages.filter((p) => p.category === category);
}

/**
 * Off-season services: packages promoted/available during the Cape Town
 * off-season (cooler months, ~May–Sep). Whale-watching and the shipwreck tour
 * lead as off-season flagships; the remainder follow in stable catalogue order.
 */
export function getOffSeasonServices(): Package[] {
  const priority = (slug: string): number => {
    if (slug === "whale-watching") return 0;
    if (slug === "shipwreck-tour") return 1;
    return 2;
  };
  return packages
    .filter((p) => p.offSeason)
    .sort((a, b) => priority(a.slug) - priority(b.slug));
}

/** Human-readable labels for every package category, including off-season ones. */
export const packageCategoryLabels: Record<PackageCategory, string> = {
  sundowner: "Sundowner Cruises",
  private: "Private Charters",
  "whale-watching": "Whale Watching",
  fishing: "Fishing",
  crayfish: "Crayfish & Culinary",
  "beach-hopping": "Beach Hopping",
  corporate: "Corporate & Events",
  coastal: "Coastal Cruises",
  wildlife: "Wildlife",
  shipwreck: "Shipwreck Tours",
  "event-support": "Event Support",
  custom: "Custom & Bespoke",
};

/** Real slugs → local fallback hero images. The 7 phantom aliases were removed. */
export const PACKAGE_IMAGE_BY_SLUG: Record<string, string> = {
  "sundowner-cruise": PACKAGE_IMAGES.sundowner,
  "crayfish-experience": PACKAGE_IMAGES.crayfish,
  "whale-watching": PACKAGE_IMAGES.whale,
  "beach-hopper": PACKAGE_IMAGES.beachHopper,
  "seafood-feast": PACKAGE_IMAGES.seafoodFeast,
  "deep-sea-fishing": PACKAGE_IMAGES.deepSeaFishing,
  "coastline-explorer": PACKAGE_IMAGES.coastlineExplorer,
  "private-charter": PACKAGE_IMAGES.privateCharter,
  "seal-island": PACKAGE_IMAGES.sealIsland,
  "shipwreck-tour": "/images/cape point drop off.png",
  "mobile-refreshment-station": "/images/private-charter-guests.jpeg",
  "custom-services": "/images/private-charter-guests.jpeg",
};

const DEFAULT_PACKAGE_IMAGE = PACKAGE_IMAGES.sundowner;

/** Placeholder sentinel in content — never pass to next/image. */
export function isValidPackageImage(
  src: string | null | undefined,
): src is string {
  return !!src && src.length > 0 && !src.startsWith("REQUIRED-ASSET");
}

/** DB imageUrl when set, otherwise catalogue → slug map → default. */
export function resolvePackageImageUrl(
  imageUrl: string | null | undefined,
  slug: string,
): string {
  if (isValidPackageImage(imageUrl)) return imageUrl;
  return getFallbackPackageImage(slug);
}

/** Resolve a fallback hero image for a slug: catalogue → slug map → default. */
export function getFallbackPackageImage(slug: string): string {
  const pkg = getPackageBySlug(slug);
  if (isValidPackageImage(pkg?.heroImage)) return pkg.heroImage;
  return PACKAGE_IMAGE_BY_SLUG[slug] ?? DEFAULT_PACKAGE_IMAGE;
}

export { packages as packageCatalogue };
