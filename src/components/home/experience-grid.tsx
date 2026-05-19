import Link from "next/link";
import Image from "next/image";
import { experiences } from "@/lib/home-content";
import { SectionHeader } from "./section-header";
import { ExperienceIconSvg } from "./experience-icons";
import { RevealOnScroll } from "./reveal-on-scroll";

export function ExperienceGrid() {
  return (
    <section
      id="experiences"
      className="section-pad -mt-6 lg:-mt-10 overflow-visible"
      aria-labelledby="experiences-heading"
    >
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="experiences-heading"
              dense
              eyebrow="What we offer"
              title={
                <>
                  Unforgettable <span className="text-gradient-sunset">Experiences</span>
                </>
              }
              subtitle="From peaceful sunset cruises to adrenaline-pumping fishing adventures — there's something for everyone on the waters of Cape Town."
            />

            <div className="relative">
              <div className="mobile-scroll-strip lg:grid lg:grid-cols-3 2xl:grid-cols-6 lg:gap-5 2xl:gap-4">
                {experiences.map((exp) => (
                  <Link
                    key={exp.name}
                    href={exp.href}
                    className="group relative flex flex-row items-center gap-3 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-4 sm:flex-col sm:items-stretch sm:p-5 lg:p-6 transition-all duration-500 card-hover light-card hover:border-orange-500/25 hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-pink-500/10 self-start"
                  >
                    {exp.image && (
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                        aria-hidden="true"
                      >
                        <Image src={exp.image} alt="" fill className="object-cover" sizes="280px" />
                      </div>
                    )}
                    <div className="relative flex flex-row items-center gap-3 sm:block">
                      <div className="inline-flex shrink-0 rounded-xl bg-orange-500/10 p-2.5 text-orange-500 sm:mb-3">
                        <ExperienceIconSvg icon={exp.icon} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-0.5 sm:mb-1">{exp.name}</h3>
                        <p className="text-[var(--theme-text-muted)] text-xs sm:text-sm">{exp.count}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-[var(--theme-text-muted)] lg:hidden" aria-hidden="true">
                Swipe for more →
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
