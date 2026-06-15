import { CardListSkeleton } from "@/components/ui/page-skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]"
          />
        ))}
      </div>
      <CardListSkeleton count={5} />
    </div>
  );
}
