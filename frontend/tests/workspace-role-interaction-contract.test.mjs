import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(process.cwd());
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const researcher = read("features/workspace/components/ResearcherInteractiveWorkspace.tsx");
const reviewer = read("features/workspace/components/ReviewerInteractiveWorkspace.tsx");
const organization = read("features/workspace/components/OrganizationInteractiveWorkspace.tsx");
const manager = read("features/workspace/components/CollaborationManagerInteractiveWorkspace.tsx");
const decision = read("features/workspace/components/DecisionInteractiveWorkspace.tsx");
const demoBackend = read("features/prototype-v3/demo-backend.ts");

const routeSources = {
  researcher: read("app/(workspace)/workspace/researcher/page.tsx"),
  reviewer: read("app/(workspace)/workspace/reviewer/page.tsx"),
  organization: read("app/(workspace)/workspace/organization/page.tsx"),
  manager: read("app/(workspace)/workspace/collaboration/page.tsx"),
  decision: read("app/(workspace)/workspace/decisions/page.tsx"),
};

test("all active role routes use the interaction-depth workspaces", () => {
  assert.match(routeSources.researcher, /ResearcherInteractiveWorkspace/);
  assert.match(routeSources.reviewer, /ReviewerInteractiveWorkspace/);
  assert.match(routeSources.organization, /OrganizationInteractiveWorkspace/);
  assert.match(routeSources.manager, /CollaborationManagerInteractiveWorkspace/);
  assert.match(routeSources.decision, /DecisionInteractiveWorkspace/);

  for (const source of Object.values(routeSources)) {
    assert.doesNotMatch(source, /TaskWorkspace/);
  }
});

test("researcher scenarios cover authoring, waiting, review and terminal outcomes", () => {
  for (const marker of [
    "DRAFT",
    "WAITING_PARTNER",
    "WAITING_ORG",
    "NEEDS_INFO",
    "SUBMITTED",
    "SCREENING",
    "IN_REVIEW",
    "APPROVED",
    "REJECTED",
    "WITHDRAWN",
    "PLANNED",
    "ACTIVE",
    "AT_RISK",
    "PAUSED",
    "COMPLETED",
  ]) assert.match(researcher, new RegExp(`\\b${marker}\\b`));

  assert.match(researcher, /Đề xuất/);
  assert.match(researcher, /Dự án/);
  assert.match(researcher, /Tri thức/);
  assert.match(researcher, /Học thuật/);
  assert.doesNotMatch(researcher, /Phân công reviewer/);
  assert.doesNotMatch(researcher, /Ban hành quyết định/);
});

test("reviewer is assignment-first and keeps reviewer-only exception states", () => {
  for (const marker of ["NEW", "IN_REVIEW", "WAITING_INFO", "CONFLICT", "OVERDUE", "DRAFT", "SUBMITTED", "CANCELLED"]) {
    assert.match(reviewer, new RegExp(`\\b${marker}\\b`));
  }

  assert.match(reviewer, /Hàng đợi phản biện/);
  assert.match(reviewer, /Mở chi tiết/);
  assert.match(reviewer, /Workbench phản biện/);
  assert.match(reviewer, /Báo xung đột/);
  assert.match(reviewer, /Xác nhận nộp/);
  assert.doesNotMatch(reviewer, /Công bố cơ hội/);
  assert.doesNotMatch(reviewer, /Xác nhận phạm vi tổ chức/);
});

test("organization representative owns endorsement and organization-scope project actions", () => {
  for (const marker of ["PENDING", "NEEDS_INFO", "ENDORSED", "DECLINED", "WITHDRAWN", "EXPIRED", "ACTION_REQUIRED", "WAITING_PARTNER", "COMPLETED"]) {
    assert.match(organization, new RegExp(`\\b${marker}\\b`));
  }

  assert.match(organization, /Bàn xác nhận của tổ chức/);
  assert.match(organization, /Đã xác nhận phạm vi tổ chức/);
  assert.match(organization, /Đã yêu cầu bổ sung thông tin tổ chức/);
  assert.match(organization, /Đã từ chối xác nhận phạm vi tổ chức/);
  assert.doesNotMatch(organization, /Tổng điểm phản biện/);
  assert.doesNotMatch(organization, /Phân công reviewer/);
});

test("collaboration manager owns queues, screening, assignments and report handling", () => {
  for (const marker of [
    "DRAFT",
    "PUBLISHED",
    "CLOSED",
    "ARCHIVED",
    "NEW",
    "IN_SCREENING",
    "NEEDS_INFO",
    "ELIGIBLE",
    "NOT_ELIGIBLE",
    "UNASSIGNED",
    "ASSIGNED",
    "CONFLICT",
    "DECLINED",
    "COMPLETED",
    "PENDING",
    "RETURNED",
    "APPROVED",
    "OVERDUE",
  ]) assert.match(manager, new RegExp(`\\b${marker}\\b`));

  assert.match(manager, /Cơ hội/);
  assert.match(manager, /sàng lọc/i);
  assert.match(manager, /phân công/i);
  assert.match(manager, /báo cáo/i);
  assert.match(manager, /conflict/i);
  assert.doesNotMatch(manager, /Tổng điểm quy đổi/);
  assert.doesNotMatch(manager, /Lý do quyết định/);
});

test("decision authority requires evidence and rationale and remains separate from orchestration", () => {
  for (const marker of ["PENDING", "APPROVED", "REVISION", "REJECTED", "DEFERRED", "PLANNED", "ACTIVE", "AT_RISK", "COMPLETED"]) {
    assert.match(decision, new RegExp(`\\b${marker}\\b`));
  }

  assert.match(decision, /Bàn quyết định nghiệp vụ/);
  assert.match(decision, /ackEvidence/);
  assert.match(decision, /rationale/);
  assert.match(decision, /Đã ban hành/);
  assert.doesNotMatch(decision, /Phân công reviewer/);
  assert.doesNotMatch(decision, /Tạo cơ hội/);
  assert.doesNotMatch(decision, /Hoàn tất milestone/);
});

test("cross-role demo backend persists notifications and explicit handoffs", () => {
  for (const marker of [
    "DemoNotification",
    "DemoHandoff",
    "useDemoNotifications",
    "useDemoHandoffs",
    "markDemoNotificationRead",
    "markAllDemoNotificationsRead",
    "notifications",
    "handoffs",
  ]) assert.match(demoBackend, new RegExp(marker));

  assert.match(reviewer, /stage: "REVIEW_SUBMITTED"/);
  assert.match(reviewer, /stage: "REVIEWER_CONFLICT"/);
  assert.match(organization, /stage: "ORG_ENDORSED"/);
  assert.match(organization, /stage: "ORG_NEEDS_INFO"/);
  assert.match(decision, /stage: "PROJECT_APPROVED"/);
});
