"use client";

import Image from "next/image";

interface BrandLogoProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
  width?: number;
  height?: number;
}

export function BrandLogo({
  variant = "full",
  className = "",
  width = 40,
  height = 40,
}: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 ${className}`}
        style={{ width, height }}
        aria-hidden="true"
      >
        <span
          className="text-white font-bold italic"
          style={{ fontFamily: "var(--font-display)", fontSize: width * 0.45 }}
        >
          HC
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={className}>
        <span
          className="block text-base lg:text-lg font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hey Charlie
        </span>
        <span className="block text-[10px] lg:text-xs font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
          CHARTERS
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-block whitespace-nowrap bg-gradient-to-r from-rose-600 via-cyan-600 to-orange-600 bg-clip-text font-black leading-[1.12] pb-[0.08em] text-transparent ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      Hey Charlie Charters
    </span>
  );
}

interface NavWordmarkProps {
  surface?: "hero" | "solid";
  size?: "desktop" | "mobile";
  className?: string;
}

/** Single-line gradient wordmark for top navigation */
export function NavWordmark({
  surface = "solid",
  size = "desktop",
  className = "",
}: NavWordmarkProps) {
  const sizeClass =
    size === "desktop"
      ? "text-[clamp(1.85rem,2.35vw,2.85rem)]"
      : "text-[clamp(1.05rem,4.2vw,1.65rem)]";

  const gradientClass =
    surface === "hero"
      ? "bg-gradient-to-r from-orange-500 via-cyan-400 to-rose-500"
      : "bg-gradient-to-r from-rose-600 via-cyan-600 to-orange-600";

  return (
    <span
      className={`inline-block overflow-visible whitespace-nowrap ${gradientClass} bg-clip-text font-black leading-[1.12] pb-[0.1em] text-transparent ${sizeClass} ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      Hey Charlie Charters
    </span>
  );
}

/** Client component: tries logo2.png, falls back to gradient wordmark on error */
export function BrandLogoImage({
  width = 300,
  height = 300,
  className = "",
  alt = "Hey Charlie Charters",
}: {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/logo2.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
