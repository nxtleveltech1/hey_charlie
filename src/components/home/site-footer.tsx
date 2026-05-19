import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BrandLogo } from "@/components/ui/brand-logo";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--theme-border)] py-10 lg:py-12 bg-[var(--theme-bg-secondary)] transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" aria-hidden="true" />
      <div className="wide-shell">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo variant="icon" width={40} height={40} />
              <BrandLogo variant="compact" />
            </div>
            <p className="text-[var(--theme-text-muted)] text-xs lg:text-sm leading-relaxed">
              {siteConfig.tagline} — unforgettable adventures on the waters of the Mother City.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Experiences</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm text-[var(--theme-text-muted)]">
              <li><Link href="/booking/sundowner-cruise" className="hover:text-[var(--theme-text)] transition-colors">Sundowner Cruises</Link></li>
              <li><Link href="/booking/whale-watching" className="hover:text-[var(--theme-text)] transition-colors">Whale Watching</Link></li>
              <li><Link href="/booking/deep-sea-fishing" className="hover:text-[var(--theme-text)] transition-colors">Fishing Charters</Link></li>
              <li><Link href="/booking/private-charter" className="hover:text-[var(--theme-text)] transition-colors">Private Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Destinations</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm text-[var(--theme-text-muted)]">
              <li><Link href="/destinations/clifton-beaches" className="hover:text-[var(--theme-text)] transition-colors">Clifton Beaches</Link></li>
              <li><Link href="/destinations/camps-bay" className="hover:text-[var(--theme-text)] transition-colors">Camps Bay</Link></li>
              <li><Link href="/destinations/cape-point" className="hover:text-[var(--theme-text)] transition-colors">Cape Point</Link></li>
              <li><Link href="/destinations/simons-town" className="hover:text-[var(--theme-text)] transition-colors">Simon&apos;s Town</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Contact</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm text-[var(--theme-text-muted)]">
              <li>{siteConfig.address}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-[var(--theme-text)] transition-colors">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[var(--theme-text)] transition-colors">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 lg:pt-8 border-t border-[var(--theme-border)] flex flex-col sm:flex-row justify-between items-center gap-3 lg:gap-4 text-xs lg:text-sm text-[var(--theme-text-muted)]">
          <span>© 2026 {siteConfig.name}</span>
          <div className="flex gap-4 lg:gap-6">
            <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--theme-text)] transition-colors">Cancellations</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
