"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { siteConfig, trustStats } from "@/lib/site";
import { HeroLogoShowcase } from "./hero-logo-showcase";
import { HeroMediaCarousel } from "./hero-media-carousel";

const HERO_SLIDE_COUNT = 2;
const HERO_ROTATION_MS = 10_000;
const CAPE_COURAGE_IMAGE = "/images/cape-courage-vip.png";

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

function CapeCourageHeroContent() {
  return (
    <>
      <div className="max-w-3xl space-y-4 text-left sm:space-y-5 lg:space-y-6">
        <div className="section-eyebrow-hero">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden="true" />
          Limited event experience · July–August 2026
        </div>

        <h1
          id="hero-heading"
          className="max-w-[95%] text-[clamp(2rem,8vw,4.75rem)] font-bold leading-[1.02] text-white text-balance sm:max-w-4xl lg:max-w-none lg:text-7xl 2xl:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cape Courage <span className="text-gradient-sunset">VIP Pass</span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
          Front-row boat-based viewing aboard Hey Charlie, alongside the big-wave surfers and
          media fleet. Food and drinks are included for the event day.
        </p>

        <div className="flex flex-wrap gap-2 text-sm font-semibold text-white sm:text-base">
          <span className="glass-panel-media rounded-full px-4 py-2">Only 7 guest places</span>
          <span className="glass-panel-media rounded-full px-4 py-2">R3,250 per person</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:gap-4">
          <Link
            href="/booking/cape-courage-vip"
            className="btn-primary min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 lg:px-8 lg:py-4"
          >
            Book Your Spot Now
          </Link>
          <Link href="/packages/cape-courage-vip" className="btn-secondary-glass min-h-12">
            View Event Details
          </Link>
        </div>
      </div>

      <div className="relative hidden h-[min(68vh,720px)] w-full justify-self-end lg:block">
        <div className="absolute inset-y-0 right-0 aspect-[2/3] overflow-hidden rounded-3xl border border-white/20 bg-[#071827] shadow-2xl shadow-black/40">
          <Image
            src={CAPE_COURAGE_IMAGE}
            alt="Cape Courage VIP Pass aboard Hey Charlie Charters"
            fill
            priority
            className="object-contain"
            sizes="(min-width: 1280px) 34vw, 40vw"
          />
        </div>
      </div>
    </>
  );
}

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);

  const showSlide = useCallback((index: number) => {
    setActiveSlide((index + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionEnabled(!mediaQuery.matches);

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (!motionEnabled || paused) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDE_COUNT);
    }, HERO_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [motionEnabled, paused]);

  return (
    <section
      className="relative min-h-[88svh] overflow-hidden pt-20 sm:pt-24 lg:min-h-screen lg:pt-28"
      aria-labelledby="hero-heading"
      data-testid="home-hero-carousel"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: activeSlide === 0 ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${siteConfig.heroPoster})` }}
          />
          <HeroMediaCarousel poster={siteConfig.heroPoster} />
        </div>

        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: activeSlide === 1 ? 1 : 0 }}
        >
          <Image
            src={CAPE_COURAGE_IMAGE}
            alt=""
            fill
            priority
            className="scale-110 object-cover object-center blur-[2px] lg:object-[65%_52%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#071827]/45 backdrop-blur-[1px]" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[var(--theme-bg)]/95 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/65 lg:to-black/30" />

      <div className="wide-shell relative flex min-h-[calc(88svh-5rem)] items-end pb-24 sm:pb-28 lg:min-h-[calc(100vh-7rem)] lg:items-center lg:pb-10">
        <div
          key={activeSlide}
          className="grid w-full items-end lg:grid-cols-2 lg:items-center lg:gap-16"
          aria-live="polite"
          data-testid={activeSlide === 0 ? "charter-hero-slide" : "cape-courage-hero-slide"}
        >
          {activeSlide === 0 ? <CharterHeroContent /> : <CapeCourageHeroContent />}
        </div>
      </div>

      <div
        className="absolute bottom-5 right-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 p-2 text-white shadow-lg backdrop-blur-md sm:right-6 lg:bottom-7 lg:right-10"
        role="group"
        aria-label="Homepage hero slides"
      >
        <button
          type="button"
          onClick={() => showSlide(activeSlide - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Previous hero slide"
        >
          <span aria-hidden="true">←</span>
        </button>

        {["Charter adventures", "Cape Courage VIP Pass"].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => showSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeSlide === index ? "w-8 bg-orange-400" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Show ${label}`}
            aria-current={activeSlide === index ? "true" : undefined}
          />
        ))}

        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={paused || !motionEnabled ? "Play hero carousel" : "Pause hero carousel"}
          disabled={!motionEnabled}
        >
          <span aria-hidden="true">{paused || !motionEnabled ? "▶" : "Ⅱ"}</span>
        </button>

        <button
          type="button"
          onClick={() => showSlide(activeSlide + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Next hero slide"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/50 lg:flex"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
