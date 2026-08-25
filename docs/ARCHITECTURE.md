# System Architecture

## Current scope

The repository contains one backend trust boundary and one web frontend. The frontend also serves synthetic public-discovery and authenticated role-preview pages; these do not add backend trust boundaries:

```text
Browser
  -> Next.js frontend
     -> Auth.js Credentials for server-side credential verification
     -> auth-service for opaque sessions, identity, RBAC and audit
        -> PostgreSQL auth_db
```

Public `/`, `/knowledge`, `/experts` and `/opportunities` routes are informational or synthetic discovery previews. They do not prove that a described future business capability exists.

## Runtime ownership

- Auth.js owns login and encrypted frontend sessions; credentials come from the ignored runtime account config.
- `auth-service` owns platform identity, opaque sessions, active authorization context, roles, permissions, assignments and security audit events.
- The frontend owns presentation and BFF forwarding. Frontend visibility is never an authorization boundary.
- PostgreSQL `auth_db` is the only application database in the current stack.

## Canonical routes

- `/`: public landing page.
- `/login`: Auth.js Credentials authentication entry.
- `/register`: localized registration-request UI preview; it does not create identities or bypass administrator provisioning.
- `/account`: member profile.
- `/security`: MFA and session security.
- `/admin/access/*`: user, role, permission and assignment administration.
- `/admin/audit`: Module 1 audit surface.
- `/workspace`: the unified member workspace. Every non-administrator business persona lands here; capability keys determine visible modules and available actions.
- `/workspace/researcher`, `/workspace/reviewer`, `/workspace/organization`, `/workspace/collaboration` and `/workspace/decisions`: capability-gated task modules inside the same workspace shell. They are not separate applications or UI personas.
- `/workspace/enterprise`, `/workspace/leadership`: authenticated UI previews only and are not selected by current live personas.
- Legacy `/workspace/iam*`: compatibility redirects to Module 1 routes.

`SUPER_ADMIN` remains isolated in `/admin/*`. Backend workflow roles remain distinct for authorization, context and audit even though the frontend presents one member workspace. `KNOWLEDGE_CURATOR` is removed from the current active synthetic role fixture set because its former permission set did not own a distinct workflow step.

Knowledge, expert-directory, collaboration, review, project, academic, technology and analytics business services are absent. Synthetic frontend previews may still exist for design and flow demonstration.
