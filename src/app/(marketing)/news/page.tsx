import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { displayableImageSrc } from "@/lib/images";

export const metadata: Metadata = {
  title: "News & Fishing Reports | Hey Charlie Charters",
  description: "Latest fishing reports, charter updates, and tips from Hey Charlie Charters.",
};

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  "fishing-reports": "Fishing Reports",
  "species-spotlight": "Species Spotlight",
  "charter-updates": "Charter Updates",
  "gear-tackle": "Gear & Tackle",
  "weather-updates": "Weather Updates",
  "tips-techniques": "Tips & Techniques",
};

export default async function NewsPage() {
  const publishedArticles = await db.query.articles.findMany({
    where: eq(articles.status, "published"),
    orderBy: [desc(articles.publishedAt)],
    with: { author: true },
  });

  const featuredArticle = publishedArticles.find((a) => a.isFeatured);
  const regularArticles = publishedArticles.filter((a) => a.id !== featuredArticle?.id);
  const featuredCover = displayableImageSrc(featuredArticle?.coverImage);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)] pb-16 pt-28 lg:pt-32">
        <div className="wide-shell text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            News & <span className="text-orange-500">Reports</span>
          </h1>
          <p className="text-xl text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Stay updated with the latest fishing conditions, charter news, and tips
          </p>
        </div>
      </section>

      <section className="wide-shell py-16">
        {publishedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--theme-text-muted)]">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredArticle && (
              <Link href={`/news/${featuredArticle.slug}`} className="block group">
                <div className="grid overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-orange-500/50 transition-all lg:grid-cols-2">
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
                    {featuredCover ? (
                      <Image src={featuredCover} alt={featuredArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl bg-[var(--theme-bg)]">📰</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <span className="self-start px-3 py-1 bg-orange-500 text-white text-sm rounded-full">Featured</span>
                    <h2 className="text-3xl lg:text-4xl font-bold mt-5 group-hover:text-orange-400 transition-colors">{featuredArticle.title}</h2>
                    <p className="text-[var(--theme-text-muted)] mt-4 line-clamp-3 leading-relaxed">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 mt-6 text-sm text-[var(--theme-text-muted)]">
                      <span className="text-orange-400 font-medium">{categoryLabels[featuredArticle.category]}</span>
                      <span>{featuredArticle.publishedAt ? new Date(featuredArticle.publishedAt).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {regularArticles.map((article) => {
                const cover = displayableImageSrc(article.coverImage);
                return (
                <Link key={article.id} href={`/news/${article.slug}`} className="group">
                  <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] overflow-hidden hover:border-orange-500/50 transition-all">
                    <div className="relative h-48 bg-[var(--theme-bg)]">
                      {cover ? (
                        <Image src={cover} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-orange-400 font-medium">{categoryLabels[article.category]}</span>
                      <h3 className="font-bold mt-1 group-hover:text-orange-400 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-[var(--theme-text-muted)] mt-2 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-[var(--theme-text-muted)]">
                        <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}</span>
                        <span>{article.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
