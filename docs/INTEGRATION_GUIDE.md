# Onboarding Integration Guide

Last updated: 2026-08-08

Application root: `frontend/`

## System Contract

- Academy remains the sole credential provider through the deployed SSO bridge. Employees and Admins use the same Academy credentials on both sites.
- Artisan owns all onboarding pages, APIs, Prisma models, migrations, seed data, and its separate Neon database.
- No Academy repository or database changes are part of onboarding v1.
- Artisan correlates onboarding records using the stable Academy SSO user ID. It refreshes cached name/email on login and trusts only the current signed session role for authorization.
- Academy identity or role changes may take up to the one-hour Artisan session lifetime to take effect.

## Application Placement

- Portal routes: `frontend/src/app/careers/portal/`
- APIs: `frontend/src/app/api/`
- Reusable UI: `frontend/src/components/<PascalCase>/`
- Server logic and types: `frontend/src/lib/`
- Prisma schema, migrations, and seeds: `frontend/prisma/`
- Private PDF templates and employee submissions: Vercel Blob, delivered through authorized Artisan routes

## Required Behavior

- First login creates or refreshes a pending local profile keyed by Academy user ID.
- Pending profiles show setup pending until an Admin assigns W-2 or 1099 classification.
- Employee APIs derive identity exclusively from the session. They do not accept a client-selected employee ID.
- Admin APIs require current session role `ADMIN`; a selected employee ID is accepted only for Admin operations and read-only preview.
- Classification filtering happens server-side for checklist, meetings, and Resources. W-2 responses never disclose 1099 resource metadata.
- Reference open events precede protected delivery; completion requires an explicit state change. Successful form submission completes a form resource.
- Employees may upload and replace their own form submission but cannot download it. Admins may upload on an employee's behalf and download the latest submission.
- Meeting assignments store employee-specific date, time, and host. Only Admins can assign them or reversibly change completion state.
- Overall progress is calculated from applicable checklist items, assigned meetings, and required resources without double-counting meeting projections.

## UI Contract

- Implement Home, Checklist, Meetings, Resources, and Admin as real App Router routes.
- Use the existing Artisan branding and CSS Modules only.
- Render the Employee/Admin view control only for authenticated Admins.
- Admin employee preview must show a persistent read-only banner and omit mutation controls.
- Admin resource tools support PDF reference/form uploads to seeded categories, Required/Optional and Draft/Published state, replacement, unpublishing, and permanent template removal.
- Employees see meetings read-only; the portal does not create Google Calendar events or provide availability/self-scheduling controls.

## Security Review Triggers

- Session, callback, cookie, or lazy-profile changes
- Academy user ID mapping or cached identity behavior
- Admin-selected profile access or preview behavior
- Classification visibility and progress calculations
- Database schema, migrations, seeds, retention, or credentials
- Protected asset allowlisting, delivery, and tracking
- Environment variables, feature flags, or rollout behavior

## Database Approval Gate

1. Prepare and review the Prisma schema locally.
2. Generate and inspect additive migration SQL without connecting to Neon.
3. Prepare an idempotent, stable-slug seed and review its content.
4. Request Brian's explicit approval before inspecting the Production database.
5. Request explicit approval immediately before the Production migration or seed operation.

## Rollout Order

1. Deploy Artisan code with onboarding disabled.
2. Configure private Vercel Blob and Production database variables.
3. Migrate and seed Production after approval.
4. Verify W-2, 1099, pending, Employee, Admin, document, submission, and meeting flows.
5. Enable the Artisan onboarding flag. Academy configuration remains unchanged.
6. Roll back onboarding by disabling the Artisan flag; preserve the existing SSO login path.

## Delivery Responsibilities

- Orchestrator: integration, conflicts, user communication, approval gates, and final verification.
- Architect: repository boundary, route ownership, and model minimalism.
- Database: Prisma, SQL, seeds, constraints, indexes, and data tests.
- UI: Artisan-branded CSS Modules implementation and accessibility.
- Security/QA: authorization matrix, protected resources, preview immutability, migration review, and end-to-end verification.
