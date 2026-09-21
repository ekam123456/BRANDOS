import "server-only";
import { auth } from "@clerk/nextjs/server";
import { AuthorizationError } from "@/lib/tenant";

export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  && (process.env.NODE_ENV !== "production" || process.env.CLERK_SECRET_KEY),
);

export async function requireAuthenticatedOrganization() {
  if (!isClerkConfigured) {
    throw new AuthorizationError("Clerk is not configured for this environment.", 401);
  }

  const session = await auth();
  if (!session.isAuthenticated || !session.userId) {
    throw new AuthorizationError("Authentication is required.", 401);
  }
  if (!session.orgId) {
    throw new AuthorizationError("Select an organization to continue.", 403);
  }

  return { userId: session.userId, organizationId: session.orgId, session };
}
