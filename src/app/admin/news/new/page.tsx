"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CoverImageInput } from "@/components/cover-image-input";
import { ArticleContentEditor } from "@/components/article-content-editor";

const categories = [
  { value: "fishing-reports", label: "Fishing Reports" },
  { value: "species-spotlight", label: "Species Spotlight" },
  { value: "charter-updates", label: "Charter Updates" },
  { value: "gear-tackle", label: "Gear & Tackle" },
  { value: "weather-updates", label: "Weather Updates" },
  { value: "tips-techniques", label: "Tips & Techniques" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create article");
      }

      router.push("/admin/news");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/news" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">
          ← Back to News
        </Link>
        <h1 className="text-3xl font-bold mt-2">Create New Article</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--theme-surface)] p-6 rounded-xl border border-[var(--theme-border)]">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input type="text" required value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea rows={2} placeholder="Brief summary (auto-generated if empty)" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <ArticleContentEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <CoverImageInput value={formData.coverImage} onChange={(url) => setFormData({ ...formData, coverImage: url })} />

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input type="text" placeholder="marlin, deep sea, durban" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="isFeatured" className="text-sm">Featured Article</label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Article"}
          </button>
          <Link href="/admin/news" className="px-6 py-2 bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

