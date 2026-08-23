import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Zero-financial vocabulary guard: Active frontend collaboration code has no financial/funding jargon", async () => {
  const [hub, sidebar, oppView, propDetail, revList, revDetail] = await Promise.all([
    read("features/collaboration/components/CollaborationHub.tsx"),
    read("features/workspace/components/WorkspaceSidebar.tsx"),
    read("features/collaboration/components/CollaborationWorkspaceView.tsx"),
    read("features/collaboration/components/ProposalDetail.tsx"),
    read("features/reviews/components/ReviewList.tsx"),
    read("features/reviews/components/ReviewDetail.tsx"),
  ]);

  const combined = `${hub}\n${sidebar}\n${oppView}\n${propDetail}\n${revList}\n${revDetail}`;

  // Forbidden Vietnamese terms
  assert.doesNotMatch(combined, /tài trợ/i, "Must not contain 'tài trợ'");
  assert.doesNotMatch(combined, /ngân sách/i, "Must not contain 'ngân sách'");
  assert.doesNotMatch(combined, /giải ngân/i, "Must not contain 'giải ngân'");
  assert.doesNotMatch(combined, /đầu tư tài chính/i, "Must not contain 'đầu tư tài chính'");

  // Forbidden English terms
  assert.doesNotMatch(combined, /funding workflow/i, "Must not contain 'funding workflow'");
  assert.doesNotMatch(combined, /disbursement/i, "Must not contain 'disbursement'");
  assert.doesNotMatch(combined, /financial approval/i, "Must not contain 'financial approval'");
  assert.doesNotMatch(combined, /financial report/i, "Must not contain 'financial report'");

  // Forbidden Russian terms
  assert.doesNotMatch(combined, /финансирования/i, "Must not contain 'финансирования'");
  assert.doesNotMatch(combined, /финансирование/i, "Must not contain 'финансирование'");
  assert.doesNotMatch(combined, /бюджет/i, "Must not contain 'бюджет'");
});
