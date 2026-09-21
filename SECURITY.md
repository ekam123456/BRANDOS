# BRANDOS security foundation

## Status

- **IMPLEMENTED:** Clerk middleware, server authorization, tenant transaction context, forced-RLS migration, webhook signature verification/idempotency, audit service, security headers, and CI checks.
- **VERIFIED:** Static code review, schema validation, unit tests, build, and public HTTPS header inspection.
- **DEPLOYMENT-GATED:** Real PostgreSQL RLS execution, Clerk production webhook signatures/retries, private API authorization against production configuration, and provider role/SSL settings.
- **DEFERRED:** Rate limiting, backup/restore drills, agent permissions, integrations, billing controls, and business-data audit coverage.

## Authentication and authorization

Clerk provides identity, sessions, sign-in, sign-up, and organization context. Clerk UI visibility is never treated as authorization. Server code checks the session and local BRANDOS membership before accessing protected data.

The active organization comes from the verified Clerk session. A request for a different organization is rejected by `assertTenantAccess`, and tenant-owned database queries must include the verified organization ID.

After the foundation hardening migration is deployed, PostgreSQL forced row-level security provides defense in depth on tenant-owned tables. Request data access must use the server-side tenant transaction helper, which sets a transaction-local organization context, and must still pass Clerk membership and local permission checks. Clerk synchronization uses a separately controlled system database role that is not available to request handlers.

## Webhooks

`/api/webhooks/clerk` is public by design and accepts only verified Clerk webhook requests. It records event IDs before processing to make retries idempotent, handles user/organization/membership changes, and returns non-2xx responses for invalid or failed processing so Clerk can retry.

## Secrets and validation

Clerk secret keys, webhook signing secrets, and database URLs are server-only environment variables. No `.env` files are committed. Route handlers must validate input with Zod before adding write operations. Errors should not disclose credentials or database details.

## Required security tests

The foundation includes pure cross-tenant rejection tests and a real PostgreSQL suite at `npm run test:integration`. CI provisions PostgreSQL and a non-bypass-RLS role before running it. Cross-tenant access remains release-blocking.

The current code has no SSRF-capable fetcher, no user-controlled raw SQL, no agent execution surface, and no business write route. CSRF risk is limited by the current read-only private route and Clerk’s session model; state-changing routes must add same-origin/CSRF protection before implementation. Error logs contain generic webhook errors only; secrets and request bodies are not logged.
