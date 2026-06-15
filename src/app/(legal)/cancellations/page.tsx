import type { Metadata } from "next";
import { getLegalSection } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";

const section = getLegalSection("cancellations");

const PAGE_TITLE = "Cancellations & Refunds";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "Cancellation windows, refunds and weather rebooking for Hey Charlie Charters bookings. Draft — under review.",
  alternates: { canonical: "/cancellations" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description:
      "Cancellation windows, refunds and weather rebooking for Hey Charlie Charters bookings. Draft — under review.",
  },
};

export default function CancellationsPage() {
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
            Planning a booking?
          </h2>
          <p className="text-body text-theme-secondary">
            Deposit amounts and payment methods are confirmed with you when you
            book a charter.
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
