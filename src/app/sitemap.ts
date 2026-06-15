import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site-config";
import { getDestinations } from "@/lib/content/destinations";
import { getLegalSections } from "@/lib/content/legal";

/**
 * Static sitemap for Hey Charlie Charters (canonical: .com).
 *
 * Included (indexable, public):
 *   - Home, section indexes (/packages, /destinations, /gallery, /crew,
 *     /weather, /news), destination detail pages (/destinations/[slug]) and the
 *     legal pages shipped this wave (/privacy, /terms, /cancellations,
 *     /weather-policy, /safety, /liability, /permits-and-regulations).
 *
 * Excluded (non-indexable / auth-gated):
 *   - /sign-in, /sign-up, /booking/*, /dashboard, /admin, /api/* (also blocked
 *     in robots.ts).
 *
 * TODO(news): published articles (/news/[slug]) are DB-driven and cannot be
 *   enumerated statically. A later wave should make this sitemap dynamic by
 *   fetching published articles and emitting one entry per article with its
 *   real `updatedAt` as `lastModified`.
 * TODO(contact): add { url: abs("/contact") } once the /contact route ships.
 */

const BASE = siteConfig.canonicalUrl.replace(/\/$/, "");

function abs(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: abs("/packages"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/destinations"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/crew"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/weather"), lastModified: now, changeFrequency: "daily", priority: 0.5 },
    { url: abs("/news"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Destination detail pages (content-driven).
  const destinationRoutes: MetadataRoute.Sitemap = getDestinations().map((d) => ({
    url: abs(`/destinations/${d.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Legal pages created this wave. Derived from the legal content module so the
  // sitemap stays in lock-step with the legal sections; each renders at the root
  // path matching its id (e.g. /privacy, /weather-policy).
  const legalRoutes: MetadataRoute.Sitemap = getLegalSections().map((s) => ({
    url: abs(`/${s.id}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...destinationRoutes, ...legalRoutes];
}
