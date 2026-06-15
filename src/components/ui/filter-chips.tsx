import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FilterChip {
  value: string;
  label: string;
  href: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  activeValue: string;
  className?: string;
}

export function FilterChips({ chips, activeValue, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isActive = chip.value === activeValue;
        return (
          <Link
            key={chip.value || "all"}
            href={chip.href}
            className={cn(
              "min-h-11 rounded-xl px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-amber text-ink font-medium"
                : "bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]",
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
