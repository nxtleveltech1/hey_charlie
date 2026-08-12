import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookingForm } from "@/components/booking-form";
import { CapeCourageBookingForm } from "@/components/booking/cape-courage-booking-form";
import { BookingHero } from "@/components/booking/booking-hero";
import { BookingPackageSummary } from "@/components/booking/booking-package-summary";
import { SectionHeader } from "@/components/home/section-header";
import { isCapeCourage } from "@/lib/cape-courage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ packageSlug: string }>;
}): Promise<Metadata> {
  const { packageSlug } = await params;
  const pkg = await db.query.packages.findFirst({
    where: eq(packages.slug, packageSlug),
  });

  if (!pkg) {
    return { title: "Book a Charter | Hey Charlie Charters" };
  }

  return {
    title: `Book ${pkg.name} | Hey Charlie Charters`,
    description: pkg.description,
  };
}

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

  const eventTicket = isCapeCourage(pkg.slug);

  return (
    <>
      <BookingHero
        name={pkg.name}
        slug={pkg.slug}
        tagline={pkg.tagline}
        duration={pkg.duration}
        pricePerPerson={String(pkg.pricePerPerson)}
        imageUrl={pkg.imageUrl}
      />

      <section className="section-pad">
        <div className="wide-shell">
          <SectionHeader
            align="left"
            compact
            eyebrow="Reserve your charter"
            className="max-w-none lg:mb-8"
            title={
              <>
                Book your <span className="text-gradient-sunset">experience</span>
              </>
            }
            subtitle="Choose your date, time, and party size. We'll confirm availability within 24 hours."
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.25fr)] lg:gap-8">
            <BookingPackageSummary
              name={pkg.name}
              slug={pkg.slug}
              tagline={pkg.tagline}
              description={pkg.description}
              duration={pkg.duration}
              pricePerPerson={String(pkg.pricePerPerson)}
              minGuests={pkg.minGuests}
              maxGuests={pkg.maxGuests}
              highlights={pkg.highlights}
              imageUrl={pkg.imageUrl}
              category={pkg.category}
            />

            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 light-card lg:p-8">
              {eventTicket ? (
                <CapeCourageBookingForm packageData={pkg} />
              ) : (
                <BookingForm packageData={pkg} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
