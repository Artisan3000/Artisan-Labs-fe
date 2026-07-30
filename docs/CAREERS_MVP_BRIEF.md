# Careers MVP Brief

## Outcome

Add the two missing employee-portal areas under `/careers/portal`:

- T99 forms
- Resources/policies

## In Scope

- T99 UI and confirmed workflow
- Resource listing and access
- Acknowledgement/version tracking only after requirements and schema are approved
- Integration with the existing Artisan portal boundary

## Out of Scope

- Login, account creation, SSO, users, or sessions
- Checklists and meeting tools
- Other prototype modules
- Academy code or schema changes
- Production database migration before Brian’s approval

## Required Before Schema Work

- [ ] Duhon confirms T99 forms, fields, workflow, permissions, and HR source.
- [ ] Resource owner and file inventory are identified.
- [ ] Acknowledgement and versioning rules are confirmed.
- [ ] Duhon and Brian review proposed SQL.
- [ ] Brian approves the target database, migration, and rollback.

## Acceptance Criteria

- [ ] Work is delivered through an Artisan Labs FE branch and PR.
- [ ] Existing login and portal behavior are unchanged.
- [ ] T99 and resources are the only new portal modules.
- [ ] Mocks and incomplete behavior are labeled.
- [ ] Setup, verification, screenshots, dependencies, and SQL proposal are included.
