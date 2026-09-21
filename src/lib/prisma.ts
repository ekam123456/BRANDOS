import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; systemPrisma?: PrismaClient };

function createClient(connectionString: string) {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database-backed Stage 2 features.");
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const prisma = createClient(connectionString);
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
  return prisma;
}

export function getSystemPrisma(): PrismaClient {
  const connectionString = process.env.SYSTEM_DATABASE_URL;
  if (!connectionString) {
    throw new Error("SYSTEM_DATABASE_URL is required for synchronization and system operations.");
  }
  if (globalForPrisma.systemPrisma) {
    return globalForPrisma.systemPrisma;
  }
  const prisma = createClient(connectionString);
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.systemPrisma = prisma;
  }
  return prisma;
}

export async function withTenantTransaction<T>(
  organizationId: string,
  operation: (tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0]) => Promise<T>,
) {
  return getPrisma().$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationId}, true)`;
    return operation(tx);
  });
}
