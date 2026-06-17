import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/booking-utils";
import { resolvePackageImageUrl } from "@/lib/packages";

interface BookingHeroProps {
  name: string;
  slug: string;
  tagline: string | null;
  duration: string;
  pricePerPerson: string;
  imageUrl?: string | null;
}

export function BookingHero({
  name,
  slug,
  tagline,
  duration,
  pricePerPerson,
  imageUrl,
}: BookingHeroProps) {
  const imageSrc = resolvePackageImageUrl(imageUrl, slug);

  return (
    <section className="relative h-[38vh] min-h-[280px] max-h-[420px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[var(--theme-bg)]" />
      </div>

      <div className="relative flex h-full items-end pb-8 lg:pb-10">
        <div className="wide-shell w-full">
          <Link
            href="/packages"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Packages
          </Link>

          {tagline && (
            <p className="mb-2 text-sm font-medium text-orange-400">{tagline}</p>
          )}

          <h1
            className="mb-4 max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </h1>

          <div className="flex flex-wrap gap-2">
            <span className="glass-panel-media inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white sm:text-sm">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}
            </span>
            <span className="glass-panel-media inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white sm:text-sm">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatPrice(pricePerPerson)} / person
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
