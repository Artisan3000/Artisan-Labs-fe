# Artisan Onboarding v1 — Plan and Progress

Last updated: 2026-08-08

## Status

- [x] Academy authentication hardening deployed
- [x] Academy-to-Artisan authorization-code SSO deployed
- [x] Careers login, protected placeholder portal, and local logout verified in Production
- [x] Product scope and repository ownership approved
- [x] Architecture and repository-boundary documentation updated
- [x] Artisan Prisma schema drafted and validated locally
- [x] Additive migration SQL generated and reviewed locally
- [x] Idempotent checklist, meeting, and Resource seed reviewed locally
- [x] Employee and Admin APIs implemented; local unit, type, lint, and build checks pass
- [x] Artisan-branded Home, Checklist, Meetings, Resources, and Admin UI implemented
- [x] Integrated security/QA review complete; code-addressable findings resolved and launch-data gaps documented below
- [x] Revised meeting, resource-management, and form-submission scope approved
- [x] Revised Prisma schema, additive migration, seed, APIs, and UI implemented and verified locally
- [ ] Private Vercel Blob storage configured
- [x] Production migration applied
- [x] Production seed completed
- [ ] Production deployment and onboarding enablement completed

## Launch Inputs Still Required

- Configure private Vercel Blob credentials before enabling Admin PDF uploads.
- The employee handbook is not a launch blocker. HR can upload and publish it
  after launch through the Admin resource tools.
- No connection, migration, or seed has occurred.

## Locked Decisions

- Academy remains the only credential and authentication authority; no Academy onboarding changes are required.
- Artisan owns its Production Neon database and Prisma schema keyed by stable Academy SSO user ID.
- Profiles are created lazily on first Artisan login; identity freshness is bounded by the existing one-hour session.
- Employment classification is `W2` or `CONTRACTOR_1099` and is assigned by an Admin.
- Initial resource categories are seeded. Admins can add PDF reference documents or forms, manage Required/Optional and Draft/Published state, replace templates, and permanently remove templates.
- Private PDFs and employee submissions are stored in private Vercel Blob storage; database records hold authorization and lifecycle metadata.
- A form submission is the completion event for that form. Reference-document completion remains an explicit employee action.
- Only the latest employee submission is retained. Completed submissions are downloadable by Admins only; employees see receipt time and may replace a submission.
- Template replacement preserves existing completions unless an Admin explicitly requires resubmission. The prior submission remains available to Admins until its replacement succeeds.
- Deleting a resource deletes its blank template Blob. Resource metadata is archived when employee submissions exist; otherwise its database record may be deleted.
- 1099 Resources—New York is visible only to 1099 workers.
- Admins assign each meeting's date, time, and host to an employee and control a reversible completed state. Employees see meeting status and details read-only.
- Meeting availability pools, employee self-scheduling, and employee meeting acknowledgments are not part of v1.
- Admins can open a server-authorized, read-only employee preview without changing roles.
- UI follows the established Artisan brand and uses CSS Modules only.
- No Neon inspection, migration, or seed occurs without explicit approval immediately before the operation.

## Workstream Boundaries

- **Orchestrator:** integration, conflicts, decisions, approval gates, final verification.
- **Architect:** repository boundary, minimal structure, route ownership, architecture documentation.
- **Database:** Prisma schema, additive SQL, idempotent seed, relations, indexes, data tests.
- **UI:** portal shell and screens, CSS Modules, Artisan branding, responsiveness, accessibility.
- **Security/QA:** authorization, classification privacy, Admin preview immutability, protected files, migration safety, end-to-end verification.

Parallel workstreams must avoid overlapping files. The orchestrator integrates before Security/QA begins. Database approval gates apply to every workstream and agent.
