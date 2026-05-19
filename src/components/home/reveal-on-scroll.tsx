"use client";

import { useLayoutEffect, useRef } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Use inside CSS grids — wrapper won't break column/row placement */
  layout?: "block" | "contents";
}

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  layout = "block",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    const target =
      layout === "contents" && wrapper.firstElementChild instanceof HTMLElement
        ? wrapper.firstElementChild
        : wrapper;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      target.style.setProperty("--reveal-delay", `${delay}ms`);
      target.classList.add("reveal-visible");
    };

    if (layout === "contents") {
      target.classList.add("reveal-up");
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      reveal();
      return;
    }

    const tryReveal = () => {
      if (isInViewport(target)) {
        reveal();
        return true;
      }
      return false;
    };

    if (tryReveal()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(target);

    const timers = [0, 50, 150, 400].map((ms) =>
      window.setTimeout(() => {
        if (tryReveal()) observer.disconnect();
      }, ms),
    );

    const onScroll = () => {
      if (tryReveal()) observer.disconnect();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, [delay, layout]);

  if (layout === "contents") {
    return (
      <div ref={ref} className={`contents ${className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`reveal-up ${className}`.trim()}>
      {children}
    </div>
  );
}
