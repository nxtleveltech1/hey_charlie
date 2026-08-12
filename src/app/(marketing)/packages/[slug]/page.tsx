import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { packages as packageTable } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/booking-utils";
import {
  getPackageBySlug,
  getPackages,
  resolvePackageImageUrl,
} from "@/lib/content/packages";
import { siteConfig } from "@/lib/content/site-config";
import { JsonLd, productJsonLd } from "@/lib/seo";

const CAPE_COURAGE_URL = "https://www.instagram.com/cape.courage/";
const CAPE_COURAGE_SLUG = "cape-courage-vip";

// Package names, descriptions, prices and imagery are managed in admin.
// Render at request time so public detail pages always reflect the latest row.
export const dynamic = "force-dynamic";

const loadPackage = cache(async (slug: string) => {
  const content = getPackageBySlug(slug);
  const row = await db.query.packages.findFirst({
    where: eq(packageTable.slug, slug),
  });

  if (!content && (!row || !row.isActive)) return null;

  const price = Number(row?.pricePerPerson ?? content?.price ?? 0);
  const image = resolvePackageImageUrl(row?.imageUrl ?? content?.heroImage, slug);

  return {
    slug,
    name: row?.name ?? content!.name,
    tagline: row?.tagline ?? content?.tagline ?? null,
    description: row?.description ?? content!.shortDescription,
    longDescription: content?.longDescription ?? row!.description,
    duration: row?.duration ?? content!.durationLabel,
    price,
    minGuests: row?.minGuests ?? content?.minGuests ?? 1,
    maxGuests: row?.maxGuests ?? content?.maxGuests ?? 12,
    highlights: row?.highlights?.length ? row.highlights : content?.highlights ?? [],
    inclusions: content?.inclusions ?? [],
    safetyNotes: content?.safetyNotes ?? [],
    seasonNote: content?.seasonNote ?? null,
    departurePoint: content?.departurePoint ?? null,
    faqs: content?.faqs ?? [],
    image,
    content,
    isBookable:
      slug === CAPE_COURAGE_SLUG ||
      (Boolean(row?.isActive) && !content?.byRequest && price > 0),
  };
});

export async function generateStaticParams() {
  const rows = await db
    .select({ slug: packageTable.slug })
    .from(packageTable)
    .where(eq(packageTable.isActive, true));
  const slugs = new Set([...getPackages().map((pkg) => pkg.slug), ...rows.map((row) => row.slug)]);

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await loadPackage(slug);

  if (!pkg) return {};

  return {
    title: pkg.name,
    description: pkg.description,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      type: "website",
      title: `${pkg.name} | Hey Charlie Charters`,
      description: pkg.description,
      images: [{ url: pkg.image, alt: pkg.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.name} | Hey Charlie Charters`,
      description: pkg.description,
      images: [pkg.image],
    },
  };
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed text-[var(--theme-text-secondary)] sm:text-base"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await loadPackage(slug);

  if (!pkg) notFound();

  const enquiryMessage = encodeURIComponent(
    `Hi Hey Charlie, I'd like to enquire about the ${pkg.name}. Please send me availability and pricing details.`,
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${enquiryMessage}`;
  const primaryHref = pkg.isBookable ? `/booking/${pkg.slug}` : whatsappUrl;
  const isCapeCourage = pkg.slug === CAPE_COURAGE_SLUG;
  const primaryLabel = pkg.isBookable
    ? isCapeCourage
      ? "Book Your Spot Now"
      : "Book this charter"
    : "Enquire on WhatsApp";

  return (
    <>
      {pkg.content && <JsonLd data={productJsonLd(pkg.content)} />}

      <section
        data-testid="package-detail-hero"
        data-theme-surface="true"
        className="relative overflow-hidden border-b border-[var(--theme-border)] bg-[var(--theme-card-bg)] pb-14 pt-28 sm:pb-16 lg:pt-36"
      >
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-28 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-orange-400/15 blur-3xl"
        />

        <div className="wide-shell relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-14">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--theme-text-muted)]">
                <li><Link href="/" className="transition-colors hover:text-cyan-600">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/packages" className="transition-colors hover:text-cyan-600">Packages</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-[var(--theme-text)]">{pkg.name}</li>
              </ol>
            </nav>

            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              <span className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />
              {isCapeCourage ? "Limited event experience" : pkg.tagline ?? "Hey Charlie charter experience"}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[var(--theme-text)] text-balance sm:text-5xl lg:text-7xl font-display">
              {pkg.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--theme-text-secondary)] sm:text-lg lg:text-xl">
              {pkg.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-cyan-500/12 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                {pkg.duration}
              </span>
              <span className="rounded-full bg-orange-500/12 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-300">
                {formatPrice(pkg.price)} per person
              </span>
              <span className="rounded-full bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-600 dark:text-pink-300">
                Up to {pkg.maxGuests} guests
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={primaryHref}
                target={pkg.isBookable ? undefined : "_blank"}
                rel={pkg.isBookable ? undefined : "noopener noreferrer"}
                variant={pkg.isBookable ? "coral" : "whatsapp"}
                size="lg"
              >
                {primaryLabel}
              </Button>
              {isCapeCourage ? (
                <Button href={CAPE_COURAGE_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                  Follow event updates
                </Button>
              ) : (
                <Button href="/packages" variant="secondary" size="lg">
                  Browse all packages
                </Button>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className={`relative overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl ${isCapeCourage ? "aspect-[1000/1260]" : "aspect-[4/3]"}`}>
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className={isCapeCourage ? "object-contain" : "object-cover"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="wide-shell grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-14">
          <div className="space-y-10">
            <article>
              <p className="text-eyebrow mb-3 text-orange-500">About the experience</p>
              <h2 className="mb-5 text-3xl font-bold font-display sm:text-4xl">
                {isCapeCourage ? "Big-wave action from the water" : pkg.tagline ?? pkg.name}
              </h2>
              <p className="text-base leading-8 text-[var(--theme-text-secondary)] sm:text-lg">
                {pkg.longDescription}
              </p>
            </article>

            {pkg.highlights.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold font-display">Experience highlights</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pkg.highlights.map((highlight) => (
                    <div key={highlight} className="light-card rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5">
                      <p className="font-semibold leading-snug">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(pkg.inclusions.length > 0 || pkg.seasonNote) && (
              <div className="grid gap-8 border-y border-[var(--theme-border)] py-10 md:grid-cols-2">
                {pkg.inclusions.length > 0 && (
                  <div>
                    <h2 className="mb-5 text-2xl font-bold font-display">What is included</h2>
                    <CheckList items={pkg.inclusions} />
                  </div>
                )}
                {pkg.seasonNote && (
                  <div>
                    <h2 className="mb-5 text-2xl font-bold font-display">Timing and departure</h2>
                    <p className="mb-4 leading-relaxed text-[var(--theme-text-secondary)]">{pkg.seasonNote}</p>
                    {pkg.departurePoint && (
                      <p className="text-sm leading-relaxed text-[var(--theme-text-muted)]">Departure: {pkg.departurePoint}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {pkg.safetyNotes.length > 0 && (
              <div>
                <p className="text-eyebrow mb-3 text-orange-500">Important to know</p>
                <h2 className="mb-5 text-3xl font-bold font-display">
                  {isCapeCourage ? "Built around the event call" : "Safety and conditions"}
                </h2>
                <CheckList items={pkg.safetyNotes} />
              </div>
            )}

            {pkg.faqs.length > 0 && (
              <div>
                <h2 className="mb-5 text-3xl font-bold font-display">Frequently asked questions</h2>
                <div className="space-y-3">
                  {pkg.faqs.map((faq) => (
                    <details key={faq.q} className="group rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 light-card">
                      <summary className="cursor-pointer list-none font-semibold marker:hidden">{faq.q}</summary>
                      <p className="mt-3 leading-relaxed text-[var(--theme-text-secondary)]">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="light-card rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                {isCapeCourage ? `Only ${pkg.maxGuests} places` : "Plan your charter"}
              </p>
              <p className="mt-3 text-3xl font-bold">{formatPrice(pkg.price)}</p>
              <p className="text-sm text-[var(--theme-text-muted)]">per person</p>

              <dl className="mt-6 space-y-4 border-y border-[var(--theme-border)] py-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--theme-text-muted)]">Duration</dt>
                  <dd className="text-right font-semibold">{pkg.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--theme-text-muted)]">Group size</dt>
                  <dd className="text-right font-semibold">{pkg.minGuests}–{pkg.maxGuests} guests</dd>
                </div>
              </dl>

              <Button
                href={primaryHref}
                target={pkg.isBookable ? undefined : "_blank"}
                rel={pkg.isBookable ? undefined : "noopener noreferrer"}
                variant={pkg.isBookable ? "coral" : "whatsapp"}
                size="block"
                className="mt-6"
              >
                {primaryLabel}
              </Button>
              <p className="mt-4 text-center text-xs leading-relaxed text-[var(--theme-text-muted)]">
                Questions first? Call {siteConfig.phoneDisplay} or send us a WhatsApp message.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
