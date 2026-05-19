import { howItWorksSteps } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { StepIcon } from "./experience-icons";
import { RevealOnScroll } from "./reveal-on-scroll";

export function HowItWorks() {
  return (
    <section className="section-pad-sm" aria-labelledby="how-it-works-heading">
      <div className="wide-shell">
        <div className="section-glow-divider mb-6 lg:mb-8" aria-hidden="true" />
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="how-it-works-heading"
              eyebrow="Simple process"
              dense
              title={
                <>
                  How It <span className="text-gradient-sunset">Works</span>
                </>
              }
              subtitle="From booking to boarding — we make your Cape Town charter effortless."
            />

            <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.step}
                  className="relative rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-5 lg:p-6 light-card text-center md:text-left"
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-orange-500/20 text-cyan-500">
                    <StepIcon icon={step.icon} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Step {step.step}
                  </span>
                  <h3 className="text-lg font-semibold mt-1.5 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
