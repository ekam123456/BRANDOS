import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma, withTenantTransaction } from "@/lib/prisma";

type AuditMetadata = Record<string, string | number | boolean | null>;
type AuditDb = Pick<ReturnType<typeof getPrisma>, "auditEvent">;

const forbiddenKey = /(password|secret|token|api.?key|access.?key|authorization|cookie)/i;

function sanitizeMetadata(metadata: AuditMetadata | undefined): Prisma.InputJsonObject | undefined {
  if (!metadata) return undefined;
  for (const key of Object.keys(metadata)) {
    if (forbiddenKey.test(key)) {
      throw new Error(`Audit metadata key is not permitted: ${key}`);
    }
  }
  return metadata as Prisma.InputJsonObject;
}

export type AuditEventInput = {
  organizationId: string;
  actorUserId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  result?: "success" | "failure";
  metadata?: AuditMetadata;
  requestId?: string;
};

export async function recordAuditEvent(input: AuditEventInput): Promise<void> {
  await withTenantTransaction(input.organizationId, (tx) => recordAuditEventInTransaction(tx, input));
}

export async function recordAuditEventInTransaction(
  db: AuditDb,
  input: AuditEventInput,
): Promise<void> {
  await db.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      result: input.result ?? "success",
      metadata: sanitizeMetadata(input.metadata),
      requestId: input.requestId,
    },
  });
}
