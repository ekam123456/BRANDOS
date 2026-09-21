import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";

const permissionCatalog = [
  ["business.read", "Read business foundation records."],
  ["business.write", "Create and update business foundation records."],
  ["audit.read", "Read organization audit events."],
] as const;

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET || !process.env.DATABASE_URL) {
    return new Response("Webhook integration is not configured.", { status: 503 });
  }

  try {
    const eventId = request.headers.get("svix-id");
    if (!eventId) {
      return new Response("Missing webhook event ID.", { status: 400 });
    }
    const event = await verifyWebhook(request);
    const prisma = getPrisma();
    const existing = await prisma.clerkWebhookEvent.findUnique({ where: { id: eventId } });
    if (existing) {
      return new Response("ok", { status: 200 });
    }

    await prisma.clerkWebhookEvent.create({ data: { id: eventId, eventType: event.type } });
    const data = event.data as unknown as Record<string, unknown>;

    if (event.type === "user.created" || event.type === "user.updated") {
      const email = Array.isArray(data.email_addresses) ? (data.email_addresses[0] as Record<string, unknown> | undefined)?.email_address : undefined;
      await prisma.userAccount.upsert({
        where: { id: String(data.id) },
        update: { email: typeof email === "string" ? email : undefined, displayName: typeof data.first_name === "string" ? data.first_name : undefined },
        create: { id: String(data.id), email: typeof email === "string" ? email : undefined, displayName: typeof data.first_name === "string" ? data.first_name : undefined },
      });
    }

    if (event.type === "organization.created" || event.type === "organization.updated") {
      const organizationId = String(data.id);
      await prisma.organization.upsert({
        where: { id: organizationId },
        update: { name: String(data.name), slug: typeof data.slug === "string" ? data.slug : undefined },
        create: { id: organizationId, name: String(data.name), slug: typeof data.slug === "string" ? data.slug : undefined },
      });
      const permissions = await Promise.all(permissionCatalog.map(([key, description]) => prisma.permission.upsert({ where: { key }, update: { description }, create: { key, description } })));
      const adminRole = await prisma.role.upsert({ where: { organizationId_key: { organizationId, key: "admin" } }, update: { name: "Organization admin" }, create: { organizationId, key: "admin", name: "Organization admin" } });
      const memberRole = await prisma.role.upsert({ where: { organizationId_key: { organizationId, key: "member" } }, update: { name: "Organization member" }, create: { organizationId, key: "member", name: "Organization member" } });
      await prisma.rolePermission.createMany({ data: permissions.map(({ id }) => ({ roleId: adminRole.id, permissionId: id })), skipDuplicates: true });
      await prisma.rolePermission.createMany({ data: permissions.filter(({ key }) => key === "business.read").map(({ id }) => ({ roleId: memberRole.id, permissionId: id })), skipDuplicates: true });
    }

    if (event.type === "organization.deleted") {
      await prisma.organization.deleteMany({ where: { id: String(data.id) } });
    }

    if (event.type === "organizationMembership.created" || event.type === "organizationMembership.updated") {
      const organizationId = String((data.organization as Record<string, unknown> | undefined)?.id ?? data.organization_id);
      const userId = String((data.public_user_data as Record<string, unknown> | undefined)?.user_id ?? data.public_user_id);
      const roleKey = data.role === "org:admin" ? "admin" : "member";
      const role = await prisma.role.findUnique({ where: { organizationId_key: { organizationId, key: roleKey } } });
      if (!role) throw new Error("Organization roles must be synchronized before memberships.");
      await prisma.membership.upsert({
        where: { organizationId_userId: { organizationId, userId } },
        update: { roleId: role.id },
        create: { organizationId, userId, roleId: role.id },
      });
    }

    if (event.type === "organizationMembership.deleted") {
      const organizationId = String((data.organization as Record<string, unknown> | undefined)?.id ?? data.organization_id);
      const userId = String((data.public_user_data as Record<string, unknown> | undefined)?.user_id ?? data.public_user_id);
      await prisma.membership.deleteMany({ where: { organizationId, userId } });
    }

    await prisma.clerkWebhookEvent.update({ where: { id: eventId }, data: { processedAt: new Date() } });
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook processing failed", error);
    return new Response("Invalid webhook or processing failure.", { status: 400 });
  }
}
