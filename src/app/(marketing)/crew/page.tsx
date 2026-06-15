import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";

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
    <>
      <section className="relative bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)] pb-16 pt-28 lg:pt-32">
        <div className="wide-shell text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            Meet the <span className="text-orange-500">Crew</span>
          </h1>
          <p className="text-xl text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Our experienced team is dedicated to making your fishing adventure unforgettable
          </p>
        </div>
      </section>

      {/* Crew Grid */}
      <section className="wide-shell py-16">
        {crew.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--theme-text-muted)]">Crew information coming soon!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
      <section className="py-16 bg-[var(--theme-surface)]">
        <div className="wide-shell text-center">
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
    </>
  );
}
