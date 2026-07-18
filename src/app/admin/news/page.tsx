"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/db/schema";
import { displayableImageSrc } from "@/lib/images";

const categoryLabels: Record<string, string> = {
  "fishing-reports": "Fishing Reports",
  "species-spotlight": "Species Spotlight",
  "charter-updates": "Charter Updates",
  "gear-tackle": "Gear & Tackle",
  "weather-updates": "Weather Updates",
  "tips-techniques": "Tips & Techniques",
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-400",
  published: "bg-green-500/20 text-green-400",
  archived: "bg-gray-500/20 text-gray-400",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      setError("Failed to delete article");
      console.error(err);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">News & Articles</h1>
          <p className="text-[var(--theme-text-muted)] mt-1">Manage blog posts and fishing reports</p>
        </div>
        <Link href="/admin/news/new" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          + New Article
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)]">
          <p className="text-[var(--theme-text-muted)]">No articles yet.</p>
          <Link href="/admin/news/new" className="text-orange-400 hover:text-orange-300 mt-2 inline-block">
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article.id} className="flex gap-4 p-4 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)]">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--theme-bg)] flex-shrink-0">
                {displayableImageSrc(article.coverImage) ? (
                  <Image src={displayableImageSrc(article.coverImage)!} alt={article.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold truncate">{article.title}</h3>
                    <p className="text-sm text-[var(--theme-text-muted)] line-clamp-2">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[article.status]}`}>
                      {article.status}
                    </span>
                    {article.isFeatured && <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">Featured</span>}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-[var(--theme-text-muted)]">
                  <span>{categoryLabels[article.category] || article.category}</span>
                  <span>{article.viewCount} views</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/news/${article.id}`} className="px-3 py-1.5 text-sm bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">Edit</Link>
                <button onClick={() => deleteArticle(article.id)} className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

