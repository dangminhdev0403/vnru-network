# System Architecture

## Current scope

The repository is a product workspace/monorepo with one web deployable, one backend modular monolith and one PostgreSQL database. See `../Architecture/` for the architecture entry and ownership map:

```text
Browser
  -> Next.js frontend
     -> Auth.js Credentials for server-side credential verification
     -> backend monolith (`services/auth-service`) for opaque sessions, identity, RBAC and audit
        -> PostgreSQL auth_db
```

Public `/` and `/news` routes are informational. `/knowledge`, `/experts` and `/opportunities` require member access. Their current display data does not prove that a described future backend capability exists.

## Runtime ownership

- Auth.js owns login and encrypted frontend sessions; credentials come from the ignored runtime account config.
- The backend monolith currently lives at `services/auth-service`; the directory name is retained to avoid an unnecessary runtime rename.
- Its IAM modules own platform identity, opaque sessions, active authorization context, roles, permissions, assignments and security audit events.
- The frontend owns presentation and BFF forwarding. Frontend visibility is never an authorization boundary.
- PostgreSQL `auth_db` is the only application database in the current stack.
- Future knowledge, content and portal-management capabilities must be internal modules in this backend and share PostgreSQL while retaining table/repository ownership.

## Canonical routes

- `/`: public landing page.
- `/news`: public science and technology news stream. Legacy `/explore` permanently redirects here.
- `/login`: Auth.js Credentials authentication entry.
- `/register`: localized membership application. It creates a pending application only; it does not create identities, credentials or role assignments.
- `/account`: member profile.
- `/security`: MFA and session security.
- `/admin/access/*`: user, role, permission and assignment administration.
- `/admin/audit`: Module 1 audit surface.
- `/workspace`: the single authenticated member area. Registered members and experts use the same product surface; capabilities only limit the data and actions they may use.
- Specialist persona/workflow routes are intentionally absent; `/workspace` is the single member information hub.
- Legacy `/workspace/iam*`: compatibility redirects to Module 1 routes.

The product has three access classes:

1. **Public visitor**: reads news, events and approved public information.
2. **Registered member / expert**: also accesses approved member knowledge, topic calls and scientific publications.
3. **Portal manager**: also manages portal content and views aggregate site statistics.

"Full member access" never means unrestricted system access. Backend authorization and record visibility remain authoritative. `SUPER_ADMIN` is a separate technical IAM/security account, not the portal-manager persona and not a substitute for business permissions.

Knowledge, expert-directory, collaboration, review, project, academic, technology and analytics backend modules are absent. Retained templates and synthetic display data are non-runtime references only.
