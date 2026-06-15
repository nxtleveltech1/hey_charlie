import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site-config";

/**
 * robots.txt for Hey Charlie Charters (canonical: .com).
 *
 * Everything public is allowed. Auth-gated / private surfaces are disallowed:
 *   - /booking/   auth-gated (redirects to sign-in); not crawlable/indexable.
 *   - /sign-in/, /sign-up/  auth UI; noindex via metadata too.
 *   - /dashboard/, /admin/  authenticated app surfaces.
 *   - /api/      route handlers / webhooks.
 */
const BASE = siteConfig.canonicalUrl.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/booking/",
          "/sign-in/",
          "/sign-up/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
