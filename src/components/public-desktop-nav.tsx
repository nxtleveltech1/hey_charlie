"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminLink } from "@/components/admin-link";

export type PublicNavActive =
  | "home"
  | "destinations"
  | "crew"
  | "news"
  | "weather"
  | "packages";

interface PublicDesktopNavProps {
  /** Which top-level section is current (highlights that link). On `home`, hash links are not highlighted. */
  active: PublicNavActive;
  /** Large logo on home hero; compact on inner pages */
  logoVariant?: "home" | "compact";
  /** Match destinations/[slug] solid nav bar */
  navSurface?: "transparent" | "solid";
}

function hashHref(isHome: boolean, id: string) {
  return isHome ? `#${id}` : `/#${id}`;
}

export function PublicDesktopNav({
  active,
  logoVariant = "compact",
  navSurface = "transparent",
}: PublicDesktopNavProps) {
  const isHome = active === "home";
  const navStyle =
    navSurface === "solid"
      ? undefined
      : ({ backgroundColor: "var(--theme-nav-bg-transparent)" } as const);
  const navClassName =
    navSurface === "solid"
      ? "hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl bg-[var(--theme-nav-bg)] z-50 transition-colors duration-300"
      : "hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl z-50 transition-colors duration-300";

  const link = "text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors";
  const current = "text-sm text-orange-400 font-medium";

  const logoW = logoVariant === "home" ? 140 : 50;
  const logoH = logoVariant === "home" ? 140 : 50;
  const titleClass =
    logoVariant === "home"
      ? "text-2xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
      : "text-xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent";
  const subtitleClass =
    logoVariant === "home"
      ? "block text-sm font-semibold tracking-wider italic bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
      : "block text-[10px] font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent";

  return (
    <nav className={navClassName} style={navStyle}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-4 shrink-0">
            <Image
              src="/logo2.png"
              alt="Hey Charlie Charters"
              width={logoW}
              height={logoH}
              className="rounded-xl"
            />
            <div>
              <span className={titleClass} style={{ fontFamily: "var(--font-display)" }}>
                Hey Charlie
              </span>
              <span className={subtitleClass}>CHARTERS</span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 xl:gap-x-5 min-w-0">
            <Link href={hashHref(isHome, "experiences")} className={link}>
              Experiences
            </Link>
            <Link
              href={isHome ? "#packages" : "/packages"}
              className={active === "packages" ? current : link}
            >
              Packages
            </Link>
            <Link href="/destinations" className={active === "destinations" ? current : link}>
              Destinations
            </Link>
            <Link href="/crew" className={active === "crew" ? current : link}>
              Crew
            </Link>
            <Link href="/news" className={active === "news" ? current : link}>
              News
            </Link>
            <Link href="/weather" className={active === "weather" ? current : link}>
              Weather
            </Link>
            <Link href={hashHref(isHome, "about")} className={link}>
              About
            </Link>
            <Link href={hashHref(isHome, "contact")} className={link}>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                Sign In
              </Link>
              <Link
                href={hashHref(isHome, "packages")}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity btn-primary"
              >
                Book Now
              </Link>
            </SignedOut>
            <SignedIn>
              <AdminLink />
              <Link href="/dashboard" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
                My Bookings
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-orange-500/50" } }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
