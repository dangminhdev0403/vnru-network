# VN-RU Network System Architecture

## Overview

VN-RU Network is a bilateral platform connecting research, education, institutions, experts, and technology between Vietnam and Russia.

## Microservice Boundaries

The system is structured around domain-oriented microservices:

- **API Gateway**: Entry point for routing, rate limiting, and edge request handling.
- **Auth Service**: Identity management, authentication, user profiles, and RBAC policies.
- **Organization Service**: Institutions, academic departments, researchers, and expert network.
- **Knowledge Service**: Scientific publications, documents, and knowledge assets.
- **Grant Service**: Funding programs, calls for proposals, and grant allocations.
- **Review Service**: Peer review management and reviewer assignments.
- **Project Service**: Joint research projects, milestones, progress tracking, and deliverables.
- **Academic Service**: Scholarships and academic exchange programs.
- **Technology Service**: Technology transfer catalog and enterprise collaboration.
- **Analytics Service**: Collaboration intelligence and reporting.

## System Topology & Communication

```text
Frontend (Next.js) ──[HTTP/REST]──> API Gateway ──[HTTP/REST]──> Microservices (NestJS)
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

### Communication Patterns

- **Synchronous**: Frontend clients communicate via the API Gateway using REST over HTTP.
- **Asynchronous**: Cross-service state synchronization uses event-driven messaging with Kafka and the Transactional Outbox pattern.

## Data Ownership & Storage

- **Database-per-Service**: Each microservice owns its isolated database schema (e.g., `auth_db`, `organization_db`, `grant_db`, etc.).
- **Strict Boundary**: Direct cross-service database access or shared database schemas are forbidden. Cross-domain queries must go through public APIs or domain events.
- **Cache**: Redis is reserved for caching and temporary session data; it is never a primary source of truth.
