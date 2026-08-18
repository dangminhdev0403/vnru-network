# VN-RU Network — Centralized Open Decisions & Unresolved Questions

This document serves as the **single source of truth** for open architectural and product decisions identified across the VN-RU Network Portal analysis.

> **Rule**: Agents and engineers must **not** silently make implementation decisions for items marked `[OPEN]`. Each item must be explicitly resolved with stakeholders before locking production schema or contracts.

---

## Open Decisions Register

| ID | Title & Question | Category | Architectural & Product Impact | Status |
| --- | --- | --- | --- | --- |
| **OPEN-01** | **Identity Provider (IdP) Specification**<br>Which specific IdP(s) will be used for SSO integration across Vietnam and Russia institutions (e.g., Gov/Edu SSO, OpenID Connect, SAML 2.0, Gosuslugi/VNeID federation)? | IAM / Security | Affects `auth-service` provider adapters, token validation, user provisioning, account linking, session management, and logout federation. | **Resolved: 2026-08-18** — Keycloak acts as the identity broker; `auth-service` integrates with Keycloak through OpenID Connect. Institution-specific upstream providers stay behind Keycloak. |
| **OPEN-02** | **Active Authorization Context Resolution**<br>Can a single user operate concurrently in multiple contexts/roles (e.g., Researcher in Institution A + Reviewer on Board B), or is the user locked to a single active context per session? | IAM / RBAC / UX | Affects active authorization context resolution, session token structure, workspace switching UX, and resource-scoped permission evaluation. | **Resolved: 2026-08-18** — Each session has exactly one active authorization context. Switching replaces that session's active context after assignment/scope validation and rotates the session token; permissions are never unioned across contexts. |
| **OPEN-03** | **Knowledge & Expert Moderation Governance**<br>Who has authority to publish, edit, or curate Knowledge Repository records and Expert profiles? Is there an institutional moderation queue, automated external sync (ORCID/Scopus), or direct self-publication? | Knowledge / Expert | Affects `knowledge-service` and `organization-service` state machines (draft → moderation → published), approval workflows, and role permissions. | Unresolved |
| **OPEN-04** | **Semantic Search & Partner Matching Engine**<br>Which search and matching technologies should power semantic search and partner recommendations (e.g., PostgreSQL pgvector, Elasticsearch/OpenSearch, dedicated Graph DB, or hybrid)? | Search / Data Infra | Affects data indexing pipelines, asynchronous event consumers, infrastructure footprint, query performance, and recommendation accuracy. | Unresolved |
| **OPEN-05** | **Paired Proposal Collaboration & Joint Confirmation**<br>For VN–RU joint research proposals, what is the exact mechanism for Vietnamese and Russian teams to jointly draft, review, and mutually confirm/lock the proposal before submission? | Grants / UX | Affects `grant-service` concurrency control, optimistic locking vs collaborative editing, draft versioning, and submission state machine. | Unresolved |
| **OPEN-06** | **Peer Review Anonymization & Disclosure Rules**<br>Which specific fields must be masked during independent/anonymized peer review, and what are the rules/authority for revealing information post-evaluation if required by policy? | Review / Security | Affects `review-service` data projection, authorization boundaries, proposal snapshotting, audit logging, and conflict-of-interest checks. | Unresolved |
| **OPEN-07** | **Project Milestone & Progress Acceptance Hierarchy**<br>Who has authority to submit, review, and approve research project milestones and progress reports (e.g., Lead Researcher, Organization Representative, Foundation Program Manager)? | Project / PMS | Affects `project-service` workflow states, approval chains, and role-based milestone sign-offs for Foundation-funded research. | Unresolved |
| **OPEN-08** | **Academic Activity Moderation & Registration Rules**<br>Which academic activities (seminars, forums, training) require registration/waitlist/approval, who may publish directly vs operator moderation, and do attendance certificates exist? `[DECISION]` *(No financial/scholarship branch).* | Academic Exchange | Affects `academic-service` registration state machine, capacity management, organizer scope validation, and attendee notifications. | Unresolved |
| **OPEN-09** | **Technology Transfer & 2+2 Collaboration Scope**<br>What are the exact state transitions for Expressions of Interest (EOI), NDA/licensing advisory workflows, and the official confirmation mechanism for each of the 4 slots in a 2+2 consortium? | Tech Transfer | Affects `technology-service` collaboration state machines, 2+2 structural validation rules, and IP/legal advisory document references. | Unresolved |
| **OPEN-10** | **KPI Dictionary Governance & Versioning**<br>Who defines and approves the canonical KPI dictionary for internal monitoring and leadership reporting, and how are historical formula changes versioned? | Analytics / Governance | Affects `analytics-service` aggregation schemas, historical metric comparability, rollup pipelines, and report auditability. | Unresolved |
| **OPEN-11** | **Internal Dashboard Latency & Freshness Target**<br>What level of data latency is required for internal leadership dashboards (e.g., near-real-time streaming vs hourly/daily batch rollups)? | Analytics / Infra | Affects analytics pipeline architecture (Kafka fact streaming vs scheduled batch rollups), caching strategy, and database sizing. | Unresolved |
| **OPEN-12** | **Cross-Border Data Governance & Export Policies**<br>Which specific entity details and aggregate metrics may be displayed publicly or exported across national borders under Vietnamese and Russian data regulations? | Compliance / Security | Affects data residency rules, data masking, export filters, and cross-border API transmission policies. | Unresolved |

---

## Guidelines for Resolving Open Decisions

1. When a decision is formally agreed upon with system stakeholders, update the status to `Resolved: [Date] — [Summary of Decision]`.
2. Update the corresponding domain documentation (`docs/ARCHITECTURE.md`, `docs/DOMAIN_MAP.md`, `docs/RBAC_ARCHITECTURE.md`, etc.) with the ratified requirement.
3. Keep this file updated as new open decisions emerge during detailed module design phases.

---

## Module 1 Approved Technical Baseline — 2026-08-18

- Persistence: PostgreSQL owned by `auth-service`, accessed through Prisma migrations.
- Authentication: Keycloak broker over OIDC Authorization Code Flow with PKCE.
- Session: random opaque token in a `Secure`, `HttpOnly`, `SameSite` cookie; PostgreSQL stores only its SHA-256 digest. No JWT access/refresh tokens.
- Authorization: exactly one active context per session; context switch rotates the session token.
- 2FA: Keycloak-native TOTP. `auth-service` trusts the verified OIDC authentication level; it does not store TOTP secrets or implement TOTP itself. Recovery behavior stays in Keycloak policy.
- Validation: Zod at controller/config trust boundaries.
- Audit: append-only IAM/security records in the `auth-service` PostgreSQL database.
- Deferred: Redis, Kafka/outbox, API Gateway, application-owned TOTP, extra IdPs in application code, concurrent contexts, ABAC/policy engine, and frontend work.

### Approved package changes for the first implementation slices

Runtime dependencies: `@prisma/client`, `@prisma/adapter-pg`, `pg`, `openid-client`, `zod`, `cookie-parser`.

Development dependencies: `prisma`, `@types/cookie-parser`.

Use pnpm from `services/auth-service/` so `package.json` and `pnpm-lock.yaml` change together. Do not add packages outside this list without separate approval. Reuse Node.js `crypto` for PKCE entropy, opaque session tokens, and SHA-256 token digests; do not add crypto or TOTP wrappers.

