"use client";

import Link from "next/link";
import { specialOffers } from "@/lib/home-content";

export function OffersCarousel() {
  return (
    <section
      className="section-pad-tight border-y border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-orange-500/10"
      aria-labelledby="offers-heading"
    >
      <div className="wide-shell section-stack">
        <p id="offers-heading" className="section-eyebrow mx-auto w-fit lg:mx-0">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
          Special offers
        </p>
        <div className="mobile-scroll-strip lg:grid lg:grid-cols-3 lg:gap-5">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col gap-3 rounded-2xl border border-orange-500/20 bg-[var(--theme-card-bg)] p-4 lg:p-5 light-card"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-sm font-bold text-white">
                  {offer.code.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base lg:text-lg font-semibold mb-0.5">{offer.title}</h3>
                  <p className="text-sm text-[var(--theme-text-secondary)] leading-snug">
                    {offer.description}
                  </p>
                </div>
              </div>
              <p className="text-xs text-orange-500 font-medium">
                Code: {offer.code} · Valid until {offer.validUntil}
              </p>
              <Link
                href="#packages"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity lg:w-auto lg:self-start lg:rounded-full lg:px-5"
              >
                View Packages
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
