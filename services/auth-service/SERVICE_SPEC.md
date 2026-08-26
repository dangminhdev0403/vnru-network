# Auth Service Specification — Module 1

## 1. Purpose

`auth-service` is the legacy package name of the single backend modular monolith. It currently implements Module 1: **Unified Administration, Identity & Authentication** for Russia-Vietnam Science-Technology Intelligence Network.

This service is the platform-level source of truth for IAM: internal identities, authentication, login sessions, access context, roles/permissions, and authentication-related security policies.

IAM modules do not own organization, expert, content, knowledge or portal-management state. Those capabilities belong in sibling domain modules inside the same application.

## 2. Current State

The current runtime implements four internal module boundaries:

```txt
src/modules/
  identity/
  authentication/
  session/
  access-control/
```

These modules use one shared `DatabaseModule`/Prisma pool. Identity, opaque sessions, Auth.js assertion exchange, dynamic RBAC, IAM administration and migrations are implemented. Application JWT and 2FA are not implemented.

## 3. Responsibility Boundaries

### 3.1 `identity`

Owns the internal identity of a user in Russia-Vietnam Science-Technology Intelligence Network.

Responsibilities:

- `User` / internal identity;
- external/federated identity linkage;
- account status;
- identity linking and merging rules.

Does not own:

- researcher/expert profiles;
- organization profiles;
- sessions;
- roles/permissions;
- provider-specific authentication flows.

Primary question: **Who is this person inside Russia-Vietnam Science-Technology Intelligence Network?**

### 3.2 `authentication`

Owns authentication orchestration.

Responsibilities:

- login entry flow;
- SSO / external IdP boundary;
- authentication callback;
- logout orchestration;
- step-up/2FA orchestration when required by security policy.

Does not own:

- user state;
- session persistence;
- role/permission state.

Primary question: **How has this identity proved who it is?**

### 3.3 `session`

Owns the authenticated session lifecycle.

Responsibilities:

- create a session after successful authentication;
- validate the current session;
- expiration;
- refresh/renewal if approved by the later session design;
- revoke one session;
- revoke all sessions for a user when required.

Primary question: **Is this authenticated session still valid?**

### 3.4 `access-control`

Owns the IAM baseline access policy.

Responsibilities:

- Role;
- Permission;
- RoleAssignment;
- Active Authorization Context;
- permission resolution;
- baseline authorization decisions.

Principle:

```txt
Identity
+ active context
+ platform permissions
= baseline access decision
```

`access-control` does not decide business state for domain resources. The owning domain module must still validate ownership, assignment, workflow state and its own rules.

Primary question: **In the active context, which platform capabilities may this identity use?**

## 4. Core Flows

### 4.1 Login

```txt
Client
  -> authentication
  -> external IdP / authentication provider
  -> identity resolve/link
  -> identity account-status check
  -> authentication-level policy when required
  -> access-control context resolution
  -> session creation
  -> authenticated result
```

The expected login result is an authenticated session bound to an internal `userId` and a valid authorization context. Token/session transport details are intentionally deferred to the corresponding implementation slice.

### 4.2 Authenticated Request

```txt
Request
  -> session validation
  -> identity/account status validation
  -> access-control resolves active context + permissions
  -> target domain module
  -> domain module validates resource scope + workflow state
```

IAM provides baseline access only. The owning domain module remains the source of truth for authorization that depends on resource scope and workflow state.

### 4.3 Logout

```txt
Client
  -> authentication logout orchestration
  -> session revoke
  -> audit hook when required
  -> completed
```

`authentication` orchestrates logout; `session` owns session invalidation.

### 4.4 Active Context Switching

Implement only after OPEN-02 is resolved.

Expected direction:

```txt
Authenticated user
  -> load allowed contexts
  -> select target context
  -> access-control validates assignment/scope
  -> activate context
  -> resolve permissions for that context
```

Permissions from different contexts must not be combined by default.

## 5. Logical Data Ownership

The following models logically belong to `auth-service`, but are not yet an approved persistence schema:

```txt
identity
  User
  ExternalIdentity

session
  Session

access-control
  Role
  Permission
  RoleAssignment
  AuthorizationContext

security
  SecurityPolicy / SecurityEvent required for IAM
```

The following models do **not** belong to `auth-service`:

```txt
Organization
Researcher
ExpertProfile
FundingOpportunity
JointProposal
ReviewAssignment
Project
AcademicActivity
TechnologyProfile
Publication
```


If authorization context requires organization/resource scope, store only the stable references needed by IAM; do not copy business records into `auth-service`.

## 6. Dependency Direction

Internal dependencies must be intentional and must not create dependency cycles.

Primary orchestration flow:

```txt
authentication
  -> identity
  -> security
  -> access-control
  -> session
```

Modules should use public contracts once a boundary is complex enough to justify `*-public.ts`. Do not import repositories or persistence implementations from another internal module as a shortcut.

## 7. Security Invariants

- The backend is the source of truth for authentication and authorization.
- Endpoints are private by default; public endpoints must be explicitly declared and tested.
- Access decisions must fail closed when required identity/session/context data is missing.
- Disabled or suspended users must not continue using sessions indefinitely.
- Business permissions do not replace resource ownership or workflow validation in the owning domain module.
- Do not audit every UI interaction; audit only IAM/security actions that have traceability value.
- Do not lock the IdP, token model, or multi-context behavior before the corresponding decision is resolved.

## 8. Auth Service Output Contract

The backend provides a stable authenticated request context to sibling domain modules. At a logical level it contains:

```txt
userId
sessionId
activeContext
organizationScope? / stable scope references
permissions
authenticationLevel
```

Final field names and transport contracts must only be locked when API/session design is implemented and added to OpenAPI.

## 9. Approved Technical Baseline `[DECISION]`

- **OPEN-01**: External institutional identity federation is not implemented; current authentication uses Auth.js Credentials.
- **OPEN-02**: Exactly one active context per session. Context switching validates assignment/scope and rotates the session token.

## 10. Current Implementation Baseline

The approved implementation baseline for Module 1 specifies:

- PostgreSQL persistence with Prisma migrations;
- Auth.js Credentials assertion verification;
- Random opaque session tokens in HttpOnly cookies (storing SHA-256 digests in PostgreSQL);
- Zod validation at trust boundaries;
- Append-only PostgreSQL security audit logging.

Not part of the modular-monolith direction:
- Application-level JWTs / Passport;
- internal HTTP, Redis coordination, Kafka or an outbox between modules;
- Public authentication endpoints before approved slice implementation.


## 11. Implementation Direction

The expected implementation order is capability-driven; do not create all folders in advance:

```txt
1. identity model + persistence boundary
2. authentication provider boundary
3. session lifecycle
4. current-user/session contract
5. access-control context + RBAC
6. security policy / 2FA
7. IAM administration + selective audit
```

Each slice must preserve the boundaries in this document, add corresponding tests, and expand module structure only when real code requires it.

## 12. Module 1 Completion Criteria

Module 1 is capability-complete when the system can:

- resolve a unique internal user from an approved authentication flow;
- manage user state and external identity linkage;
- create, validate, expire, and revoke sessions;
- enforce the approved 2FA/security policy;
- resolve the active authorization context;
- resolve roles/permissions within that context;
- provide a consistent authenticated context to sibling domain modules;
- administer users/roles/access according to IAM policy;
- record IAM/security events that require traceability;
- deny access safely when identity/session/context is invalid.
