CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'CONNECTED', 'SYNCING', 'ERROR', 'EXPIRED', 'DISCONNECTED');
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

CREATE TABLE "Connection" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
  "accountReference" TEXT,
  "scopes" JSONB,
  "metadata" JSONB,
  "credentialCiphertext" TEXT,
  "credentialNonce" TEXT,
  "credentialTag" TEXT,
  "lastSuccessfulSync" TIMESTAMP(3),
  "lastAttemptedSync" TIMESTAMP(3),
  "errorCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Connection_organizationId_businessId_provider_key" ON "Connection"("organizationId", "businessId", "provider");
CREATE INDEX "Connection_organizationId_status_idx" ON "Connection"("organizationId", "status");
CREATE INDEX "Connection_businessId_idx" ON "Connection"("businessId");
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "OAuthState" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "stateHash" TEXT NOT NULL,
  "codeVerifier" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OAuthState_stateHash_key" ON "OAuthState"("stateHash");
CREATE INDEX "OAuthState_organizationId_expiresAt_idx" ON "OAuthState"("organizationId", "expiresAt");
ALTER TABLE "OAuthState" ADD CONSTRAINT "OAuthState_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OAuthState" ADD CONSTRAINT "OAuthState_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SyncRun" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "connectionId" TEXT NOT NULL,
  "status" "SyncStatus" NOT NULL DEFAULT 'RUNNING',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
  "recordsCreated" INTEGER NOT NULL DEFAULT 0,
  "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
  "errorCode" TEXT,
  "providerRequestReference" TEXT,
  CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SyncRun_organizationId_startedAt_idx" ON "SyncRun"("organizationId", "startedAt");
CREATE INDEX "SyncRun_connectionId_startedAt_idx" ON "SyncRun"("connectionId", "startedAt");
ALTER TABLE "SyncRun" ADD CONSTRAINT "SyncRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SyncRun" ADD CONSTRAINT "SyncRun_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "IngestedRecord" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "connectionId" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "recordType" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "sourceType" "SourceType" NOT NULL,
  "sourceReference" TEXT,
  "observedAt" TIMESTAMP(3),
  "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "freshness" TEXT,
  CONSTRAINT "IngestedRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "IngestedRecord_connectionId_recordType_externalId_key" ON "IngestedRecord"("connectionId", "recordType", "externalId");
CREATE INDEX "IngestedRecord_organizationId_collectedAt_idx" ON "IngestedRecord"("organizationId", "collectedAt");
CREATE INDEX "IngestedRecord_businessId_recordType_idx" ON "IngestedRecord"("businessId", "recordType");
ALTER TABLE "IngestedRecord" ADD CONSTRAINT "IngestedRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestedRecord" ADD CONSTRAINT "IngestedRecord_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IngestedRecord" ADD CONSTRAINT "IngestedRecord_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Connection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Connection" FORCE ROW LEVEL SECURITY;
ALTER TABLE "OAuthState" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OAuthState" FORCE ROW LEVEL SECURITY;
ALTER TABLE "SyncRun" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SyncRun" FORCE ROW LEVEL SECURITY;
ALTER TABLE "IngestedRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IngestedRecord" FORCE ROW LEVEL SECURITY;

CREATE POLICY connection_tenant_isolation ON "Connection" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY oauth_state_tenant_isolation ON "OAuthState" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY sync_run_tenant_isolation ON "SyncRun" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY ingested_record_tenant_isolation ON "IngestedRecord" USING ("organizationId" = current_setting('app.current_organization_id', true));
