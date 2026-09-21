# BRANDOS database foundation

BRANDOS uses PostgreSQL as the source of truth for application and business data and Prisma ORM 7 for typed access and migrations.

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

The hardening migration enables and forces PostgreSQL RLS on organization, membership, role, business, business child, audit, brand configuration, and role-permission tables. Policies compare direct `organizationId` values to the transaction-local `app.current_organization_id` setting. Application code establishes that setting with `withTenantTransaction`; the setting is local to one interactive Prisma transaction and cannot leak to a pooled connection. Application authorization remains mandatory: RLS is defense in depth, not a replacement for Clerk session and permission checks. The webhook uses `SYSTEM_DATABASE_URL` because synchronization must create and update records before a request tenant exists; that role must be explicitly controlled and never used for user-request data.

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
