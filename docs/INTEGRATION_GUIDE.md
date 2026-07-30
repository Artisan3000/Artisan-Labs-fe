# Integration Guide

Application root: `frontend/`

## Current MVP

- Build T99 and resources/policies under `frontend/src/app/careers/portal/`.
- Preserve the current login and portal session behavior.
- Do not add Academy runtime dependencies.
- Treat SQL as a proposal until Brian approves the database and migration.

## Placement

- Route UI: `frontend/src/app/<route>/`
- API: `frontend/src/app/api/<route>/route.ts`
- Reusable UI: `frontend/src/components/<PascalCase>/`
- Shared logic/types: `frontend/src/lib/`

## Flag for Review

- Auth, callback, session, or cookie changes
- User identifiers or Academy mappings
- Database, schema, migration, retention, or permissions
- Environment variables and external contracts

## Delivery

- Use an Artisan Labs FE branch based on the agreed commit.
- Include only approved scope.
- Provide changed files, dependencies, SQL, setup, verification, screenshots, risks, and remaining work.
- Record unknowns before coding against them.
