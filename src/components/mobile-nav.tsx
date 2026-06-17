"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { NavWordmark } from "@/components/ui/brand-logo";

const navLinks = [
  { href: "/packages", label: "Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/crew", label: "Crew" },
  { href: "/news", label: "News" },
  { href: "/weather", label: "Weather" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

interface MobileNavProps {
  variant?: "solid" | "hero";
}

export function MobileNav({ variant = "solid" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useIsAdmin();
  const isHeroOverlay = variant === "hero";

  const navClass = isHeroOverlay
    ? "fixed top-0 w-full border-b border-white/10 backdrop-blur-xl bg-white/10 z-50 transition-colors duration-300 lg:hidden"
    : "fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl bg-[var(--theme-nav-bg)] z-50 transition-colors duration-300 lg:hidden";

  const menuButtonClass = isHeroOverlay
    ? "w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/10 border border-white/20 text-white"
    : "w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)]";

  return (
    <>
      {/* Mobile Header */}
      <nav className={navClass} aria-label="Main navigation">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex min-w-0 items-center overflow-visible py-0.5">
              <NavWordmark surface={isHeroOverlay ? "hero" : "solid"} size="mobile" />
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle variant={isHeroOverlay ? "on-dark" : "default"} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={menuButtonClass}
                aria-label="Toggle menu"
              >
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`} 
                />
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`} 
                />
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[min(100vw,24rem)] bg-[var(--theme-bg)] border-l border-[var(--theme-border)] z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-5 pt-24 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Plan your charter
            </p>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              Explore trips, destinations, weather, and your booking account.
            </p>
          </div>

          <nav className="space-y-2 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block min-h-12 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-4 py-3 text-base text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-5 border-t border-[var(--theme-border)] space-y-3">
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="block w-full min-h-12 text-center px-4 py-3 rounded-2xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/#packages"
                onClick={() => setIsOpen(false)}
                className="block w-full min-h-12 text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
              >
                Book Now
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--theme-surface)]">
                <span className="text-sm">My Account</span>
                <UserButton afterSignOutUrl="/" />
              </div>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium"
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
              >
                My Bookings
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}

