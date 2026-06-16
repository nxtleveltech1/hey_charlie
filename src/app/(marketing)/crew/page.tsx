import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Metadata } from "next";
import { CrewCard, crewImagePositions, crewImageScales } from "@/components/crew/crew-card";

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
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-[var(--theme-surface)] via-orange-500/5 to-[var(--theme-bg)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
      />

      <div className="wide-shell flex flex-1 flex-col justify-center gap-6 pb-8 pt-24 lg:gap-8 lg:pt-28">
        {/* Header */}
        <header className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 lg:text-sm">
            The people behind the boat
          </p>
          <h1 className="mb-3 text-3xl font-bold md:text-5xl lg:text-6xl">
            Meet the <span className="text-gradient-sunset">Crew</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--theme-text-secondary)] lg:text-lg">
            Skippers, deckhands and operations — the team that keeps every charter safe, smooth and
            unforgettable on the Cape coast.
          </p>
        </header>

        {/* Crew grid */}
        {crew.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[var(--theme-text-muted)]">Crew information coming soon!</p>
          </div>
        ) : (
          <ul className="grid w-full list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {crew.map((member) => (
              <li key={member.id} className="flex">
                <CrewCard
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  certifications={member.certifications}
                  imageUrl={member.imageUrl}
                  imagePosition={crewImagePositions[member.name] ?? "object-center"}
                  imageScale={crewImageScales[member.name] ?? 1}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Slim CTA */}
        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <p className="text-sm text-[var(--theme-text-secondary)] lg:text-base">
            Ready to fish with our crew?
          </p>
          <a
            href="/packages"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View packages
          </a>
        </div>
      </div>
    </section>
  );
}
