# System Architecture

## Current scope

The repository contains one backend trust boundary and one web frontend:

```text
Browser
  -> Next.js frontend
     -> Keycloak for OIDC authentication
     -> auth-service for opaque sessions, identity, RBAC and audit
        -> PostgreSQL auth_db
```

The public `/` route is an informational landing page. It does not prove that a described future business capability exists.

## Runtime ownership

- Keycloak owns credentials, login, password reset and TOTP ceremonies.
- `auth-service` owns platform identity, opaque sessions, active authorization context, roles, permissions, assignments and security audit events.
- The frontend owns presentation and BFF forwarding. Frontend visibility is never an authorization boundary.
- PostgreSQL `auth_db` is the only application database in the current stack.

## Canonical routes

- `/`: public landing page.
- `/login`: authentication entry delegated to Keycloak.
- `/account`: member profile.
- `/security`: MFA and session security.
- `/admin/access/*`: user, role, permission and assignment administration.
- `/admin/audit`: Module 1 audit surface.
- `/workspace` and legacy `/workspace/iam*`: compatibility redirects to Module 1 routes.

Knowledge, expert directory, collaboration, review, project, academic, technology and analytics routes/services are absent.
