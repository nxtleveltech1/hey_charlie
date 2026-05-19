import { locations } from "@/lib/locations";
import { specialOffers } from "@/lib/packages";

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
    image: "/images/seal-island.jpg",
  },
  {
    name: "Fishing Charters",
    icon: "fishing",
    count: "Year-round",
    href: "/booking/deep-sea-fishing",
    image: "/images/catch-cook-crayfish.jpg",
  },
  {
    name: "Beach Hopping",
    icon: "beach",
    count: "Secret coves",
    href: "/destinations/clifton-beaches",
    image: "/images/clifton-beaches.jpg",
  },
  {
    name: "Crayfish Diving",
    icon: "crayfish",
    count: "Catch & cook",
    href: "/booking/crayfish-experience",
    image: "/images/catch-cook-crayfish.jpg",
  },
  {
    name: "Private Events",
    icon: "champagne",
    count: "Customized",
    href: "/booking/private-charter",
    image: "/images/private-charter-guests.jpeg",
  },
];

export const homeDestinations = locations.slice(0, 6).map((loc) => ({
  name: loc.name,
  description: loc.tagline,
  slug: loc.slug,
  image: loc.heroImage,
  category: loc.category,
}));

export { specialOffers };

export const categoryLabels: Record<string, string> = {
  beach: "Beach",
  harbor: "Harbor",
  "marine-reserve": "Marine Reserve",
  landmark: "Landmark",
};
