# Artisan Labs FE Architecture Reference

Last updated: 2026-08-08

Application root: `frontend/`

## Current Project Direction

- Artisan Labs FE is the implementation and data owner for `/careers/portal` and Artisan onboarding.
- Onboarding v1 includes Home, classification-aware checklists, Admin-assigned meeting tracking, managed Resources and form submissions, and Admin roster basics with read-only employee preview.
- The July 30, 2026 T99/resources-only direction is superseded by this approved onboarding v1 scope.
- Preserve Artisan's existing brand system and implement portal styling with CSS Modules only.
- Duhan's prototype is a product-behavior and information-architecture reference, not a visual implementation source.

## Implemented Systems

- Next.js App Router pages and APIs — `frontend/src/app/`
- Public content, editorial search, and Shopify commerce — `frontend/src/app/`, `frontend/src/lib/shopify*.ts`
- Squire booking — `frontend/src/lib/squire.ts`, `frontend/src/components/SiteWidget/`
- Careers page and protected portal shell — `frontend/src/app/careers/`
- Production Academy SSO client and Artisan cookie session — `frontend/src/lib/academy-sso/`, `frontend/src/app/api/auth/`
- Resend contact email, Open-Meteo, Stooq, and optional GA4 — `frontend/src/app/api/`, `frontend/src/components/GoogleAnalytics/`

## Identity, Authentication, and Data Ownership

- Academy remains the sole credential and authentication authority. One Academy email/password signs a user into both Academy and Artisan through the existing SSO bridge.
- Academy requires no onboarding UI, Prisma, schema, migration, or API changes for onboarding v1.
- Artisan must not create passwords or copy Academy authentication tables.
- The signed SSO identity supplies the stable Academy user ID, name, email, and current role. Artisan stores onboarding data against that Academy user ID without a cross-database foreign key.
- Artisan caches name and email for its Admin roster and refreshes them at login. Authorization always uses the active Artisan session role, never a persisted onboarding role.
- Identity deactivation and role changes may remain effective in Artisan for the existing session lifetime of up to one hour.
- The first successful SSO login lazily creates or refreshes a pending Artisan onboarding profile. Profiles for Academy users who have never logged into Artisan are intentionally unavailable in the initial Admin roster.
- Until an Admin assigns `W2` or `CONTRACTOR_1099`, the user receives a setup-pending experience rather than onboarding content.

## Artisan Database Boundary

- Artisan owns its Production Neon database, Prisma schema, migrations, seeds, and database credentials under `frontend/`.
- Artisan must never connect to the Academy Neon database or alter Academy's Prisma schema.
- Production uses separately scoped pooled runtime and direct migration URLs.
- Neon inspection, migration, or seeding requires Brian's explicit approval immediately before the operation.
- Schema, generated additive SQL, and idempotent seeds are prepared and reviewed locally before any database interaction.

## Onboarding Data and Behavior

- Profiles carry employment classification (`W2` or `CONTRACTOR_1099`), start date, training access, Assistant Stylist eligibility, and active state.
- Checklist and meeting applicability is classification-aware. W-2 users must not receive 1099-only data or metadata.
- Seeded resource categories accept Admin-managed PDF reference documents and forms. The 1099 Resources—New York category is 1099-only.
- Documents support Draft/Published and Required/Optional states. Admins may replace, unpublish, or permanently remove blank templates.
- Reference progress records first open, latest open, and explicit completion. Completion is never inferred from scrolling, time, or download.
- A successful form submission completes that resource. Employees may submit or replace a form and see its received timestamp, but completed submissions are downloadable only by Admins.
- Vercel Blob stores private templates and submissions. Only the latest employee submission is retained; a successful replacement deletes the superseded Blob.
- Replacing a template preserves existing completions unless the Admin explicitly requires resubmission. While resubmission is pending, the prior employee submission remains available to Admins until its replacement succeeds.
- Permanent resource removal deletes the blank template Blob. Records with submissions are archived to retain employee data; records without submissions may be deleted.
- Meetings have no shared availability slots. Admins assign date, time, and host directly to an employee's assignment and can reversibly mark it complete. Employees have a read-only meeting view and do not acknowledge meetings in Artisan.
- Overall progress is derived from applicable manual checklist items, assigned meetings, and visible required resources; meeting projections are not counted twice.
- Private files remain outside `/public`, are stored in private Vercel Blob, and are delivered only through authorized server routes.
- Admin sessions can manage roster basics and open an unmistakable, read-only employee preview. Preview does not change the Admin's role or expose employee mutation controls.

## Placement

- Pages: `frontend/src/app/<route>/`
- APIs: `frontend/src/app/api/<route>/route.ts`
- Reusable UI: `frontend/src/components/<PascalCase>/`
- Shared logic/types: `frontend/src/lib/`
- Portal features: `frontend/src/app/careers/portal/`
- Prisma schema, migrations, and seeds: `frontend/prisma/`

## Delivery and Rollout

- Add an Artisan onboarding feature flag that defaults to disabled. No Academy configuration changes are required.
- Deploy code disabled, configure private Blob and Production database variables, then migrate and seed Production with explicit approval before enabling the feature.
- Keep the existing SSO flow operational throughout rollout and use the feature flag as the onboarding rollback control.
- Work remains isolated on an Artisan Labs FE feature branch and is merged through review.

## Implementation Ownership

- The primary/orchestrator owns decisions, integration, approval gates, conflicts, and final verification.
- The Architect track protects the Academy/Artisan boundary, minimal model set, and route ownership.
- The Database track owns Prisma, additive migrations, idempotent seeds, relations, constraints, indexes, and data tests.
- The UI track owns branded, accessible portal routes using CSS Modules only.
- Security/QA reviews the integrated work for session scoping, classification filtering, Admin preview immutability, protected files, migration safety, and end-to-end behavior.
