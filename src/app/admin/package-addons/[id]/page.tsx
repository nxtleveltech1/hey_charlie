"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Addon } from "@/db/schema";
import {
  AddonFormFields,
  emptyAddonFormData,
  addonFormToPayload,
  type AddonFormData,
} from "@/components/admin/package-addon-form";
import { readApiError } from "@/lib/api-client";

export default function EditPackageAddonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<AddonFormData>(emptyAddonFormData);

  useEffect(() => {
    const fetchAddon = async () => {
      try {
        const res = await fetch(`/api/package-addons/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Addon = await res.json();
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: String(data.price),
          priceUnit: data.priceUnit,
          selectionGroup: data.selectionGroup || "",
          allowQuantity: data.allowQuantity ?? false,
          maxQuantity: data.maxQuantity ?? 4,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        });
      } catch (err) {
        setError("Failed to load add-on");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddon();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/package-addons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addonFormToPayload(formData)),
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, "Failed to update"));
      }

      router.push("/admin/package-addons");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Delete this add-on permanently? If it has bookings, it will be deactivated instead.",
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const deleteRes = await fetch(`/api/package-addons/${id}`, {
        method: "DELETE",
      });
      if (deleteRes.ok) {
        router.push("/admin/package-addons");
        return;
      }

      const deactivateRes = await fetch(`/api/package-addons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (!deactivateRes.ok) {
        throw new Error(await readApiError(deactivateRes, "Failed to remove add-on"));
      }

      alert(
        "Add-on has existing bookings and was deactivated instead of deleted.",
      );
      router.push("/admin/package-addons");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove add-on");
    } finally {
      setDeleting(false);
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
      <div className="mb-8">
        <Link
          href="/admin/package-addons"
          className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors mb-2 inline-block"
        >
          ← Back to Add-ons
        </Link>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Edit Add-on
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <AddonFormFields
          formData={formData}
          autoSlug={false}
          onFormDataChange={setFormData}
        />

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/package-addons"
            className="px-8 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-8 py-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {deleting ? "Removing..." : "Delete Add-on"}
          </button>
        </div>
      </form>
    </div>
  );
}
