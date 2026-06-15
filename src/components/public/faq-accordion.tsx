"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FaqEntry {
  q: string;
  a: string | ReactNode;
}

interface FaqAccordionProps {
  items: FaqEntry[];
  title?: string;
  /** Heading level for the section title (questions are always h3). */
  as?: "h2" | "h3";
  className?: string;
}

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * A single accessible FAQ item. Exported so callers can compose custom layouts.
 */
export function SingleFaq({
  question,
  answer,
  defaultOpen = false,
  idBase,
  index,
  open,
  onToggle,
}: {
  question: string;
  answer: ReactNode;
  defaultOpen?: boolean;
  idBase: string;
  index: number;
  open?: boolean;
  onToggle?: () => void;
}) {
  const reactId = useId();
  const base = idBase ?? reactId;
  const buttonId = `${base}-btn-${index}`;
  const regionId = `${base}-region-${index}`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((v) => !v);
    }
  };

  return (
    <div className="border-b border-cream/10 last:border-b-0">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={regionId}
          onClick={handleToggle}
          className={cn(
            "flex w-full items-center justify-between gap-4 py-5 text-left",
            "text-body-lg font-semibold text-cream transition-colors hover:text-amber",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
          )}
        >
          <span>{question}</span>
          <ChevronIcon
            className={cn(
              "h-5 w-5 shrink-0 text-amber",
              "transition-transform duration-200 motion-reduce:transition-none",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </h3>
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-body text-cream-muted leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({
  items,
  title,
  as = "h2",
  className,
}: FaqAccordionProps) {
  const TitleTag = as;
  const baseId = useId();

  return (
    <section className={cn("max-w-3xl", className)}>
      {title && (
        <TitleTag className="mb-4 text-h2 font-display text-cream">
          {title}
        </TitleTag>
      )}
      <div className="rounded-2xl border border-cream/10 bg-navy-600 px-5 sm:px-7">
        {items.map((item, index) => (
          <SingleFaq
            key={`${baseId}-${index}`}
            question={item.q}
            answer={item.a}
            idBase={baseId}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
