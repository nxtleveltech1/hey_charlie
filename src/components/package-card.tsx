import Link from "next/link";
import { formatPrice } from "@/lib/booking-utils";

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
  };
}

export function PackageCard({ pkg }: PackageCardProps) {
  const categoryIcons: Record<string, string> = {
    adventure: "⛵",
    relaxation: "🌅",
    culinary: "🦞",
    wildlife: "🐋",
    fishing: "🎣",
    private: "🥂",
  };

  return (
    <div className="group relative rounded-2xl lg:rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] overflow-hidden card-hover light-card">
      {/* Badge */}
      {pkg.isFeatured && (
        <div className="absolute top-3 lg:top-4 right-3 lg:right-4 z-10 px-2 lg:px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] lg:text-xs font-medium">
          Featured
        </div>
      )}

      {/* Image placeholder */}
      <div className="h-32 lg:h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl lg:text-6xl opacity-30">
          {categoryIcons[pkg.category] || "⛵"}
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
        <div>
          {pkg.tagline && (
            <p className="text-orange-500 text-xs lg:text-sm font-medium mb-1">{pkg.tagline}</p>
          )}
          <h3 className="text-base lg:text-xl font-semibold">{pkg.name}</h3>
        </div>

        <p className="text-[var(--theme-text-muted)] text-xs lg:text-sm line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex items-center gap-4 text-xs lg:text-sm text-[var(--theme-text-muted)]">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pkg.duration}
          </span>
        </div>

        {pkg.highlights && pkg.highlights.length > 0 && (
          <ul className="space-y-1 lg:space-y-2 hidden sm:block">
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

        <div className="pt-3 lg:pt-4 border-t border-[var(--theme-border)] flex items-center justify-between">
          <div>
            <span className="text-lg lg:text-2xl font-bold">{formatPrice(pkg.pricePerPerson)}</span>
            <span className="text-[var(--theme-text-muted)] text-[10px] lg:text-sm ml-1">/person</span>
          </div>
          <Link
            href={`/booking/${pkg.slug}`}
            className="px-3 lg:px-5 py-2 lg:py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs lg:text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

