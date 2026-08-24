# Synthetic IAM Workflow Fixtures

This directory contains `account.json`, a non-secret synthetic IAM fixture set, and `import-fixture.ts`, the importer used to populate workflow roles in the auth database.

## Critical notice

- **No credentials:** the fixture contains no passwords, secrets, tokens, or login credentials.
- **Keycloak ownership:** authentication credentials and SSO identities are owned by Keycloak.
- **Identity linkage:** browser login works only when the Keycloak identity resolves to the same OIDC issuer and subject stored in `account.json`.
- **Current active fixture roles:** `SUPER_ADMIN`, `RESEARCHER`, `ORGANIZATION_REPRESENTATIVE`, `REVIEWER`, `COLLABORATION_MANAGER`, and `FOUNDATION_DECISION_MAKER`.
- `KNOWLEDGE_CURATOR` is intentionally removed from the active fixture set because its previous permissions did not own a distinct workflow step.
- The duplicate generic Researcher fixture is intentionally removed; the current synthetic account set keeps the organization-scoped Researcher identity used for the bilateral test flow.

`services/auth-service/prisma/account.json` is not the local credential file. Local login credentials remain outside source control and must never be copied into this directory.

## Usage

Run the importer with the configured development database:

```bash
npx ts-node prisma/import-fixture.ts
```

The importer validates each fixture against the exact capability policy declared in `import-fixture.ts` before writing it.
