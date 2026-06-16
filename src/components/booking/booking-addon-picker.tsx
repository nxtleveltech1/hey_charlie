"use client";

import { useEffect, useMemo, useState } from "react";
import type { Addon } from "@/db/schema";
import {
  calculateBookingTotal,
  formatAddonPriceLabel,
  type SelectedAddonsMap,
} from "@/lib/addon-pricing";
import { formatPrice } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

interface BookingAddonPickerProps {
  guestCount: number;
  selectedAddons: SelectedAddonsMap;
  onSelectionChange: (selected: SelectedAddonsMap) => void;
}

export function BookingAddonPicker({
  guestCount,
  selectedAddons,
  onSelectionChange,
}: BookingAddonPickerProps) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await fetch("/api/package-addons");
        if (!res.ok) throw new Error("Failed to load add-ons");
        const data = await res.json();
        setAddons(data.addons);
      } catch {
        setError("Could not load add-ons. You can continue without them.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddons();
  }, []);

  const groupedAddons = useMemo(() => {
    const ungrouped: Addon[] = [];
    const groups = new Map<string, Addon[]>();

    for (const addon of addons) {
      if (addon.selectionGroup) {
        const list = groups.get(addon.selectionGroup) || [];
        list.push(addon);
        groups.set(addon.selectionGroup, list);
      } else {
        ungrouped.push(addon);
      }
    }

    return { ungrouped, groups };
  }, [addons]);

  const toggleAddon = (addon: Addon) => {
    const isSelected = addon.id in selectedAddons;

    if (addon.selectionGroup) {
      if (isSelected) {
        const next = { ...selectedAddons };
        delete next[addon.id];
        onSelectionChange(next);
      } else {
        const next = Object.fromEntries(
          Object.entries(selectedAddons).filter(([id]) => {
            const existing = addons.find((a) => a.id === id);
            return existing?.selectionGroup !== addon.selectionGroup;
          }),
        );
        next[addon.id] = 1;
        onSelectionChange(next);
      }
      return;
    }

    if (isSelected) {
      const next = { ...selectedAddons };
      delete next[addon.id];
      onSelectionChange(next);
    } else {
      onSelectionChange({ ...selectedAddons, [addon.id]: 1 });
    }
  };

  const setQuantity = (addon: Addon, quantity: number) => {
    const clamped = Math.min(Math.max(1, quantity), addon.maxQuantity);
    onSelectionChange({ ...selectedAddons, [addon.id]: clamped });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber" />
      </div>
    );
  }

  if (addons.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--theme-text-muted)] py-8">
        No optional add-ons available for this booking.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-amber">{error}</p>}

      <p className="text-sm text-[var(--theme-text-muted)]">
        Customise your charter with optional extras. Per-person prices apply to
        all {guestCount} guests.
      </p>

      {groupedAddons.ungrouped.map((addon) => (
        <AddonCard
          key={addon.id}
          addon={addon}
          guestCount={guestCount}
          selected={addon.id in selectedAddons}
          quantity={selectedAddons[addon.id] ?? 1}
          onToggle={() => toggleAddon(addon)}
          onQuantityChange={(qty) => setQuantity(addon, qty)}
          inputType="checkbox"
        />
      ))}

      {Array.from(groupedAddons.groups.entries()).map(([group, groupAddons]) => (
        <div key={group} className="space-y-3">
          <p className="text-sm font-medium capitalize">
            {group.replace(/-/g, " ")} — choose one
            {group === "jetski" && ", then select how many"}
          </p>
          {groupAddons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              guestCount={guestCount}
              selected={addon.id in selectedAddons}
              quantity={selectedAddons[addon.id] ?? 1}
              onToggle={() => toggleAddon(addon)}
              onQuantityChange={(qty) => setQuantity(addon, qty)}
              inputType="radio"
              groupName={group}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function AddonCard({
  addon,
  guestCount,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
  inputType,
  groupName,
}: {
  addon: Addon;
  guestCount: number;
  selected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  inputType: "checkbox" | "radio";
  groupName?: string;
}) {
  const lineTotal = selected
    ? calculateBookingTotal(0, guestCount, { [addon.id]: quantity }, [addon])
        .lines[0]?.lineTotal ?? 0
    : 0;

  return (
    <div
      className={cn(
        "w-full rounded-xl border p-4 transition-all",
        selected
          ? "border-amber bg-amber/10"
          : "border-[var(--theme-border)]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <input
            type={inputType}
            checked={selected}
            readOnly
            name={groupName}
            className="mt-1 h-4 w-4 accent-amber"
            aria-hidden
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="font-medium">{addon.name}</h4>
              <span className="text-sm font-medium text-amber shrink-0">
                {formatAddonPriceLabel(addon)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              {addon.description}
            </p>
          </div>
        </div>
      </button>

      {selected && addon.allowQuantity && (
        <div
          className="mt-3 flex items-center justify-between gap-4 border-t border-amber/20 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm text-[var(--theme-text-muted)]">
            Number of jetskis
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(quantity - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center text-lg font-bold">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= addon.maxQuantity}
              onClick={() => onQuantityChange(quantity + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}

      {selected && lineTotal > 0 && (
        <p className="mt-2 text-sm font-medium text-right">
          + {formatPrice(lineTotal)}
        </p>
      )}
    </div>
  );
}
