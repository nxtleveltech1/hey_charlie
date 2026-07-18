"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCrewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    yearsExperience: "",
    certifications: "",
    email: "",
    phone: "",
    imageUrl: "",
    isActive: true,
    displayOrder: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
          certifications: formData.certifications ? formData.certifications.split(",").map((c) => c.trim()) : [],
          displayOrder: parseInt(formData.displayOrder) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create crew member");
      }

      router.push("/admin/crew");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/crew" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">
          ← Back to Crew
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add New Crew Member</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--theme-surface)] p-6 rounded-xl border border-[var(--theme-border)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role *</label>
            <input type="text" required placeholder="e.g., Captain, First Mate" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Years Experience</label>
            <input type="number" min="0" value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input type="number" min="0" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Certifications (comma-separated)</label>
          <input type="text" placeholder="Skipper's License, First Aid, etc." value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm">Active (visible on website)</label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Crew Member"}
          </button>
          <Link href="/admin/crew" className="px-6 py-2 bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

