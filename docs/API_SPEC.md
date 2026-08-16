# VN-RU Network API Specification & Event Contracts

## 1. Contract Source of Truth

The single source of truth for HTTP/REST contracts in VN-RU Network is the **OpenAPI specification exported from backend services**:

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
| **IAM** | `/api/v1/auth/*`<br>`/api/v1/users/*`<br>`/api/v1/roles/*` | Sign in, SSO callback, active context switch, profile update, role assignment. |
| **Knowledge** | `/api/v1/publications/*`<br>`/api/v1/patents/*`<br>`/api/v1/search/*` | Search repository, retrieve publication details, upload preprint/patent metadata. |
| **Organization & Experts** | `/api/v1/organizations/*`<br>`/api/v1/experts/*`<br>`/api/v1/matches/*` | Institution directory, expert profile/CV, similarity & partner recommendations. |
| **Grants & PMS** | `/api/v1/grants/programs/*`<br>`/api/v1/grants/calls/*`<br>`/api/v1/grants/proposals/*`<br>`/api/v1/projects/*` | Publish call, draft paired proposal, Co-PI mutual sign-off, lock proposal, update milestone, submit bilateral financial report. |
| **Review** | `/api/v1/reviews/assignments/*`<br>`/api/v1/reviews/evaluations/*` | Reviewer queue, anonymized proposal fetch, submit double-blind score & comments. |
| **Academic** | `/api/v1/academic/scholarships/*`<br>`/api/v1/academic/courses/*`<br>`/api/v1/academic/exams/*`<br>`/api/v1/academic/practice/*` | Scholarship application, Pushkin Hub course enrollment, exam registration, certificate verification, JINR practice application. |
| **Technology** | `/api/v1/technology/listings/*`<br>`/api/v1/technology/demands/*`<br>`/api/v1/technology/consortiums/*`<br>`/api/v1/technology/ip/*` | Technology marketplace search, post demand, submit expression of interest, create 2+2 consortium, access IP advisory. |
| **Analytics** | `/api/v1/analytics/kpi/*`<br>`/api/v1/analytics/collaboration-map/*`<br>`/api/v1/analytics/reports/export/*` | Executive KPI rollups, network graph nodes/edges, generate strategic PDF/Excel export. *(Read-only)* |

### 2.2. Bounded Collection Responses
All collection/list endpoints MUST enforce bounded pagination:
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
  "type": "grants.proposal.submitted",
  "version": "1.0",
  "occurredAt": "2026-08-17T03:30:00.000Z",
  "producer": "grant-service",
  "correlationId": "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
  "actor": {
    "userId": "usr_1029384756",
    "activeContext": "researcher",
    "organizationId": "org_vn_hust"
  },
  "payload": {
    "proposalId": "prop_998877",
    "callId": "call_2026_bilateral_01",
    "vnCoPIId": "usr_1029384756",
    "ruCoPIId": "usr_5566778899",
    "title": "AI in Climate Modeling",
    "status": "SUBMITTED_LOCKED"
  }
}
```

### 3.1. Canonical Domain Events

| Domain | Event Type | Description | Consumers |
| --- | --- | --- | --- |
| `auth` | `iam.user.registered` | New user created via SSO/registration | `organization-service`, `analytics-service` |
| `auth` | `iam.role.assigned` | Role / permission context modified | `audit-service`, `analytics-service` |
| `grant` | `grants.call.published` | Bilateral funding call opened | `notification-service`, `analytics-service` |
| `grant` | `grants.proposal.submitted` | Paired proposal signed by both Co-PIs and locked | `review-service`, `analytics-service` |
| `review` | `reviews.evaluation.completed` | Reviewer completed double-blind evaluation | `grant-service`, `analytics-service` |
| `grant` | `grants.decision.issued` | Joint funding decision finalized | `project-service`, `notification-service`, `analytics-service` |
| `project` | `projects.milestone.overdue` | Project milestone deadline exceeded | `notification-service`, `analytics-service` |
| `academic` | `academic.scholarship.awarded` | Scholarship quota granted to applicant | `notification-service`, `analytics-service` |
| `technology` | `technology.interest.submitted` | Enterprise expressed interest in technology asset | `technology-service`, `notification-service` |
| `technology` | `technology.consortium.formed` | 2+2 bilateral consortium established | `project-service`, `analytics-service` |

### 3.2. Audit Logging Events
Security and governance actions emit audit records:
- Identity & session actions: `iam.auth.login_success`, `iam.auth.2fa_verified`, `iam.auth.failed`.
- Access control changes: `iam.role.created`, `iam.permission.revoked`.
- Reviewer unmasking or re-identification actions: `reviews.anonymization.unmask`.
- Grant decisions & disbursement authorizations: `grants.decision.approved`, `projects.disbursement.approved`.

