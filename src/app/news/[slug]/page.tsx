import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";
import { PublicDesktopNav } from "@/components/public-desktop-nav";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  });

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Hey Charlie Charters`,
    description: article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: { author: true },
  });

  if (!article || article.status !== "published") {
    notFound();
  }

  // Increment view count
  await db.update(articles)
    .set({ viewCount: sql`${articles.viewCount} + 1` })
    .where(eq(articles.id, article.id));

  const categoryLabels: Record<string, string> = {
    "fishing-reports": "Fishing Reports",
    "species-spotlight": "Species Spotlight",
    "charter-updates": "Charter Updates",
    "gear-tackle": "Gear & Tackle",
    "weather-updates": "Weather Updates",
    "tips-techniques": "Tips & Techniques",
  };

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <MobileNav />

      <PublicDesktopNav active="news" />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] pt-20">
        {article.coverImage ? (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-[var(--theme-surface)] flex items-center justify-center text-8xl">📰</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/60 to-transparent" />
      </div>

      {/* Content */}
      <article className="relative -mt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-8 md:p-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)] mb-6">
            <Link href="/news" className="hover:text-orange-400 transition-colors">News</Link>
            <span>/</span>
            <span className="text-orange-400">{categoryLabels[article.category]}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--theme-text-muted)] mb-8 pb-8 border-b border-[var(--theme-border)]">
            {article.author && (
              <div className="flex items-center gap-2">
                {article.author.imageUrl ? (
                  <Image src={article.author.imageUrl} alt={article.author.firstName || ""} width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-sm">✍️</div>
                )}
                <span>{article.author.firstName} {article.author.lastName}</span>
              </div>
            )}
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
            <span>{article.viewCount} views</span>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-orange max-w-none prose-headings:text-[var(--theme-text)] prose-p:text-[var(--theme-text-secondary)] prose-a:text-orange-400 prose-strong:text-[var(--theme-text)]">
            {article.content.split("\n").map((paragraph, idx) => {
              if (paragraph.startsWith("# ")) {
                return <h1 key={idx}>{paragraph.slice(2)}</h1>;
              } else if (paragraph.startsWith("## ")) {
                return <h2 key={idx}>{paragraph.slice(3)}</h2>;
              } else if (paragraph.startsWith("### ")) {
                return <h3 key={idx}>{paragraph.slice(4)}</h3>;
              } else if (paragraph.trim()) {
                return <p key={idx}>{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--theme-border)]">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm bg-orange-500/10 text-orange-400 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/news" className="text-orange-400 hover:text-orange-300 transition-colors">← Back to News</Link>
        </div>
      </article>
    </main>
  );
}

