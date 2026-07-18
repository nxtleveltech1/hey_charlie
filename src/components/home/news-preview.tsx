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
    month: "long",
    year: "numeric",
  });
}

export function NewsPreview({ articles }: { articles: NewsPreviewArticle[] }) {
  if (articles.length === 0) return null;

  const [feature, ...rest] = articles;
  const featureCover = displayableImageSrc(feature.coverImage);

  return (
    <section
      id="news"
      className="section-pad bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
      aria-labelledby="news-heading"
    >
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
              subtitle="Fishing reports, charter updates, and stories from the water — see what's biting before you book."
            />

            <div className="grid gap-3 lg:grid-cols-12">
              {/* Feature story — image-led, sunset scrim */}
              <Link
                href={`/news/${feature.slug}`}
                className={`group relative block min-h-[300px] overflow-hidden rounded-2xl border border-[var(--theme-border)] light-card card-hover sm:min-h-[360px] lg:min-h-[420px] ${
                  rest.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
                }`}
              >
                {featureCover ? (
                  <Image
                    src={featureCover}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={rest.length > 0 ? "(max-width: 1024px) 100vw, 58vw" : "100vw"}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#122a44]" aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-medium uppercase tracking-wider text-white backdrop-blur-md">
                      {categoryLabels[feature.category] ?? feature.category}
                    </span>
                    <span className="text-white/70">{formatDate(feature.publishedAt)}</span>
                  </div>
                  <h3
                    className="mb-2 max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {feature.title}
                  </h3>
                  {feature.excerpt && (
                    <p className="mb-3 max-w-xl text-sm leading-relaxed text-white/75 line-clamp-2 sm:text-base">
                      {feature.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                    Read the story
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Logbook rows — horizontal editorial entries */}
              {rest.length > 0 && (
                <div className="flex flex-col gap-3 lg:col-span-5">
                  {rest.map((article) => {
                    const cover = displayableImageSrc(article.coverImage);
                    const solo = rest.length === 1;
                    return (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className={`group flex flex-1 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] light-card card-hover ${
                          solo ? "flex-col" : ""
                        }`}
                      >
                        <div
                          className={
                            solo
                              ? "relative min-h-[200px] w-full flex-1 sm:min-h-[240px]"
                              : "relative w-32 shrink-0 self-stretch sm:w-44 lg:w-40 xl:w-48"
                          }
                        >
                          {cover ? (
                            <Image
                              src={cover}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes={solo ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 640px) 8rem, 12rem"}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#122a44]" aria-hidden="true" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                          <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-orange-500">
                            {categoryLabels[article.category] ?? article.category}
                          </p>
                          <h3 className="font-bold leading-snug line-clamp-2 transition-colors group-hover:text-orange-500 sm:text-lg">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="mt-1.5 hidden text-sm text-[var(--theme-text-muted)] line-clamp-2 sm:block">
                              {article.excerpt}
                            </p>
                          )}
                          <p className="mt-2.5 text-xs text-[var(--theme-text-muted)]">
                            {formatDate(article.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
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
