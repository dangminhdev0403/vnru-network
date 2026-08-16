# RBAC Architecture & Access Governance

## 1. Overview & Core Principles

VN-RU Network enforces fine-grained, business-capability authorization managed and verified at backend service boundaries.

Key architectural tenets:
- **Backend Authority**: Backend services are the single security and authorization authority. Frontend permission checks are UX conveniences (hiding buttons/menus) only.
- **Fail-Closed Security**: Missing authentication, missing permissions, or invalid resource scopes MUST result in immediate access denial (`403 Forbidden` / `401 Unauthorized`).
- **Capability-Based Permissions**: Permissions follow a stable, administrator-friendly hierarchy: `<domain>.<resource>.<action>`.
- **Context-Bound Authorization**: Permissions are evaluated against the user's **Active Authorization Context** (e.g., active institution, active role persona) rather than an unconstrained combination of all historically granted roles.

---

## 2. Portal Personas & Capability Matrix `[SOURCE]`

The Portal serves eight primary user personas:

| Persona | Primary Needs & Business Scope | Default Product Surface | Example Capabilities |
| --- | --- | --- | --- |
| **Visitor (Public)** | Discover publications, search public expert directory, browse funding opportunities & technology marketplace. | Public Discovery (`/`, `/search`, `/knowledge`) | `knowledge.publications.view_public`<br>`experts.profiles.view_public`<br>`grants.calls.view_public` |
| **Researcher** | Manage CV, index publications, initiate/sign paired proposals (VN/RU), track assigned projects and milestones. | Researcher Workspace (`/workspace/researcher`) | `experts.profiles.update_own`<br>`grants.proposals.create`<br>`grants.proposals.sign_paired`<br>`projects.milestones.update` |
| **Student / Young Scholar** | Apply for scholarships/quotas, enroll in Pushkin Hub language courses/exams, apply for JINR practice. | Academic Hub (`/academic`, `/workspace/student`) | `academic.scholarships.apply`<br>`academic.courses.enroll`<br>`academic.practice.apply` |
| **Reviewer / Evaluation Expert** | Access assigned double-blind proposals, evaluate against rubrics, submit scores/comments. | Reviewer Queue (`/reviews`) | `reviews.evaluations.view_assigned`<br>`reviews.evaluations.score`<br>`reviews.evaluations.submit` |
| **Enterprise Representative** | Post technology needs, discover IP/patents, express interest, form 2+2 consortiums. | Enterprise Workspace (`/workspace/enterprise`) | `technology.demands.create`<br>`technology.interests.submit`<br>`technology.consortium.create_2plus2` |
| **Institution Staff / Manager** | Manage organization faculty/researchers, verify institutional proposals, monitor active project milestones. | Organization Workspace (`/workspace/organization`) | `organization.members.manage`<br>`grants.proposals.verify_institutional`<br>`projects.reports.review_institutional` |
| **Government / Agency Officer** | Publish funding calls, verify paired eligibility, assign review panels, approve disbursements, export reports. | Agency Workspace (`/workspace/agency`) | `grants.calls.publish`<br>`reviews.assignments.manage`<br>`grants.decisions.issue`<br>`projects.disbursements.approve` |
| **Leadership / Science Diplomat** | Inspect real-time executive KPIs, explore collaboration network maps, export bilateral strategic reports. | Science Diplomacy Dashboard (`/dashboard`) | `analytics.kpi.view_executive`<br>`analytics.collaboration_map.view`<br>`analytics.reports.export_strategic` |

---

## 3. Business Capability Permission Taxonomy

Permissions are formatted as `<domain>.<resource>.<action>` across the six business capabilities:

```txt
# 1. IAM & Governance
iam.users.view | iam.users.manage | iam.roles.manage | iam.audit.view

# 2. Knowledge & Expert
knowledge.publications.submit | knowledge.publications.publish | knowledge.publications.archive
experts.profiles.update_own | experts.profiles.manage | experts.matches.view

# 3. Bilateral Grants / PMS & Review
grants.calls.create | grants.calls.publish
grants.proposals.create | grants.proposals.sign_paired | grants.proposals.lock | grants.proposals.verify
reviews.assignments.manage | reviews.evaluations.view_assigned | reviews.evaluations.score | reviews.evaluations.submit
projects.milestones.update | projects.reports.submit | projects.reports.approve | projects.acceptance.sign

# 4. Academic Exchange & Language Hub
academic.scholarships.apply | academic.scholarships.award
academic.courses.enroll | academic.exams.register | academic.certificates.issue | academic.practice.manage

# 5. Technology Transfer & 2+2
technology.listings.publish | technology.demands.create | technology.interests.submit
technology.consortium.create_2plus2 | technology.ip.advisory_view

# 6. Science Diplomacy & Analytics
analytics.kpi.view_public | analytics.kpi.view_executive | analytics.collaboration_map.view | analytics.reports.export_strategic
```

---

## 4. Active Authorization Context & Context Switching

```txt
User (Subject) ──> Authenticates (SSO / 2FA)
                         │
                         ▼
             Resolve Active Context
  ┌──────────────────────┬──────────────────────┐
  ▼                      ▼                      ▼
Context A:             Context B:             Context C:
Researcher @ Univ X    Reviewer @ Panel Y     Institution Admin @ Univ X
(grants.proposals.*)   (reviews.evaluations.*) (organization.members.*)
```

1. **Context Resolution**: When a user logs in, `auth-service` issues a session with an active context representing their current role and organization scope.
2. **Context Switching**: If a user holds multiple roles (e.g., Researcher in Institution A and Reviewer on Panel B), the user explicitly switches context in the workspace UI.
3. **Token / Context Validation**: The backend evaluates access strictly against the active context in the request token, preventing unintended permission aggregation across unrelated roles.

---

## 5. Resource Scope & Double-Blind Review Isolation

RBAC checks ("Can the user score proposals?") are decoupled from Resource checks ("Can this reviewer score *this* specific proposal?"):

1. **Reviewer Scope Isolation**:
   - A Reviewer may only read proposal data if an active `ReviewAssignment` explicitly assigns them to that proposal ID.
   - Any attempt to access a proposal outside their assignment scope yields `403 Forbidden`.
2. **Double-Blind Anonymization**:
   - When serving proposal snapshots to reviewers, `review-service` and `grant-service` MUST strip all author names, Co-PI affiliations, email addresses, and institutional identifiers.
   - Re-identification or unmasking requires explicit administrative authority subject to immutable audit logging.
3. **Tenant / Institution Scope Isolation**:
   - Institutional managers can only view proposals, projects, or researcher profiles belonging to their own `organizationId`.

---

## 6. Backend Enforcement & Explicit Decorators

Backend NestJS controllers declare required capability keys explicitly:

```ts
@Controller("proposals")
export class ProposalController {
  @Post(":id/sign-paired")
  @RequirePermission("grants.proposals.sign_paired")
  @RequireResourceScope("proposal", "participating_copi")
  async signPairedProposal(@Param("id") id: string, @ActiveContext() context: AuthContext) {
    return this.proposalService.signPaired(id, context);
  }
}
```

- **Guard Pipeline**:
  1. `AuthGuard`: Verifies valid JWT session token.
  2. `PermissionGuard`: Verifies active context contains the required capability key.
  3. `ResourceScopeGuard`: Verifies the active user/context owns or is assigned to the specific entity.
- **Fail-Closed Default**: If any guard cannot resolve permission or context, access is denied.

---

## 7. Frontend Permission Projection Rules

- The frontend receives an array of granted capability keys for the active context.
- Frontend components use capability keys to show/hide buttons, navigation links, and workspace tabs.
- **Forbidden Actions in Frontend**:
  - Do NOT infer permissions from role names (e.g., `if (role === 'admin')`).
  - Do NOT infer permissions from current URL routes.
  - Do NOT treat frontend hiding as security; assume all client-side state can be bypassed.

