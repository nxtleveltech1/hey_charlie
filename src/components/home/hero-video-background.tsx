"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoPlayerProps {
  poster: string;
  videoSrc: string;
}

/** Client-only video layer — mounts after hydration to avoid SSR/client tree mismatches. */
export function HeroVideoPlayer({ poster, videoSrc }: HeroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const startVideo = () => {
      setActive(true);
      requestAnimationFrame(() => {
        videoRef.current?.play().catch(() => {});
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(startVideo, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(startVideo, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
