import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { MinimalShell } from "@/components/public/minimal-shell";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for could not be found. Explore private boat charters from the V&A Waterfront, Cape Town.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MinimalShell title="404">
      <section className="content-shell section-pad flex flex-col items-start gap-5">
        <h1 className="font-display text-h1 text-cream">
          This page has set sail
        </h1>
        <p className="max-w-2xl text-body-lg text-cream-dim">
          The page you were looking for has drifted off course or never existed.
          Let&apos;s get you back to clear waters.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="/packages" variant="primary" size="lg">
            View charter packages
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Back to home
          </Button>
        </div>
      </section>
    </MinimalShell>
  );
}
