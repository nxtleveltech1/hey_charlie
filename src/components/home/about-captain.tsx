import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { StepIcon } from "./experience-icons";
import { RevealOnScroll } from "./reveal-on-scroll";

const ABOUT_HERO = {
  src: "/Gallery/JUNE%2026/HC%201%20(31).jpeg",
  alt: "Hey Charlie Charters boat on the water with branded hull artwork",
};

const ABOUT_PILLARS = [
  {
    emoji: "🥂",
    title: "More Than a Charter",
    accent: "sunset",
    paragraphs: [
      "We never wanted Hey Charlie to become another predictable, mass-produced boat trip. The best days at sea are personal. They are shaped by the weather, the people on board and the reason for being there.",
      "For some guests, it is the excitement of heading offshore before sunrise in search of fish. For others, it is a relaxed cruise along the coastline, a family day on the water, a birthday, an anniversary or a private celebration with friends. Sometimes the entire purpose is simply to stop, open a drink, watch the sun sink into the Atlantic and experience Cape Town from somewhere completely different.",
      "Every charter has its own character, but the intention remains the same: to give our guests a genuine day on the ocean rather than rush them through a standard itinerary.",
      "We take the time to understand what you want from the experience. Where conditions and safety allow, the day is shaped around you. There is no forced performance and no unnecessary formality — just capable people, a well-prepared boat and the freedom to enjoy the water at your own pace.",
    ],
  },
  {
    emoji: "🛟",
    title: "Experience You Can Trust",
    accent: "ocean",
    paragraphs: [
      "The ocean is beautiful, but it demands respect.",
      "More than 15 years on the Cape coast has created a deep understanding of these waters: how quickly conditions can change, how wind and swell affect a route, where shelter can be found and when the safest decision is to alter a plan. That knowledge cannot be replaced by an app, a forecast or enthusiasm alone. It is built through time, judgement and real experience at sea.",
      "Safety is therefore not an afterthought or a marketing line. It influences every charter — from planning the route and monitoring conditions to preparing the vessel and looking after every person on board.",
      "Hey Charlie operates with an experienced, SAMSA-certified skipper, appropriate insurance and a strong commitment to responsible boating. We would rather adjust a trip than compromise the safety or comfort of our guests. The ocean always has the final word, and respecting that is part of delivering a professional charter.",
    ],
  },
  {
    emoji: "🌅",
    title: "Cape Town, Seen Properly",
    accent: "sunset",
    paragraphs: [
      "Cape Town is famous for its scenery, but some of its most memorable moments happen beyond the shoreline.",
      "A day aboard Hey Charlie may bring glassy water and endless views, or a fresh Cape breeze and the thrill of moving through open sea. It may bring marine wildlife, productive fishing grounds, hidden stretches of coastline or a sunset that turns the entire horizon gold.",
      "These moments cannot be manufactured or guaranteed. That is precisely what makes them special.",
      "The ocean decides what each day will become. Our job is to read the conditions, navigate responsibly and create the space for something unforgettable to happen.",
    ],
  },
];

export function AboutCaptain() {
  return (
    <section
      id="about"
      className="section-pad bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
      aria-labelledby="about-heading"
    >
      <div className="wide-shell">
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch md:gap-10 lg:gap-12">
          <RevealOnScroll layout="contents" className="order-1">
            <article className="flex flex-col justify-center">
              <SectionHeader
                id="about-heading"
                eyebrow="Meet Hey Charlie"
                align="left"
                compact
                className="max-w-none text-center md:text-left"
                title={
                  <>
                    Born on the Water.{" "}
                    <span className="text-gradient-sunset">Built for Adventure.</span>
                  </>
                }
              />

              <div className="-mt-1 max-w-prose space-y-4 text-center text-sm leading-relaxed text-[var(--theme-text-secondary)] md:text-left md:text-base">
                <p>
                  Hey Charlie Charters was born from a lifelong relationship with the ocean and more
                  than 15 years spent navigating the waters surrounding the Cape.
                </p>
                <p>
                  What began as a personal passion became something bigger: an opportunity to share
                  the freedom, beauty and raw energy of the ocean with others. Cape Town has one of
                  the most spectacular coastlines in the world, but the experience changes completely
                  when you leave the road behind, move beyond the harbour wall and see it from the
                  water.
                </p>
                <p>
                  From the deck, familiar landmarks take on an entirely different scale. Mountains
                  rise directly from the sea. Cliffs, caves and sheltered coves reveal themselves
                  along the coastline. Dolphins may suddenly appear beside the boat, seals surface
                  between the swells and, at the right time of year, whales move through these
                  waters. As the city falls away behind you, the noise disappears and the ocean
                  takes over.
                </p>
                <p className="font-semibold text-[var(--theme-text)]">
                  That feeling is the reason Hey Charlie exists.
                </p>
              </div>

              {siteConfig.credentials.length > 0 && (
                <ul className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6 md:justify-start">
                  {siteConfig.credentials.map((cert) => (
                    <li key={cert.label}>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-3 py-1.5 text-xs text-[var(--theme-text-muted)] light-card">
                        <span className="inline-flex text-cyan-500 [&_svg]:h-4 [&_svg]:w-4">
                          <StepIcon icon="shield" />
                        </span>
                        {cert.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-7 md:justify-start">
                <Link
                  href="/crew"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Meet the crew
                </Link>
                <Link
                  href="/packages"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-surface)]"
                >
                  View packages
                </Link>
              </div>
            </article>
          </RevealOnScroll>

          <RevealOnScroll layout="contents" className="order-2" delay={100}>
            <figure className="relative m-0 mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--theme-border)] shadow-sm md:mx-0 md:aspect-auto md:h-full md:max-w-none md:min-h-[16rem]">
              <Image
                src={ABOUT_HERO.src}
                alt={ABOUT_HERO.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 85vw, 45vw"
                loading="lazy"
              />
            </figure>
          </RevealOnScroll>
        </div>

        <div className="mt-10 grid items-start gap-5 md:mt-14 lg:grid-cols-3 lg:gap-6">
          {ABOUT_PILLARS.map((pillar, i) => (
            <RevealOnScroll key={pillar.title} delay={i * 100}>
              <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 light-card lg:p-8">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${
                    pillar.accent === "ocean"
                      ? "from-cyan-500/15 to-blue-500/15"
                      : "from-orange-500/15 to-pink-500/15"
                  }`}
                >
                  {pillar.emoji}
                </div>
                <h3
                  className="mb-3 text-xl font-bold lg:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span
                    className={
                      pillar.accent === "ocean" ? "text-gradient-ocean" : "text-gradient-sunset"
                    }
                  >
                    {pillar.title}
                  </span>
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-[var(--theme-text-secondary)]">
                  {pillar.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mx-auto mt-10 max-w-2xl text-center md:mt-14">
            <h3
              className="mb-4 text-2xl font-bold lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Come <span className="text-gradient-ocean">Aboard</span>
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--theme-text-secondary)] md:text-base">
              <p>Hey Charlie is for people who want more than another item checked off an itinerary.</p>
              <p>
                It is for families wanting uninterrupted time together. Friends looking for a proper
                day out. Visitors wanting to experience the real Cape coastline. Anglers chasing the
                next great story. Couples marking an important moment. And anyone who understands
                that sometimes the best way to reconnect is to leave the land behind.
              </p>
              <p>
                You do not need boating experience, specialist knowledge or a particular reason to
                come aboard. Bring your people, your sense of adventure and your willingness to
                experience the Cape from a different perspective.
              </p>
              <p>We will take care of the rest.</p>
              <p>
                This is more than a charter. It is the freedom of open water, the power of the Cape
                coastline and the kind of day you will still be talking about years from now.
              </p>
            </div>
            <p
              className="mt-6 text-xl font-bold text-gradient-sunset lg:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              This is Hey Charlie.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
