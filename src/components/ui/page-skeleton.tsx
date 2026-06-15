import { cn } from "@/lib/utils";

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("wide-shell animate-pulse space-y-6 py-24", className)}>
      <div className="h-10 w-48 rounded-xl bg-[var(--theme-surface)]" />
      <div className="h-4 w-72 rounded-lg bg-[var(--theme-surface)]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
          />
        ))}
      </div>
    </div>
  );
}

export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
        />
      ))}
    </div>
  );
}
