import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET serve an uploaded image (public — images appear on the marketing site)
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const asset = await db.query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, id),
    });

    if (!asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(asset.data, "base64"), {
      headers: {
        "Content-Type": asset.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving media:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
