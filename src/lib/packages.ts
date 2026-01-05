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
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
    category: "relaxation",
  },
];

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

