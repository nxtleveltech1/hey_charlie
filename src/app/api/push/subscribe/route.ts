import { NextResponse } from "next/server";

/** Stores push subscription JSON — wire to notification provider in production. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.subscription) {
      return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
    }
    // TODO: persist subscription to database when push provider is configured
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
