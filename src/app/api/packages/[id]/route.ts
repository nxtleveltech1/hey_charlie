import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { packages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getPackageRevalidationPaths } from "@/lib/package-revalidation";

const packageUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  tagline: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required").optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  pricePerPerson: z.number().min(0).optional(),
  minGuests: z.number().int().min(1).optional(),
  maxGuests: z.number().int().min(1).optional(),
  category: z.string().optional(),
  highlights: z.array(z.string()).optional().nullable(),
  imageUrl: z.string().regex(/^(https?:\/\/|\/)/, "Must be a full URL or a path starting with /").optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// GET - Get single package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, id),
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Failed to fetch package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

// PUT - Update package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;
    const body = await request.json();
    const validatedData = packageUpdateSchema.parse(body);

    const existingPackage = await db.query.packages.findFirst({
      where: eq(packages.id, id),
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    if (validatedData.slug && validatedData.slug !== existingPackage.slug) {
      const slugExists = await db.query.packages.findFirst({
        where: eq(packages.slug, validatedData.slug),
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "A package with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const [updatedPackage] = await db
      .update(packages)
      .set({
        ...validatedData,
        pricePerPerson: validatedData.pricePerPerson?.toString(),
        imageUrl: validatedData.imageUrl === "" ? null : validatedData.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))
      .returning();

    for (const path of getPackageRevalidationPaths([
      existingPackage.slug,
      updatedPackage.slug,
    ])) {
      revalidatePath(path);
    }

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error("Failed to update package:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

// DELETE - Delete package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    const existingPackage = await db.query.packages.findFirst({
      where: eq(packages.id, id),
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    await db.delete(packages).where(eq(packages.id, id));

    for (const path of getPackageRevalidationPaths([existingPackage.slug])) {
      revalidatePath(path);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
