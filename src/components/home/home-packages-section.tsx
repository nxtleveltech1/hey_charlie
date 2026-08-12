import Link from "next/link";
import Image from "next/image";
import { PackageCard } from "@/components/package-card";
import { formatPrice } from "@/lib/booking-utils";
import { resolvePackageImageUrl } from "@/lib/packages";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

export interface HomePackage {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  duration: string;
  pricePerPerson: string;
  category: string;
  highlights: string[] | null;
  isFeatured: boolean;
  imageUrl?: string | null;
}

interface HomePackagesSectionProps {
  packages: HomePackage[];
  totalCount: number;
  /** Hide section header when the page already has its own hero title */
  hideHeader?: boolean;
  /** Show link to /packages (default true) */
  showViewAllLink?: boolean;
}

function FeaturedSpotlight({ pkg }: { pkg: HomePackage }) {
  const imageSrc = resolvePackageImageUrl(pkg.imageUrl, pkg.slug);
  const enquiryOnly = pkg.slug === "cape-courage-vip" || Number(pkg.pricePerPerson) <= 0;
  const productHref = enquiryOnly ? `/packages/${pkg.slug}` : `/booking/${pkg.slug}`;

  return (
    <Link
      href={productHref}
      className="group relative col-span-full grid overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] lg:grid-cols-2 light-card card-hover"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[280px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />
        <span className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white">
          Featured Experience
        </span>
      </div>
      <div className="flex flex-col justify-center p-5 lg:p-8">
        {pkg.tagline && (
          <p className="text-orange-500 text-sm font-medium mb-1.5">{pkg.tagline}</p>
        )}
        <h3
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pkg.name}
        </h3>
        <p className="text-[var(--theme-text-secondary)] mb-3 line-clamp-3">{pkg.description}</p>
        <div className="flex items-center gap-4 mt-auto pt-1 flex-wrap">
          <div>
            <span className="text-2xl font-bold">
              {formatPrice(pkg.pricePerPerson)}
            </span>
            <span className="text-[var(--theme-text-muted)] text-sm ml-1">/person</span>
          </div>
          <span className="sm:ml-auto rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white">
            {enquiryOnly ? "Enquire Now" : "Book Now"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomePackagesSection({
  packages,
  totalCount,
  hideHeader = false,
  showViewAllLink = true,
}: HomePackagesSectionProps) {
  const featured = packages.find((p) => p.isFeatured);
  const gridPackages = featured ? packages.filter((p) => p.id !== featured.id) : packages;

  return (
    <section
      id="packages"
      className="section-pad"
      aria-labelledby={hideHeader ? undefined : "packages-heading"}
      aria-label={hideHeader ? "Charter packages" : undefined}
    >
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            {!hideHeader && (
              <SectionHeader
                id="packages-heading"
                dense
                eyebrow="Curated for you"
                title={
                  <>
                    Charter <span className="text-gradient-ocean">Packages</span>
                  </>
                }
                subtitle="Curated experiences for every occasion. All packages include professional crew, safety equipment, and the Hey Charlie hospitality guarantee."
              />
            )}

            {packages.length === 0 ? (
              <p className="text-center text-[var(--theme-text-muted)] py-6">
                Packages coming soon — check back shortly.
              </p>
            ) : (
              <div className="section-stack">
                {featured && <FeaturedSpotlight pkg={featured} />}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {gridPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {showViewAllLink && totalCount > 0 && (
          <div className="text-center mt-6 lg:mt-8">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm lg:text-base"
            >
              View All Packages
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
