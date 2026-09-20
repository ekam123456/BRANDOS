# BRANDOS public website

Stage 1 of a Business Operating System: a production-minded public website that explains the product concept without pretending the backend exists.

## Getting started

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` when deploying. Brand, color tokens, feature flags and domain configuration live in `src/config/brand.ts`.

## Route boundary

The marketing site is currently the only implemented experience. Future application routes are intentionally not built yet: `/dashboard`, `/business`, `/intelligence`, `/tasks`, `/agents`, `/automations`, `/analytics`, `/integrations`, `/settings`, `/security`, and `/billing` belong to Stage 2 and should receive real authentication and tenancy boundaries before implementation.

## Truth in marketing

Conceptual interface examples are labeled as illustrative. Integrations and autonomy are described as planned architectural capabilities. No customer, revenue, usage, or performance claims are made.
