import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Collaboration contract: Opportunity lifecycle and API client shapes", async () => {
  const [repository, types, hooks, view] = await Promise.all([
    read("features/collaboration/repository.ts"),
    read("features/collaboration/types.ts"),
    read("features/collaboration/hooks.ts"),
    read("features/collaboration/components/CollaborationWorkspaceView.tsx"),
  ]);

  // Opportunity Repository Endpoints
  assert.match(repository, /createOpportunity\(input:\s*\{\s*id\?:\s*string;\s*title:\s*string;\s*description\?:\s*string\s*\}\)/);
  assert.match(repository, /publishOpportunity\(id:\s*string\)/);
  assert.match(repository, /closeOpportunity\(id:\s*string\)/);
  assert.match(repository, /\/opportunities\/\$\{encodeURIComponent\(id\)\}\/publish/);
  assert.match(repository, /\/opportunities\/\$\{encodeURIComponent\(id\)\}\/close/);

  // Opportunity Types
  assert.match(types, /OpportunityState\s*=\s*"DRAFT"\s*\|\s*"PUBLISHED"\s*\|\s*"CLOSED"/);
  assert.match(types, /state:\s*OpportunityState;/);
  assert.match(types, /ResearchOpportunity/);

  // Opportunity Hooks
  assert.match(hooks, /publishOpportunity/);
  assert.match(hooks, /closeOpportunity/);

  // Workspace View Draft-to-Publish and Proposal creation hooks
  assert.match(view, /handlePublishOpportunity/);
  assert.match(view, /handleCloseOpportunity/);
  assert.match(view, /collab\.opportunities\.publish/);
  assert.match(view, /collab\.proposals\.create/);
});

test("Collaboration contract: Proposal creation payload and state machine gating", async () => {
  const [repository, types, detail] = await Promise.all([
    read("features/collaboration/repository.ts"),
    read("features/collaboration/types.ts"),
    read("features/collaboration/components/ProposalDetail.tsx"),
  ]);

  // Proposal Creation Payload
  assert.match(repository, /vnParticipant:\s*input\.vnParticipant/);
  assert.match(repository, /ruParticipant:\s*input\.ruParticipant/);
  assert.match(types, /vnParticipant:\s*CreateProposalParticipant/);
  assert.match(types, /ruParticipant:\s*CreateProposalParticipant/);

  // ProposalDetail State Gating
  assert.match(detail, /isDraft/);
  assert.match(detail, /isPairedConfirmed/);
  assert.match(detail, /isSubmitted/);
  assert.match(detail, /isEligible/);
  assert.match(detail, /isRevisionRequested/);
  assert.match(detail, /canSaveRevision/);
  assert.match(detail, /canConfirmPairing/);
  assert.match(detail, /canEndorse/);
  assert.match(detail, /canSubmit/);
  assert.match(detail, /canScreen/);
  assert.match(detail, /canDecide/);

  // Guard against blind rendering without state checks
  assert.doesNotMatch(detail, /\{caps\.includes\("collab\.proposals\.confirm_paired"\)\s*&&/);
  assert.doesNotMatch(detail, /\{caps\.includes\("collab\.proposals\.endorse"\)\s*&&/);
  assert.doesNotMatch(detail, /\{caps\.includes\("collab\.proposals\.submit"\)\s*&&/);
});

test("Review manager can create an anonymized assignment from the workspace", async () => {
  const [repository, resource, hooks, list, form] = await Promise.all([
    read("features/reviews/repository.ts"),
    read("features/reviews/resource.ts"),
    read("features/reviews/hooks.ts"),
    read("features/reviews/components/ReviewList.tsx"),
    read("features/reviews/components/ReviewAssignmentForm.tsx"),
  ]);

  assert.match(repository, /createAssignment/);
  assert.match(form, /proposalSnapshot/);
  assert.match(resource, /createAssignment:\s*defineMutation/);
  assert.match(hooks, /useCreateReviewAssignment/);
  assert.match(list, /ReviewAssignmentForm/);
  assert.match(form, /reviews\.assignments\.manage/);
  assert.match(form, /Tạo phân công|Create assignment|Создать назначение/);
});

test("Approved proposal exposes authoritative project bootstrap without raw-ID entry", async () => {
  const [proposal, repository, resource, hooks] = await Promise.all([
    read("features/collaboration/components/ProposalDetail.tsx"),
    read("features/projects/repository.ts"),
    read("features/projects/resource.ts"),
    read("features/projects/hooks.ts"),
  ]);

  assert.match(proposal, /BootstrapProjectButton/);
  assert.match(repository, /bootstrap/);
  assert.match(resource, /bootstrap:\s*defineMutation/);
  assert.match(hooks, /useBootstrapProject/);
});

test("Mutations require SweetAlert2 confirmation and expose pending buttons", async () => {
  const [alerts, proposal, review, project, assignment] = await Promise.all([
    read("lib/alerts.ts"),
    read("features/collaboration/components/ProposalDetail.tsx"),
    read("features/reviews/components/ReviewDetail.tsx"),
    read("features/projects/components/ProjectDetail.tsx"),
    read("features/reviews/components/ReviewAssignmentForm.tsx"),
  ]);

  assert.match(alerts, /confirmAndRun/);
  assert.match(alerts, /if \(!confirmation\.isConfirmed\) return false/);
  for (const source of [proposal, review, project]) {
    assert.match(source, /confirmAndRun/);
    assert.match(source, /aria-busy/);
  }
  assert.match(assignment, /confirmAction/);
  assert.match(assignment, /aria-busy/);
});

test("Review and Project routes follow canonical collaboration topology", async () => {
  const [registry, sidebar, hub] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("features/workspace/components/WorkspaceSidebar.tsx"),
    read("features/collaboration/components/CollaborationHub.tsx"),
  ]);

  assert.match(registry, /\/workspace\/collaboration\/opportunities/);
  assert.match(registry, /\/workspace\/collaboration\/reviews/);
  assert.match(registry, /\/workspace\/collaboration\/projects/);

  assert.match(sidebar, /opportunities:\s*"Cơ hội nghiên cứu"/);
  assert.match(sidebar, /reviews:\s*"Phản biện"/);
  assert.match(sidebar, /projects:\s*"Dự án"/);

  assert.match(hub, /\/workspace\/collaboration\/opportunities/);
  assert.match(hub, /\/workspace\/collaboration\/reviews/);
  assert.match(hub, /\/workspace\/collaboration\/projects/);
});
