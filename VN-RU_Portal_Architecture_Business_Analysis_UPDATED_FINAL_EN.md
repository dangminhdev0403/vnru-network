**Architecture and Business Analysis**

Normalized analysis baseline — implementation review based on the two latest updated source documents

| **Scope** | **Content** |
|---|---|
| Module 1 | IAM / Governance |
| Module 2 | Knowledge Repository and Expert Directory |
| Module 3 | Independent Funding & Bilateral Research Project Management |
| Module 4 | Training, Knowledge Transfer & Academic Exchange |
| Module 5 | Technology Transfer & Enterprise Connection |
| Module 6 | Internal Monitoring & Reporting Dashboard |

# SOURCE UPDATE — NEW BOUNDARIES TO APPLY

This document has been reviewed against the two latest updated sources: “R-V STIN” and “170826 Giới thiệu portal VIE”. The goal is to remove assumptions that have been superseded, normalize the Public / Workspace / Governance flows, and add enough implementation detail to move into solution design.

| **Updated point** | **Applied conclusion** |
|---|---|
| Founder / operator | The Traditions and Friendship Foundation is the founder, owner, coordinator, and operator of the Network/Portal; the Network is not a separate legal entity. |
| Legal position | The Network is an independent cooperation initiative; it must not be assumed to be a portal of the two ministries or an intergovernmental program. |
| Three access areas | Public / Discovery; Role-based Workspace; Governance & Administration. |
| Public objectives | Connect experts; disseminate knowledge; independent funding opportunities; knowledge/academic exchange; technology transfer. |
| Members | Two main groups: organizations and individual scientists; participation conditions differ based on capacity and relationship with the governing organization. |
| Module 3 | Research funding in the Portal focuses on independent sources funded by individuals/organizations; the Foundation only approves funds raised/managed by the Foundation. |
| State budget | If research is commissioned by a state authority, the Portal/Network only connects and supports; budget allocation/management remains with the competent authority of each country. |
| 2+2 model | Belongs to Module 5 — Technology Transfer & Enterprise Connection, not Module 3. |

Priority rule: “170826 Giới thiệu portal VIE” takes priority for experience structure, user groups, and module descriptions; “R-V STIN” takes priority for operator identity, legal model, financial mechanism, Network activities, and the 2+2 model. When the two sources use different wording without changing meaning, use wording that best supports Portal implementation; when they differ in scope, keep the item [OPEN] or apply a direct updated decision from the project owner. Technical content not confirmed by source must retain a [DESIGN] or [OPEN] label.

# 0. PORTAL-WIDE IMPLEMENTATION BASELINE AFTER REVIEW

[SOURCE] The Portal is the Network’s “single window”, invested in, built, owned, and operated by the Traditions and Friendship Foundation. The Network is not a separate legal entity and is currently not an intergovernmental program.

[SOURCE] The Portal experience is divided into three canonical areas: Public / Discovery, Role-based Workspace, and Governance & Administration. These boundaries must remain consistent across navigation, authorization, and data exposure.

## 0.1. Three canonical access areas

PUBLIC / DISCOVERY

Home → News / Events / Announcements → Global Search

→ Knowledge Repository → Expert Directory → Collaboration Opportunities

ROLE-BASED WORKSPACE

Authenticated member → role/context → personal / organization / reviewer / enterprise / leadership workspace

GOVERNANCE & ADMINISTRATION

Foundation/system operators → identity/access governance → workflow/data governance → audit/security → KPI/report administration

[SOURCE] Organization / Agency users are not automatically Governance administrators; they only see data/workflows within their granted scope.

## 0.2. Actors and participation forms

- [SOURCE] Organizations: educational institutions, research institutes/centers, scientific associations, enterprises, and other suitable organizations.

- [SOURCE] Individuals: scientists participating directly; if currently affiliated with an organization but participating in a personal capacity, a confirmation/consent mechanism is required according to that organization’s rules.

- [SOURCE] Organizational partners join the Network through bilateral cooperation agreements with the Foundation.

## 0.3. Portal-level onboarding flow

The following flow is [SOURCE + DESIGN]: the source confirms participation conditions; digitized onboarding states are an implementation proposal.

Organization interest

↓ bilateral cooperation agreement / required legal approval

Partner organization eligible for Portal access

↓ authorized representative linked to organization

Role-based organization workspace

Individual scientist registration

↓ affiliation check

├─ independent / unaffiliated → continue

└─ affiliated personal participation → organization consent / verification

↓ identity activated + researcher/expert profile linked

Role-based individual workspace

[DESIGN] IAM does not own the Cooperation Agreement, partner status, or organization consent decision. IAM only receives account status and authorization context from the domain that owns onboarding/organization/governance.

## 0.4. Canonical module scope after the update

- Module 1 — Identity & Access Governance: identity, authentication, session, access context, and the security/governance boundary.

- Module 2 — Knowledge Repository & Expert Directory: publications, research outputs, expert profiles, search/discovery, and partner suggestion.

- Module 3 — Bilateral Research Funding & Project Management: independent funding opportunities, VN–RU collaboration proposals, review, decisions within funds managed by the Foundation, and project tracking.

- Module 4 — Training, Knowledge Transfer & Academic Exchange: seminars, professional activities, training/exchange activities, and knowledge dissemination.

- Module 5 — Technology Transfer & Enterprise Connection: technology, enterprise demand, connection, transfer advisory, and the 2+2 model.

- Module 6 — Internal Monitoring & Reporting Dashboard: reporting for Network management/leadership; not a public area.

## 0.5. Replacements that must be treated as canonical

- [DECISION] Module 4 only retains training, knowledge transfer, and academic exchange scope; do not implement a separate financial-support branch.

- [SOURCE] Module 3 funding must not be described as intergovernmental research budget; the Foundation only decides on funds raised/managed by the Foundation.

- [SOURCE] 2+2 belongs to Module 5, not Module 3.

- [SOURCE] Module 6 Dashboard is internal, not a public capability equal to Knowledge / Experts / Opportunities.

- [SOURCE] Public / Discovery must include Home, News/Events/Announcements, Global Search, Knowledge, Experts, and collaboration opportunities.

## 0.6. Confidence labels

- [SOURCE] — explicitly defined by the updated source.

- [DECISION] — a direct updated decision by the project owner.

- [INHERITED] — a requirement from an earlier source that has not been contradicted by the two updated sources.

- [DESIGN] — a technical/UX implementation proposal, not yet a source requirement.

- [OPEN] — insufficient source to finalize; must not be hard-coded.

# MODULE 1 — IAM / GOVERNANCE

The updated source defines Identity & Access Governance as the common entry point of the Portal: one account is used across services, access depends on role/context, and the experience is divided into Public / Discovery, Role-based Workspace, and Governance & Administration. IAM is the security gateway and does not own the business state of Proposal, Project, Expert, or Technology.

## 1. What does IAM actually do?

**IAM should not be understood simply as:**

Login → Logout

**In the VN-RU Portal, IAM is the security gateway for the entire business workflow:**

<img src="media/image1.png" style="width:6.10236in;height:6.15157in" />

*IAM’s role across the end-to-end business flow*

IAM does not own Proposal, Project, Expert, Technology...

**IAM only answers:**

| *Who are you, which context are you operating in, and what are you allowed to do?* |
|---|

**The business service answers:**

| *Is that action valid according to business rules?* |
|---|

## 2. IAM actors

The updated source identifies the following IAM/workspace user groups:

| **Actor** | **What IAM / Portal must support** |
|---|---|
| Researcher / Scientist | Login → workspace → own profile, publications, proposals, and projects within scope |
| Reviewer | Login → reviewer workspace → access only assigned records |
| Organization / Agency Representative | Organization-scoped workspace → programs, projects, and activities belonging to the organization |
| Enterprise | Workspace → relevant technologies, needs, and connection opportunities |
| Leadership | Internal workspace → reports and aggregated data according to permission |
| System / Governance Administrator | Governance & Administration → identity/access, catalogs/workflows, audit/security, KPI/report administration |

**When designing the whole Portal, the broader actor set is:**

Visitor

- accesses Public / Discovery without authentication

Researcher / Scientist

Reviewer

Organization / Agency Representative

Enterprise

Leadership

System / Governance Administrator

- member groups use role-based workspaces; Governance & Administration is reserved for system administration staff

The updated source no longer treats Governance workspace as the common workspace for Agency users; organizations/agencies only see programs and projects within their scope, while governance/admin is a separate administrative area.

## 2.1. Boundary between account and membership / partner onboarding

[SOURCE] An organization gains Portal access after becoming an eligible partner; an individual may require affiliation confirmation before participating in a personal capacity.

[DESIGN] Do not put Cooperation Agreement signing logic, organization consent, or legal-compliance decisions into `auth-service`. These decisions belong to the onboarding/organization/governance domain; IAM only consumes confirmed status to issue the access context.

membership / partner eligibility → identity activation → role/context → workspace

## 3. Standard login flow

**Current documented flow:**

<img src="media/image2.png" style="width:1.54566in;height:6.77165in" />

*Login and workspace initialization flow*

This flow is defined by the documentation.

| **Do not** | **Do** |
|---|---|
| Frontend → “User is ADMIN” → allow action | Frontend → request → Backend IAM/AuthZ → identity + role + resource scope → Business Service |
| Frontend becomes the security boundary | Backend is the security boundary; frontend only displays appropriate capabilities |

The frontend only displays appropriate capabilities.

The backend is the security boundary.

## 4. Authentication is different from Authorization

**These two concepts must be separated clearly:**

| **Authentication (AuthN)** | **Authorization (AuthZ)** |
|---|---|
| Who are you? | What are you allowed to do? |
| Identity → userId, email, identity provider, session | Identity → Role → Context → Resource → Action |

**Example:**

User A

- Researcher
- Institution VN
- Project P001
- READ
- UPDATE

**User A may:**

GET /projects/P001

**but is not necessarily allowed to:**

APPROVE /projects/P001

## 5. Context is critical

**The documentation keeps OPEN-02 unresolved:**

Does a role support multiple contexts, or does each user have one primary role?

This directly affects navigation + authorization.

This decision must not be made implicitly.

**Architecturally, the system should be prepared for:**

<img src="media/image3.png" style="width:6.10236in;height:4.79301in" />

*Identity, role, and context model*

If OPEN-02 later chooses multi-context, the architecture should not require a rewrite.

## 6. Resource authorization

This is deeper than RBAC.

**It should not stop at:**

ROLE_RESEARCHER

**It needs:**

<img src="media/image4.png" style="width:5.9502in;height:6.77165in" />

*Authorization by identity + role + resource scope + action*

For example, access must still be denied when a proposal has not been assigned.

This is especially important because the documentation requires reviewers to access only assigned records and perform anonymous review/scoring.

## 7. IAM must not absorb business authorization

**Example:**

<img src="media/image5.png" style="width:6.10236in;height:0.55252in" />

*Boundary between IAM permission and business validation*

This boundary is critical.

## 8. Conceptual data model

The following IAM conceptual model is proposed — [DESIGN], not a finalized schema:

<img src="media/image6.png" style="width:6.10236in;height:3.96378in" />

*Conceptual IAM data model*

Audit must not be turned into business state.

## 9. Session

This requires careful design because IAM is the entry point.

**Conceptually:**

<img src="media/image7.png" style="width:6.10236in;height:1.28946in" />

*Conceptual session model*

**From a security perspective, the frontend must not manage authorization like this:**

localStorage.role = "ADMIN"

and then trust it.

The frontend may cache UI state, but the server must verify authorization.

## 10. Logout

**Logout is not simply:**

delete local token

**With SSO:**

<img src="media/image8.png" style="width:6.10236in;height:0.846in" />

*Relationship between Portal Session and Identity Provider Session under SSO*

The design must distinguish:

local logout

IdP logout

session revocation

token/session expiration

The concrete IdP is still unknown because OPEN-01 still asks which IdP the SSO integration will use.

=> Do not finalize a provider implementation at this stage.

## 11. 2FA

**The source only states:**

check whether 2FA is required when policy applies.

**Therefore, the current flow only fixes:**

<img src="media/image9.png" style="width:4.63944in;height:6.77165in" />

*2FA policy-check flow*

**Not yet decided:**

TOTP

- WebAuthn

SMS

email OTP

The source is insufficient to choose among them.

## 12. Audit

IAM must produce security/audit events for sensitive actions.

**Examples:**

AUTH_LOGIN_SUCCESS

AUTH_LOGIN_FAILED

AUTH_LOGOUT

AUTH_2FA_FAILED

AUTHORIZATION_DENIED

AUTHORIZATION_GRANTED

ROLE_ASSIGNED

ROLE_REVOKED

SESSION_REVOKED

**But distinguish:**

Audit

from

Business Event

**Example:**

ReviewerSubmittedReview

is a business event owned by the Review domain.

**Whereas:**

Reviewer was denied access to Review #R100

is a security/audit event.

## 13. Performance / concurrency

This module can become a hot path for the entire Portal.

**Each request may pass through:**

<img src="media/image10.png" style="width:6.10236in;height:0.86631in" />

*IAM on the request hot path*

**If authorization performs multiple layered DB queries on every request:**

<img src="media/image11.png" style="width:6.10236in;height:0.52962in" />

*Anti-pattern: multiple DB round trips for one authorization decision*

latency can increase rapidly.

**Proposed design:**

Cache authorization context for a short period with Redis, but never cache business truth.

<img src="media/image12.png" style="width:2.4469in;height:6.77165in" />

*Authorization context with short-lived cache*

**Trade-off:**

faster under high concurrency

lower DB load

but permission invalidation must be handled

**Example: admin revokes a role:**

<img src="media/image13.png" style="width:6.10236in;height:0.63016in" />

*Authorization-cache invalidation after role revocation*

This is [DESIGN], not a source requirement.

## 14. Do not cache authorization for too long

**Major pitfall:**

TTL = 1 hour

An admin revokes permission, but the user can still act for one hour.

**Therefore IAM should prefer:**

short TTL

explicit invalidation

instead of long-lived cache.

## 15. Complete authorization flow

**Proposed standard flow for modules:**

<img src="media/image14.png" style="width:3.11953in;height:6.77165in" />

*Complete authorization flow*

**The status separation is:**

401 = not authenticated

403 = authenticated but not allowed

409 = state/concurrency conflict

422 = business validation

The document’s common state model also distinguishes Unauthorized, Forbidden, Conflict, and Validation error.

## 16. IAM UI

The updated source divides the Portal experience into three access areas; IAM is only one part of the shell and security boundary.

### Public / Discovery

Home · News / Events / Announcements

Global Search · Knowledge Repository · Expert Directory · Collaboration Opportunities

### Role-based Workspace

Available only after login; content varies by role and scope.

- Researcher / Scientist: profile, publications, proposals, projects
- Reviewer: assigned records for review
- Organization / Agency / Enterprise / Leadership: scope-specific workspace

### Governance & Administration

Reserved for system administration staff; not available to ordinary members.

Identity/access · data/workflow governance · audit/security · KPI/report administration

### IAM entry points

Concrete routes remain a design concern; the current route groups may continue as implementation guidance:

- `/login`
- `/security`
- `/workspace/*`

## 17. Most important IAM UX issue: context switching

**If OPEN-02 later allows multi-context, the UI may need:**

Minh Dang

Researcher · Institution A

**click:**

Switch context

Researcher

Institution A

Reviewer

Review Board B

Do not implement this UI yet because OPEN-02 is unresolved.

## 18. IAM output

**The business output of IAM is defined clearly as:**

Authenticated identity + active context + permission.

**A conceptual contract is:**

Authentication Result

{
identity
activeContext
roles
permissions
resourceScopes
session
}

This is a conceptual contract, not the final API schema.

## 19. Integration with other modules

**IAM sits in front of:**

<img src="media/image15.png" style="width:6.10236in;height:4.40945in" />

*IAM provides identity/context to other domains*

Each module must not create its own identity system.

**For example, Grants must not have:**

grant_user

grant_role

grant_password

**It only consumes:**

authenticated identity

authorization context

and handles Grant business rules itself.

Updated operating source: Governance & Administration staff represent the Foundation’s Portal-administration function; do not infer that every Agency/Organization user is an IAM administrator.

## 20. What IAM must not do

**This boundary must be fixed before coding:**

**IAM owns:**

- Identity
- Authentication
- Session
- Role
- Permission
- Resource authorization context
- Security audit

**IAM does NOT own:**

- Proposal state
- Review state
- Project state
- Expert profile
- Technology state
- Grant business rules
- Academic application state
- KPI business facts

## 21. Decisions IAM is not allowed to make implicitly

**IAM currently has two direct OPEN items:**

| **OPEN-01** |
|---|

Which exact SSO/IdP?

**Impact:**

- Auth contract
- Provisioning
- Logout
- Federation

| **OPEN-02** |
|---|

**A user has:**

Primary role

**or:**

Multi-role

Multi-context

**Impact:**

- Navigation
- Authorization
- Workspace
- Session context

The official source still keeps both questions unresolved.

## 22. Module 1 conclusion

**IAM architecture at design level:**

<img src="media/image16.png" style="width:6.10236in;height:5.60758in" />

*Integrated IAM architecture*

A sound architectural decision is to make IAM a centralized authentication + authorization capability while keeping business authorization/state validation in the service that owns the domain. Authorization context may use short-lived caching to reduce DB round trips under high concurrency; invalidation must occur when roles/permissions change.

## 23. IAM — detailed domain model

**Do not start from DB tables; start from domain ownership:**

<img src="media/image17.png" style="width:4.39602in;height:6.77165in" />

*IAM domain model*

### Entity responsibility

| **Entity** | **Owned by IAM?** | **Meaning** |
|---|---|---|
| User | ✅ | Portal account |
| Identity | ✅ | Authenticated identity |
| Role | ✅ | Permission group |
| Permission | ✅ | Capability |
| Context | ⚠️ | User operating scope |
| Session | ✅ | Login session |
| Resource Scope | ✅/shared reference | Resource boundary |
| Audit Event | ✅ | Security trail |
| Organization | ❌ | owned by organization-service |
| Proposal | ❌ | owned by grant-service |
| Review | ❌ | owned by review-service |
| Project | ❌ | owned by project-service |

Key rule: IAM must not copy business entities into its database.

## 24. Role is not Permission

**Do not design only:**

ADMIN

RESEARCHER

REVIEWER

and hard-code every permission in code.

**Conceptualize instead:**

Role

- Permission A
- Permission B
- Permission C

**Example:**

REVIEWER

- REVIEW_ASSIGNMENT_READ
- REVIEW_WRITE
- REVIEW_SUBMIT

A reviewer is still not allowed to review every Proposal.

**Scope must also be applied:**

REVIEWER

REVIEW_ASSIGNMENT_READ

assignmentId = R001

## 25. Permission model

**Proposed permission naming convention:**

`<DOMAIN>.<RESOURCE>.<ACTION>`

**Examples:**

IAM.USER.READ

IAM.USER.UPDATE

IAM.ROLE.READ

IAM.ROLE.ASSIGN

GRANT.PROPOSAL.READ

GRANT.PROPOSAL.SUBMIT

REVIEW.ASSIGNMENT.READ

REVIEW.REVIEW.SUBMIT

PROJECT.PROJECT.READ

PROJECT.MILESTONE.UPDATE

This is a proposed naming convention, not a source requirement.

**Benefits:**

- easier audit
- easier frontend capability mapping
- easier caching
- easier authorization checks
- prevents role names from becoming business rules

## 26. Permission Matrix

Do not create one giant permission table immediately.

**Split by capability:**

IAM

- Identity
- User
- Role
- Permission
- Session
- Audit

Example permission matrix:

| **Capability** | **Visitor** | **Member** | **Reviewer** | **Organization Rep.** | **Governance Admin** |
|---|---|---|---|---|---|
| Login | ✓ | ✓ | ✓ | ✓ | ✓ |
| Account read | - | ✓ | ✓ | ✓ | ✓ |
| Security | - | ✓ | ✓ | ✓ | ✓ |
| Workspace | - | ✓ | ✓ | ✓ | ✓ |
| User management | - | - | - | - | ✓ |
| Role management | - | - | - | - | ✓ |
| Audit review | - | - | - | - | ✓ |

This is only a design framework.

| **Do not treat this as the final permission matrix because the role model is not confirmed; OPEN-02 still has not resolved multi-context vs. single primary role.** |
|---|

## 27. Resource Scope

This is what determines real authorization.

Example Organization / Agency Representative:

Organization / Agency Representative

- Organization A
- Project P1
- Project P2
- Organization B
- Project P3

Organization / Agency Representative A may:

READ P1

READ P2

**but not:**

READ P3

if P3 is outside scope.

**Therefore authorization should conceptually be:**

authorize(

identity,

permission,

resource,

context

)

**Not only:**

authorize(userId, permission)

## 28. Authorization decision flow

<img src="media/image18.png" style="width:2.9444in;height:6.77165in" />

*Authorization decision flow*

This matches the common state model in the documentation: Unauthorized, Forbidden, Conflict, and Validation error are distinct states.

## 29. API Contract

Final URLs should not be fixed yet, but capability contracts can be outlined.

### Authentication

POST /auth/login

POST /auth/logout

GET /auth/session

### Account

GET /account

PATCH /account

### Security

GET /security

POST /security/2fa

DELETE /security/session/:id

### Workspace

GET /workspace

GET /workspace/contexts

POST /workspace/context

### Access administration

GET /admin/access/users

GET /admin/access/users/:id

PATCH /admin/access/users/:id/roles

GET /admin/access/audit

This is an API design proposal, not an API confirmed by the source. The source only identifies UX route groups such as `/login`, `/account`, `/security`, `/workspace`, and `/admin/access`.

## 30. API must not return excessive information

**Example of what the frontend needs:**

{
"authenticated": true,
"identity": {
"id": "u123",
"displayName": "..."
},
"context": {
"id": "ctx01",
"type": "researcher"
},
"permissions": [
"GRANT.PROPOSAL.READ",
"GRANT.PROPOSAL.SUBMIT"
]
}

**Do not return:**

password

provider token

internal security configuration

raw permission database structure

## 31. Caching

This requires a decision because IAM is on every request.

Do not cache the entire authorization result indefinitely.

**Instead:**

<img src="media/image19.png" style="width:5.66895in;height:6.77165in" />

*Caching and invalidation using permission version*

This limits stale authorization.

## 32. Concurrency

IAM has two notable concurrency problems.

> 1. Concurrent session

**A user may have:**

- Browser A
- Browser B
- Mobile

Therefore do not assume:

user = one session

unless a later policy explicitly requires it.

> 2. Concurrent permission update

**Two admins may edit roles at the same time.**

Admin A and Admin B may concurrently update the same User Role.

**Use optimistic concurrency such as:**

version

updatedAt

and reject stale updates with 409 Conflict.

This is [DESIGN], not a source requirement.

## 33. Audit Event

**Audit should carry enough structure for traceability:**

{
"eventType": "AUTHORIZATION_DENIED",
"actorId": "u123",
"action": "GRANT.PROPOSAL.READ",
"resourceType": "proposal",
"resourceId": "p001",
"contextId": "ctx01",
"timestamp": "...",
"requestId": "req-123"
}

Especially important fields include:

requestId

traceId

actorId

resource

action

decision

timestamp

These are important for observability.

The source requires comprehensive audit logs at the infrastructure/security layer and audit for sensitive actions.

## 34. OpenTelemetry

**IAM is a strong candidate for tracing:**

HTTP Request

- auth.authenticate
- auth.resolve-context
- auth.authorize
- business.operation

**Example trace:**

GET /proposals/P001

- auth.authenticate 2ms
- authz.cache 1ms
- grant.getProposal 8ms
- response

**If authz cache misses:**

authz.cache 1ms

authz.redis 2ms

authz.db 9ms

This helps determine whether IAM is becoming a bottleneck.

## 35. Frontend behavior

The frontend should not load the entire permission matrix.

**Instead:**

GET /auth/session

current identity

current context

capabilities

**Then UI:**

if can("GRANT.PROPOSAL.SUBMIT")

show Submit

The backend still re-checks authorization.

If permissions change in real time?

Not every UI state needs realtime updates.

**A simpler approach:**

Session response

permission version

**If the version changes:**

refresh auth context

This reduces unnecessary socket traffic.

## 36. IAM state UX

The documentation defines common states, and IAM should apply them directly.

<img src="media/image20.png" style="width:6.10236in;height:3.50906in" />

*Primary IAM states across /login, /workspace, and /admin/access*

## 37. Security pitfalls to avoid

- Wrong

**Frontend:**

role === ADMIN

→ call admin API

- Wrong

**JWT:**

role=ADMIN

→ backend trusts it forever

- Wrong

Grant Service

→ queries IAM DB directly

- Correct

<img src="media/image21.png" style="width:6.10236in;height:0.65606in" />

*Correct security boundary: AuthN → AuthZ → business validation*

Other services use contracts/context only; they do not read the IAM database directly.

## 38. Acceptance Criteria — IAM

### Authentication

A user can complete the authentication flow.

Unauthenticated requests receive 401.

Session lifecycle is explicit.

2FA is checked according to policy.

### Authorization

Permissions are checked on the backend.

Resource scope is checked.

Forbidden requests receive 403.

IAM does not handle business state.

### Workspace

Active identity is resolved.

Active context is resolved.

The corresponding workspace is selected.

### Security

Sensitive actions produce audit records.

Authorization denial has appropriate audit/tracing.

Session revocation takes effect.

Permission cache supports invalidation.

### Integration

Other modules do not create separate identity systems.

No cross-service IAM DB access.

Business services continue to validate business state.

## 39. What is not yet coded

After this analysis, IAM has:

| **Item** | **Status** |
|---|---|
| Business Goal | ✅ |
| Actor | ✅ |
| Authentication Flow | ✅ |
| Authorization Model | ✅ |
| Context Model | ⚠️ OPEN-02 |
| Data Model | DESIGN |
| Permission Convention | DESIGN |
| Resource Scope | DESIGN |
| API Capability | DESIGN |
| Caching Strategy | DESIGN |
| Audit Model | DESIGN |
| Observability | DESIGN |
| UX State | DESIGN |
| Acceptance Criteria | DESIGN |

**Two points must still not be decided implicitly:**

| **OPEN-01 → exact IdP / SSO** |
|---|

| **OPEN-02 → single role or multi-context** |
|---|

The official source still keeps these questions unresolved.

## Module 1 summary

**IAM analysis framework:**

<img src="media/image22.png" style="width:6.10236in;height:0.3705in" />

*Module 1 analysis chain from requirement to acceptance*

Documentation framework for each module: business → flow → UI → permission → data → API → acceptance.

# MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY

## 1. Nature of the module

This module is not merely a place to store papers or documents.

**It contains two main capabilities:**

<img src="media/image23.png" style="width:6.10236in;height:3.25717in" />

*Two core capabilities of the Knowledge Repository*

The updated source confirms that the Knowledge Repository & Expert Directory centralizes publications/research outputs and expert profiles from both countries; users can search by topic, organization, and author, and receive expert/partner suggestions based on expertise. Details such as patents, proceedings, and ORCID/Scopus remain inherited-source or supplemental-design items where they do not conflict with the new source.

## 2. Business objective

The real objective is to turn distributed data into a searchable and connected knowledge network:

<img src="media/image24.png" style="width:6.10236in;height:0.37401in" />

*Value chain from distributed data to collaboration*

**Therefore, the end result is not:**

| *100,000 papers have been stored.* |
|---|

**It is:**

| *Users can find the right knowledge, the right experts, and suitable partners.* |
|---|

## 3. Two business scopes that must remain distinct

### 3.1. Scientific repository

**Includes:**

- Scientific publications
- Papers
- Patents
- Conference materials
- Research documents
- Scientific descriptive metadata

**The documentation requires data to be linked to:**

Authors

Organizations

Topics

Publication types

and then indexed so users can search it.

### 3.2. Expert directory

**Includes:**

- Researcher profiles
- Expert profiles
- Scientific CVs
- Expertise
- Research directions
- Publications
- Organizations

Once these data are linked, the system can generate similarity signals to suggest potential partners.

### 3.3. Public / Discovery according to the updated source

Knowledge Repository, Expert Directory, and Integrated Search are public surfaces; visitors do not need to sign in to explore data that has been approved for public exposure.

This does not mean every profile/record is public. Moderation, publish/unpublish, and edit rules remain under OPEN-03 and must be respected by both backend and search index.

## 4. Relationship between experts and the knowledge repository

These two parts should not be treated as separate systems.

**Conceptual relationship:**

<img src="media/image25.png" style="width:6.10236in;height:5.44435in" />

*Relationship between experts and the knowledge repository*

**Example:**

Researcher A

- 25 publications
- 3 research directions
- 2 patents
- affiliated with Institute X

Because of these relationships, when a user views an expert, they can continue to:

Expert

→ Publication

→ Topic

→ Organization

→ Project

→ Related Expert

This is how the Portal becomes a knowledge network rather than a simple document library.

## 5. Data ownership

The ownership model below is [DESIGN] at the implementation-architecture level; it is not a legal conclusion from the two latest source documents.

organization-service

- Researcher
- Organization
- Membership relationship

knowledge-service

- Publication
- Patent
- Document
- Knowledge topic
- Knowledge relationship

`knowledge-service` should not duplicate the entire researcher profile as its own data.

**It should keep only required references such as:**

publication.authorId

publication.organizationId

and retrieve full information through cross-domain contracts when needed.

## 6. Scientific data ingestion flow

**The documentation describes the sequence:**

<img src="media/image26.png" style="width:6.10236in;height:0.36593in" />

*Scientific data ingestion flow*

**Important implementation point:**

Fetching data from ORCID, Scopus, or other external sources is background processing; users should not have to wait for the entire process to complete inside one HTTP request.

**Example:**

<img src="media/image27.png" style="width:6.10236in;height:0.40016in" />

*Background synchronization flow*

The documentation mentions ORCID/Scopus integration, but does not finalize the synchronization mechanism. Therefore, this remains a design direction rather than a mandatory implementation requirement.

## 7. Duplicate prevention

**This is important because one publication may arrive from:**

ORCID

Scopus

University / institute source

Manual entry

**Without record identification:**

1 publication

4 sources

4 records

**This would distort:**

- Publication count
- Expert count
- KPI
- Search results
- Matching

**The design should include a record-identity layer using signals such as:**

- External identifier
- DOI
- Normalized title
- Authors
- Year

**If confidence is high enough:**

→ update the existing record

**If uncertain:**

→ send to a confirmation/review queue

Low-confidence records should not be merged automatically.

## 8. Expert profile flow

<img src="media/image28.png" style="width:6.10236in;height:0.31701in" />

*Expert profile and matching flow*

This is the sequence described by the documentation.

## 9. Search must be central to the module

**Routes proposed in the documentation include:**

`/knowledge`

`/publications`

`/publications/:id`

`/experts`

`/experts/:id`

`/search`

`/matches`

From a user-experience perspective, users should not need to understand which repository they are searching.

The updated source explicitly defines an integrated search tool in Public / Discovery. Therefore UX should provide:

<img src="media/image29.png" style="width:6.10236in;height:1.50244in" />

*Portal-wide search*

**Then filter by dimensions such as:**

- Object type
- Country
- Organization
- Topic
- Research field
- Language
- Year

The documentation requires indexing by object type, language, topic, organization, country, and relationship.

## 10. Why use a dedicated search engine?

**The documentation points toward:**

semantic search

Elasticsearch

graph database

**Therefore distinguish:**

Business database

**Used for:**

- Official state
- Transactions
- Ownership relationships
- Versioning

Search engine

**Used for:**

- Text search
- Ranking
- Filtering
- Aggregation
- Semantic search

Graph model

**Used for:**

- Researcher — Publication
- Researcher — Topic
- Researcher — Organization
- Organization — Project
- Expert — Expert

**Therefore:**

<img src="media/image30.png" style="width:4.36121in;height:6.77165in" />

*Separate source-of-truth data, search index, and graph*

The business database remains the source of truth.

## 11. Semantic search

**The goal is not only to search literally for:**

| *nuclear materials* |
|---|

but also to recognize semantically related content.

**For example, a user searching:**

heat-resistant materials for reactors

**may find:**

Publication A

Publication B

Researcher C

Project D

even when the exact query text does not appear in the title.

The documentation requires semantic search but does not finalize the algorithm, model, or tool, so the final technical choice should not be made at this stage.

## 12. Expert matching

This is one of the highest-value capabilities in the module.

**Flow:**

<img src="media/image31.png" style="width:6.10236in;height:0.38298in" />

*Expert matching flow*

The documentation explicitly states that suggestions are based on publication indicators and research directions.

## 13. Suggestions must be explainable

**Do not only display:**

Match: 92%

**Also explain:**

Suggested partner

**Reasons:**

- 4 overlapping research topics
- 12 related publications
- Similar research direction
- Complementary expertise

This gives users a reason to trust and evaluate the recommendation.

The exact scoring formula is not finalized by the documentation.

## 14. Knowledge relationship model

**At the conceptual level:**

<img src="media/image32.png" style="width:5.6281in;height:6.77165in" />

*Knowledge relationship model*

**This enables actions such as:**

View publication

view author

view topic

view other experts in the same topic

view organization

This is the value of a “knowledge network”.

## 15. Pagination

Publication and expert lists may become very large, so the documentation points toward cursor pagination.

**Prefer:**

GET /experts?limit=30&cursor=...

**instead of relying entirely on:**

?page=10000

**Reason:**

Large OFFSET

→ must skip many records

CURSOR

→ seek directly from a known position

This matters especially when expert/publication volume becomes large.

## 16. Caching

**Public, infrequently changing data such as:**

Expert profiles

Publication details

Organization information

may be cached.

**Flow:**

User

Application cache

Redis if needed

Primary data store

Access-sensitive data must not be cached unconditionally.

The documentation also states that public, infrequently changing data may be cached, but permission-sensitive data must not be cached without appropriate constraints.

## 17. Synchronization jobs must run in the background

**Example: synchronizing 50,000 publications:**

<img src="media/image33.png" style="width:5.73642in;height:6.77165in" />

*Comparison of synchronous request processing and background processing*

Background processing is appropriate for long-running I/O tasks.

## 18. Concurrency handling

There are three main concerns.

Concurrent profile updates

**Two users may edit the same profile:**

User A and User B may concurrently update the same expert profile.

Use data versioning.

**If A updates first:**

Current version = 5

**B still submits version 4:**

→ 409 Conflict

instead of overwriting A’s changes.

Concurrent data synchronization

**There may be:**

ORCID

Scopus

Manual entry

running concurrently.

Jobs must be idempotent, so retries do not create duplicate records.

Search-index update failure

Primary data save: success

Search-index update: failure

The primary transaction should not be rolled back only because indexing failed.

<img src="media/image34.png" style="width:6.10236in;height:0.78147in" />

*Search-index update flow with retry*

## 19. Search-data security

This is a common failure point.

Primary data may enforce authorization correctly while the search index accidentally returns records users are not allowed to see.

**Therefore an indexed record must know at least:**

Object type

Public status

Organization scope

Language

Search results must respect authorization before being returned to the user.

**Do not allow:**

Primary database: hidden

Search index: still discoverable

## 20. Performance analysis

This module is read-heavy, search-heavy, and I/O-heavy.

<img src="media/image35.png" style="width:6.10236in;height:5.00269in" />

*Comparison between an optimized search flow and an anti-pattern fan-out flow*

Fetching extra data for every result can easily create an N+1 request pattern and increase latency for large result sets.

Instead, fetch additional data only when needed for the detail page.

## 21. Performance monitoring

**Measure at least:**

- Search latency
- Detail-fetch latency
- Indexing duration
- Synchronization latency
- Synchronization error rate
- Index lag

**Example:**

Search: 85 ms

Detail fetch: 42 ms

Indexing: 1.2 s

**When a problem occurs, this helps identify whether the bottleneck is:**

database

or

search engine

or

data synchronization

## 22. Analytics data

Publication created

Publication updated

Publication published

Expert profile created

Profile updated

Search performed

Search result clicked

Partner suggestion created

Partner suggestion viewed

**But:**

Analytics data

is different from

Business source of truth

The dashboard only reads aggregated data; the Knowledge domain continues to own publication and expert state according to the portal-wide ownership principle.

## 23. Module 2 metrics

**The documentation identifies:**

Publication count

Expert count

Indexed-record count

Partner-matching count

These can be grouped as:

| **Metric group** | **Metrics** |
|---|---|
| Business metrics | Publication count; Expert count; Patent count; Indexed-profile count; Suggested-partner count |
| Operational metrics | Indexing latency; Synchronization success rate; Search latency; Search error rate |

## 24. Web UI

The updated source defines Knowledge Repository, Expert Directory, and Integrated Search as Public / Discovery surfaces. The routes below remain [DESIGN], not canonical URLs:

- `/knowledge`
- `/publications`
- `/publications/:id`
- `/experts`
- `/experts/:id`
- `/search`
- `/matches`

Expert list page

- Search experts...
- [Field] [Organization] [Country] [Topic]
- Expert A
- Expertise
- Publications · Projects · Organization
- Expert B
- ...

Detail page

Expert

- Profile
- Expertise
- Research directions
- Publications
- Projects
- Organization
- Suggested partners

## 25. Output

**The module must produce:**

<img src="media/image36.png" style="width:6.10236in;height:6.27601in" />

*Module 2 outputs*

These outputs align with the overall documentation: search results, related-object details, and partner suggestions.

## 26. Acceptance Criteria

### Knowledge Repository

There are official scientific records.

Authors, organizations, and topics are linked.

Search indexing exists.

Synchronization does not create duplicate records.

Large synchronization jobs run in the background.

### Expert Directory

Expert profiles exist.

Profiles link to publications and expertise.

Profiles link to organizations.

Suggested partners are available.

Reasons for suggestions are displayed.

### Search

Keyword search works.

Results can be filtered by major criteria.

Cursor pagination is supported.

No data outside the allowed scope is returned.

Appropriate caching exists for public data.

Unauthenticated visitors can use Public / Discovery surfaces for data approved for public exposure.

Search/Expert/Knowledge surfaces must not expose unpublished records or records outside access scope.

### Performance

The business database is not the only search engine at large scale.

Database transactions are not held while calling external data sources.

Failed index updates can be retried.

Search and indexing latency are monitored.

## 27. Items still requiring confirmation

The updated source confirms that unauthenticated users can access Public / Discovery, but publish/edit rights for individual records are still not fully finalized. Two direct items require confirmation:

| **OPEN-03** |
|---|

Who may publish or edit Knowledge Repository and Expert Directory records?

**This affects:**

- Edit rights
- Moderation
- Data governance

| **OPEN-04** |
|---|

Which engine/mechanism will be used for semantic search and matching?

**This affects:**

- Search architecture
- Indexing
- Data model
- Performance

## Module 2 summary

**Final model:**

<img src="media/image37.png" style="width:2.51108in;height:6.77165in" />

*Integrated Module 2 architecture*

A suitable architecture for this module is: business data remains in the source-of-truth store; the search engine serves discovery; the graph model serves relationships; ORCID/Scopus sources are processed asynchronously and safely retryable; caching focuses only on public, infrequently changing data. The source documentation points toward Semantic Search, Elasticsearch/Graph DB, ORCID/Scopus, and cursor pagination; remaining implementation details stay in the design space and are not finalized requirements.

# MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT

The updated sources clarify the nature of Module 3: the Portal supports the lifecycle of research collaboration funded by independent sources (individuals or organizations), and must not assume an intergovernmental funding program. The Foundation only reviews/approves funds raised and managed by the Foundation; state-budget funding, if any, remains under the authority of the competent state bodies of each country.

## 1. Business nature of Module 3

This module connects four layers of value:

- Independent funding opportunities are published for the community to discover.
- Vietnamese and Russian research teams form a joint collaboration proposal / paired-submission structure.
- After an appropriate funding decision within the relevant authority, the project is tracked for progress and results on the same Portal.
- [SOURCE] Commissioned research needs from public organizations/agencies or enterprises may also enter the Portal as collaboration opportunities; the Portal connects and supports implementation, while authority over state-budget allocation, if any, remains with the competent public authority.

Therefore Module 3 is not merely a “grant submission form”. It is a lifecycle from opportunity / research need → collaboration → evaluation → decision within authority → project execution.

## 2. Legal and financial boundaries that must be fixed

| **Case** | **Role of the Portal / Foundation** |
|---|---|
| Funds raised and managed by the Foundation | The Foundation may review and approve funding according to Network rules. |
| Funds from independent individuals / organizations | May become bilateral funding opportunities if accepted/managed by the Foundation through an appropriate mechanism. |
| Research commissioned by a state authority | The Network connects and supports implementation; it does not assume authority to allocate state budget. |
| Vietnam / Russia state budget | Allocation and management belong to the competent authority of each country and remain outside the Foundation’s authority. |

This boundary is mandatory so that UI, workflow, wording, and reporting do not turn the Portal into an assumed “state-budget funding authority”.

## 3. Actors and access areas

| **Actor** | **Primary need** |
|---|---|
| Visitor | View public funding opportunities, understand conditions and the Network. |
| Researcher / Scientist | Find opportunities, form collaboration proposals, track own proposals/projects. |
| Organization Representative | Track/endorse proposals and projects within organization scope if required by policy. |
| Reviewer | Evaluate assigned records only; no access outside assignment. |
| Foundation Operator / Governance Admin | Manage calls/workflows, perform administrative checks, coordinate review, make decisions within Foundation-managed funding authority, monitor audit. |
| Leadership | View aggregated reports according to permission; does not replace business workflow. |

Funding may come from individuals or organizations, but whether there is a direct authenticated “Funder” actor is not finalized by the updated sources.

## 3.1. Opportunity types should be separated in the data model

[DESIGN] To avoid mixing financial authority, an opportunity should carry an explicit type and authority source.

Opportunity

type = INDEPENDENT_FUNDING | COMMISSIONED_RESEARCH | OTHER_APPROVED_TYPE

sponsor / requester

fundingSource

decisionAuthority

publicVisibility

lifecycle

[SOURCE] For commissioned research requested by a state body, the Portal/Foundation must not present itself as the state-budget allocation authority.

## 4. Public / Workspace / Governance

### 4.1. Public / Discovery

- Publicly visible funding-opportunity list.
- Public-level objective, scope, deadline, and participation conditions.
- Entry points to discover suitable experts/partners before creating a proposal.

### 4.2. Role-based Workspace

- Draft proposal / joint proposal.
- Proposal status tracking.
- Reviewer workspace for assignments.
- Project workspace after approval.

### 4.3. Governance & Administration

- Call/workflow management.
- Administrative / eligibility screening if required by policy.
- Review coordination and decisions within Foundation authority.
- Audit, security, and internal reporting.

## 5. Standard business flow at capability level

The [SOURCE + DESIGN] flow should be understood as:

Public Funding Opportunity

↓

Researcher discovers opportunity

↓

VN–RU team / paired collaboration forms

↓

Joint proposal is prepared and submitted

↓

Administrative / eligibility screening [DESIGN]

↓

Independent / anonymized review

↓

Funding decision within Foundation authority

↓

Approved cooperation becomes tracked project

↓

Progress / result monitoring

The updated source confirms publication of opportunities, joint proposals, independent evaluation, and post-approval tracking. Administrative/eligibility screening is [DESIGN] so invalid proposals do not enter scientific review directly.

## 6. Joint proposal and paired submission

The bilingual source states that Module 3 includes a paired-submission mechanism; the Portal VIE source describes a joint proposal between Vietnamese and Russian research teams.

At the domain level, a proposal should not be modeled merely as one user’s form.

Conceptually:

Proposal

lead / initiating side

Vietnam research participation

Russia research participation

organizations / affiliations

scientific content

budget / funding request

collaboration confirmations

submission state

The confirmation mechanism between the two sides, concurrent-edit rights, and the exact point at which a proposal is locked still require detailed decisions; they must not be finalized implicitly by this source update.

## 7. Review

Both updated sources confirm review as a core component: one specifies anonymous peer review; the other specifies independent evaluation by panels from both countries.

- Reviewers may access assigned proposals only.
- Anonymization must be enforced according to confirmed policy, not merely by hiding names in the frontend.
- Review state must be separate from Proposal state.
- Do not infer that “reviewer” is a global IAM role with access to every proposal.

The exact hidden fields, anonymity mechanism, and point of information disclosure, if required by policy, still need a separate specification; do not assume double-blind review when the updated sources have not confirmed it.

## 8. Funding decision does not imply state-budget authority

If funding belongs to sources raised/managed by the Foundation, the workflow may reach a Foundation funding decision according to Network rules.

If the research is associated with a state budget, the Portal must not represent the Foundation as allocating or approving that state budget.

UI and API must distinguish at least:

- Portal / Foundation workflow decision;
- funding source / sponsor;
- external state-budget authority, when applicable;
- project execution state.

## 9. Project lifecycle after approval

The updated source states that Module 3 tracks project progress and results after approval.

Conceptual project state [DESIGN]:

APPROVED

→ ACTIVE

→ MILESTONE / PROGRESS UPDATES

→ COMPLETED

→ CLOSED

Milestone approval, financial reporting, acceptance authority, and overdue policy are not described sufficiently by the two updated sources to finalize the schema/workflow.

## 10. State models must remain separate

| **Aggregate** | **Example state** |
|---|---|
| Funding Opportunity | DRAFT / PUBLISHED / CLOSED [DESIGN] |
| Proposal | DRAFT / SUBMITTED / SCREENING / REVIEW / DECIDED [DESIGN] |
| Review Assignment | ASSIGNED / IN_PROGRESS / SUBMITTED [DESIGN] |
| Funding Decision | APPROVED / REJECTED / CONDITIONAL [DESIGN] |
| Project | PLANNED / ACTIVE / COMPLETED / CLOSED [DESIGN] |

Do not use one status column for the entire lifecycle.

## 11. Conceptual data model

This is [DESIGN], not a persistence schema:

FundingOpportunity

Proposal

ProposalParticipant / CollaborationParty

ProposalOrganizationRef

ReviewAssignment

Review

FundingDecision

Project

ProjectMilestone

FundingSource / SponsorReference

Identity, organization, and expert profile remain owned by their respective domains; Module 3 keeps only necessary stable references.

## 12. Authorization

Real authorization must combine the IAM baseline with resource participation and business state.

identity

+ active context

+ functional permission

+ proposal/project participation

+ reviewer assignment

+ workflow state

= effective decision

For example, a reviewer with REVIEW.SUBMIT still cannot submit a review for a proposal that is not assigned to them.

## 13. UI capability

### Public

- Funding opportunity list / detail.
- Understand conditions and deadlines.
- Discover related experts/partners.

### Research workspace

- My proposals.
- Joint proposal collaboration.
- Submission state.
- Approved projects / progress.

### Reviewer workspace

- Assigned reviews.
- Review form / submit state.

### Governance

- Opportunity / workflow administration.
- Screening queue.
- Review assignment / monitoring.
- Funding decision within authority.

Concrete routes and screen maps remain [DESIGN], not URLs finalized by the updated sources.

## 14. API capability proposal

Do not lock final URLs yet, but capability contracts may include:

Funding Opportunity: list / detail / publish

Proposal: create / collaborate / submit / status

Review: assignment / read assigned / submit

Decision: record / read

Project: create from approved decision / read / progress update

OpenAPI should only be finalized once the state machine and corresponding permissions are confirmed.

## 15. Events and audit

Audit and business events must remain distinct.

- ProposalSubmitted — business event.
- ProposalEligibleForReview — business event [if screening is confirmed].
- ReviewSubmitted — business event.
- FundingDecisionApproved — business event.
- ProjectCreatedFromApprovedDecision — integration/business event.
- UnauthorizedReviewAccessDenied — security/audit event.
- FundingDecisionChanged — sensitive audit event.

Do not audit every click/UI interaction.

## 16. Concurrency and idempotency

Sensitive points include:

- The Vietnam and Russia sides editing the same joint proposal.
- Retry causing duplicate submit.
- Reviewer submitting repeatedly.
- An approved decision triggering Project creation.

Use optimistic concurrency/versioning for collaborative updates and idempotency for commands/events that may retry.

Grant approved → Project should be handled asynchronously/idempotently if implemented across services; event replay must not create duplicate Projects.

## 17. Acceptance Criteria — Module 3

### Public

- Visitors can view published funding opportunities without login.
- Opportunities are not incorrectly labeled as intergovernmental funding programs when the source is independent.

### Proposal

- VN–RU collaboration proposals can be formed.
- Submission state is explicit and retry does not lose data.
- Invalid proposals do not proceed directly to review when screening is applied.

### Review

- Reviewers see only their assignments.
- Independent/anonymized review follows the finalized policy.

### Decision / Funding

- The Foundation makes funding decisions only within funds raised/managed by the Foundation.
- The Foundation is not represented as the allocator of Vietnam or Russia state budgets.

### Project

- An approved proposal can transition to project tracking without creating duplicates.
- Progress and results can be tracked.

### Security / Integration

- IAM does not decide business state.
- No cross-service DB access.
- Sensitive decision/review actions have appropriate audit.

## 18. Items still requiring confirmation

- Exact mechanism for Vietnamese and Russian sides to jointly create/confirm a paired proposal.
- Which fields must be hidden during anonymized review, when information may be revealed, and who may reveal it.
- Authority for screening, review assignment, and final decision by funding-source type.
- Project milestone, financial reporting, and acceptance workflow.
- Representation of sponsor/funding source when funds come from independent individuals or organizations.
- Boundary between programs directly managed by the Foundation and research commissioned by a state authority.

## 19. Important correction: 2+2 does not belong to Module 3

The previous analysis incorrectly placed 2+2 under Module 3.

Both updated sources place 2+2 under Module 5 — Technology Transfer & Enterprise / Institute-University Connection.

Therefore this update removes 2+2 from Module 3. The 2+2 content should be reused under Module 5 with the minimum structure:

- 1 Vietnam institute/university
- 1 Vietnam enterprise
- 1 Russia institute/university
- 1 Russia enterprise

Do not treat 2+2 as a taxonomy of the Grant/Project module.

## Module 3 summary

After the update, Module 3 is the capability for managing independent funding opportunities and the bilateral research-project lifecycle: public discovery → VN–RU collaboration → joint proposal → independent/anonymized review → decision within Foundation-managed funding authority → project tracking. The legal boundary around state-budget authority must remain explicit in UI, API, workflow, and reporting.

# MODULE 4 — TRAINING, KNOWLEDGE TRANSFER & ACADEMIC EXCHANGE

[DECISION] The current implementation scope of Module 4 focuses on training, seminars/professional activities, academic exchange, and knowledge transfer between the Vietnamese and Russian communities; there is no separate financial-support branch.

## 1. Business nature

[SOURCE] The Network organizes and disseminates conferences, seminars, roundtables, professional activities, joint research collaboration, and knowledge exchange between the scientific communities of both countries.

[SOURCE] The Vietnam–Russia Intellectual Forum is identified as a recurring activity; its schedule, venue, registration model, and operational details are not finalized by the source.

## 2. Actors

- Visitor — discovers published activities.
- Scientist / Researcher — registers for / participates in relevant activities.
- Organization Representative — proposes or publishes activities within authorized scope.
- Foundation / Portal Operator — coordinates, moderates/publishes, and governs activities.

## 3. Public / Workspace / Governance

### 3.1. Public / Discovery

- News / Events / Announcements.
- Published training, seminar, and academic-exchange activity details.
- Search/filter by topic, time, and organization if supported by the index.
- Entry point to How to Participate or Sign in when membership is required.

### 3.2. Role-based Workspace

- My activities / registrations.
- Organization activities managed by an authorized user.
- Related documents/knowledge artifacts when policy allows.
- Participation status and operational notifications.

### 3.3. Governance & Administration

- Moderation / publish queue if required by policy.
- Taxonomy, visibility, and operational-state management.
- Audit for sensitive changes.

## 4. Canonical activity groups

[SOURCE + DESIGN] Taxonomy should be configurable; do not hard-code a single activity type.

- TRAINING — professional training/capacity building.
- ACADEMIC_EXCHANGE — academic exchange, seminar, thematic session, and academic activity.
- CONFERENCE_OR_FORUM — conference, forum, roundtable.
- KNOWLEDGE_TRANSFER — knowledge sharing/transfer between groups or organizations.
- JOINT_RESEARCH_NETWORKING — networking to form research collaboration; when a funded proposal emerges, transition to Module 3.

## 5. Activity publication flow

Organization / Operator prepares activity

↓ Draft

↓ Validation / moderation [DESIGN]

↓ Published to Public / Discovery

↓ Registration / participation window

↓ Activity takes place

↓ Outcome / material / knowledge links recorded

↓ Closed / Archived

[SOURCE] The source confirms publication and dissemination of activities; moderation, registration window, and archive states are [DESIGN].

## 6. Participation flow

Visitor discovers activity

↓ read participation conditions

↓ if authentication required → Sign in

↓ participation request / registration [DESIGN]

↓ eligibility / capacity check if required [OPEN]

↓ confirmed / waitlisted / declined [DESIGN]

↓ attend / participate

↓ participation outcome when needed

[OPEN] Not every activity requires registration, a waitlist, or approval; these rules must be configurable by activity type.

## 7. Organization-led activity

[SOURCE] Organizations may register programs/publish collaboration opportunities. An Organization Representative may manage activities only within organization scope.

Authorized organization representative

↓ Create activity draft

↓ Organization scope validation

↓ Publish directly OR submit for operator moderation [OPEN]

↓ Manage participant-facing information

## 8. Knowledge-transfer output

[DESIGN] Activity outcomes may link to Module 2 as material/topic/knowledge references; they must not automatically create an official knowledge record unless they pass Knowledge-domain rules.

## 9. State model

Activity: DRAFT → READY_FOR_PUBLISH → PUBLISHED → CLOSED → ARCHIVED

Participation: DRAFT → SUBMITTED → CONFIRMED | DECLINED | WAITLISTED → ATTENDED | WITHDRAWN

## 10. Conceptual data model

[DESIGN] Not a persistence schema:

AcademicActivity

ActivityType

ActivityOrganizerRef

ActivityTopicRef

ActivitySchedule

Participation

ParticipationDecision

ActivityMaterialRef

KnowledgeOutcomeRef

## 11. Authorization

identity + active context + functional permission + organizer/organization scope + activity state = effective decision

## 12. UI capability

- Public: News / Events list, activity detail, topic filters, participation entry.
- Individual workspace: My registrations / activities / materials.
- Organization workspace: Manage organization activities.
- Governance: moderation/configuration/audit.

## 13. API capability proposal

Activity: list-public / detail / create / update / submit-for-publish / publish / close

Participation: create / read-own / withdraw / decision

Material: attach-reference / list-visible

[DESIGN] Concrete URLs should only be fixed after the state model and moderation rules are confirmed.

## 14. Events and audit

- AcademicActivityPublished — business event.
- ParticipationSubmitted — business event.
- ParticipationConfirmed — business event.
- ActivityClosed — business event.
- UnauthorizedActivityChangeDenied — security/audit event.

## 15. Concurrency / idempotency

- Retry must not create duplicate registrations.
- Activity update should use version/optimistic concurrency if multiple operators edit simultaneously.
- Publish command should be idempotent.
- Capacity/waitlist, if enabled, must prevent overbooking in the owning domain.

## 16. Integration

- IAM provides identity/context.
- Organization domain provides organization/representative references.
- Knowledge domain owns official knowledge artifacts.
- Notification consumes events only; it is not a source of truth.
- Analytics only reads facts/events.

## 17. Acceptance Criteria — Module 4

- Visitors can view published activities.
- Members can only manage activities/registrations within scope.
- Activity state and participation state are clearly separate.
- There is no separate financial-support flow in the current scope.
- Event materials do not automatically become official knowledge records.
- Sensitive publish/moderation actions are audited.
- Retry does not create duplicate registrations.

## 18. OPEN items to confirm

- Which activity types require login/registration.
- Who may publish directly and who requires moderation.
- Whether capacity/waitlist/approval exists.
- Whether certificates/attendance credentials exist.
- Rules for public access to materials after an event.
- How to manage the recurring annual forum.

## Module 4 summary

Module 4 should follow the flow public discovery → activity detail → participation (when needed) → execution → outcome/material link. Approval, capacity, and certification remain [OPEN] unless confirmed by policy.

# MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION

**[SOURCE]** This module connects research outputs/inventions from institutes and universities with application needs from enterprises in both countries, supports collaboration formation, and provides the advisory steps needed to move toward transfer, application, and commercialization.

## 1. Business nature

Module 5 should not be treated only as a “technology catalog”. A suitable implementation lifecycle is discovery → interest → matching → collaboration → advisory/IP/legal → transfer outcome.

## 2. Actors

- Visitor — views public technologies/opportunities.
- Research institution / university representative — publishes technologies/transferable results when authorized.
- Enterprise representative — publishes needs or expresses interest.
- Foundation / operator — moderation, facilitation, and governance.
- Legal / IP advisor — only if future policy defines a specific actor/assignment model.

## 3. Public / Workspace / Governance

### 3.1. Public / Discovery

- Technology / transferable-result catalog.
- Enterprise collaboration needs/opportunities when public.
- Search/filter by field, country, organization, and topic.
- Expression-of-interest entry point.

### 3.2. Role-based Workspace

- My / organization technologies.
- Enterprise needs / expressions of interest.
- Collaboration cases.
- Consortium formation when 2+2 applies.
- Advisory/document exchange according to permission.

### 3.3. Governance & Administration

- Moderation/publish governance.
- Taxonomy/reference data.
- Sensitive collaboration audit.
- Does not replace ownership by institutes/universities/enterprises.

## 4. Technology publication flow

Research result / invention identified

↓ Technology transfer profile drafted

↓ ownership / disclosure / visibility validation [DESIGN]

↓ Published catalog entry

↓ Enterprise discovery / matching

[OPEN] The two updated sources do not finalize the approval authority for publishing a technology; moderation/ownership validation remains [DESIGN].

## 5. Enterprise demand flow

Enterprise defines application / R&D need

↓ Demand/opportunity draft

↓ Organization scope validation

↓ Public or controlled visibility [DESIGN]

↓ Matching with technologies / experts / institutions

## 6. Expression of Interest and matching

Enterprise / partner discovers technology

↓ Expression of Interest (EOI) [DESIGN]

↓ Owning organization reviews interest

↓ Direct discussion / facilitated matching

↓ Collaboration case opened if both sides continue

[DESIGN] EOI is a reasonable implementation capability, but the two updated sources do not finalize its name or state model.

## 7. Direct collaboration and 2+2

[SOURCE] Both updated sources place 2+2 in Module 5. Do not place 2+2 in the Grant/Project taxonomy.

[INHERITED] The previous analysis defined the 2+2 structure as: 1 Vietnam institute/university + 1 Vietnam enterprise + 1 Russia institute/university + 1 Russia enterprise. The two updated sources do not restate this detail but do not contradict it; retain it as an inherited requirement until stakeholders reconfirm it.

## 8. 2+2 validation

VN research institution present

AND VN enterprise present

AND RU research institution present

AND RU enterprise present

= consortium structurally complete

[DESIGN] Do not only store `consortium.type = "2+2"`. The system must know each organization slot, participation state, and corresponding evidence/confirmation.

## 9. 2+2 consortium-formation flow

Technology / enterprise need identified

↓ Candidate organizations discovered

↓ Invitations / interest exchanged [DESIGN]

↓ VN institution confirmed

↓ VN enterprise confirmed

↓ RU institution confirmed

↓ RU enterprise confirmed

↓ 2+2 structural validation passes

↓ Collaboration scope / IP / legal preparation

↓ Active collaboration / transfer process

## 10. IP / legal / advisory boundary

[SOURCE] The module supports advisory steps needed to move toward transfer and commercialization. The two updated sources do not finalize the detailed legal/IP workflow.

- [DESIGN] Store advisory cases / document references; do not infer IP ownership.
- [OPEN] Who approves disclosure, NDA, licensing terms, and commercialization agreement.
- [OPEN] Whether legal contracts/documents are Portal artifacts or only external references.

## 11. State model

[DESIGN] Keep technology publication, interest/case, and consortium states separate:

Technology: DRAFT → REVIEW/READY → PUBLISHED → WITHDRAWN/ARCHIVED

EOI/Case: OPEN → ACKNOWLEDGED → DISCUSSION → CLOSED | CONVERTED_TO_COLLABORATION

Consortium: FORMING → STRUCTURALLY_COMPLETE → CONFIRMED → ACTIVE → COMPLETED | CANCELLED

## 12. Conceptual data model

[DESIGN] Not yet a persistence schema:

TechnologyProfile

TechnologyOwnerRef

EnterpriseNeed

ExpressionOfInterest

CollaborationCase

Consortium

ConsortiumOrganizationSlot

AdvisoryCase

IPLegalArtifactRef

TransferOutcome

## 13. Authorization

identity + active context + functional permission + organization ownership/scope + collaboration participation + state = effective decision

An enterprise user cannot edit a research institution’s technology; a research-organization user cannot view a private enterprise need without scope/participation.

## 14. UI capability

- Public: technology catalog, technology detail, collaboration opportunity, EOI entry.
- Research organization workspace: manage technology profiles and inbound interest.
- Enterprise workspace: manage needs, interests, and collaboration cases.
- 2+2 workspace: consortium composition and confirmation.
- Governance: moderation, taxonomy, and audit.

## 15. API capability proposal

Technology: list-public / detail / create / update / submit / publish / archive

EnterpriseNeed: create / update / list-visible / close

EOI: create / acknowledge / close

Collaboration: create-from-interest / read-participant / update-state

Consortium: add-candidate / confirm-slot / validate-2plus2

[DESIGN] Final URLs depend on the state machine and privacy model.

## 16. Events and audit

- TechnologyPublished — business event.
- ExpressionOfInterestSubmitted — business event.
- CollaborationCaseOpened — business event.
- ConsortiumStructurallyCompleted — business event.
- TransferOutcomeRecorded — business event.
- UnauthorizedTechnologyChangeDenied — security/audit event.

## 17. Concurrency / idempotency

- EOI retries must not create duplicate interest.
- Consortium-slot confirmation must prevent double-confirmation / stale updates.
- Technology updates should use versioning when multiple representatives manage the same record.
- Events that create collaboration/consortium state must be idempotent.

## 18. Integration

- Knowledge provides research-output/publication references; the Technology domain owns technology-transfer state.
- Organization domain owns organization identity/type/country; Module 5 stores stable references only.
- Project completion must not automatically create a Technology entity; create only a candidate/reference when a business rule is finalized.
- Search index is a derived view, not a source of truth.
- Analytics consumes facts/outcomes and does not write back.

## 19. Acceptance Criteria — Module 5

- Visitors can view published technologies.
- Enterprises can express needs/interest within allowed scope.
- Technology ownership/scope is checked on the backend.
- 2+2 structural validation does not rely on only a string type.
- Project completion does not automatically create a technology.
- Private collaboration data does not leak through public/search index.
- Retry does not create duplicate EOI/case records.

## 20. OPEN items to confirm

- Who may create/publish a technology profile.
- Visibility model for enterprise needs and collaboration cases.
- Detailed EOI/negotiation states.
- IP/legal, NDA, licensing, and commercialization workflow.
- Official confirmation mechanism for each 2+2 member.
- Conditions for moving collaboration to completed/transfer outcome.

## Module 5 summary

Module 5 should be implemented as a workflow connecting technology supply with enterprise demand, supporting direct collaboration and 2+2 where appropriate. Technology state, interest state, consortium state, and legal/IP artifacts must remain separate to avoid an uncontrolled aggregate status.

# MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD

**[SOURCE]** The Dashboard is for Network management/leadership, belongs to the internal workspace, and is not part of Public / Discovery. Its purpose is to aggregate data from the modules to monitor effectiveness and support strategic decision-making.

## 1. Business nature

Module 6 is a read-oriented analytics/reporting capability. It does not own transactional state for Proposal, Project, Expert, Academic Activity, or Technology.

## 2. Audience and access boundary

- Leadership — views authorized dashboards/reports.
- Foundation / operator — monitors operations and KPIs within scope.
- Governance administrator — manages definitions/configuration when authorized.
- Visitor / normal member — does not automatically have access to the internal dashboard.

## 3. Metric groups identified by the updated source

- Number of projects / project activities.
- Expert connections.
- Technology-transfer activities.
- Other aggregated metrics supporting monitoring and strategic decisions.

[OPEN] KPI formulas, KPI approval ownership, and drill-down scope are not finalized by the two updated sources.

## 4. Data ownership rule

Business domains = source of truth

↓ facts / events / approved snapshots

Analytics read model

↓ aggregation

Dashboard / report / strategic analysis

[DESIGN] Analytics does not write back into business domains, and dashboard tables must not become transactional sources of truth.

## 5. Ingestion flow

Domain transaction commits

↓ event/fact emitted or snapshot made available

↓ ingestion validates schema/version

↓ idempotent upsert into analytics read model

↓ aggregate / materialized view refresh

↓ dashboard query

## 6. KPI-definition governance

[DESIGN] A KPI should have a definition/version/owner rather than exist only as an isolated SQL query.

KpiDefinition

code

name

business meaning

source facts

formula/version

scope

refresh policy

owner/approver [OPEN]

## 7. Freshness and latency

[OPEN] The two updated sources do not finalize realtime vs. batch. The UI must display “data as of” / last refresh so users understand data latency.

## 8. Drill-down boundary

[DESIGN] A dashboard may drill down to aggregate/detail references when the user is authorized, but must not bypass authorization in the source domain to expose sensitive data.

## 9. Report / export

[SOURCE] The module serves internal/strategic reporting. [OPEN] Export format, approval, watermarking, cross-border data handling, and retention are not finalized.

## 10. Conceptual data model

[DESIGN] Not yet a warehouse schema:

FactProject

FactExpertConnection

FactTechnologyTransfer

FactAcademicActivity

DimensionOrganization

DimensionCountry

DimensionTopic

KpiDefinition

KpiSnapshot

ReportDefinition

ReportRun

## 11. Authorization

identity + active context + dashboard permission + organization/leadership scope + data classification = effective read access

## 12. UI capability

- Leadership dashboard — aggregate KPIs / trends.
- Operational monitoring — health of Network activities, not infrastructure monitoring.
- Report center — approved internal reports/export.
- Governance — KPI definition/configuration when authorized.
- Public homepage — does not expose this module as an internal dashboard.

## 13. API capability proposal

Dashboard: get-summary / get-trend / get-breakdown

KPI: list-definitions / read-snapshot

Report: list / generate [OPEN] / export [OPEN]

Metadata: data-freshness

## 14. Event/fact ingestion

- Consumers must be idempotent.
- Schema/version mismatch must fail safely and be observable.
- Do not broadly consume every event when it is not needed for KPI computation.
- Prefer standardized facts/events with clear business meaning.

## 15. Audit

- Sensitive report export is audited.
- KPI-definition changes are audited.
- Normal dashboard views do not require audit for every click unless the data is sensitive or policy requires it.

## 16. Performance

- Dashboard queries use read models/materialized aggregates instead of synchronous fan-out to every service.
- Heavy exports should use background jobs for large volumes [DESIGN].
- Cache internal aggregates according to freshness policy, but never beyond data-classification rules.

## 17. Acceptance Criteria — Module 6

- Only authorized users can access the internal dashboard.
- Every KPI has a clear definition and data timestamp.
- Dashboard does not write back business state.
- Ingestion retry does not double-count.
- Drill-down does not bypass data scope.
- Sensitive export/configuration is audited.
- This module is not displayed as a public dashboard.

## 18. OPEN items to confirm

- Canonical KPI catalog and governance owner.
- Freshness target / batch vs. near-real-time.
- Data retention and cross-border reporting rules.
- Report approval/export format.
- Drill-down depth and data classification.
- Which KPIs are for leadership, operators, or organization-scoped users.

## Module 6 summary

Module 6 should be implemented as a read-only analytics/reporting layer: business fact → ingestion → aggregate/read model → dashboard/report. Analytics must not become the place where business state is modified or decided.

# PORTAL-WIDE FLOW SUMMARY — IMPLEMENTATION BASELINE

## 1. Public journey

Visitor

↓ Home / News / Events

↓ Global Search

├─ Knowledge

├─ Experts

└─ Opportunities: Funding / Academic / Technology

↓ Learn how to participate OR Sign in

## 2. Member onboarding

Organization → bilateral agreement / compliance → partner eligible → representative identity linked → organization workspace

Individual scientist → registration → affiliation/consent check when required → identity active → expert/research profile link → individual workspace

[DESIGN] Onboarding business state does not belong in IAM; IAM only consumes account/context already confirmed by the owning domain.

## 3. Authenticated request

Request

↓ session/authentication

↓ identity + active context

↓ baseline IAM permission

↓ target-domain resource scope + business state

↓ allow / deny

## 4. Cross-module research-collaboration journey

Expert / Knowledge discovery

↓ partner identification

↓ Funding opportunity or commissioned research need

↓ VN–RU proposal collaboration

↓ review / decision

↓ project execution

↓ outputs may link to Knowledge

↓ technology candidate may be proposed to Module 5 only through explicit business action

## 5. Academic / knowledge-exchange journey

Public activity discovery

↓ participation if required

↓ event / training / exchange

↓ outcome/material reference

↓ optional Knowledge link after domain validation

## 6. Technology-transfer journey

Technology supply OR enterprise demand

↓ matching / EOI

↓ collaboration case

↓ direct collaboration OR 2+2 formation

↓ IP/legal/advisory

↓ transfer/commercialization outcome

## 7. Analytics journey

Domain facts/events

↓ idempotent ingestion

↓ read model / aggregate

↓ internal KPI / dashboard / report

## 8. Deployment sequencing according to source and dependency

[SOURCE] The updated roadmap prioritizes IAM, Knowledge, and PMS in the core phase; a later phase expands Technology/2+2 and Dashboard. The new source does not assign a hard implementation milestone to Module 4.

- [DESIGN] Foundation 0: public shell, multilingual support, IAM boundary, organization/member references, audit conventions.
- [SOURCE-ALIGNED] Core: Module 1 + Module 2 + Module 3.
- [DESIGN] Module 4 may be implemented in parallel after the public shell + identity + organization references are stable.
- [SOURCE-ALIGNED] Module 5/2+2 follows after organization/knowledge/project references are sufficiently stable.
- [SOURCE-ALIGNED] Module 6 follows after domains emit standardized facts/events; a skeleton may be built earlier, but real KPIs require stable data contracts.

## 9. What must not be decided implicitly during implementation

- Exact IdP/SSO provider before a decision exists.
- Final multi-role/multi-context behavior.
- Moderation/publish authority for Knowledge, Academic, and Technology.
- Detailed review-anonymity mechanism; the new source only confirms anonymous/independent review at a high level, not double-blind behavior or information-reveal timing.
- Project milestone/financial-acceptance workflow.
- Activity registration/capacity/certificate behavior.
- IP/legal/licensing workflow.
- KPI formula, freshness, and export governance.

## 10. Definition of Ready before coding each flow

- Actor and data owner are clear.
- Public vs. authenticated vs. governance visibility is clear.
- Minimum state machine is clear.
- Permission + resource scope + business-state rules are clear.
- OPEN decisions affecting API/schema are resolved or isolated.
- Idempotency/concurrency points are identified.
- Audit events and business events are separated.
- Cross-service interaction uses contracts/references and never reads another service’s database directly.

