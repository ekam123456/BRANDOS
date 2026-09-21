CREATE TYPE "KnowledgeType" AS ENUM ('FACT', 'OBSERVATION', 'ASSUMPTION', 'HYPOTHESIS', 'DECISION', 'OUTCOME');
CREATE TYPE "SourceType" AS ENUM ('USER', 'ONBOARDING', 'WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'GOOGLE_ANALYTICS', 'GOOGLE_SEARCH_CONSOLE', 'GOOGLE_ADS', 'META_ADS', 'SHOPIFY', 'STRIPE', 'CRM', 'EMAIL', 'RESEARCH', 'SYSTEM');

ALTER TABLE "BusinessProfile"
  ADD COLUMN "category" TEXT,
  ADD COLUMN "niche" TEXT,
  ADD COLUMN "businessType" TEXT,
  ADD COLUMN "businessStage" TEXT,
  ADD COLUMN "location" TEXT,
  ADD COLUMN "operatingMarket" TEXT,
  ADD COLUMN "businessModel" TEXT,
  ADD COLUMN "targetMarket" TEXT,
  ADD COLUMN "primaryChannels" JSONB,
  ADD COLUMN "currentChallenges" TEXT,
  ADD COLUMN "resourcesContext" TEXT,
  ADD COLUMN "launchInformation" TEXT,
  ADD COLUMN "idea" TEXT,
  ADD COLUMN "targetCustomer" TEXT,
  ADD COLUMN "problem" TEXT,
  ADD COLUMN "proposedSolution" TEXT,
  ADD COLUMN "assumptions" TEXT,
  ADD COLUMN "openQuestions" TEXT;

ALTER TABLE "BusinessGoal"
  ADD COLUMN "goalType" TEXT,
  ADD COLUMN "target" TEXT,
  ADD COLUMN "timeframe" TEXT,
  ADD COLUMN "priority" INTEGER,
  ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "sourceType" "SourceType" NOT NULL DEFAULT 'ONBOARDING',
  ADD COLUMN "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT';

CREATE TABLE "OnboardingProgress" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "step" TEXT NOT NULL,
  "draft" JSONB NOT NULL,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OnboardingProgress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OnboardingProgress_organizationId_key" ON "OnboardingProgress"("organizationId");
CREATE INDEX "OnboardingProgress_organizationId_idx" ON "OnboardingProgress"("organizationId");
ALTER TABLE "OnboardingProgress" ADD CONSTRAINT "OnboardingProgress_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Product" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "description" TEXT, "category" TEXT, "price" TEXT, "status" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT, "confidence" TEXT,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Product_organizationId_idx" ON "Product"("organizationId");
CREATE INDEX "Product_businessId_idx" ON "Product"("businessId");
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Service" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "description" TEXT, "category" TEXT, "price" TEXT, "status" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT, "confidence" TEXT,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Service_organizationId_idx" ON "Service"("organizationId");
CREATE INDEX "Service_businessId_idx" ON "Service"("businessId");
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CustomerSegment" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "description" TEXT, "needsProblems" TEXT, "characteristics" TEXT, "acquisitionContext" TEXT, "priority" INTEGER,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT, "confidence" TEXT,
  CONSTRAINT "CustomerSegment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CustomerSegment_organizationId_idx" ON "CustomerSegment"("organizationId");
CREATE INDEX "CustomerSegment_businessId_idx" ON "CustomerSegment"("businessId");
ALTER TABLE "CustomerSegment" ADD CONSTRAINT "CustomerSegment_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerSegment" ADD CONSTRAINT "CustomerSegment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Competitor" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "website" TEXT, "description" TEXT, "context" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT, "confidence" TEXT,
  CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Competitor_organizationId_idx" ON "Competitor"("organizationId");
CREATE INDEX "Competitor_businessId_idx" ON "Competitor"("businessId");
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "BusinessMetric" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "value" TEXT, "unit" TEXT, "period" TEXT, "source" TEXT, "measuredAt" TIMESTAMP(3), "freshness" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'FACT',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "confidence" TEXT,
  CONSTRAINT "BusinessMetric_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BusinessMetric_organizationId_idx" ON "BusinessMetric"("organizationId");
CREATE INDEX "BusinessMetric_businessId_idx" ON "BusinessMetric"("businessId");
ALTER TABLE "BusinessMetric" ADD CONSTRAINT "BusinessMetric_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessMetric" ADD CONSTRAINT "BusinessMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Observation" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "evidence" TEXT, "status" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'OBSERVATION',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT, "confidence" TEXT,
  CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Observation_organizationId_idx" ON "Observation"("organizationId");
CREATE INDEX "Observation_businessId_idx" ON "Observation"("businessId");
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Problem" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "observationId" TEXT, "goalId" TEXT, "title" TEXT NOT NULL, "description" TEXT, "evidence" TEXT, "status" TEXT, "confidence" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'OBSERVATION',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT,
  CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Problem_organizationId_idx" ON "Problem"("organizationId");
CREATE INDEX "Problem_businessId_idx" ON "Problem"("businessId");
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "BusinessGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Opportunity" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "observationId" TEXT, "problemId" TEXT, "goalId" TEXT, "title" TEXT NOT NULL, "description" TEXT, "evidence" TEXT, "status" TEXT, "confidence" TEXT,
  "sourceType" "SourceType" NOT NULL DEFAULT 'USER', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'HYPOTHESIS',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT,
  CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Opportunity_organizationId_idx" ON "Opportunity"("organizationId");
CREATE INDEX "Opportunity_businessId_idx" ON "Opportunity"("businessId");
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "BusinessGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Recommendation" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "observationId" TEXT, "problemId" TEXT, "opportunityId" TEXT, "goalId" TEXT, "title" TEXT NOT NULL, "description" TEXT, "reason" TEXT, "evidence" TEXT, "expectedOutcome" TEXT, "status" TEXT, "confidence" TEXT, "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
  "sourceType" "SourceType" NOT NULL DEFAULT 'SYSTEM', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'HYPOTHESIS',
  "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT,
  CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Recommendation_organizationId_idx" ON "Recommendation"("organizationId");
CREATE INDEX "Recommendation_businessId_idx" ON "Recommendation"("businessId");
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "BusinessGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Task" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "recommendationId" TEXT, "title" TEXT NOT NULL, "description" TEXT, "reason" TEXT, "evidence" TEXT, "impact" TEXT, "effort" TEXT, "urgency" TEXT, "confidence" TEXT, "ownerUserId" TEXT, "deadline" TIMESTAMP(3), "expectedOutcome" TEXT, "approvalRequired" BOOLEAN NOT NULL DEFAULT false, "status" TEXT NOT NULL DEFAULT 'SUGGESTED', "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  "sourceType" "SourceType" NOT NULL DEFAULT 'SYSTEM', "knowledgeType" "KnowledgeType" NOT NULL DEFAULT 'HYPOTHESIS', "sourceReference" TEXT, "collectedAt" TIMESTAMP(3), "freshness" TEXT,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");
CREATE INDEX "Task_businessId_idx" ON "Task"("businessId");
ALTER TABLE "Task" ADD CONSTRAINT "Task_businessId_organizationId_fkey" FOREIGN KEY ("businessId", "organizationId") REFERENCES "Business"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OnboardingProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingProgress" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" FORCE ROW LEVEL SECURITY;
ALTER TABLE "CustomerSegment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerSegment" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Competitor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Competitor" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BusinessMetric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessMetric" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Observation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Observation" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Problem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Problem" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Opportunity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Opportunity" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Recommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Recommendation" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" FORCE ROW LEVEL SECURITY;

CREATE POLICY onboarding_progress_tenant_isolation ON "OnboardingProgress" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY product_tenant_isolation ON "Product" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY service_tenant_isolation ON "Service" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY customer_segment_tenant_isolation ON "CustomerSegment" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY competitor_tenant_isolation ON "Competitor" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY business_metric_tenant_isolation ON "BusinessMetric" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY observation_tenant_isolation ON "Observation" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY problem_tenant_isolation ON "Problem" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY opportunity_tenant_isolation ON "Opportunity" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY recommendation_tenant_isolation ON "Recommendation" USING ("organizationId" = current_setting('app.current_organization_id', true));
CREATE POLICY task_tenant_isolation ON "Task" USING ("organizationId" = current_setting('app.current_organization_id', true));
