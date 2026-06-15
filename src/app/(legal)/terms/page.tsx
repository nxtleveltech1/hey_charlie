import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";

const section = getLegalSection("terms");

const PAGE_TITLE = "Terms of Service";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "The terms that govern bookings with Hey Charlie Charters from the V&A Waterfront, Cape Town. Draft — under review.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "The terms that govern bookings with Hey Charlie Charters from the V&A Waterfront, Cape Town. Draft — under review.",
  },
};

export default function TermsPage() {
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
    </article>
  );
}
