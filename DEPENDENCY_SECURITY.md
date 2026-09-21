# Dependency security review

Reviewed 2026-09-21 against the installed lockfile, `npm audit`, and the current package versions. No major-version migration was applied solely to make the audit output green.

| Advisory area | Package | Severity | Runtime | Exploitability and mitigation | Remediation |
|---|---|---:|---|---|---|
| Recursive merge stack exhaustion | `deepmerge-ts` via Prisma | High | Production dependency tree | Requires attacker-controlled deeply nested merge input reaching the vulnerable helper. BRANDOS does not expose this helper directly and currently has no business-data mutation surface. | Keep Prisma 7. Track the upstream fix and reassess before enabling broad user-supplied JSON. Target: dependency maintenance milestone. |
| MySQL auth downgrade / decompression bomb | `mysql2` via Prisma | High | Transitive, not used at runtime | BRANDOS uses PostgreSQL and `@prisma/adapter-pg`; the MySQL driver is not loaded by the application. | Do not downgrade Prisma to 6.19.3. Reassess when Prisma publishes a compatible Prisma 7 dependency update. Target: dependency maintenance milestone. |
| PostCSS CSS XSS, source-map disclosure, and path traversal | Next.js dependency tree | High | Production build/runtime depending on affected path | The site does not accept user CSS or serve attacker-controlled source maps. Next 16 is the npm suggested remediation but is a major migration. | Remain on tested Next 15.5.25; apply the next compatible patched Next 15 release and separately test Next 16. Target: framework upgrade milestone. |
| `@vitest/mocker` advisory | Vitest | Medium | Development/test only | Not shipped in the production bundle or runtime server. | Upgrade within the Vitest major when a compatible fix is available. Target: developer tooling maintenance. |

`sharp` was updated by the prior non-breaking audit fix. Dependency advisories are not a substitute for application authorization, RLS deployment, or integration testing. Re-run `npm audit --omit=dev` and `npm audit` after each dependency update and inspect the actual advisory before changing major versions.

CI runs `npm audit --audit-level=high` as an informational security check because the documented, accepted major-version advisories currently make a blocking audit unsuitable. A future dependency milestone must replace this with a clean, reviewed policy after compatibility testing.
