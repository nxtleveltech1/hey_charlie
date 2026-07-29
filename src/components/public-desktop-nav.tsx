"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavWordmark } from "@/components/ui/brand-logo";

export type PublicNavActive =
  | "home"
  | "destinations"
  | "gallery"
  | "crew"
  | "news"
  | "weather"
  | "packages"
  | "about";

interface PublicDesktopNavProps {
  active: PublicNavActive;
  navSurface?: "transparent" | "solid";
}

function hashHref(isHome: boolean, id: string) {
  return isHome ? `#${id}` : `/#${id}`;
}

export function PublicDesktopNav({
  active,
  navSurface = "solid",
}: PublicDesktopNavProps) {
  const isHome = active === "home";
  const isTransparent = navSurface === "transparent" && isHome;

  const linkBase = isTransparent
    ? "relative flex h-12 items-center text-[15px] font-semibold text-white/90 transition-colors hover:text-white"
    : "relative flex h-12 items-center text-[15px] font-semibold text-[#061039] transition-colors hover:text-cyan-600";

  const activeLink = isTransparent
    ? "text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-orange-400"
    : "text-cyan-600 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-cyan-500";

  const linkClass = (item: PublicNavActive | "experiences" | "contact") => {
    const isActive =
      (item === "experiences" && active === "home") ||
      (item !== "experiences" && item !== "contact" && active === item);
    return `${linkBase} ${isActive ? activeLink : ""}`;
  };

  const navClass = isTransparent
    ? "hidden lg:block fixed top-0 w-full border-b border-white/10 bg-white/10 shadow-none backdrop-blur-xl z-50 transition-all duration-300"
    : "hidden lg:block fixed top-0 w-full border-b border-black/5 bg-white/95 shadow-[0_14px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl z-50 transition-all duration-300";

  const signInClass = isTransparent
    ? "text-[15px] font-semibold text-white/90 transition-colors hover:text-white"
    : "text-[15px] font-semibold text-[#061039] transition-colors hover:text-cyan-600";

  const dividerClass = isTransparent ? "border-white/20" : "border-slate-300";

  return (
    <nav className={navClass} aria-label="Main navigation">
      <div className="wide-shell py-7">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="shrink-0 overflow-visible py-0.5">
            <NavWordmark surface={isTransparent ? "hero" : "solid"} size="desktop" />
          </Link>

          <div className="hidden lg:flex flex-1 flex-wrap items-center justify-end gap-x-8 gap-y-1 min-w-0">
            <Link href={hashHref(isHome, "experiences")} className={linkClass("experiences")}>
              Experiences
            </Link>
            <Link href={isHome ? "#packages" : "/packages"} className={linkClass("packages")}>
              Packages
            </Link>
            <Link href="/destinations" className={linkClass("destinations")}>
              Destinations
            </Link>
            <Link href="/gallery" className={linkClass("gallery")}>
              Gallery
            </Link>
            <Link href="/crew" className={linkClass("crew")}>
              Crew
            </Link>
            <Link href="/news" className={linkClass("news")}>
              News
            </Link>
            <Link href="/weather" className={linkClass("weather")}>
              Weather
            </Link>
            <Link href="/about" className={linkClass("about")}>
              About
            </Link>
            <Link href={hashHref(isHome, "contact")} className={linkClass("contact")}>
              Contact
            </Link>
          </div>

          <div className={`flex shrink-0 items-center gap-5 border-l pl-7 ${dividerClass}`}>
            <SignedOut>
              <Link href="/sign-in" className={signInClass}>
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className={signInClass}>
                My Bookings
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Link
              href={hashHref(isHome, "packages")}
              className="rounded-[1.65rem] bg-gradient-to-r from-orange-500 to-pink-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-opacity hover:opacity-90 btn-primary"
            >
              Book Now
            </Link>
            <ThemeToggle variant={isTransparent ? "on-dark" : "default"} />
          </div>
        </div>
      </div>
    </nav>
  );
}
