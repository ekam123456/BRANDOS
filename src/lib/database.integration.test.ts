import { afterAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase("PostgreSQL tenant isolation", () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl! }) });
  const organizationA = "org_integration_a";
  const organizationB = "org_integration_b";
  const userId = "user_integration_a";

  it("requires an explicit tenant context and filters tenant records", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      await tx.organization.upsert({ where: { id: organizationA }, update: {}, create: { id: organizationA, name: "Integration A" } });
    });
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationB}, true)`;
      await tx.organization.upsert({ where: { id: organizationB }, update: {}, create: { id: organizationB, name: "Integration B" } });
    });

    const visible = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      return tx.organization.findMany({ orderBy: { id: "asc" } });
    });
    expect(visible.map((organization) => organization.id)).toEqual([organizationA]);

    await expect(prisma.$transaction((tx) => tx.organization.findMany())).resolves.toEqual([]);
  });

  it("does not return another tenant's business record", async () => {
    const businessA = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      return tx.business.upsert({
        where: { organizationId: organizationA },
        update: {},
        create: { organizationId: organizationA, name: "Business A" },
      });
    });
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationB}, true)`;
      await tx.business.upsert({
        where: { organizationId: organizationB },
        update: {},
        create: { organizationId: organizationB, name: "Business B" },
      });
    });

    const visible = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      return tx.business.findMany();
    });
    expect(visible.map((business) => business.id)).toEqual([businessA.id]);
  });

  it("isolates Business Brain records and preserves onboarding provenance", async () => {
    const brainA = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      const business = await tx.business.findUniqueOrThrow({ where: { organizationId: organizationA } });
      await tx.businessProfile.upsert({
        where: { businessId: business.id },
        update: { category: "saas" },
        create: { businessId: business.id, organizationId: organizationA, category: "saas" },
      });
      await tx.businessGoal.create({
        data: {
          businessId: business.id,
          organizationId: organizationA,
          title: "Understand customer demand",
          isPrimary: true,
          sourceType: "ONBOARDING",
          knowledgeType: "FACT",
        },
      });
      return tx.product.create({
        data: {
          businessId: business.id,
          organizationId: organizationA,
          name: "Tenant A offer",
          sourceType: "ONBOARDING",
          knowledgeType: "FACT",
        },
      });
    });
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationB}, true)`;
      const business = await tx.business.findUniqueOrThrow({ where: { organizationId: organizationB } });
      await tx.product.create({ data: { businessId: business.id, organizationId: organizationB, name: "Tenant B offer" } });
    });

    const visible = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      return tx.product.findMany();
    });
    expect(visible.map((product) => product.id)).toEqual([brainA.id]);
    expect(visible[0].sourceType).toBe("ONBOARDING");
    expect(visible[0].knowledgeType).toBe("FACT");
    await expect(prisma.$transaction((tx) => tx.product.findMany())).resolves.toEqual([]);
  });

  it("enforces membership removal, permission removal, and audit persistence", async () => {
    const permission = await prisma.permission.upsert({
      where: { key: "integration.read" },
      update: {},
      create: { key: "integration.read", description: "Integration permission" },
    });
    await prisma.userAccount.upsert({ where: { id: userId }, update: {}, create: { id: userId } });
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      const role = await tx.role.upsert({
        where: { organizationId_key: { organizationId: organizationA, key: "integration" } },
        update: {},
        create: { organizationId: organizationA, key: "integration", name: "Integration" },
      });
      await tx.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
      await tx.membership.upsert({
        where: { organizationId_userId: { organizationId: organizationA, userId } },
        update: { roleId: role.id },
        create: { organizationId: organizationA, userId, roleId: role.id },
      });
      await tx.auditEvent.create({
        data: { organizationId: organizationA, actorUserId: userId, action: "integration.test", resourceType: "test", result: "success" },
      });
    });

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationA}, true)`;
      expect(await tx.membership.findUnique({ where: { organizationId_userId: { organizationId: organizationA, userId } } })).not.toBeNull();
      const membership = await tx.membership.findUnique({ where: { organizationId_userId: { organizationId: organizationA, userId } }, include: { role: true } });
      expect(membership?.role.organizationId).toBe(organizationA);
      await tx.membership.delete({ where: { organizationId_userId: { organizationId: organizationA, userId } } });
      expect(await tx.membership.findUnique({ where: { organizationId_userId: { organizationId: organizationA, userId } } })).toBeNull();
      expect(await tx.auditEvent.count({ where: { organizationId: organizationA, action: "integration.test" } })).toBe(1);
    });
  });

  afterAll(async () => {
    for (const organizationId of [organizationA, organizationB]) {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationId}, true)`;
        await tx.organization.deleteMany({ where: { id: organizationId } });
      });
    }
    await prisma.userAccount.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });
});
