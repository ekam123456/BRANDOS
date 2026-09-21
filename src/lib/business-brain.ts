import "server-only";

import { z } from "zod";
import { requirePermission } from "@/lib/authorization";
import { recordAuditEventInTransaction } from "@/lib/audit";
import { withTenantTransaction } from "@/lib/prisma";

const answer = z.string().trim().max(4000).optional();

export const onboardingAnswersSchema = z.object({
  category: z.string().trim().min(1).max(80),
  name: answer,
  customer: answer,
  offer: answer,
  operations: answer,
  challenge: answer,
  idea: answer,
  problem: answer,
  assumption: answer,
  goal: answer,
  timeframe: answer,
});

export type OnboardingAnswers = z.infer<typeof onboardingAnswersSchema>;
const onboardingDraftSchema = z.object({
  step: z.string().trim().min(1).max(40),
  answers: onboardingAnswersSchema.partial(),
  questionIndex: z.number().int().min(0).max(100),
});

function present(value: string | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

export async function completeOnboarding(rawAnswers: unknown, requestId?: string) {
  const { userId, organizationId } = await requirePermission("business.write");
  const answers = onboardingAnswersSchema.parse(rawAnswers);

  return withTenantTransaction(organizationId, async (tx) => {
    const business = await tx.business.upsert({
      where: { organizationId },
      update: { name: present(answers.name) ?? "My business" },
      create: { organizationId, name: present(answers.name) ?? "My business" },
    });

    const isIdea = answers.category === "idea";
    const profile = await tx.businessProfile.upsert({
      where: { businessId: business.id },
      update: {
        organizationId,
        category: answers.category,
        description: present(answers.offer),
        currentChallenges: present(answers.challenge),
        industry: present(answers.category),
        targetCustomer: present(answers.customer),
        idea: isIdea ? present(answers.idea) : undefined,
        problem: isIdea ? present(answers.problem) : undefined,
        proposedSolution: isIdea ? present(answers.offer) : undefined,
        assumptions: isIdea ? present(answers.assumption) : undefined,
        openQuestions: isIdea ? present(answers.assumption) : undefined,
      },
      create: {
        businessId: business.id,
        organizationId,
        category: answers.category,
        description: present(answers.offer),
        currentChallenges: present(answers.challenge),
        industry: present(answers.category),
        targetCustomer: present(answers.customer),
        idea: isIdea ? present(answers.idea) : undefined,
        problem: isIdea ? present(answers.problem) : undefined,
        proposedSolution: isIdea ? present(answers.offer) : undefined,
        assumptions: isIdea ? present(answers.assumption) : undefined,
        openQuestions: isIdea ? present(answers.assumption) : undefined,
      },
    });

    let goal = null;
    const goalTitle = present(answers.goal);
    if (goalTitle) {
      await tx.businessGoal.updateMany({
        where: { businessId: business.id, organizationId, isPrimary: true },
        data: { isPrimary: false },
      });
      goal = await tx.businessGoal.create({
        data: {
          businessId: business.id,
          organizationId,
          title: goalTitle,
          timeframe: present(answers.timeframe),
          isPrimary: true,
          priority: 1,
          sourceType: "ONBOARDING",
          knowledgeType: "FACT",
        },
      });
    }

    await tx.onboardingProgress.upsert({
      where: { organizationId },
      update: { step: "complete", draft: answers, completedAt: new Date() },
      create: { organizationId, step: "complete", draft: answers, completedAt: new Date() },
    });

    await recordAuditEventInTransaction(tx, {
      organizationId,
      actorUserId: userId,
      action: "onboarding.completed",
      resourceType: "Business",
      resourceId: business.id,
      requestId,
      metadata: { category: answers.category, profileId: profile.id, goalCreated: Boolean(goal) },
    });

    return { business, profile, goal };
  });
}

export async function getBusinessBrain() {
  const { organizationId } = await requirePermission("business.read");
  return withTenantTransaction(organizationId, (tx) => tx.business.findUnique({
    where: { organizationId },
    include: {
      profile: true,
      goals: { orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }] },
      products: { orderBy: { id: "desc" }, take: 50 },
      services: { orderBy: { id: "desc" }, take: 50 },
      customerSegments: { orderBy: { id: "desc" }, take: 50 },
      competitors: { orderBy: { id: "desc" }, take: 50 },
      metrics: { orderBy: { measuredAt: "desc" }, take: 50 },
      observations: { orderBy: { collectedAt: "desc" }, take: 50 },
      problems: { orderBy: { id: "desc" }, take: 50 },
      opportunities: { orderBy: { id: "desc" }, take: 50 },
      recommendations: { orderBy: { id: "desc" }, take: 50 },
      tasks: { orderBy: { id: "desc" }, take: 50 },
    },
  }));
}

export async function saveOnboardingDraft(rawDraft: unknown) {
  const { userId, organizationId } = await requirePermission("business.write");
  const draft = onboardingDraftSchema.parse(rawDraft);
  return withTenantTransaction(organizationId, async (tx) => {
    const progress = await tx.onboardingProgress.upsert({
      where: { organizationId },
      update: { step: draft.step, draft: draft.answers },
      create: { organizationId, step: draft.step, draft: draft.answers },
    });
    await recordAuditEventInTransaction(tx, {
      organizationId,
      actorUserId: userId,
      action: "onboarding.draft_saved",
      resourceType: "OnboardingProgress",
      resourceId: progress.id,
    });
    return progress;
  });
}

export async function getOnboardingProgress() {
  const { organizationId } = await requirePermission("business.read");
  return withTenantTransaction(organizationId, (tx) => tx.onboardingProgress.findUnique({ where: { organizationId } }));
}
