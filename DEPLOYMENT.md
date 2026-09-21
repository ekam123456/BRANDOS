# BRANDOS deployment

## Status

- **IMPLEMENTED:** Vercel project linkage, HTTPS public deployment, Prisma migration workflow, Clerk middleware/CSP configuration, and CI workflow.
- **VERIFIED:** The public deployment currently responds over HTTPS. The inspected live revision returned HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- **DEPLOYMENT-GATED:** Production Clerk, PostgreSQL, RLS migration, webhook delivery, and private API behavior.
- **DEFERRED:** Business Brain, intelligence, agents, integrations, analytics, billing, rate limiting, and production backup automation.

## Public website

The Stage 1 marketing site is deployed to Vercel. Public routes do not require Clerk or PostgreSQL credentials.

## Stage 2 environment

Configure these server-side values in the deployment provider:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`
- `SYSTEM_DATABASE_URL`
- `TEST_DATABASE_URL` (test/staging only; never production)

Set Clerk sign-in/sign-up redirect variables to `/dashboard` and `/onboarding` as shown in `.env.example`. The Clerk production instance must have Organizations enabled and a webhook pointed at `/api/webhooks/clerk` with organization, organization membership, and user events enabled. The signing secret must match the endpoint and must never be placed in a `NEXT_PUBLIC_*` variable.

`DATABASE_URL` must be a TLS pooled connection used by request handlers. `DIRECT_URL` must be a TLS direct connection used only by migration jobs. `SYSTEM_DATABASE_URL` must use a separately controlled non-request system role for Clerk synchronization. The runtime role must be `NOSUPERUSER`, `NOBYPASSRLS`, and must not own the application tables. Provisioning and role grants are provider-specific and must be performed in the database provider console or an approved migration job; this repository does not contain credentials or database identifiers.

Production Clerk is fail-closed: both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required before protected routes are served. Clerk-managed session cookies must remain secure, HTTP-only, and same-site according to the Clerk production configuration. Next production browser source maps are explicitly disabled.

The CI workflow creates an isolated PostgreSQL service and a `NOSUPERUSER NOBYPASSRLS` test role, applies migrations, and runs the integration suite. A local or staging run requires an isolated `TEST_DATABASE_URL`; the repository does not currently have a disposable provider credential configured.

Run `npm run db:deploy` from a trusted deployment job using `DIRECT_URL`. Never run migrations inside a request handler and never use `prisma db push` for production.

Before production activation, verify the deployment's response headers with `curl -I`, run the integration suite against the staging database, inspect `pg_roles`/table ownership, confirm Clerk webhook retries and deletion events, and validate backups and restore procedures with the database provider. Do not claim production readiness from the CI build alone.
