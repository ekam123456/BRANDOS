ALTER TABLE "BusinessProfile" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "BusinessGoal" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "AuditEvent" ADD COLUMN "result" TEXT NOT NULL DEFAULT 'success';
ALTER TABLE "AuditEvent" ADD COLUMN "requestId" TEXT;

UPDATE "BusinessProfile" AS profile
SET "organizationId" = business."organizationId"
FROM "Business" AS business
WHERE business.id = profile."businessId";

UPDATE "BusinessGoal" AS goal
SET "organizationId" = business."organizationId"
FROM "Business" AS business
WHERE business.id = goal."businessId";

ALTER TABLE "BusinessProfile" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "BusinessGoal" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "BusinessProfile_organizationId_idx" ON "BusinessProfile"("organizationId");
CREATE INDEX "BusinessGoal_organizationId_idx" ON "BusinessGoal"("organizationId");
CREATE UNIQUE INDEX "BusinessProfile_businessId_organizationId_key" ON "BusinessProfile"("businessId", "organizationId");
CREATE UNIQUE INDEX "Business_id_organizationId_key" ON "Business"("id", "organizationId");
ALTER TABLE "BusinessProfile" DROP CONSTRAINT "BusinessProfile_businessId_fkey";
ALTER TABLE "BusinessGoal" DROP CONSTRAINT "BusinessGoal_businessId_fkey";
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessGoal" ADD CONSTRAINT "BusinessGoal_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessGoal" ADD CONSTRAINT "BusinessGoal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Business" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BusinessProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessProfile" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BusinessGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessGoal" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BrandConfiguration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BrandConfiguration" FORCE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" FORCE ROW LEVEL SECURITY;

CREATE POLICY organization_tenant_isolation ON "Organization"
  USING (id = current_setting('app.current_organization_id', true));
CREATE POLICY membership_tenant_isolation ON "Membership"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY role_tenant_isolation ON "Role"
  USING ("organizationId" = current_setting('app.current_organization_id', true) OR "organizationId" IS NULL);
CREATE POLICY role_permission_tenant_isolation ON "RolePermission"
  USING (EXISTS (
    SELECT 1 FROM "Role" role
    WHERE role.id = "RolePermission"."roleId"
      AND (role."organizationId" = current_setting('app.current_organization_id', true) OR role."organizationId" IS NULL)
  ));
CREATE POLICY business_tenant_isolation ON "Business"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY business_profile_tenant_isolation ON "BusinessProfile"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY business_goal_tenant_isolation ON "BusinessGoal"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY audit_event_tenant_isolation ON "AuditEvent"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY brand_configuration_tenant_isolation ON "BrandConfiguration"
  USING ("organizationId" = current_setting('app.current_organization_id', true));
