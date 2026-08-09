# Repository Boundary

Last updated: 2026-08-08

## Current Delivery

- Build Artisan onboarding v1 entirely in Artisan Labs FE under `/careers/portal`.
- Scope includes Home, W-2/1099-aware checklist, Admin-assigned meeting tracking, managed PDF Resources and form submissions, and Admin roster basics with read-only preview.
- The July 30 T99/resources-only brief is superseded.
- Preserve the deployed Academy SSO login and the single shared Academy credential experience.

## Ownership

| Concern | Owner |
| --- | --- |
| Public site, `/careers`, portal UI, and onboarding APIs | Artisan Labs FE |
| Onboarding profiles, checklist, meetings, resources, submissions, and progress | Artisan Labs FE |
| Artisan Prisma schema, migrations, seeds, and Production Neon database | Artisan Labs FE; database operations approved by Brian |
| Private PDF templates and completed form submissions | Artisan Labs FE in private Vercel Blob |
| Portal branding and CSS Modules implementation | Artisan Labs FE |
| Credentials, authentication, identity validation, and current auth role | Academy through the existing SSO bridge |
| Academy users, courses, enrollments, progress, Prisma, and Neon | Academy |

## Non-Negotiable Boundary

- Academy is authentication-only for onboarding v1. Do not add onboarding features, tables, migrations, or APIs to `Book-of-Eldorado-FE`.
- Do not copy Academy password, session, role, or user tables into Artisan.
- Do not connect Artisan to Academy's Neon database.
- Use the stable Academy SSO user ID as `OnboardingProfile.academyUserId`; no cross-database foreign key exists.
- Cache display name and email only for the Artisan roster. Refresh them at login and authorize from the current Artisan session role.
- The accepted identity-freshness window is the existing Artisan session maximum of one hour.

## Onboarding Rules

- Lazily create or refresh a pending profile at first Artisan login. The initial Admin roster therefore includes only users who have logged into Artisan.
- Employment classification is assigned administratively as `W2` or `CONTRACTOR_1099`; pending users do not receive onboarding content.
- Checklist, meeting, and resource visibility is filtered server-side by classification. The 1099 resource category is 1099-only.
- Seed resource categories for v1. Admins can add PDF reference documents and forms, control Required/Optional and Draft/Published state, replace templates, unpublish, and permanently remove blank templates.
- Track reference first-open, last-open, and explicit completion. A successful form submission completes a form resource.
- Employees can submit and replace forms but cannot download completed submissions. Admins can submit on an employee's behalf and download the latest completed copy.
- Retain only the latest employee submission. Template replacement preserves completion unless an Admin explicitly requires resubmission; retain the old submission until its replacement succeeds.
- Deleting a resource removes its blank template Blob. Archive database metadata when employee submissions exist; otherwise the resource record may be deleted.
- Admins assign meeting date, time, and host directly to employees and reversibly control completion. Employees see meetings read-only; there are no meeting slots, self-scheduling, or employee acknowledgments.
- Admin employee preview is server-authorized and read-only. It does not impersonate the employee or change the Admin session role.

## Database and Delivery Rules

- Keep Artisan Prisma and all database access inside `frontend/`; browser code never receives database credentials.
- Use the Artisan Production Neon database with separately scoped pooled runtime and direct migration credentials.
- Prepare schema, additive SQL, and idempotent seeds locally before requesting database access.
- Do not inspect, migrate, or seed Neon without Brian's explicit approval immediately before each operation.
- Ship behind an Artisan-only onboarding kill switch, disabled by default. Academy needs no new environment variables.
- Use an Artisan Labs FE branch and PR. Preserve unrelated work and include schema, SQL, setup, verification, risks, and rollout notes.

## Visual Boundary

- Duhan's prototype defines desired behavior and information architecture only.
- Use Artisan's established typography, palette, spacing, focus treatment, and component language.
- Use CSS Modules only; do not add Tailwind or reproduce prototype styling wholesale.
