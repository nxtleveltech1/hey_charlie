import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/booking-utils";
import { resolvePackageImageUrl } from "@/lib/packages";

interface PackageCardProps {
  pkg: {
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
  };
}

export function PackageCard({ pkg }: PackageCardProps) {
  const imageSrc = resolvePackageImageUrl(pkg.imageUrl, pkg.slug);
  const enquiryOnly = Number(pkg.pricePerPerson) <= 0;
  const detailsHref = `/packages/${pkg.slug}`;
  const productHref = enquiryOnly ? `/packages/${pkg.slug}` : `/booking/${pkg.slug}`;

  return (
    <article
      data-testid="package-card"
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] card-hover light-card"
    >
      <Link
        href={detailsHref}
        data-testid="package-detail-link"
        aria-label={`View details for ${pkg.name}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset"
      />
      {/* Badge */}
      {pkg.isFeatured && (
        <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-1 text-[10px] font-medium text-white lg:top-4 lg:right-4 lg:px-3 lg:text-xs">
          Featured
        </div>
      )}

      <div className="h-56 sm:h-52 lg:h-56 2xl:h-64 relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
        <Image
          src={imageSrc}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-col gap-3 p-4 lg:p-5">
        <div>
          {pkg.tagline && (
            <p className="text-orange-500 text-xs lg:text-sm font-medium mb-1">{pkg.tagline}</p>
          )}
          <h3 className="text-xl lg:text-xl font-semibold">{pkg.name}</h3>
        </div>

        <p className="text-[var(--theme-text-muted)] text-sm leading-relaxed line-clamp-3 sm:line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--theme-text-muted)]">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pkg.duration}
          </span>
        </div>

        {pkg.highlights && pkg.highlights.length > 0 && (
          <ul className="space-y-1 lg:space-y-2">
            {pkg.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs lg:text-sm text-[var(--theme-text-secondary)]">
                <svg className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-20 mt-auto flex items-center justify-between gap-3 border-t border-[var(--theme-border)] pt-3 lg:pt-4">
          {enquiryOnly ? (
            <div>
              <span className="text-lg font-bold lg:text-2xl">{formatPrice(pkg.pricePerPerson)}</span>
              <span className="ml-1 text-[10px] text-[var(--theme-text-muted)] lg:text-sm">/person</span>
              <span className="block text-[10px] text-[var(--theme-text-muted)] lg:text-xs">
                Only 7 places
              </span>
            </div>
          ) : (
            <div>
              <span className="text-lg lg:text-2xl font-bold">{formatPrice(pkg.pricePerPerson)}</span>
              <span className="text-[var(--theme-text-muted)] text-[10px] lg:text-sm ml-1">/person</span>
            </div>
          )}
          <Link
            href={productHref}
            className="shrink-0 px-4 lg:px-5 py-3 lg:py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {enquiryOnly ? "Enquire Now" : "Book Now"}
          </Link>
        </div>
      </div>
    </article>
  );
}
