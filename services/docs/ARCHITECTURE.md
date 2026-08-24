# Backend Architecture

`services/auth-service` is the only current backend deployable.

It contains five internal Module 1 boundaries:

- `identity`;
- `authentication`;
- `session`;
- `access-control`;
- `security`.

These boundaries share one deployment but retain explicit ownership. PostgreSQL `auth_db` is the only application database. Keycloak is the external OIDC identity provider.

No other business service is present.
