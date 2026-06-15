"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { NavWordmark } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

const bottomTabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/packages", label: "Book", icon: "⛵" },
  { href: "/dashboard", label: "Bookings", icon: "📅", signedInOnly: true },
  { href: "/weather", label: "Weather", icon: "🌊" },
];

const moreLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/crew", label: "Crew" },
  { href: "/news", label: "News" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { isAdmin } = useIsAdmin();
  const drawerRef = useFocusTrap(moreOpen, () => setMoreOpen(false));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/packages")
      return pathname === "/packages" || pathname.startsWith("/booking");
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    if (href === "/weather") return pathname === "/weather";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl safe-top">
        <div className="wide-shell flex min-h-14 items-center justify-between py-2">
          <Link href="/" className="flex min-w-0 items-center">
            <NavWordmark surface="solid" size="mobile" />
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(3.75rem+env(safe-area-inset-top))]">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl lg:hidden"
        aria-label="App navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {bottomTabs.map((tab) => {
            if (tab.signedInOnly) {
              return (
                <SignedIn key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                      isActive(tab.href)
                        ? "text-amber"
                        : "text-[var(--theme-text-muted)]",
                    )}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {tab.icon}
                    </span>
                    {tab.label}
                  </Link>
                </SignedIn>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  isActive(tab.href)
                    ? "text-amber"
                    : "text-[var(--theme-text-muted)]",
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {tab.icon}
                </span>
                {tab.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[var(--theme-text-muted)]"
            aria-label="More navigation options"
          >
            <span className="text-lg" aria-hidden="true">
              ☰
            </span>
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="More navigation"
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-[var(--theme-border)] bg-[var(--theme-bg)] p-5"
            style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">More</h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--theme-border)]"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-2">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className="min-h-11 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setMoreOpen(false)}
                  className="min-h-11 rounded-xl border border-[var(--theme-border)] px-4 py-3 text-center text-sm"
                >
                  Sign In
                </Link>
              </SignedOut>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMoreOpen(false)}
                  className="min-h-11 rounded-xl bg-amber px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
