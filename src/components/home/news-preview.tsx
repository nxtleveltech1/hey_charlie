import Link from "next/link";
import Image from "next/image";
import { displayableImageSrc } from "@/lib/images";
import { SectionHeader } from "./section-header";
import { RevealOnScroll } from "./reveal-on-scroll";

const categoryLabels: Record<string, string> = {
  "fishing-reports": "Fishing Reports",
  "species-spotlight": "Species Spotlight",
  "charter-updates": "Charter Updates",
  "gear-tackle": "Gear & Tackle",
  "weather-updates": "Weather Updates",
  "tips-techniques": "Tips & Techniques",
};

export interface NewsPreviewArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  publishedAt: Date | null;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsPreview({ articles }: { articles: NewsPreviewArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="news" className="section-pad" aria-labelledby="news-heading">
      <div className="wide-shell">
        <RevealOnScroll>
          <div className="section-stack">
            <SectionHeader
              id="news-heading"
              dense
              eyebrow="From the Logbook"
              title={
                <>
                  News &amp; <span className="text-gradient-sunset">Articles</span>
                </>
              }
              subtitle="Fishing reports, charter updates, and tips straight from the crew — see what's biting before you book."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const cover = displayableImageSrc(article.coverImage);
                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-[var(--theme-border)] light-card card-hover"
                  >
                    <div className="relative h-44 lg:h-48 bg-[var(--theme-surface)]">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl" aria-hidden="true">
                          📰
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs text-cyan-300 backdrop-blur-sm">
                        {categoryLabels[article.category] ?? article.category}
                      </span>
                    </div>
                    <div className="p-4 lg:p-5">
                      <h3 className="font-semibold line-clamp-2 transition-colors group-hover:text-cyan-500">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-1.5 text-sm text-[var(--theme-text-muted)] line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-[var(--theme-text-muted)]">
                        {formatDate(article.publishedAt)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        <div className="text-center mt-6 lg:mt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm lg:text-base"
          >
            View All News &amp; Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
