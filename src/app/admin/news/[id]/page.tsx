"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/db/schema";

const categories = [
  { value: "fishing-reports", label: "Fishing Reports" },
  { value: "species-spotlight", label: "Species Spotlight" },
  { value: "charter-updates", label: "Charter Updates" },
  { value: "gear-tackle", label: "Gear & Tackle" },
  { value: "weather-updates", label: "Weather Updates" },
  { value: "tips-techniques", label: "Tips & Techniques" },
];

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "charter-updates",
    tags: "",
    status: "draft",
    isFeatured: false,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Article = await res.json();
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          coverImage: data.coverImage || "",
          category: data.category,
          tags: data.tags?.join(", ") || "",
          status: data.status,
          isFeatured: data.isFeatured,
        });
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/admin/news");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/news" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">← Back to News</Link>
        <h1 className="text-3xl font-bold mt-2">Edit Article</h1>
      </div>

      {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--theme-surface)] p-6 rounded-xl border border-[var(--theme-border)]">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content * (Markdown)</label>
          <textarea rows={15} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg">
              {categories.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image URL</label>
          <input type="text" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="isFeatured" className="text-sm">Featured Article</label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/news" className="px-6 py-2 bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

