/**
 * Backward-compatibility facade over the canonical content module.
 *
 * The real catalogue + image lookups live in `@/lib/content/packages` and
 * `@/lib/content/offers`. This module keeps the legacy exports (`packages`,
 * `specialOffers`, `getFallbackPackageImage`, `PACKAGE_IMAGE_BY_SLUG`, `Package`)
 * alive so existing imports keep resolving while other waves migrate to the
 * content module.
 *
 * The 7 phantom alias slugs (crayfish-catch-cook, whale-watching-expedition,
 * beach-hopping-adventure, seafood-beach-feast, fishing-charter,
 * coastline-crawler, private-celebration) have been removed.
 */

import {
  getPackages,
  getActiveOffers,
  getOffSeasonServices,
  getFallbackPackageImage,
  resolvePackageImageUrl,
  PACKAGE_IMAGE_BY_SLUG,
  type Package as ContentPackage,
} from "@/lib/content";

export {
  getFallbackPackageImage,
  resolvePackageImageUrl,
  getOffSeasonServices,
  PACKAGE_IMAGE_BY_SLUG,
};

/** Legacy package shape kept for backward compatibility. */
export interface Package {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  price: number;
  priceUnit: string;
  highlights: string[];
  image: string;
  category: "adventure" | "relaxation" | "culinary" | "wildlife" | "fishing" | "private";
  popular?: boolean;
  bestValue?: boolean;
}

const CATEGORY_MAP: Record<
  ContentPackage["category"],
  Package["category"]
> = {
  sundowner: "relaxation",
  private: "private",
  "whale-watching": "wildlife",
  fishing: "fishing",
  crayfish: "culinary",
  "beach-hopping": "adventure",
  corporate: "private",
  coastal: "adventure",
  wildlife: "wildlife",
  shipwreck: "adventure",
  "event-support": "private",
  custom: "private",
};

/** Maps the canonical content Package into the legacy UI shape. */
function toLegacyPackage(pkg: ContentPackage): Package {
  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    tagline: pkg.tagline,
    description: pkg.shortDescription,
    duration: pkg.durationLabel,
    price: pkg.price,
    priceUnit: pkg.priceUnit,
    highlights: pkg.highlights,
    image: pkg.heroImage,
    category: CATEGORY_MAP[pkg.category],
    ...(pkg.popular ? { popular: pkg.popular } : {}),
    ...(pkg.bestValue ? { bestValue: pkg.bestValue } : {}),
  };
}

export const packages: Package[] = getPackages().map(toLegacyPackage);

/**
 * Active special offers for the UI. Sourced from the content module's
 * `getActiveOffers()` so expired offers can never render. The legacy shape
 * (`{ id, title, description, validUntil, code }`) is preserved.
 */
export const specialOffers = getActiveOffers().map((o) => ({
  id: o.id,
  title: o.title,
  description: o.description,
  validUntil: o.validUntilDisplay,
  code: o.code,
}));
