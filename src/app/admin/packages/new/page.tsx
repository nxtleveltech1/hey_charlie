"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { value: "relaxation", label: "Relaxation" },
  { value: "adventure", label: "Adventure" },
  { value: "culinary", label: "Culinary" },
  { value: "wildlife", label: "Wildlife" },
  { value: "fishing", label: "Fishing" },
  { value: "private", label: "Private Events" },
];

export default function NewPackagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([""]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    duration: "",
    pricePerPerson: "",
    minGuests: 1,
    maxGuests: 12,
    category: "relaxation",
    isActive: true,
    isFeatured: false,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricePerPerson: parseFloat(formData.pricePerPerson),
          highlights: highlights.filter((h) => h.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create package");
      }

      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/packages"
          className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors mb-2 inline-block"
        >
          ← Back to Packages
        </Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Create New Package
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6 p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
                placeholder="Sundowner Cruise"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors font-mono text-sm"
                placeholder="sundowner-cruise"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              placeholder="Watch the sun set over Table Mountain"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors resize-none"
              placeholder="Describe the experience..."
            />
          </div>

          {/* Pricing & Capacity */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price per Person (ZAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={0.01}
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
                placeholder="850"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Guests</label>
              <input
                type="number"
                min={1}
                value={formData.minGuests}
                onChange={(e) => setFormData({ ...formData, minGuests: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Guests</label>
              <input
                type="number"
                min={1}
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
                placeholder="2.5 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium mb-2">Highlights / Includes</label>
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
                    placeholder="e.g., Complimentary drinks"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="px-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="mt-2 text-sm text-orange-500 hover:text-orange-400 transition-colors"
            >
              + Add highlight
            </button>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
              />
              <span>Active (visible on website)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--theme-border)] text-orange-500 focus:ring-orange-500"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Package"}
          </button>
          <Link
            href="/admin/packages"
            className="px-8 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

