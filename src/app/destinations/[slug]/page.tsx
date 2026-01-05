import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { locations, getLocationBySlug } from "@/lib/locations";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export async function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  
  if (!location) {
    return { title: "Location Not Found" };
  }

  return {
    title: `${location.name} | Hey Charlie Charters`,
    description: location.heroDescription,
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300">
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl bg-[var(--theme-nav-bg)] z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={50}
                height={50}
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

      {/* Hero Section with Video/Image */}
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={location.heroImage}
            alt={location.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[var(--theme-bg)]" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-end pb-12 lg:pb-20 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Destinations
              </Link>
            </div>

            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white mb-4">
              <span>
                {location.category === "beach" && "🏖️"}
                {location.category === "harbor" && "⚓"}
                {location.category === "marine-reserve" && "🐧"}
                {location.category === "landmark" && "🏔️"}
              </span>
              <span className="capitalize">{location.category.replace("-", " ")}</span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 max-w-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {location.name}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
              {location.tagline}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                <span>📍</span>
                <span>{location.experiences.length} Experiences Available</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                <span>🌡️</span>
                <span>{location.bestTimeToVisit.split(" ")[0]} {location.bestTimeToVisit.split(" ")[1]} {location.bestTimeToVisit.split(" ")[2]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Play Video Button */}
        {location.heroVideo && (
          <button 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group hover:scale-110 transition-transform"
            aria-label="Play video"
          >
            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Description Section */}
        <section className="py-12 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 
                className="text-2xl lg:text-4xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                About <span className="text-gradient-sunset">{location.name}</span>
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {location.fullDescription.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-[var(--theme-text-secondary)] leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Quick Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] light-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span>ℹ️</span> Quick Info
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-[var(--theme-text-muted)] mb-1">Best Time to Visit</p>
                      <p className="text-[var(--theme-text-secondary)]">{location.bestTimeToVisit}</p>
                    </div>
                    <div>
                      <p className="text-[var(--theme-text-muted)] mb-1">Weather</p>
                      <p className="text-[var(--theme-text-secondary)]">{location.weatherNote}</p>
                    </div>
                    <div>
                      <p className="text-[var(--theme-text-muted)] mb-1">Getting There</p>
                      <p className="text-[var(--theme-text-secondary)]">{location.accessInfo}</p>
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-gradient-to-br from-orange-500/10 to-pink-500/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span>💡</span> Insider Tips
                  </h3>
                  <ul className="space-y-3">
                    {location.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--theme-text-secondary)]">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-12 lg:py-16 border-t border-[var(--theme-border)]">
          <h2 
            className="text-2xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Why Visit <span className="text-gradient-ocean">{location.name}</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {location.highlights.map((highlight, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-cyan-500/30 transition-all card-hover light-card"
              >
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-[var(--theme-text-muted)] text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="py-12 lg:py-16 border-t border-[var(--theme-border)]">
          <h2 
            className="text-2xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-gradient-sunset">Gallery</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {location.gallery.map((image, i) => (
              <div
                key={i}
                className={`relative group overflow-hidden rounded-xl lg:rounded-2xl ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <div className={`relative ${i === 0 ? "aspect-[4/3]" : "aspect-square"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm lg:text-base font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        {location.videos.length > 0 && (
          <section className="py-12 lg:py-16 border-t border-[var(--theme-border)]">
            <h2 
              className="text-2xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-ocean">Videos</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {location.videos.map((video, i) => (
                <div key={i} className="group">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[var(--theme-border)]">
                    {/* Video Thumbnail with Play Button */}
                    <div className="relative w-full h-full">
                      {video.thumbnail && (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold text-center">{video.title}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experiences Section */}
        <section className="py-12 lg:py-20 border-t border-[var(--theme-border)]">
          <div className="text-center mb-10 lg:mb-16">
            <h2 
              className="text-2xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Experiences at <span className="text-gradient-sunset">{location.name}</span>
            </h2>
            <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              Curated adventures departing from or visiting {location.name}. All experiences include professional crew and the Hey Charlie hospitality guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {location.experiences.map((exp, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-orange-500/30 transition-all card-hover light-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{exp.icon}</div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium">
                    {exp.duration}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{exp.name}</h3>
                <p className="text-[var(--theme-text-muted)] text-sm mb-6">{exp.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--theme-border)]">
                  <div>
                    <span className="text-2xl font-bold">R{exp.price.toLocaleString()}</span>
                    <span className="text-[var(--theme-text-muted)] text-sm ml-1">
                      {exp.packageId === "private-charter" ? "/half day" : "/person"}
                    </span>
                  </div>
                  <Link
                    href={`/booking/${exp.packageId}`}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Attractions */}
        <section className="py-12 lg:py-16 border-t border-[var(--theme-border)]">
          <h2 
            className="text-2xl lg:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nearby <span className="text-gradient-ocean">Attractions</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {location.nearbyAttractions.map((attraction, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] text-sm text-[var(--theme-text-secondary)] hover:border-cyan-500/30 transition-colors cursor-default"
              >
                {attraction}
              </span>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-20 border-t border-[var(--theme-border)]">
          <div className="relative p-8 lg:p-16 rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-cyan-500/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            
            <div className="relative text-center">
              <h2 
                className="text-2xl lg:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to explore <span className="text-gradient-sunset">{location.name}</span>?
              </h2>
              <p className="text-[var(--theme-text-muted)] max-w-xl mx-auto mb-8">
                Book your adventure today and discover why this is one of Cape Town's most spectacular destinations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#packages"
                  className="px-8 py-4 font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all btn-primary"
                >
                  View All Packages
                </Link>
                <Link
                  href="/#contact"
                  className="px-8 py-4 font-medium border border-[var(--theme-border)] rounded-full hover:bg-[var(--theme-surface)] transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other Destinations */}
        <section className="py-12 lg:py-16 border-t border-[var(--theme-border)]">
          <h2 
            className="text-2xl lg:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore More <span className="text-gradient-ocean">Destinations</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {locations
              .filter((loc) => loc.slug !== location.slug)
              .slice(0, 5)
              .map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/destinations/${loc.slug}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <Image
                    src={loc.heroImage}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm lg:text-base">{loc.name}</h3>
                    <p className="text-white/70 text-xs mt-1 line-clamp-1">{loc.tagline}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--theme-border)] py-10 lg:py-12 px-4 lg:px-6 bg-[var(--theme-bg-secondary)] transition-colors duration-300 mt-12">
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

