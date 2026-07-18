import Image from "next/image";
import { formatPrice } from "@/lib/booking-utils";
import { resolvePackageImageUrl } from "@/lib/packages";

interface BookingPackageSummaryProps {
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  duration: string;
  pricePerPerson: string;
  minGuests: number;
  maxGuests: number;
  highlights: string[] | null;
  imageUrl?: string | null;
  category?: string | null;
}

export function BookingPackageSummary({
  name,
  slug,
  tagline,
  description,
  duration,
  pricePerPerson,
  minGuests,
  maxGuests,
  highlights,
  imageUrl,
}: BookingPackageSummaryProps) {
  const imageSrc = resolvePackageImageUrl(imageUrl, slug);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] card-hover light-card lg:sticky lg:top-28">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 sm:h-44">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent" />
      </div>

      <div className="p-5 lg:p-6">
        {tagline && (
          <p className="mb-1 text-sm font-medium text-orange-500">{tagline}</p>
        )}
        <h2
          className="mb-3 text-xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {name}
        </h2>

        <p className="mb-5 text-sm leading-relaxed text-[var(--theme-text-muted)]">
          {description}
        </p>

        <div className="mb-5 space-y-3 border-b border-[var(--theme-border)] pb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[var(--theme-text-muted)]">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration
            </span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[var(--theme-text-muted)]">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Group size
            </span>
            <span>
              {minGuests} – {maxGuests} guests
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[var(--theme-text-muted)]">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price per person
            </span>
            <span className="font-semibold">{formatPrice(pricePerPerson)}</span>
          </div>
        </div>

        {highlights && highlights.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold">Included</h3>
            <ul className="space-y-2">
              {highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--theme-text-muted)]"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
