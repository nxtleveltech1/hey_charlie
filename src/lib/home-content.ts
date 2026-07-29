import { getActiveOffers } from "@/lib/content";
import { locations } from "@/lib/locations";

export type ExperienceIcon =
  | "sunset"
  | "whale"
  | "fishing"
  | "beach"
  | "crayfish"
  | "champagne";

export interface ExperienceCategory {
  name: string;
  icon: ExperienceIcon;
  count: string;
  href: string;
  image?: string;
}

export const experiences: ExperienceCategory[] = [
  {
    name: "Sundowner Cruises",
    icon: "sunset",
    count: "Daily departures",
    href: "/packages",
    image: "/images/sundown-cruise-hero.png",
  },
  {
    name: "Whale Watching",
    icon: "whale",
    count: "Jun–Nov season",
    href: "/booking/whale-watching",
    image: "/images/whale-watching.jpg",
  },
  {
    name: "Fishing Charters",
    icon: "fishing",
    count: "Year-round",
    href: "/booking/deep-sea-fishing",
    image: "/images/Yellowfin Tuna Hunt.jpg",
  },
  {
    name: "Beach Hopping",
    icon: "beach",
    count: "Atlantic coves",
    href: "/booking/beach-hopper",
    image: "/images/clifton-beaches.jpg",
  },
  {
    name: "Seafood Feasts",
    icon: "crayfish",
    count: "Beach braai & feasts",
    href: "/booking/seafood-beach-feast",
    image: "/images/seafood-feast.jpg",
  },
  {
    name: "Private Events",
    icon: "champagne",
    count: "Up to 12 guests",
    href: "/booking/private-celebration",
    image: "/images/private-charter-guests.jpeg",
  },
];

/**
 * Home destinations preview, sourced from the locations module — the same
 * module that backs /destinations/[slug] — so the homepage can never link to a
 * destination without a live route. Curated to locations with a local hero
 * image. Five items fill the destinations grid (one featured 2×2 + four cards).
 */
const HOME_DESTINATION_SLUGS = [
  "clifton-beaches",
  "camps-bay",
  "hout-bay",
  "llandudno",
  "cape-point",
] as const;

export const homeDestinations = HOME_DESTINATION_SLUGS.flatMap((slug) => {
  const dest = locations.find((d) => d.slug === slug);
  return dest
    ? {
        name: dest.name,
        description: dest.tagline,
        slug: dest.slug,
        image: dest.heroImage,
        category: dest.category,
      }
    : [];
});

/**
 * Active offers sourced from the content module so expired offers never render.
 * Legacy shape preserved for the offers carousel.
 */
export const specialOffers = getActiveOffers().map((o) => ({
  id: o.id,
  title: o.title,
  description: o.description,
  validUntil: o.validUntilDisplay,
  code: o.code,
}));

export const categoryLabels: Record<string, string> = {
  beach: "Beach",
  harbor: "Harbor",
  "marine-reserve": "Marine Reserve",
  landmark: "Landmark",
  "departure-hub": "Departure Hub",
};

