# BRANDOS database foundation

BRANDOS uses PostgreSQL as the source of truth for application and business data and Prisma ORM 7 for typed access and migrations.

## Connection policy

- `DATABASE_URL` is the pooled runtime connection.
- `DIRECT_URL` is the direct migration connection.
- Both values are server-only and must never be exposed through `NEXT_PUBLIC_*`.
- Production uses `npm run db:deploy`; `prisma db push` is not a production workflow.
- The runtime database role should be a restricted non-superuser and remote connections must use TLS.

## Tenant model

`Organization.id` is the Clerk `org_*` identifier. `UserAccount.id` is the Clerk `user_*` identifier. `Membership` joins the two and points to a local role. `Business.organizationId` is unique so the current foundation represents one business workspace per organization while leaving room for future agency-level models.

All future tenant-owned tables must carry `organizationId` directly or be reachable through a tenant-owned parent, and all service queries must scope by the verified organization context.

## Migrations

The initial foundation migration is in `prisma/migrations/20260921120000_stage2_foundation`. Run it only after configuring a real PostgreSQL database:

```bash
npm run db:deploy
```
