import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "⛵",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 text-center",
        className,
      )}
    >
      <div className="mb-4 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mb-4 text-[var(--theme-text-muted)]">{description}</p>
      )}
      {action}
    </div>
  );
}
