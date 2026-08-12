import { getPackageBySlug } from "@/lib/content/packages";

export interface MarketingPackageRow {
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

const promotedSlugs = ["cape-courage-vip"] as const;

/**
 * Keep limited campaign products visible immediately after deployment, even
 * before the booking/admin database has been reseeded. A matching DB row wins
 * once it exists so the admin remains authoritative for availability.
 */
export function withPromotedPackages<T extends MarketingPackageRow>(rows: T[]): MarketingPackageRow[] {
  const existingSlugs = new Set(rows.map((row) => row.slug));
  const promoted = promotedSlugs.flatMap((slug) => {
    if (existingSlugs.has(slug)) return [];

    const pkg = getPackageBySlug(slug);
    if (!pkg) return [];

    return [
      {
        id: pkg.id,
        slug: pkg.slug,
        name: pkg.name,
        tagline: pkg.tagline,
        description: pkg.longDescription,
        duration: pkg.durationLabel,
        pricePerPerson: String(pkg.price),
        category: pkg.category,
        highlights: pkg.highlights,
        isFeatured: pkg.featured,
        imageUrl: pkg.heroImage,
      },
    ];
  });

  return [...rows, ...promoted];
}
