import Link from "next/link";

interface MobileStickyActionsProps {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function MobileStickyActions({
  primaryHref = "/packages",
  primaryLabel = "Book Now",
  secondaryHref = "/#contact",
  secondaryLabel = "Contact",
}: MobileStickyActionsProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--theme-border)] bg-[var(--theme-bg)]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-3">
        <Link
          href={primaryHref}
          className="min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-opacity hover:opacity-90"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="min-h-12 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-5 py-3 text-center text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-surface)]"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
