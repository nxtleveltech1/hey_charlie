import Link from "next/link";
import Image from "next/image";
import { homeDestinations, categoryLabels } from "@/lib/home-content";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

export function DestinationsPreview() {
  const [featured, ...rest] = homeDestinations;

  return (
    <section id="destinations" className="section-pad bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" aria-labelledby="destinations-heading">
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="destinations-heading"
              dense
              eyebrow="Cape Peninsula"
              title={
                <>
                  Explore <span className="text-gradient-sunset">Cape Town</span>
                </>
              }
              subtitle="The Cape Peninsula offers some of the world's most dramatic coastline. Let us show you the beaches, bays, and hidden gems that only locals know."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              {featured && (
                <Link
                  href={`/destinations/${featured.slug}`}
                  className="group relative block min-h-[240px] overflow-hidden rounded-2xl border border-[var(--theme-border)] light-card card-hover sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[320px]"
                >
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 lg:p-6">
                    <span className="mb-1.5 inline-block rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs text-cyan-300">
                      {categoryLabels[featured.category] ?? featured.category}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-0.5">{featured.name}</h3>
                    <p className="text-white/75 text-sm">{featured.description}</p>
                  </div>
                </Link>
              )}

              {rest.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="group relative block min-h-[160px] overflow-hidden rounded-xl lg:rounded-2xl border border-[var(--theme-border)] light-card card-hover lg:min-h-[180px]"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-3.5 lg:p-4">
                    <h3 className="text-sm lg:text-base font-semibold group-hover:text-cyan-500 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-[var(--theme-text-muted)] text-xs line-clamp-1">{dest.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <div className="text-center mt-6 lg:mt-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm lg:text-base"
          >
            View All Destinations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
