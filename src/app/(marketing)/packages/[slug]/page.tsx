import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/public/page-hero";
import { formatPrice } from "@/lib/booking-utils";
import { getPackageBySlug } from "@/lib/content/packages";
import { siteConfig } from "@/lib/content/site-config";
import { JsonLd, productJsonLd } from "@/lib/seo";

const CAPE_COURAGE_URL = "https://www.instagram.com/cape.courage/";
const CAPE_COURAGE_SLUG = "cape-courage-vip";

export function generateStaticParams() {
  return [{ slug: CAPE_COURAGE_SLUG }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg || pkg.slug !== CAPE_COURAGE_SLUG) return {};

  return {
    title: pkg.name,
    description: pkg.shortDescription,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      type: "website",
      title: `${pkg.name} | Hey Charlie Charters`,
      description: pkg.shortDescription,
      images: [{ url: pkg.heroImage, alt: `${pkg.name} event poster` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.name} | Hey Charlie Charters`,
      description: pkg.shortDescription,
      images: [pkg.heroImage],
    },
  };
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--theme-text-secondary)] sm:text-base">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-500">
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
  const pkg = getPackageBySlug(slug);

  if (!pkg || pkg.slug !== CAPE_COURAGE_SLUG) notFound();

  const enquiryMessage = encodeURIComponent(
    `Hi Hey Charlie, I'd like to enquire about the ${pkg.name}. Please send me availability and pricing details.`,
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${enquiryMessage}`;

  return (
    <>
      <JsonLd data={productJsonLd(pkg)} />

      <PageHero
        eyebrow="Limited event experience"
        title={pkg.name}
        description={pkg.shortDescription}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Packages", href: "/packages" },
          { name: pkg.name, href: `/packages/${pkg.slug}` },
        ]}
        minHeight="min-h-[50vh]"
      >
        <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          Enquire on WhatsApp
        </Button>
        <Button
          href={CAPE_COURAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="lg"
          className="border-cream/40 text-cream hover:bg-white/10"
        >
          Follow event updates
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="wide-shell grid gap-8 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative mx-auto aspect-[1000/1536] w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-navy-deep shadow-2xl">
              <Image
                src={pkg.heroImage}
                alt={`${pkg.name} event poster`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-coral/15 px-4 py-2 text-sm font-semibold text-coral">
                Only {pkg.maxGuests} places
              </span>
              <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-500">
                {pkg.durationLabel}
              </span>
              <span className="rounded-full bg-amber/15 px-4 py-2 text-sm font-semibold text-amber-deep dark:text-amber">
                {formatPrice(pkg.price)} per person
              </span>
            </div>

            <article>
              <p className="text-eyebrow mb-3 text-amber">About the event</p>
              <h2 className="mb-5 font-display text-3xl sm:text-4xl">Big-wave action from the water</h2>
              <p className="text-base leading-8 text-[var(--theme-text-secondary)] sm:text-lg">
                {pkg.longDescription}
              </p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {pkg.highlights.map((highlight) => (
                <div key={highlight} className="light-card rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5">
                  <p className="font-semibold leading-snug">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-8 border-y border-[var(--theme-border)] py-10 md:grid-cols-2">
              <div>
                <h2 className="mb-5 font-display text-2xl">What is included</h2>
                <CheckList items={pkg.inclusions} />
              </div>
              <div>
                <h2 className="mb-5 font-display text-2xl">Event timing</h2>
                <p className="mb-4 leading-relaxed text-[var(--theme-text-secondary)]">{pkg.seasonNote}</p>
                <p className="text-sm leading-relaxed text-[var(--theme-text-muted)]">
                  Departure: {pkg.departurePoint}
                </p>
              </div>
            </div>

            <div>
              <p className="text-eyebrow mb-3 text-amber">Important to know</p>
              <h2 className="mb-5 font-display text-3xl">Built around the event call</h2>
              <CheckList items={pkg.safetyNotes} />
            </div>

            <div>
              <h2 className="mb-5 font-display text-3xl">Frequently asked questions</h2>
              <div className="space-y-3">
                {pkg.faqs.map((faq) => (
                  <details key={faq.q} className="group rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 light-card">
                    <summary className="cursor-pointer list-none font-semibold marker:hidden">
                      {faq.q}
                    </summary>
                    <p className="mt-3 leading-relaxed text-[var(--theme-text-secondary)]">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-8">
              <p className="text-eyebrow mb-3 text-cyan-300">Seven places only</p>
              <h2 className="font-display text-3xl">Register your interest</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-cream-muted">
                Places are {formatPrice(pkg.price)} per person. Send us a WhatsApp enquiry for availability and the short-notice event call process.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
                  Enquire now
                </Button>
                <Button href={CAPE_COURAGE_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg" className="border-cream/40 text-cream hover:bg-white/10">
                  Cape Courage on Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
