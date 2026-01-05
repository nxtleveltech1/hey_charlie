export interface LocationGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LocationVideo {
  embedUrl: string;
  title: string;
  thumbnail?: string;
}

export interface LocationExperience {
  name: string;
  icon: string;
  description: string;
  duration: string;
  price: number;
  packageId: string;
}

export interface LocationHighlight {
  title: string;
  description: string;
  icon: string;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroDescription: string;
  fullDescription: string;
  heroImage: string;
  heroVideo?: string;
  coordinates: { lat: number; lng: number };
  gallery: LocationGalleryImage[];
  videos: LocationVideo[];
  highlights: LocationHighlight[];
  experiences: LocationExperience[];
  bestTimeToVisit: string;
  weatherNote: string;
  accessInfo: string;
  tips: string[];
  nearbyAttractions: string[];
  category: "beach" | "harbor" | "marine-reserve" | "landmark";
}

export const locations: Location[] = [
  {
    id: "clifton-beaches",
    slug: "clifton-beaches",
    name: "Clifton Beaches",
    tagline: "Cape Town's Riviera — Four Pristine Beaches",
    heroDescription: "Crystal-clear Atlantic waters, sheltered bays, and the most stunning sunset views in the Western Cape. Clifton's four numbered beaches are the crown jewels of Cape Town's coastline.",
    fullDescription: `Clifton's four beaches — imaginatively named 1st, 2nd, 3rd, and 4th Beach — are nestled between massive granite boulders that shelter them from the famous Cape Doctor wind. The result? Perfect beach days even when the rest of Cape Town is battling gusts.

Each beach has its own personality. 1st Beach is popular with the LGBTQ+ community, 2nd Beach draws the trendy crowd, 3rd Beach is family-friendly, and 4th Beach is the most accessible with nearby parking and facilities.

The water is refreshingly cold (around 14-17°C) thanks to the Benguela Current, but the turquoise clarity makes it irresistible. Arrive by boat and you'll skip the steep staircase descent — plus you'll have the best view of the iconic Atlantic Seaboard mansions dotting the cliffs above.`,
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&h=1080&fit=crop",
    heroVideo: "https://www.youtube.com/embed/QRS8MkLhQmM",
    coordinates: { lat: -33.9340, lng: 18.3776 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop", alt: "Clifton 4th Beach aerial view", caption: "4th Beach from above — the most iconic view" },
      { src: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&h=600&fit=crop", alt: "Clifton Beach sunset", caption: "Golden hour magic over the Atlantic" },
      { src: "https://images.unsplash.com/photo-1591778472199-f81c7d01c7c8?w=800&h=600&fit=crop", alt: "Clifton turquoise waters", caption: "The famous turquoise waters of Clifton" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Cape Town coastline", caption: "The quintessential Clifton beach day" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "Granite boulders beach", caption: "Giant boulders create sheltered coves" },
      { src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop", alt: "Cape Town beach panorama", caption: "The full sweep of Clifton's beaches" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/QRS8MkLhQmM", title: "Cape Town Beaches Drone Footage", thumbnail: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/5MKdGU2xoYw", title: "Clifton Beach Experience", thumbnail: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Wind-Protected", description: "Granite boulders shelter the beaches from the Cape Doctor southeast wind", icon: "🛡️" },
      { title: "Crystal Waters", description: "Some of the clearest water on the African continent", icon: "💎" },
      { title: "No Crowds by Boat", description: "Skip the 80+ stairs and arrive in style", icon: "⛵" },
      { title: "Sunset Views", description: "Watch the sun sink into the Atlantic from the water", icon: "🌅" },
    ],
    experiences: [
      { name: "Sundowner Cruise", icon: "🌅", description: "Champagne and canapés as the sun sets over Clifton", duration: "2.5 hours", price: 850, packageId: "sundowner-cruise" },
      { name: "Beach Hopper", icon: "🏖️", description: "Visit all four Clifton beaches plus secret coves", duration: "5 hours", price: 1500, packageId: "beach-hopper" },
      { name: "Private Charter", icon: "🥂", description: "Exclusive Clifton experience for your group", duration: "Custom", price: 12000, packageId: "private-charter" },
    ],
    bestTimeToVisit: "December to March for warmest weather, but Clifton is spectacular year-round",
    weatherNote: "Water temperature: 14-17°C. Air: 18-28°C in summer. The boulders provide wind shelter even on gusty days.",
    accessInfo: "Arrive by boat from V&A Waterfront (15 minutes) or Hout Bay. We anchor in the sheltered bay with easy swim access.",
    tips: [
      "Book sunset cruises 2+ weeks ahead in peak season",
      "The water is cold but refreshing — perfect after sunbathing",
      "Bring a GoPro for incredible underwater visibility",
      "4th Beach has the best facilities if you want to hop off",
    ],
    nearbyAttractions: ["Camps Bay (5 min by boat)", "Lion's Head hiking", "Sea Point Promenade", "Atlantic Seaboard restaurants"],
    category: "beach",
  },
  {
    id: "camps-bay",
    slug: "camps-bay",
    name: "Camps Bay",
    tagline: "The Iconic Coastline Under the Twelve Apostles",
    heroDescription: "Where the Twelve Apostles mountain range plunges into the Atlantic. White sand, swaying palms, and Cape Town's most glamorous beachfront strip.",
    fullDescription: `Camps Bay is arguably Cape Town's most famous beach, and for good reason. The kilometre-long stretch of white sand is backed by the dramatic Twelve Apostles mountain range, creating one of the most photographed beach scenes in the world.

The beachfront promenade is lined with trendy restaurants, cafés, and cocktail bars — making it the perfect destination for a sundowner cruise followed by dinner. The water here is just as cold as Clifton, but the beach is more exposed to the wind, which is why arriving by boat on a calm day is pure magic.

From the water, you'll appreciate the full grandeur of the mountains rising 800 meters straight from the sea, with Lion's Head standing sentinel to the north. It's a view that simply can't be captured from land.`,
    heroImage: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=1920&h=1080&fit=crop",
    heroVideo: "https://www.youtube.com/embed/QRS8MkLhQmM",
    coordinates: { lat: -33.9505, lng: 18.3782 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&h=600&fit=crop", alt: "Camps Bay with Twelve Apostles", caption: "The iconic Camps Bay beachfront" },
      { src: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=800&h=600&fit=crop", alt: "Camps Bay beach", caption: "The Twelve Apostles at golden hour" },
      { src: "https://images.unsplash.com/photo-1578922746465-b2f7c6e20c00?w=800&h=600&fit=crop", alt: "Camps Bay palm trees", caption: "Palm-lined paradise" },
      { src: "https://images.unsplash.com/photo-1591778472199-f81c7d01c7c8?w=800&h=600&fit=crop", alt: "Camps Bay sunset", caption: "Camps Bay sunset spektakel" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Cape Town beach panorama", caption: "Full sweep of the bay" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "Lions Head view", caption: "Mountains meet sea" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/QRS8MkLhQmM", title: "Camps Bay from the Air", thumbnail: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/5MKdGU2xoYw", title: "The Twelve Apostles Experience", thumbnail: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Mountain Majesty", description: "The Twelve Apostles create a jaw-dropping backdrop", icon: "⛰️" },
      { title: "Sunset Strip", description: "Beachfront bars perfect for post-cruise cocktails", icon: "🍹" },
      { title: "White Sand Beach", description: "Over a kilometre of pristine coastline", icon: "🏖️" },
      { title: "Photo Paradise", description: "Instagram's favorite Cape Town location", icon: "📸" },
    ],
    experiences: [
      { name: "Sundowner Cruise", icon: "🌅", description: "Watch sunset paint the Twelve Apostles", duration: "2.5 hours", price: 850, packageId: "sundowner-cruise" },
      { name: "Coastline Explorer", icon: "🧭", description: "Full day exploring the Atlantic Seaboard", duration: "7 hours", price: 2200, packageId: "coastline-explorer" },
      { name: "Private Charter", icon: "🥂", description: "Celebrate in style with Camps Bay views", duration: "Custom", price: 12000, packageId: "private-charter" },
    ],
    bestTimeToVisit: "October to April for beach weather, but the views are stunning year-round",
    weatherNote: "More exposed to wind than Clifton. Best on calm days or early mornings.",
    accessInfo: "15 minutes by boat from V&A Waterfront. We anchor offshore for swimming and photos.",
    tips: [
      "Book a table at a beachfront restaurant before your cruise",
      "The beach faces west — perfect for sunset photos",
      "Calm mornings offer mirror-like water reflections",
      "Ask about our dinner cruise + restaurant combo packages",
    ],
    nearbyAttractions: ["Clifton Beaches", "Bakoven beach", "Table Mountain Aerial Cableway", "Lion's Head sunset hike"],
    category: "beach",
  },
  {
    id: "hout-bay",
    slug: "hout-bay",
    name: "Hout Bay",
    tagline: "The Republic of Hout Bay — Harbor Town Charm",
    heroDescription: "A working fishing harbor surrounded by mountains, home to Cape fur seals and the gateway to Chapman's Peak. Experience authentic Cape coastal culture.",
    fullDescription: `Hout Bay calls itself "The Republic of Hout Bay" for good reason — this tight-knit community has a character all its own. Tucked between the Twelve Apostles and the Sentinel peak, the bay opens to a crescent of beach backed by a vibrant fishing harbor.

This is where you'll find the real Cape Town. Watch the fishing boats unload their catch, sample the freshest fish and chips at the harbour market, and then head out to Duiker Island — a short boat ride away — where thousands of Cape fur seals sun themselves on the rocks.

The harbour is also the traditional starting point for the famous crayfish diving experience. When it's crayfish season (November to April), there's nothing quite like catching your own lobster and having it cooked fresh on the beach.`,
    heroImage: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=1920&h=1080&fit=crop",
    coordinates: { lat: -34.0476, lng: 18.3535 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=600&fit=crop", alt: "Hout Bay harbor", caption: "The working fishing harbor" },
      { src: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800&h=600&fit=crop", alt: "Cape fur seals", caption: "Thousands of Cape fur seals on Duiker Island" },
      { src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop", alt: "Chapman's Peak view", caption: "Chapman's Peak Drive from the water" },
      { src: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop", alt: "Fresh seafood platter", caption: "Fresh catch at the harbor market" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Hout Bay beach", caption: "Hout Bay beach at sunset" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "Mountain backdrop", caption: "Surrounded by dramatic peaks" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/R_S5Xy8gU0Y", title: "Seal Island Adventure", thumbnail: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/5MKdGU2xoYw", title: "Hout Bay Harbor Experience", thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Seal Colony", description: "Visit Duiker Island's 5,000+ Cape fur seals", icon: "🦭" },
      { title: "Fresh Seafood", description: "Catch-of-the-day at the harbor market", icon: "🐟" },
      { title: "Crayfish Central", description: "The home of Cape Town crayfish diving", icon: "🦞" },
      { title: "Chapman's Peak", description: "See the famous road from sea level", icon: "🛣️" },
    ],
    experiences: [
      { name: "Catch & Cook Crayfish", icon: "🦞", description: "Dive for lobster and feast on the beach", duration: "8 hours", price: 2800, packageId: "crayfish-experience" },
      { name: "Seal Island Tour", icon: "🦭", description: "Get up close with thousands of seals", duration: "1.5 hours", price: 450, packageId: "seal-island" },
      { name: "Deep Sea Fishing", icon: "🎣", description: "Target tuna and yellowtail from Hout Bay", duration: "6 hours", price: 1800, packageId: "deep-sea-fishing" },
      { name: "Seafood Beach Feast", icon: "🍽️", description: "Five-course seafood dinner on the sand", duration: "4 hours", price: 3500, packageId: "seafood-feast" },
    ],
    bestTimeToVisit: "Year-round for seals. November to April for crayfish season.",
    weatherNote: "The bay is sheltered but can get windy in the afternoon. Mornings are best.",
    accessInfo: "20 minutes by boat from V&A Waterfront, or depart directly from Hout Bay harbor.",
    tips: [
      "Book crayfish dives early — permits are limited",
      "Bring a camera with good zoom for the seals",
      "Try the fish and chips at Mariners Wharf",
      "Combine with a Chapman's Peak scenic stop",
    ],
    nearbyAttractions: ["Chapman's Peak Drive", "World of Birds", "Imizamo Yethu township tours", "Constantia wine farms"],
    category: "harbor",
  },
  {
    id: "simons-town",
    slug: "simons-town",
    name: "Simon's Town",
    tagline: "Naval Heritage & African Penguins",
    heroDescription: "Historic naval base meets penguin paradise. This charming False Bay town offers warm water swimming, rich maritime history, and unforgettable wildlife encounters.",
    fullDescription: `Simon's Town has been home to navies for over 200 years — first the British Royal Navy, now the South African Navy. The result is a town dripping with maritime heritage: Victorian buildings, historic pubs, and tales of legendary ships.

But the real stars of Simon's Town are the African penguins. The colony at nearby Boulders Beach has made this one of Cape Town's most popular destinations. Arriving by boat gives you a unique perspective — watching the penguins waddle between boulders from the water, away from the crowds.

The False Bay waters here are warmer than the Atlantic side, fed by the Agulhas Current. This makes for more comfortable swimming and attracts different marine life — including the great white sharks that patrol the bay (don't worry, they're only interested in seals).`,
    heroImage: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1920&h=1080&fit=crop",
    heroVideo: "https://www.youtube.com/embed/pCvZtjoRq1I",
    coordinates: { lat: -34.1908, lng: 18.4325 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop", alt: "African penguins on beach", caption: "The famous Boulders Beach penguins" },
      { src: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&h=600&fit=crop", alt: "African penguin close-up", caption: "African penguin portrait" },
      { src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop", alt: "False Bay view", caption: "The warm waters of False Bay" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Cape Town coast", caption: "Colonial architecture along the main street" },
      { src: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&h=600&fit=crop", alt: "Penguin colony", caption: "Thousands of African penguins" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "False Bay coastline", caption: "The dramatic False Bay coastline" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/pCvZtjoRq1I", title: "African Penguins at Boulders Beach", thumbnail: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/R_S5Xy8gU0Y", title: "Simon's Town Maritime Heritage", thumbnail: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Penguin Paradise", description: "One of the world's most accessible penguin colonies", icon: "🐧" },
      { title: "Warmer Waters", description: "False Bay is 4-6°C warmer than the Atlantic", icon: "🌡️" },
      { title: "Naval History", description: "200+ years of maritime heritage to explore", icon: "⚓" },
      { title: "Scenic Route", description: "Part of the famous Cape Point drive", icon: "🚗" },
    ],
    experiences: [
      { name: "Coastline Explorer", icon: "🧭", description: "Full day from V&A to Simon's Town and Cape Point", duration: "7 hours", price: 2200, packageId: "coastline-explorer" },
      { name: "Whale Watching Safari", icon: "🐋", description: "False Bay's incredible whale activity", duration: "3 hours", price: 1200, packageId: "whale-watching" },
      { name: "Private Charter", icon: "🥂", description: "Exclusive False Bay exploration", duration: "Custom", price: 12000, packageId: "private-charter" },
    ],
    bestTimeToVisit: "June to November for whale watching. Year-round for penguins.",
    weatherNote: "Generally calmer than the Atlantic side. Water: 16-21°C in summer.",
    accessInfo: "45 minutes by boat from V&A Waterfront, or 30 minutes from Hout Bay via False Bay.",
    tips: [
      "Visit penguins early morning or late afternoon for active behaviour",
      "The historic main street has excellent restaurants",
      "This is whale shark territory in summer (Feb-April)",
      "Combine with a Cape Point visit for the ultimate day trip",
    ],
    nearbyAttractions: ["Boulders Beach penguin colony", "Cape Point Nature Reserve", "Kalk Bay harbor", "Muizenberg surf beach"],
    category: "harbor",
  },
  {
    id: "cape-point",
    slug: "cape-point",
    name: "Cape Point",
    tagline: "Where Two Oceans Meet — Edge of the Continent",
    heroDescription: "The dramatic tip of the Cape Peninsula where the Atlantic and Indian Oceans collide. Towering cliffs, historic lighthouse, and legendary shipwrecks.",
    fullDescription: `Cape Point is the stuff of legend. While not technically the southernmost point of Africa (that's Cape Agulhas), it's certainly the most dramatic. The sheer cliffs rise 250 meters from the churning waters below, topped by the famous old lighthouse that once guided ships around this treacherous cape.

The waters here are wild and beautiful. The warm Agulhas Current from the Indian Ocean meets the cold Benguela Current from the Atlantic, creating swirling patterns you can actually see from the boat. This mixing of waters creates incredibly rich marine ecosystems — whales, dolphins, and seals are common sights.

Approaching Cape Point from the sea gives you a perspective that most visitors never see. The cliffs, the lighthouse, the waves crashing against rocks that have claimed countless ships — it's a humbling and exhilarating experience.`,
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&h=1080&fit=crop",
    heroVideo: "https://www.youtube.com/embed/QRS8MkLhQmM",
    coordinates: { lat: -34.3568, lng: 18.4975 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop", alt: "Cape Point aerial", caption: "The historic Cape Point lighthouse" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "Dramatic cliffs", caption: "250-meter cliffs plunging into the sea" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Cape coastline", caption: "Where the Atlantic meets the Indian Ocean" },
      { src: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800&h=600&fit=crop", alt: "Marine wildlife", caption: "Marine life thrives in the mixing currents" },
      { src: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&h=600&fit=crop", alt: "Sunset at Cape Point", caption: "Golden hour at the edge of Africa" },
      { src: "https://images.unsplash.com/photo-1591778472199-f81c7d01c7c8?w=800&h=600&fit=crop", alt: "Cape Point from sea", caption: "The view most people never see" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/QRS8MkLhQmM", title: "Cape Point — Edge of the World", thumbnail: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/5MKdGU2xoYw", title: "Cape Peninsula Tour", thumbnail: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Two Oceans", description: "Witness the Atlantic and Indian Oceans meeting", icon: "🌊" },
      { title: "Historic Lighthouse", description: "One of the most iconic lighthouses in the world", icon: "🏠" },
      { title: "Rich Marine Life", description: "Whales, dolphins, and seals in abundance", icon: "🐋" },
      { title: "Dramatic Cliffs", description: "250-meter drops into the swirling sea", icon: "⛰️" },
    ],
    experiences: [
      { name: "Coastline Explorer", icon: "🧭", description: "Full False Bay expedition to Cape Point", duration: "7 hours", price: 2200, packageId: "coastline-explorer" },
      { name: "Whale Watching Safari", icon: "🐋", description: "Peak whale activity near Cape Point", duration: "3 hours", price: 1200, packageId: "whale-watching" },
      { name: "Private Charter", icon: "🥂", description: "Ultimate Cape Point adventure", duration: "Custom", price: 12000, packageId: "private-charter" },
    ],
    bestTimeToVisit: "October to December for calm seas. June to November for whale season.",
    weatherNote: "Can be rough — conditions determine if we can approach the Point. Always dramatic.",
    accessInfo: "1 hour by boat from Simon's Town. Full-day trip from V&A Waterfront.",
    tips: [
      "This is an advanced trip — sea conditions must be favorable",
      "Bring motion sickness medication if you're prone",
      "The shipwreck stories are incredible — ask your skipper",
      "Best combined with a full False Bay experience",
    ],
    nearbyAttractions: ["Cape Point Nature Reserve", "Cape of Good Hope sign", "Diaz Beach", "Ostriches and baboons in the reserve"],
    category: "landmark",
  },
  {
    id: "boulders-beach",
    slug: "boulders-beach",
    name: "Boulders Beach",
    tagline: "Swim with African Penguins",
    heroDescription: "One of the only places on Earth where you can swim alongside endangered African penguins. Ancient granite boulders create sheltered pools perfect for close encounters.",
    fullDescription: `Boulders Beach isn't just famous — it's magical. The colony of African penguins (also called jackass penguins for their braying call) has made this their home since 1982, and the population has grown to around 3,000 birds.

The massive granite boulders that give the beach its name create sheltered pools with calm, crystal-clear water. Swimming here, you'll often find penguins swimming alongside you — an experience you simply can't get anywhere else in the world.

Arriving by boat allows you to observe the colony from the water before the crowds arrive. You'll see penguins porpoising through the waves, surfing the swells, and diving for fish. It's a completely different perspective from the land-based boardwalks.`,
    heroImage: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=1920&h=1080&fit=crop",
    heroVideo: "https://www.youtube.com/embed/pCvZtjoRq1I",
    coordinates: { lat: -34.1976, lng: 18.4520 },
    gallery: [
      { src: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&h=600&fit=crop", alt: "African penguin close-up", caption: "African penguins in their natural habitat" },
      { src: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop", alt: "Penguins on beach", caption: "Penguins on the famous boulders" },
      { src: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&h=600&fit=crop", alt: "Penguin colony", caption: "Penguin colony at Boulders Beach" },
      { src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop", alt: "Cape Town beach", caption: "Crystal-clear swimming pools" },
      { src: "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&h=600&fit=crop", alt: "Coastal view", caption: "3,000+ penguins call this home" },
      { src: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=600&fit=crop", alt: "Beach panorama", caption: "The full sweep of Boulders Beach" },
    ],
    videos: [
      { embedUrl: "https://www.youtube.com/embed/pCvZtjoRq1I", title: "African Penguins Documentary", thumbnail: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=400&h=225&fit=crop" },
      { embedUrl: "https://www.youtube.com/embed/R_S5Xy8gU0Y", title: "Boulders Beach Experience", thumbnail: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&h=225&fit=crop" },
    ],
    highlights: [
      { title: "Swim with Penguins", description: "A once-in-a-lifetime wildlife experience", icon: "🐧" },
      { title: "Sheltered Pools", description: "Calm, warm water protected by boulders", icon: "🏊" },
      { title: "Marine Reserve", description: "Protected habitat for endangered species", icon: "🌿" },
      { title: "Unique Perspective", description: "See penguins fishing from the boat", icon: "👀" },
    ],
    experiences: [
      { name: "Coastline Explorer", icon: "🧭", description: "Includes swimming stop at Boulders", duration: "7 hours", price: 2200, packageId: "coastline-explorer" },
      { name: "Beach Hopper", icon: "🏖️", description: "Visit Boulders plus other secret beaches", duration: "5 hours", price: 1500, packageId: "beach-hopper" },
      { name: "Private Charter", icon: "🥂", description: "Extended penguin experience", duration: "Custom", price: 12000, packageId: "private-charter" },
    ],
    bestTimeToVisit: "February to March for penguin breeding season. Year-round for sightings.",
    weatherNote: "False Bay is warmer. Water: 17-20°C in summer. Sheltered from wind by boulders.",
    accessInfo: "45 minutes by boat from V&A Waterfront. Perfect as part of a False Bay day trip.",
    tips: [
      "Don't touch or feed the penguins",
      "Snorkeling gear recommended for underwater views",
      "Early morning = fewer tourists, active penguins",
      "The penguins fish early morning and late afternoon",
    ],
    nearbyAttractions: ["Simon's Town (walking distance)", "Cape Point Nature Reserve", "Seaforth Beach", "Boulder's Beach Penguin Colony Visitor Centre"],
    category: "marine-reserve",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((loc) => loc.slug === slug);
}

export function getLocationsByCategory(category: Location["category"]): Location[] {
  return locations.filter((loc) => loc.category === category);
}

