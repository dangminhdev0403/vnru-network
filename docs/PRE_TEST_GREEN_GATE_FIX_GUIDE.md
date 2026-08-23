# PRE-TEST GREEN GATE FIX GUIDE

Repository: `dangminhdev0403/vnru-network`
Target branch: `master`

## Goal

Bring the current Knowledge → Research Collaboration implementation to a **green, testable baseline** before manual role-by-role acceptance testing.

This pass is **not** for expanding product scope.

The only target journey is:

```text
Knowledge / Expert discovery
→ Research Opportunity
→ Bilateral Proposal
→ VN/RU confirmation
→ Organization endorsement
→ Screening
→ Independent Review
→ Collaboration Decision
→ Research Project
→ Milestones / Reports / Outcomes
```

No financial workflow belongs in this scope.

---

# 0. Hard scope rules

Do not introduce or reintroduce:

```text
funding workflow
budget
investment
sponsor
funding source
disbursement
financial approval
financial reporting
financial support
```

Do not add new user-facing architecture numbering such as:

```text
Module 2
Module 3
```

Use business/domain names only.

Preferred product names:

```text
Quản trị Danh tính & Truy cập
Kho Tri thức & Danh bạ Chuyên gia
Cộng tác Nghiên cứu Song phương
Phản biện Độc lập
Quyết định Cộng tác
Quản lý Dự án Nghiên cứu
```

Do not rewrite the existing shell/layout.

The current runtime shell wins over any old HTML reference.

---

# 1. GREEN BLOCKER — Test fixtures do not support a real VN ↔ RU bilateral flow

## Current problem

The workflow requires two different participants:

```text
VN Researcher
RU Researcher
```

and each participant must operate in their own matching organization context.

The current fixture set only provides one Researcher context:

```text
RESEARCHER
ORGANIZATION / ORG_001
```

The same problem exists for organization endorsement: a bilateral test requires representatives for both sides.

## Required fixture topology

Keep the existing IAM role model.

Do **not** create:

```text
PROGRAM_MANAGER
PROJECT_LEAD as IAM role
```

`PROJECT_LEAD` remains a project resource role if the project service uses it.

Add synthetic identities such as:

```text
RESEARCHER_VN
role: RESEARCHER
context: ORGANIZATION / ORG_001

RESEARCHER_RU
role: RESEARCHER
context: ORGANIZATION / ORG_002

ORG_REPRESENTATIVE_VN
role: ORGANIZATION_REPRESENTATIVE
context: ORGANIZATION / ORG_001

ORG_REPRESENTATIVE_RU
role: ORGANIZATION_REPRESENTATIVE
context: ORGANIZATION / ORG_002

REVIEWER
role: REVIEWER
context: REVIEW_BOARD / BOARD_001

COLLABORATION_MANAGER
role: COLLABORATION_MANAGER
context: PLATFORM / GLOBAL

FOUNDATION_DECISION_MAKER
role: FOUNDATION_DECISION_MAKER
context: PLATFORM / GLOBAL
```

The fixture may use different usernames/emails, but must represent those contexts.

## Important

`services/auth-service/prisma/account.json` must remain NON-SECRET.

Do not commit passwords.

Authentication credentials belong to the local Keycloak/test identity setup.

`account.json` should only keep:

```text
user
externalIdentity
role
permissions
roleAssignment
```

## Fixture validation

Update `import-fixture.ts` so duplicate role instances are allowed across different users/contexts.

The importer must continue to validate:

```text
allowed role
allowed context type
exact allowed capability set
valid UUID/email
unique permission keys inside one fixture
```

Do not assume one fixture per role.

---

# 2. GREEN BLOCKER — Researcher cannot start the agreed journey from Knowledge

## Product journey requirement

Our acceptance case begins with:

```text
RESEARCHER VN
→ /workspace/knowledge
→ search publications / experts / topics / organizations
→ identify an RU partner
→ continue toward collaboration
```

## Current mismatch

A Researcher has collaboration/project capabilities but may not have:

```text
knowledge.workspace.view
```

Therefore the intended journey can fail at the first screen.

## Required decision

For the current product flow, grant Researcher read/discovery access to Knowledge.

Recommended Researcher capabilities for this phase:

```text
knowledge.workspace.view
experts.matches.view            # only if current matching feature is considered stable/read-only

collab.proposals.create
collab.proposals.confirm_paired
collab.proposals.submit

projects.projects.view
projects.milestones.update
projects.reports.submit
```

If `experts.matches.view` is not ready for normal Researcher usage, omit it.

But `knowledge.workspace.view` is required for the acceptance journey we agreed to test.

Update:

```text
account.json
import-fixture.ts
ROLE_POLICIES
ALLOWED_CAPABILITIES
relevant tests
```

Do not create special role-name logic in frontend navigation.

Capability remains the presentation gate.

---

# 3. GREEN BLOCKER — Opportunity create flow creates a Draft that disappears

## Current backend lifecycle

```text
Create Opportunity
→ DRAFT

Publish Opportunity
→ PUBLISHED

Close Opportunity
→ CLOSED
```

The public/standard list currently returns published opportunities.

## Current UX problem

```text
COLLABORATION_MANAGER
→ Create Opportunity
→ backend creates DRAFT
→ UI refetches published list
→ new Draft disappears
→ no Publish action available
```

This is a broken workflow even though the create mutation itself is real.

## Required minimum implementation

The Collaboration Manager must have a usable path:

```text
Create Draft
→ see returned Draft
→ Publish Draft
→ published opportunity appears in list
```

### Preferred option for this pass

After create succeeds:

1. Keep the returned Draft resource in component state or navigate to an Opportunity management surface.
2. Render its real `state = DRAFT`.
3. If user has `collab.opportunities.publish`, show:
   ```text
   Publish
   ```
4. Call:
   ```text
   POST /api/v1/collab/opportunities/:id/publish
   ```
5. On backend success:
   ```text
   invalidate/refetch opportunities
   ```
6. Show actual backend errors on failure.

Do not fake publish locally.

## Close behavior

If a published opportunity is visible and user has the real supported capability/action, expose Close only where the backend currently permits it.

Do not expose unsupported actions based only on UI design.

---

# 4. GREEN BLOCKER — Opportunity → Proposal has no user path

## Current state

The collaboration repository already supports:

```text
createProposal
getProposal
reviseProposal
confirmProposal
endorseProposal
submitProposal
screenProposal
decisionProposal
```

A Proposal detail route also exists.

But a user cannot naturally go:

```text
Opportunity
→ Start Proposal
```

## Required minimum UI

For a `PUBLISHED` opportunity, if the user has:

```text
collab.proposals.create
```

render:

```text
Bắt đầu đề xuất cộng tác
Start collaboration proposal
```

This must open a real create flow.

## Required create fields

Use the current backend contract exactly:

```ts
{
  id,
  opportunityId,
  content,
  vnParticipant: {
    userId,
    organizationRef
  },
  ruParticipant: {
    userId,
    organizationRef
  }
}
```

Do not invent:

```text
budget
funding programme
proposal title if backend does not own one
leadResearcherId
counterpartResearcherId
openDate
closeDate
```

## Participant selection for the acceptance fixture

At minimum the create flow must be able to select/enter:

```text
VN participant
VN organization

RU participant
RU organization
```

For the manual acceptance fixture, `ORG_001` and `ORG_002` are enough.

The caller must be one of the participants and the caller's active organization context must match their own participant organizationRef.

## Success flow

After real create success:

```text
router.push(
  /workspace/collaboration/proposals/<returned-id>
)
```

The Proposal detail page must load the returned backend resource.

No synthetic success object.

---

# 5. GREEN BLOCKER — Knowledge and Collaboration are still disconnected

## Goal

Knowledge must solve:

```text
Who / what is relevant?
```

Collaboration must solve:

```text
What do we do with that discovery?
```

## Required bridge for this pass

Do not create a separate `knowledge-collaboration-bridges` production route.

Integrate only lightweight, truthful bridges into existing Knowledge surfaces.

### Minimum bridge A — Expert

Where an Expert is displayed, if:

```text
user has collab.proposals.create
```

and a proposal creation context can actually consume an expert identifier, show a collaboration-oriented action only if the real integration is supported.

If current proposal backend requires a userId but Knowledge expert records do not reliably expose an IAM userId mapping:

```text
DO NOT FAKE THE MAPPING.
```

Instead show:

```text
View collaboration opportunities
```

linking to:

```text
/workspace/collaboration/opportunities
```

This is safe and real.

### Minimum bridge B — Publication

If proposal backend does not currently support proposal references/publication attachment:

```text
do not add "Add to proposal"
```

Use discovery-only navigation.

### Minimum bridge C — Topic / Organization

If topic/organization → opportunity filtering is not supported by backend query:

```text
do not fabricate filters
```

A truthful link to Opportunities is enough for this pass.

## Green definition

For this pre-test gate, Knowledge only needs a clear user path:

```text
Knowledge discovery
→ Collaboration Opportunities
```

Deep data transfer can come later when backend contracts support it.

---

# 6. GREEN BLOCKER — Financial wording has been reintroduced in CollaborationHub

Search active frontend runtime and remove wording such as:

```text
cơ hội tài trợ
chương trình tài trợ
funding opportunities
funding programmes
финансирования
```

Current Hub language must describe research collaboration, not funding.

## Correct replacement direction

VI:

```text
Theo dõi vòng đời cộng tác từ cơ hội nghiên cứu,
đề xuất song phương, phản biện đến triển khai dự án.

Cơ hội cộng tác nghiên cứu
Khám phá và quản lý các cơ hội nghiên cứu song phương
```

EN:

```text
Follow the research collaboration lifecycle from opportunities,
bilateral proposals and reviews through project delivery.

Research Collaboration Opportunities
Discover and manage bilateral research opportunities
```

RU: use equivalent research-collaboration language without financial meaning.

## Also scan

```text
CollaborationWorkspaceView.tsx
CollaborationHub.tsx
ProposalDetail.tsx
Review UI
Project UI
workspace registry labels
translations
tests
docs that are presented as current product docs
```

Historical migration docs may retain old language if clearly historical.

---

# 7. GREEN BLOCKER — Production environment example is incomplete

The frontend runtime currently depends on:

```text
AUTH_SERVICE_URL
COLLAB_SERVICE_URL
REVIEW_SERVICE_URL
PROJECT_SERVICE_URL
```

## Update example environment file

Recommended:

```env
NODE_ENV=production

AUTH_SERVICE_URL=https://auth.example.com
COLLAB_SERVICE_URL=https://collab.example.com
REVIEW_SERVICE_URL=https://reviews.example.com
PROJECT_SERVICE_URL=https://projects.example.com
```

If the physical backend service directory is still named `grant-service`, that is internal migration debt.

The canonical frontend environment variable should be:

```text
COLLAB_SERVICE_URL
```

Do not make new documentation depend on `GRANT_SERVICE_URL`.

If backward compatibility is temporarily needed:

```ts
process.env.COLLAB_SERVICE_URL ?? process.env.GRANT_SERVICE_URL
```

but the error message and example configuration should use:

```text
COLLAB_SERVICE_URL is required
```

Do not rename the backend service directory in this pass unless all imports, compose files, CI, Prisma, ports, docs and service references are explicitly migrated.

---

# 8. GREEN BLOCKER — CollaborationHub exposes routes regardless of actual user capability

The Hub cards should follow the same capability presentation rules as the Sidebar.

Do not show:

```text
Reviews
Projects
Opportunity management
```

to users who cannot use those surfaces.

## Suggested presentation gates

Opportunities:

```text
collab.opportunities.create
OR collab.opportunities.publish
OR collab.proposals.create
```

Reviews:

```text
reviews.assignments.view_assigned
OR reviews.assignments.manage
```

Projects:

```text
projects.projects.view
OR projects.projects.manage
```

A card hidden by capability is only UX behavior.

Backend remains the security authority.

---

# 9. GREEN BLOCKER — Proposal actions need state-aware visibility

Current Proposal detail uses capabilities, but capability alone is not enough for a clean user workflow.

Buttons should be presented only when both are true:

```text
capability allows the action
+
current backend state makes the action meaningful
```

Do not hard-code authorization.

Use state only for UX presentation.

Example direction:

```text
DRAFT
→ revise
→ participant confirmation

PAIRED_CONFIRMED
→ organization endorsement / submit as supported by backend order

SUBMITTED
→ screening

ELIGIBLE
→ review process / decision only when backend permits

REVISION_REQUESTED
→ revise

APPROVED / REJECTED
→ terminal proposal actions hidden
```

The exact transition order must come from current backend domain code.

Do not invent state transitions from the UI prototype.

---

# 10. GREEN BLOCKER — Review list/detail must fail cleanly

Current Review UI exists and uses real canonical resource paths.

Before manual testing, ensure all standard states are implemented:

```text
Loading
Empty
Error
403
404
Submitted / read-only
Conflict declared
No conflict declared
```

Do not leave:

```text
Loading...
No review assignments found.
```

as the only UX if the API actually failed.

`ReviewList` must distinguish:

```text
empty successful result
vs
request error
```

The detail page must not expose evaluation inputs before a real `NO_CONFLICT` declaration.

The anonymized snapshot must not query Knowledge/Expert APIs to reconstruct hidden identity.

---

# 11. GREEN BLOCKER — Project UI must reflect resource-role semantics

Do not introduce IAM roles:

```text
PROJECT_LEAD
PROJECT_MEMBER
```

if the current Project service models:

```text
LEAD
MEMBER
```

as project resource roles.

IAM capability controls access to project actions.

Project membership controls resource scope.

Keep these separate:

```text
IAM:
RESEARCHER
COLLABORATION_MANAGER
FOUNDATION_DECISION_MAKER
...

Project resource:
LEAD
MEMBER
```

Before testing, verify Project UI actions are capability-aware and backend errors are shown honestly.

---

# 12. No new fake queues

Do not create missing list screens just because the reference HTML contains them.

Only expose:

```text
Proposal list
Decision queue
Screening queue
```

if a real read/list backend contract exists.

A detail endpoint plus mutation endpoints do not imply a list endpoint.

For the manual acceptance journey, it is acceptable to navigate directly to a newly created proposal ID returned by the backend.

---

# 13. Fix current test naming / domain language where touched

New tests should use domain naming.

Prefer:

```text
collaboration-workflow.test.mjs
knowledge-collaboration.test.mjs
```

over new files named by architecture numbering.

Existing historical filenames do not need a disruptive rename unless they are actively being replaced.

Test descriptions should say:

```text
Research Collaboration
Review
Project
Knowledge
```

not internal numbered module terminology.

---

# 14. Replace source-regex-only tests with behavioral contract tests

Current source-presence tests are useful as lint-like guards but are not enough.

Add behavioral tests for the actual integration boundaries.

## A. Opportunity list contract

Mock backend/BFF response:

```json
{
  "items": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "title": "AI Applications in Healthcare",
      "description": "Bilateral research collaboration",
      "state": "PUBLISHED",
      "createdAt": "2026-08-23T00:00:00.000Z",
      "updatedAt": "2026-08-23T00:00:00.000Z"
    }
  ],
  "nextCursor": null
}
```

Assert the repository/hook returns one opportunity.

## B. Create Opportunity

Assert outgoing request contains only supported fields:

```text
id
title
description
```

Assert backend 4xx/5xx becomes UI/repository error.

## C. Publish Opportunity

Assert:

```text
POST /opportunities/:id/publish
```

and successful result invalidates/refetches opportunity data.

## D. Create Proposal

Assert exact payload:

```text
id
opportunityId
content
vnParticipant
ruParticipant
```

## E. Proposal state response

Use backend-shaped response:

```text
revision
state
participants
confirmations
endorsements
```

Assert ProposalDetail can render it.

## F. Review

Assert canonical paths only:

```text
/assignments
/assignments/:id
/assignments/:id/conflict
/assignments/:id/evaluation/save
/assignments/:id/evaluation/submit
```

No obsolete direct aliases.

## G. Project

Assert frontend repository paths correspond to the current project controller.

---

# 15. Add role/capability fixture tests

Add a fixture validation test that proves the intended acceptance actors exist:

```text
RESEARCHER / ORG_001
RESEARCHER / ORG_002

ORGANIZATION_REPRESENTATIVE / ORG_001
ORGANIZATION_REPRESENTATIVE / ORG_002

REVIEWER / REVIEW_BOARD / BOARD_001

COLLABORATION_MANAGER / PLATFORM / GLOBAL

FOUNDATION_DECISION_MAKER / PLATFORM / GLOBAL
```

Also assert there is no IAM fixture role:

```text
PROGRAM_MANAGER
PROJECT_LEAD
```

Assert no active fixture context:

```text
FUNDING_PROGRAM
```

---

# 16. Add no-financial-domain regression test

Scan active runtime source for forbidden product language.

At minimum:

```text
frontend/features/collaboration
frontend/features/reviews
frontend/features/projects
frontend/features/workspace
frontend/app/(workspace)/workspace/collaboration
```

Fail if new active runtime contains terms such as:

```text
funding programme
funding opportunity
budget
disbursement
financial approval
FUNDING_PROGRAM
grants.decisions.issue_foundation
```

Do not fail historical migration docs unless they are part of current runtime/product documentation.

---

# 17. Add environment configuration test

Assert `.env.production.example` documents:

```text
AUTH_SERVICE_URL
COLLAB_SERVICE_URL
REVIEW_SERVICE_URL
PROJECT_SERVICE_URL
```

Assert frontend runtime fails closed when required service URLs are absent.

Canonical collaboration error:

```text
COLLAB_SERVICE_URL is required
```

---

# 18. Stability smoke routes before role acceptance

After build succeeds, the following routes must at least load without frontend crash for an appropriately authorized user:

```text
/workspace
/workspace/knowledge
/workspace/collaboration
/workspace/collaboration/opportunities
/workspace/collaboration/reviews
/workspace/collaboration/projects
```

Detail routes must return proper states rather than crash:

```text
/workspace/collaboration/proposals/<valid-id>
/workspace/collaboration/reviews/<valid-id>
/workspace/collaboration/projects/<valid-id>
```

Invalid IDs should result in controlled 4xx/not-found UX.

---

# 19. Required execution order

Agent must work in this order:

```text
1. Remove all reintroduced financial wording from active runtime
2. Fix canonical COLLAB_SERVICE_URL configuration and env example
3. Add second Researcher fixture for ORG_002
4. Add second Organization Representative fixture for ORG_002
5. Give Researcher Knowledge discovery access for the agreed journey
6. Add/adjust fixture validation tests
7. Fix Opportunity Draft → Publish user flow
8. Add Opportunity → Create Proposal path
9. Redirect real Proposal create success to ProposalDetail
10. Add minimum truthful Knowledge → Opportunities bridge
11. Capability-filter CollaborationHub cards
12. Make Proposal action visibility state-aware
13. Harden Review loading/empty/error states
14. Verify Project resource-role vs IAM-role behavior
15. Add real repository/BFF behavioral contract tests
16. Add no-financial regression test
17. Run full frontend verification
18. Run affected service tests
19. Run build
20. Stop and report
```

Do not start role-by-role manual test in this agent pass.

---

# 20. Verification commands

Use repository-native commands where available.

At minimum, execute and report real output for:

```bash
# frontend
cd frontend

npm run lint
npm run test
npm run build
```

If the project has a distinct typecheck command:

```bash
npm run typecheck
```

Run the design/rules gate if configured:

```bash
npx impeccable detect
```

Then affected services:

```bash
cd services/auth-service
npm test

cd ../grant-service
npm test

cd ../review-service
npm test

cd ../project-service
npm test
```

Also:

```bash
git diff --check
```

Do not claim a command passed if it was not executed.

---

# 21. Green acceptance matrix

All items below must be GREEN before manual role testing begins.

```text
[ ] No financial/funding product wording in active runtime

[ ] COLLAB_SERVICE_URL is canonical and documented
[ ] AUTH_SERVICE_URL documented
[ ] REVIEW_SERVICE_URL documented
[ ] PROJECT_SERVICE_URL documented

[ ] Researcher VN fixture exists at ORG_001
[ ] Researcher RU fixture exists at ORG_002

[ ] Organization Representative VN exists at ORG_001
[ ] Organization Representative RU exists at ORG_002

[ ] Reviewer fixture exists at REVIEW_BOARD / BOARD_001
[ ] Collaboration Manager exists at PLATFORM / GLOBAL
[ ] Foundation Decision Maker exists at PLATFORM / GLOBAL

[ ] PROGRAM_MANAGER is not an IAM fixture role
[ ] PROJECT_LEAD is not an IAM fixture role
[ ] FUNDING_PROGRAM is not an active fixture context

[ ] Researcher can access Knowledge discovery
[ ] Knowledge has a truthful path to Collaboration Opportunities

[ ] Collaboration Manager can create an Opportunity Draft
[ ] The created Draft remains actionable
[ ] Collaboration Manager can publish the Draft
[ ] Published Opportunity appears in the real list

[ ] Researcher can start Proposal from a PUBLISHED Opportunity
[ ] Create Proposal payload matches backend exactly
[ ] Create success navigates to real ProposalDetail

[ ] Proposal detail renders real backend state
[ ] Confirmation action is real
[ ] Endorse action is real
[ ] Submit action is real
[ ] Screening action is real
[ ] Decision action is real
[ ] UI action visibility respects capability + current state

[ ] Reviewer list distinguishes empty from error
[ ] Review detail uses canonical endpoints
[ ] Conflict declaration is real
[ ] Save evaluation is real
[ ] Submit evaluation is real

[ ] Project list/detail load through real project service
[ ] Project resource roles remain LEAD/MEMBER, not IAM roles

[ ] Behavioral contract tests exist
[ ] Fixture topology tests exist
[ ] No-financial regression test exists
[ ] Environment configuration test exists

[ ] frontend lint PASS
[ ] frontend tests PASS
[ ] frontend build PASS
[ ] typecheck PASS if configured
[ ] auth-service tests PASS
[ ] collaboration service tests PASS
[ ] review-service tests PASS
[ ] project-service tests PASS
[ ] git diff --check PASS
```

If any item is red:

```text
DO NOT begin manual role-by-role acceptance testing yet.
```

---

# 22. Required agent final report

Return exactly these sections:

```text
Commit SHA

A. Scope summary

B. Financial vocabulary cleanup

C. Environment/service URL changes

D. IAM fixture topology
   - Researcher VN
   - Researcher RU
   - Org Rep VN
   - Org Rep RU
   - Reviewer
   - Collaboration Manager
   - Foundation Decision Maker

E. Knowledge access + Knowledge → Collaboration bridge

F. Opportunity Draft → Publish flow

G. Opportunity → Proposal create flow

H. Proposal state/action gating

I. Review stability improvements

J. Project role/access verification

K. Tests added

L. Commands actually executed
   - exact command
   - PASS/FAIL

M. Remaining backend gaps

N. Remaining frontend gaps

O. GREEN GATE
   GREEN / NOT GREEN
```

Only report:

```text
GREEN
```

when every acceptance item required for the manual journey is genuinely satisfied.

---

# 23. What happens after GREEN

Do not implement this section in the current pass.

After GREEN, manual acceptance will run in this order:

```text
1. RESEARCHER VN
   Knowledge discovery

2. COLLABORATION_MANAGER
   Create + Publish Opportunity

3. RESEARCHER VN
   Start Proposal

4. RESEARCHER RU
   Confirm participation

5. ORGANIZATION_REPRESENTATIVE VN
   Endorse

6. ORGANIZATION_REPRESENTATIVE RU
   Endorse

7. RESEARCHER
   Submit Proposal

8. COLLABORATION_MANAGER
   Screen

9. COLLABORATION_MANAGER
   Assign Review

10. REVIEWER
    Conflict declaration
    Evaluation
    Submit

11. FOUNDATION_DECISION_MAKER
    Collaboration Decision

12. RESEARCHER / project member
    Project
    Milestone
    Report
    Outcome
```

That role-by-role test is a separate phase.

---

# Final rule

The pre-test baseline is green only when this chain is possible without invented runtime behavior:

```text
KNOWLEDGE DISCOVERY
       ↓
REAL OPPORTUNITY
       ↓
REAL BILATERAL PROPOSAL
       ↓
REAL VN/RU PARTICIPANTS
       ↓
REAL ORGANIZATION ENDORSEMENT
       ↓
REAL SCREENING
       ↓
REAL REVIEW
       ↓
REAL COLLABORATION DECISION
       ↓
REAL PROJECT
```

Every visible mutation must terminate in a real backend mutation result.

No fake success.
No fake role.
No fake context.
No fake queue.
No financial workflow.
