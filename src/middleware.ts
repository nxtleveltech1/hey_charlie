import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Canonical production origin (defaults to the .com). Read from env so the same
// code works in preview/dev without redirecting those hosts.
const CANONICAL_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://heycharliecharters.com";

function getCanonicalHost(): string {
  try {
    return new URL(CANONICAL_URL).hostname;
  } catch {
    return "heycharliecharters.com";
  }
}

const CANONICAL_HOST = getCanonicalHost();

// Known alternate/legacy hosts that must permanently redirect to the canonical.
// Anything else (localhost, Vercel preview domains, the canonical itself) is
// left untouched so dev/preview stay functional.
const NON_CANONICAL_HOSTS = new Set([
  "heycharlie.co.za",
  "www.heycharlie.co.za",
  "www.heycharliecharters.com",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/gallery(.*)",
  "/packages(.*)",
  "/destinations(.*)",
  "/news(.*)",
  "/crew",
  "/weather",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/packages",
  "/api/weather",
  "/api/crew",
]);

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

export default clerkMiddleware(async (auth, request) => {
  // 1) Canonical host redirect (308 permanent). Preserve pathname + search.
  const hostHeader =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host");
  const requestHost = hostHeader ? hostHeader.split(":")[0] : "";

  if (
    requestHost &&
    requestHost !== CANONICAL_HOST &&
    NON_CANONICAL_HOSTS.has(requestHost)
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  // 2) Auth gate — protect pages; API routes return JSON 401 (never HTML redirects).
  if (isPublicRoute(request)) {
    return;
  }

  if (isApiRoute(request.nextUrl.pathname)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|mp4|webm|mov|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
