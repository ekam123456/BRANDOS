# BRANDOS database foundation

BRANDOS uses PostgreSQL as the source of truth for application and business data and Prisma ORM 7 for typed access and migrations.

## Status

- **IMPLEMENTED:** Prisma 7 PostgreSQL adapter, migrations, forced-RLS policies, tenant transaction helper, CI PostgreSQL service, and the Business Brain persistence model.
- **IMPLEMENTED:** Connection, OAuth state, sync-run, and normalized ingested-record tables with direct tenant ownership and forced RLS.
- **VERIFIED:** Schema validation, client generation, migration SQL review, and unit/build checks.
- **DEPLOYMENT-GATED:** Applying the hardening migration to a real staging database and executing integration tests with a non-superuser/non-BYPASSRLS role.
- **DEFERRED:** Production backup/restore execution, connection pool sizing, and provider-specific failover testing.

## Connection policy

- `DATABASE_URL` is the pooled runtime connection.
- `DIRECT_URL` is the direct migration connection.
- `SYSTEM_DATABASE_URL` is a separate restricted system connection used only by Clerk synchronization. It must not be exposed to request handlers.
- `TEST_DATABASE_URL` is an opt-in disposable PostgreSQL connection used by `npm run test:integration`.
- Both values are server-only and must never be exposed through `NEXT_PUBLIC_*`.
- Production uses `npm run db:deploy`; `prisma db push` is not a production workflow.
- The runtime database role should be a restricted non-superuser and remote connections must use TLS.

## Tenant model

`Organization.id` is the Clerk `org_*` identifier. `UserAccount.id` is the Clerk `user_*` identifier. `Membership` joins the two and points to a local role. `Business.organizationId` is unique so the current foundation represents one business workspace per organization while leaving room for future agency-level models.

All future tenant-owned tables must carry `organizationId` directly or be reachable through a tenant-owned parent, and all service queries must scope by the verified organization context.

## Business Brain model

The Business Brain foundation stores user-provided business context in `BusinessProfile`, `BusinessGoal`, `Product`, `Service`, `CustomerSegment`, and `Competitor`. `BusinessMetric`, `Observation`, `Problem`, `Opportunity`, `Recommendation`, and `Task` are persistence boundaries for real evidence and future modules; this milestone does not generate any of those records automatically. Brain records carry `SourceType` and `KnowledgeType` plus optional source, freshness, and confidence fields. Empty values remain unknown rather than becoming zero or fabricated text.

Completing onboarding upserts one organization-owned `Business`, stores the supplied profile fields, creates the selected primary goal, and marks `OnboardingProgress` complete. The source is recorded as `ONBOARDING`; the request must pass Clerk authentication, local membership, `business.write`, composite business ownership, and a tenant transaction. Important changes produce an `AuditEvent`.

The hardening migration enables and forces PostgreSQL RLS on organization, membership, role, business, business child, audit, brand configuration, and role-permission tables. Policies compare direct `organizationId` values to the transaction-local `app.current_organization_id` setting. Application code establishes that setting with `withTenantTransaction`; the setting is local to one interactive Prisma transaction and cannot leak to a pooled connection. Application authorization remains mandatory: RLS is defense in depth, not a replacement for Clerk session and permission checks. The webhook uses `SYSTEM_DATABASE_URL` because synchronization must create and update records before a request tenant exists; that role must be explicitly controlled and never used for user-request data.

The Business Brain migration applies the same forced-RLS policy to onboarding progress and every direct organization-owned Brain table. CI verifies the new product and provenance records are invisible without tenant context and across organizations using the non-bypass test role.

The connections migration applies the same policy to `Connection`, `OAuthState`, `SyncRun`, and `IngestedRecord`. Provider credentials are encrypted ciphertext only; the database never receives a plaintext token.

Do not claim database isolation is active until the hardening migration has been deployed with `npm run db:deploy` and the integration suite has run against PostgreSQL with `TEST_DATABASE_URL`.

## Migrations

The initial foundation migration is in `prisma/migrations/20260921120000_stage2_foundation`. Run it only after configuring a real PostgreSQL database:

```bash
npm run db:deploy
```

For real database integration tests:

```bash
TEST_DATABASE_URL='postgresql://...' npm run db:deploy
TEST_DATABASE_URL='postgresql://...' npm run test:integration
```

The integration suite is intentionally skipped, with no success claim, when `TEST_DATABASE_URL` is absent. Docker is not required by the repository, but the configured test URL must point to an isolated PostgreSQL database.

The CI workflow is the currently supported disposable environment: PostgreSQL 16 runs as a GitHub Actions service, migrations run as the database administrator, and tests connect through a separately created `NOSUPERUSER NOBYPASSRLS` role. Never point `TEST_DATABASE_URL` at production or a shared database.
