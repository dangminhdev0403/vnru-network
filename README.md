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

## ✦ Overview

**VN-RU Network** is a bilateral digital platform designed to connect and manage cooperation between Vietnamese and Russian organizations, researchers, students, enterprises, and governance stakeholders.

The platform supports the complete collaboration lifecycle across three canonical architectural layers `[SOURCE]` and a cross-cutting analytics foundation `[DESIGN]`:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. User Interface & Multilingual Experience Layer (exp)     │
│    - Trilingual (VI / RU / EN) + AI Translation Assistance  │
│    - Public Discovery, Persona Workspaces, Review Queue     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Business & Platform Services Layer (biz)                 │
│    - IAM & Governance                                       │
│    - Knowledge Repository & Expert Directory                │
│    - Bilateral Grants / PMS & Peer Review                   │
│    - Academic Exchange & Pushkin Virtual Hub                │
│    - Technology Transfer & 2+2 Consortium Model             │
│    - Science Diplomacy Dashboard & Strategic Reporting      │
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
| **Frontend** | Next.js 16.3 scaffold in `frontend/` with Server Components, TanStack Query, and query-resource integration. | Complete Portal UI across Public Discovery, Persona Workspaces, Review Queue, Governance, and Dashboard. |
| **Backend** | NestJS 11 scaffold in `services/auth-service/` for Identity, Authentication & RBAC baseline. | Domain-oriented microservice ecosystem (`auth-service`, `organization-service`, `knowledge-service`, `grant-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `analytics-service`, `api-gateway`). |
| **Data & Storage** | Local PostgreSQL database connections per active service. | Database-per-service isolation (`auth_db`, `organization_db`, `grant_db`, etc.) with Redis caching. |
| **Messaging** | In-process transactional workflows. | Kafka Event Bus with Transactional Outbox pattern for asynchronous domain event propagation and fact streaming. |

---

## 🧩 Six Business Capabilities `[SOURCE]`

| Capability | Business Responsibility | Owning Target Service |
| :--- | :--- | :--- |
| 🔐 **IAM & Unified Governance** | Identity federation, SSO, 2FA policies, active context resolution & RBAC | `auth-service` *(Current)* |
| 🏛️ **Knowledge & Expert Directory** | Publications repository, patents, researcher CVs & partner recommendations | `knowledge-service`<br>`organization-service` *(Target)* |
| 💰 **Bilateral Grants, PMS & Review** | Bilateral calls, paired VN/RU submissions, double-blind review, milestones & acceptance | `grant-service`<br>`review-service`<br>`project-service` *(Target)* |
| 🎓 **Academic Exchange & Language Hub** | Scholarships, Pushkin Virtual Hub (courses, exams, certs) & youth practice | `academic-service` *(Target)* |
| 🚀 **Technology Transfer & 2+2** | Technology marketplace, enterprise demands, 2+2 consortiums & IP advisory | `technology-service` *(Target)* |
| 📊 **Science Diplomacy Dashboard** | Executive bilateral KPIs, collaboration network mapping & strategic reporting | `analytics-service` *(Target, Read-only)* |

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
│   ├── grant-service/         # Bilateral funding calls & paired proposals (Target)
│   ├── review-service/        # Double-blind peer review management (Target)
│   ├── project-service/       # Joint research projects & milestones (Target)
│   ├── academic-service/      # Scholarships & Pushkin language hub (Target)
│   ├── technology-service/    # Tech marketplace & 2+2 consortiums (Target)
│   └── analytics-service/     # Strategic KPI & collaboration analytics (Target)
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
│   ├── ARCHITECTURE.md        # 3-Layer Portal system architecture
│   ├── DOMAIN_MAP.md          # Business capability & data ownership map
│   ├── RBAC_ARCHITECTURE.md   # Persona profiles & permission taxonomy
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
User (Subject) ──> Authenticates (SSO / 2FA)
                         │
                         ▼
             Resolve Active Context
  ┌──────────────────────┬──────────────────────┐
  ▼                      ▼                      ▼
Context A:             Context B:             Context C:
Researcher @ Univ X    Reviewer @ Panel Y     Institution Admin @ Univ X
(grants.proposals.*)   (reviews.evaluations.*) (organization.members.*)
```

- **Backend Authority**: Backend services are the single security boundary. Frontend visibility checks are UX conveniences only.
- **Fail-Closed Security**: Missing authentication, missing permissions, or invalid resource scopes result in `401`/`403`.
- **Capability Keys**: Permissions use `<domain>.<resource>.<action>` format.
- **Double-Blind Isolation**: Reviewers only access assigned proposals; author identities and institutional affiliations are strictly stripped.

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
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 3-Layer Portal architecture, topology & data boundaries |
| [docs/DOMAIN_MAP.md](docs/DOMAIN_MAP.md) | Six business capabilities, model ownership & dependency rules |
| [docs/RBAC_ARCHITECTURE.md](docs/RBAC_ARCHITECTURE.md) | Personas, capability keys, active context & double-blind review |
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

