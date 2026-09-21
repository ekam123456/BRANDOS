import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)", "/api/private(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    && (process.env.NODE_ENV !== "production" || process.env.CLERK_SECRET_KEY),
  );
  if (!clerkConfigured) {
    if (isProtectedRoute(request)) {
      return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
    }
    return;
  }
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
}, {
  contentSecurityPolicy: {
    strict: true,
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
