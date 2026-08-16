# VN-RU Network System Architecture

## 1. Overview & System Purpose

The **VN-RU Knowledge Network** is a bilateral knowledge, research, and technology platform connecting researchers, universities, research institutes, government agencies, and enterprises between Vietnam and the Russian Federation.

The architecture integrates six core business capabilities across three canonical architectural layers `[SOURCE]` and a cross-cutting analytics and observability foundation `[DESIGN]`.

---

## 2. Three-Layer Portal Architecture

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. User Interface & Multilingual Experience Layer (exp)            [SOURCE] │
│    - Trilingual (VI / RU / EN) + AI-assisted Terminology Translation        │
│    - Public Discovery, Persona Workspaces, Review Queue, Governance Console  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / Session
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. Business & Platform Services Layer (biz)                        [SOURCE] │
│    - Unified IAM & Governance                                               │
│    - Knowledge Repository & Expert Directory                                │
│    - Bilateral Grants / PMS & Multi-Stage Double-Blind Review               │
│    - Academic Exchange & Pushkin Virtual Hub                                │
│    - Technology Transfer & 2+2 Consortium Model                             │
│    - Science Diplomacy Dashboard & Strategic Reporting                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Infrastructure APIs / DB Ports
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 3. Infrastructure & Digital Sovereignty Security Layer (infra)     [SOURCE] │
│    - Hybrid Cloud deployment complying with bilateral data regulations      │
│    - Backup, Disaster Recovery, and Secret Management                       │
│    - At-rest and in-transit encryption for sensitive bilateral data         │
└─────────────────────────────────────────────────────────────────────────────┘
                                       ▲
                                       │ Standardized Facts / Event Stream
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ Cross-Cutting: Analytics, KPI & Immutable Audit Trail (analytics)   [DESIGN]│
│    - Standardized fact collection across all modules from Day 1             │
│    - Read-only KPI aggregation & Collaboration Network Graph                │
│    - Zero transactional write-back to business domains                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Layer 1: User Interface & Multilingual Experience (`exp`) `[SOURCE]`
- **Multilingual Support**: First-class support for Vietnamese, Russian, and English.
- **AI-Assisted Translation**: Terminology translation assistance for specialized scientific and technical documents.
- **Persona-Driven Product Surfaces**:
  - *Public / Discovery*: Home, global search, digital library, expert directory, opportunity catalogs.
  - *Authenticated Workspaces*: Tailored workspaces for Researchers, Students, Reviewers, Institutions, Enterprises, and Government Agencies.
  - *Governance & Administration*: Identity, access control, workflow orchestration, and audit consoles.
  - *Executive Analytics*: Strategic Science Diplomacy dashboard.

### 2.2. Layer 2: Business & Platform Services (`biz`) `[SOURCE]`
- Encapsulates domain workflow engines, business rules, paired submissions, peer-review anonymization, and milestone acceptance.
- Implemented as modular, domain-bounded microservices with explicit public contracts.

### 2.3. Layer 3: Infrastructure & Digital Sovereignty Security (`infra`) `[SOURCE]`
- Hybrid Cloud infrastructure compliant with data residency and sovereignty requirements of both nations.
- High-availability database clusters, isolated storage, disaster recovery, and hardware/software secret isolation.

### 2.4. Cross-Cutting: Analytics & KPI Foundation (`analytics`) `[DESIGN]`
- Standardized fact and metric definitions across all domains from the first module.
- Consumes domain events and fact snapshots to power strategic dashboards, KPIs, and collaboration graphs.
- **Strict Rule**: The Analytics layer is a read-only consumer and MUST NOT act as a transactional source of truth for any business domain.

---

## 3. Six Business Capabilities & Domain Microservices

The six source capabilities map to domain-oriented microservices (Target Architecture):

| Module / Capability | Core Business Responsibility `[SOURCE]` | Owning Service & Implementation Status |
| --- | --- | --- |
| **1. Unified IAM & Governance** | Identity federation, SSO, 2FA policy, active authorization context resolution, and RBAC policy enforcement. | `auth-service` *(Current Implementation)* |
| **2. Knowledge & Expert Network** | Digital scientific repository (publications, patents, proceedings), expert mapping, researcher CVs, and partner recommendation signals. | `knowledge-service`<br>`organization-service` *(Target / Planned)* |
| **3. Bilateral Grants / PMS & Review** | Bilateral funding calls, paired submission confirmation (VN Co-PI + RU Co-PI), double-blind multi-stage peer review, joint project tracking, milestones, bilateral financial reporting, overdue alerts, and acceptance. | `grant-service`<br>`review-service`<br>`project-service` *(Target / Planned)* |
| **4. Academic Exchange & Language Hub** | Scholarship & quota management, Pushkin Virtual Hub (courses, exams, certifications, events), and young researcher / JINR practice opportunities. | `academic-service` *(Target / Planned)* |
| **5. Technology Transfer & Enterprise Connection** | Technology catalog, enterprise demand posting, expressions of interest, 2+2 consortium collaborations (1 VN Inst + 1 VN Ent + 1 RU Inst + 1 RU Ent), and bilateral IP/legal advisory catalog. | `technology-service` *(Target / Planned)* |
| **6. Science Diplomacy Dashboard** | Executive KPIs for Intergovernmental Committee, collaboration network mapping (cities, institutes, emerging topics), trend analysis, and strategic report export. | `analytics-service`<br>(Analytics Layer) *(Target / Planned, Read-only)* |

> **State Note**: Currently, `auth-service` is implemented under `services/auth-service/`. Additional domain services and edge infrastructure represent the planned target microservices architecture.

---

## 4. System Topology & Communication (Target Architecture)


```text
Frontend (Next.js 16.3) ──[HTTP/REST]──> API Gateway ──[HTTP/REST]──> Microservices (NestJS)
                                                                           │
                                                                       [Outbox]
                                                                           │
                                                                           ▼
                                                                    Kafka Event Bus
                                                                           │
                                                                  ┌────────┼────────┐
                                                                  ▼        ▼        ▼
                                                             Notification Search Analytics
```

### 4.1. Communication Patterns
- **Synchronous (Request/Response)**: Frontend clients communicate through the `api-gateway` using REST over HTTP with OpenAPI contracts.
- **Asynchronous (Event-Driven)**: Cross-service state synchronization and analytics ingestion use Kafka domain events published via the Transactional Outbox pattern.
- **Audit Logging**: Security-critical and governance actions emit immutable audit events to the centralized audit trail.

---

## 5. Data Ownership & Storage Principles

1. **Database-per-Service**: Each microservice owns its isolated database schema (e.g., `auth_db`, `organization_db`, `knowledge_db`, `grant_db`, `review_db`, `project_db`, `academic_db`, `technology_db`, `analytics_db`).
2. **Strict Boundary**: Direct cross-service database access, cross-schema joins, or shared tables are strictly forbidden. Cross-domain data retrieval must use public APIs or domain events.
3. **Transactional Integrity**: Database transactions are strictly local to a single microservice. Distributed multi-service database transactions are prohibited.
4. **Cache Policy**: Redis is used strictly for transient caching, session lookups, and rate limiting; it is never a primary persistence store.
5. **Analytics Data Boundary**: `analytics-service` stores materialized views, rollups, and fact tables for querying. It NEVER performs write operations on operational domain stores.

---

## 6. Unresolved Architecture Decisions

Architectural decisions requiring stakeholder confirmation (such as IdP selection, multi-context switching, semantic search engine, and paired proposal concurrency) are tracked in the centralized register:
-> See [Open Decisions Register](OPEN_QUESTIONS.md).

