import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { addons, bookingAddons, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ensureUserInDatabase } from "@/lib/user-sync";

const addonUpdateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  priceUnit: z.enum(["flat", "per_person"]).optional(),
  selectionGroup: z.string().optional().nullable(),
  allowQuantity: z.boolean().optional(),
  maxQuantity: z.number().int().min(1).max(20).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const addon = await db.query.addons.findFirst({
      where: eq(addons.id, id),
    });

    if (!addon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    return NextResponse.json(addon);
  } catch (error) {
    console.error("Failed to fetch addon:", error);
    return NextResponse.json(
      { error: "Failed to fetch addon" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureUserInDatabase(userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = addonUpdateSchema.parse(body);

    const existingAddon = await db.query.addons.findFirst({
      where: eq(addons.id, id),
    });

    if (!existingAddon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    if (validatedData.slug && validatedData.slug !== existingAddon.slug) {
      const slugExists = await db.query.addons.findFirst({
        where: eq(addons.slug, validatedData.slug),
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "An addon with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const [updatedAddon] = await db
      .update(addons)
      .set({
        ...validatedData,
        price: validatedData.price?.toString(),
        selectionGroup:
          validatedData.selectionGroup === undefined
            ? undefined
            : validatedData.selectionGroup || null,
        updatedAt: new Date(),
      })
      .where(eq(addons.id, id))
      .returning();

    return NextResponse.json(updatedAddon);
  } catch (error) {
    console.error("Failed to update addon:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update addon" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureUserInDatabase(userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existingAddon = await db.query.addons.findFirst({
      where: eq(addons.id, id),
    });

    if (!existingAddon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    const linkedBookings = await db.query.bookingAddons.findFirst({
      where: eq(bookingAddons.addonId, id),
    });

    if (linkedBookings) {
      return NextResponse.json(
        {
          error: "Addon has booking history and cannot be deleted. Deactivate instead.",
        },
        { status: 409 },
      );
    }

    await db.delete(addons).where(eq(addons.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete addon:", error);
    return NextResponse.json(
      { error: "Failed to delete addon" },
      { status: 500 },
    );
  }
}
