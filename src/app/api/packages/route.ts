import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { packages, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const createPackageSchema = z.object({
  slug: z.string().min(2).max(100),
  name: z.string().min(2).max(200),
  tagline: z.string().optional(),
  description: z.string().min(10),
  duration: z.string(),
  pricePerPerson: z.number().positive(),
  minGuests: z.number().min(1).default(1),
  maxGuests: z.number().min(1).default(12),
  category: z.string(),
  highlights: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// GET - List all active packages (public) or all packages (admin)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    let isAdmin = false;
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
      });
      isAdmin = user?.role === "admin";
    }

    const allPackages = await db.query.packages.findMany({
      where: isAdmin && includeInactive ? undefined : eq(packages.isActive, true),
      orderBy: [desc(packages.isFeatured), desc(packages.createdAt)],
    });

    return NextResponse.json({ packages: allPackages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST - Create new package (admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = createPackageSchema.parse(body);

    const [newPackage] = await db.insert(packages).values({
      ...validatedData,
      pricePerPerson: validatedData.pricePerPerson.toString(),
    }).returning();

    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}

