"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ShowcaseSlide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "logo" };

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    kind: "image",
    src: "/Gallery/HC%201%20(42).jpeg",
    alt: "Guests enjoying a Hey Charlie Charters cruise along the Cape Town coastline",
  },
  {
    kind: "image",
    src: "/Gallery/HC%201%20(41).jpeg",
    alt: "Adventure on the water with Hey Charlie Charters",
  },
  {
    kind: "image",
    src: "/Gallery/HC%201%20(31).jpeg",
    alt: "Hey Charlie Charters boat with branded hull artwork",
  },
  { kind: "logo" },
];

const ROTATE_INTERVAL_MS = 4500;

function ShowcaseSlideContent({
  slide,
  isActive,
  slideIndex,
}: {
  slide: ShowcaseSlide;
  isActive: boolean;
  slideIndex: number;
}) {
  if (slide.kind === "image") {
    return (
      <div className="relative h-full w-full">
        <Image
          src={slide.src}
          alt={isActive ? slide.alt : ""}
          fill
          className="object-cover object-center"
          priority={slideIndex === 0}
          sizes="(min-width: 1024px) 42vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1030] via-[#0f1e35] to-[#0a2838]">
      <div className="relative h-[94%] w-[94%]">
        <Image
          src="/logo2.png"
          alt={isActive ? "Hey Charlie Charters" : ""}
          fill
          className="object-contain"
          priority
          sizes="512px"
        />
      </div>
    </div>
  );
}

export function HeroLogoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionEnabled(!mediaQuery.matches);

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_SLIDES.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [motionEnabled]);

  return (
    <div className="relative hidden w-full lg:block">
      <div className="relative w-full aspect-[4/3]">
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
          {SHOWCASE_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.kind === "image" ? slide.src : "logo"}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 1 : 0,
                  transition: motionEnabled ? "opacity 0.6s ease-in-out" : "none",
                }}
                aria-hidden={!isActive}
              >
                <ShowcaseSlideContent
                  slide={slide}
                  isActive={isActive}
                  slideIndex={index}
                />
              </div>
            );
          })}
        </div>

        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          aria-hidden="true"
        >
          {SHOWCASE_SLIDES.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="absolute -right-4 -top-4 z-20 animate-float rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white">
          Whale Season Now!
        </div>
        <div className="absolute -bottom-4 -left-4 z-20 animate-float-delayed rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-medium text-white">
          Crayfish Available
        </div>
      </div>
    </div>
  );
}
