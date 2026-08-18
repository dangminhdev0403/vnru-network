# VN-RU Network — Centralized Open Decisions & Unresolved Questions

This document serves as the **single source of truth** for open architectural and product decisions identified during the Portal design integration pass.

> **Rule**: Agents and engineers must **not** silently make implementation decisions for items marked `[OPEN]`. Each item must be explicitly resolved with stakeholders before locking production schema or contracts.

---

## Open Decisions Register

| ID | Title & Question | Category | Architectural & Product Impact | Status |
| --- | --- | --- | --- | --- |
| **OPEN-01** | **Identity Provider (IdP) Specification**<br>Which specific IdP(s) will be used for SSO integration across Vietnam and Russia institutions (e.g., Gov/Edu SSO, OpenID Connect, SAML 2.0, Gosuslugi/VNeID federation)? | IAM / Security | Affects `auth-service` provider adapters, token validation, user provisioning, account linking, session management, and logout federation. | Resolved: 2026-08-18 — Keycloak acts as the identity broker; `auth-service` integrates with Keycloak through OpenID Connect. Institution-specific upstream providers stay behind Keycloak. |
| **OPEN-02** | **Multi-Context & Multi-Role Switching**<br>Can a single user operate concurrently in multiple contexts/roles (e.g., Researcher in Institution A + Reviewer on Panel B + Institution Admin), or is the user locked to a single primary persona per session? | IAM / RBAC / UX | Affects active authorization context resolution, JWT payload/claims structure, session state in API Gateway, workspace switching UX, and resource-scoped permission evaluation. | Resolved: 2026-08-18 — Each session has exactly one active authorization context. Switching replaces that session's active context after assignment/scope validation; permissions are never unioned across contexts. |
| **OPEN-03** | **Knowledge & Expert Moderation Governance**<br>Who has authority to publish, edit, or curate Digital Repository records and Expert profiles? Is there an institutional moderation queue, automated external sync (ORCID/Scopus), or direct self-publication? | Knowledge / Expert | Affects `knowledge-service` and `organization-service` state machines (draft → pending_review → published), approval workflows, and role permissions. | Unresolved |
| **OPEN-04** | **Semantic Search & Partner Matching Engine**<br>Which search and matching technologies should power semantic search and partner recommendations (e.g., PostgreSQL pgvector, Elasticsearch/OpenSearch, dedicated Graph DB like Neo4j, or hybrid)? | Search / Data Infra | Affects data indexing pipelines, asynchronous event consumers, infrastructure footprint, query performance, and recommendation accuracy. | Unresolved |
| **OPEN-05** | **Paired Proposal Concurrency & Draft Collaboration**<br>For paired bilateral proposals (VN Co-PI + RU Co-PI), does one party create the draft while the other confirms/signs, or can both parties edit the proposal concurrently in real time? | Grants / UX | Affects `grant-service` concurrency control, optimistic locking vs operational transformation / CRDTs, draft versioning, and state transitions. | Unresolved |
| **OPEN-06** | **Double-Blind Peer Review Anonymization & Unmasking**<br>Which specific fields must be stripped/masked during double-blind peer review, and who (if anyone) holds the cryptographic/procedural authority to unmask author identities after evaluation? | Review / Security | Affects `review-service` data projection, authorization boundaries, proposal snapshotting, audit logging, and conflict-of-interest checks. | Unresolved |
| **OPEN-07** | **Milestone & Bilateral Financial Report Approval Hierarchy**<br>Who has the authority to submit, review, and approve project milestones and bilateral financial reports (e.g., PI, Institutional Financial Officer, Bilateral Joint Committee, Funding Agency)? | Project / PMS | Affects `project-service` workflow states, multi-party approval chains, disbursement triggers, and role-based milestone sign-offs. | Unresolved |
| **OPEN-08** | **Academic Hub Transactional Scope (Payments vs Applications)**<br>Does the Academic Hub process monetary transactions (e.g., tuition fees, exam fees, grant stipends via payment gateway), or does it only track applications, quotas, and certificates? | Academic Hub | Affects `academic-service` compliance scope, PCI-DSS / banking gateway integrations, currency conversions (VND/RUB), and financial audit rules. | Unresolved |
| **OPEN-09** | **Technology Transfer Transactional Scope**<br>Is Technology Transfer a full transaction marketplace (with binding commercial agreements, escrow, licensing fees) or a matchmaking, NDAs, and collaboration workflow platform? | Tech Transfer | Affects `technology-service` legal/compliance contracts, workflow complexity, billing integration, and IP licensing state machine. | Unresolved |
| **OPEN-10** | **KPI Dictionary Governance & Versioning**<br>Who defines and approves the KPI calculation dictionary for Science Diplomacy reporting, and how are historical definition changes versioned? | Analytics / Governance | Affects `analytics-service` aggregation schemas, historical metric comparability, rollup pipelines, and report auditability. | Unresolved |
| **OPEN-11** | **Science Diplomacy Dashboard Latency & Real-Time Requirements**<br>What level of latency is acceptable for executive dashboards and collaboration maps (e.g., true real-time WebSocket streaming, hourly micro-batches, or daily fact rollups)? | Analytics / Infra | Affects analytics pipeline architecture (streaming Kafka/Flink vs scheduled batch OLAP/PostgreSQL rollups), caching strategy, and database sizing. | Unresolved |
| **OPEN-12** | **Cross-Border Data Sovereignty & External Export Policies**<br>Which specific entities and aggregate metrics may be displayed publicly or exported across national borders under Vietnamese and Russian data protection laws? | Compliance / Security | Affects data residency rules, data masking, export filters, IP restrictions, and cross-border API transmission policies. | Unresolved |

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
