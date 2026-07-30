# Artisan Labs FE Architecture Reference

Last updated: 2026-07-30

Application root: `frontend/`

## Current Project Direction

- Artisan Labs FE is the implementation repository for `/careers/portal`.
- Current MVP: T99 forms and resources/policies.
- Checklists, meeting tools, account creation, and other prototype modules are out of scope.
- Preserve the existing Artisan login and portal access.
- Academy SSO is deferred; the MVP must not depend on Academy at runtime.
- Duhon works from an Artisan Labs FE branch. Brian approves SQL and production migration.

## Implemented Systems

- Next.js App Router pages and APIs — `frontend/src/app/`
- Public content, editorial search, and Shopify commerce — `frontend/src/app/`, `frontend/src/lib/shopify*.ts`
- Squire booking — `frontend/src/lib/squire.ts`, `frontend/src/components/SiteWidget/`
- Careers page and protected portal shell — `frontend/src/app/careers/`
- Optional Academy SSO client and Artisan cookie session — `frontend/src/lib/academy-sso/`, `frontend/src/app/api/auth/`
- Resend contact email, Open-Meteo, Stooq, and optional GA4 — `frontend/src/app/api/`, `frontend/src/components/GoogleAnalytics/`

## Auth and Data

- Do not change auth for the current MVP.
- The SSO client exists behind a feature flag; production enablement is unconfirmed.
- No application database, schema, migrations, or database client is checked into this repository.
- Duhon’s SQL is a migration proposal, not approved production schema.
- Academy owns Academy credentials, roles, courses, enrollments, progress, Prisma schema, and Neon migrations.
- Artisan owns careers UI and approved careers persistence.

## Placement

- Pages: `frontend/src/app/<route>/`
- APIs: `frontend/src/app/api/<route>/route.ts`
- Reusable UI: `frontend/src/components/<PascalCase>/`
- Shared logic/types: `frontend/src/lib/`
- Portal features: `frontend/src/app/careers/portal/`

## Unconfirmed

- Production login/SSO configuration
- Final T99 forms, fields, permissions, and HR rules
- Resource inventory, ownership, acknowledgement, versioning, and retention rules
- Target database platform and approved migration design
