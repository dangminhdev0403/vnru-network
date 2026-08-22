# Russia-Vietnam Science-Technology Intelligence Network System Architecture

## 1. Overview & Legal Baseline `[SOURCE]`

The **Russia-Vietnam Science-Technology Intelligence Network** is a bilateral knowledge, research, and technology cooperation platform.

- **Founder & Operator**: The **Traditions and Friendship Foundation** is the founder, owner, coordinator, and operator of the Network and the Portal.
- **Legal Position**: The Network is an independent cooperation initiative and is **not a separate legal entity**; it must not be assumed to be a portal of the two ministries or an intergovernmental program.
- **Single Window**: The Portal serves as the Network's "single window" connecting organizations (educational institutions, research institutes, scientific associations, enterprises) and individual scientists across Vietnam and the Russian Federation.

The architecture integrates six core business capabilities across three canonical architectural layers `[SOURCE]` and a cross-cutting analytics and observability foundation `[DESIGN]`.

---

## 2. Three-Layer Portal Architecture

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. User Interface & Multilingual Experience Layer (exp)            [SOURCE] │
│    - Trilingual (VI / RU / EN) + AI-assisted Terminology Translation        │
│    - Three Canonical Access Areas:                                          │
│      * Public / Discovery (Home, News/Events, Search, Knowledge, Experts,   │
│        Collaboration Opportunities)                                         │
│      * Role-based Workspace (Researcher, Reviewer, Enterprise, Org, Leader) │
│      * Governance & Administration (Foundation & System Operators only)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / Session
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. Business & Platform Services Layer (biz)                        [SOURCE] │
│    - Module 1: Identity & Access Governance (IAM / Security Gateway)        │
│    - Module 2: Knowledge Repository & Expert Directory                      │
│    - Module 3: Bilateral Research Collaboration & Project Management        │
│    - Module 4: Training, Knowledge Transfer & Academic Exchange             │
│    - Module 5: Technology Transfer & Enterprise Connection (inc. 2+2 Model) │
│    - Module 6: Internal Monitoring & Reporting Dashboard (Leadership/Admin) │
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
- **Multilingual Support**: First-class support for Vietnamese (`vi`), Russian (`ru`), and English (`en`).
- **AI-Assisted Translation**: Terminology translation assistance for specialized scientific and technical documents.
- **Three Canonical Access Areas `[SOURCE]`**:
  - *Public / Discovery*: Home, News / Events / Announcements, Global Search, Knowledge Repository, Expert Directory, and Collaboration Opportunities. Unauthenticated visitors can explore all approved public content without login.
  - *Role-based Workspace*: Authenticated members access workspaces scoped to active role/context (Researcher/Scientist, Reviewer, Enterprise, Organization Representative, Leadership). Organization/Agency users are not system administrators; they only access data/workflows within their granted scope.
  - *Governance & Administration*: Reserved strictly for Foundation and system operators for identity/access governance, workflow/data governance, security/audit monitoring, and KPI/report administration.

### 2.2. Layer 2: Business & Platform Services (`biz`) `[SOURCE]`
- Encapsulates domain workflow engines, business rules, paired submissions, independent/anonymized review, milestone tracking, and technology matching.
- Implemented as domain-bounded modular backend services grouped into business-family deployables with explicit module contracts.
- **Authoritative Security Boundary**: Business authorization and resource validation are enforced at backend service boundaries; frontend checks are UX conveniences only.

### 2.3. Layer 3: Infrastructure & Digital Sovereignty Security (`infra`) `[SOURCE]`
- Hybrid Cloud infrastructure compliant with data residency and sovereignty requirements of both nations.
- High-availability database clusters, isolated storage, disaster recovery, and hardware/software secret isolation.

### 2.4. Cross-Cutting: Analytics & KPI Foundation (`analytics`) `[DESIGN]`
- Standardized fact and metric definitions across all domains from the first module.
- Consumes domain events and fact snapshots to power internal monitoring dashboards, executive KPIs, and collaboration graphs.
- **Strict Rule**: The Analytics layer is a read-only consumer and MUST NOT act as a transactional source of truth for any business domain.

---

## 3. Six Business Capabilities & Domain Microservices

The six canonical capabilities map to domain modules hosted by business-family deployables:

| Module / Capability | Core Business Responsibility `[SOURCE]` | Owning Service & Implementation Status |
| --- | --- | --- |
| **1. Identity & Access Governance** | Unified identity, authentication, session, active authorization context resolution, RBAC policy enforcement, and security audit trail. Acts as security gateway; does not own business entity state. | `auth-service` *(Current Implementation)* |
| **2. Knowledge Repository & Expert Directory** | Publications, research outputs, expert profiles, organizations, topics, and partner recommendation signals. | `knowledge-service` (`PublicationsModule`, `DirectoryModule`) *(Current)* |
| **3. Bilateral Research Collaboration & Project Management** | Research opportunities, joint proposals, independent/anonymized peer review, collaboration decisions, and project tracking. `[DECISION]` *(Financial workflows are outside scope).* | `collaboration-service` (`CollaborationModule`, `ReviewsModule`, `ProjectsModule`) *(Current)* |
| **4. Training, Knowledge Transfer & Academic Exchange** | Seminars, professional activities, conferences/forums (including annual Vietnam–Russia Intellectual Forum), academic exchange, and knowledge dissemination. `[DECISION]` *(No separate financial-support branch).* | `academic-service` *(Target / Planned)* |
| **5. Technology Transfer & Enterprise Connection** | Technology catalog, enterprise demand posting, expressions of interest, bilateral collaboration cases, **2+2 consortium model** (1 VN Inst + 1 VN Ent + 1 RU Inst + 1 RU Ent), and IP/legal advisory support. | `technology-service` *(Target / Planned)* |
| **6. Internal Monitoring & Reporting Dashboard** | Internal dashboard and strategic reporting for Network leadership and Foundation management; tracks projects, expert connections, tech transfer activities, and aggregated KPIs. *(Internal workspace only; not a public area).* | `analytics-service`<br>(Analytics Layer) *(Target / Planned, Read-only)* |

> **State Note**: `auth-service`, `knowledge-service`, and `collaboration-service` are implemented. Academic, Technology, Analytics, and edge infrastructure remain planned.

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

1. **Module-Owned Persistence**: Each domain module owns its state. A deployable may host multiple isolated Prisma clients/databases during consolidation.
2. **Strict Boundary**: Direct cross-module repository/database access is forbidden. Use explicit application contracts in-process or public APIs/events across deployables.
3. **Transactional Integrity**: Database transactions are strictly local to a single microservice. Distributed multi-service database transactions are prohibited.
4. **Cache Policy**: Redis is used strictly for transient caching, session lookups, and rate limiting; it is never a primary persistence store.
5. **Analytics Data Boundary**: `analytics-service` stores materialized views, rollups, and fact tables for querying. It NEVER performs write operations on operational domain stores.

---

## 6. Unresolved Architecture Decisions

Architectural decisions requiring stakeholder confirmation (such as semantic search engine, paired proposal draft concurrency, double-blind unmasking rules, and 2+2 confirmation workflows) are tracked in the centralized register:
-> See [Open Decisions Register](OPEN_QUESTIONS.md).

