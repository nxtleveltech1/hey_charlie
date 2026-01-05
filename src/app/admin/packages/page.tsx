import { db } from "@/db";
import { packages } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { formatPrice } from "@/lib/booking-utils";

export default async function AdminPackagesPage() {
  const allPackages = await db.query.packages.findMany({
    orderBy: [desc(packages.createdAt)],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Packages
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Manage your charter packages
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          + Add Package
        </Link>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPackages.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">No packages yet</h3>
            <p className="text-[var(--theme-text-muted)] mb-4">
              Create your first charter package to start accepting bookings.
            </p>
            <Link
              href="/admin/packages/new"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create Package
            </Link>
          </div>
        ) : (
          allPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{pkg.name}</h3>
                    {pkg.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--theme-text-muted)]">{pkg.tagline}</p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${pkg.isActive ? "bg-green-500" : "bg-red-500"}`}
                  title={pkg.isActive ? "Active" : "Inactive"}
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Price</span>
                  <span className="font-medium">{formatPrice(pkg.pricePerPerson)}/person</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Duration</span>
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Capacity</span>
                  <span>{pkg.minGuests} - {pkg.maxGuests} guests</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Category</span>
                  <span className="capitalize">{pkg.category}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/packages/${pkg.id}`}
                  className="flex-1 py-2 text-center rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm"
                >
                  Edit
                </Link>
                <Link
                  href={`/booking/${pkg.slug}`}
                  target="_blank"
                  className="flex-1 py-2 text-center rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

