# BRANDOS security and foundation review

Review scope: Stage 2 foundation commit `2cc98f0`, subsequent review fixes, current branch state, and the deployed application architecture. No Business Brain or intelligence work was started.

## Evidence checked

- Clerk provider, middleware, sign-in/sign-up routes, organization switcher, `auth()` usage, and protected routes.
- Clerk webhook signature verification, event identity, idempotency, synchronization, deletion handling, and retry behavior.
- Server-side authorization utilities, local membership/role/permission checks, tenant predicates, and the private API route.
- Prisma 7 configuration, PostgreSQL adapter/client lifecycle, schema, migration, generated-client build behavior, and environment variable handling.
- Production headers, Vercel build behavior, public/protected route behavior, dependency audit output, Git history, branch, remote, and pushed commit.
- Pure tenant-isolation tests and the complete local quality suite.

## Findings fixed during review

### MEDIUM — webhook failure could be acknowledged on retry

Before the review, the webhook inserted an event row before synchronization and treated any existing row as processed. If synchronization failed, a Clerk retry could receive `200 OK` without applying the event. The handler now:

- treats only rows with `processedAt` as complete;
- uses the signed `svix-id` header as the idempotency key;
- performs synchronization and the successful `processedAt` update in one Prisma transaction;
- returns non-2xx on processing failure so Clerk can retry.

### MEDIUM — private context API lacked local permission enforcement

The API previously checked Clerk authentication and an active organization but did not verify a synchronized BRANDOS membership or permission. It now requires `business.read` through `requirePermission`, which checks the verified Clerk organization, local composite membership, role, and permission. Errors are reduced to safe authorization messages.

## Verified controls

- Clerk signatures are verified with `verifyWebhook(request)` before webhook data is trusted.
- Webhook routes require `svix-id`, signing-secret configuration, and database configuration.
- Webhook event handling is idempotent for completed events and retryable for failed events.
- User, organization, membership create/update/delete synchronization is implemented with local Clerk IDs.
- Middleware protects `/dashboard`, `/onboarding`, and `/api/private` when Clerk is configured.
- Server authorization derives `userId` and `orgId` from `auth()`, never from a client-selected organization ID.
- Tenant mismatch is rejected by `assertTenantAccess`.
- Local permissions are enforced through a composite `(organizationId, userId)` membership lookup.
- Every currently implemented tenant-owned Prisma model has an organization-owned relationship or business-owned parent.
- No business-data write API exists yet.
- No secrets or `.env` files are committed.
- Prisma uses one cached client in development and the PostgreSQL driver adapter.
- The build runs `prisma generate` before `next build`, including on Vercel.
- The initial migration is committed and production guidance uses `prisma migrate deploy`, not `prisma db push`.

## Remaining risks and gaps

### MEDIUM — database authorization is application-enforced only

PostgreSQL row-level security is not enabled. Tenant isolation currently depends on every future service/query using the verified organization context. This is acceptable for the foundation only while the database has no broad business-data API; RLS or an equivalent defense-in-depth policy should be evaluated before high-value records are exposed.

### MEDIUM — webhook synchronization needs database integration tests

The repository has pure cross-tenant tests, but no disposable-PostgreSQL tests for webhook retries, concurrent delivery, membership revocation, or query scoping. These are required before production authentication/database activation.

### MEDIUM — audit events are schema-ready but not emitted

`AuditEvent` exists, but the current foundation does not write audit events for authorization or organization changes. Business writes must go through an audited domain service before they are introduced.

### LOW — no Content-Security-Policy

Security headers include `X-Content-Type-Options`, referrer policy, and permissions policy. A CSP is not configured. Add one after Clerk asset and font requirements are finalized; do not add a broken restrictive policy blindly.

### LOW — deployment configuration is not activated

The Vercel project has no production Clerk or PostgreSQL credentials configured in this repository context. Protected routes therefore show configuration state rather than pretending authentication is live. A real database migration has not been applied.

## Dependency advisories

`npm audit` reports advisories in the installed dependency tree:

- Prisma 7.10.0 transitively includes `deepmerge-ts` and `mysql2` advisories. The reported fixes downgrade to Prisma 6.19.3, which is a breaking major-version change and not an acceptable automatic remediation for this Prisma 7 implementation. The affected `mysql2` path is Prisma CLI/config tooling; runtime uses PostgreSQL through `@prisma/adapter-pg`.
- Next 15.5.25 transitively includes PostCSS advisories. npm reports Next 16.3.5 as the fix, which is a major upgrade requiring a separate compatibility migration. The application does not process attacker-controlled CSS/source maps at runtime.
- Vitest 3.2.7 has a development/test-tooling advisory. It is not included in production request paths.
- `npm audit fix` was run only for available non-breaking fixes. Forced major changes were not applied.

These advisories remain tracked risks, not silently ignored. Reassess Prisma and Next upgrades in a dedicated dependency-maintenance milestone with official migration testing.

## Required production environment variables

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SIGNING_SECRET
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
```

`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET`, `DATABASE_URL`, and `DIRECT_URL` must remain server-only. Use a restricted PostgreSQL role, TLS, pooled runtime connections, and a direct migration connection.

## Before production authentication/database activation

1. Configure Clerk Organizations, custom permissions, redirect URLs, and the webhook endpoint.
2. Configure Vercel environment variables without committing secrets.
3. Provision PostgreSQL with TLS and a restricted runtime role.
4. Run `npm run db:deploy` from a trusted migration job using `DIRECT_URL`.
5. Add PostgreSQL integration tests for tenant scoping, membership revocation, webhook retry/idempotency, and all private APIs.
6. Add audited domain services before creating or mutating business data.
7. Re-evaluate RLS and CSP before exposing sensitive Business Brain records.
