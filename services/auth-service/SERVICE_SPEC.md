# Auth Service Specification — Module 1

## 1. Purpose

`auth-service` implements Module 1: **Unified Administration, Identity & Authentication** for VN-RU Network.

This service is the platform-level source of truth for IAM: internal identities, authentication, login sessions, access context, roles/permissions, and authentication-related security policies.

The service does not own business capabilities from organization, expert, grant, review, project, academic, technology, knowledge, or analytics domains.

## 2. Current State

The current base only locks the internal module boundaries:

```txt
src/modules/
  identity/
  authentication/
  session/
  access-control/
  security/
```

These modules are registered in `AppModule`, but no domain entities, controllers, persistence, JWT, SSO/IdP, 2FA implementation, or migrations have been added yet.

## 3. Responsibility Boundaries

### 3.1 `identity`

Owns the internal identity of a user in VN-RU Network.

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

Primary question: **Who is this person inside VN-RU Network?**

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

`access-control` does not decide business state for domain resources. Grant, Review, Project, and other business services must still validate ownership, assignment, workflow state, and their own domain rules.

Primary question: **In the active context, which platform capabilities may this identity use?**

### 3.5 `security`

Owns authentication-related security policies.

Responsibilities:

- 2FA policy;
- failed authentication policy;
- account lock/disable security rules;
- suspicious authentication policy;
- security events required by Module 1.

It must not become a second user store or session store.

Primary question: **Which additional security controls must be satisfied before access is trusted?**

## 4. Core Flows

### 4.1 Login

```txt
Client
  -> authentication
  -> external IdP / authentication provider
  -> identity resolve/link
  -> identity account-status check
  -> security policy / 2FA when required
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
  -> target business service
  -> business service validates resource scope + workflow state
```

IAM provides baseline access only. The owning business service remains the source of truth for authorization that depends on resource scope and business workflow state.

### 4.3 Logout

```txt
Client
  -> authentication logout orchestration
  -> session revoke
  -> security/audit hook when required
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
FundingCall
Proposal
ReviewAssignment
Project
Scholarship
Technology
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
- Business permissions do not replace resource ownership or workflow validation in the owning business service.
- Do not audit every UI interaction; audit only IAM/security actions that have traceability value.
- Do not lock the IdP, token model, or multi-context behavior before the corresponding decision is resolved.

## 8. Auth Service Output Contract

The long-term goal is to provide a stable authenticated request context to other services. At a logical level it contains:

```txt
userId
sessionId
activeContext
organizationScope? / stable scope references
permissions
authenticationLevel
```

Final field names and transport contracts must only be locked when API/session design is implemented and added to OpenAPI.

## 9. Directly Related OPEN Decisions

- **OPEN-01** — exact SSO / Identity Provider selection.
- **OPEN-02** — final multi-role / multi-context model and switching behavior.

No implementation may silently close these two decisions.

## 10. Not Implemented Yet

The current base intentionally does not include:

- JWT / Passport;
- a concrete SSO provider;
- DB/ORM/Prisma schema or migrations;
- a concrete 2FA mechanism;
- role/permission seed data;
- public authentication endpoints;
- a separate audit module/service;
- event publishing;
- new dependencies/packages.

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
- provide a consistent authenticated context to other services;
- administer users/roles/access according to IAM policy;
- record IAM/security events that require traceability;
- deny access safely when identity/session/context is invalid.
