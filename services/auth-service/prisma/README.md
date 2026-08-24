# Synthetic IAM Workflow Fixtures

This directory contains `iam-fixtures.json`, a non-secret IAM policy fixture set, and `import-fixture.ts`, the importer used to populate workflow roles in the auth database. The only local login-account source is the ignored `secrets/account.json` file.

## Critical notice

- **No credentials:** the fixture contains no passwords, secrets, tokens, or login credentials.
- **Credential ownership:** authentication credentials remain in the ignored runtime `secrets/account.json` config and are verified by Auth.js.
- **Identity linkage:** browser login works only when the Auth.js account resolves to an application identity with an active role assignment.
- **Current active fixture roles:** `SUPER_ADMIN`, `RESEARCHER`, `ORGANIZATION_REPRESENTATIVE`, `REVIEWER`, `COLLABORATION_MANAGER`, and `FOUNDATION_DECISION_MAKER`.
- `KNOWLEDGE_CURATOR` is intentionally removed from the active fixture set because its previous permissions did not own a distinct workflow step.
- The duplicate generic Researcher fixture is intentionally removed; the current synthetic account set keeps the organization-scoped Researcher identity used for the bilateral test flow.

`services/auth-service/prisma/iam-fixtures.json` contains policy fixtures only. Local login credentials remain in ignored `secrets/account.json` and must never be copied into this directory.

## Usage

Run the importer with the configured development database:

```bash
npx ts-node prisma/import-fixture.ts
```

The importer validates each fixture against the exact capability policy declared in `import-fixture.ts` before writing it.
