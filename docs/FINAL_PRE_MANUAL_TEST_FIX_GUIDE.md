# FINAL PRE-MANUAL TEST FIX GUIDE

Repository: `dangminhdev0403/vnru-network`

Baseline inspected: `aa9dcbedb77c0d66e86b6f90afc1dd9e5525c590`

## 0. Goal

Do one narrow stabilization pass only.

Do NOT redesign the product.
Do NOT expand business scope.
Do NOT add new modules/services.
Do NOT rewrite the shell/layout.
Do NOT change the agreed business lifecycle.

Goal:

```text
fix remaining gaps
→ add regression coverage
→ rerun affected flows
→ report GREEN / NOT GREEN
```

After this pass, the user performs the final manual acceptance test.

## 1. Hard scope

Allowed:
- frontend collaboration/review/project UX fixes
- frontend capability gating
- validation/error handling
- BFF contract fixes if needed
- collaboration-service fixes
- review privacy/integrity fixes
- decision-read model fixes
- concurrency/idempotency fixes
- targeted tests
- local/staging test-data wiring

Not allowed:
- new product features outside current flow
- financial/funding workflows
- new IAM roles
- new business modules
- new deployment-topology changes
- unrelated admin work
- new analytics/academic/technology implementation

Keep current topology:

```text
auth-service
knowledge-service
collaboration-service
```

Keep current flow:

```text
Knowledge
→ Opportunity
→ Proposal
→ VN/RU Confirmation
→ Organization Endorsement
→ Submission
→ Screening
→ Independent Review
→ Collaboration Decision
→ Project
```

## 2. ISSUE A — Opportunity Draft disappears after refresh

### Problem

Frontend keeps newly-created Draft Opportunities in local React state (`localDrafts`) while the normal backend list exposes published opportunities.

Current bad flow:

```text
Create Draft
→ Draft appears
→ refresh
→ Draft disappears from UI
→ Draft remains in DB
→ manager cannot continue to Publish
```

### Fix direction

Provide a real persisted manager-facing Draft path.

Preferred minimal behavior:

```text
COLLABORATION_MANAGER
→ Opportunities
→ backend returns manager-authorized DRAFT/PUBLISHED/CLOSED
```

Use a management query/endpoint or equivalent real backend contract.

Rules:

```text
researcher/public list → PUBLISHED only
manager list          → manager-authorized states
```

Do not rely on `localDrafts` for correctness.

### Acceptance

```text
Create Draft
→ copy ID
→ hard refresh
→ Draft still visible
→ Publish
→ hard refresh
→ PUBLISHED persists
```

## 3. ISSUE B — Hard-coded fixture UUIDs in runtime UI

### Problem

Proposal creation currently initializes fixture-specific VN/RU user IDs and organization refs. Review assignment also defaults a specific reviewer UUID and board.

This couples production UI to one local fixture.

### Fix direction

Remove all fixture-specific IDs from active runtime components.

Proposal creation:
- current actor ID from authenticated session
- current organization from active context
- counterpart selected from a real backend-supported source
- if no counterpart directory API exists, leave explicit input fields empty and validated
- do not silently default ORG_001/ORG_002 or user UUIDs

Review assignment:
- use a real reviewer selector if supported
- otherwise leave reviewer ID empty and explicit
- do not default a fixture reviewer UUID

### Acceptance

Change/regenerate a local test identity subject.

The UI must still work without source-code changes.

## 4. ISSUE C — Review Assignment can use a manually invented snapshot

### Problem

Manager currently submits:

```text
proposalRef
reviewerId
boardRef
title
abstract
```

and frontend constructs `proposalSnapshot`.

This allows:

```text
real proposalRef
+
manually invented review content
```

which breaks review integrity.

### Required design

Review snapshot must be created server-side from the authoritative Proposal.

Required flow:

```text
Manager selects Proposal + Reviewer + Board
→ backend loads authoritative Proposal
→ backend verifies Proposal is review-eligible
→ backend builds sanitized snapshot
→ backend persists immutable snapshot
→ ReviewAssignment created
```

Frontend must not author the review snapshot.

Preferred request:

```ts
{
  proposalRef,
  reviewerId,
  boardRef
}
```

Required backend validation:
- proposal exists
- proposal state is ELIGIBLE
- reviewer ID valid
- board valid
- duplicate assignment policy enforced

### Acceptance

Try assignment with:
- fake proposalRef
- DRAFT proposal
- SUBMITTED but not screened proposal
- ELIGIBLE proposal

Only the valid review-ready proposal should succeed.

## 5. ISSUE D — Anonymization protects keys better than values

### Problem

Current validator strongly restricts field names but mostly checks string values for non-empty/max-length.

That can still allow identity leakage inside values.

### Fix direction

Primary defense:

```text
server builds snapshot from an explicit allowlist of safe source fields
```

For example:

```text
title
abstract
objectives
methodology
expectedOutcomes
keywords
```

Do not accept arbitrary client-authored snapshot content.

Defense-in-depth checks should catch obvious identity leakage:
- email
- UUID
- known participant IDs
- organization refs
- known participant/org names where available

### Tests

Build a proposal containing:
- participant UUID
- email
- ORG_001
- organization name
- author name

Expected reviewer snapshot:
- none of those identifiers present

## 6. ISSUE E — Decision Maker cannot properly inspect review result

### Problem

Backend correctly requires:
- proposal is ELIGIBLE
- submitted review exists

But Decision Maker UI does not clearly expose the anonymized/aggregated review recommendation before decision.

### Fix direction

Add a read-only Decision Review Summary.

Allowed fields:
- totalReviews
- averageScientificMerit
- averageFeasibility
- averageBilateralValue
- averageImpact
- overallAverage
- recommendation summary if supported

Must not expose:
- reviewerId
- reviewer identity
- assignment-private metadata

Use a real capability, preferably `reviews.recommendations.view`, for Decision Maker if policy intends this.

Do not make Decision Maker a review manager.

### Acceptance

Decision Maker:
- can read aggregated recommendation
- cannot see reviewer identity
- cannot alter review
- cannot decide before a review is submitted
- can decide after valid review

## 7. ISSUE F — Review submit concurrency may duplicate logical side effects

### Problem

Current transaction roughly does:

```text
read assignment
check != SUBMITTED
upsert record
set SUBMITTED
recompute recommendation
create outbox event
```

Two concurrent requests may both read the old state before either commits.

### Fix direction

Make submission atomic/idempotent.

Preferred:
- conditional state transition, or
- optimistic version check

Example:

```text
UPDATE assignment
SET status=SUBMITTED
WHERE id=? AND status!=SUBMITTED
```

Check affected row count.

If zero:
- already submitted / conflict

Ensure one logical submission creates one logical outbox event.

Use a unique event key such as:
- assignmentId + eventType
- idempotency key
- equivalent DB uniqueness rule

### Acceptance

Two near-simultaneous submits:

Expected:

```text
1 logical success
1 deterministic already-submitted/conflict response
1 ReviewRecord
1 SUBMITTED assignment
1 logical outbox event
```

## 8. ISSUE G — Project Bootstrap button not capability-aware enough

### Problem

UI currently can show bootstrap based on approved decision + lead presence, while backend allows only actors with:
- `collab.decisions.issue_foundation`
- or `projects.projects.manage`

This creates dead UI.

### Fix direction

Render only if:

```text
approved decision exists
AND lead exists
AND actor has real bootstrap capability
```

Backend remains authoritative.

### Acceptance

Researcher:
- button hidden
- forced API call => 403

Authorized manager/decision actor:
- button visible
- valid bootstrap succeeds

## 9. ISSUE H — Current frontend tests do not prove browser → DB flow

### Problem

Source/regex tests are useful, but they do not prove:
- browser interaction
- session
- BFF
- backend
- database
- cache refresh

### Fix direction

Add a minimal real browser E2E suite, preferably Playwright.

Use independent browser contexts for:
- RESEARCHER_VN
- RESEARCHER_RU
- ORG_REP_VN
- ORG_REP_RU
- REVIEWER
- COLLABORATION_MANAGER
- FOUNDATION_DECISION_MAKER

Minimum automated happy path:

```text
Manager creates + publishes Opportunity
Researcher VN creates Proposal
VN confirms
RU confirms
VN Org Rep endorses
RU Org Rep endorses
Researcher submits
Manager screens ELIGIBLE
Manager assigns Reviewer
Reviewer NO_CONFLICT
Reviewer saves + submits
Decision Maker reads recommendation
Decision Maker approves
Project bootstrap succeeds
Project opens
```

Do not mock backend responses.

## 10. ISSUE I — Rate-limit status unclear

### Required decision

Classify rate limiting as either:

```text
CURRENT REQUIREMENT
or
FUTURE API-GATEWAY RESPONSIBILITY
```

If current requirement:
- implement at correct layer
- test login burst
- read/search burst
- controlled mutation burst
- 429 behavior
- Retry-After if used
- recovery after window

If future gateway responsibility:
- do not add random throttling to controllers now
- document as future edge concern
- mark NOT APPLICABLE TO CURRENT ACCEPTANCE

Never report PASS for a feature that does not exist.

## 11. ISSUE J — Internal naming migration debt

Names like:
- `GrantService`
- `grant.ts`
- `grant-service.spec.ts`
- `program_manager@`
- `checkProgramManager()`

may remain internally for now if behavior is correct.

Do not perform a broad naming refactor in this stabilization pass.

Fix only when:
- user-facing
- capability/context semantics wrong
- runtime behavior affected

Report remaining naming debt.

## 12. Validation hardening checklist

Opportunity:
- valid UUID
- title required
- trim behavior
- duplicate ID conflict
- invalid transition rejection

Proposal:
- valid IDs
- content required
- VN/RU participant UUIDs valid
- participants different
- organizationRef valid/non-empty
- caller is participant
- caller context matches own org
- opportunity PUBLISHED

Confirmation:
- exact participant only
- correct org context
- correct opportunity state
- duplicate-safe

Endorsement:
- org representative capability
- active org matches participant org
- duplicate-safe

Submission:
- both confirmations
- both endorsements
- valid state

Screening:
- manager capability
- SUBMITTED state
- reason required

Review:
- proposal ELIGIBLE
- reviewer/board valid
- server-built snapshot
- NO_CONFLICT before scoring
- scores 1..5
- comments minimum
- submitted immutable

Decision:
- decision capability
- proposal ELIGIBLE
- review submitted
- one final decision

Project:
- approved decision required
- duplicate bootstrap safe
- resource roles valid
- version conflict protected
- terminal state protected

## 13. Security checks

Required:
- IDOR
- context spoofing
- capability bypass
- review privacy
- mass assignment
- XSS-safe rendering
- secret leakage
- session isolation

IDOR:
- use valid IDs belonging to another actor
- expect 403 or policy-safe 404

Context spoofing:
- client-supplied organizationRef/boardRef/contextId must not override trusted session policy

Mass assignment:
try sending privileged fields such as:
- state
- approved
- ownerId
- role
- capabilities
- createdAt

Backend must reject/ignore according to DTO policy.

Session isolation:
- logout actor A
- login actor B
- no cache/buttons/resource state from A may leak

## 14. Concurrency checks required

Run real concurrent tests for:
- VN/RU confirmation
- proposal revision
- review submission
- decision issuance
- milestone/report version update

Required:
- no lost update
- no duplicate logical record
- no duplicate terminal decision
- deterministic conflict response

## 15. Fix-and-retest loop

For every bug:

```text
reproduce
→ capture request/state
→ locate authoritative layer
→ fix smallest correct layer
→ add regression test
→ rerun exact bug
→ rerun surrounding flow
→ continue
```

Do not hide backend bugs with frontend-only workarounds.

## 16. Required implementation order

```text
1. Persisted Draft Opportunity management
2. Remove hard-coded runtime fixture UUIDs
3. Server-side Review snapshot creation
4. Harden anonymization
5. Decision Maker review summary
6. Review submission concurrency/idempotency
7. Project bootstrap capability gate
8. Add browser E2E happy path
9. Add concurrency regression tests
10. Clarify/test rate-limit status
11. Full build/test
12. Full human-flow E2E rerun
13. Stop and report
```

## 17. Mandatory commands

Frontend:

```bash
npm run lint
npm run build
```

If test scripts are added:

```bash
npm run test
npm run test:e2e
```

Auth service:

```bash
npm test
npm run build
```

Knowledge service:

```bash
npm test
npm run build
```

Collaboration service:

```bash
npm run prisma:generate
npm test
npm run build
```

If migrations changed:

```bash
npm run prisma:migrate
```

Also:

```bash
git diff --check
```

## 18. Manual-like E2E required before GREEN

Manager:
- login
- create Draft
- refresh
- verify Draft
- publish
- refresh
- verify PUBLISHED

Researcher VN:
- login
- Knowledge search
- go to Opportunities
- create Proposal
- confirm VN

Researcher RU:
- separate session
- open same Proposal
- confirm RU

Org Rep VN:
- endorse VN

Org Rep RU:
- endorse RU

Researcher:
- submit

Manager:
- screen ELIGIBLE
- assign Reviewer from authoritative Proposal

Reviewer:
- open assignment
- verify anonymized data
- NO_CONFLICT
- save
- reload
- submit

Decision Maker:
- open Proposal
- read aggregated review
- verify no reviewer identity
- approve
- bootstrap project only if authorized

Project Lead/member:
- open Project
- verify project access

## 19. Required negative cases

At minimum:

```text
Researcher forced Decision API → 403
Reviewer opens another assignment → 403/404
Org Rep wrong organization → 403
Decision before review → rejected
Review assignment for non-ELIGIBLE proposal → rejected
Duplicate review submit → deterministic conflict/idempotent
Conflicting decisions → one winner
Researcher project bootstrap → hidden + forced API 403
```

## 20. GREEN definition

Do not report GREEN unless all are true:

```text
Draft survives refresh
No runtime hard-coded actor UUID dependency
Review snapshot comes from authoritative Proposal
Reviewer snapshot contains no prohibited identity
Decision Maker sees aggregated review
Decision Maker does not see reviewer identity
Concurrent review submit is single-logical-submit
Bootstrap button matches backend capability
Browser E2E completes full flow
No S0
No S1
No unresolved correctness S2
```

## 21. Required final report

```text
FINAL PRE-MANUAL TEST REPORT

Commit SHA
Branch
Environment

A. Fixed issues
- issue
- root cause
- fix
- files

B. Persisted Draft test
PASS/FAIL

C. Runtime fixture-coupling test
PASS/FAIL

D. Review integrity/privacy
PASS/FAIL

E. Decision review visibility
PASS/FAIL

F. Review concurrency
PASS/FAIL

G. Project bootstrap authorization
PASS/FAIL

H. Browser E2E
- actor
- action
- result
- business ID

I. Negative authorization
PASS/FAIL

J. Rate limit
IMPLEMENTED / FUTURE-SCOPE / FAIL

K. Commands executed
- exact command
- result

L. Bugs found
- severity
- root cause
- fix
- regression test

M. Remaining risks

N. Final verdict
GREEN / NOT GREEN
```

No passwords.
No cookies.
No bearer tokens.

## Final instruction

This is the last engineering stabilization pass before real manual acceptance.

Do not expand scope.

The target is:

```text
same business flow
+ persisted truth
+ correct authorization
+ review integrity
+ deterministic concurrency
+ browser-to-DB proof
```

When this is GREEN, stop.
