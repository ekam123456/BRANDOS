import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth";
import { beginConnection, listConnections } from "@/lib/integrations";

export async function GET() {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try { return NextResponse.json({ connections: await listConnections(), providers: ["google-analytics"] }); }
  catch { return NextResponse.json({ error: "Unable to load connections." }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Cross-origin mutation rejected." }, { status: 403 });
    const body = await request.json() as { provider?: unknown };
    const result = await beginConnection(body.provider);
    const response = NextResponse.json({ authorizationUrl: result.url });
    response.cookies.set("brandos_oauth_state", result.state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start connection." }, { status: 400 });
  }
}
