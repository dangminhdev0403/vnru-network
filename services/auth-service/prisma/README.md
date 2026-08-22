# Synthetic Curator IAM Fixture (Module 2)

This directory contains `account.json`, a non-secret synthetic IAM fixture, and `import-fixture.ts`, an importer to populate it in the database.

## Critical Notice

* **No Credentials / Non-Secret:** This fixture contains **no passwords, secrets, tokens, or credentials**.
* **Keycloak Ownership:** Upstream authentication credentials and SSO are owned entirely by the Keycloak OIDC broker.
* **Linkage Required:** To successfully authenticate as this user, Keycloak must contain a user identity whose OIDC `iss` (issuer) and `sub` (subject) matches the `issuer` and `subject` configured in `account.json`:
  * **Issuer:** `http://localhost:8080/realms/vnru`
  * **Subject:** `curator-keycloak-subject-uuid-1234`

If Keycloak doesn't have a matching user, OIDC authentication will succeed but the user context resolution on `auth-service` will not link to this role and permissions.

## Usage

Run the importer script with `ts-node` or execute the focused test suite:

```bash
# Set environment variables
$env:DATABASE_URL="postgresql://localhost:5432/db"

# Execute importer
npx ts-node prisma/import-fixture.ts
```
