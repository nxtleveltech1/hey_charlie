import Link from "next/link";
import { siteConfig } from "@/lib/content/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] py-10 transition-colors duration-300 lg:py-12">
      <div className="section-glow-divider absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="wide-shell">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4 lg:mb-12 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              aria-label="Hey Charlie Charters — home"
              className="font-display block leading-none"
            >
              <span className="block text-lg font-bold tracking-tight text-[var(--theme-text)]">
                Hey Charlie
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">
                Charters
              </span>
            </Link>
            <p className="mt-4 text-small leading-relaxed text-[var(--theme-text-muted)]">
              {siteConfig.tagline}. Departures from the {siteConfig.departurePoint}.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-small font-semibold uppercase tracking-wider text-[var(--theme-text)] lg:mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-small text-[var(--theme-text-muted)]">
              <li>
                <Link
                  href="/packages"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/crew"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Crew
                </Link>
              </li>
              <li>
                <Link
                  href="/weather"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Weather
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-small font-semibold uppercase tracking-wider text-[var(--theme-text)] lg:mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-small text-[var(--theme-text-muted)]">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.address}</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-3 text-small font-semibold uppercase tracking-wider text-[var(--theme-text)] lg:mb-4">
              Information
            </h4>
            <ul className="space-y-2 text-small text-[var(--theme-text-muted)]">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellations"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Cancellations
                </Link>
              </li>
              <li>
                <Link
                  href="/weather-policy"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Weather Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/liability"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Liability
                </Link>
              </li>
              <li>
                <Link
                  href="/permits-and-regulations"
                  className="transition-colors hover:text-[var(--theme-text)]"
                >
                  Permits &amp; Regulations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--theme-border)] pt-6 text-small text-[var(--theme-text-muted)] sm:flex-row lg:gap-4 lg:pt-8">
          <span>
            &copy; {year} {siteConfig.name}
          </span>
          <span>heycharliecharters.com</span>
        </div>
      </div>
    </footer>
  );
}
