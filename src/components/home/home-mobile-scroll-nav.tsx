"use client";

import { useEffect, useState } from "react";
import { MobileNav } from "@/components/mobile-nav";

export function HomeMobileScrollNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <MobileNav variant={scrolled ? "solid" : "hero"} />;
}
