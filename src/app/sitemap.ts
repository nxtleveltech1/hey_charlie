import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/lib/content/site-config";
import { locations } from "@/lib/locations";
import { getLegalSections } from "@/lib/content/legal";
import { db } from "@/db";
import { articles } from "@/db/schema";

/**
 * Sitemap for Hey Charlie Charters (canonical: .com).
 *
 * Included (indexable, public):
 *   - Home, /about, section indexes (/packages, /destinations, /gallery,
 *     /crew, /weather, /news), destination detail pages (/destinations/[slug],
 *     sourced from the same locations module that backs the routes), published
 *     news articles, and the legal pages (/privacy, /terms, /cancellations,
 *     /weather-policy, /safety, /liability, /permits-and-regulations).
 *
 * Excluded (non-indexable / auth-gated):
 *   - /sign-in, /sign-up, /booking/*, /dashboard, /admin, /api/* (also blocked
 *     in robots.ts).
 */

const BASE = siteConfig.canonicalUrl.replace(/\/$/, "");

function abs(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: abs("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/packages"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/destinations"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/crew"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/weather"), lastModified: now, changeFrequency: "daily", priority: 0.5 },
    { url: abs("/news"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Destination detail pages — derived from the module that defines the actual
  // /destinations/[slug] routes so the sitemap can never advertise a 404.
  const destinationRoutes: MetadataRoute.Sitemap = locations.map((d) => ({
    url: abs(`/destinations/${d.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Published news articles (DB-driven). Sitemap must still build when the
  // database is unreachable, so failures degrade to an empty list.
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const published = await db.query.articles.findMany({
      where: eq(articles.status, "published"),
      columns: { slug: true, publishedAt: true, updatedAt: true },
    });
    articleRoutes = published.map((a) => ({
      url: abs(`/news/${a.slug}`),
      lastModified: a.updatedAt ?? a.publishedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    // DB unavailable at build/request time — ship the static entries.
  }

  // Legal pages, derived from the legal content module so the sitemap stays in
  // lock-step with the legal sections; each renders at /{id}.
  const legalRoutes: MetadataRoute.Sitemap = getLegalSections().map((s) => ({
    url: abs(`/${s.id}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...destinationRoutes, ...articleRoutes, ...legalRoutes];
}
