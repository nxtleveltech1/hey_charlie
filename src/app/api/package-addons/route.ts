import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { addons, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { ensureUserInDatabase } from "@/lib/user-sync";

const createAddonSchema = z.object({
  slug: z.string().min(2).max(100),
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  priceUnit: z.enum(["flat", "per_person"]),
  selectionGroup: z.string().optional().nullable(),
  allowQuantity: z.boolean().default(false),
  maxQuantity: z.number().int().min(1).max(20).default(4),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

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

    const allAddons = await db.query.addons.findMany({
      where: isAdmin && includeInactive ? undefined : eq(addons.isActive, true),
      orderBy: [asc(addons.displayOrder), asc(addons.name)],
    });

    return NextResponse.json({ addons: allAddons });
  } catch (error) {
    console.error("Error fetching addons:", error);
    return NextResponse.json(
      { error: "Failed to fetch addons" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureUserInDatabase(userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createAddonSchema.parse(body);

    const [newAddon] = await db
      .insert(addons)
      .values({
        ...validatedData,
        price: validatedData.price.toString(),
        selectionGroup: validatedData.selectionGroup || null,
      })
      .returning();

    return NextResponse.json({ addon: newAddon }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating addon:", error);
    return NextResponse.json(
      { error: "Failed to create addon" },
      { status: 500 },
    );
  }
}
