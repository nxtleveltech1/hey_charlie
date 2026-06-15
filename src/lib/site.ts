/**
 * Hey Charlie Charters — site configuration (backward-compat facade).
 *
 * The canonical config now lives in `@/lib/content/site-config`. This module
 * re-exports it and keeps the legacy names (`siteConfig`, `getSiteConfig`,
 * `getPublicSiteConfig`, `howItWorksSteps`, and the deprecated `trustStats`,
 * `testimonials`, `certifications`) alive so existing imports keep resolving
 * while other waves migrate.
 *
 * Canonical domain: https://heycharliecharters.com
 * "Hey Charlie" is the BRAND/BOAT name only — there is no "Captain Charlie".
 */

import {
  siteConfig,
  getSiteConfig,
  getPublicSiteConfig,
} from "@/lib/content/site-config";

export { siteConfig, getSiteConfig, getPublicSiteConfig };

export type {
  SiteConfig,
  ServerSiteConfig,
  AddressConfig,
  BusinessHoursConfig,
  BusinessHoursDay,
  GeoConfig,
  SocialConfig,
  Credential,
  CredentialAuthority,
  HowItWorksStep,
  PermitConfig,
} from "@/lib/content/site-config";

/** Top-level alias consumed by the "How it works" section. */
export const howItWorksSteps = siteConfig.howItWorksSteps;

// --- Deprecated aliases (backward compatibility) ----------------------------
//
// These keep existing imports compiling while other waves migrate to the new
// structured fields. They intentionally carry NO numeric claims, NO fake
// testimonials and NO unverified credential badges.

/** @deprecated Numeric trust claims removed. Use `siteConfig.credentials` / reviews instead. */
export const trustStats: readonly { value: string; label: string }[] = [];

/** @deprecated Fake testimonials removed. Reviews are disabled pending real guest stories. */
export const testimonials: readonly {
  quote: string;
  author: string;
  location: string;
  rating: number;
}[] = [];

/** @deprecated Use `siteConfig.credentials`. Only verified credentials are surfaced. */
export const certifications: readonly { label: string; icon: "shield" }[] = siteConfig.credentials
  .filter((c) => c.verified)
  .map((c) => ({ label: c.label, icon: "shield" as const }));
