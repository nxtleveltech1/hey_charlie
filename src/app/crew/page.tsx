import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Meet the Crew | Hey Charlie Charters",
  description: "Meet our experienced team of fishing charter captains and crew members.",
};

export default async function CrewPage() {
  const crew = await db.query.crewMembers.findMany({
    where: eq(crewMembers.isActive, true),
    orderBy: [asc(crewMembers.displayOrder)],
  });

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl z-50 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-nav-bg-transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo2.png" alt="Hey Charlie Charters" width={50} height={50} className="rounded-xl" />
              <div>
                <span className="text-xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display)" }}>
                  Hey Charlie
                </span>
                <span className="block text-[10px] font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/#packages" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Packages</Link>
              <Link href="/destinations" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Destinations</Link>
              <span className="text-sm text-orange-400 font-medium">Crew</span>
              <Link href="/news" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">News</Link>
              <Link href="/weather" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Weather</Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignedOut>
                <Link href="/sign-in" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Sign In</Link>
                <Link href="/#packages" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity">Book Now</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">My Bookings</Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-orange-500/50" } }} />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="text-orange-500">Crew</span>
          </h1>
          <p className="text-xl text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Our experienced team is dedicated to making your fishing adventure unforgettable
          </p>
        </div>
      </section>

      {/* Crew Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {crew.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--theme-text-muted)]">Crew information coming soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crew.map((member) => (
              <div
                key={member.id}
                className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] overflow-hidden group hover:border-orange-500/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-72 bg-gradient-to-br from-[var(--theme-bg)] to-[var(--theme-surface)]">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      👨‍✈️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-orange-500 font-medium mb-3">{member.role}</p>

                  {member.bio && (
                    <p className="text-[var(--theme-text-muted)] text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {member.yearsExperience && (
                      <div className="flex items-center gap-1.5 text-[var(--theme-text-muted)]">
                        <span>⏱️</span>
                        <span>{member.yearsExperience} years exp.</span>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {member.certifications && member.certifications.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-orange-500/10 text-orange-400 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--theme-surface)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Fish with Our Crew?
          </h2>
          <p className="text-[var(--theme-text-muted)] mb-8">
            Book your charter today and experience the expertise of our team firsthand.
          </p>
          <a
            href="/packages"
            className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            View Packages
          </a>
        </div>
      </section>
    </main>
  );
}

