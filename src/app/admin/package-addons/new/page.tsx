"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AddonFormFields,
  emptyAddonFormData,
  addonFormToPayload,
  type AddonFormData,
} from "@/components/admin/package-addon-form";
import { readApiError } from "@/lib/api-client";

export default function NewPackageAddonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddonFormData>(emptyAddonFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/package-addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addonFormToPayload(formData)),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to create add-on"));
      }

      router.push("/admin/package-addons");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
          Create Add-on
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <AddonFormFields
          formData={formData}
          onFormDataChange={setFormData}
        />

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Add-on"}
          </button>
          <Link
            href="/admin/package-addons"
            className="px-8 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
