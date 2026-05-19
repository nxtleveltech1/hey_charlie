export interface Package {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  price: number;
  priceUnit: string;
  highlights: string[];
  image: string;
  category: "adventure" | "relaxation" | "culinary" | "wildlife";
  popular?: boolean;
  bestValue?: boolean;
}

const PACKAGE_IMAGES = {
  sundowner: "/images/sundown-cruise-hero.png",
  crayfish: "/images/catch-cook-crayfish.jpg",
  whale: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&h=600&fit=crop",
  beachHopper: "/images/clifton-beaches.jpg",
  seafoodFeast: "/images/seafood-feast.jpg",
  deepSeaFishing: "/images/Yellowfin Tuna Hunt.jpg",
  coastlineExplorer: "/images/cape point drop off.png",
  privateCharter: "/images/private-charter-guests.jpeg",
  sealIsland: "/images/seal-island.jpg",
};

const PACKAGE_IMAGE_BY_SLUG: Record<string, string> = {
  "sundowner-cruise": PACKAGE_IMAGES.sundowner,
  "crayfish-experience": PACKAGE_IMAGES.crayfish,
  "crayfish-catch-cook": PACKAGE_IMAGES.crayfish,
  "whale-watching": PACKAGE_IMAGES.whale,
  "whale-watching-expedition": PACKAGE_IMAGES.whale,
  "beach-hopper": PACKAGE_IMAGES.beachHopper,
  "beach-hopping-adventure": PACKAGE_IMAGES.beachHopper,
  "seafood-feast": PACKAGE_IMAGES.seafoodFeast,
  "seafood-beach-feast": PACKAGE_IMAGES.seafoodFeast,
  "deep-sea-fishing": PACKAGE_IMAGES.deepSeaFishing,
  "fishing-charter": PACKAGE_IMAGES.deepSeaFishing,
  "coastline-explorer": PACKAGE_IMAGES.coastlineExplorer,
  "coastline-crawler": PACKAGE_IMAGES.coastlineExplorer,
  "private-charter": PACKAGE_IMAGES.privateCharter,
  "private-celebration": PACKAGE_IMAGES.privateCharter,
  "seal-island": PACKAGE_IMAGES.sealIsland,
};

export const packages: Package[] = [
  {
    id: "sundowner-cruise",
    slug: "sundowner-cruise",
    name: "Sundowner Cruise",
    tagline: "Golden hour on the Atlantic",
    description:
      "Watch the sun melt into the Atlantic Ocean as you cruise along the stunning Cape Town coastline. Complimentary sparkling wine and canapés included.",
    duration: "2.5 hours",
    price: 850,
    priceUnit: "per person",
    highlights: [
      "Sparkling wine & canapés",
      "Professional skipper",
      "Music & Bluetooth speakers",
      "Photo opportunities at iconic landmarks",
    ],
    image: PACKAGE_IMAGES.sundowner,
    category: "relaxation",
    popular: true,
  },
  {
    id: "crayfish-experience",
    slug: "crayfish-experience",
    name: "Catch & Cook Crayfish",
    tagline: "Ocean to plate in hours",
    description:
      "Dive for your own West Coast rock lobster, then feast on the beach as our chef prepares your catch with local flavors. An authentic Cape experience.",
    duration: "Full day (8 hours)",
    price: 2800,
    priceUnit: "per person",
    highlights: [
      "Snorkeling gear provided",
      "Professional dive guide",
      "Beach-side cooking station",
      "All sides & drinks included",
      "Crayfish permit included",
    ],
    image: PACKAGE_IMAGES.crayfish,
    category: "culinary",
    bestValue: true,
  },
  {
    id: "whale-watching",
    slug: "whale-watching",
    name: "Whale Watching Safari",
    tagline: "Giants of the deep",
    description:
      "Witness the majestic Southern Right Whales and Humpbacks in their natural habitat. Peak season June–November with near-guaranteed sightings.",
    duration: "3 hours",
    price: 1200,
    priceUnit: "per person",
    highlights: [
      "Marine biologist guide",
      "Whale sighting guarantee*",
      "Hot beverages & snacks",
      "Waterproof jackets provided",
    ],
    image: PACKAGE_IMAGES.whale,
    category: "wildlife",
    popular: true,
  },
  {
    id: "beach-hopper",
    slug: "beach-hopper",
    name: "Beach Hopper",
    tagline: "Discover hidden coves",
    description:
      "Explore Cape Town's most beautiful and secluded beaches, only accessible by boat. Swim, snorkel, and sunbathe in paradise.",
    duration: "5 hours",
    price: 1500,
    priceUnit: "per person",
    highlights: [
      "3 exclusive beach stops",
      "Snorkeling equipment",
      "Picnic lunch & refreshments",
      "Beach games & paddleboards",
    ],
    image: PACKAGE_IMAGES.beachHopper,
    category: "adventure",
  },
  {
    id: "seafood-feast",
    slug: "seafood-feast",
    name: "Seafood Beach Feast",
    tagline: "Gourmet dining on the sand",
    description:
      "A curated five-course seafood experience served on a private beach. Fresh oysters, grilled linefish, and local delicacies under the stars.",
    duration: "4 hours",
    price: 3500,
    priceUnit: "per person",
    highlights: [
      "5-course tasting menu",
      "Wine pairing included",
      "Private chef & service",
      "Bonfire & live music",
      "Sunset cruise included",
    ],
    image: PACKAGE_IMAGES.seafoodFeast,
    category: "culinary",
  },
  {
    id: "deep-sea-fishing",
    slug: "deep-sea-fishing",
    name: "Deep Sea Fishing",
    tagline: "Battle the big ones",
    description:
      "Target Yellowfin Tuna, Cape Snoek, and the legendary Cape Yellowtail with our experienced crew. All skill levels welcome.",
    duration: "6 hours",
    price: 1800,
    priceUnit: "per person",
    highlights: [
      "All tackle & bait included",
      "Experienced fishing crew",
      "Keep your catch",
      "Light lunch & drinks",
    ],
    image: PACKAGE_IMAGES.deepSeaFishing,
    category: "adventure",
  },
  {
    id: "coastline-explorer",
    slug: "coastline-explorer",
    name: "Coastline Explorer",
    tagline: "The full Cape experience",
    description:
      "From the V&A Waterfront to Cape Point, cruise the entire False Bay coastline. See seals, penguins, and dramatic cliff faces.",
    duration: "Full day (7 hours)",
    price: 2200,
    priceUnit: "per person",
    highlights: [
      "Cape Point & Boulders Beach views",
      "Seal Island stop",
      "Gourmet lunch onboard",
      "Commentary & history",
    ],
    image: PACKAGE_IMAGES.coastlineExplorer,
    category: "adventure",
    popular: true,
  },
  {
    id: "private-charter",
    slug: "private-charter",
    name: "Private Charter",
    tagline: "Your ocean, your rules",
    description:
      "Exclusive use of Hey Charlie for your group. Customize your itinerary, catering, and experience. Perfect for celebrations.",
    duration: "Custom",
    price: 12000,
    priceUnit: "half day",
    highlights: [
      "Up to 12 guests",
      "Fully customizable itinerary",
      "Premium catering options",
      "Dedicated crew & service",
      "Special occasion packages",
    ],
    image: PACKAGE_IMAGES.privateCharter,
    category: "relaxation",
  },
  {
    id: "seal-island",
    slug: "seal-island",
    name: "Seal Island Tour",
    tagline: "Cape fur seals off Hout Bay",
    description:
      "Visit Duiker Island off Hout Bay, home to thousands of Cape fur seals sunning on the rocks and swimming around the boat.",
    duration: "1.5 hours",
    price: 450,
    priceUnit: "per person",
    highlights: [
      "Cape fur seal colony",
      "Wildlife photography",
      "Short Hout Bay trip",
      "Family-friendly route",
    ],
    image: PACKAGE_IMAGES.sealIsland,
    category: "wildlife",
  },
];

const DEFAULT_PACKAGE_IMAGE = PACKAGE_IMAGES.sundowner;

/** When DB `image_url` is null, use static catalog image by slug, then a generic ocean shot. */
export function getFallbackPackageImage(slug: string): string {
  const p = packages.find((x) => x.slug === slug);
  return p?.image ?? PACKAGE_IMAGE_BY_SLUG[slug] ?? DEFAULT_PACKAGE_IMAGE;
}

export const specialOffers = [
  {
    id: "summer-special",
    title: "Summer Sizzler",
    description: "Book any 2 experiences and get 15% off your total",
    validUntil: "March 31, 2026",
    code: "SUMMER15",
  },
  {
    id: "group-discount",
    title: "Squad Goals",
    description: "Groups of 8+ receive a complimentary bottle of champagne",
    validUntil: "Ongoing",
    code: "SQUAD8",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Book 30+ days in advance and save 10%",
    validUntil: "Ongoing",
    code: "EARLY10",
  },
];
