import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { PackageCard } from "./package-card";

export async function PackagesSection() {
  const allPackages = await db.query.packages.findMany({
    where: eq(packages.isActive, true),
    orderBy: [desc(packages.isFeatured), desc(packages.createdAt)],
    limit: 6,
  });

  if (allPackages.length === 0) {
    return (
      <section id="packages" className="py-16 lg:py-24 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 lg:mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Charter <span className="text-gradient-ocean">Packages</span>
            </h2>
            <p className="text-sm lg:text-base text-[var(--theme-text-muted)] max-w-2xl mx-auto px-4">
              Coming soon! Our charter packages are being prepared for you.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-16 lg:py-24 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 lg:mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Charter <span className="text-gradient-ocean">Packages</span>
          </h2>
          <p className="text-sm lg:text-base text-[var(--theme-text-muted)] max-w-2xl mx-auto px-4">
            Curated experiences for every occasion. All packages include professional crew, 
            safety equipment, and the Hey Charlie hospitality guarantee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {allPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm lg:text-base"
          >
            View All Packages
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

