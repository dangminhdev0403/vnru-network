# VN-RU Network Domain Map

## 1. Purpose

This document maps business domains, capability ownership, and persistent data boundaries across the VN-RU Network microservices.

It enforces the fundamental architectural principle: **Every business state has exactly one owning service.** No domain or dashboard may directly mutate or own another domain's state.

---

## 2. Six Business Capabilities & Domain Mapping

| Capability `[SOURCE]` | Domain / Service | Business Responsibility `[SOURCE]` | Owned Models & State (Single Source of Truth) | Allowed Upstream Dependencies | Status |
| --- | --- | --- | --- | --- | --- |
| **1. Identity & Access Governance** | `auth-service` | Identity federation, Keycloak OIDC broker, session lifecycle, active context resolution, RBAC baseline, and security audit log. | `User`, `ExternalIdentity`, `Session`, `Role`, `Permission`, `RoleAssignment`, `ActiveContext`, `AuditEvent` | Shared DB / Infra | **Current Implementation** |
| **2. Knowledge Repository** | `knowledge-service` | Digital scientific publications, patents, conference materials, research documents, and topic taxonomies. | `Publication`, `Patent`, `ConferenceDocument`, `KnowledgeTopic`, `KnowledgeAssetRef` | `auth-service` (context/user check) | **Target / Planned** |
| **2. Organizations & Expert Directory** | `organization-service` | Institutions, departments, partner bilateral agreements, researcher profiles/CVs, expert mapping, and partner suggestion signals. | `Organization`, `Department`, `PartnerAgreementRef`, `ResearcherProfile`, `ExpertCV`, `ExpertiseArea`, `MatchSignal` | `auth-service` (identity link) | **Target / Planned** |
| **3. Bilateral Research Grants (Independent)** | `grant-service` | Independent funding opportunities (Foundation/sponsor managed), VN–RU joint proposals, paired participation confirmations, and Foundation funding decisions. *(State budget authority remains external).* | `FundingOpportunity`, `OpportunityTypeRef`, `JointProposal`, `ProposalParticipant`, `CollaborationConfirmation`, `FundingDecision` | `auth-service`, `organization-service` | **Target / Planned** |
| **3. Independent Peer Review** | `review-service` | Reviewer pool, independent/anonymized assignments, scoring rubrics, review submissions, and evaluation recommendations. | `ReviewerPool`, `ReviewAssignment`, `EvaluationScore`, `ReviewRecord`, `EvaluationRecommendation` | `auth-service`, `grant-service` (read proposal snapshot) | **Target / Planned** |
| **3. Research Project Management (PMS)** | `project-service` | Approved project lifecycle from Foundation decisions, research milestones, progress tracking, deliverables, and closure records. | `Project`, `ProjectMilestone`, `Deliverable`, `ProgressReport`, `ProjectOutcomeRef` | `auth-service`, `grant-service` (approved grant link) | **Target / Planned** |
| **4. Training, Knowledge Transfer & Academic Exchange** | `academic-service` | Seminars, professional activities, conferences/forums (including annual Vietnam–Russia Intellectual Forum), academic exchange, participation tracking, and knowledge outcome links. `[DECISION]` *(No financial-support branch).* | `AcademicActivity`, `ActivityType`, `ActivitySchedule`, `Participation`, `ParticipationDecision`, `ActivityMaterialRef`, `KnowledgeOutcomeRef` | `auth-service`, `organization-service` | **Target / Planned** |
| **5. Technology Transfer & Enterprise Connection** | `technology-service` | Technology catalog, enterprise demand, expressions of interest, bilateral collaboration cases, **2+2 consortiums** (1 VN Inst + 1 VN Ent + 1 RU Inst + 1 RU Ent), and IP/legal advisory cases. | `TechnologyProfile`, `EnterpriseNeed`, `ExpressionOfInterest`, `CollaborationCase`, `Consortium2Plus2`, `ConsortiumSlot`, `AdvisoryCase`, `IPLegalArtifactRef`, `TransferOutcome` | `auth-service`, `organization-service` | **Target / Planned** |
| **6. Internal Monitoring & Reporting Dashboard** | `analytics-service`<br>(Analytics Layer) | Internal monitoring and strategic reporting for Network leadership/management; KPI definitions, snapshots, collaboration graphs, and internal report runs. | `FactSnapshot`, `FactProject`, `FactExpertConnection`, `FactTechnologyTransfer`, `FactAcademicActivity`, `KpiDefinition`, `KpiSnapshot`, `ReportDefinition`, `ReportRun` *(Read-only projections)* | Event bus / normalized fact streams from all domains | **Target / Planned (Read-only)** |
| **Edge Gateway** | `api-gateway` | Edge routing, rate limiting, request context propagation, client session termination. | None (stateless routing / Redis rate-limit counters) | Downstream domain HTTP ports | **Target / Planned** |

---

## 3. Data Ownership & Source-of-Truth Rules

1. **Exclusive Write Authority**: Only the owning service may write or mutate its business models.
2. **No Shared Persistence**: Cross-service database access, database links, or shared database tables are strictly forbidden.
3. **Cross-Domain References**: Cross-domain relationships MUST use immutable IDs/references (e.g., `organizationId`, `proposalId`, `authorUserId`) rather than foreign-key constraints across service database boundaries.
4. **Analytics Non-Transactional Rule**: `analytics-service` is a consumer of facts and events. It stores derived projections and metrics for querying, but it NEVER owns or writes back business state to `grant-service`, `project-service`, `technology-service`, or any other domain.
5. **Independent Peer Review Isolation**: `review-service` owns review assignments and scoring data. The anonymized proposal snapshot viewed by reviewers MUST NOT leak author or institution identity outside authorized policy.
6. **2+2 Model Ownership**: 2+2 consortium collaboration is owned strictly by `technology-service` under Module 5. It must not be placed in the Grant/PMS taxonomy.
7. **Technology Creation Boundary**: Project completion in `project-service` does NOT automatically create a Technology entity in `technology-service`; candidate proposals require explicit business actions.
8. **Module 4 Scope Rule**: `academic-service` manages training, academic exchange, and conferences without handling monetary scholarships, quotas, tuition, or financial transactions.

---

## 4. Inter-Domain Dependency & Communication Rules

```txt
┌─────────────────────────────────────────────────────────────┐
│                       api-gateway                           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       ┌───────▼────────┐             ┌────────▼────────┐
       │  auth-service  │             │  grant-service  │
       └───────┬────────┘             └────────┬────────┘
               │                               │
               │ [Domain Events via Outbox]     │ [Domain Events via Outbox]
               ▼                               ▼
       ┌────────────────────────────────────────────────┐
       │                Kafka Event Bus                 │
       └───────┬───────────────────────────────┬────────┘
               │                               │
       ┌───────▼────────┐             ┌────────▼────────┐
       │ review-service │             │analytics-service│
       └────────────────┘             └─────────────────┘
```

- **Synchronous Invocations**: Allowed only for lightweight verification (e.g., verifying user identity or organization status via public HTTP/REST ports).
- **Asynchronous Orchestration**: Business workflows spanning multiple domains (e.g., Funding Decision Approved → Create Project; Call Closed → Trigger Review Assignment; Collaboration Case Formed → 2+2 Consortium Completed) MUST use versioned domain events via Kafka.
- **Fail-Safe Isolation**: A failure in `analytics-service`, `notification-service`, or search indexing MUST NOT fail the upstream transactional business operation.

---

## 5. Service Extraction Readiness

A domain module within a backend service is ready for dedicated service extraction when:
- It has clear, exclusive data ownership with no cross-schema joins.
- Its public API and event contracts are stable and versioned.
- Independent scaling, deployment, security, or compliance boundaries justify the operational overhead.


