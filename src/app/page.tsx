import type { Metadata } from "next";
import { db } from "@/db";
import { packages as pkgTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getGalleryPreviewImages } from "@/lib/gallery";
import { siteConfig } from "@/lib/site";
import { HomePageShell } from "@/components/home/home-page-shell";
import { HomeHero } from "@/components/home/home-hero";
import { ExperienceGrid } from "@/components/home/experience-grid";
import { OffersCarousel } from "@/components/home/offers-carousel";
import { HomePackagesSection } from "@/components/home/home-packages-section";
import { DestinationsPreview } from "@/components/home/destinations-preview";
import { GalleryPreviewStrip } from "@/components/home/gallery-preview-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { AboutCaptain } from "@/components/home/about-captain";
import { ContactCta } from "@/components/home/contact-cta";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata: Metadata = {
  title: "Hey Charlie Charters | Cape Town Boat Charters",
  description: siteConfig.description,
  openGraph: {
    title: "Hey Charlie Charters | Cape Town Boat Charters",
    description: siteConfig.description,
    images: [siteConfig.heroPoster],
  },
};

export default async function Home() {
  const [dbPackages, galleryImages] = await Promise.all([
    db.query.packages.findMany({
      where: eq(pkgTable.isActive, true),
      orderBy: [desc(pkgTable.isFeatured), desc(pkgTable.createdAt)],
    }),
    getGalleryPreviewImages(8),
  ]);

  const displayPackages = dbPackages.slice(0, 6).map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    tagline: pkg.tagline,
    description: pkg.description,
    duration: pkg.duration,
    pricePerPerson: String(pkg.pricePerPerson),
    category: pkg.category,
    highlights: pkg.highlights ?? [],
    isFeatured: pkg.isFeatured,
    imageUrl: pkg.imageUrl,
  }));

  return (
    <HomePageShell>
      <HomeHero />
      <ExperienceGrid />
      <OffersCarousel />
      <HomePackagesSection packages={displayPackages} totalCount={dbPackages.length} />
      <DestinationsPreview />
      <GalleryPreviewStrip images={galleryImages} />
      <HowItWorks />
      <TestimonialsSection />
      <AboutCaptain />
      <ContactCta />
      <SiteFooter />
    </HomePageShell>
  );
}
