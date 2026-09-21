import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth";
import { disconnectConnection, syncGoogleAnalytics } from "@/lib/integrations";

export async function DELETE(_: Request, context: { params: Promise<{ connectionId: string }> }) {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try {
    const origin = _.headers.get("origin");
    if (origin && origin !== new URL(_.url).origin) return NextResponse.json({ error: "Cross-origin mutation rejected." }, { status: 403 });
    return NextResponse.json(await disconnectConnection((await context.params).connectionId));
  }
  catch { return NextResponse.json({ error: "Unable to disconnect connection." }, { status: 400 }); }
}

export async function POST(_: Request, context: { params: Promise<{ connectionId: string }> }) {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try {
    const origin = _.headers.get("origin");
    if (origin && origin !== new URL(_.url).origin) return NextResponse.json({ error: "Cross-origin mutation rejected." }, { status: 403 });
    return NextResponse.json(await syncGoogleAnalytics((await context.params).connectionId));
  }
  catch { return NextResponse.json({ error: "Unable to synchronize connection." }, { status: 400 }); }
}
