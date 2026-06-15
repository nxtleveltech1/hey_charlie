import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export interface DataColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface ResponsiveDataListProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  renderMobileCard: (row: T) => ReactNode;
  emptyMessage?: string;
  emptyTitle?: string;
  className?: string;
}

export function ResponsiveDataList<T>({
  columns,
  data,
  rowKey,
  renderMobileCard,
  emptyMessage = "No records found",
  emptyTitle = "Nothing here yet",
  className,
}: ResponsiveDataListProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]",
        className,
      )}
    >
      {/* Mobile: cards */}
      <div className="divide-y divide-[var(--theme-border)] lg:hidden">
        {data.map((row) => (
          <div key={rowKey(row)} className="p-4">
            {renderMobileCard(row)}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead className="bg-[var(--theme-surface)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--theme-text-muted)]",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--theme-border)]">
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors hover:bg-[var(--theme-surface)]"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-6 py-4", col.className)}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
