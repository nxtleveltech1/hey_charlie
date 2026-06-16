"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Package } from "@/db/schema";
import {
  PackageFormFields,
  emptyPackageFormData,
  packageFormToPayload,
  type PackageFormData,
} from "@/components/admin/package-form";

export default function EditPackagePage({
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
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [formData, setFormData] = useState<PackageFormData>(emptyPackageFormData);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Package = await res.json();
        setFormData({
          name: data.name,
          slug: data.slug,
          tagline: data.tagline || "",
          description: data.description,
          duration: data.duration,
          pricePerPerson: String(data.pricePerPerson),
          minGuests: data.minGuests,
          maxGuests: data.maxGuests,
          category: data.category,
          imageUrl: data.imageUrl || "",
          isActive: data.isActive,
          isFeatured: data.isFeatured,
        });
        setHighlights(
          data.highlights && data.highlights.length > 0
            ? data.highlights
            : [""],
        );
      } catch (err) {
        setError("Failed to load package");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageFormToPayload(formData, highlights)),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Delete this package permanently? If it has bookings, it will be deactivated instead.",
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const deleteRes = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (deleteRes.ok) {
        router.push("/admin/packages");
        return;
      }

      const deactivateRes = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (!deactivateRes.ok) {
        const data = await deactivateRes.json();
        throw new Error(data.error || "Failed to remove package");
      }

      alert(
        "Package has existing bookings and was deactivated instead of deleted.",
      );
      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove package");
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
          href="/admin/packages"
          className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors mb-2 inline-block"
        >
          ← Back to Packages
        </Link>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Edit Package
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <PackageFormFields
          formData={formData}
          highlights={highlights}
          autoSlug={false}
          onFormDataChange={setFormData}
          onHighlightsChange={setHighlights}
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
            href="/admin/packages"
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
            {deleting ? "Removing..." : "Delete Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
