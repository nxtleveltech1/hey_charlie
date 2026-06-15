import { z } from "zod";
import { faqPairSchema } from "./faqs";

/**
 * Canonical destination content for Hey Charlie Charters.
 *
 * Richer, CMS-ready model. This is the single source of truth for new marketing
 * pages. The legacy `src/lib/locations.ts` (consumed by the current destinations
 * pages) is retained for backward compatibility until those pages migrate to this
 * module.
 *
 * Copy rules: specific place names, real seasons, real logistics. No "magic",
 * "unforgettable", "near-guaranteed" or guarantees.
 */

export const destinationCategorySchema = z.enum([
  "beach",
  "harbor",
  "marine-reserve",
  "landmark",
  "departure-hub",
]);

const destinationGalleryImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const destinationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  story: z.string(),
  routeContext: z.string(),
  category: destinationCategorySchema,
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  heroImage: z.string(),
  /** YouTube video id (not a full URL) when available. */
  heroVideoId: z.string().optional(),
  gallery: z.array(destinationGalleryImageSchema),
  bestFor: z.array(z.string()),
  wildlife: z.array(z.string()),
  scenery: z.array(z.string()),
  bestSeason: z.string(),
  seasonMonths: z.array(z.number().min(1).max(12)).optional(),
  weatherNote: z.string(),
  accessInfo: z.string(),
  linkedPackageSlugs: z.array(z.string()),
  faqs: z.array(faqPairSchema),
  nearbyAttractions: z.array(z.string()),
});

export type DestinationCategory = z.infer<typeof destinationCategorySchema>;
export type DestinationGalleryImage = z.infer<typeof destinationGalleryImageSchema>;
export type Destination = z.infer<typeof destinationSchema>;

const IMAGES = {
  clifton: "/images/clifton-beaches.jpg",
  campsBay: "/images/camps-bay.jpg",
  houtBay: "/images/hout bay.png",
  falseBay: "/images/false bay.png",
  capePoint: "/images/cape point drop off.png",
  seafood: "/images/seafood-feast.jpg",
  // ASSET REQUIRED: no owned local photo exists yet. The remote Wikipedia URLs
  // were removed (unowned/licence-restricted). Replace these two with real,
  // owned local assets before the relevant destination pages render publicly.
  simonsTown: "REQUIRED-ASSET: /images/destinations/simons-town.jpg (pending)",
  boulders: "REQUIRED-ASSET: /images/destinations/boulders-beach.jpg (pending)",
  sealIsland: "/images/seal-island.jpg",
  vaWaterfront: "/images/sundown-cruise-hero.png",
};

const destinations: Destination[] = [
  {
    id: "va-waterfront",
    slug: "va-waterfront",
    name: "V&A Waterfront",
    tagline: "Our departure hub — where every charter begins",
    story:
      "The V&A Waterfront is the working heart of Cape Town's harbour and our base of operations. All Hey Charlie charters depart from here, which means the iconic Table Bay skyline, Table Mountain and the stadium are your first views of the day. The Waterfront is easy to reach, well signposted, and has parking, restaurants and coffee close to the berth.",
    routeContext:
      "The departure point for every trip. From here we run west along the Atlantic Seaboard toward Clifton and Camps Bay, or south around the peninsula toward Hout Bay, Simon's Town and Cape Point.",
    category: "departure-hub",
    coordinates: { lat: -33.9077, lng: 18.4235 },
    heroImage: IMAGES.vaWaterfront,
    gallery: [{ src: IMAGES.vaWaterfront, alt: "V&A Waterfront and Table Bay" }],
    bestFor: ["Meeting point", "First-time visitors", "Easy access"],
    wildlife: ["Dolphins occasionally in Table Bay"],
    scenery: ["Table Mountain", "Table Bay harbour", "Stadium and city skyline"],
    bestSeason: "Year-round departure point.",
    weatherNote:
      "Table Bay is sheltered relative to the open coast but can be breezy; the skipper picks the best direction on the day.",
    accessInfo:
      "Departure details and the exact berth are shared in your booking confirmation, with a map pin. Arrive 15 minutes early.",
    linkedPackageSlugs: [
      "sundowner-cruise",
      "private-charter",
      "coastline-explorer",
      "beach-hopper",
    ],
    faqs: [
      {
        q: "Where exactly do we meet?",
        a: "At the V&A Waterfront. The specific berth and a map pin are sent in your confirmation.",
      },
    ],
    nearbyAttractions: ["V&A Shopping and restaurants", "Two Oceans Aquarium", "Table Mountain Aerial Cableway"],
  },
  {
    id: "clifton-beaches",
    slug: "clifton-beaches",
    name: "Clifton Beaches",
    tagline: "Four sheltered Atlantic beaches below Lion's Head",
    story:
      "Clifton's four beaches — 1st through 4th — sit between granite boulders that shelter them from the south-easter (the Cape Doctor). The result is calm, clear water on days when exposed beaches are windswept. The water is cold — fed by the Benguela Current — but the turquoise clarity makes it worth the plunge. Arriving by boat skips the steep stair descents and gives you the best view of the Atlantic Seaboard above.",
    routeContext:
      "About 15 minutes by boat from the V&A Waterfront, heading west along the Atlantic Seaboard toward Camps Bay.",
    category: "beach",
    coordinates: { lat: -33.934, lng: 18.3776 },
    heroImage: IMAGES.clifton,
    gallery: [
      { src: IMAGES.clifton, alt: "Clifton Beaches from above", caption: "The four Clifton beaches tucked below Lion's Head" },
      { src: IMAGES.clifton, alt: "Clifton turquoise water", caption: "Clear Atlantic water at Clifton" },
    ],
    bestFor: ["Swimmers", "Sunset cruises", "Photographers"],
    wildlife: ["Seabirds", "Occasional dolphins"],
    scenery: ["Granite boulders", "Lion's Head", "Atlantic Seaboard mansions"],
    bestSeason: "December–March for the warmest days; sheltered and scenic year-round.",
    seasonMonths: [12, 1, 2, 3],
    weatherNote: "Water around 13–17°C. The boulders provide shelter even on windy days.",
    accessInfo: "Roughly 15 minutes by boat from the V&A Waterfront. We anchor in the sheltered bay for swimming.",
    linkedPackageSlugs: ["sundowner-cruise", "beach-hopper", "private-charter"],
    faqs: [
      {
        q: "Is the water really that cold?",
        a: "Yes — around 13–17°C from the Benguela Current. A short swim is refreshing; a wetsuit helps for longer swims.",
      },
    ],
    nearbyAttractions: ["Camps Bay", "Lion's Head hike", "Sea Point Promenade"],
  },
  {
    id: "camps-bay",
    slug: "camps-bay",
    name: "Camps Bay",
    tagline: "White sand under the Twelve Apostles",
    story:
      "Camps Bay is the long arc of white sand backed by the Twelve Apostles mountain range — one of the most photographed stretches of the Cape coast. The beachfront strip of restaurants and bars makes it a natural anchor for a sundowner cruise. From the water you take in the full scale of the mountains rising behind the beach, a perspective the road never gives you.",
    routeContext:
      "Just beyond Clifton along the Atlantic Seaboard, roughly 15 minutes by boat from the V&A Waterfront.",
    category: "beach",
    coordinates: { lat: -33.9505, lng: 18.3782 },
    heroImage: IMAGES.campsBay,
    gallery: [
      { src: IMAGES.campsBay, alt: "Camps Bay and the Twelve Apostles", caption: "Camps Bay beachfront under the Twelve Apostles" },
    ],
    bestFor: ["Sundowner cruises", "Photographers", "Dining combos"],
    wildlife: ["Seabirds"],
    scenery: ["Twelve Apostles", "Lion's Head", "Atlantic coastline"],
    bestSeason: "October–April for beach weather; the views hold year-round.",
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    weatherNote: "More exposed to wind than Clifton — best on calm days or in the morning.",
    accessInfo: "About 15 minutes by boat from the V&A Waterfront; we anchor offshore for swimming and photos.",
    linkedPackageSlugs: ["sundowner-cruise", "coastline-explorer", "private-charter"],
    faqs: [
      {
        q: "Can we combine the cruise with dinner?",
        a: "Yes — the beachfront has many restaurants. Ask about dinner-after-cruise options.",
      },
    ],
    nearbyAttractions: ["Clifton Beaches", "Bakoven", "Table Mountain Cableway"],
  },
  {
    id: "hout-bay",
    slug: "hout-bay",
    name: "Hout Bay",
    tagline: "Working harbour, seals and Chapman's Peak",
    story:
      "Hout Bay is a working fishing harbour tucked between the Twelve Apostles and the Sentinel. It is the gateway to Duiker Island's Cape fur seal colony and a traditional launch point for crayfish diving in season. Watch the fishing boats unload, then run out to the seals — or continue south toward Cape Point. The harbour market's fish and chips are a Cape Town staple.",
    routeContext:
      "Around the corner from Camps Bay along the Atlantic coast, roughly 30 minutes by boat from the V&A Waterfront.",
    category: "harbor",
    coordinates: { lat: -34.0476, lng: 18.3535 },
    heroImage: IMAGES.houtBay,
    gallery: [
      { src: IMAGES.houtBay, alt: "Hout Bay harbour and mountains", caption: "The working harbour below Hout Bay's mountain bowl" },
      { src: IMAGES.sealIsland, alt: "Cape fur seals at Duiker Island", caption: "Cape fur seals at Duiker Island" },
      { src: IMAGES.seafood, alt: "Fresh seafood", caption: "Fresh catch from the harbour" },
    ],
    bestFor: ["Seal viewing", "Crayfish diving (in season)", "Fishing"],
    wildlife: ["Cape fur seal colony (Duiker Island)", "Seabirds"],
    scenery: ["The Sentinel", "Chapman's Peak from the sea", "Harbour and bay"],
    bestSeason: "Year-round for seals; November–April for crayfish season.",
    seasonMonths: [11, 12, 1, 2, 3, 4],
    weatherNote: "The bay is sheltered but can freshen in the afternoon; mornings are usually calmest.",
    accessInfo: "About 30 minutes by boat from the V&A Waterfront, or we can depart directly from Hout Bay harbour by arrangement.",
    linkedPackageSlugs: ["seal-island", "crayfish-experience", "deep-sea-fishing", "seafood-feast"],
    faqs: [
      {
        q: "Can we start from Hout Bay instead?",
        a: "Yes — departures from Hout Bay harbour can be arranged. Mention it at booking.",
      },
    ],
    nearbyAttractions: ["Chapman's Peak Drive", "Mariners Wharf", "World of Birds"],
  },
  {
    id: "seal-island",
    slug: "seal-island",
    name: "Seal Island (Duiker Island)",
    tagline: "Cape fur seal colony off Hout Bay",
    story:
      "Duiker Island — known locally as Seal Island — lies just off Hout Bay and is home to a large resident colony of Cape fur seals. They haul out on the rocks and porpoise around the boats. We keep a respectful distance, which still brings you close enough for clear viewing and photography with the Sentinel rising behind. Short, sheltered and family-friendly.",
    routeContext:
      "A short run from Hout Bay harbour, usually combined with a coastal cruise from the V&A Waterfront.",
    category: "marine-reserve",
    coordinates: { lat: -34.0495, lng: 18.3347 },
    heroImage: IMAGES.sealIsland,
    gallery: [
      { src: IMAGES.sealIsland, alt: "Cape fur seals at Duiker Island", caption: "Cape fur seals hauled out at Duiker Island" },
    ],
    bestFor: ["Families", "First-time visitors", "Photographers"],
    wildlife: ["Cape fur seal colony", "Cormorants and seabirds"],
    scenery: ["The Sentinel", "Chapman's Peak backdrop"],
    bestSeason: "Year-round; seals are resident.",
    weatherNote: "Sheltered run; a good option when longer offshore trips are not advisable.",
    accessInfo: "A short run from Hout Bay; reachable as part of the Seal Island Tour or Coastline Explorer from the V&A.",
    linkedPackageSlugs: ["seal-island", "coastline-explorer", "private-charter"],
    faqs: [
      {
        q: "How close do we get?",
        a: "We hold a respectful, regulated distance that still allows clear viewing and photos, and we only land where permitted.",
      },
    ],
    nearbyAttractions: ["Hout Bay harbour", "Chapman's Peak Drive", "Mariners Wharf"],
  },
  {
    id: "simons-town",
    slug: "simons-town",
    name: "Simon's Town",
    tagline: "Naval heritage on the way to the penguins",
    story:
      "Simon's Town has been a naval base for more than two centuries, and its Victorian main street and harbour still carry that heritage. It is the gateway to Boulders Beach's African penguin colony and a staging point for False Bay trips toward Cape Point. The False Bay water here is warmer than the Atlantic side, which makes for more comfortable swimming.",
    routeContext:
      "On the False Bay side of the peninsula, usually reached as part of a full-day Coastline Explorer from the V&A Waterfront.",
    category: "harbor",
    coordinates: { lat: -34.1908, lng: 18.4325 },
    heroImage: IMAGES.simonsTown,
    gallery: [
      { src: IMAGES.simonsTown, alt: "Simon's Town harbour", caption: "The historic harbour and naval town" },
      { src: IMAGES.boulders, alt: "African penguins", caption: "African penguins at nearby Boulders" },
      { src: IMAGES.falseBay, alt: "False Bay coastline", caption: "The warmer waters of False Bay" },
    ],
    bestFor: ["History lovers", "Penguin viewing", "Whale watching (in season)"],
    wildlife: ["African penguins (Boulders)", "Whales (June–November)", "Dolphins"],
    scenery: ["Naval harbour", "Victorian main street", "False Bay mountains"],
    bestSeason: "Year-round for penguins; June–November adds whale activity.",
    seasonMonths: [6, 7, 8, 9, 10, 11],
    weatherNote: "Generally calmer than the Atlantic side; False Bay water runs warmer.",
    accessInfo: "Reached on full-day peninsula trips from the V&A Waterfront; roughly 45 minutes by boat.",
    linkedPackageSlugs: ["coastline-explorer", "whale-watching", "private-charter"],
    faqs: [
      {
        q: "Will we see penguins?",
        a: "The Boulders colony is reliable and usually part of a False Bay route. We view from the water to avoid the crowds.",
      },
    ],
    nearbyAttractions: ["Boulders Beach penguin colony", "Cape Point Nature Reserve", "Kalk Bay harbour"],
  },
  {
    id: "cape-point",
    slug: "cape-point",
    name: "Cape Point",
    tagline: "Dramatic cliffs at the tip of the peninsula",
    story:
      "Cape Point is the dramatic southern tip of the Cape Peninsula, where sheer cliffs rise from the sea below the old lighthouse. Approaching from the water gives you a perspective most visitors never see — the scale of the cliffs, the churn where currents meet, and the wildness of the coast. It is a highlight of the full-day Coastline Explorer, but only safely rounded in the right conditions.",
    routeContext:
      "The far turn-around on the full-day Coastline Explorer; reached via False Bay and Simon's Town.",
    category: "landmark",
    coordinates: { lat: -34.3568, lng: 18.4975 },
    heroImage: IMAGES.capePoint,
    gallery: [
      { src: IMAGES.capePoint, alt: "Cape Point cliffs", caption: "Cape Point's cliffs dropping into the sea" },
      { src: IMAGES.capePoint, alt: "Cape Point lighthouse", caption: "The old lighthouse above the point" },
    ],
    bestFor: ["Full-day adventurers", "Photographers"],
    wildlife: ["Whales (in season)", "Dolphins", "Seabirds"],
    scenery: ["Sheer cliffs", "Historic lighthouse", "Where two currents meet"],
    bestSeason: "October–December for calmer seas; June–November adds whales.",
    seasonMonths: [10, 11, 12, 6, 7, 8, 9],
    weatherNote: "Can be rough — conditions determine whether we can approach and round the Point.",
    accessInfo: "A long-range, full-day trip from the V&A Waterfront via False Bay.",
    linkedPackageSlugs: ["coastline-explorer", "whale-watching", "private-charter"],
    faqs: [
      {
        q: "Is the rounding guaranteed?",
        a: "No — it depends on sea state. The skipper adjusts or shortens the route for safety on the day.",
      },
    ],
    nearbyAttractions: ["Cape Point Nature Reserve", "Cape of Good Hope", "Diaz Beach"],
  },
  {
    id: "boulders-beach",
    slug: "boulders-beach",
    name: "Boulders Beach",
    tagline: "African penguins among granite boulders",
    story:
      "Boulders Beach is famous for its African penguin colony, which has made this sheltered stretch of False Bay home. Massive granite boulders create calm, clear pools. Approaching by water lets you watch penguins porpoising and fishing away from the boardwalk crowds — a different angle on a well-loved colony. Please don't touch or feed the penguins.",
    routeContext:
      "Just beyond Simon's Town on the False Bay side; part of the full-day peninsula route.",
    category: "marine-reserve",
    coordinates: { lat: -34.1976, lng: 18.452 },
    heroImage: IMAGES.boulders,
    gallery: [
      { src: IMAGES.boulders, alt: "African penguins at Boulders Beach", caption: "African penguins at Boulders Beach" },
    ],
    bestFor: ["Families", "Wildlife lovers", "Photographers"],
    wildlife: ["African penguin colony", "Cormorants"],
    scenery: ["Granite boulders", "Sheltered clear pools", "False Bay mountains"],
    bestSeason: "February–March for breeding activity; year-round for sightings.",
    seasonMonths: [2, 3],
    weatherNote: "False Bay is warmer and sheltered by the boulders.",
    accessInfo: "About 45 minutes by boat from the V&A Waterfront, on the False Bay side.",
    linkedPackageSlugs: ["coastline-explorer", "beach-hopper", "private-charter"],
    faqs: [
      {
        q: "Can we swim with the penguins?",
        a: "We view from the water at a respectful distance. Please don't touch or feed the penguins — they are protected.",
      },
    ],
    nearbyAttractions: ["Simon's Town", "Cape Point Nature Reserve", "Seaforth Beach"],
  },
];

export function getDestinations(): Destination[] {
  return destinations;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsByCategory(category: DestinationCategory): Destination[] {
  return destinations.filter((d) => d.category === category);
}

export { destinations as destinationCatalogue };
