import { Metadata } from "next";
import { db } from "@/db";
import { packages as pkgTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { MobileNav } from "@/components/mobile-nav";
import { PublicDesktopNav } from "@/components/public-desktop-nav";
import { PackageCard } from "@/components/package-card";

export const metadata: Metadata = {
  title: "Charter Packages | Hey Charlie Charters",
  description:
    "Browse all Hey Charlie charter experiences — sundowner cruises, wildlife, fishing, and private charters on the Cape Town coast.",
};

export default async function PackagesPage() {
  const rows = await db.query.packages.findMany({
    where: eq(pkgTable.isActive, true),
    orderBy: [desc(pkgTable.isFeatured), desc(pkgTable.createdAt)],
  });

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))`,
          }}
        />
        <div
          className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-float opacity-60"
          style={{ background: "var(--theme-glow-orange)" }}
        />
      </div>

      <MobileNav />
      <PublicDesktopNav active="packages" />

      <section className="relative pt-28 lg:pt-36 pb-12 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Charter <span className="text-gradient-ocean">Packages</span>
          </h1>
          <p className="text-lg text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Curated experiences for every occasion. All packages include professional crew, safety equipment, and the Hey
            Charlie hospitality guarantee.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 lg:px-6 max-w-7xl mx-auto">
        {rows.length === 0 ? (
          <p className="text-center text-[var(--theme-text-muted)] py-16">
            No packages available yet. Please check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {rows.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={{
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
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
