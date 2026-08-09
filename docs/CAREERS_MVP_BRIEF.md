# Careers Onboarding v1 Brief

Last updated: 2026-08-08

This brief supersedes the July 30, 2026 T99/resources-only MVP direction.

## Outcome

Deliver a production onboarding portal at `/careers/portal` that uses the existing Academy SSO credentials while keeping every onboarding feature and database concern inside Artisan Labs FE.

## In Scope

- Branded employee Home with identity, next meeting, derived progress, summary cards, and training boundary
- Administratively assigned `W2` or `CONTRACTOR_1099` classification and a setup-pending state
- Classification-aware manual checklist plus read-only meeting projections
- Meeting journey with Admin-assigned date, time, host, and reversible completion; employee status is read-only
- Seeded Shop documents, 1099 Resources—New York, and Health & sanitation
- Admin PDF reference/form uploads to seeded categories with Draft/Published, Required/Optional, replacement, unpublishing, and permanent template removal
- Private Vercel Blob storage for blank templates and employee submissions
- Reference first-open, last-open, and explicit completion tracking; form submission completes a form resource
- Employee form upload and replacement, Admin upload on an employee's behalf, and Admin-only submission downloads
- Admin roster basics and an unmistakable, read-only employee preview
- Artisan-owned Prisma, additive migrations, idempotent seeds, and Production Neon database
- Artisan onboarding feature flag disabled by default

## Out of Scope

- Academy onboarding code, APIs, schema, migrations, or database access
- A second credential, password, or login system in Artisan
- Admin discovery of Academy users who have never logged into Artisan
- Resource-category authoring, non-PDF uploads, and completed-form history beyond the latest submission
- Employee meeting scheduling, availability pools, Google Calendar event creation, and employee meeting acknowledgment
- Editable welcome copy, team profiles, detailed Admin notes/audit history, and media uploads
- Treating resource completion as proof of reading, comprehension, legal acknowledgment, or assessment

## Product Rules

- Academy remains the single authentication authority; the same credentials work across Academy and Artisan.
- The first successful Artisan login lazily creates or refreshes a pending onboarding profile.
- Pending users see setup pending until classified by an Admin.
- The 1099 resource category is visible only to 1099 users. W-2 users never receive its metadata.
- Reference completion requires **Mark complete** and is never inferred. A successful form submission is the form's completion event.
- Employees cannot download completed submissions. They see **Received**, the submission timestamp, and a replacement control.
- Admins can download the latest completed form and upload one on an employee's behalf.
- Template replacement preserves completed submissions unless **Require resubmission** is selected. The old completed form remains available until its replacement succeeds.
- Only the latest completed submission is retained after a successful replacement.
- Removing a resource deletes its blank template Blob. When submissions exist, metadata is archived rather than destroyed.
- Welcome and explanatory copy remain in page code.
- Admin preview is role-protected, clearly labeled, and read-only; it never impersonates the employee.
- Duhan's prototype guides behavior and structure. Artisan's existing brand and CSS Modules govern the implementation.

## Required Before Database Operations

- [ ] Prisma schema is complete and reviewed locally.
- [ ] Exact additive migration SQL is generated and reviewed locally.
- [ ] Stable-slug, idempotent seed content is reviewed.
- [ ] Brian explicitly approves Production database inspection, migration, and seed operations immediately before they occur.

## Acceptance Criteria

- [ ] Existing Academy SSO, Careers login, portal protection, and logout continue to work.
- [ ] Academy requires no onboarding change and Artisan never connects to Academy's database.
- [ ] W-2, 1099, pending, inactive, Employee, and Admin authorization paths behave as specified.
- [ ] Employee cross-profile access is denied and Admin preview cannot mutate employee state.
- [ ] Checklist, Admin-assigned meetings, required Resources, and overall progress are classification-aware and do not double count.
- [ ] Private templates and submissions are authorized, classification-filtered, stored in Vercel Blob, and delivered only through protected routes.
- [ ] Employees cannot retrieve completed submissions; Admins can retrieve only authorized employee submissions.
- [ ] Template/submission replacement, resubmission, archive, and Blob-deletion behavior preserve the latest valid employee record on failure.
- [ ] The portal follows Artisan branding, CSS Modules-only styling, accessibility requirements, and responsive behavior.
- [ ] Code deploys with onboarding disabled and follows the approved Production rollout.
- [ ] Schema, SQL, seed, setup, verification, risks, and remaining work are documented in the PR.
