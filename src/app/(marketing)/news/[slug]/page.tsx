import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { displayableImageSrc } from "@/lib/images";
import { ArticleContent, extractArticleImages, type ArticleImage } from "@/components/article-content";

// Sticky column of tilted photo cards flanking the article on wide screens
function PhotoRail({ images, side }: { images: ArticleImage[]; side: "left" | "right" }) {
  if (images.length === 0) return null;
  return (
    <aside
      className={`hidden xl:block xl:sticky xl:top-28 self-start space-y-10 pt-10 ${
        side === "left" ? "xl:col-start-1" : "xl:col-start-3"
      } xl:row-start-1`}
    >
      {images.map((img, i) => (
        <figure
          key={`${img.src}-${i}`}
          className={`overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xl transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] ${
            (i + (side === "right" ? 1 : 0)) % 2 === 0 ? "-rotate-2" : "rotate-2"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt={img.alt} className="w-full object-cover" />
          {img.alt && (
            <figcaption className="px-3 py-2 text-xs text-[var(--theme-text-muted)]">{img.alt}</figcaption>
          )}
        </figure>
      ))}
    </aside>
  );
}

export const dynamic = "force-dynamic";

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

  const { images: attachedImages, text: bodyText } = extractArticleImages(article.content);
  const leftImages = attachedImages.filter((_, i) => i % 2 === 0);
  const rightImages = attachedImages.filter((_, i) => i % 2 === 1);

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] pt-20">
        {displayableImageSrc(article.coverImage) ? (
          <Image src={displayableImageSrc(article.coverImage)!} alt={article.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-[var(--theme-surface)] flex items-center justify-center text-8xl">📰</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/60 to-transparent" />
      </div>

      {/* Content — center column flanked by attached photos on wide screens */}
      <div className="relative -mt-32 mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8 pb-16 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)] xl:gap-10 xl:items-start">
        <PhotoRail images={leftImages} side="left" />
        <article className="max-w-4xl mx-auto xl:max-w-none xl:mx-0 xl:col-start-2 xl:row-start-1">
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
          <ArticleContent content={bodyText} />

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

        {/* Attached photos — grid fallback below the article on smaller screens */}
        {attachedImages.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 xl:hidden">
            {attachedImages.map((img, i) => (
              <figure key={`${img.src}-${i}`} className="overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-40 sm:h-52 object-cover" />
                {img.alt && (
                  <figcaption className="px-3 py-2 text-xs text-[var(--theme-text-muted)]">{img.alt}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/news" className="text-orange-400 hover:text-orange-300 transition-colors">← Back to News</Link>
        </div>
        </article>
        <PhotoRail images={rightImages} side="right" />
      </div>
    </>
  );
}

