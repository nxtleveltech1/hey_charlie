import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single article
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: { author: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update article
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingArticle = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, tags, status, isFeatured } = body;

    if (slug !== existingArticle.slug) {
      const slugConflict = await db.query.articles.findFirst({
        where: and(eq(articles.slug, slug)),
      });

      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json({ error: "An article with this slug already exists" }, { status: 400 });
      }
    }

    let publishedAt = existingArticle.publishedAt;
    if (status === "published" && !existingArticle.publishedAt) {
      publishedAt = new Date();
    } else if (status !== "published") {
      publishedAt = null;
    }

    const finalExcerpt = excerpt || content.substring(0, 200).replace(/[#*_]/g, "").replace(/\s+/g, " ").trim() + "...";

    const [updatedArticle] = await db.update(articles)
      .set({
        title,
        slug,
        excerpt: finalExcerpt,
        content,
        coverImage: coverImage || null,
        category,
        tags: tags || [],
        status,
        isFeatured,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingArticle = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.delete(articles).where(eq(articles.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

