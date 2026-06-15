import { z } from "zod";

/**
 * Hey Charlie Charters — canonical brand & contact configuration.
 *
 * Single source of truth for name, domains, contact details, address, hours,
 * geo, social links, credentials and "how it works" steps. Marketing pages and
 * `src/lib/site.ts` import from here; `src/db/seed.ts` reads crew/packages from
 * the sibling content modules.
 *
 * Visibility rules:
 *  - `siteConfig` / `getPublicSiteConfig()` are CLIENT-SAFE (no secrets).
 *  - `getSiteConfig()` is SERVER-ONLY and adds non-public permit/licence numbers.
 *
 * Required-but-unset values (social profiles, business-hours confirmation,
 * permit numbers) resolve to a loud `"REQUIRED: set <VAR>"` sentinel with a
 * one-time server warning. The app never crashes and secrets are never exposed.
 *
 * Canonical domain: https://heycharliecharters.com
 * "Hey Charlie" is the BRAND/BOAT name only — there is no "Captain Charlie".
 * The owner/operator/captain is Gareth Bew.
 */

const CANONICAL_URL = "https://heycharliecharters.com";
const ALTERNATE_DOMAIN = "https://heycharlie.co.za";

// --- Real, confirmed contact details (owner/captain: Gareth Bew) ------------
// Phone + WhatsApp are confirmed and used as the defaults below. They remain
// overridable via HCC_PHONE / HCC_WHATSAPP / HCC_EMAIL without falling back to
// a broken sentinel. Email is the canonical-domain address but is flagged for
// the owner to verify before it is relied upon.
const PHONE_TEL_DEFAULT = "+27603144873";
const PHONE_DISPLAY_DEFAULT = "060 314 4873";
const WHATSAPP_DEFAULT = "27603144873";
// REQUIRED (owner verification): confirm this is the monitored inbox.
const EMAIL_DEFAULT = "ahoy@heycharliecharters.com";

// --- env helpers ------------------------------------------------------------

const warned = new Set<string>();

function warnRequired(key: string): void {
  if (typeof window !== "undefined") return;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `\x1b[33m[site config] REQUIRED environment variable ${key} is not set. ` +
      `Using a sentinel value — set it before going live.\x1b[0m`,
  );
}

/** Return the value when set; otherwise a loud sentinel + one-time server warn. */
function requiredEnv(key: string, value: string | undefined): string {
  if (value && value.trim().length > 0) return value.trim();
  warnRequired(key);
  return `REQUIRED: set ${key}`;
}

/** Optional env value — undefined when unset (no sentinel, no warning). */
function optionalEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

// --- resolved env values ----------------------------------------------------

const canonicalUrl = optionalEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? CANONICAL_URL;

// Contact details default to the confirmed real values; overridable via env.
const phone = optionalEnv(process.env.HCC_PHONE) ?? PHONE_TEL_DEFAULT;
const phoneDisplay = optionalEnv(process.env.HCC_PHONE_DISPLAY) ?? PHONE_DISPLAY_DEFAULT;
const whatsapp = optionalEnv(process.env.HCC_WHATSAPP) ?? WHATSAPP_DEFAULT;
const email = optionalEnv(process.env.HCC_EMAIL) ?? EMAIL_DEFAULT;

// Social profiles + business-hours confirmation are still unknown → env-driven.
const businessHoursConfirmed = optionalEnv(process.env.HCC_BUSINESS_HOURS);
const facebook = requiredEnv("HCC_FACEBOOK", process.env.HCC_FACEBOOK);
const instagram = requiredEnv("HCC_INSTAGRAM", process.env.HCC_INSTAGRAM);
const twitter = requiredEnv("HCC_TWITTER", process.env.HCC_TWITTER);
const youtube = optionalEnv(process.env.HCC_YOUTUBE);

// --- Zod schemas ------------------------------------------------------------

const addressSchema = z.object({
  street: z.string(),
  suburb: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

const businessHoursDaySchema = z.object({
  day: z.string(),
  open: z.string(),
  close: z.string(),
  closed: z.boolean().optional(),
});

const businessHoursSchema = z.object({
  /** Draft hours are shown but flagged as pending confirmation. */
  pending: z.boolean(),
  note: z.string(),
  days: z.array(businessHoursDaySchema),
});

const geoSchema = z.object({ lat: z.number(), lng: z.number() });

const socialSchema = z.object({
  facebook: z.string(),
  instagram: z.string(),
  twitter: z.string(),
  youtube: z.string().optional(),
});

/** Allowed authority terms for South African maritime credentials. */
const credentialAuthoritySchema = z.enum(["SAMSA", "NSRI"]);

const credentialSchema = z.object({
  label: z.string(),
  authority: credentialAuthoritySchema.optional(),
  /** Licence/number. Omitted until a verified value is supplied. */
  number: z.string().optional(),
  verified: z.boolean(),
  requiredNote: z.string().optional(),
});

const howItWorksStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.enum(["compass", "anchor", "sparkles"]),
});

const reviewsSchema = z.object({
  /** Reviews are intentionally disabled until real guest stories are collected. */
  enabled: z.literal(false),
});

const reviewsComingSoonSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const siteConfigSchema = z.object({
  canonicalUrl: z.string(),
  alternateDomain: z.string(),
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  phone: z.string(),
  phoneDisplay: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  addressStructured: addressSchema,
  /** Single-line address for display (backward compat with existing UI). */
  address: z.string(),
  businessHours: businessHoursSchema,
  geo: geoSchema,
  social: socialSchema,
  departurePoint: z.string(),
  credentials: z.array(credentialSchema),
  reviews: reviewsSchema,
  reviewsComingSoon: reviewsComingSoonSchema,
  howItWorksSteps: z.array(howItWorksStepSchema),
  heroPoster: z.string(),
  heroVideo: z.string(),
  /** Legacy alias for canonicalUrl (kept for backward compatibility). */
  url: z.string(),
});

export type AddressConfig = z.infer<typeof addressSchema>;
export type BusinessHoursDay = z.infer<typeof businessHoursDaySchema>;
export type BusinessHoursConfig = z.infer<typeof businessHoursSchema>;
export type GeoConfig = z.infer<typeof geoSchema>;
export type SocialConfig = z.infer<typeof socialSchema>;
export type CredentialAuthority = z.infer<typeof credentialAuthoritySchema>;
export type Credential = z.infer<typeof credentialSchema>;
export type HowItWorksStep = z.infer<typeof howItWorksStepSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;

/** Non-public, server-only permit/licence configuration. */
export interface PermitConfig {
  required: true;
  authority: "SAMSA" | "DAFF";
  number: string;
}

export interface ServerSiteConfig extends SiteConfig {
  permits: {
    samsaVessel: PermitConfig;
    recreationalFishing: PermitConfig;
    crayfish: PermitConfig;
  };
}

// --- resolved values --------------------------------------------------------

const addressStructured: AddressConfig = {
  street: "V&A Waterfront (berth confirmed at booking)",
  suburb: "Victoria & Alfred Waterfront",
  city: "Cape Town",
  region: "Western Cape",
  postalCode: "8002",
  country: "South Africa",
};

const address = `${addressStructured.suburb}, ${addressStructured.city}`;

const businessHours: BusinessHoursConfig = {
  pending: !businessHoursConfirmed,
  note: businessHoursConfirmed
    ? "Operating hours confirmed."
    : "REQUIRED: confirm operating hours (HCC_BUSINESS_HOURS). Charters run daily, sea conditions permitting.",
  days: [
    { day: "Monday", open: "08:00", close: "19:00" },
    { day: "Tuesday", open: "08:00", close: "19:00" },
    { day: "Wednesday", open: "08:00", close: "19:00" },
    { day: "Thursday", open: "08:00", close: "19:00" },
    { day: "Friday", open: "08:00", close: "20:00" },
    { day: "Saturday", open: "07:30", close: "20:00" },
    { day: "Sunday", open: "07:30", close: "19:00" },
  ],
};

const credentials: Credential[] = [
  {
    label: "SAMSA Certified Skipper",
    authority: "SAMSA",
    verified: false,
    requiredNote: "REQUIRED: licence category and number pending verification.",
  },
  {
    label: "Fully Insured",
    verified: false,
    requiredNote: "REQUIRED: insurer name and policy number pending confirmation.",
  },
  {
    label: "NSRI Supporter",
    authority: "NSRI",
    verified: false,
    requiredNote: "REQUIRED: confirm NSRI relationship before publishing.",
  },
];

export const siteConfig: SiteConfig = siteConfigSchema.parse({
  canonicalUrl,
  alternateDomain: ALTERNATE_DOMAIN,
  name: "Hey Charlie Charters",
  legalName: "Hey Charlie Charters",
  tagline: "Cape Town charters from the V&A Waterfront",
  description:
    "Hey Charlie Charters runs sundowner cruises, whale watching, deep-sea fishing, crayfish diving and private charters from the V&A Waterfront, Cape Town — along the Atlantic Seaboard and around the Cape Peninsula.",
  phone,
  phoneDisplay,
  whatsapp,
  email,
  addressStructured,
  address,
  businessHours,
  geo: { lat: -33.9077, lng: 18.4235 },
  social: {
    facebook,
    instagram,
    twitter,
    ...(youtube ? { youtube } : {}),
  },
  departurePoint: "V&A Waterfront, Cape Town",
  credentials,
  reviews: { enabled: false },
  reviewsComingSoon: {
    title: "Guest stories coming soon",
    body: "We are collecting real guest stories from our charters. Check back shortly for genuine experiences from people who have been out on the water with us.",
  },
  howItWorksSteps: [
    {
      step: 1,
      title: "Choose your charter",
      description: "Pick the experience that fits your group — sundowner, wildlife, fishing or private.",
      icon: "compass",
    },
    {
      step: 2,
      title: "Meet at the V&A",
      description: "Board at the V&A Waterfront. The crew briefs you 15 minutes before we cast off.",
      icon: "anchor",
    },
    {
      step: 3,
      title: "Get out on the water",
      description: "We run the route, keep you safe, and leave the Cape coast to do the rest.",
      icon: "sparkles",
    },
  ],
  heroPoster: "/images/sundown-cruise-hero.png",
  heroVideo: "/Gallery/HC%201%20(2).mp4",
  url: canonicalUrl,
});

// --- accessors --------------------------------------------------------------

/** Public, client-safe config subset (no secrets). */
export function getPublicSiteConfig(): SiteConfig {
  return siteConfig;
}

/** Full config including non-public permit/licence numbers. SERVER-ONLY. */
export function getSiteConfig(): ServerSiteConfig {
  const samsaVesselNumber = requiredEnv(
    "HCC_PERMIT_SAMSA_VESSEL",
    process.env.HCC_PERMIT_SAMSA_VESSEL,
  );
  const recFishNumber = requiredEnv("HCC_PERMIT_RECFISH", process.env.HCC_PERMIT_RECFISH);
  const crayfishNumber = requiredEnv("HCC_PERMIT_CRAYFISH", process.env.HCC_PERMIT_CRAYFISH);

  return {
    ...siteConfig,
    permits: {
      samsaVessel: { required: true, authority: "SAMSA", number: samsaVesselNumber },
      recreationalFishing: { required: true, authority: "DAFF", number: recFishNumber },
      crayfish: { required: true, authority: "DAFF", number: crayfishNumber },
    },
  };
}
