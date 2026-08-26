# Synthetic IAM Workflow Fixtures

This directory contains `iam-fixtures.json`, a non-secret IAM policy fixture set, and `import-fixture.ts`, the importer used to populate workflow roles in the auth database. The only local login-account source is the ignored `secrets/account.json` file.

## Critical notice

- **No credentials:** the fixture contains no passwords, secrets, tokens, or login credentials.
- **Credential ownership:** authentication credentials remain in the ignored runtime `secrets/account.json` config and are verified by Auth.js.
- **Identity linkage:** browser login works only when the Auth.js account resolves to an application identity with an active role assignment.
- **Current active fixture roles:** technical `SUPER_ADMIN` plus user roles `READER` and `PORTAL_MEMBER`.
- Workflow persona roles and capabilities are intentionally absent. The current product has one member workspace, while `SUPER_ADMIN` remains isolated to IAM/security.
- `READER` has no private capability; public news remains public. `PORTAL_MEMBER` currently has `portal.member.access`; add content/statistics capabilities only when those backend use cases exist.

`services/auth-service/prisma/iam-fixtures.json` contains policy fixtures only. Local login credentials remain in ignored `secrets/account.json` and must never be copied into this directory.

## Usage

Run the importer with the configured development database:

```bash
npx ts-node prisma/import-fixture.ts
```

The importer validates each fixture against the exact capability policy declared in `import-fixture.ts` before writing it.
