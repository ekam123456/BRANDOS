import "server-only";
import { getPrisma } from "@/lib/prisma";
import { requireAuthenticatedOrganization } from "@/lib/auth";
import { assertTenantAccess, AuthorizationError } from "@/lib/tenant";

export async function requirePermission(permissionKey: string) {
  const { userId, organizationId, session } = await requireAuthenticatedOrganization();
  assertTenantAccess(session.orgId, organizationId);

  const membership = await getPrisma().membership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  if (!membership) {
    throw new AuthorizationError("Authenticated organization membership is not synchronized.", 403);
  }

  const allowed = membership.role.permissions.some(({ permission }) => permission.key === permissionKey);
  if (!allowed) {
    throw new AuthorizationError(`Permission denied: ${permissionKey}`, 403);
  }

  return { userId, organizationId, membership };
}
