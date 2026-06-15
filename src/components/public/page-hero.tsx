import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface PageHeroProps {
  /** Page <h1> text (required — one h1 per hero). */
  title: string;
  /** Small amber kicker above the title. */
  eyebrow?: string;
  /** Supporting paragraph rendered with the body-lg scale. */
  description?: string;
  /** Path (e.g. "/images/foo.jpg") for a cinematic background image. */
  image?: string;
  /** Alt text for the background image (empty string marks it decorative). */
  imageAlt?: string;
  /** Breadcrumb trail; the last item is rendered as the current page. */
  breadcrumb?: BreadcrumbItem[];
  /** CTA slot — pass <Button> elements. */
  children?: ReactNode;
  /** Text alignment. Defaults to "left". */
  align?: "left" | "center";
  /** Tailwind min-height class for the hero. Defaults to "min-h-[58vh]". */
  minHeight?: string;
  className?: string;
}

export function PageHero({
  title,
  eyebrow,
  description,
  image,
  imageAlt = "",
  breadcrumb,
  children,
  align = "left",
  minHeight = "min-h-[58vh]",
  className,
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <header
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden bg-navy-deep",
        "pb-12 pt-28 sm:pb-16 lg:pb-20 lg:pt-32",
        minHeight,
        className,
      )}
    >
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* Legibility scrim — solid navy gradient, AA contrast on text. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-deep/80 via-navy-deep/65 to-navy-deep/92"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/70 via-navy-deep/20 to-transparent"
          />
        </>
      )}

      <div
        className={cn(
          "content-shell w-full",
          isCenter && "flex flex-col items-center text-center",
        )}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={cn("mb-5", isCenter && "flex justify-center")}
          >
            <ol className="flex flex-wrap items-center gap-1.5 text-small text-cream-muted">
              {breadcrumb.map((crumb, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <li key={`${crumb.href}-${index}`} className="flex items-center gap-1.5">
                    {isLast ? (
                      <span aria-current="page" className="text-cream">
                        {crumb.name}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-cream focus-visible:text-cream"
                        >
                          {crumb.name}
                        </Link>
                        <span aria-hidden="true" className="text-cream-muted/60">
                          /
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p
            className={cn(
              "text-eyebrow text-amber mb-4 flex items-center gap-2",
              isCenter && "justify-center",
            )}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-amber"
              aria-hidden="true"
            />
            {eyebrow}
          </p>
        )}

        <h1 className="max-w-4xl text-h1 font-display text-cream text-balance">
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-5 text-body-lg text-cream-muted leading-relaxed",
              isCenter ? "mx-auto max-w-2xl" : "max-w-2xl",
            )}
          >
            {description}
          </p>
        )}

        {children && (
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-3",
              isCenter && "justify-center",
            )}
          >
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
