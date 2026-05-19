export const siteConfig = {
  name: "Hey Charlie Charters",
  tagline: "Cape Town's Premier Charter Experience",
  description:
    "Experience Cape Town's stunning coastline with Hey Charlie Charters. Sundowner cruises, whale watching, fishing trips, crayfish diving, and private charters.",
  url: "https://heycharliecharters.co.za",
  address: "V&A Waterfront, Cape Town",
  phone: "+27123456789",
  phoneDisplay: "+27 12 345 6789",
  email: "ahoy@heycharliecharters.co.za",
  whatsapp: "27123456789",
  heroPoster: "/images/sundown-cruise-hero.png",
  heroVideo: "/Gallery/HC%201%20(1).mp4",
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
} as const;

export const trustStats = [
  { value: "500+", label: "Happy Guests" },
  { value: "4.9★", label: "Rating" },
  { value: "8+", label: "Experiences" },
] as const;

export const testimonials = [
  {
    quote:
      "The sundowner cruise was absolutely magical. Captain Charlie knows every hidden spot along the coast.",
    author: "Sarah M.",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "Catching our own crayfish and having it cooked on the beach - best food experience of our lives!",
    author: "James & Lisa",
    location: "Sydney, Australia",
    rating: 5,
  },
  {
    quote:
      "We saw 12 whales in 3 hours! The marine biologist guide made it educational and unforgettable.",
    author: "The Van Der Berg Family",
    location: "Johannesburg, SA",
    rating: 5,
  },
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Choose Your Charter",
    description:
      "Browse our curated packages and pick the perfect adventure for your group.",
    icon: "compass" as const,
  },
  {
    step: 2,
    title: "Meet at the V&A",
    description:
      "Board at the Waterfront with our professional crew ready to welcome you aboard.",
    icon: "anchor" as const,
  },
  {
    step: 3,
    title: "Live the Experience",
    description:
      "Sail the Cape coast, spot wildlife, and create memories that last a lifetime.",
    icon: "sparkles" as const,
  },
] as const;

export const certifications = [
  { label: "SAMSA Certified", icon: "shield" as const },
  { label: "Fully Insured", icon: "shield" as const },
  { label: "Coast Guard", icon: "shield" as const },
] as const;
