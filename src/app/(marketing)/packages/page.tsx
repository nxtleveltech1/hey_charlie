import { Metadata } from "next";
import { db } from "@/db";
import { packages as pkgTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  HomePackagesSection,
  type HomePackage,
} from "@/components/home/home-packages-section";

export const metadata: Metadata = {
  title: "Charter Packages | Hey Charlie Charters",
  description:
    "Browse all Hey Charlie charter experiences — sundowner cruises, wildlife, fishing, and private charters on the Cape Town coast.",
};

function mapPackageRow(pkg: typeof pkgTable.$inferSelect): HomePackage {
  return {
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
  };
}

export default async function PackagesPage() {
  const rows = await db.query.packages.findMany({
    where: eq(pkgTable.isActive, true),
    orderBy: [desc(pkgTable.isFeatured), desc(pkgTable.createdAt)],
  });

  const packages = rows.map(mapPackageRow);

  return (
    <>
      <section className="relative pb-12 pt-28 lg:pt-36">
        <div className="wide-shell text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Charter <span className="text-gradient-ocean">Packages</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base text-[var(--theme-text-muted)] sm:text-lg">
            Curated experiences for every occasion. All packages include
            professional crew, safety equipment, and the Hey Charlie hospitality
            guarantee.
          </p>
        </div>
      </section>

      {packages.length === 0 ? (
        <section className="wide-shell pb-20">
          <EmptyState
            title="No packages yet"
            description="Please check back soon for new charter experiences."
            action={
              <Button href="/#contact" variant="primary">
                Contact us
              </Button>
            }
          />
        </section>
      ) : (
        <HomePackagesSection
          packages={packages}
          totalCount={packages.length}
          hideHeader
          showViewAllLink={false}
        />
      )}
    </>
  );
}
