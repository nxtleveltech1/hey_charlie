import Link from "next/link";
import Image from "next/image";
import type { GalleryMediaItem } from "@/lib/gallery";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

interface GalleryPreviewStripProps {
  images: GalleryMediaItem[];
}

export function GalleryPreviewStrip({ images }: GalleryPreviewStripProps) {
  if (images.length === 0) return null;

  return (
    <section id="gallery-preview" className="section-pad-sm" aria-labelledby="gallery-heading">
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="gallery-heading"
              dense
              eyebrow="Real moments"
              title={
                <>
                  Life on the <span className="text-gradient-ocean">Water</span>
                </>
              }
              subtitle="Glimpse the adventures waiting for you — sundowners, wildlife encounters, and unforgettable Cape Town sunsets."
            />

            <div className="mobile-scroll-strip w-full lg:grid lg:grid-cols-4 lg:auto-rows-[10.5rem] lg:gap-3">
              {images.map((item, i) => {
                const isFeature = i === 0;
                const isWide = i === 5;

                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-xl lg:rounded-2xl border border-[var(--theme-border)] aspect-[4/3] lg:aspect-auto ${
                      isFeature ? "lg:col-span-2 lg:row-span-2" : isWide ? "lg:col-span-2" : ""
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes={
                        isFeature || isWide
                          ? "(max-width: 1024px) 80vw, 40vw"
                          : "(max-width: 1024px) 40vw, 20vw"
                      }
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        <div className="text-center mt-6">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-sm lg:text-base hover:opacity-90 transition-opacity btn-primary"
          >
            View Full Gallery
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
