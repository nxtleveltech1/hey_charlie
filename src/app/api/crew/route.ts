import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crewMembers, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

const crewMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  certifications: z.array(z.string()).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

// GET - List crew members.
// Admins receive the full record set (active + inactive) for management tools.
// Anonymous / non-admin callers receive ONLY active crew mapped to a
// public-safe shape with PII (email, phone) stripped.
export async function GET() {
  try {
    const { userId } = await auth();
    let isAdmin = false;
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
      });
      isAdmin = user?.role === "admin";
    }

    const crew = await db.query.crewMembers.findMany({
      where: isAdmin ? undefined : eq(crewMembers.isActive, true),
      orderBy: [asc(crewMembers.displayOrder)],
    });

    if (isAdmin) {
      return NextResponse.json(crew);
    }

    // Public: expose display-safe fields only. `email` and `phone` are never
    // surfaced to anonymous callers.
    const publicCrew = crew.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      yearsExperience: member.yearsExperience,
      certifications: member.certifications,
      order: member.displayOrder,
      image: member.imageUrl,
    }));

    return NextResponse.json(publicCrew);
  } catch (error) {
    console.error("Failed to fetch crew members:", error);
    return NextResponse.json(
      { error: "Failed to fetch crew members" },
      { status: 500 }
    );
  }
}

// POST - Create new crew member (admin only)
export async function POST(request: NextRequest) {
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
    const validatedData = crewMemberSchema.parse(body);

    const [newCrewMember] = await db
      .insert(crewMembers)
      .values({
        name: validatedData.name,
        role: validatedData.role,
        bio: validatedData.bio || null,
        yearsExperience: validatedData.yearsExperience || null,
        certifications: validatedData.certifications || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        imageUrl: validatedData.imageUrl || null,
        isActive: validatedData.isActive,
        displayOrder: validatedData.displayOrder,
      })
      .returning();

    return NextResponse.json(newCrewMember, { status: 201 });
  } catch (error) {
    console.error("Failed to create crew member:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create crew member" },
      { status: 500 }
    );
  }
}

