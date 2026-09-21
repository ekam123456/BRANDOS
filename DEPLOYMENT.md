# BRANDOS deployment

## Public website

The Stage 1 marketing site is deployed to Vercel. Public routes do not require Clerk or PostgreSQL credentials.

## Stage 2 environment

Configure these server-side values in the deployment provider:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`

Set Clerk sign-in/sign-up redirect variables to `/dashboard` and `/onboarding` as shown in `.env.example`.

Run `npm run db:deploy` from a trusted deployment job using `DIRECT_URL`. Never run migrations inside a request handler and never use `prisma db push` for production.
