"use client";

import Link from "next/link";
import { siteConfig, trustStats } from "@/lib/site";
import { HeroLogoShowcase } from "./hero-logo-showcase";
import { HeroMediaCarousel } from "./hero-media-carousel";

function CharterHeroContent() {
  return (
    <>
      <div className="max-w-4xl space-y-4 text-left sm:space-y-5 lg:space-y-6">
        <div className="section-eyebrow-hero">
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400"
            aria-hidden="true"
          />
          {siteConfig.tagline}
        </div>

        <h1
          id="hero-heading"
          className="max-w-[95%] text-[clamp(1.75rem,7.5vw,4.5rem)] font-bold leading-[1.08] text-white text-balance sm:max-w-4xl lg:max-w-none lg:text-7xl 2xl:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Discover the <span className="text-gradient-sunset">magic</span> of the{" "}
          <span className="text-gradient-ocean">Cape Coast</span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
          From breathtaking sundowner cruises to catching your own crayfish — experience Cape
          Town&apos;s coastline like never before. Unforgettable adventures await on the waters
          of the Mother City.
        </p>

        <div className="hidden flex-col gap-3 sm:flex-row lg:flex lg:gap-4">
          <Link
            href="#packages"
            className="btn-primary min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 lg:px-8 lg:py-4"
          >
            Explore Packages
          </Link>
          <Link href="#gallery-preview" className="btn-secondary-glass min-h-12">
            See Our Adventures
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        <div
          className="grid grid-cols-3 gap-2 pt-1 sm:gap-3 lg:max-w-2xl lg:pt-2"
          role="list"
          aria-label="Trust indicators"
        >
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              role="listitem"
              className="glass-panel-media rounded-xl p-2.5 text-center sm:rounded-2xl sm:p-3"
            >
              <div className="text-lg font-bold text-orange-300 sm:text-xl lg:text-2xl">
                {stat.value}
              </div>
              <div className="text-[9px] uppercase leading-tight tracking-wider text-white/75 sm:text-[10px] lg:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <HeroLogoShowcase />
    </>
  );
}

export function HomeHero() {
  return (
    <section
      className="relative min-h-[88svh] overflow-hidden pt-20 sm:pt-24 lg:min-h-screen lg:pt-28"
      aria-labelledby="hero-heading"
      data-testid="home-hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${siteConfig.heroPoster})` }}
        />
        <HeroMediaCarousel poster={siteConfig.heroPoster} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[var(--theme-bg)]/95 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-black/25" />
      <div className="wide-shell relative flex min-h-[calc(88svh-5rem)] items-end pb-24 sm:pb-28 lg:min-h-[calc(100vh-7rem)] lg:items-center lg:pb-10">
        <div className="grid w-full items-end lg:grid-cols-2 lg:items-center lg:gap-16">
          <CharterHeroContent />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/50 lg:flex" aria-hidden="true">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
