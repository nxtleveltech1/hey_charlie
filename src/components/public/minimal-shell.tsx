import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content/site-config";

export interface MinimalShellProps {
  children: ReactNode;
  /** Optional, decorative header eyebrow (e.g. "404", "Error"). Never a heading. */
  title?: string;
}

export function MinimalShell({ children, title }: MinimalShellProps) {
  const year = new Date().getFullYear();
  const phoneHref = `tel:${siteConfig.phone}`;
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;
  const emailHref = `mailto:${siteConfig.email}`;

  return (
    <div data-theme="dark" className="bg-navy text-cream">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="safe-top sticky top-0 z-40 border-b border-[var(--theme-border)] bg-navy-deep/95 backdrop-blur supports-[backdrop-filter]:bg-navy-deep/80">
        <div className="content-shell flex items-center justify-between gap-4 py-3.5 sm:py-4">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-cream transition-colors hover:text-amber sm:text-xl"
          >
            Hey Charlie Charters
          </Link>

          <div className="flex items-center gap-5">
            {title ? (
              <span className="hidden text-eyebrow text-cream-dim lg:inline">
                {title}
              </span>
            ) : null}
            <Button
              href="/packages"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book a charter
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-[60vh] bg-navy">
        {children}
      </main>

      <footer className="border-t border-[var(--theme-border)] bg-navy-deep">
        <div className="content-shell section-pad-sm flex flex-col gap-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-base font-bold text-cream">
                Hey Charlie Charters
              </span>
              <span className="text-small text-cream-dim">
                {siteConfig.tagline}
              </span>
              <span className="text-small text-cream-dim">
                Departing from {siteConfig.departurePoint}
              </span>
            </div>

            <nav
              aria-label="Contact details"
              className="flex flex-col gap-1.5 sm:items-end"
            >
              <a
                href={phoneHref}
                className="text-body text-cream-dim transition-colors hover:text-amber"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={emailHref}
                className="text-body text-cream-dim transition-colors hover:text-amber"
              >
                {siteConfig.email}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-cream-dim transition-colors hover:text-amber"
              >
                Chat on WhatsApp
              </a>
            </nav>
          </div>

          <div className="border-t border-[var(--theme-border)] pt-4 text-small text-cream-dim">
            &copy; {year} Hey Charlie Charters. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
