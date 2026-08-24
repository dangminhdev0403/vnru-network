# Module 1 API Contract Policy

The current HTTP contract is owned by `auth-service`. Controllers and exported OpenAPI, when generated, are the runtime source of truth.

Implemented API families:

- `/api/v1/auth/*`: OIDC exchange, current session, logout and active-context switching.
- `/api/v1/auth/profile`: application-owned member profile.
- `/api/v1/auth/sessions/*`: session listing and revocation.
- `/api/v1/admin/users/*`: identity administration.
- `/api/v1/admin/roles/*`: role and permission administration.
- `/api/v1/admin/role-assignments/*`: assignment administration.

Rules:

- Validate all external input at the controller boundary.
- Keep opaque session tokens in secure HttpOnly cookies.
- Return `401` for missing/invalid authentication and `403` for insufficient capability or scope.
- Frontend BFF routes forward the opaque session and never expose provider tokens.
- Collection endpoints must be bounded.
