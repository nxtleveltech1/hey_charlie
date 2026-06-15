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

            <div className="mobile-scroll-strip w-full lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-2.5 lg:auto-rows-fr">
              {images.map((item, i) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-xl lg:rounded-2xl border border-[var(--theme-border)] ${
                    i === 0
                      ? "aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:min-h-[240px]"
                      : "aspect-[4/3] lg:min-h-[116px]"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes={i === 0 ? "(max-width: 1024px) 80vw, 40vw" : "(max-width: 1024px) 40vw, 20vw"}
                    loading="lazy"
                  />
                </div>
              ))}
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
