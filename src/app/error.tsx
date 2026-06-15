"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MinimalShell } from "@/components/public/minimal-shell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MinimalShell title="Error">
      <section className="content-shell section-pad flex flex-col items-start gap-5">
        <div role="alert" className="flex flex-col items-start gap-5">
          <h1 className="font-display text-h1 text-cream">
            We hit a rough patch
          </h1>
          <p className="max-w-2xl text-body-lg text-cream-dim">
            Something went wrong while loading this page. You can try again, or
            head back to safer waters.
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Back to home
          </Button>
        </div>
      </section>
    </MinimalShell>
  );
}
