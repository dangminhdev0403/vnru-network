# RBAC Architecture & Access Governance

## 1. Overview & Core Principles

Russia-Vietnam Science-Technology Intelligence Network enforces fine-grained, business-capability authorization managed and verified at backend service boundaries.

Key architectural tenets:
- **Backend Authority**: Backend services are the single security and authorization authority. Frontend permission checks are UX conveniences (hiding buttons/menus) only.
- **Fail-Closed Security**: Missing authentication, missing permissions, or invalid resource scopes MUST result in immediate access denial (`403 Forbidden` / `401 Unauthorized`).
- **Capability-Based Permissions**: Permissions follow a stable, administrator-friendly hierarchy: `<domain>.<resource>.<action>`.
- **Three Access Areas `[SOURCE]`**: Public / Discovery, Role-based Workspace, and Governance & Administration.
- **Context-Bound Authorization**: Permissions are evaluated against the user's **Active Authorization Context** (e.g., active institution, active role persona) rather than an unconstrained combination of all historically granted roles.

---

## 2. Portal Personas & Access Areas `[SOURCE]`

The Portal serves seven normalized actor groups across the three canonical access areas:

| Persona | Access Area & Default Surface | Business Scope & Primary Needs | Example Capabilities |
| --- | --- | --- | --- |
| **Visitor (Public)** | Public / Discovery (`/`, `/search`, `/knowledge`, `/experts`, `/opportunities`) | Unauthenticated exploration of published papers, expert profiles, research collaboration opportunities, training events, and technology catalog. | `knowledge.publications.view_public`<br>`experts.profiles.view_public`<br>`collab.opportunities.view_public`<br>`technology.listings.view_public` |
| **Researcher / Scientist** | Role-based Workspace (`/workspace/researcher`) | Manage CV/profile, index publications, initiate/collaborate on VN–RU joint proposals, track approved projects and milestones. | `experts.profiles.update_own`<br>`collab.proposals.create`<br>`collab.proposals.confirm_paired`<br>`projects.milestones.update` |
| **Reviewer** | Role-based Workspace (`/workspace/reviewer` or `/reviews`) | Access assigned records only; perform independent/anonymized peer review against rubrics and submit evaluations. | `reviews.assignments.view_assigned`<br>`reviews.evaluations.score`<br>`reviews.evaluations.submit` |
| **Organization Representative** | Role-based Workspace (`/workspace/organization`) | Manage organization profile, endorse institutional proposals/projects, propose and coordinate organization-led academic activities. | `organization.members.manage`<br>`collab.proposals.endorse`<br>`academic.activities.manage_org`<br>`projects.reports.view_org` |
| **Enterprise Representative** | Role-based Workspace (`/workspace/enterprise`) | Post enterprise R&D demands, submit expressions of interest (EOI), form 2+2 bilateral consortiums, and access IP/transfer advisory. | `technology.demands.create`<br>`technology.interests.submit`<br>`technology.consortium.create_2plus2` |
| **Leadership** | Role-based Workspace (`/workspace/leadership` or `/dashboard`) | Inspect aggregated internal KPIs, monitor Network activities (projects, connections, tech transfer), and view approved internal reports. | `analytics.kpi.view_leadership`<br>`analytics.collaboration_map.view`<br>`analytics.reports.view_internal` |
| **System / Governance Administrator** | Governance & Administration (`/admin/access`, `/admin/users`, `/admin/audit`) | Foundation and system operations staff managing user identity/access, data/workflow catalogs, audit trails, and KPI definitions. *(Not available to ordinary member organizations).* | `iam.users.manage`<br>`iam.roles.manage`<br>`iam.audit.view`<br>`analytics.kpi.manage_definitions` |

---

## 3. Business Capability Permission Taxonomy

Permissions are formatted as `<domain>.<resource>.<action>` across the six business capabilities:

```txt
# 1. Identity & Access Governance (IAM)
iam.users.view | iam.users.manage | iam.roles.manage | iam.audit.view
iam.sessions.revoke | iam.security_policy.manage

# 2. Knowledge Repository & Expert Directory
knowledge.publications.submit | knowledge.publications.publish | knowledge.publications.archive
experts.profiles.update_own | experts.profiles.manage | experts.matches.view

# 3. Bilateral Research Collaboration & Project Management (Module 3 - [DECISION] No financial domain)
collab.opportunities.create | collab.opportunities.publish | collab.opportunities.view_public
collab.proposals.create | collab.proposals.confirm_paired | collab.proposals.submit | collab.proposals.endorse
reviews.assignments.manage | reviews.assignments.view_assigned | reviews.evaluations.score | reviews.evaluations.submit
collab.decisions.issue_foundation
projects.projects.view | projects.milestones.update | projects.reports.submit | projects.reports.approve

# 4. Training, Knowledge Transfer & Academic Exchange (Module 4 - [DECISION] No financial branch)
academic.activities.view_public | academic.activities.create | academic.activities.publish | academic.activities.manage_org
academic.participations.register | academic.participations.decide | academic.materials.link

# 5. Technology Transfer & Enterprise Connection (Module 5 - inc. 2+2 Model)
technology.listings.create | technology.listings.publish
technology.demands.create | technology.demands.publish | technology.interests.submit
technology.cases.manage | technology.consortium.create_2plus2 | technology.consortium.confirm_slot
technology.advisory.view | technology.outcomes.record

# 6. Internal Monitoring & Reporting Dashboard (Module 6 - Internal Only)
analytics.kpi.view_leadership | analytics.collaboration_map.view | analytics.reports.view_internal
analytics.reports.export_internal | analytics.kpi.manage_definitions
```

---

## 4. Active Authorization Context & Context Switching

```txt
User (Subject) ──> Authenticates (Keycloak OIDC Broker)
                         │
                         ▼
             Resolve Active Context
  ┌──────────────────────┬──────────────────────┐
  ▼                      ▼                      ▼
Context A:             Context B:             Context C:
Researcher @ Univ X    Reviewer @ Board Y     Organization Rep @ Univ X
(collab.proposals.*)   (reviews.assignments.*)(organization.members.*)
```

1. **Context Resolution**: When a user logs in, `auth-service` issues a session bound to exactly one active context representing their current role and organization scope.
2. **Context Switching**: If a user holds multiple roles (e.g., Researcher in Institution A and Reviewer on Board B), the user explicitly switches context in the workspace UI.
3. **Session Token Rotation**: Context switching replaces that session's active context after assignment/scope validation and rotates the opaque session token. Permissions are never unioned across contexts.
4. **Token / Context Validation**: The backend evaluates access strictly against the active context in the request session, preventing unintended permission aggregation across unrelated roles.

---

## 5. Resource Scope & Independent Review Isolation

RBAC checks ("Can the user score proposals?") are decoupled from Resource checks ("Can this reviewer score *this* specific proposal?"):

1. **Reviewer Scope Isolation**:
   - A Reviewer may only read proposal data if an active `ReviewAssignment` explicitly assigns them to that proposal ID.
   - Any attempt to access a proposal outside their assignment scope yields `403 Forbidden`.
2. **Review Anonymization**:
   - When serving proposal snapshots to reviewers, the Collaboration and Reviews modules MUST strip author names, Co-PI affiliations, and institutional identifiers according to the approved review policy.
   - Re-identification or unmasking requires explicit administrative authority subject to immutable audit logging.
3. **Tenant / Organization Scope Isolation**:
   - Organization representatives can only view proposals, projects, activities, or researcher profiles belonging to their own `organizationId`.
   - Governance administration surfaces are isolated to Foundation/system operators and are not accessible by organization representatives.

---

## 6. Backend Enforcement & Explicit Decorators

Backend NestJS controllers declare required capability keys explicitly:

```ts
@Controller("proposals")
export class ProposalController {
  @Post(":id/confirm-paired")
  @RequirePermission("collab.proposals.confirm_paired")
  @RequireResourceScope("proposal", "participating_copi")
  async confirmPairedProposal(@Param("id") id: string, @ActiveContext() context: AuthContext) {
    return this.proposalService.confirmPaired(id, context);
  }
}
```

- **Guard Pipeline**:
  1. `AuthGuard`: Verifies valid opaque session cookie digest in PostgreSQL session store.
  2. `PermissionGuard`: Verifies active context contains the required capability key.
  3. `ResourceScopeGuard`: Verifies the active user/context owns or is assigned to the specific entity.
- **Fail-Closed Default**: If any guard cannot resolve permission or context, access is denied (`401 Unauthorized` or `403 Forbidden`).

---

## 7. Frontend Permission Projection Rules

- The frontend receives an array of granted capability keys for the active context.
- Frontend components use capability keys to show/hide buttons, navigation links, and workspace tabs.
- **Forbidden Actions in Frontend**:
  - Do NOT infer permissions from role names (e.g., `if (role === 'admin')`).
  - Do NOT infer permissions from current URL routes.
  - Do NOT treat frontend hiding as security; backend authorization is the sole source of truth.


