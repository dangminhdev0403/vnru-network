# VN-RU Network Documentation Index

Welcome to the VN-RU Network governance, architecture, and portal documentation.

## Recommended Read Order

1. [Root AGENTS.md](../AGENTS.md): Workflow requirements, approval rules, and operational constraints.
2. [Global Architecture](ARCHITECTURE.md): 3-Layer Portal architecture, system layout, microservice boundaries, sync/async communication, and data ownership.
3. [Domain Map](DOMAIN_MAP.md): Domain ownership, single source-of-truth rules, 6 business capability mappings, and extraction readiness.
4. [RBAC Architecture](RBAC_ARCHITECTURE.md): Persona profiles, business capability permissions (`<domain>.<resource>.<action>`), active authorization context, and backend enforcement.
5. [Global Rules](RULES.md): Authoritative repository policies, security model, data ownership, package management constraints.
6. [API Specification](API_SPEC.md): API contract source of truth, versioned event envelopes, and service-to-service communication.
7. [Open Decisions](OPEN_QUESTIONS.md): Centralized register of unresolved architectural and product decisions (OPEN-01 to OPEN-12).
8. Scope Documentation:
   - **Frontend**: [Frontend Architecture](../frontend/docs/ARCHITECTURE.md) | [Frontend Rules](../frontend/docs/RULES.md) | [Module Guide](../frontend/docs/MODULE_GUIDE.md) | [Runtime UI Guide](../frontend/docs/RUNTIME_UI_GUIDE.md) | [Contract Guide](../frontend/docs/CONTRACT_GUIDE.md)
   - **Backend Services**: [Services Architecture](../services/docs/ARCHITECTURE.md) | [Services Rules](../services/docs/RULES.md) | [Service Guide](../services/docs/SERVICE_GUIDE.md)

## Portal Architectural Overview

The VN-RU Knowledge Network Portal operates across three canonical layers `[SOURCE]` plus a cross-cutting analytics layer `[DESIGN]`:

1. **User Interface & Multilingual Experience Layer (`exp`)**: Trilingual support (VI / RU / EN) with AI translation assistance; persona-tailored public discovery, authenticated workspaces, reviewer queues, and administrative consoles.
2. **Business & Platform Services Layer (`biz`)**: 6 core business capabilities — IAM/Governance, Knowledge & Expert Directory, Bilateral Grants/PMS & Review, Academic Exchange & Language Hub, Technology Transfer & 2+2 Collaboration, and Science Diplomacy Dashboard.
3. **Infrastructure & Digital Sovereignty Security Layer (`infra`)**: Hybrid Cloud deployment, disaster recovery, encryption for sensitive bilateral data, and immutable audit trails.
4. **Cross-Cutting Analytics & KPI Layer (`analytics`)**: Standardized fact collection and aggregation across all modules from Day 1; read-only consumer of facts/events with zero business write-back.

## State Distinction

- **Current State**: Next.js 16.3 scaffold in `frontend/` and NestJS 11 scaffold in `services/auth-service/`.
- **Target State**: Domain-oriented microservices (`auth-service`, `organization-service`, `knowledge-service`, `grant-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `analytics-service`, `api-gateway`) with PostgreSQL, Redis, and Kafka event bus.

