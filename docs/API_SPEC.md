# Russia-Vietnam Science-Technology Intelligence Network API Specification & Event Contracts

## 1. Contract Source of Truth

The single source of truth for HTTP/REST contracts in Russia-Vietnam Science-Technology Intelligence Network is the **OpenAPI specification exported from backend services**:

```bash
npm run openapi:export
```

Exported OpenAPI specifications are synchronized to `shared/api-contract/` and consumed by frontend generators.

- Do not maintain duplicate handwritten endpoint tables that drift from generated OpenAPI schemas.
- Contract breaking changes MUST be coordinated via schema versioning before frontend code assumptions change.

---

## 2. API Design Conventions

### 2.1. Resource Modeling & URI Structure
Endpoints reflect domain resources and nested resource ownership:

| Capability | Resource Scope | Typical REST Operations |
| --- | --- | --- |
| **1. IAM & Governance** | `/api/v1/auth/*`<br>`/api/v1/users/*`<br>`/api/v1/roles/*`<br>`/api/v1/security/*` | Keycloak OIDC session callback, active context switch, profile update, role assignment, session revocation. |
| **2. Knowledge & Experts** | `/api/v1/publications/*`<br>`/api/v1/patents/*`<br>`/api/v1/search/*`<br>`/api/v1/organizations/*`<br>`/api/v1/experts/*`<br>`/api/v1/matches/*` | Search public repository, retrieve publication details, expert profile/CV, similarity & partner recommendations. |
| **3. Collab, Review & PMS** | `/api/v1/collab/opportunities/*`<br>`/api/v1/collab/proposals/*`<br>`/api/v1/reviews/assignments/*`<br>`/api/v1/reviews/evaluations/*`<br>`/api/v1/projects/*` | Publish research collaboration opportunity, draft paired joint proposal, confirm VN–RU participation, submit review score, update project milestone. |
| **4. Training & Academic Exchange** | `/api/v1/academic/activities/*`<br>`/api/v1/academic/participations/*`<br>`/api/v1/academic/materials/*` | Browse/publish seminars and conferences (including annual forum), register participation, attach activity material references. `[DECISION]` *(No financial branch).* |
| **5. Technology Transfer & 2+2** | `/api/v1/technology/listings/*`<br>`/api/v1/technology/demands/*`<br>`/api/v1/technology/eoi/*`<br>`/api/v1/technology/consortiums/*`<br>`/api/v1/technology/advisory/*` | Tech marketplace search, post demand, submit expression of interest (EOI), form 2+2 consortium (4-party slots), access IP advisory case. |
| **6. Internal Analytics & Dashboard** | `/api/v1/analytics/kpi/*`<br>`/api/v1/analytics/collaboration-map/*`<br>`/api/v1/analytics/reports/*` | Executive KPI rollups, collaboration network graph nodes/edges, generate internal strategic report run. *(Internal, Read-only)* |

### 2.2. Bounded Collection Responses
All collection/list endpoints MUST enforce bounded pagination (limit/cursor/offset):
```json
{
  "items": [ ... ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 3. Asynchronous Event Contracts & Envelope Standard

Cross-service synchronization and analytics ingestion use Kafka domain events formatted in a standard versioned envelope:

```json
{
  "id": "c4b3e8a0-7f21-4d9b-a012-3456789abcde",
  "type": "collab.proposal.submitted",
  "version": "1.0",
  "occurredAt": "2026-08-18T03:30:00.000Z",
  "producer": "collaboration-service",
  "correlationId": "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
  "actor": {
    "userId": "usr_1029384756",
    "activeContext": "researcher",
    "organizationId": "org_vn_hust"
  },
  "payload": {
    "proposalId": "prop_998877",
    "opportunityId": "opp_2026_bilateral_01",
    "vnCoPIId": "usr_1029384756",
    "ruCoPIId": "usr_5566778899",
    "title": "AI in Climate Modeling",
    "status": "SUBMITTED"
  }
}
```

### 3.1. Canonical Domain Events

| Domain | Event Type | Description | Consumers |
| --- | --- | --- | --- |
| `auth` | `iam.user.registered` | New user created via SSO/broker | `organization-service`, `analytics-service` |
| `auth` | `iam.role.assigned` | Role / permission context modified | `audit-service`, `analytics-service` |
| `collab` | `collab.opportunity.published` | Bilateral research opportunity opened | `notification-service`, `analytics-service` |
| `collab` | `collab.proposal.submitted` | Joint proposal confirmed by both sides and submitted | `review-service`, `analytics-service` |
| `review` | `reviews.evaluation.submitted` | Reviewer completed evaluation score & comments | `collaboration-service`, `analytics-service` |
| `collab` | `collab.decision.approved` | Collaboration decision finalized | `project-service`, `notification-service`, `analytics-service` |
| `project` | `projects.milestone.updated` | Project milestone progress updated | `notification-service`, `analytics-service` |
| `academic` | `academic.activity.published` | Training / academic seminar / forum announced | `notification-service`, `analytics-service` |
| `academic` | `academic.participation.submitted` | Member registered for academic activity | `academic-service`, `notification-service` |
| `technology` | `technology.eoi.submitted` | Enterprise submitted expression of interest | `technology-service`, `notification-service` |
| `technology` | `technology.consortium.structurally_completed` | 2+2 bilateral consortium slots fully confirmed | `technology-service`, `analytics-service` |
| `technology` | `technology.transfer_outcome.recorded` | Technology transfer / commercialization completed | `analytics-service` |

### 3.2. Audit Logging Events
Security-critical and governance actions emit immutable audit records:
- Identity & session actions: `iam.auth.login_success`, `iam.auth.2fa_verified`, `iam.auth.failed`, `iam.auth.session_revoked`.
- Access control changes: `iam.role.assigned`, `iam.permission.revoked`, `iam.access.denied`.
- Reviewer actions: `reviews.assignment.modified`, `reviews.anonymization.unmask_attempted`.
- Collab & transfer decisions: `collab.decision.recorded`, `technology.consortium.slot_confirmed`, `analytics.kpi_definition.updated`, `analytics.report.exported`.

