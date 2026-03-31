import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crewMembers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const crewMemberUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.string().min(1, "Role is required").optional(),
  bio: z.string().optional().nullable(),
  yearsExperience: z.number().int().min(0).optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

// GET - Get single crew member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const crewMember = await db.query.crewMembers.findFirst({
      where: eq(crewMembers.id, id),
    });

    if (!crewMember) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    return NextResponse.json(crewMember);
  } catch (error) {
    console.error("Failed to fetch crew member:", error);
    return NextResponse.json({ error: "Failed to fetch crew member" }, { status: 500 });
  }
}

// PUT - Update crew member (admin only)
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
    const validatedData = crewMemberUpdateSchema.parse(body);

    const existingCrewMember = await db.query.crewMembers.findFirst({
      where: eq(crewMembers.id, id),
    });

    if (!existingCrewMember) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    const [updatedCrewMember] = await db
      .update(crewMembers)
      .set({
        ...validatedData,
        email: validatedData.email === "" ? null : validatedData.email,
        imageUrl: validatedData.imageUrl === "" ? null : validatedData.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(crewMembers.id, id))
      .returning();

    return NextResponse.json(updatedCrewMember);
  } catch (error) {
    console.error("Failed to update crew member:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update crew member" }, { status: 500 });
  }
}

// DELETE - Delete crew member (admin only)
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
    const existingCrewMember = await db.query.crewMembers.findFirst({
      where: eq(crewMembers.id, id),
    });

    if (!existingCrewMember) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    await db.delete(crewMembers).where(eq(crewMembers.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete crew member:", error);
    return NextResponse.json({ error: "Failed to delete crew member" }, { status: 500 });
  }
}

