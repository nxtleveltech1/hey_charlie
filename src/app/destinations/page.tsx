import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { locations } from "@/lib/locations";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Destinations | Hey Charlie Charters",
  description: "Explore Cape Town's most spectacular coastal destinations. From Clifton's pristine beaches to Cape Point's dramatic cliffs — discover where our charters will take you.",
};

export default function DestinationsPage() {
  const beachLocations = locations.filter((loc) => loc.category === "beach");
  const harborLocations = locations.filter((loc) => loc.category === "harbor");
  const marineLocations = locations.filter((loc) => loc.category === "marine-reserve");
  const landmarkLocations = locations.filter((loc) => loc.category === "landmark");

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 transition-colors duration-300"
          style={{ background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))` }}
        />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-float" style={{ background: "var(--theme-glow-cyan)" }} />
        <div className="absolute top-60 left-10 w-[400px] h-[400px] rounded-full blur-3xl animate-float-delayed" style={{ background: "var(--theme-glow-orange)" }} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl z-50 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-nav-bg-transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={100}
                height={100}
                className="rounded-xl"
              />
              <div>
                <span 
                  className="text-xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hey Charlie
                </span>
                <span className="block text-xs font-semibold tracking-wider italic bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/#experiences" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Experiences
              </Link>
              <Link href="/#packages" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Packages
              </Link>
              <Link href="/destinations" className="text-sm text-[var(--theme-text)] font-medium">
                Destinations
              </Link>
              <Link href="/#contact" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/#packages"
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity btn-primary"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 lg:pt-40 pb-16 lg:pb-24 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm text-cyan-600 dark:text-cyan-300 mb-6">
            <span>🗺️</span>
            <span>6 Stunning Locations</span>
          </div>

          <h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore <span className="text-gradient-sunset">Cape Town&apos;s</span><br />
            <span className="text-gradient-ocean">Coastline</span>
          </h1>

          <p className="text-lg text-[var(--theme-text-muted)] max-w-2xl mx-auto mb-12">
            From the sheltered bays of Clifton to the dramatic cliffs of Cape Point — 
            discover the incredible destinations we visit on our charter experiences.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <a href="#beaches" className="px-5 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-orange-500/30 hover:bg-orange-500/10 transition-all text-sm">
              🏖️ Beaches
            </a>
            <a href="#harbors" className="px-5 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all text-sm">
              ⚓ Harbors
            </a>
            <a href="#marine-reserves" className="px-5 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-green-500/30 hover:bg-green-500/10 transition-all text-sm">
              🐧 Marine Reserves
            </a>
            <a href="#landmarks" className="px-5 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-purple-500/30 hover:bg-purple-500/10 transition-all text-sm">
              🏔️ Landmarks
            </a>
          </div>
        </div>
      </section>

      {/* Featured Destination - Full Width */}
      <section className="px-4 lg:px-6 mb-16 lg:mb-24">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/destinations/${locations[0].slug}`}
            className="group relative block aspect-[21/9] rounded-3xl overflow-hidden"
          >
            <Image
              src={locations[0].heroImage}
              alt={locations[0].name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 lg:p-16">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-medium mb-4">
                  ⭐ Featured Destination
                </span>
                <h2 
                  className="text-3xl lg:text-5xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {locations[0].name}
                </h2>
                <p className="text-white/80 text-lg mb-6 line-clamp-2">
                  {locations[0].heroDescription}
                </p>
                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all">
                  Explore {locations[0].name}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Beaches Section */}
      <section id="beaches" className="py-12 lg:py-16 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🏖️</span>
            <h2 
              className="text-2xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-sunset">Beaches</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {beachLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden card-hover"
              >
                <Image
                  src={location.heroImage}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {location.name}
                  </h3>
                  <p className="text-white/70 text-sm lg:text-base mb-4 line-clamp-2">
                    {location.tagline}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/60">{location.experiences.length} experiences</span>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                      Explore
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Harbors Section */}
      <section id="harbors" className="py-12 lg:py-16 px-4 lg:px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">⚓</span>
            <h2 
              className="text-2xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-ocean">Harbors & Towns</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {harborLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden card-hover"
              >
                <Image
                  src={location.heroImage}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {location.name}
                  </h3>
                  <p className="text-white/70 text-sm lg:text-base mb-4 line-clamp-2">
                    {location.tagline}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/60">{location.experiences.length} experiences</span>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                      Explore
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marine Reserves Section */}
      <section id="marine-reserves" className="py-12 lg:py-16 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🐧</span>
            <h2 
              className="text-2xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-sunset">Marine Reserves</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8">
            {marineLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                className="group relative aspect-[21/9] rounded-2xl overflow-hidden card-hover"
              >
                <Image
                  src={location.heroImage}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center p-8 lg:p-12">
                  <div className="max-w-lg">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {location.name}
                    </h3>
                    <p className="text-white/70 text-sm lg:text-base mb-4">
                      {location.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {location.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs">
                          {h.icon} {h.title}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                      Explore
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks Section */}
      <section id="landmarks" className="py-12 lg:py-16 px-4 lg:px-6 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🏔️</span>
            <h2 
              className="text-2xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-ocean">Landmarks</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-1 gap-6 lg:gap-8">
            {landmarkLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/destinations/${location.slug}`}
                className="group relative aspect-[21/9] rounded-2xl overflow-hidden card-hover"
              >
                <Image
                  src={location.heroImage}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center p-8 lg:p-12">
                  <div className="max-w-lg">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {location.name}
                    </h3>
                    <p className="text-white/70 text-sm lg:text-base mb-4">
                      {location.tagline}
                    </p>
                    <p className="text-white/60 text-sm mb-6 max-w-md line-clamp-2">
                      {location.heroDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                      Explore
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-2xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our <span className="text-gradient-sunset">Sailing Routes</span>
            </h2>
            <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              From the V&A Waterfront to Cape Point, we cover the entire Cape Peninsula coastline. 
              Each destination offers unique experiences and unforgettable views.
            </p>
          </div>

          {/* Stylized route visualization */}
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-slate-900/30 border border-[var(--theme-border)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-[var(--theme-text-muted)]">Interactive map coming soon</p>
                <p className="text-sm text-[var(--theme-text-muted)] mt-2">
                  Contact us to plan your custom route
                </p>
              </div>
            </div>
            
            {/* Location markers */}
            <div className="absolute top-[20%] left-[30%] w-4 h-4 rounded-full bg-orange-500 animate-pulse" title="Clifton" />
            <div className="absolute top-[25%] left-[35%] w-4 h-4 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: "0.5s" }} title="Camps Bay" />
            <div className="absolute top-[40%] left-[25%] w-4 h-4 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "1s" }} title="Hout Bay" />
            <div className="absolute top-[60%] left-[60%] w-4 h-4 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "1.5s" }} title="Simon's Town" />
            <div className="absolute top-[75%] left-[55%] w-4 h-4 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "2s" }} title="Cape Point" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-2xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to explore the <span className="text-gradient-sunset">Cape Coast</span>?
          </h2>
          <p className="text-[var(--theme-text-muted)] mb-8 max-w-xl mx-auto">
            Book your charter experience today and discover why Cape Town has some of the most spectacular coastline in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#packages"
              className="px-8 py-4 font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all btn-primary"
            >
              View Experiences
            </Link>
            <Link
              href="/#contact"
              className="px-8 py-4 font-medium border border-[var(--theme-border)] rounded-full hover:bg-[var(--theme-surface)] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--theme-border)] py-10 lg:py-12 px-4 lg:px-6 bg-[var(--theme-bg-secondary)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--theme-text-muted)]">
            <div className="flex items-center gap-3">
              <Image src="/logo2.png" alt="Hey Charlie Charters" width={32} height={32} className="rounded-lg" />
              <span>© 2026 Hey Charlie Charters</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-[var(--theme-text)] transition-colors">Home</Link>
              <Link href="/destinations" className="hover:text-[var(--theme-text)] transition-colors">Destinations</Link>
              <Link href="/#contact" className="hover:text-[var(--theme-text)] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

