import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth";

export async function GET() {
  if (!isClerkConfigured) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }

  const { isAuthenticated, userId, orgId } = await auth();
  if (!isAuthenticated || !userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (!orgId) {
    return NextResponse.json({ error: "An active organization is required." }, { status: 403 });
  }

  return NextResponse.json({ userId, organizationId: orgId });
}
