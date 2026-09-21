import { NextResponse } from "next/server";
import { completeOnboarding, getBusinessBrain, getOnboardingProgress, saveOnboardingDraft } from "@/lib/business-brain";
import { isClerkConfigured } from "@/lib/auth";

function statusFor(error: unknown) {
  return error instanceof Error && "status" in error && (error.status === 400 || error.status === 401 || error.status === 403)
    ? error.status
    : 500;
}

export async function GET() {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try {
    return NextResponse.json({ brain: await getBusinessBrain(), progress: await getOnboardingProgress() });
  } catch (error) {
    const status = statusFor(error);
    return NextResponse.json({ error: status === 500 ? "Unable to load business context." : error instanceof Error ? error.message : "Unable to load business context." }, { status });
  }
}

export async function POST(request: Request) {
  if (!isClerkConfigured) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ error: "Cross-origin mutation rejected." }, { status: 403 });
    }
    const body = await request.json();
    if (body.draft) return NextResponse.json(await saveOnboardingDraft(body.draft));
    return NextResponse.json(await completeOnboarding(body.answers, request.headers.get("x-request-id") ?? undefined), { status: 201 });
  } catch (error) {
    const status = statusFor(error);
    return NextResponse.json({ error: status === 500 ? "Unable to save business context." : error instanceof Error ? error.message : "Unable to save business context." }, { status });
  }
}
