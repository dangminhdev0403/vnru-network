# VN-RU Network Documentation Index

Welcome to the VN-RU Network governance and architecture documentation.

## Recommended Read Order

1. [Root AGENTS.md](../AGENTS.md): Workflow requirements, approval rules, and operational constraints.
2. [Global Architecture](ARCHITECTURE.md): System layout, microservice boundaries, current vs target state, sync/async communication.
3. [Global Rules](RULES.md): Authoritative repository policies, security model, data ownership, package management constraints.
4. Scope Documentation:
   - **Frontend**: [Frontend Architecture](../frontend/docs/ARCHITECTURE.md) | [Frontend Rules](../frontend/docs/RULES.md)
   - **Backend Services**: [Services Architecture](../services/docs/ARCHITECTURE.md) | [Services Rules](../services/docs/RULES.md)

## State Distinction

- **Current State**: Next.js 16.3 scaffold in `frontend/` and NestJS 11 scaffold in `services/auth-service/`.
- **Target State**: Microservice ecosystem (`auth-service`, `organization-service`, `knowledge-service`, `grant-service`, `review-service`, `project-service`, `academic-service`, `technology-service`, `api-gateway`) with PostgreSQL, Redis, and Kafka.
