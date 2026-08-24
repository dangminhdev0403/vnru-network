# Module 1 RBAC Architecture

Keycloak authenticates a person. `auth-service` resolves that identity to one opaque application session, one active authorization context, roles, resource scopes and capability keys.

Capability keys use `<domain>.<resource>.<action>`. The current frontend consumes Module 1 capabilities such as `iam.users.manage`, `iam.roles.manage` and `iam.audit.view` to shape navigation. Backend guards remain authoritative.

Each session has exactly one active context. Switching context validates the assignment and scope, rotates the session token and never unions permissions from different contexts.

Member self-service is available at `/account` and `/security`. Governance operators use `/admin/access/*` and `/admin/audit`.
