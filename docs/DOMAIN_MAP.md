# VN-RU Network Domain Map

## 1. Purpose

This document maps business domains, capability ownership, and persistent data boundaries across the VN-RU Network microservices.

It enforces the fundamental architectural principle: **Every business state has exactly one owning service.** No domain or dashboard may directly mutate or own another domain's state.

---

## 2. Six Business Capabilities & Domain Mapping

| Capability `[SOURCE]` | Domain / Service | Business Responsibility `[SOURCE]` | Owned Models & State (Single Source of Truth) | Allowed Upstream Dependencies |
| --- | --- | --- | --- | --- |
| **IAM & Unified Governance** | `auth-service` | Identity federation, SSO, 2FA policies, active authorization context resolution, and RBAC management. | `User`, `Account`, `Session`, `Role`, `Permission`, `UserRole`, `ActiveContext`, `AuditLog` | Shared DB / Infra |
| **Knowledge Repository** | `knowledge-service` | Digital scientific publications, patents, conference materials, scientific library indexing. | `Publication`, `Patent`, `ConferencePaper`, `KnowledgeAsset`, `AssetTopic` | `auth-service` (context/user check) |
| **Institutions & Expert Directory** | `organization-service` | Universities, institutes, faculties, researcher profiles/CVs, expert mapping, and match signals. | `Organization`, `Department`, `UserProfile`, `ExpertCV`, `ResearchArea`, `MatchSignal` | `auth-service` (identity link) |
| **Bilateral Research Grants** | `grant-service` | Bilateral funding programs, funding calls, joint proposals, and VN/RU paired submission state. | `FundingProgram`, `FundingCall`, `JointProposal`, `CoPIAssignment`, `ProposalAttachment` | `auth-service`, `organization-service` |
| **Multi-Stage Peer Review** | `review-service` | Reviewer pool, double-blind assignments, scoring rubrics, review submissions, aggregated evaluations. | `ReviewerPool`, `ReviewAssignment`, `EvaluationScore`, `ReviewRecord`, `DecisionRecommendation` | `auth-service`, `grant-service` (read proposal snapshot) |
| **Project Management (PMS)** | `project-service` | Approved project lifecycle, bilateral milestones, financial reports, overdue alerts, acceptance records. | `Project`, `Milestone`, `Deliverable`, `BilateralFinancialReport`, `AcceptanceRecord`, `OverdueAlert` | `auth-service`, `grant-service` (approved grant link) |
| **Academic Exchange & Language Hub** | `academic-service` | Scholarship quotas, applications, Pushkin Virtual Hub (courses, exams, certs), JINR youth practice. | `ScholarshipProgram`, `QuotaAllocation`, `AcademicApplication`, `LanguageCourse`, `ExamEnrollment`, `Certificate`, `PracticeOpportunity` | `auth-service`, `organization-service` |
| **Technology Transfer & 2+2** | `technology-service` | Technology catalog, enterprise demand, expressions of interest, 2+2 consortium collaborations, IP advisory. | `TechnologyListing`, `EnterpriseNeed`, `ExpressionOfInterest`, `Consortium2Plus2`, `IPAdvisoryRecord` | `auth-service`, `organization-service` |
| **Science Diplomacy & Cross-Cutting Analytics** | `analytics-service`<br>(Analytics Layer) | Executive KPIs, Intergovernmental Committee reports, collaboration network maps, trend analytics. | `FactSnapshot`, `AggregateMetric`, `CollaborationGraphNode`, `CollaborationGraphEdge`, `ReportExportJob` *(Read-only projections)* | Event bus / normalized fact streams from all domains |
| **Edge Gateway** | `api-gateway` | Edge routing, rate limiting, request context propagation, client session termination. | None (stateless routing / Redis rate-limit counters) | Downstream domain HTTP ports |

---

## 3. Data Ownership & Source-of-Truth Rules

1. **Exclusive Write Authority**: Only the owning service may write or mutate its business models.
2. **No Shared Persistence**: Cross-service database access, database links, or shared database tables are strictly forbidden.
3. **Cross-Domain References**: Cross-domain relationships MUST use immutable IDs/references (e.g., `organizationId`, `proposalId`, `authorUserId`) rather than foreign-key constraints across service database boundaries.
4. **Analytics Non-Transactional Rule**: `analytics-service` is a consumer of facts and events. It stores derived projections and metrics for querying, but it NEVER owns or writes back business state to `grant-service`, `project-service`, `technology-service`, or any other domain.
5. **Double-Blind Review Data Isolation**: `review-service` owns review assignments and scoring data. The anonymized proposal snapshot viewed by reviewers MUST NOT leak author or institution identity.

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
- **Asynchronous Orchestration**: Business workflows spanning multiple domains (e.g., Proposal Approved → Create Project; Call Closed → Trigger Review Assignment) MUST use versioned domain events via Kafka.
- **Fail-Safe Isolation**: A failure in `analytics-service`, `notification-service`, or search indexing MUST NOT fail the upstream transactional business operation.

---

## 5. Service Extraction Readiness

A domain module within a backend service is ready for dedicated service extraction when:
- It has clear, exclusive data ownership with no cross-schema joins.
- Its public API and event contracts are stable and versioned.
- Independent scaling, deployment, security, or compliance boundaries justify the operational overhead.

