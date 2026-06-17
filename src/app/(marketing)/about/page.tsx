import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Hey Charlie Charters",
  description:
    "The story behind Hey Charlie Charters — a Cape Town crew built on a lifelong love of the Atlantic. Meet the people, the boat and the philosophy behind every charter from the V&A Waterfront.",
  openGraph: {
    title: "About Us | Hey Charlie Charters",
    description:
      "More than a boat ride. Discover who we are, how we run our charters, and why the Cape coast feels different from our deck.",
    images: ["/Gallery/HC%201%20(31).jpeg"],
  },
};

const STATS = [
  { value: "15+", label: "Years on the Cape coast" },
  { value: "6", label: "Signature experiences" },
  { value: "360°", label: "Of Peninsula coastline" },
  { value: "1", label: "Crew that treats you like family" },
];

const WHAT_WE_DO = [
  {
    emoji: "🌅",
    title: "Sundowner Cruises",
    accent: "sunset",
    body: "Glide along the Atlantic Seaboard as Table Mountain turns gold and the sun drops into the sea. Drink in hand, salt on the air, the city glittering behind you.",
  },
  {
    emoji: "🐋",
    title: "Whale & Wildlife Watching",
    accent: "ocean",
    body: "In season we follow the giants — Southern Right and Humpback whales, playful dolphins, Cape fur seals and seabirds wheeling over the swell. Nature on nature's terms.",
  },
  {
    emoji: "🎣",
    title: "Deep-Sea Fishing",
    accent: "sunset",
    body: "We know the reefs, the drop-offs and the fishing grounds off the Peninsula. Tuna, yellowtail, snoek and game fish — bait, tackle and know-how all aboard.",
  },
  {
    emoji: "🦞",
    title: "Crayfish Diving",
    accent: "ocean",
    body: "A true Cape experience. We run you out to the kelp forests and clear coves where West Coast rock lobster hide, and bring you back with a story and a catch.",
  },
  {
    emoji: "🥂",
    title: "Private Charters",
    accent: "sunset",
    body: "Birthdays, proposals, corporate days or a family on holiday — the boat is yours. Tell us the day you're dreaming of and we'll build the route around it.",
  },
  {
    emoji: "⚓",
    title: "Cape Point & Coastal Runs",
    accent: "ocean",
    body: "From Clifton's bays to the dramatic cliffs of Cape Point, we cover the whole Peninsula — drop-offs, scenic cruises and the routes you can't see from land.",
  },
];

const HOW_WE_DO_IT = [
  {
    emoji: "🧭",
    title: "Local knowledge, earned the slow way",
    body: "We didn't read about this coast — we grew up on it. Every cove, reef, current and shift in the weather is mapped in muscle memory. That's the difference between a boat ride and a day you remember.",
  },
  {
    emoji: "🛟",
    title: "Safety is the quiet priority",
    body: "A thorough briefing before we cast off, well-maintained kit, life jackets for everyone and a skipper who reads the sea before it speaks. We watch the conditions so you can relax completely.",
  },
  {
    emoji: "👥",
    title: "Small crew, personal welcome",
    body: "You're never a number on a ticket. We keep groups intimate, learn your names, and run the day at your pace — whether that's chasing fish or simply chasing the light.",
  },
  {
    emoji: "🌊",
    title: "Respect for the ocean that gives us everything",
    body: "We fish responsibly, dive within the rules, keep our distance from wildlife and leave the water exactly as we found it. The Cape coast looks after us — we look after it right back.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden">
        <Image
          src="/Gallery/WhatsApp%20Image%202026-06-10%20at%2016.50.02.jpeg"
          alt="Hey Charlie Charters out on the Atlantic off Cape Town"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
        />

        <div className="wide-shell relative pb-16 pt-40 lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 lg:text-sm">
              Our story · Cape Town, South Africa
            </p>
            <h1
              className="mb-6 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More than a boat ride.
              <br />
              <span className="text-gradient-sunset">A love letter to the sea.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/80 lg:text-xl">
              Hey Charlie Charters was born from a simple belief — that the best view of Cape Town
              is the one from the water, and that everyone deserves a day on the Atlantic they&apos;ll
              be telling stories about for years.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
        <div className="wide-shell">
          <dl className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4 lg:py-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className="text-3xl font-bold text-gradient-sunset lg:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </dd>
                <p className="mt-2 text-xs text-[var(--theme-text-muted)] lg:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Origin story — long form */}
      <section className="section-pad">
        <div className="wide-shell">
          {/* Lead */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 lg:text-sm">
              Where it began
            </p>
            <h2
              className="mb-6 text-3xl font-bold lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Born on the <span className="text-gradient-ocean">Atlantic</span>
            </h2>
            <p className="text-lg leading-relaxed text-[var(--theme-text-secondary)] lg:text-2xl lg:leading-relaxed">
              &ldquo;Hey Charlie&rdquo; is the name of the boat — and a nod to the easy, open-armed
              spirit we wanted every charter to carry. What you&apos;re really booking, though, isn&apos;t a
              boat. It&apos;s a feeling: the moment Cape Town drops behind you, the engines settle, and
              the Atlantic opens up in every direction.
            </p>
          </div>

          {/* Feature image */}
          <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-3xl border border-[var(--theme-border)] shadow-sm sm:aspect-[21/9] lg:mt-16">
            <Image
              src="/Gallery/HC%201%20(2).jpeg"
              alt="The Hey Charlie crew out on the Atlantic off Cape Town"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* The story */}
          <div className="mx-auto mt-12 max-w-3xl space-y-6 text-base leading-relaxed text-[var(--theme-text-secondary)] lg:mt-16 lg:text-lg lg:leading-relaxed">
            <h3
              className="!mt-0 text-2xl font-bold text-[var(--theme-text)] lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-sunset">The long way round</span>
            </h3>
            <p>
              Behind the wheel is skipper{" "}
              <span className="font-semibold text-[var(--theme-text)]">Gareth Bew</span>, who has
              spent over fifteen years reading this coast in every mood it has — flat calm dawns, a
              south-easter that turns Table Bay to corduroy, the long Atlantic swell that rolls in
              past Robben Island. None of that came from a textbook. It came from showing up, season
              after season, until the water stopped being a place he visited and became a place he
              understood.
            </p>
            <p>
              What started as a personal obsession — being out at every chance, learning the reefs,
              the fishing grounds and the rhythms of the Peninsula — slowly turned into something
              bigger. Friends wanted to come along. Then friends of friends. Then visitors who&apos;d
              only ever seen Cape Town from a cable car or a café table, and walked off the boat
              changed by it. The same thing happened every single time: people arrived as
              passengers and left as part of the story.
            </p>
            <p>
              That&apos;s when it stopped being a hobby. We realised that too many people see this
              city from the land and never meet its second, wilder face — the one you can only reach
              from the swell. So we built Hey Charlie Charters around a single, stubborn promise: a
              genuinely local day on the water, run by people who love it, for people who&apos;ll
              remember it. No scripts. No conveyor belt. Just the Atlantic, a good crew, and time
              well spent.
            </p>

            {/* Pull quote */}
            <blockquote className="my-10 border-l-4 border-orange-500 pl-6 lg:my-12">
              <p
                className="text-2xl font-semibold leading-snug text-[var(--theme-text)] lg:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                &ldquo;We don&apos;t want to give you a tour. We want to give you a day you&apos;ll
                still be telling people about in ten years.&rdquo;
              </p>
              <footer className="mt-3 text-sm text-[var(--theme-text-muted)]">
                — Gareth Bew, owner &amp; skipper
              </footer>
            </blockquote>

            <h3
              className="text-2xl font-bold text-[var(--theme-text)] lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-ocean">Where we are today</span>
            </h3>
            <p>
              Today, Hey Charlie Charters runs the full sweep of the Cape Peninsula from our home at
              the {siteConfig.departurePoint}. Sundowner cruises along the Atlantic Seaboard.
              Whale and wildlife watching in season. Deep-sea fishing over grounds we know by heart.
              Crayfish diving in the kelp. Private charters built around birthdays, proposals and
              the kind of family days that end up framed on a wall. One boat, one tight crew, and a
              coastline most people only ever dream about.
            </p>
            <p>
              We&apos;ve deliberately stayed small. It would be easy to pack more people on, run more
              trips, shave more corners — and lose the exact thing that makes a day with us feel
              different. Instead we&apos;ve doubled down: better briefings, better gear, better local
              knowledge, and the kind of welcome that makes a first-time guest feel like a regular
              before the lines are even off.
            </p>

            <h3
              className="text-2xl font-bold text-[var(--theme-text)] lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-gradient-sunset">Where we&apos;re going</span>
            </h3>
            <p>
              We&apos;re not interested in becoming the biggest charter operation on the Cape — we
              want to be the one people remember. The road ahead is about depth, not just numbers:
              new routes and experiences along the Peninsula, a steadily growing crew of skippers
              and guides who share our standards, and an even sharper focus on running the cleanest,
              safest, most responsible operation on the water.
            </p>
            <p>
              The ocean has given us everything — a livelihood, a life, a front-row seat to the most
              beautiful coastline in the world. As we grow, our commitment is to give back to it:
              fishing within the rules, diving sustainably, keeping a respectful distance from
              wildlife, and protecting this coast so the next generation gets to fall for it the
              same way we did.
            </p>
          </div>
        </div>
      </section>

      {/* Customer focus + quality standards */}
      <section className="section-pad-sm">
        <div className="wide-shell">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Our promise to you */}
            <div className="rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 light-card lg:p-10">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/15 to-pink-500/15 text-3xl">
                💛
              </div>
              <h3
                className="mb-4 text-2xl font-bold lg:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our promise to <span className="text-gradient-sunset">you</span>
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[var(--theme-text-muted)] lg:text-base">
                From the first message to the last wave goodbye, you are the whole point. Everything
                we do is built around making your time on the water effortless, personal and worth
                every minute.
              </p>
              <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)] lg:text-base">
                {[
                  "A real person who answers your questions and helps you choose the right trip — not a booking robot.",
                  "Honest advice on timing, weather and what you'll actually see, even when that means telling you to wait for a better day.",
                  "Your pace, your day — whether that's chasing fish hard or simply drifting with a drink in hand.",
                  "Small groups and a warm welcome, so you're a guest with a name, never a number on a ticket.",
                  "A fair, transparent weather policy — your safety and your experience always come before a departure slot.",
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 shrink-0 text-orange-500">●</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our quality standards */}
            <div className="rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 light-card lg:p-10">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-3xl">
                ⚓
              </div>
              <h3
                className="mb-4 text-2xl font-bold lg:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The standards we <span className="text-gradient-ocean">hold</span>
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[var(--theme-text-muted)] lg:text-base">
                A great day out is built on the things you never have to think about. We sweat the
                details so the only thing on your mind is the view.
              </p>
              <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)] lg:text-base">
                {[
                  "A qualified, experienced skipper on every charter — and a full safety briefing before we cast off.",
                  "Well-maintained vessel and equipment, checked and prepped before every single trip.",
                  "Life jackets for everyone aboard and safety kit that meets the conditions of the day.",
                  "Constant reading of sea, swell and weather — we'd rather reschedule than push our luck.",
                  "Responsible, by-the-book operation: licensed, compliant, and respectful of the ocean and its wildlife.",
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 shrink-0 text-cyan-500">●</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section-pad bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="wide-shell">
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 lg:text-sm">
              What we do
            </p>
            <h2
              className="mb-4 text-3xl font-bold lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Six ways to fall for the <span className="text-gradient-sunset">Cape coast</span>
            </h2>
            <p className="text-base text-[var(--theme-text-muted)] lg:text-lg">
              Every charter departs from the V&amp;A Waterfront and heads out along the Atlantic
              Seaboard and around the Peninsula. Pick your adventure — or let us design one.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {WHAT_WE_DO.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 card-hover light-card lg:p-8"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-orange-500/15 text-3xl">
                  {item.emoji}
                </div>
                <h3 className="mb-2 text-xl font-bold lg:text-2xl">
                  <span
                    className={
                      item.accent === "ocean"
                        ? "text-gradient-ocean"
                        : "text-gradient-sunset"
                    }
                  >
                    {item.title}
                  </span>
                </h3>
                <p className="text-sm leading-relaxed text-[var(--theme-text-muted)] lg:text-base">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we do it */}
      <section className="section-pad">
        <div className="wide-shell">
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 lg:text-sm">
              How we do it
            </p>
            <h2
              className="mb-4 text-3xl font-bold lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The things that make a day <span className="text-gradient-ocean">unforgettable</span>
            </h2>
            <p className="text-base text-[var(--theme-text-muted)] lg:text-lg">
              Anyone can run a boat from A to B. The magic is in everything around it — and these are
              the things we never cut corners on.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {HOW_WE_DO_IT.map((item, i) => (
              <div
                key={item.title}
                className="relative flex gap-5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 light-card lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-5xl font-bold text-[var(--theme-border)] lg:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  0{i + 1}
                </span>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/15 to-pink-500/15 text-3xl">
                  {item.emoji}
                </div>
                <div className="relative">
                  <h3 className="mb-2 text-lg font-bold lg:text-xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--theme-text-muted)] lg:text-base">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Captain / people */}
      <section className="section-pad bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="wide-shell">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 lg:text-sm">
                The people behind the boat
              </p>
              <h2
                className="mb-6 text-3xl font-bold lg:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A crew you&apos;ll be glad you{" "}
                <span className="text-gradient-sunset">met</span>
              </h2>
              <div className="max-w-prose space-y-4 text-base leading-relaxed text-[var(--theme-text-secondary)] lg:text-lg">
                <p>
                  Charters live or die on the people running them. Ours are Capetonians to the core —
                  skippers, deckhands and dive crew who&apos;d be out on this water on their day off
                  anyway. They&apos;re calm in a swell, quick with a story, and quietly obsessed with
                  giving you the best version of the day.
                </p>
                <p>
                  From the warm welcome on the dock to the last wave goodbye, you&apos;re in the hands
                  of people who genuinely want you to fall for this coast the way they did.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/crew"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Meet the full crew
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-surface)]"
                >
                  See the gallery
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl border border-[var(--theme-border)] shadow-sm lg:max-w-none">
                <Image
                  src="/images/gareth.png"
                  alt="Skipper Gareth Bew of Hey Charlie Charters"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 85vw, 45vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Gareth Bew
                  </p>
                  <p className="text-sm text-white/70">Owner &amp; Skipper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials / trust */}
      <section className="section-pad-sm">
        <div className="wide-shell">
          <div className="rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 text-center light-card lg:p-12">
            <h2
              className="mb-3 text-2xl font-bold lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Run right, by the book
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm text-[var(--theme-text-muted)] lg:text-base">
              We operate from the {siteConfig.departurePoint} with safety and compliance at the
              heart of everything we do — so the only thing you need to think about is the view.
            </p>
            <ul className="flex flex-wrap justify-center gap-3">
              {siteConfig.credentials.map((cert) => (
                <li key={cert.label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2 text-sm text-[var(--theme-text-secondary)]">
                    <span className="text-cyan-500">✓</span>
                    {cert.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="wide-shell">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/Gallery/HC%201%20(17).jpeg"
              alt="A Hey Charlie Charters sunset on the Atlantic"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
            <div className="relative px-8 py-16 text-center lg:px-16 lg:py-24">
              <h2
                className="mb-4 text-3xl font-bold text-white lg:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Come see Cape Town from{" "}
                <span className="text-gradient-sunset">our side of the rail</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-base text-white/80 lg:text-lg">
                Whatever the occasion, we&apos;ll turn a few hours on the Atlantic into the highlight
                of your trip. Let&apos;s get you on the water.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/packages"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25"
                >
                  View charters
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] py-10 transition-colors duration-300 lg:py-12">
        <div className="wide-shell">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-[var(--theme-text-muted)] sm:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/logo2.png" alt="Hey Charlie Charters" width={32} height={32} className="rounded-lg" />
              <span>© 2026 Hey Charlie Charters</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="transition-colors hover:text-[var(--theme-text)]">
                Home
              </Link>
              <Link href="/crew" className="transition-colors hover:text-[var(--theme-text)]">
                Crew
              </Link>
              <Link href="/packages" className="transition-colors hover:text-[var(--theme-text)]">
                Charters
              </Link>
              <Link href="/#contact" className="transition-colors hover:text-[var(--theme-text)]">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
