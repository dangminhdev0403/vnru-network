# 🇻🇳🇷🇺 VN-RU Network

### Vietnam–Russia Knowledge Network Platform

> A digital platform connecting **research, education, institutions, experts, and technology** between Vietnam and Russia.

<br>

![Architecture](https://img.shields.io/badge/Architecture-Microservices%20(Target)-0A0A0A)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016.3-000000)
![Backend](https://img.shields.io/badge/Backend-NestJS%2011-E0234E)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Events](https://img.shields.io/badge/Event%20Bus-Kafka%20(Target)-231F20)
![Cache](https://img.shields.io/badge/Cache-Redis-DC382D)
![License](https://img.shields.io/badge/License-Private-555555)

---

## ✦ Overview `[SOURCE]`

**VN-RU Network** is an independent bilateral cooperation initiative founded, owned, coordinated, and operated by the **Traditions and Friendship Foundation**. The Network is not a separate legal entity and serves as the single window connecting Vietnamese and Russian organizations (universities, research institutes, scientific associations, enterprises) and individual scientists.

The platform operates across three canonical architectural layers `[SOURCE]` and a cross-cutting analytics foundation `[DESIGN]`:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. User Interface & Multilingual Experience Layer (exp)     │
│    - Trilingual (VI / RU / EN) + AI Translation Assistance  │
│    - Three Canonical Access Areas:                          │
│      * Public / Discovery (Home, News/Events, Search)       │
│      * Role-based Workspace (Researcher, Reviewer, Enterprise)│
│      * Governance & Administration (Foundation/Operators)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Business & Platform Services Layer (biz)                 │
│    - Module 1: Identity & Access Governance (IAM)           │
│    - Module 2: Knowledge Repository & Expert Directory      │
│    - Module 3: Bilateral Research Funding & Project Mgmt    │
│    - Module 4: Training, Transfer & Academic Exchange       │
│    - Module 5: Technology Transfer & 2+2 Consortium Model   │
│    - Module 6: Internal Monitoring & Reporting Dashboard    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Infrastructure & Digital Sovereignty Layer (infra)       │
│    - Hybrid Cloud, DR, Encryption, Audit Logs               │
└─────────────────────────────────────────────────────────────┘
                               ▲
┌──────────────────────────────┴──────────────────────────────┐
│ Cross-Cutting: Analytics, KPI & Audit Layer (analytics)     │
│    - Read-only fact ingestion; zero business write-back     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Current State vs. Target Architecture

| Dimension | Current Implementation State | Planned Target Architecture |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16.3 scaffold in `frontend/` with Server Components, TanStack Query, and query-resource integration. | Complete Portal UI across Public Discovery, Persona Workspaces, Review Queue, Governance & Admin, and Internal Dashboard. |
| **Backend** | NestJS 11 scaffold in `services/auth-service/` for Identity, Keycloak OIDC broker & single-context session baseline. | Domain-oriented microservice ecosystem (`auth-service`, `organization-service`, `knowledge-service`, `grant-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `analytics-service`, `api-gateway`). |
| **Data & Storage** | Local PostgreSQL database connections per active service. | Database-per-service isolation (`auth_db`, `organization_db`, `grant_db`, etc.) with Redis caching. |
| **Messaging** | In-process transactional workflows. | Kafka Event Bus with Transactional Outbox pattern for asynchronous domain event propagation and fact streaming. |

---

## 🧩 Six Business Capabilities `[SOURCE]`

| Capability | Business Responsibility | Owning Target Service |
| :--- | :--- | :--- |
| 🔐 **1. Identity & Access Governance** | Unified identity, Keycloak OIDC authentication, session lifecycle, active context resolution, RBAC policy enforcement, and security audit log. | `auth-service` *(Current)* |
| 🏛️ **2. Knowledge Repository & Expert Directory** | Publications repository, patents, proceedings, researcher CVs, integrated search, and partner recommendations. | `knowledge-service`<br>`organization-service` *(Target)* |
| 💰 **3. Bilateral Research Funding & Project Management** | Independent funding opportunities (Foundation/sponsor managed), VN–RU joint proposals, independent/anonymized peer review, decisions within Foundation authority, and project tracking. *(State budget authority remains with competent state bodies).* | `grant-service`<br>`review-service`<br>`project-service` *(Target)* |
| 🎓 **4. Training, Knowledge Transfer & Academic Exchange** | Seminars, professional activities, conferences/forums (including annual Vietnam–Russia Intellectual Forum), academic exchange, and knowledge dissemination. `[DECISION]` *(No separate financial-support branch).* | `academic-service` *(Target)* |
| 🚀 **5. Technology Transfer & Enterprise Connection** | Technology marketplace, enterprise demands, expressions of interest (EOI), **2+2 consortium collaborations** (1 VN Inst + 1 VN Ent + 1 RU Inst + 1 RU Ent), and IP/transfer advisory. | `technology-service` *(Target)* |
| 📊 **6. Internal Monitoring & Reporting Dashboard** | Internal monitoring and strategic reporting for Network leadership and Foundation management; tracks projects, expert connections, and tech transfer. *(Internal workspace only).* | `analytics-service` *(Target, Read-only)* |

---

## 🏗️ Target Microservices Topology

```text
                         ┌────────────────────┐
                         │     Next.js        │
                         │  Web Portal (exp)  │
                         └─────────┬──────────┘
                                   │ HTTP/REST
                                   ▼
                         ┌────────────────────┐
                         │    API Gateway     │
                         └─────────┬──────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │    Auth     │          │ Organization│          │  Knowledge  │
   │   Service   │          │   Service   │          │   Service   │
   │  (Current)  │          │  (Target)   │          │  (Target)   │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │    Grant    │          │   Review    │          │   Project   │
   │   Service   │          │   Service   │          │   Service   │
   │  (Target)   │          │  (Target)   │          │  (Target)   │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │ Outbox Events
                                   ▼
                            ┌─────────────┐
                            │    Kafka    │
                            │  Event Bus  │
                            └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              Notification      Search        Analytics
                Service         Indexer        Service
               (Target)        (Target)       (Target)
```

---

## 📁 Repository Structure

```text
vnru-network/
│
├── frontend/                  # Next.js 16.3 Web Portal (Current Implementation)
│   ├── src/app/               # App Router pages and product surfaces
│   ├── src/features/          # Domain-specific UI features
│   └── docs/                  # Frontend architecture & rules
│
├── services/                  # Backend Services
│   ├── auth-service/          # Identity, Authentication & RBAC (Current Implementation)
│   │
│   │  # --- Target / Planned Microservices ---
│   ├── api-gateway/           # Edge routing & rate limiting (Target)
│   ├── organization-service/  # Institutions & expert directory (Target)
│   ├── knowledge-service/     # Digital scientific repository (Target)
│   ├── grant-service/         # Bilateral funding opportunities & joint proposals (Target)
│   ├── review-service/        # Independent peer review management (Target)
│   ├── project-service/       # Joint research projects & milestones (Target)
│   ├── academic-service/      # Academic activities & knowledge exchange (Target)
│   ├── technology-service/    # Tech marketplace & 2+2 consortiums (Target)
│   └── analytics-service/     # Internal monitoring & strategic reporting (Target)
│
├── shared/                    # Shared Technical Contracts
│   └── api-contract/          # Exported OpenAPI specifications & types
│
├── infrastructure/            # Infrastructure Deployment Definitions
│   ├── postgres/              # Database scripts & configs
│   ├── redis/                 # Cache configs
│   └── kafka/                 # Event bus definitions
│
├── docs/                      # Authoritative Repository & Architecture Docs
│   ├── README.md              # Documentation index & reading order
│   ├── ARCHITECTURE.md        # 3-Layer Portal system architecture & 3 access areas
│   ├── DOMAIN_MAP.md          # Business capability & data ownership map
│   ├── RBAC_ARCHITECTURE.md   # Personas & permission taxonomy
│   ├── RULES.md               # Authoritative governance & development rules
│   ├── API_SPEC.md            # API contract standards & event envelopes
│   └── OPEN_QUESTIONS.md      # Centralized register of open decisions (OPEN-01..12)
│
├── deploy/                    # Docker compose & deployment configurations
└── scripts/                   # Workspace development scripts
```

---

## ⚙️ Technology Stack

### Frontend (Current)
- **Framework**: Next.js 16.3 (App Router, Server Components by default)
- **Language**: TypeScript 5
- **Data Fetching**: `@tanstack/react-query` + `@dangminhdev04032005/query-resource`
- **Styling**: Tailwind CSS v4

### Backend (Current & Target)
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Contract Standard**: OpenAPI exported from backend code (`npm run openapi:export`)
- **Architecture**: Modular backend with database-per-service microservice boundaries

### Infrastructure (Target)
- **Primary Database**: PostgreSQL (isolated database per microservice)
- **Caching & Sessions**: Redis (never primary source of truth)
- **Event Streaming**: Kafka with Transactional Outbox pattern
- **Search & Analytics**: OpenSearch / pgvector (Search) + Analytics aggregation engine

---

## 🔐 Security & Access Governance

Authentication and authorization are strictly enforced at backend service boundaries:

```text
User (Subject) ──> Authenticates (Keycloak OIDC Broker)
                         │
                         ▼
             Resolve Active Context
  ┌──────────────────────┬──────────────────────┐
  ▼                      ▼                      ▼
Context A:             Context B:             Context C:
Researcher @ Univ X    Reviewer @ Board Y     Organization Rep @ Univ X
(grants.proposals.*)   (reviews.assignments.*)(organization.members.*)
```

- **Backend Authority**: Backend services are the single security boundary. Frontend visibility checks are UX conveniences only.
- **Fail-Closed Security**: Missing authentication, missing permissions, or invalid resource scopes result in `401`/`403`.
- **Capability Keys**: Permissions use `<domain>.<resource>.<action>` format.
- **Independent Review Isolation**: Reviewers only access assigned proposals; author identities and institutional affiliations are masked according to review policy.

---

## 🗄️ Data Ownership Principles

Each microservice owns its persistence store exclusively:

```text
auth_db | organization_db | knowledge_db | grant_db | review_db | project_db | academic_db | technology_db | analytics_db
```

1. **No Cross-Service Database Access**: Services must never query another service's database directly.
2. **Contract Integration**: Inter-service coordination uses public REST APIs or versioned domain events.
3. **Analytics Non-Transactional Rule**: `analytics-service` stores materialized fact rollups and KPI metrics; it NEVER acts as a transactional source of truth and NEVER mutates business state.

---

## 📖 Documentation Index

| Document | Purpose |
| :--- | :--- |
| [docs/README.md](docs/README.md) | Documentation index, reading order & state distinctions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 3-Layer Portal architecture, 3 access areas & data boundaries |
| [docs/DOMAIN_MAP.md](docs/DOMAIN_MAP.md) | Six business capabilities, model ownership & dependency rules |
| [docs/RBAC_ARCHITECTURE.md](docs/RBAC_ARCHITECTURE.md) | Personas, capability keys, active context & independent review |
| [docs/RULES.md](docs/RULES.md) | Authoritative global rules, security & package governance |
| [docs/API_SPEC.md](docs/API_SPEC.md) | OpenAPI contract policy, REST scopes & versioned event envelopes |
| [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) | Centralized open decisions register (OPEN-01 through OPEN-12) |

---

## 🚀 Development Quickstart

```bash
# Install dependencies
pnpm install

# Start development infrastructure
docker compose -f deploy/docker-compose.dev.yml up -d

# Start Next.js frontend
pnpm --dir frontend dev

# Start auth-service backend
npm --prefix services/auth-service run start:dev
```

---

<div align="center">

### VN-RU Network

**Connecting Knowledge · Research · Education · Technology**

🇻🇳 Vietnam   ×   🇷🇺 Russia

</div>


