import type { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";
import { MobileStickyActions } from "@/components/mobile-sticky-actions";
import { PublicDesktopNav } from "@/components/public-desktop-nav";
import { GalleryExperience } from "@/components/gallery-experience";
import { getGalleryMedia } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery | Hey Charlie Charters",
  description:
    "Browse Hey Charlie Charters photos and videos from real Cape Town boat charter adventures.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const media = await getGalleryMedia();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300 mobile-bottom-safe lg:pb-0">
      <MobileNav />
      <PublicDesktopNav active="gallery" />
      <MobileStickyActions primaryHref="/packages" secondaryHref="/#contact" />
      <GalleryExperience media={media} />
    </main>
  );
}
