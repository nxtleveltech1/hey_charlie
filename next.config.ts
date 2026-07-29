import type { NextConfig } from "next";

// Pragmatic CSP. `'unsafe-inline'` + `'unsafe-eval'` for scripts are required
// because Next.js (Turbopack) and Clerk inject inline/eval'd scripts in dev and
// sometimes prod. This can be tightened later with per-request nonces once the
// inline-script surface is audited. Clerk, Google Fonts and YouTube embeds are
// explicitly allow-listed so auth, styling and video are not broken.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://img.clerk.com https://images.unsplash.com https://upload.wikimedia.org",
  // clerk.heycharliecharters.com is the production Clerk instance (pk_live);
  // *.clerk.accounts.dev covers dev/preview instances (pk_test).
  // challenges.cloudflare.com is Clerk's bot-protection (Turnstile) widget.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.heycharliecharters.com https://*.clerk.accounts.dev https://clerk.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://clerk.heycharliecharters.com https://*.clerk.accounts.dev https://clerk.com https://customer-api.open-meteo.com https://customer-marine-api.open-meteo.com https://api.open-meteo.com https://api.openweathermap.org https://api.stormglass.io",
  "worker-src 'self' blob:",
  "frame-src 'self' https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.youtube.com",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
