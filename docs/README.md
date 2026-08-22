# Russia-Vietnam Science-Technology Intelligence Network Documentation Index

Welcome to the Russia-Vietnam Science-Technology Intelligence Network governance, architecture, and portal documentation.

## Recommended Read Order

1. [Root AGENTS.md](../AGENTS.md): Workflow requirements, approval rules, and operational constraints.
2. [Global Architecture](ARCHITECTURE.md): Legal baseline (Traditions and Friendship Foundation operator), 3-Layer Portal architecture, 3 canonical access areas, microservice boundaries, sync/async communication, and data ownership.
3. [Domain Map](DOMAIN_MAP.md): Domain ownership, single source-of-truth rules, 6 business capability mappings, and extraction readiness.
4. [RBAC Architecture](RBAC_ARCHITECTURE.md): Member personas, business capability permissions (`<domain>.<resource>.<action>`), active authorization context, and backend enforcement.
5. [Global Rules](RULES.md): Authoritative repository policies, security model, data ownership, package management constraints.
6. [API Specification](API_SPEC.md): API contract source of truth, versioned event envelopes, and service-to-service communication.
7. [Open Decisions](OPEN_QUESTIONS.md): Centralized register of unresolved architectural and product decisions (OPEN-01 to OPEN-12).
8. Scope Documentation:
   - **Frontend**: [Frontend Architecture](../frontend/docs/ARCHITECTURE.md) | [Frontend Rules](../frontend/docs/RULES.md) | [Module Guide](../frontend/docs/MODULE_GUIDE.md) | [Runtime UI Guide](../frontend/docs/RUNTIME_UI_GUIDE.md) | [Contract Guide](../frontend/docs/CONTRACT_GUIDE.md) | [Query Resource Guide](../frontend/docs/QUERY_RESOURCE_GUIDE.md)
   - **Backend Services**: [Services Architecture](../services/docs/ARCHITECTURE.md) | [Services Rules](../services/docs/RULES.md) | [Service Guide](../services/docs/SERVICE_GUIDE.md)
9. [Pro-Max Verification Guide](VERIFICATION_GUIDE.md): Repository-wide selectable Quick / Integration / Browser UI / Full / Custom verification profiles, Chrome DevTools MCP browser requirements, failure-stop policy, and evidence matrix. `Pro-Max` names the guide/framework; users can simply ask to test or verify a module and then choose a profile.

## Portal Architectural Overview `[SOURCE]`

The Russia-Vietnam Science-Technology Intelligence Network is operated by the Traditions and Friendship Foundation as an independent bilateral cooperation initiative. The Portal operates across three canonical layers `[SOURCE]` plus a cross-cutting analytics layer `[DESIGN]`:

1. **User Interface & Multilingual Experience Layer (`exp`)**: Trilingual support (VI / RU / EN) with AI translation assistance across three canonical access areas:
   - *Public / Discovery*: Home, News/Events, Global Search, Knowledge Repository, Expert Directory, and Collaboration Opportunities.
   - *Role-based Workspace*: Persona-tailored workspaces for Researchers/Scientists, Reviewers, Enterprises, Organization Representatives, and Leadership.
   - *Governance & Administration*: Reserved for Foundation and system operators for identity, workflow, security/audit, and KPI administration.
2. **Business & Platform Services Layer (`biz`)**: 6 core business capabilities:
   - Module 1: Identity & Access Governance (IAM / Security Gateway).
   - Module 2: Knowledge Repository & Expert Directory.
   - Module 3: Bilateral Research Collaboration & Project Management (VN–RU joint research proposals, independent/anonymized peer review, collaboration decisions, and project milestone/progress tracking. `[DECISION]` Financial/funding workflows are excluded).
   - Module 4: Training, Knowledge Transfer & Academic Exchange (`[DECISION]` no separate financial-support branch).
   - Module 5: Technology Transfer & Enterprise Connection (technology supply, enterprise demand, direct collaboration, 2+2 consortium model, IP/legal advisory).
   - Module 6: Internal Monitoring & Reporting Dashboard (internal leadership/management dashboard; read-only fact consumer).
3. **Infrastructure & Digital Sovereignty Security Layer (`infra`)**: Hybrid Cloud deployment, disaster recovery, encryption for sensitive bilateral data, and immutable audit trails.
4. **Cross-Cutting Analytics & KPI Layer (`analytics`)**: Standardized fact collection and aggregation across all modules from Day 1; read-only consumer of facts/events with zero business write-back.

## State Distinction

- **Current State**: Next.js 16.3 scaffold in `frontend/` and NestJS 11 scaffold in `services/auth-service/` (Module 1 approved Keycloak/session baseline).
- **Target State**: Domain-oriented microservices (`auth-service`, `organization-service`, `knowledge-service`, `collaboration-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `analytics-service`, `api-gateway`) with PostgreSQL, Redis, and Kafka event bus.
