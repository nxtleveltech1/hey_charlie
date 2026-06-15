import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";

const section = getLegalSection("privacy");

const PAGE_TITLE = "Privacy Policy";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "How Hey Charlie Charters collects, uses and protects your personal information under POPIA and GDPR. Draft — under review.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "How Hey Charlie Charters collects, uses and protects your personal information under POPIA and GDPR. Draft — under review.",
  },
};

export default function PrivacyPage() {
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
          <ul className="mt-2 flex flex-col gap-2.5">
            {section.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-body text-theme-secondary">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
