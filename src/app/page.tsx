import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { packages } from "@/lib/packages";
import { ThemeToggle } from "@/components/theme-toggle";

const experiences = [
  { name: "Sundowner Cruises", icon: "🌅", count: "Daily departures" },
  { name: "Whale Watching", icon: "🐋", count: "Jun–Nov season" },
  { name: "Fishing Charters", icon: "🎣", count: "Year-round" },
  { name: "Beach Hopping", icon: "🏖️", count: "Secret coves" },
  { name: "Crayfish Diving", icon: "🦞", count: "Catch & cook" },
  { name: "Private Events", icon: "🥂", count: "Customized" },
];

const destinations = [
  { name: "Clifton Beaches", description: "Cape Town's riviera", yachts: "4 beaches" },
  { name: "Camps Bay", description: "Iconic coastline views", yachts: "Lion's Head backdrop" },
  { name: "Hout Bay", description: "Harbor town charm", yachts: "Seal Island nearby" },
  { name: "Simon's Town", description: "Naval heritage & penguins", yachts: "False Bay" },
  { name: "Cape Point", description: "Where oceans meet", yachts: "Dramatic cliffs" },
  { name: "Boulders Beach", description: "Penguin colony", yachts: "Marine reserve" },
];

const testimonials = [
  {
    quote: "The sundowner cruise was absolutely magical. Captain Charlie knows every hidden spot along the coast.",
    author: "Sarah M.",
    location: "London, UK",
    rating: 5,
  },
  {
    quote: "Catching our own crayfish and having it cooked on the beach - best food experience of our lives!",
    author: "James & Lisa",
    location: "Sydney, Australia",
    rating: 5,
  },
  {
    quote: "We saw 12 whales in 3 hours! The marine biologist guide made it educational and unforgettable.",
    author: "The Van Der Berg Family",
    location: "Johannesburg, SA",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] overflow-x-hidden transition-colors duration-300">
      {/* Animated ocean background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 transition-colors duration-300"
          style={{ background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))` }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-96" style={{ opacity: "var(--theme-wave-opacity)" }}>
          <div className="animate-wave absolute bottom-0 left-0 w-[200%] h-24 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-t-full" />
          <div className="animate-wave absolute bottom-8 left-0 w-[200%] h-16 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-t-full" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-float" style={{ background: "var(--theme-glow-orange)" }} />
        <div className="absolute top-40 left-10 w-[400px] h-[400px] rounded-full blur-3xl animate-float-delayed" style={{ background: "var(--theme-glow-pink)" }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl bg-[var(--theme-nav-bg)] z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={70}
                height={70}
                className="rounded-xl"
              />
              <div className="hidden sm:block">
                <span 
                  className="text-2xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hey Charlie
                </span>
                <span 
                  className="block text-sm font-semibold tracking-wider italic bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
                >
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="#experiences" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Experiences
              </Link>
              <Link href="#packages" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Packages
              </Link>
              <Link href="#destinations" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Destinations
              </Link>
              <Link href="#about" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignedOut>
                <Link href="/sign-in" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link
                  href="#packages"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity btn-primary"
                >
                  Book Now
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                  My Bookings
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-orange-500/50" } }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-sm text-orange-600 dark:text-orange-300">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Cape Town&apos;s Premier Charter Experience
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]" style={{ fontFamily: "var(--font-display)" }}>
                Discover the{" "}
                <span className="text-gradient-sunset">magic</span> of the{" "}
                <span className="text-gradient-ocean">Cape Coast</span>
              </h1>

              <p className="text-lg text-[var(--theme-text-muted)] max-w-xl leading-relaxed">
                From breathtaking sundowner cruises to catching your own crayfish — experience Cape Town&apos;s 
                coastline like never before. Unforgettable adventures await on the waters of the Mother City.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#packages"
                  className="px-8 py-4 text-center font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all btn-primary"
                >
                  View Experiences
                </Link>
                <Link
                  href="#about"
                  className="px-8 py-4 text-center font-medium border border-[var(--theme-border)] rounded-full hover:bg-[var(--theme-surface)] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Watch Video</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 pt-8 border-t border-[var(--theme-border)]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">500+</div>
                  <div className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">4.9★</div>
                  <div className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">8+</div>
                  <div className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider">Experiences</div>
                </div>
              </div>
            </div>

            {/* Hero image area */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-cyan-500/20 backdrop-blur-sm border border-[var(--theme-border)]" />
                <div className="absolute inset-4 rounded-2xl overflow-hidden">
                  <Image
                    src="/logo2.png"
                    alt="Hey Charlie Charters"
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium animate-float">
                  🐋 Whale Season Now!
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium animate-float-delayed">
                  🦞 Crayfish Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Categories */}
      <section id="experiences" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Unforgettable <span className="text-gradient-sunset">Experiences</span>
            </h2>
            <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              From peaceful sunset cruises to adrenaline-pumping fishing adventures — 
              there&apos;s something for everyone on the waters of Cape Town.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.name}
                className="group p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-pink-500/10 hover:border-orange-500/20 transition-all duration-500 card-hover cursor-pointer light-card"
              >
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{exp.name}</h3>
                <p className="text-[var(--theme-text-muted)] text-sm">{exp.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-12 px-6 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-orange-500/10 border-y border-orange-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-2xl">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-semibold">Summer Sizzler Special</h3>
                <p className="text-[var(--theme-text-muted)]">Book any 2 experiences and save 15% — Use code SUMMER15</p>
              </div>
            </div>
            <Link
              href="#packages"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              View All Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section id="packages" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Charter <span className="text-gradient-ocean">Packages</span>
            </h2>
            <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              Curated experiences for every occasion. All packages include professional crew, 
              safety equipment, and the Hey Charlie hospitality guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 6).map((pkg) => (
              <div
                key={pkg.id}
                className="group relative rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] overflow-hidden card-hover light-card"
              >
                {/* Badge */}
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium">
                    Popular
                  </div>
                )}
                {pkg.bestValue && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-medium">
                    Best Value
                  </div>
                )}

                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {pkg.category === "adventure" && "⛵"}
                    {pkg.category === "relaxation" && "🌅"}
                    {pkg.category === "culinary" && "🦞"}
                    {pkg.category === "wildlife" && "🐋"}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-orange-500 text-sm font-medium mb-1">{pkg.tagline}</p>
                    <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  </div>

                  <p className="text-[var(--theme-text-muted)] text-sm line-clamp-2">{pkg.description}</p>

                  <div className="flex items-center gap-4 text-sm text-[var(--theme-text-muted)]">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pkg.duration}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {pkg.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-[var(--theme-text-secondary)]">
                        <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-[var(--theme-border)] flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">R{pkg.price.toLocaleString()}</span>
                      <span className="text-[var(--theme-text-muted)] text-sm ml-1">{pkg.priceUnit}</span>
                    </div>
                    <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
            >
              View All Packages
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="py-24 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Explore <span className="text-gradient-sunset">Cape Town</span>
            </h2>
            <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              The Cape Peninsula offers some of the world&apos;s most dramatic coastline. 
              Let us show you the beaches, bays, and hidden gems that only locals know.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="group p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-cyan-500/30 transition-all cursor-pointer light-card"
              >
                <h3 className="text-xl font-semibold mb-1 group-hover:text-cyan-500 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-[var(--theme-text-muted)] text-sm mb-3">{dest.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
                  📍 {dest.yachts}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Guest <span className="text-gradient-ocean">Stories</span>
            </h2>
            <p className="text-[var(--theme-text-muted)]">Real experiences from real adventurers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] relative light-card"
              >
                <div className="absolute -top-4 left-8 text-6xl text-orange-500/20">&ldquo;</div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-orange-500">★</span>
                  ))}
                </div>
                <p className="text-[var(--theme-text-secondary)] mb-6 relative z-10">{t.quote}</p>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-[var(--theme-text-muted)] text-sm">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Meet <span className="text-gradient-sunset">Charlie</span>
              </h2>
              <div className="space-y-4 text-[var(--theme-text-secondary)]">
                <p>
                  Hey Charlie Charters was born from a lifelong love of the ocean and a passion for 
                  sharing Cape Town&apos;s incredible coastline with visitors from around the world.
                </p>
                <p>
                  With over 15 years of maritime experience and an intimate knowledge of every cove, 
                  reef, and fishing spot along the peninsula, Captain Charlie and the crew deliver 
                  experiences that go beyond the ordinary.
                </p>
                <p>
                  Whether you&apos;re celebrating a special occasion, seeking adventure, or simply want 
                  to witness a Cape Town sunset from the water — we&apos;ll make it unforgettable.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)]">
                  <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SAMSA Certified
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)]">
                  <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fully Insured
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)]">
                  <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Coast Guard Registered
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-[var(--theme-border)] flex items-center justify-center">
                <Image
                  src="/logo2.png"
                  alt="Hey Charlie Charters"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ready for your <span className="text-gradient-sunset">adventure</span>?
          </h2>
          <p className="text-[var(--theme-text-muted)] text-lg mb-10 max-w-2xl mx-auto">
            Get in touch to book your experience or ask us anything. 
            We typically respond within 2 hours during business hours.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <a
              href="https://wa.me/27123456789"
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-green-500/10 hover:border-green-500/20 transition-all group light-card"
            >
              <div className="text-3xl mb-3">💬</div>
              <p className="font-semibold group-hover:text-green-500 transition-colors">WhatsApp</p>
              <p className="text-[var(--theme-text-muted)] text-sm">Quick response</p>
            </a>
            <a
              href="tel:+27123456789"
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all group light-card"
            >
              <div className="text-3xl mb-3">📞</div>
              <p className="font-semibold group-hover:text-cyan-500 transition-colors">Call Us</p>
              <p className="text-[var(--theme-text-muted)] text-sm">+27 12 345 6789</p>
            </a>
            <a
              href="mailto:ahoy@heycharlycharters.co.za"
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group light-card"
            >
              <div className="text-3xl mb-3">✉️</div>
              <p className="font-semibold group-hover:text-orange-500 transition-colors">Email</p>
              <p className="text-[var(--theme-text-muted)] text-sm">ahoy@heycharlycharters.co.za</p>
            </a>
          </div>

          <div className="inline-flex items-center gap-4 text-[var(--theme-text-muted)] text-sm">
            <span>Follow us</span>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] hover:border-[var(--theme-border-hover)] transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] hover:border-[var(--theme-border-hover)] transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] hover:border-[var(--theme-border-hover)] transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--theme-border)] py-12 px-6 bg-[var(--theme-bg-secondary)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo2.png" alt="Hey Charlie Charters" width={50} height={50} className="rounded-lg" />
                <div>
                  <span 
                    className="text-lg font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Hey Charlie
                  </span>
                  <span className="block text-xs font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    CHARTERS
                  </span>
                </div>
              </div>
              <p className="text-[var(--theme-text-muted)] text-sm">
                Cape Town&apos;s premier charter experience. Unforgettable adventures on the waters of the Mother City.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Experiences</h4>
              <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Sundowner Cruises</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Whale Watching</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Fishing Charters</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Private Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Clifton Beaches</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Camps Bay</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Cape Point</a></li>
                <li><a href="#" className="hover:text-[var(--theme-text)] transition-colors">Simon&apos;s Town</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
                <li>V&A Waterfront, Cape Town</li>
                <li>+27 12 345 6789</li>
                <li>ahoy@heycharliecharters.co.za</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--theme-border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--theme-text-muted)]">
            <span>© 2026 Hey Charlie Charters. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Cancellation Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
