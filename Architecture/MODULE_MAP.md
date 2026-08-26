# VN-RU Module Map

Operational ownership map. Current source is capability truth; absent modules are not implemented.

## Current backend modules

| Module | Owns | Public/internal seam |
| --- | --- | --- |
| `identity` | users, external identities, member applications/profile state | `IdentityService`; public membership-application controller |
| `authentication` | Auth.js assertion exchange, login/logout orchestration, authenticated request context | `AuthenticationService`, `AuthenticatedRequestGuard`, `/api/v1/auth/*` |
| `session` | opaque session lifecycle, expiry, revoke, active-context rotation | `SessionService` |
| `access-control` | roles, permissions, assignments, capability resolution, IAM audit mutations | `AccessControlService`, `IamAdminService`, `/api/v1/admin/*` |
| `database` | one Prisma client/pool and shutdown lifecycle | `DatabaseClient`; infrastructure only, no business ownership |

## Ownership rules

1. Identity data is written by `identity` only.
2. Session state is written by `session`; IAM status changes may revoke sessions atomically through the existing access-control workflow.
3. Roles, permissions and assignments are written by `access-control` only.
4. `authentication` orchestrates identity, session and access-control; it does not own their tables.
5. `database` provides connectivity only. Sharing a client does not grant cross-module model ownership.
6. `SUPER_ADMIN` is technical IAM administration, not portal-content management.

## Frontend ownership

| Area | Owner |
| --- | --- |
| `app/` | routes and composition only |
| `features/` | feature UI, API/service orchestration and feature state |
| `components/shared/` | presentation primitives/shells only |
| `app/api/` | BFF/session-sensitive transport boundary |
| backend authorization | never frontend-owned |

## Future modules

Knowledge, content and portal-management capabilities must enter `services/auth-service/src/modules/` as complete vertical slices. Do not create empty folders/modules from target-state prose.

Before adding a module answer: owner, actor, contract impact, authorization impact, persistence owner, smallest testable slice.
