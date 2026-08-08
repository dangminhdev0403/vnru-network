# Secrets Management

## Purpose

Define how secrets and sensitive runtime configuration are stored, used, ignored by Git, and provided to development and production environments.

This document defines policy only. Service-specific environment variables and deployment configuration belong to the owning service or runtime configuration.

## Secret policy

Secrets must never be committed to the repository.

Sensitive values include:

- passwords;
- API keys;
- access tokens;
- refresh secrets;
- private keys;
- service-account credentials;
- database credentials;
- connection strings containing credentials;
- webhook secrets;
- encryption keys;
- other provider credentials.

## Environment configuration

Runtime configuration should be separated from source code.

Use sanitized templates for required configuration:

```txt
.env.example
```

Templates may contain:

- variable names;
- expected format;
- safe default values where applicable;
- short descriptions.

Templates must never contain real credentials.

## Local development

Local secrets must remain outside version control.

Recommended structure:

```txt
secrets/
  local/
  docker/
  production/
```

Only create directories required by the current runtime.

Real local values belong in ignored files. Developers must not commit local environment files or secret backups.

## Git policy

Allowed:

```txt
.env.example
secrets/.gitkeep
```

and other explicitly sanitized configuration templates.

Never commit:

```txt
.env
.env.local
.env.production
secrets/**/*.env
*.pem
*.key
service-account*.json
```

Additional secret file patterns should be added to `.gitignore` when introduced.

Before committing environment-related changes, verify that real secret files are ignored:

```bash
git check-ignore -v <secret-file>
git status --short --ignored
```

## Docker runtime

Docker containers must receive secrets from runtime configuration.

Do not hard-code secrets in:

- `Dockerfile`;
- `docker-compose.yml`;
- source code;
- committed configuration;
- build arguments.

Build-time configuration and runtime secrets must remain separate.

Secrets required only at runtime should not be embedded into application images.

## Production

Production secrets must be provisioned on the deployment environment or through the project's approved secret-management mechanism.

Production credentials must not be stored in Git.

Deployment configuration should reference runtime secrets rather than containing their values.

Production access should follow least privilege:

```txt
Service
  -> receives only required secrets
  -> uses only required permissions
  -> does not expose secrets to clients
```

## Frontend rule

Secrets must never be exposed through frontend code.

Values prefixed or configured as public frontend environment variables must be treated as public.

Never place these in browser-exposed configuration:

```txt
database credentials
private API keys
JWT signing secrets
encryption keys
provider secrets
internal service credentials
```

The frontend may receive public configuration such as public API URLs or non-sensitive feature configuration.

## Secret handling in logs

Never log:

- passwords;
- tokens;
- API keys;
- authorization headers;
- cookies containing authentication credentials;
- database connection strings with credentials;
- private keys.

When debugging authentication or integration failures, log identifiers and status information rather than secret values.

## Secret rotation

If a secret is exposed or suspected to be compromised:

1. Revoke or rotate the credential.
2. Update the affected runtime environment.
3. Restart affected services when required.
4. Verify the new credential.
5. Remove the exposed value from source/configuration where applicable.
6. Review access logs when available.

Removing a secret from the latest commit does not make an already-exposed credential safe. The credential must be rotated.

## Ownership

Each service owns the secrets required by its runtime.

A service must not read another service's private environment configuration directly.

Shared credentials should only exist when there is a defined shared integration or infrastructure requirement.

## Adding a new secret

Before introducing a new secret:

1. Identify which service owns it.
2. Add only its variable name to the appropriate example/template.
3. Add the real value only to the runtime environment.
4. Ensure the real file is ignored by Git.
5. Ensure the secret is not exposed to frontend/browser code.
6. Ensure logs and error responses cannot reveal it.

## Principle

```txt
Source code
  -> configuration references

Runtime environment
  -> actual secret values

Git
  -> no real secrets
```

Secrets are runtime configuration, not application source code.
