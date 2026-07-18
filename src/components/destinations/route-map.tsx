"use client";

import { useState } from "react";
import Link from "next/link";
import { locations, type Location } from "@/lib/locations";

// Map projection bounds — Cape Peninsula
const LNG_MIN = 18.3;
const LNG_MAX = 18.55;
const LAT_TOP = -33.85;
const LAT_BOTTOM = -34.42;
const W = 1000;
const H = 640;

function project(coordinates: { lat: number; lng: number }) {
  return {
    x: ((coordinates.lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W,
    y: ((LAT_TOP - coordinates.lat) / (LAT_TOP - LAT_BOTTOM)) * H,
  };
}

const CATEGORY_STYLES: Record<
  Location["category"],
  { color: string; label: string; icon: string }
> = {
  beach: { color: "#f97316", label: "Beach", icon: "🏖️" },
  harbor: { color: "#06b6d4", label: "Harbor", icon: "⚓" },
  "marine-reserve": { color: "#22c55e", label: "Marine Reserve", icon: "🐧" },
  landmark: { color: "#a855f7", label: "Landmark", icon: "🏔️" },
};

// Stylized Cape Peninsula coastline (land polygon, projected coordinate space)
const COASTLINE = `
  M 1000 262
  L 830 275
  C 760 282, 700 284, 662 296
  C 630 306, 610 302, 596 312
  C 570 322, 545 316, 528 330
  C 512 344, 512 360, 524 376
  C 536 392, 560 386, 584 394
  C 620 404, 640 420, 664 446
  C 686 470, 690 500, 720 528
  C 748 552, 790 556, 800 574
  C 792 588, 760 586, 726 578
  C 700 572, 680 566, 660 556
  C 600 528, 480 470, 380 432
  C 300 402, 240 380, 150 340
  C 100 318, 96 300, 130 292
  C 170 284, 200 290, 216 274
  C 232 258, 224 252, 244 244
  C 258 238, 250 232, 232 230
  C 210 228, 196 222, 200 208
  C 204 196, 180 190, 166 180
  C 148 168, 190 150, 240 132
  C 280 118, 300 122, 316 108
  C 330 96, 322 92, 330 82
  C 340 70, 356 66, 380 58
  C 410 48, 440 44, 480 46
  C 560 48, 700 30, 1000 16
  Z
`;

// Sailing route: V&A Waterfront → Clifton → Camps Bay → Hout Bay →
// around Cape Point → Boulders Beach → Simon's Town (drawn offshore)
const ROUTE = `
  M 483 66
  C 420 58, 360 70, 314 90
  C 308 98, 306 106, 308 114
  C 280 142, 236 172, 208 216
  C 150 250, 60 300, 60 370
  C 60 450, 200 520, 400 560
  C 520 585, 700 615, 810 592
  C 845 584, 848 552, 812 528
  C 770 495, 700 448, 646 414
  C 620 398, 566 388, 536 386
`;

// Departure point — V&A Waterfront
const VA = project({ lat: -33.9036, lng: 18.4207 });

export function RouteMap() {
  const [active, setActive] = useState<string | null>(null);

  const markers = locations.map((location) => ({
    location,
    ...project(location.coordinates),
  }));

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[var(--theme-border)] shadow-xl">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Map of Cape Peninsula sailing routes and charter destinations"
      >
        <defs>
          <linearGradient id="rm-water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b3a56" />
            <stop offset="55%" stopColor="#0a2a44" />
            <stop offset="100%" stopColor="#081c33" />
          </linearGradient>
          <linearGradient id="rm-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3d46" />
            <stop offset="100%" stopColor="#152e38" />
          </linearGradient>
          <filter id="rm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean */}
        <rect width={W} height={H} fill="url(#rm-water)" />

        {/* Subtle wave lines */}
        {[140, 300, 460].map((y, i) => (
          <path
            key={y}
            d={`M ${i % 2 === 0 ? 40 : 90} ${y} q 30 -12 60 0 t 60 0 t 60 0`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            strokeLinecap="round"
            transform={i === 1 ? "translate(-20, 60)" : undefined}
          />
        ))}

        {/* Coastal shallow-water glow */}
        <path
          d={COASTLINE}
          fill="none"
          stroke="rgba(45,212,191,0.25)"
          strokeWidth="14"
          filter="url(#rm-glow)"
        />

        {/* Land */}
        <path
          d={COASTLINE}
          fill="url(#rm-land)"
          stroke="rgba(94,234,212,0.4)"
          strokeWidth="2"
        />

        {/* Ocean labels */}
        <text
          x="120"
          y="470"
          fill="rgba(255,255,255,0.35)"
          fontSize="24"
          fontStyle="italic"
          letterSpacing="4"
        >
          ATLANTIC OCEAN
        </text>
        <text
          x="740"
          y="368"
          fill="rgba(255,255,255,0.35)"
          fontSize="22"
          fontStyle="italic"
          letterSpacing="4"
        >
          FALSE BAY
        </text>

        {/* Compass */}
        <g transform="translate(936, 84)" opacity="0.7">
          <circle r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <path d="M 0 -22 L 6 8 L 0 2 L -6 8 Z" fill="#fbbf24" />
          <text y="-36" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="16">
            N
          </text>
        </g>

        {/* Sailing route */}
        <path
          d={ROUTE}
          fill="none"
          stroke="rgba(251,191,36,0.9)"
          strokeWidth="3"
          strokeDasharray="10 10"
          strokeLinecap="round"
          className="rm-route"
        />

        {/* Boat animating along the route */}
        <g>
          <text fontSize="26" textAnchor="middle" dominantBaseline="middle">
            ⛵
            <animateMotion dur="30s" repeatCount="indefinite" path={ROUTE} />
          </text>
        </g>

        {/* Departure point — V&A Waterfront */}
        <g transform={`translate(${VA.x}, ${VA.y})`}>
          <circle r="7" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
          <text x="14" y="-6" fill="rgba(255,255,255,0.85)" fontSize="17" fontWeight="600">
            V&amp;A Waterfront
          </text>
          <text x="14" y="12" fill="rgba(255,255,255,0.5)" fontSize="13">
            Departure point
          </text>
        </g>

        {/* Destination labels (hidden on small screens) */}
        {markers.map(({ location, x, y }) => {
          // Simon's Town and Boulders Beach sit close together — anchor
          // their labels away from each other to avoid overlap
          const anchorLeft =
            location.slug === "simons-town" ||
            (location.slug !== "boulders-beach" && x > W * 0.55);
          const dy = location.slug === "boulders-beach" ? 12 : location.slug === "simons-town" ? -4 : 5;
          return (
            <text
              key={location.slug}
              x={anchorLeft ? x - 16 : x + 16}
              y={y + dy}
              textAnchor={anchorLeft ? "end" : "start"}
              fill="rgba(255,255,255,0.85)"
              fontSize="16"
              fontWeight="600"
              className="pointer-events-none hidden sm:block"
            >
              {location.name}
            </text>
          );
        })}
      </svg>

      {/* Interactive markers (HTML overlay aligned to SVG aspect) */}
      {markers.map(({ location, x, y }) => {
        const style = CATEGORY_STYLES[location.category];
        const isActive = active === location.slug;
        const tooltipBelow = y < 200;
        return (
          <div
            key={location.slug}
            className="absolute"
            style={{
              left: `${(x / W) * 100}%`,
              top: `${(y / H) * 100}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isActive ? 20 : 10,
            }}
          >
            <Link
              href={`/destinations/${location.slug}`}
              aria-label={`Explore ${location.name}`}
              className="group relative block"
              onMouseEnter={() => setActive(location.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(location.slug)}
              onBlur={() => setActive(null)}
            >
              <span
                className="absolute inset-0 -m-1 animate-ping rounded-full opacity-40"
                style={{ backgroundColor: style.color }}
              />
              <span
                className="relative block h-4 w-4 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125 lg:h-5 lg:w-5"
                style={{ backgroundColor: style.color }}
              />
            </Link>

            {isActive && (
              <div
                className={`pointer-events-none absolute left-1/2 w-56 -translate-x-1/2 rounded-xl border border-white/15 bg-slate-900/95 p-4 shadow-2xl backdrop-blur ${
                  tooltipBelow ? "top-full mt-3" : "bottom-full mb-3"
                }`}
              >
                <span
                  className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: `${style.color}33`, color: style.color }}
                >
                  {style.icon} {style.label}
                </span>
                <p className="text-sm font-bold text-white">{location.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">{location.tagline}</p>
                <p className="mt-2 text-xs font-medium text-amber-300">
                  {location.experiences.length} experiences · Explore →
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 backdrop-blur lg:bottom-5 lg:left-5">
        {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
          <span key={key} className="flex items-center gap-1.5 text-[11px] text-white/80 lg:text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: style.color }} />
            {style.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[11px] text-white/80 lg:text-xs">
          <span className="h-0.5 w-5 rounded bg-amber-400" style={{ borderTop: "2px dashed #fbbf24", background: "none" }} />
          Sailing route
        </span>
      </div>

      <style jsx>{`
        .rm-route {
          animation: rm-dash 40s linear infinite;
        }
        @keyframes rm-dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rm-route {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
