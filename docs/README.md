# VN-RU Network Documentation Index

Welcome to the VN-RU Network governance, architecture, and portal documentation.

## Recommended Read Order

1. [Root AGENTS.md](../AGENTS.md): Workflow requirements, approval rules, and operational constraints.
2. [Global Architecture](ARCHITECTURE.md): Legal baseline (Traditions and Friendship Foundation operator), 3-Layer Portal architecture, 3 canonical access areas, microservice boundaries, sync/async communication, and data ownership.
3. [Domain Map](DOMAIN_MAP.md): Domain ownership, single source-of-truth rules, 6 business capability mappings, and extraction readiness.
4. [RBAC Architecture](RBAC_ARCHITECTURE.md): Member personas, business capability permissions (`<domain>.<resource>.<action>`), active authorization context, and backend enforcement.
5. [Global Rules](RULES.md): Authoritative repository policies, security model, data ownership, package management constraints.
6. [API Specification](API_SPEC.md): API contract source of truth, versioned event envelopes, and service-to-service communication.
7. [Open Decisions](OPEN_QUESTIONS.md): Centralized register of unresolved architectural and product decisions (OPEN-01 to OPEN-12).
8. Scope Documentation:
   - **Frontend**: [Frontend Architecture](../frontend/docs/ARCHITECTURE.md) | [Frontend Rules](../frontend/docs/RULES.md) | [Module Guide](../frontend/docs/MODULE_GUIDE.md) | [Runtime UI Guide](../frontend/docs/RUNTIME_UI_GUIDE.md) | [Contract Guide](../frontend/docs/CONTRACT_GUIDE.md)
   - **Backend Services**: [Services Architecture](../services/docs/ARCHITECTURE.md) | [Services Rules](../services/docs/RULES.md) | [Service Guide](../services/docs/SERVICE_GUIDE.md)

## Portal Architectural Overview `[SOURCE]`

The VN-RU Network Portal is operated by the Traditions and Friendship Foundation as an independent bilateral cooperation initiative. The Portal operates across three canonical layers `[SOURCE]` plus a cross-cutting analytics layer `[DESIGN]`:

1. **User Interface & Multilingual Experience Layer (`exp`)**: Trilingual support (VI / RU / EN) with AI translation assistance across three canonical access areas:
   - *Public / Discovery*: Home, News/Events, Global Search, Knowledge Repository, Expert Directory, and Collaboration Opportunities.
   - *Role-based Workspace*: Persona-tailored workspaces for Researchers/Scientists, Reviewers, Enterprises, Organization Representatives, and Leadership.
   - *Governance & Administration*: Reserved for Foundation and system operators for identity, workflow, security/audit, and KPI administration.
2. **Business & Platform Services Layer (`biz`)**: 6 core business capabilities:
   - Module 1: Identity & Access Governance (IAM / Security Gateway).
   - Module 2: Knowledge Repository & Expert Directory.
   - Module 3: Bilateral Research Funding & Project Management (Independent funding lifecycle; Foundation manages Foundation funds; state budget authority remains with competent state bodies).
   - Module 4: Training, Knowledge Transfer & Academic Exchange (`[DECISION]` no separate financial-support branch).
   - Module 5: Technology Transfer & Enterprise Connection (technology supply, enterprise demand, direct collaboration, 2+2 consortium model, IP/legal advisory).
   - Module 6: Internal Monitoring & Reporting Dashboard (internal leadership/management dashboard; read-only fact consumer).
3. **Infrastructure & Digital Sovereignty Security Layer (`infra`)**: Hybrid Cloud deployment, disaster recovery, encryption for sensitive bilateral data, and immutable audit trails.
4. **Cross-Cutting Analytics & KPI Layer (`analytics`)**: Standardized fact collection and aggregation across all modules from Day 1; read-only consumer of facts/events with zero business write-back.

## State Distinction

- **Current State**: Next.js 16.3 scaffold in `frontend/` and NestJS 11 scaffold in `services/auth-service/` (Module 1 approved Keycloak/session baseline).
- **Target State**: Domain-oriented microservices (`auth-service`, `organization-service`, `knowledge-service`, `grant-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `analytics-service`, `api-gateway`) with PostgreSQL, Redis, and Kafka event bus.

