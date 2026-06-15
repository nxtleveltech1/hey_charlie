import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MinimalShell } from "@/components/public/minimal-shell";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  openGraph: { type: "article" },
};

const DRAFT_BANNER_TEXT =
  "This is general information provided for transparency, not legal advice. It is under review and may change.";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <MinimalShell>
      <div className="border-y border-amber/25 bg-amber/10">
        <div className="content-shell section-pad-tight">
          <p className="max-w-3xl text-small text-cream sm:text-body">
            <span className="font-semibold text-amber">Under review.</span>{" "}
            {DRAFT_BANNER_TEXT}
          </p>
        </div>
      </div>
      {children}
    </MinimalShell>
  );
}
