import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";

const section = getLegalSection("permits-and-regulations");

const PAGE_TITLE = "Permits & Regulations";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "The SAMSA and DAFF regulations Hey Charlie Charters operates under. Permit numbers pending verification. Draft — under review.",
  alternates: { canonical: "/permits-and-regulations" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "The SAMSA and DAFF regulations Hey Charlie Charters operates under. Permit numbers pending verification. Draft — under review.",
  },
};

export default function PermitsAndRegulationsPage() {
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

        {section.bullets ? (
          <>
            <p className="mt-2 text-body-lg text-theme-secondary">
              The following reference details are still to be supplied and
              verified before publication:
            </p>
            <ul className="flex flex-col gap-2.5">
              {section.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 rounded-lg border-l-2 border-amber/60 bg-amber/5 px-4 py-2 text-small text-cream"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--theme-border)] bg-theme-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-h3 text-cream">
            Questions about compliance?
          </h2>
          <p className="text-body text-theme-secondary">
            Verified vessel and skipper licence numbers will be published here
            once they are confirmed.
          </p>
        </div>
        <div className="shrink-0">
          <Button href="/packages" variant="primary">
            View charter packages
          </Button>
        </div>
      </div>
    </article>
  );
}
