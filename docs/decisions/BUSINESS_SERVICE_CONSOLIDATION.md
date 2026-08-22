# Business Service Consolidation

Status: IMPLEMENTED — modular business-family service topology

## Decision

The platform uses domain-bounded modular backend services organized by business family. Identity and Access remains an independent trust service; scientific knowledge, expert, organization and matching capabilities are hosted by the Knowledge Service; the bilateral research lifecycle from opportunity and proposal through independent review, collaboration decision and project execution is hosted by the Collaboration Service. Academic Exchange, Technology & Enterprise Connection, and read-only Analytics remain independent business families and may be implemented as separate deployables when their development begins. Internal domain modules retain exclusive state ownership and are designed for future service extraction when scale, deployment, security, compliance or team ownership justifies the operational cost.

## Current deployables

```text
auth-service
knowledge-service
  PublicationsModule
  DirectoryModule
collaboration-service
  CollaborationModule
  ReviewsModule
  ProjectsModule
```

No numbered service names are used. Academic, Technology, and Analytics remain target deployables; no empty applications are created.

## Persistence

Process consolidation does not merge data stores. Knowledge uses `KNOWLEDGE_DATABASE_URL` and `ORGANIZATION_DATABASE_URL`; Collaboration uses `COLLAB_DATABASE_URL`, `REVIEW_DATABASE_URL`, and `PROJECT_DATABASE_URL`. Each module receives its own generated Prisma client and injection token.

Every business state has exactly one owning domain module. A domain module may be hosted inside a larger deployable service. No other module may directly mutate its owned state.

## Contracts

Existing HTTP namespaces remain stable:

```text
/api/v1/publications/*
/api/v1/experts/*
/api/v1/collab/*
/api/v1/reviews/*
/api/v1/projects/*
```

In-process application contracts are sufficient inside one deployable. Versioned events remain appropriate for asynchronous external consumers, analytics, search, notifications, and future extracted services.

## Review and Project boundaries

Reviews own anonymized immutable proposal snapshots and never resolve hidden participant identities through Collaboration persistence. Projects own project members, milestones, reports, outcomes, completion, and termination. `LEAD` and `MEMBER` remain project resource roles, not IAM roles.

## Extraction criteria

Extract a module only when its contract is stable and independent scale, deployment cadence, security/compliance, or team ownership justifies the operational overhead.
