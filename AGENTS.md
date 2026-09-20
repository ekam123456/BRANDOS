# BRANDOS engineering rules

## Stage boundary
Stage 1 is the public marketing website. Do not build authenticated Business OS behavior, fake integrations, fake customer data, or simulated business results into this stage. Stage 2 will introduce authentication, tenancy, persistence, intelligence workflows, agents, approvals, and integrations behind explicit boundaries.

## Product truth
Never invent metrics, customers, testimonials, integrations, security guarantees, pricing, or implementation status. Label conceptual UI as illustrative and planned capabilities as planned.

## Architecture
- Keep brand identity in `src/config/brand.ts`; components must consume configuration rather than hard-code a final product name.
- Keep content/data separate from presentation in `src/data`.
- Use semantic HTML, keyboard-accessible controls, responsive layouts, and descriptive metadata.
- Use server components by default; add client components only for interaction.
- Never expose secrets or commit `.env` files.

## Quality gates
Before committing: run `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Review responsive behavior, links, accessibility, and the git diff. Update documentation when architectural decisions change.
