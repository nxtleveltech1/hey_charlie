import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

/** A social URL is renderable only once its HCC_* env var is set. */
function isConfiguredUrl(url: string | undefined): url is string {
  return Boolean(url && !url.startsWith("REQUIRED:"));
}

export function ContactCta() {
  const social = siteConfig.social;
  const hasSocial =
    isConfiguredUrl(social.facebook) ||
    isConfiguredUrl(social.instagram) ||
    isConfiguredUrl(social.twitter);
  return (
    <section id="contact" className="section-pad" aria-labelledby="contact-heading">
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="glass-panel rounded-3xl p-5 sm:p-6 lg:p-8 text-center max-w-4xl mx-auto">
            <SectionHeader
              id="contact-heading"
              compact
              className="mx-auto"
              title={
                <>
                  Ready for your <span className="text-gradient-sunset">adventure?</span>
                </>
              }
              subtitle="Get in touch to book your experience or ask us anything. We typically respond within 2 hours during business hours."
            />

            <Link
              href={`https://wa.me/${siteConfig.whatsapp}`}
              className="inline-flex items-center justify-center gap-2 mb-6 sm:mb-8 w-full sm:w-auto px-8 py-4 rounded-2xl bg-green-600 text-white font-semibold text-base sm:text-lg hover:bg-green-500 transition-colors btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Book on WhatsApp
            </Link>

            <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-green-500/10 hover:border-green-500/20 transition-all group light-card text-left sm:text-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
              >
                <p className="font-semibold text-sm group-hover:text-green-500 transition-colors">WhatsApp</p>
                <p className="text-[var(--theme-text-muted)] text-xs mt-0.5">Quick response</p>
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all group light-card text-left sm:text-center"
                aria-label={`Call us at ${siteConfig.phoneDisplay}`}
              >
                <p className="font-semibold text-sm group-hover:text-cyan-500 transition-colors">Call Us</p>
                <p className="text-[var(--theme-text-muted)] text-xs mt-0.5">{siteConfig.phoneDisplay}</p>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group light-card text-left sm:text-center"
                aria-label={`Email us at ${siteConfig.email}`}
              >
                <p className="font-semibold text-sm group-hover:text-orange-500 transition-colors">Email</p>
                <p className="text-[var(--theme-text-muted)] text-xs mt-0.5 truncate">{siteConfig.email}</p>
              </a>
            </div>

            {hasSocial && (
            <div className="mt-8 inline-flex items-center gap-3 text-[var(--theme-text-muted)] text-xs sm:text-sm">
              <span>Follow us</span>
              <div className="flex gap-2">
                {isConfiguredUrl(social.facebook) && (
                <a
                  href={social.facebook}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] transition-all"
                  aria-label="Follow us on Facebook"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                )}
                {isConfiguredUrl(social.instagram) && (
                <a
                  href={social.instagram}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] transition-all"
                  aria-label="Follow us on Instagram"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                )}
                {isConfiguredUrl(social.twitter) && (
                <a
                  href={social.twitter}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-[var(--theme-surface)] transition-all"
                  aria-label="Follow us on X (Twitter)"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                )}
              </div>
            </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
