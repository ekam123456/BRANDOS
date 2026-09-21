import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { completeGoogleConnection } from "@/lib/integrations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("brandos_oauth_state")?.value;
  if (!state || !code || !expectedState || state !== expectedState) return NextResponse.json({ error: "OAuth state validation failed." }, { status: 400 });
  try {
    await completeGoogleConnection(state, code);
    const response = NextResponse.redirect(new URL("/dashboard/connections?connected=google-analytics", request.url));
    response.cookies.delete("brandos_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/dashboard/connections?error=connection-failed", request.url));
  }
}
