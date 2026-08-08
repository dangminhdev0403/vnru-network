# 🇻🇳🇷🇺 VN-RU Network

### Vietnam–Russia Knowledge Network Platform

> A digital platform connecting **research, education, institutions, experts, and technology** between Vietnam and Russia.

<br>

![Architecture](https://img.shields.io/badge/Architecture-Microservices-0A0A0A)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-000000)
![Backend](https://img.shields.io/badge/Backend-NestJS-E0234E)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Events](https://img.shields.io/badge/Event%20Bus-Kafka-231F20)
![Cache](https://img.shields.io/badge/Cache-Redis-DC382D)
![License](https://img.shields.io/badge/License-Private-555555)

---

## ✦ Overview

**VN-RU Network** is a bilateral digital platform designed to connect and manage cooperation between Vietnamese and Russian organizations, researchers, students, enterprises, and governance stakeholders.

The platform supports the complete collaboration lifecycle:

```text
┌─────────────┐
│  Identity   │
└──────┬──────┘
       ↓
┌─────────────────────┐
│ Organizations       │
│ & Expert Network    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Knowledge Repository│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Programs & Funding  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Research Proposal   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Peer Review         │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Research Projects   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Academic Exchange   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Technology Transfer │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Analytics           │
└─────────────────────┘
```

---

## 🧩 Core Modules

| Module               | Responsibility                                 |
| :------------------- | :--------------------------------------------- |
| 🔐 **Auth**          | Authentication, users, roles & RBAC            |
| 🏛️ **Organization** | Institutions, departments & experts            |
| 📚 **Knowledge**     | Publications, documents & knowledge            |
| 💰 **Grant**         | Programs, calls, proposals & funding           |
| 🧑‍⚖️ **Review**     | Reviewer assignment & peer review              |
| 🔬 **Project**       | Research projects, milestones & reports        |
| 🎓 **Academic**      | Scholarships & academic exchange               |
| 🚀 **Technology**    | Technology transfer & enterprise collaboration |
| 📊 **Analytics**     | Collaboration intelligence & reporting         |

---

## 🏗️ Architecture

VN-RU Network follows a **domain-oriented microservices architecture**.

```text
                         ┌────────────────────┐
                         │     Next.js        │
                         │      Frontend      │
                         └─────────┬──────────┘
                                   │
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
   └─────────────┘          └─────────────┘          └─────────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │    Grant    │          │   Review    │          │   Project   │
   │   Service   │          │   Service   │          │   Service   │
   └─────────────┘          └─────────────┘          └─────────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   ▼
                            ┌─────────────┐
                            │    Kafka    │
                            │ Event Bus   │
                            └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              Notification      Search        Analytics
```

---

## 📁 Repository

```text
vnru-network/
│
├── frontend/                  # Next.js Web Portal
│
├── services/                  # Backend Microservices
│   ├── api-gateway/
│   ├── auth-service/
│   ├── organization-service/
│   ├── knowledge-service/
│   ├── grant-service/
│   ├── review-service/
│   ├── project-service/
│   ├── academic-service/
│   └── technology-service/
│
├── packages/                  # Shared Technical Packages
│   ├── contracts/
│   ├── shared-kernel/
│   ├── config/
│   ├── logger/
│   └── observability/
│
├── infrastructure/            # Infrastructure
│   ├── postgres/
│   ├── redis/
│   ├── kafka/
│   ├── opensearch/
│   ├── object-storage/
│   └── keycloak/
│
├── docs/                      # Architecture Documentation
├── deploy/                    # Deployment
└── scripts/                   # Development Scripts
```

---

## ⚙️ Technology Stack

### Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

### Backend

```text
NestJS
TypeScript
REST API
Event-driven Architecture
```

### Infrastructure

```text
PostgreSQL
Redis
Kafka
OpenSearch
S3-compatible Object Storage
Keycloak / OIDC
Docker
```

### Observability

```text
OpenTelemetry
Prometheus
Grafana
```

---

## 🔐 Security Model

Authentication and authorization are centralized through the Auth Service.

```text
User
 │
 ▼
Authentication
 │
 ▼
Role
 │
 ▼
Permission
 │
 ▼
Resource
 │
 ▼
Organization / Scope
```

Frontend authorization is **not** considered a security boundary.

Every backend service must enforce authorization for its own resources.

---

## 🔄 Service Communication

### Synchronous

```text
Frontend
   │
   ▼
API Gateway
   │
   ▼
Business Service
```

### Asynchronous

```text
Business Service
       │
       ▼
     Outbox
       │
       ▼
     Kafka
       │
 ┌─────┼──────────┐
 ▼     ▼          ▼
Review Notification Analytics
```

Typical domain events:

```text
UserCreated
ProposalSubmitted
ReviewCompleted
ProjectApproved
ProjectCompleted
TechnologyPublished
ScholarshipAwarded
```

---

## 🗄️ Data Ownership

Each service owns its own data boundary.

```text
auth_db
organization_db
knowledge_db
grant_db
review_db
project_db
academic_db
technology_db
```

> Services must never directly query another service's database.

Cross-service data synchronization is handled through **API contracts and domain events**.

---

## 📐 Architecture Principles

```text
Domain Ownership
        +
Database Ownership
        +
Explicit Service Boundaries
        +
Event-driven Communication
        +
Resource-level Authorization
        +
Observability
```

### Core rules

* Business logic belongs to its owning service.
* No cross-service database access.
* Transactions remain inside service boundaries.
* Long-running operations should be asynchronous.
* Large collections use cursor-based pagination where appropriate.
* Redis is used for caching/session workloads, not as the source of truth.
* API and event contracts are versioned.
* Distributed tracing is enabled across service boundaries.

---

## 🛣️ Roadmap

```text
01  Foundation
    └── Architecture / Infrastructure

02  Authentication
    └── Users / Roles / Permissions / RBAC

03  Organization
    └── Institutions / Researchers / Experts

04  Knowledge
    └── Repository / Publications / Documents

05  Grant
    └── Programs / Calls / Proposals / Funding

06  Review
    └── Reviewer / Assignment / Peer Review

07  Project
    └── Milestones / Reports / Budget / Acceptance

08  Academic
    └── Scholarships / Exchange / Programs

09  Technology
    └── Technology Transfer / Enterprise / 2+2

10  Analytics
    └── Collaboration Intelligence / Reporting
```

---

## 📖 Documentation

Architecture documentation:

```text
docs/
├── ARCHITECTURE.md
├── DOMAIN_MAP.md
├── SERVICE_BOUNDARY.md
├── EVENT_FLOW.md
├── DATA_ARCHITECTURE.md
├── RBAC_ARCHITECTURE.md
└── API_CONTRACT.md
```

---

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker compose -f deploy/docker-compose.dev.yml up -d

# Start frontend
pnpm --dir frontend dev

# Start a service
pnpm --dir services/auth-service start:dev
```

---

<div align="center">

### VN-RU Network

**Connecting Knowledge · Research · Education · Technology**

🇻🇳 Vietnam   ×   🇷🇺 Russia

</div>
