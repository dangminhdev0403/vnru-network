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

test("Point 1 & Issue B: Runtime UI has no ORG_001/ORG_002 side inference or hardcoded test fixture UUIDs", async () => {
  const [view, form] = await Promise.all([
    read("features/collaboration/components/CollaborationWorkspaceView.tsx"),
    read("features/reviews/components/ReviewAssignmentForm.tsx"),
  ]);

  // Workspace view does not hardcode test UUIDs as initial form state
  assert.doesNotMatch(view, /useState\("7809a72b-8a8e-49b8-897b-aa663ee38001"\)/);
  assert.doesNotMatch(view, /useState\("7809a72b-8a8e-49b8-897b-bb663ee38021"\)/);
  assert.doesNotMatch(view, /useState\("ORG_001"\)/);
  assert.doesNotMatch(view, /useState\("ORG_002"\)/);

  // No ORG_001/ORG_002 side inference in openProposalModal
  assert.doesNotMatch(view, /userContextId === "ORG_001"/);
  assert.doesNotMatch(view, /userContextId === "ORG_002"/);

  // Review assignment form does not hardcode reviewer UUID or board
  assert.doesNotMatch(form, /reviewerId:\s*"7809a72b-8a8e-49b8-897b-aa663ee38005"/);
  assert.doesNotMatch(form, /boardRef:\s*"BOARD_001"/);
});

test("Point 2, 3, 4: Authoritative snapshot, hardened anonymizer, and duplicate reviewer assignment prevention", async () => {
  const [reviewService, reviewController, reviewRepo] = await Promise.all([
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.service.ts", import.meta.url), "utf8"),
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.controller.ts", import.meta.url), "utf8"),
    readFile(new URL("../../services/collaboration-service/src/modules/reviews/review.repository.ts", import.meta.url), "utf8"),
  ]);

  // Controller only accepts proposalRef, reviewerId, boardRef (no proposalSnapshot)
  assert.doesNotMatch(reviewController, /proposalSnapshot/);
  // Service has mandatory GrantRepository injection
  assert.match(reviewService, /grantRepository:\s*GrantRepository/);
  assert.doesNotMatch(reviewService, /grantRepository\?:/);
  // Service verifies ELIGIBLE state and builds authoritative snapshot
  assert.match(reviewService, /proposal\.state !== 'ELIGIBLE'/);
  assert.match(reviewService, /buildSanitizedSnapshot\(proposal\)/);
  // Service and repository check duplicate reviewer assignment
  assert.match(reviewService, /findAssignmentByProposalAndReviewer/);
  assert.match(reviewService, /Reviewer is already assigned to this proposal/);
  assert.match(reviewRepo, /Reviewer is already assigned to this proposal/);

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
      authorName: "Dr. Nguyen", // Must be stripped
      contactEmail: "nguyen@lab.vn", // Must be stripped
    }),
    opportunity: { title: "Joint AI Initiative" },
    participants: [{ userId: "user-1234", organizationRef: "ORG_001" }],
  });

  assert.equal(snapshot.title, "Marine Biotechnology Research");
  assert.doesNotMatch(snapshot.abstract, /nguyen@lab\.vn/);
  assert.doesNotMatch(snapshot.abstract, /ORG_001/);
  assert.equal(snapshot.authorName, undefined);
  assert.equal(snapshot.contactEmail, undefined);
  assert.ok(validateProposalSnapshot(snapshot));

  // Test raw JSON fallback: proposal without explicit abstract field must NEVER set abstract to raw JSON
  const rawJsonSnapshot = buildSanitizedSnapshot({
    content: JSON.stringify({
      author: "Secret Person",
      email: "secret@example.com",
      someRandomField: "should be ignored",
    }),
    opportunity: { title: "Quantum Computing Grant", description: "Bilateral quantum research scope" },
    participants: [{ userId: "user-9999", organizationRef: "ORG_SECRET" }],
  });

  assert.equal(rawJsonSnapshot.title, "Quantum Computing Grant");
  assert.equal(rawJsonSnapshot.abstract, "Bilateral quantum research scope");
  assert.doesNotMatch(rawJsonSnapshot.abstract, /Secret Person/);
  assert.doesNotMatch(rawJsonSnapshot.abstract, /secret@example\.com/);
  assert.doesNotMatch(rawJsonSnapshot.abstract, /\{/);
  assert.ok(validateProposalSnapshot(rawJsonSnapshot));

  // Test JSON-array fallback: proposal with JSON array content must NEVER set abstract to raw JSON array
  const rawJsonArraySnapshot = buildSanitizedSnapshot({
    content: JSON.stringify([
      { author: "Secret Person", email: "secret@example.com" },
      { abstract: "Sanitized abstract from array of objects" },
    ]),
    opportunity: { title: "Bilateral Space Science", description: "Bilateral space exploration scope" },
    participants: [{ userId: "user-8888", organizationRef: "ORG_ARRAY" }],
  });

  assert.equal(rawJsonArraySnapshot.title, "Bilateral Space Science");
  assert.equal(rawJsonArraySnapshot.abstract, "Sanitized abstract from array of objects");
  assert.doesNotMatch(rawJsonArraySnapshot.abstract, /Secret Person/);
  assert.doesNotMatch(rawJsonArraySnapshot.abstract, /\[/);
  assert.ok(validateProposalSnapshot(rawJsonArraySnapshot));

  // Schema-level uniqueness check
  const reviewSchema = await readFile(new URL("../../services/collaboration-service/prisma/reviews/schema.prisma", import.meta.url), "utf8");
  assert.match(reviewSchema, /@@unique\(\[proposalRef,\s*reviewerId\]\)/);
});

test("Point 5 & Issue E: Only fetch recommendation for allowed actors/states", async () => {
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

  // ProposalDetail conditionally enables recommendation hook based on role and post-screening state
  assert.match(proposalDetail, /canViewRecommendation/);
  assert.match(proposalDetail, /isPostScreeningState/);
  assert.match(proposalDetail, /useEvaluationRecommendation\(\s*id,\s*Boolean\(proposal && isPostScreeningState && canViewRecommendation\)/);

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
