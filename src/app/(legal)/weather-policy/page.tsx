import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";

const section = getLegalSection("weather-policy");

const PAGE_TITLE = "Weather & Sea Conditions Policy";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "How Hey Charlie Charters decides whether a charter can safely proceed, and your options if conditions change. Draft — under review.",
  alternates: { canonical: "/weather-policy" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "How Hey Charlie Charters decides whether a charter can safely proceed, and your options if conditions change. Draft — under review.",
  },
};

export default function WeatherPolicyPage() {
  if (!section) return null;
  const statusLabel =
    section.status === "approved"
      ? "Approved"
      : section.status === "in-review"
        ? "In legal review"
        : "Draft — under legal review";

  return (
    <article className="narrow-shell section-pad">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-eyebrow text-amber">Legal</p>
        <h1 className="font-display text-h1 text-cream">{PAGE_TITLE}</h1>
        <p className="text-small text-cream-dim">Status: {statusLabel}</p>
      </header>

      <div className="flex flex-col gap-4">
        {section.body.map((para, i) => (
          <p
            key={i}
            className={
              para.startsWith("REQUIRED:")
                ? "rounded-lg border-l-2 border-amber/60 bg-amber/5 px-4 py-2.5 text-small text-cream"
                : "text-body-lg text-theme-secondary"
            }
          >
            {para}
          </p>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--theme-border)] bg-theme-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-h3 text-cream">
            Checking the forecast?
          </h2>
          <p className="text-body text-theme-secondary">
            See live conditions for Cape Town waters, or pick the charter that
            suits your group.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="/weather" variant="primary">
            Live weather
          </Button>
          <Button href="/packages" variant="secondary">
            View packages
          </Button>
        </div>
      </div>
    </article>
  );
}
