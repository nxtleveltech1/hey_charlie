"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Addon } from "@/db/schema";
import { formatAddonPriceLabel } from "@/lib/addon-pricing";

export default function AdminPackageAddonsPage() {
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      const res = await fetch("/api/package-addons?includeInactive=true");
      if (!res.ok) throw new Error("Failed to fetch addons");
      const data = await res.json();
      setAllAddons(data.addons);
    } catch (err) {
      setError("Failed to load add-ons");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeAddon = async (addon: Addon) => {
    if (
      !confirm(
        `Remove "${addon.name}"? Add-ons with bookings will be deactivated instead of deleted.`,
      )
    ) {
      return;
    }

    try {
      const deleteRes = await fetch(`/api/package-addons/${addon.id}`, {
        method: "DELETE",
      });

      if (deleteRes.ok) {
        setAllAddons(allAddons.filter((a) => a.id !== addon.id));
        return;
      }

      const deactivateRes = await fetch(`/api/package-addons/${addon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (!deactivateRes.ok) {
        throw new Error("Failed to remove add-on");
      }

      setAllAddons(
        allAddons.map((a) =>
          a.id === addon.id ? { ...a, isActive: false } : a,
        ),
      );
      alert(
        `"${addon.name}" has existing bookings and was deactivated instead of deleted.`,
      );
    } catch (err) {
      setError("Failed to remove add-on");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Package Add-ons
          </h1>
          <p className="text-[var(--theme-text-muted)]">
            Manage optional services customers can add to bookings
          </p>
        </div>
        <Link
          href="/admin/package-addons/new"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          + Add Add-on
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAddons.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-lg font-semibold mb-2">No add-ons yet</h3>
            <p className="text-[var(--theme-text-muted)] mb-4">
              Create optional services like shuttle, catering, or jetski hire.
            </p>
            <Link
              href="/admin/package-addons/new"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create Add-on
            </Link>
          </div>
        ) : (
          allAddons.map((addon) => (
            <div
              key={addon.id}
              className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{addon.name}</h3>
                  <p className="text-sm text-[var(--theme-text-muted)] line-clamp-2">
                    {addon.description}
                  </p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ml-2 ${addon.isActive ? "bg-green-500" : "bg-red-500"}`}
                  title={addon.isActive ? "Active" : "Inactive"}
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Price</span>
                  <span className="font-medium">
                    {formatAddonPriceLabel(addon)}
                  </span>
                </div>
                {addon.selectionGroup && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--theme-text-muted)]">Group</span>
                    <span className="capitalize">{addon.selectionGroup}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-text-muted)]">Order</span>
                  <span>{addon.displayOrder}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/package-addons/${addon.id}`}
                  className="flex-1 py-2 text-center rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => removeAddon(addon)}
                  className="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
