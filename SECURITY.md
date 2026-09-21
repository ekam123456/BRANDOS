# BRANDOS security foundation

## Authentication and authorization

Clerk provides identity, sessions, sign-in, sign-up, and organization context. Clerk UI visibility is never treated as authorization. Server code checks the session and local BRANDOS membership before accessing protected data.

The active organization comes from the verified Clerk session. A request for a different organization is rejected by `assertTenantAccess`, and tenant-owned database queries must include the verified organization ID.

## Webhooks

`/api/webhooks/clerk` is public by design and accepts only verified Clerk webhook requests. It records event IDs before processing to make retries idempotent, handles user/organization/membership changes, and returns non-2xx responses for invalid or failed processing so Clerk can retry.

## Secrets and validation

Clerk secret keys, webhook signing secrets, and database URLs are server-only environment variables. No `.env` files are committed. Route handlers must validate input with Zod before adding write operations. Errors should not disclose credentials or database details.

## Required security tests

The foundation includes pure cross-tenant rejection tests. Before enabling business writes, add integration tests against a disposable PostgreSQL database for authenticated access, unauthenticated access, membership/role checks, direct API authorization, and every tenant-scoped query. Cross-tenant access remains release-blocking.
