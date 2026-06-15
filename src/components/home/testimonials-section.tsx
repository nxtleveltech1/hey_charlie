import { testimonials } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

function getInitials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TestimonialsSection() {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-pad" aria-labelledby="testimonials-heading">
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="testimonials-heading"
              dense
              eyebrow="Guest reviews"
              title={
                <>
                  Guest <span className="text-gradient-ocean">Stories</span>
                </>
              }
              subtitle="Real experiences from real adventurers"
            />

            <div className="mobile-scroll-strip w-full lg:grid lg:grid-cols-3 lg:gap-5 2xl:gap-6">
              {testimonials.map((t) => (
                <article
                  key={t.author}
                  className="relative flex flex-col rounded-2xl lg:rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-4 lg:p-6 light-card"
                >
                  <svg
                    className="absolute -top-3 lg:-top-4 left-5 lg:left-6 h-9 w-9 text-orange-500/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  <div
                    className="flex gap-0.5 mb-2 lg:mb-3"
                    role="img"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j} className="text-orange-500 text-sm lg:text-base" aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                  <blockquote className="text-sm lg:text-base text-[var(--theme-text-secondary)] mb-4 lg:mb-5 relative z-10 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="flex items-center gap-3 mt-auto">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-sm font-bold text-white"
                      aria-hidden="true"
                    >
                      {getInitials(t.author)}
                    </div>
                    <div>
                      <cite className="font-semibold text-sm lg:text-base not-italic">{t.author}</cite>
                      <p className="text-[var(--theme-text-muted)] text-xs lg:text-sm">{t.location}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
