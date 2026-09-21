# BRANDOS application architecture

## Stage 2 foundation

The public marketing site remains the default surface. Protected product routes live under `/dashboard`, `/onboarding`, and `/api/private`.

```text
Clerk identity/session
        |
        | verified userId + active orgId
        v
BRANDOS authorization boundary
        |
        | tenant-scoped queries
        v
PostgreSQL via Prisma
        |
        v
Organization -> Business -> business-owned records
```

Clerk owns authentication, sessions, organization membership, and authentication-level roles. PostgreSQL owns BRANDOS application data. The local `UserAccount`, `Organization`, and `Membership` records store Clerk IDs and application-owned authorization/business relationships; they are synchronized by verified Clerk webhooks.

Every protected operation must derive the active organization from `auth()` and include that organization in its server-side authorization and database predicates. A client-provided organization ID is never trusted by itself.

## Implemented boundaries

- `middleware.ts` protects product routes when Clerk is configured.
- `src/lib/auth.ts` provides authenticated organization context and a pure tenant-isolation guard.
- `src/lib/authorization.ts` checks local membership and application permissions.
- `src/lib/prisma.ts` creates one Prisma 7 client with the PostgreSQL driver adapter.
- `/api/webhooks/clerk` verifies Clerk webhook signatures and idempotently synchronizes users, organizations, memberships, and deletions.
- `/dashboard` is a protected product shell with organization switching.
- `/onboarding` is a protected organization setup entry point. It does not invent business data or intelligence.

## Deliberate boundaries

The database schema currently includes only the foundation needed for identity, tenancy, authorization, business setup, and audit readiness. Intelligence, recommendations, tasks, agents, integrations, billing, and analytics remain later milestones.
