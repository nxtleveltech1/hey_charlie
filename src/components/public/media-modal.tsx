"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  /** Visible dialog title (rendered as a heading). */
  title?: string;
  /**
   * Accessible name when no visible title is supplied. Ignored if `title` is set.
   * Falls back to "Dialog" when both are omitted.
   */
  label?: string;
  children?: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, iframe, video, [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      !el.hasAttribute("hidden") &&
      el.getClientRects().length > 0,
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function MediaModal({
  open,
  onClose,
  title,
  label,
  children,
  className,
}: MediaModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = getFocusable(panelRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock body scroll while the dialog is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    // Move focus into the dialog (first focusable, else the panel itself).
    const focusTimer = window.setTimeout(() => {
      const focusables = getFocusable(panelRef.current);
      (focusables[0] ?? panelRef.current)?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const accessibleName = title ? undefined : label ?? "Dialog";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? headingId : undefined}
      aria-label={accessibleName}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6",
        "bg-navy-deep/80 backdrop-blur-sm",
        "motion-safe:animate-[fadeIn_120ms_ease-out]",
      )}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-4xl outline-none",
          "rounded-2xl border border-cream/10 bg-navy shadow-2xl",
          "motion-safe:animate-[scaleIn_140ms_ease-out]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 px-5 py-4 sm:px-6">
          {title ? (
            <h2 id={headingId} className="text-h3 font-display text-cream">
              {title}
            </h2>
          ) : label ? (
            <span className="sr-only">{label}</span>
          ) : (
            <span aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "-m-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              "text-cream-muted transition-colors hover:bg-cream/10 hover:text-cream",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
            )}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Media-agnostic content slot. */}
        <div className="p-3 sm:p-4">{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}
