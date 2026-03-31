import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "News & Fishing Reports | Hey Charlie Charters",
  description: "Latest fishing reports, charter updates, and tips from Hey Charlie Charters.",
};

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

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl z-50 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-nav-bg-transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo2.png" alt="Hey Charlie Charters" width={50} height={50} className="rounded-xl" />
              <div>
                <span className="text-xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display)" }}>
                  Hey Charlie
                </span>
                <span className="block text-[10px] font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/#packages" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Packages</Link>
              <Link href="/destinations" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Destinations</Link>
              <Link href="/crew" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Crew</Link>
              <span className="text-sm text-orange-400 font-medium">News</span>
              <Link href="/weather" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Weather</Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignedOut>
                <Link href="/sign-in" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Sign In</Link>
                <Link href="/#packages" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity">Book Now</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">My Bookings</Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-orange-500/50" } }} />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            News & <span className="text-orange-500">Reports</span>
          </h1>
          <p className="text-xl text-[var(--theme-text-muted)] max-w-2xl mx-auto">
            Stay updated with the latest fishing conditions, charter news, and tips
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {publishedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--theme-text-muted)]">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredArticle && (
              <Link href={`/news/${featuredArticle.slug}`} className="block group">
                <div className="relative h-[400px] rounded-2xl overflow-hidden bg-[var(--theme-surface)]">
                  {featuredArticle.coverImage ? (
                    <Image src={featuredArticle.coverImage} alt={featuredArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">📰</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">Featured</span>
                    <h2 className="text-3xl font-bold text-white mt-4 group-hover:text-orange-400 transition-colors">{featuredArticle.title}</h2>
                    <p className="text-white/80 mt-2 line-clamp-2">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
                      <span>{categoryLabels[featuredArticle.category]}</span>
                      <span>{featuredArticle.publishedAt ? new Date(featuredArticle.publishedAt).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group">
                  <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] overflow-hidden hover:border-orange-500/50 transition-all">
                    <div className="relative h-48 bg-[var(--theme-bg)]">
                      {article.coverImage ? (
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

