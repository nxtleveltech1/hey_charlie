import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { StepIcon } from "./experience-icons";
import { RevealOnScroll } from "./reveal-on-scroll";

const ABOUT_HERO = {
  src: "/Gallery/JUNE%2026/HC%201%20(31).jpeg",
  alt: "Hey Charlie Charters boat on the water with branded hull artwork",
};

export function AboutCaptain() {
  return (
    <section
      id="about"
      className="section-pad bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
      aria-labelledby="about-heading"
    >
      <div className="wide-shell">
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch md:gap-10 lg:gap-12">
          <RevealOnScroll layout="contents" className="order-1">
            <article className="flex flex-col justify-center">
              <SectionHeader
                id="about-heading"
                eyebrow="Your captain"
                align="left"
                compact
                className="max-w-none text-center md:text-left"
                title={
                  <>
                    Meet <span className="text-gradient-sunset">Hey Charlie</span>
                  </>
                }
              />

              <div className="-mt-1 max-w-prose space-y-4 text-center text-sm leading-relaxed text-[var(--theme-text-secondary)] md:text-left md:text-base">
                <p>
                  Hey Charlie Charters was born from a lifelong love of the ocean and a passion for
                  sharing Cape Town&apos;s incredible coastline with visitors from around the world.
                </p>
                <p>
                  With over 15 years on the Cape coast, skipper Gareth Bew and the crew know every
                  cove, reef, and fishing ground along the peninsula — and deliver days on the water
                  that go beyond the ordinary.
                </p>
                <p>
                  Whether you&apos;re celebrating a special occasion, seeking adventure, or simply want
                  to witness a Cape Town sunset from the water — we&apos;ll make it unforgettable.
                </p>
              </div>

              {siteConfig.credentials.length > 0 && (
                <ul className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6 md:justify-start">
                  {siteConfig.credentials.map((cert) => (
                    <li key={cert.label}>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-3 py-1.5 text-xs text-[var(--theme-text-muted)] light-card">
                        <span className="inline-flex text-cyan-500 [&_svg]:h-4 [&_svg]:w-4">
                          <StepIcon icon="shield" />
                        </span>
                        {cert.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-7 md:justify-start">
                <Link
                  href="/crew"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Meet the crew
                </Link>
                <Link
                  href="/packages"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-surface)]"
                >
                  View packages
                </Link>
              </div>
            </article>
          </RevealOnScroll>

          <RevealOnScroll layout="contents" className="order-2" delay={100}>
            <figure className="relative m-0 mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--theme-border)] shadow-sm md:mx-0 md:aspect-auto md:h-full md:max-w-none md:min-h-[16rem]">
              <Image
                src={ABOUT_HERO.src}
                alt={ABOUT_HERO.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 85vw, 45vw"
                loading="lazy"
              />
            </figure>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
