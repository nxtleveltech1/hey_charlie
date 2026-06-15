import type { ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/content/site-config";

interface CtaBandProps {
  /** Heading line. Premium, Cape-Town-specific copy by default. */
  title?: string;
  /** Supporting line under the heading. */
  body?: string;
  /** Primary CTA node. Defaults to a "Plan your charter" Button → /packages. */
  primary?: ReactNode;
  /** Show WhatsApp + Phone contact buttons. Defaults to true. */
  showContact?: boolean;
  className?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function CtaBand({
  title = "Tell us your date, group size and the day you're after",
  body = "We'll put together a plan and confirm availability. WhatsApp the crew for the fastest reply.",
  primary,
  showContact = true,
  className,
}: CtaBandProps) {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;
  const phoneHref = `tel:${siteConfig.phone}`;

  return (
    <section className={className}>
      <div className="content-shell">
        <div className="relative overflow-hidden rounded-2xl border border-amber/25 bg-navy-600 px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          {/* Subtle amber accent rule (solid, not neon). */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-amber"
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-display text-cream text-balance">
                {title}
              </h2>
              <p className="mt-3 text-body-lg text-cream-muted leading-relaxed">
                {body}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:shrink-0 lg:justify-end">
              {primary ?? (
                <Button href="/packages" size="lg">
                  Plan your charter
                </Button>
              )}

              {showContact && (
                <>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "whatsapp", size: "lg" })}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp the crew
                  </a>
                  <a
                    href={phoneHref}
                    className={buttonVariants({ variant: "secondary", size: "lg" })}
                  >
                    <PhoneIcon className="h-5 w-5" />
                    {siteConfig.phoneDisplay}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
