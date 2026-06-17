"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type HeroSlide = { type: "video"; src: string; poster?: string };

const encode = (file: string) => `/Gallery/${encodeURIComponent(file)}`;

/**
 * Ordered rotation of hero video. Leads with the original hero clip, then
 * cycles through the new gallery videos so the background keeps moving.
 */
const slides: HeroSlide[] = [
  { type: "video", src: "/Gallery/HC%201%20(2).mp4", poster: "/Gallery/HC%201%20(2).jpeg" },
  { type: "video", src: encode("WhatsApp Video 2026-06-10 at 16.20.08.mp4") },
  { type: "video", src: encode("WhatsApp Video 2026-06-10 at 16.49.24.mp4") },
];

const VIDEO_MAX_DURATION = 14000;

interface HeroMediaCarouselProps {
  poster: string;
}

/** Client-only crossfading hero background that rotates through photos and clips. */
export function HeroMediaCarousel({ poster }: HeroMediaCarouselProps) {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const advance = useCallback(() => {
    setActive((current) => (current + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = videoRefs.current[active];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    // Fallback in case the clip runs long or `ended` never fires.
    const timer = setTimeout(advance, VIDEO_MAX_DURATION);

    // Pause any non-active videos so only one decodes at a time.
    videoRefs.current.forEach((video, index) => {
      if (video && index !== active) video.pause();
    });

    return () => clearTimeout(timer);
  }, [active, advance]);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, index) => {
        const isActive = index === active;

        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isActive ? 1 : 0 }}
            aria-hidden="true"
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload={index === 0 ? "metadata" : "none"}
              poster={slide.poster ?? poster}
              onEnded={isActive ? advance : undefined}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          </div>
        );
      })}
    </div>
  );
}
