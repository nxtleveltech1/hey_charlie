import Link from "next/link";
import { siteConfig, trustStats } from "@/lib/site";
import { HeroLogoShowcase } from "./hero-logo-showcase";
import { HeroVideoPlayer } from "./hero-video-background";

export function HomeHero() {
  return (
    <section
      className="relative min-h-[88svh] lg:min-h-screen overflow-hidden pt-20 sm:pt-24 lg:pt-28"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${siteConfig.heroPoster})` }}
        />
        <HeroVideoPlayer poster={siteConfig.heroPoster} videoSrc={siteConfig.heroVideo} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[var(--theme-bg)]/95 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-black/25" />

      <div className="wide-shell relative flex min-h-[calc(88svh-5rem)] items-end pb-20 sm:pb-24 lg:min-h-[calc(100vh-7rem)] lg:items-center lg:pb-0">
        <div className="grid w-full items-end lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-4xl space-y-4 sm:space-y-5 text-left lg:space-y-6">
            <div className="section-eyebrow-hero">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" aria-hidden="true" />
            {siteConfig.tagline}
          </div>

          <h1
            id="hero-heading"
            className="max-w-[95%] sm:max-w-4xl text-[clamp(1.75rem,7.5vw,4.5rem)] lg:max-w-none lg:text-7xl 2xl:text-8xl font-bold leading-[1.08] text-white text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Discover the{" "}
            <span className="text-gradient-sunset">magic</span> of the{" "}
            <span className="text-gradient-ocean">Cape Coast</span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
            From breathtaking sundowner cruises to catching your own crayfish — experience Cape
            Town&apos;s coastline like never before. Unforgettable adventures await on the waters
            of the Mother City.
          </p>

          <div className="hidden lg:flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Link
              href="#packages"
              className="min-h-12 px-6 lg:px-8 py-3 lg:py-4 text-center font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl hover:shadow-lg hover:shadow-orange-500/25 transition-all btn-primary"
            >
              Explore Packages
            </Link>
            <Link href="#gallery-preview" className="btn-secondary-glass min-h-12">
              See Our Adventures
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          <div
            className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 lg:max-w-2xl lg:pt-2"
            role="list"
            aria-label="Trust indicators"
          >
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                role="listitem"
                className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center"
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-300">{stat.value}</div>
                <div className="text-[9px] sm:text-[10px] lg:text-xs text-white/75 uppercase tracking-wider leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          </div>

          <HeroLogoShowcase />
        </div>
      </div>

      <div
        className="absolute bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-white/50 animate-scroll-cue pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
