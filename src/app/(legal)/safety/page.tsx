import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";

const section = getLegalSection("safety");

const PAGE_TITLE = "Safety On Board";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "Safety equipment, briefings and what we ask of guests on Hey Charlie Charters trips. Draft — under review.",
  alternates: { canonical: "/safety" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "Safety equipment, briefings and what we ask of guests on Hey Charlie Charters trips. Draft — under review.",
  },
};

export default function SafetyPage() {
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
            Ready to head out?
          </h2>
          <p className="text-body text-theme-secondary">
            Check live conditions, then choose the charter that fits your group.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="/packages" variant="primary">
            View charter packages
          </Button>
          <Button href="/weather" variant="secondary">
            Live weather
          </Button>
        </div>
      </div>
    </article>
  );
}
