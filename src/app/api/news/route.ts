import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET all articles (for admin)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allArticles = await db.query.articles.findMany({
      with: { author: true },
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    });

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new article
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, tags, status, isFeatured } = body;

    // Validate required fields
    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if slug already exists
    const existingArticle = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
    });

    if (existingArticle) {
      return NextResponse.json({ error: "An article with this slug already exists" }, { status: 400 });
    }

    // Generate excerpt if not provided
    const finalExcerpt = excerpt || content.substring(0, 200).replace(/[#*_]/g, "").replace(/\s+/g, " ").trim() + "...";

    // Create article
    const [newArticle] = await db.insert(articles).values({
      title,
      slug,
      excerpt: finalExcerpt,
      content,
      coverImage: coverImage || null,
      category,
      tags: tags || [],
      authorId: user.id,
      status: status || "draft",
      isFeatured: isFeatured || false,
      publishedAt: status === "published" ? new Date() : null,
    }).returning();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

