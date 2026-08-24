# System Architecture

## Current scope

The repository contains one backend trust boundary and one web frontend. The frontend also serves synthetic public-discovery and authenticated role-preview pages; these do not add backend trust boundaries:

```text
Browser
  -> Next.js frontend
     -> Keycloak for OIDC authentication
     -> auth-service for opaque sessions, identity, RBAC and audit
        -> PostgreSQL auth_db
```

Public `/`, `/knowledge`, `/experts` and `/opportunities` routes are informational or synthetic discovery previews. They do not prove that a described future business capability exists.

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
- `/workspace`: resolves the authenticated session to a current capability-gated role preview or a Module 1 destination.
- `/workspace/researcher`, `/workspace/reviewer`, `/workspace/organization`: capability-gated task UI previews without business backends.
- `/workspace/collaboration`: capability-gated `COLLABORATION_MANAGER` task UI preview for opportunities, screening, reviewer assignment, projects and report handling.
- `/workspace/decisions`: capability-gated decision task UI preview for `FOUNDATION_DECISION_MAKER`; user-facing copy is neutral and excludes financial/funding workflows.
- `/workspace/enterprise`, `/workspace/leadership`: authenticated UI previews only and are not selected by current live personas.
- Legacy `/workspace/iam*`: compatibility redirects to Module 1 routes.

`KNOWLEDGE_CURATOR` is removed from the current active synthetic role fixture set because its former permission set did not own a distinct workflow step. Knowledge browsing remains available in public discovery and the Researcher preview.

Knowledge, expert-directory, collaboration, review, project, academic, technology and analytics business services are absent. Synthetic frontend previews may still exist for design and flow demonstration.
