# RBAC Architecture

## Current direction

VN-RU Network uses business permission keys rather than making administrators manage raw HTTP method/path rows.

Authorization is enforced by the backend. Frontend permission handling is a projection of backend capabilities and must never become the authorization source of truth.

The current implementation should remain inside the owning backend service until the Identity boundary is stable enough for future service extraction.

## Goals

* Move away from hard-to-manage endpoint-level permissions.
* Use stable business permission keys that are understandable by administrators.
* Keep backend authorization explicit and fail-safe.
* Keep frontend permission management focused on business capabilities, not raw HTTP paths.
* Keep role and permission relationships explicit.
* Keep authentication, authorization, and resource access as separate concerns.
* Avoid designing service-to-service authorization before service extraction is actually required.

## Business permission keys

Business permissions should use stable capability keys:

```txt
<domain>.<resource>.<action>
```

Examples:

```txt
users.view
users.manage
roles.view
roles.manage
permissions.view
permissions.manage
```

Permission keys represent business capabilities and should not change when HTTP route paths change.

Do not define the complete permission registry in this document. The registry belongs to the owning backend service.

## Backend architecture

### Permission registry

Business permissions are defined by the owning authorization module.

The registry should contain:

* stable permission key;
* domain/module grouping;
* administrator-facing label;
* description;
* optional UI/menu metadata;
* risk level where required.

### Explicit permission decorator

Routes may declare business permissions explicitly:

```ts
@RequirePermission("roles.manage")
```

The decorator should only declare the required capability. Authorization logic remains inside the authorization guard/service.

### Authorization flow

Authorization should follow this order:

1. Public routes bypass authentication/authorization only when explicitly allowed.
2. Require an authenticated user for private routes.
3. Resolve the user's active authorization context.
4. Check the required business permission.
5. Check resource/tenant scope when the resource is scoped.
6. Deny by default when required authorization information is missing.

Production authorization must be fail-closed.

## Authorization and resource access

RBAC and resource access are separate:

```txt
RBAC
  -> Can the user perform this action?

Resource access
  -> Can the user perform this action
     on this specific resource?
```

A valid role and permission must not automatically grant access to every resource.

Resource ownership and scope remain enforced by the owning domain/module.

## Active authorization context

An authenticated session should have an explicit authorization context.

The backend must evaluate permissions against the active context rather than blindly aggregating capabilities from unrelated roles or assignments.

The API should expose the active authorization context required by the frontend to render the current workspace.

Frontend capability checks are UX only. Backend authorization remains authoritative.

## Frontend permission projection

Frontend navigation and feature visibility may use the permissions returned by the backend.

Frontend should:

* hide unavailable actions;
* disable unavailable features where appropriate;
* render navigation based on business capabilities;
* avoid depending on raw HTTP method/path permissions.

Frontend must not:

* grant authorization;
* infer permissions from route names;
* infer permissions from role names;
* merge unrelated authorization contexts.

## Permission storage

The database representation of permissions is an implementation detail of the owning authorization module.

The system may initially use the existing permission storage model while the business-permission architecture is introduced.

A dedicated permission key field may be introduced later through a database migration when the current storage model no longer provides a clean representation.

## Identity boundary direction

The long-term Identity boundary may contain:

```txt
identity/
  authentication/
  sessions/
  users/
  access-control/
    roles/
    permissions/
    authorization/
  audit/
  identity-public.ts
```

The exact internal structure should follow the actual implementation.

Other modules must depend on public Identity contracts rather than deep authentication or authorization implementation paths.

If Identity is later extracted into a dedicated service, its authentication, authorization, and service-to-service contracts must be defined before extraction.

## Security rules

* Production authorization must be fail-closed.
* Missing required permission metadata must not result in implicit access.
* Missing permission records must deny access.
* Permission mutations must be audited.
* Users must not grant permissions beyond their own authorization scope.
* Super-admin or equivalent elevated scope must be explicit.
* Role authorization and resource authorization remain separate.
* Do not trust frontend permission checks as security controls.
* Do not use role names as authorization logic when a business permission is available.
* Do not expose secrets, tokens, or internal authorization implementation details through permission metadata.

## Evolution plan

1. Define stable business permission keys.
2. Implement the permission registry inside the owning authorization module.
3. Add explicit permission checks to protected business operations.
4. Keep role-to-permission assignment explicit.
5. Add resource/tenant scope checks where required.
6. Move shared identity contracts behind a public Identity boundary.
7. Add dedicated permission storage fields only when required by the implementation.
8. Design service-to-service authorization only when a service is actually extracted.
