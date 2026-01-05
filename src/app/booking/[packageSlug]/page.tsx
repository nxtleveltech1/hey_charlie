import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookingForm } from "@/components/booking-form";
import { formatPrice } from "@/lib/booking-utils";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ packageSlug: string }>;
}) {
  const { userId } = await auth();
  const { packageSlug } = await params;

  if (!userId) {
    redirect(`/sign-in?redirect_url=/booking/${packageSlug}`);
  }

  const pkg = await db.query.packages.findFirst({
    where: eq(packages.slug, packageSlug),
  });

  if (!pkg || !pkg.isActive) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/#packages"
            className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            ← Back to Packages
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Package Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {pkg.name}
              </h2>
              
              {pkg.tagline && (
                <p className="text-orange-500 text-sm mb-4">{pkg.tagline}</p>
              )}
              
              <p className="text-[var(--theme-text-muted)] text-sm mb-6">
                {pkg.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Duration</span>
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Price per person</span>
                  <span className="font-medium">{formatPrice(pkg.pricePerPerson)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Group size</span>
                  <span>{pkg.minGuests} - {pkg.maxGuests} guests</span>
                </div>
              </div>

              {pkg.highlights && pkg.highlights.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 text-sm">Included:</h3>
                  <ul className="space-y-2">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--theme-text-muted)]">
                        <svg className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <div className="p-6 lg:p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Book Your Experience
              </h1>
              <BookingForm packageData={pkg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

