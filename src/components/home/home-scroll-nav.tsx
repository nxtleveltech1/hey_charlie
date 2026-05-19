"use client";

import { useEffect, useState } from "react";
import { PublicDesktopNav } from "@/components/public-desktop-nav";

export function HomeScrollNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PublicDesktopNav
      active="home"
      navSurface={scrolled ? "solid" : "transparent"}
    />
  );
}
