import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(process.cwd());
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const provider = read("features/workspace/demo-v2/DemoWorkflowProvider.tsx");
const data = read("features/workspace/demo-v2/mock-data.ts");
const researcher = read("features/workspace/demo-v2/ResearcherInteractiveWorkspace.tsx");
const reviewer = read("features/workspace/demo-v2/ReviewerInteractiveWorkspace.tsx");
const organization = read("features/workspace/demo-v2/OrganizationInteractiveWorkspace.tsx");
const manager = read("features/workspace/demo-v2/CollaborationManagerInteractiveWorkspace.tsx");
const decision = read("features/workspace/demo-v2/DecisionInteractiveWorkspace.tsx");

test("shared demo state models handoffs instead of isolated role-local demos", () => {
  for (const marker of [
    "submitProposal",
    "screenProposal",
    "assignReviewer",
    "submitReview",
    "issueDecision",
    "updateEndorsement",
    "updateReport",
    "completeMilestone",
  ]) assert.match(provider, new RegExp(marker));

  assert.match(provider, /role: "COLLABORATION_MANAGER"/);
  assert.match(provider, /role: "REVIEWER"/);
  assert.match(provider, /role: "FOUNDATION_DECISION_MAKER"/);
  assert.match(provider, /role: "ORGANIZATION_REPRESENTATIVE"/);
  assert.match(provider, /role: "RESEARCHER"/);
});

test("fixtures cover success, waiting, exception and terminal states", () => {
  for (const state of [
    "WAITING_PARTNER",
    "WAITING_ORG_CONFIRMATION",
    "SUBMITTED",
    "NEEDS_INFO",
    "ELIGIBLE",
    "NOT_ELIGIBLE",
    "IN_REVIEW",
    "REVISION",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
    "UNASSIGNED",
    "ASSIGNED",
    "OVERDUE",
    "BLOCKED",
    "COMPLETED",
    "RETURNED",
  ]) assert.match(data, new RegExp(`\\b${state}\\b`));
});

test("researcher is collection-first and owns authoring/progress actions only", () => {
  assert.match(researcher, /Collection → detail → action/);
  assert.match(researcher, /Danh sách dự án & tiến độ/);
  assert.match(researcher, /Bổ sung & gửi lại/);
  assert.match(researcher, /Hoàn tất mốc/);
  assert.doesNotMatch(researcher, /Phân reviewer/);
  assert.doesNotMatch(researcher, /Ban hành trong UI Preview/);
});

test("reviewer has assignment queue then a dedicated evaluation workbench", () => {
  assert.match(reviewer, /Hàng đợi phản biện/);
  assert.match(reviewer, /Chọn hồ sơ để đánh giá/);
  assert.match(reviewer, /Workbench phản biện/);
  assert.match(reviewer, /Xung đột lợi ích/);
  assert.match(reviewer, /Xem trước & nộp/);
  assert.doesNotMatch(reviewer, /Đủ điều kiện/);
});

test("organization representative owns endorsement and organization-scope monitoring", () => {
  assert.match(organization, /Hàng đợi hồ sơ tổ chức/);
  assert.match(organization, /Xác nhận tổ chức/);
  assert.match(organization, /Yêu cầu bổ sung/);
  assert.match(organization, /Không xác nhận/);
  assert.match(organization, /Theo dõi dự án trong phạm vi tổ chức/);
  assert.doesNotMatch(organization, /Chấm điểm/);
});

test("collaboration manager owns orchestration queues and conflict-aware assignment", () => {
  assert.match(manager, /Hàng đợi sàng lọc/);
  assert.match(manager, /Điều phối reviewer/);
  assert.match(manager, /Xung đột lợi ích với hồ sơ này/);
  assert.match(manager, /Tạo cơ hội nghiên cứu/);
  assert.match(manager, /Hàng đợi báo cáo dự án/);
  assert.doesNotMatch(manager, /Tổng điểm quy đổi/);
});

test("decision authority is rationale-driven and keeps history/project views read-only", () => {
  assert.match(decision, /Hàng đợi quyết định/);
  assert.match(decision, /Lý do quyết định/);
  assert.match(decision, /Ban hành trong UI Preview/);
  assert.match(decision, /Lịch sử quyết định/);
  assert.match(decision, /Theo dõi triển khai read-only/);
  assert.doesNotMatch(decision, /Phân reviewer/);
});
