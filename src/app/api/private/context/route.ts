import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth";
import { requirePermission } from "@/lib/authorization";

export async function GET() {
  if (!isClerkConfigured) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }

  try {
    const { userId, organizationId } = await requirePermission("business.read");
    return NextResponse.json({ userId, organizationId });
  } catch (error) {
    const status = error instanceof Error && "status" in error && (error.status === 401 || error.status === 403) ? error.status : 500;
    return NextResponse.json({ error: status === 500 ? "Unable to authorize request." : error instanceof Error ? error.message : "Unable to authorize request." }, { status });
  }
}
