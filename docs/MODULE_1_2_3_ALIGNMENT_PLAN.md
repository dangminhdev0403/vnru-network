# Module 1–2–3 Controlled Alignment Plan

Status: **implemented**

Baseline: `b13abaf`

Source guide: `MODULE_1_2_3_ALIGNMENT_REFACTOR_GUIDE.md`

## 1. Target flow

```text
Module 1 — IAM
Identity -> Active Context -> Role Assignment -> Capability
    |
    v
Module 2 — Knowledge & Experts
Discover publications, experts, topics, organizations, matches
    |
    v
Module 3 — Research Collaboration
Opportunity -> Joint Proposal -> VN/RU Confirmation -> Review
-> Collaboration Decision -> Project -> Milestones/Deliverables/Progress
```

This is an alignment refactor, not a rewrite.

## 2. Current implementation audit

### Module 1 — mostly aligned

Implemented:

- Keycloak/OIDC, session exchange, refresh handling and backend session remain active.
- IAM fixture capability namespace now uses `collab.*`.
- `PROGRAM_MANAGER` became `COLLABORATION_MANAGER`.
- `FUNDING_PROGRAM` was removed from active IAM fixture context.
- Role-permission replacement has a backend transaction, validation, audit and frontend mutation.
- Roles UI groups system/business roles and displays capability domains.

Remaining mismatch:

- `SECURITY_ADMIN` is documented but absent from the active role fixture.
- Assignment context is accepted by backend but not clearly selected/displayed in the active assignment UI.
- No active-context switcher exists although runtime documentation requires one.
- `proxy.ts` checks authentication only; it does not choose a landing surface from backend capabilities.
- Sidebar is static; capability-aware visibility is absent.
- `/workspace/iam/admin` relies on backend API `403` instead of a route-level capability guard.
- Inactive `RolePermissionsConsole.tsx` still contains `grants.*` funding copy.

### Module 2 — preserve runtime

Implemented:

- Public publication and expert list/detail surfaces.
- Search/filter/read-only discovery.
- Expert match read model.
- Authenticated `/workspace/knowledge` capability guard.
- Existing repositories validate narrow response shapes.

Remaining mismatch:

- Discovery remains mostly search/list/detail.
- No Module 2 -> Module 3 action exists; this is correct until Module 3 routes/contracts exist.
- Topic and organization journeys are not complete product surfaces.
- No generated OpenAPI contract exists under `shared/api-contract/`.

### Module 3 — backend logic exists; boundary is not normalized

Implemented:

- Opportunity list/create/publish/close.
- Proposal create/read/revise/confirm/endorse/submit/screen/decision.
- Reviewer assignment/conflict/evaluation/recommendation.
- Project bootstrap, members, milestones, reports, outcomes, completion/termination.

Remaining mismatch:

- Service/package/controller still use `grant-service`, `Grant*`, `/api/v1/grants` and `grants.*`.
- Collaboration schema still owns `FundingOpportunity`, `FundingDecision` and `fundingProgramRef`.
- Review still depends on `FUNDING_PROGRAM` and `fundingProgramRef`.
- Project still depends on `FUNDING_PROGRAM`, `fundingProgramId` and `grants.decisions.issue_foundation`.
- No Module 3 frontend route or feature boundary exists.
- OpenAPI export scripts documented by architecture are not installed/configured in current service manifests.

## 3. Controlled execution order

```text
A. Finish light Module 1 alignment
B. Normalize Module 3 public contracts and authorization
C. Normalize Module 3 persistence by owning service
D. Build only backend-supported Module 3 UI
E. Add capability-aware navigation for implemented surfaces
F. Add real Module 2 bridges
G. Consider physical service rename last
```

## 4. Slice A — finish Module 1 lightly

### A1. Remove stale projection

- Verify `RolePermissionsConsole.tsx` has no caller.
- Delete it if unreferenced; do not maintain two role consoles.
- Remove stale `backendMissing*` copy from the active role page now that mutation exists.

Exit:

- One active role-permission UI.
- No active or dead frontend `grants.*` label map.

### A2. Make assignment scope explicit

Reuse existing role-assignment endpoint and context fields.

- Add context type/id controls to current assignment modal.
- Allowed context types come from the backend session/assignment contract, not role-name inference.
- Display current assignment scope beside role selection.
- Preserve backend validation and authorization.

Do not add assignment-list UI until a backend list contract exists.

Exit:

- Every assignment mutation sends visible, deliberate scope.
- No hidden fallback context.

### A3. Capability-aware landing and navigation

Add one shared server-side route selector based on `/api/v1/auth/me` capabilities:

```text
iam.roles.manage or iam.users.manage -> /workspace/iam/admin
knowledge.workspace.view             -> /workspace/knowledge
collab.*                              -> /workspace/collaboration, only after route exists
reviews.*                             -> /workspace/reviewer, only after route exists
projects.*                            -> /workspace/projects, only after route exists
fallback                              -> /workspace
```

Rules:

- Preserve explicit safe `returnTo`; do not override user-requested valid routes.
- Use capabilities, never role names.
- Route pages still enforce their required capability/resource scope.
- Sidebar consumes the same session capability projection for UX filtering.
- Backend remains authoritative.

Do not add future Module 3 links before their surfaces are usable.

Exit:

- Default post-login destination is useful and deterministic.
- Unauthorized links are hidden; direct backend requests still fail closed.

### A4. Context switching decision gate

Before building UI, inspect whether auth-service exposes an active-context mutation.

- If contract exists: add a minimal switcher to shared workspace shell and invalidate session-bound queries.
- If absent: record backend gap; display current context only. Do not fake a client-only switch.

`SECURITY_ADMIN` is also a decision gate: add only when its distinct capabilities and operational use are defined. Do not create a label-only role.

## 5. Slice B — normalize Module 3 public contracts

Do this before Module 3 frontend.

### B1. Collaboration contract

Change active contract atomically:

```text
/api/v1/grants                -> /api/v1/collab
grants.*                      -> collab.*
grants.proposal.submitted     -> collab.proposal.submitted
grants.decision.approved      -> collab.decision.approved
GrantController/GrantService  -> collaboration terminology in public symbols
```

Keep existing behavior and tested state transitions. Do not add endpoints.

Authorization target:

- public published opportunities: no session;
- create/confirm/submit: explicit `collab.*` plus participant/organization checks;
- publish/screen/decision: `PLATFORM` plus explicit capability;
- endorsement: matching organization context.

### B2. Review contract

- Remove `fundingProgramRef` from request/response/filter contracts.
- Assignment management uses `PLATFORM` + `reviews.assignments.manage`.
- Reviewer work remains `REVIEW_BOARD` + `reviewerId` + `boardRef`.
- Preserve anonymized immutable proposal snapshot.
- Keep one canonical path per action; remove duplicate direct/resource paths only after caller search.

### B3. Project contract

- Remove `fundingProgramId` from DTOs, filters and outbox payloads.
- Keep `proposalRef` and `decisionRef` as immutable provenance.
- Bootstrap requires approved collaboration decision and `collab.decisions.issue_foundation`.
- Reads/writes require membership/organization scope plus `projects.*` capability.
- Keep current explicit HTTP bootstrap; do not add Kafka/API Gateway for this refactor.

Exit for Slice B:

- Active HTTP routes, capability checks and events contain no `grants.*`/funding context.
- Existing behavior remains; frontend has contracts it can safely consume.

## 6. Slice C — normalize persistence separately

One owning service at a time; one migration per service.

### C1. Collaboration persistence

```text
FundingOpportunity      -> ResearchOpportunity
FundingDecision         -> CollaborationDecision
fundingProgramRef       -> remove
EligibilityScreening    -> ProposalScreening only if behavior remains required
```

### C2. Review persistence

- Drop `fundingProgramRef`.
- Keep `proposalRef`, `reviewerId`, `boardRef`, anonymized snapshot and review state.
- Rebuild indexes around actual lookup/isolation paths.

### C3. Project persistence

- Drop `fundingProgramId`.
- Preserve project IDs, `proposalRef`, `decisionRef`, members and lifecycle data.
- Replace financial-context filters with membership/organization/resource checks.

Migration policy:

- Never edit applied migrations.
- Shared data requires backup, dry-run and count/reference verification.
- Disposable local DB may be recreated only with explicit approval.
- No dual `grants.*`/`collab.*` compatibility aliases.

Exit:

- Active Prisma schemas and runtime queries contain no financial-domain state.

## 7. Slice D — build the smallest real Module 3 frontend

Create feature code only for verified backend contracts:

```text
features/collaboration/
features/reviews/
features/projects/
```

Use the existing flow:

```text
Page -> Hook/Query -> Resource -> Repository/BFF -> Backend
```

### D1. Opportunities first

Routes:

```text
/workspace/collaboration
/workspace/collaboration/opportunities
```

Implement:

- bounded list/search/filter from actual endpoint;
- detail only if backend detail contract exists;
- create/publish controls only for matching capability;
- start proposal only after create-proposal contract is normalized.

The hub initially composes real action links/lists. No KPI cards or invented counts.

### D2. Proposal workspace

Routes:

```text
/workspace/collaboration/proposals
/workspace/collaboration/proposals/[id]
```

Current backend lacks a clear bounded "my proposals" list. Decision gate:

- if list contract exists after normalization, implement queue;
- otherwise support detail from known ID/action links and record list endpoint as a backend gap.

Expose only supported actions: revise, confirm, endorse, submit, screen, decision. Backend state remains authoritative; handle `409` by refresh/review.

### D3. Review workspace

Route:

```text
/workspace/reviewer
```

Use existing assignment list/detail/conflict/save/submit contracts after normalization. Never hydrate identity from Module 2 into anonymized snapshots.

### D4. Project workspace

Routes:

```text
/workspace/projects
/workspace/projects/[id]
```

Use current list/detail/member/milestone/report/outcome contracts after funding fields are removed. Do not add financial progress widgets.

### D5. Decision surface

Add `/workspace/collaboration/decisions` only if backend exposes a usable decision queue/read contract. The current proposal decision mutation alone does not justify a separate fake queue.

Every surface handles:

```text
loading | empty | error | 401 | 403 | validation | 409 | success
```

VI/EN/RU uses feature-owned dictionaries. Reuse current shell/theme/components.

## 8. Slice E — expose only usable navigation

Add links incrementally:

1. Collaboration Hub + Opportunities when D1 is usable.
2. Proposals when a real queue/detail entry path exists.
3. Reviews only for `reviews.*` capability.
4. Projects only for `projects.*` capability.
5. Decisions only when a real queue/read contract exists.

Do not list placeholder routes.

## 9. Slice F — Module 2 bridges after Module 3

Preserve all existing public Module 2 contracts.

Add only bridges whose target route/action exists:

1. Expert -> select/add participant to a draft proposal.
2. Publication -> add proposal reference.
3. Topic -> filtered collaboration opportunities.
4. Organization -> related opportunities/participation.
5. Expertise match -> partner selection.

Pass stable IDs through URL or a backend-backed draft mutation. Do not copy whole expert/publication objects into browser state as business authority.

Use honest match wording: related experts/shared expertise unless backend semantics prove more.

## 10. Physical service rename — last gate

Do not rename `services/grant-service` during public-contract normalization.

Rename to `services/collaboration-service` only after:

- active route/capability/event/schema terminology is clean;
- import, package, env, Prisma, scripts, CI and deployment references are enumerated;
- no active caller uses the old service path/name;
- migration/deployment plan is approved.

This keeps early diffs small and avoids mixing domain behavior changes with filesystem/package churn.

## 11. Contract gaps not to fake

Current verified gaps:

- `shared/api-contract/` has no exported contracts.
- Module 3 packages have no `openapi:export` script.
- No complete Module 3 frontend/BFF integration exists.
- No verified active-context switch mutation exists in frontend.
- No clear bounded proposal queue contract was found.
- No clear decision queue/read contract was found.
- Assignment/audit list contracts needed by the IAM UI are incomplete.

Resolve each gap in the owning backend or omit the dependent UI.

## 12. Slice verification

### Module 1

- IAM focused tests and TypeScript.
- Explicit `returnTo` preservation.
- Default capability landing matrix.
- Route-level `401/403` checks.
- Sidebar capability filtering.
- Role assignment context payload.

### Module 3 backend

- collaboration opportunity/proposal transition tests;
- review isolation/anonymization tests;
- project provenance/membership tests;
- clean DB migration apply;
- forbidden legacy identifier scan;
- service lint/test/build.

### Module 3 frontend

- repository/resource focused checks;
- route loading/empty/error/401/403/409/success;
- VI/EN/RU;
- light/dark/responsive browser QA;
- Network and Console inspection;
- Impeccable gate.

### Module 2 bridges

- existing discovery regression checks;
- stable target IDs and real Module 3 mutations;
- no public contract regression.

Final once:

```text
affected lint
+ affected tests
+ affected typecheck/build
+ repository boundary scan
+ git diff --check
```

Never report PASS without actual command output.

## 13. Explicit non-goals

- No rewrite of Modules 1 or 2.
- No Modules 4–6.
- No finance, funding, budget, sponsor, payment, disbursement or financial reporting.
- No fake KPI/dashboard data.
- No frontend role-name authorization.
- No automatic business permissions for `SUPER_ADMIN`.
- No Kafka/API Gateway implementation for this alignment.
- No speculative context, service, shared package or compatibility layer.
- No Module 2 bridge before its Module 3 destination exists.

## 14. Recommended first implementation batch

```text
1. Delete verified-dead RolePermissionsConsole.tsx.
2. Remove stale role-page backend-missing copy.
3. Make assignment context explicit.
4. Add shared capability landing selector for implemented routes only.
5. Normalize collaboration public route/capability/event names.
6. Remove review/project funding context contracts.
```

Stop after this batch and re-audit contracts before creating Module 3 UI.
