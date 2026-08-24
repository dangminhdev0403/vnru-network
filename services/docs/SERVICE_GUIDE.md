# Module 1 Service Guide

The current service is `auth-service`. Its controllers handle transport, application services own workflows and authorization decisions, and Prisma adapters own persistence.

Internal modules:

- identity: platform user and federated identity linkage;
- authentication: Keycloak OIDC orchestration;
- session: opaque session lifecycle;
- access-control: roles, permissions, assignments and active context;
- security: MFA policy state and append-only security audit.

Keep controllers thin, validate trust boundaries, use local database transactions for multi-write invariants and never expose provider tokens to the frontend.
