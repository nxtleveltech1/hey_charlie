import { createElement } from "react";
import { siteConfig } from "@/lib/content/site-config";
import { getPackages, type Package } from "@/lib/content/packages";

/**
 * JSON-LD builder helpers for Hey Charlie Charters.
 *
 * Every builder returns a plain schema.org object. Pages render them through
 * the `<JsonLd data={...} />` component below. All URLs are absolute, rooted at
 * the canonical domain (https://heycharliecharters.com).
 *
 * ── POLICY (non-negotiable) ──────────────────────────────────────────────
 * NO fabricated ratings, reviews, star values or review counts are ever
 * emitted. `aggregateRating` and `Review` are intentionally OMITTED from every
 * builder because no verified, source-backed rating exists yet
 * (siteConfig.reviews.enabled === false). Emitting an unverified
 * `aggregateRating` violates Google's structured-data policy and risks a manual
 * penalty. Re-enable ONLY once a verified review source (Google Business
 * Profile, Trustpilot, etc.) is integrated and feeding real data.
 * ─────────────────────────────────────────────────────────────────────────
 */

const BASE = siteConfig.canonicalUrl.replace(/\/$/, "");

type JsonLdObject = Record<string, unknown>;

/** Join the canonical base with a path, producing an absolute URL. */
function abs(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * `LocalBusiness` for the operator. No `aggregateRating` (see POLICY above).
 */
export function localBusinessJsonLd(): JsonLdObject {
  const a = siteConfig.addressStructured;

  // Derive an honest price range from the catalogue. Exclude on-request
  // packages whose price is 0 so the band reflects bookable rates.
  const priced = getPackages().filter((p) => p.price > 0);
  const min = priced.length ? Math.min(...priced.map((p) => p.price)) : 0;
  const max = priced.length ? Math.max(...priced.map((p) => p.price)) : 0;
  const priceRange = priced.length ? `R${min}–R${max}` : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": abs("/#business"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: BASE,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: abs(siteConfig.heroPoster),
    logo: abs("/logo2.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.suburb,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: "ZA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    areaServed: "Cape Town",
    ...(priceRange ? { priceRange } : {}),
    // sameAs intentionally empty: social profiles are unverified (REQUIRED
    // sentinels in siteConfig). Do NOT fabricate profile URLs here.
    sameAs: [],
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative (e.g. "/packages") or absolute path. */
  url: string;
}

/**
 * `BreadcrumbList`. Pass crumbs root-first; `position` is assigned automatically.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

/**
 * `Product` for a charter package.
 *
 * - `priceUnit === "request"` (or price <= 0) is treated as quote-on-request:
 *   price is omitted and the Offer description reads "Request a quote".
 * - No `aggregateRating` (see POLICY above).
 *
 * NOTE: resolves to `/packages/[slug]`, the conventional product URL. The
 * package detail route is not shipped yet; the builder is forward-looking so it
 * is correct once that route lands.
 */
export function productJsonLd(pkg: Package): JsonLdObject {
  const productUrl = abs(`/packages/${pkg.slug}`);
  const isRequest = pkg.priceUnit === "request" || pkg.price <= 0;

  const offer: JsonLdObject = {
    "@type": "Offer",
    url: productUrl,
    availability: "https://schema.org/InStock",
    priceCurrency: "ZAR",
  };

  if (isRequest) {
    offer.description = "Request a quote";
  } else {
    offer.price = pkg.price;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.shortDescription,
    url: productUrl,
    image: abs(pkg.heroImage),
    offers: offer,
  };
}

export interface FaqJsonLdItem {
  question: string;
  acceptedAnswer: string;
}

/** `FAQPage`. Pass the visible Q&A pairs. */
export function faqJsonLd(items: FaqJsonLdItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.acceptedAnswer,
      },
    })),
  };
}

export interface ArticleJsonLdInput {
  slug: string;
  headline: string;
  description: string;
  /** ISO 8601 publish timestamp. */
  datePublished: string;
  /** ISO 8601 last-modified timestamp (defaults to datePublished when omitted). */
  dateModified?: string;
  /** Author display name; falls back to the organisation. */
  author?: string;
  /** Site-relative or absolute hero image. */
  image?: string;
}

/**
 * `NewsArticle` for a published news article.
 *
 * NOTE: resolves to `/news/[slug]`. Published articles live in the DB and are
 * enumerated dynamically by the news pages; this builder is called per-article
 * from those pages.
 */
export function articleJsonLd(article: ArticleJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    url: abs(`/news/${article.slug}`),
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: abs("/logo2.png") },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": abs(`/news/${article.slug}`),
    },
    ...(article.image ? { image: abs(article.image) } : {}),
  };
}

/**
 * Server-only React component that serialises a JSON-LD object (or array) into
 * a `<script type="application/ld+json">` tag.
 *
 * It has no `"use client"` directive, so in the App Router it is a React Server
 * Component by default and never reaches the client bundle. Built with
 * `createElement` (no JSX) so this file can stay a `.ts` module. The `<`
 * character is escaped to prevent any `</script>` breakout from
 * user-influenced strings.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: json },
  });
}
