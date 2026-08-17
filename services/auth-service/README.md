# Auth Service — Module 1 Base

## Purpose

`auth-service` implements Module 1: unified administration, identity and authentication for VN-RU Network.

This service owns the IAM boundary only. It must not absorb business ownership from organization, grant, review, project, academic, technology, knowledge, or analytics domains.

## Current Base

The current base intentionally separates Module 1 into five internal modules from the start:

```txt
src/modules/
  identity/
  authentication/
  session/
  access-control/
  security/
```

At this stage these are structural module boundaries only. There are no domain entities, persistence adapters, SSO/JWT providers, migrations, or 2FA implementations yet.

## Internal Module Responsibilities

### `identity`

Owns the internal identity of a platform user:

- user identity;
- external/federated identity linkage;
- account status;
- identity linking rules.

Primary question: **Who is this person inside VN-RU Network?**

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

Business services remain responsible for resource ownership, workflow state, and domain-specific authorization rules.

### `security`

Owns authentication security policy:

- 2FA policy;
- failed authentication policy;
- account lock/disable security rules;
- suspicious authentication policy;
- security events required by Module 1.

Primary question: **What additional security controls must be satisfied before access is trusted?**

## Responsibility Flow

### Login

```txt
Client
  -> authentication
  -> external IdP / authentication provider
  -> identity
  -> security policy / 2FA when required
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
  -> target business service
  -> business service validates resource scope and workflow state
```

### Logout

```txt
Client
  -> authentication logout orchestration
  -> session revoke
  -> security/audit hook when required
  -> completed
```

## Boundary Rules

- `identity` owns identity state; other internal modules must not duplicate user records.
- `session` owns session lifecycle; authentication only orchestrates it.
- `access-control` owns roles, permissions, assignments, and active authorization context.
- `security` owns security policy; it must not become a second user/session store.
- Business-domain authorization stays in the owning business service.
- Organization/researcher/expert data is not owned by `auth-service`; only stable references may appear in authorization context when required.
- Do not import repositories or persistence internals across service boundaries.

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

## Open Decisions

The base must not silently lock unresolved product decisions:

- **OPEN-01** — exact SSO / Identity Provider choice;
- **OPEN-02** — final multi-role / multi-context switching model.

The module boundaries are designed so these decisions can be implemented later without collapsing Module 1 into one large `identity` module.

## Current Non-Goals

This base does not yet introduce:

- JWT or Passport;
- SSO provider implementation;
- database/ORM integration or migrations;
- 2FA mechanism implementation;
- role/permission seed data;
- public authentication endpoints;
- a separate audit module/service;
- new dependencies or package/lockfile changes.
