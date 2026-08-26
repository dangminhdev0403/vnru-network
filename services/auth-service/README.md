# Auth Service — Module 1 Base

## Purpose

`auth-service` is the legacy package name of the single backend modular monolith. It currently implements Module 1: unified administration, identity and authentication for Russia-Vietnam Science-Technology Intelligence Network.

IAM modules own IAM state only. Future organization, content, knowledge and management capabilities belong in the same application as separate domain modules with their own tables, repositories and application contracts.

Detailed service contract and Module 1 ownership rules: [`SERVICE_SPEC.md`](./SERVICE_SPEC.md).

## Current Base

The current backend separates Module 1 into four modules with implemented behavior:

```txt
src/modules/
  identity/
  authentication/
  session/
  access-control/
```

`src/database/DatabaseModule` owns one shared Prisma client and PostgreSQL pool. The modules above own identity, opaque sessions, authentication orchestration and dynamic RBAC. There is no standalone security module until a separate security policy lifecycle exists.

## Internal Module Responsibilities

### `identity`

Owns the internal identity of a platform user:

- user identity;
- external/federated identity linkage;
- account status;
- identity linking rules.

Primary question: **Who is this person inside Russia-Vietnam Science-Technology Intelligence Network?**

### `authentication`

Owns authentication orchestration:

- login entry flow;
- SSO / external IdP integration boundary;
- authentication callback flow;
- logout orchestration;
- step-up / 2FA orchestration when required by security policy.

Primary question: **How has this identity proved who it is?**

`authentication` does not own user identity state or session persistence. It coordinates the owning modules.

### `session`

Owns authenticated session lifecycle:

- session creation;
- current session state;
- expiration;
- refresh/renewal when later approved by the authentication design;
- revoke one session;
- revoke all sessions for an identity when required.

Primary question: **Is this authenticated session still valid?**

### `access-control`

Owns IAM authorization context and baseline access policy:

- roles;
- permissions;
- role assignments;
- active authorization context;
- permission resolution;
- baseline authorization decisions.

Primary question: **In the active context, what platform capabilities may this identity use?**

Owning domain modules remain responsible for resource ownership, workflow state, and domain-specific authorization rules.

## Responsibility Flow

### Login

```txt
Client
  -> authentication
  -> external IdP / authentication provider
  -> identity
  -> authentication-level policy when required
  -> access-control context resolution
  -> session creation
  -> authenticated result
```

### Authenticated request

```txt
Request
  -> session validation
  -> identity/account status validation
  -> access-control context + permission resolution
  -> target domain module
  -> domain module validates resource scope and workflow state
```

### Logout

```txt
Client
  -> authentication logout orchestration
  -> session revoke
  -> audit hook when required
  -> completed
```

## Boundary Rules

- `identity` owns identity state; other internal modules must not duplicate user records.
- `session` owns session lifecycle; authentication only orchestrates it.
- `access-control` owns roles, permissions, assignments, and active authorization context.
- Security checks remain in the flow that enforces them until a distinct policy lifecycle justifies its own module.
- Business-domain authorization stays in the owning domain module.
- Organization/researcher/expert data is not owned by `auth-service`; only stable references may appear in authorization context when required.
- Do not import repositories or persistence internals across module boundaries; call the owning module's typed application contract.

## Module Growth Pattern

When a module becomes complex, grow it using the repository service convention:

```txt
<module>/
  api/
  application/
  domain/
  infrastructure/
  tests/
  <module>.module.ts
  <module>-public.ts   # only when an intentional public internal contract is needed
```

Do not create empty architecture folders before they are needed.

## Technical Decisions Baseline `[DECISION]`

The Module 1 technical baseline is approved as follows:

- **Authentication**: Auth.js Credentials verifies the ignored runtime account config and exchanges a short-lived signed assertion for an opaque backend session.
- **Session**: Random opaque token in a `Secure`, `HttpOnly`, `SameSite` cookie; PostgreSQL stores only its SHA-256 digest. No JWT access/refresh tokens.
- **Authorization Context**: Exactly one active context per session; context switching validates assignment/scope and rotates the session token (resolves OPEN-02).
- **2FA**: not available with the current Credentials provider.
- **Persistence & Validation**: PostgreSQL with Prisma migrations; Zod validation at trust boundaries.
- **Audit**: Append-only IAM and security event logging in PostgreSQL.

## Current Non-Goals

The current slice does not introduce:

- Application-level JWT or Passport;
- In-app TOTP secret generation;
- Redis, Kafka, brokers or internal HTTP between modules;
- Public authentication endpoints before approved slice implementation;
- Concurrent multi-context sessions.
