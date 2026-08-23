import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  sanitizeText,
  buildSanitizedSnapshot,
  validateProposalSnapshot,
} from "../../services/collaboration-service/src/modules/reviews/anonymizer.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Issue A: Opportunity draft persistence and manager query scoping", async () => {
  const [repository, service, view] = await Promise.all([
    readFile(new URL("../../services/collaboration-service/src/modules/collaboration/grant.repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../../services/collaboration-service/src/modules/collaboration/grant.service.ts", import.meta.url), "utf8"),
    read("features/collaboration/components/CollaborationWorkspaceView.tsx"),
  ]);

  // Backend repository supports multi-state query
  assert.match(repository, /findOpportunities\(limit:\s*number,\s*states\?:/);
  // Backend service checks manager capabilities for draft inclusion
  assert.match(service, /canManageOpportunities/);
  assert.match(service, /collab\.opportunities\.create/);
  // Frontend view relies directly on server state without localDrafts mock array
  assert.doesNotMatch(view, /const \[localDrafts, setLocalDrafts\]/);
  assert.match(view, /const allOpportunities = opportunities;/);
});

test("Issue B: Runtime UI uses active session/context without hardcoded test fixture UUIDs", async () => {
  const [view, form] = await Promise.all([
    read("features/collaboration/components/CollaborationWorkspaceView.tsx"),
    read("features/reviews/components/ReviewAssignmentForm.tsx"),
  ]);

  // Workspace view does not hardcode test UUIDs as initial form state
  assert.doesNotMatch(view, /useState\("7809a72b-8a8e-49b8-897b-aa663ee38001"\)/);
  assert.doesNotMatch(view, /useState\("7809a72b-8a8e-49b8-897b-bb663ee38021"\)/);
  assert.doesNotMatch(view, /useState\("ORG_001"\)/);
  assert.doesNotMatch(view, /useState\("ORG_002"\)/);

  // Review assignment form does not hardcode reviewer UUID or board
  assert.doesNotMatch(form, /reviewerId:\s*"7809a72b-8a8e-49b8-897b-aa663ee38005"/);
  assert.doesNotMatch(form, /boardRef:\s*"BOARD_001"/);
});

test("Issue C & D: Server-side snapshot creation and anonymization value hardening", async () => {
  const [reviewService, reviewController] = await Promise.all([
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.service.ts", import.meta.url), "utf8"),
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.controller.ts", import.meta.url), "utf8"),
  ]);

  // Controller only requires proposalRef, reviewerId, boardRef
  assert.match(reviewController, /proposalRef,\s*reviewerId,\s*and boardRef are required/);
  // Service verifies ELIGIBLE state and builds authoritative snapshot
  assert.match(reviewService, /proposal\.state !== 'ELIGIBLE'/);
  assert.match(reviewService, /buildSanitizedSnapshot\(proposal\)/);

  // Test anonymizer logic directly
  const rawText = "Contact lead author pi.vietnam@example.com with UUID 7809a72b-8a8e-49b8-897b-aa663ee38001 at ORG_001.";
  const sanitized = sanitizeText(rawText, ["7809a72b-8a8e-49b8-897b-aa663ee38001", "ORG_001"]);
  assert.doesNotMatch(sanitized, /pi\.vietnam@example\.com/);
  assert.doesNotMatch(sanitized, /7809a72b-8a8e-49b8-897b-aa663ee38001/);
  assert.doesNotMatch(sanitized, /ORG_001/);

  const snapshot = buildSanitizedSnapshot({
    content: JSON.stringify({
      title: "Marine Biotechnology Research",
      abstract: "Study conducted by Dr. Nguyen at ORG_001 with email nguyen@lab.vn",
    }),
    opportunity: { title: "Joint AI Initiative" },
    participants: [{ userId: "user-1234", organizationRef: "ORG_001" }],
  });

  assert.equal(snapshot.title, "Marine Biotechnology Research");
  assert.doesNotMatch(snapshot.abstract, /nguyen@lab\.vn/);
  assert.doesNotMatch(snapshot.abstract, /ORG_001/);
  assert.ok(validateProposalSnapshot(snapshot));
});

test("Issue E: Decision Maker Decision Review Summary without reviewer identity leakage", async () => {
  const [reviewService, proposalDetail, reviewRepo] = await Promise.all([
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.service.ts", import.meta.url), "utf8"),
    read("features/collaboration/components/ProposalDetail.tsx"),
    read("features/reviews/repository.ts"),
  ]);

  // Service allows collab.decisions.issue_foundation and reviews.recommendations.view
  assert.match(reviewService, /collab\.decisions\.issue_foundation/);
  assert.match(reviewService, /reviews\.recommendations\.view/);

  // Repository exposes getRecommendation
  assert.match(reviewRepo, /getRecommendation\(proposalRef:/);

  // ProposalDetail renders Decision Review Summary and gates decision on review recommendation
  assert.match(proposalDetail, /reviewSummaryTitle/);
  assert.match(proposalDetail, /averageScientificMerit/);
  assert.match(proposalDetail, /averageFeasibility/);
  assert.match(proposalDetail, /averageBilateralValue/);
  assert.match(proposalDetail, /averageImpact/);
  assert.match(proposalDetail, /overallAverage/);
  assert.match(proposalDetail, /disabled=\{!recommendation\s*\|\|\s*!reason\.trim\(\)/);
});

test("Issue F: Atomic concurrency protection on review submission", async () => {
  const reviewRepo = await readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.repository.ts", import.meta.url), "utf8");

  // Conditional update to prevent concurrent duplicate side effects
  assert.match(reviewRepo, /updateMany\(\{\s*where:\s*\{\s*id:\s*assignmentId,\s*status:\s*\{\s*not:\s*'SUBMITTED'\s*\}\s*\},/);
  assert.match(reviewRepo, /if\s*\(updateResult\.count\s*===\s*0\)\s*\{\s*throw new BadRequestException\('Evaluation already submitted'\);/);
});

test("Issue G: Project bootstrap capability gate", async () => {
  const bootstrapBtn = await read("features/projects/components/BootstrapProjectButton.tsx");

  // Gated on active user capabilities
  assert.match(bootstrapBtn, /useCurrentUser\(\)/);
  assert.match(bootstrapBtn, /collab\.decisions\.issue_foundation/);
  assert.match(bootstrapBtn, /projects\.projects\.manage/);
  assert.match(bootstrapBtn, /if\s*\(!decision\s*\|\|\s*!lead\s*\|\|\s*!canBootstrap\)\s*return null;/);
});
