import Image from "next/image";
import { certifications } from "@/lib/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SectionHeader } from "./section-header";
import { StepIcon } from "./experience-icons";
import { RevealOnScroll } from "./reveal-on-scroll";

const collageImages = [
  { src: "/Gallery/HC%201%20(1).jpeg", alt: "Guests enjoying a Cape Town charter" },
  { src: "/Gallery/HC%201%20(5).jpeg", alt: "Sunset on the water" },
  { src: "/Gallery/HC%201%20(12).jpeg", alt: "Coastal scenery from the boat" },
  { src: "/images/private-charter-guests.jpeg", alt: "Private charter guests celebrating" },
];

export function AboutCaptain() {
  return (
    <section
      id="about"
      className="section-pad bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
      aria-labelledby="about-heading"
    >
      <div className="wide-shell">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <RevealOnScroll className="order-2 lg:order-1">
            <SectionHeader
              id="about-heading"
              eyebrow="Your captain"
              align="left"
              compact
              className="text-center lg:text-left"
              title={
                <>
                  Meet <span className="text-gradient-sunset">Charlie</span>
                </>
              }
            />
            <div className="space-y-4 text-sm lg:text-base text-[var(--theme-text-secondary)] text-center lg:text-left -mt-2">
              <p>
                Hey Charlie Charters was born from a lifelong love of the ocean and a passion for
                sharing Cape Town&apos;s incredible coastline with visitors from around the world.
              </p>
              <p>
                With over 15 years of maritime experience and an intimate knowledge of every cove,
                reef, and fishing spot along the peninsula, Captain Charlie and the crew deliver
                experiences that go beyond the ordinary.
              </p>
              <p>
                Whether you&apos;re celebrating a special occasion, seeking adventure, or simply want
                to witness a Cape Town sunset from the water — we&apos;ll make it unforgettable.
              </p>
            </div>
            <div className="mt-6 lg:mt-8 flex flex-wrap justify-center lg:justify-start gap-2">
              {certifications.map((cert) => (
                <span
                  key={cert.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-3 py-1.5 text-xs text-[var(--theme-text-muted)] light-card"
                >
                  <span className="inline-flex text-cyan-500 [&_svg]:h-4 [&_svg]:w-4">
                    <StepIcon icon="shield" />
                  </span>
                  {cert.label}
                </span>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="relative order-1 lg:order-2" delay={100}>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:max-w-none">
              {collageImages.map((img, i) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-2xl border border-[var(--theme-border)] ${
                    i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-3 right-2 sm:-bottom-4 sm:right-4 glass-panel rounded-2xl px-4 py-3 shadow-xl">
              <BrandLogo variant="compact" />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
