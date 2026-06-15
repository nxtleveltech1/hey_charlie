"use client";

import { MobileNav } from "@/components/mobile-nav";
import { PublicDesktopNav } from "@/components/public-desktop-nav";
import { MobileStickyActions } from "@/components/mobile-sticky-actions";
import type { PublicNavActive } from "@/components/public-desktop-nav";
import { usePathname } from "next/navigation";

function resolveNavActive(pathname: string): PublicNavActive {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/destinations")) return "destinations";
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname.startsWith("/crew")) return "crew";
  if (pathname.startsWith("/news")) return "news";
  if (pathname.startsWith("/weather")) return "weather";
  if (pathname.startsWith("/packages")) return "packages";
  return "home";
}

function isHome(pathname: string) {
  return pathname === "/";
}

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = resolveNavActive(pathname);
  const home = isHome(pathname);

  return (
    <>
      {!home && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{
              background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))`,
            }}
          />
          <div
            className="absolute top-20 right-20 h-[500px] w-[500px] animate-float rounded-full opacity-60 blur-3xl"
            style={{ background: "var(--theme-glow-orange)" }}
          />
        </div>
      )}

      {home ? (
        <>
          {/* Home uses its own scroll-aware nav inside HomePageShell */}
        </>
      ) : (
        <>
          <MobileNav />
          <PublicDesktopNav active={active} />
          <MobileStickyActions
            primaryHref="/packages"
            secondaryHref="/#contact"
          />
        </>
      )}

      <div className={home ? "" : "mobile-bottom-safe"}>{children}</div>
    </>
  );
}
