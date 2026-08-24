import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(process.cwd());
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const provider = read("features/workspace/demo-v2/DemoWorkflowProvider.tsx");
const proposalsContent = read("features/workspace/mock-data/proposals.ts");
const reviewsContent = read("features/workspace/mock-data/reviews.ts");
const projectsContent = read("features/workspace/mock-data/projects.ts");
const reportsContent = read("features/workspace/mock-data/reports.ts");
const notificationsContent = read("features/workspace/mock-data/notifications.ts");
const activitiesContent = read("features/workspace/mock-data/activities.ts");
const expertsContent = read("features/workspace/mock-data/experts.ts");
const orgsContent = read("features/workspace/mock-data/organizations.ts");
const oppsContent = read("features/workspace/mock-data/opportunities.ts");
const academicsContent = read("features/workspace/mock-data/academic-events.ts");
const knowledgeContent = read("features/workspace/mock-data/knowledge.ts");
const iamContent = read("features/workspace/mock-data/iam.ts");
const endorsementsContent = read("features/workspace/mock-data/endorsements.ts");
const decisionsContent = read("features/workspace/mock-data/decisions.ts");

const allMockDataContent = [
  proposalsContent,
  reviewsContent,
  projectsContent,
  reportsContent,
  notificationsContent,
  activitiesContent,
  expertsContent,
  orgsContent,
  oppsContent,
  academicsContent,
  knowledgeContent,
  iamContent,
  endorsementsContent,
  decisionsContent,
].join("\n");

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
    "WITHDRAWN",
    "UNASSIGNED",
    "ASSIGNED",
    "OVERDUE",
    "BLOCKED",
    "COMPLETED",
    "RETURNED",
  ]) assert.match(allMockDataContent, new RegExp(`\\b${state}\\b`));
});

test("mock data quantities satisfy MOCK_DATA_AGENT_GUIDE minimums", () => {
  const countMatches = (content, regex) => (content.match(regex) || []).length;

  const expertCount = countMatches(expertsContent, /id:\s*"exp-/g);
  const orgCount = countMatches(orgsContent, /id:\s*"org-/g);
  const oppCount = countMatches(oppsContent, /id:\s*"op\d+"/g);
  const proposalCount = countMatches(proposalsContent, /id:\s*"p\d+"/g);
  const projectCount = countMatches(projectsContent, /id:\s*"pr\d+"/g);
  const reviewCount = countMatches(reviewsContent, /id:\s*"rv\d+"/g);
  const reportCount = countMatches(reportsContent, /id:\s*"rp\d+"/g);
  const notifCount = countMatches(notificationsContent, /id:\s*"n\d+"/g);
  const actCount = countMatches(activitiesContent, /id:\s*"act\d+"/g);
  const academicCount = countMatches(academicsContent, /id:\s*"ac\d+"/g);
  const knowledgeCount = countMatches(knowledgeContent, /id:\s*"k\d+"/g);
  const iamUserCount = countMatches(iamContent, /id:\s*"usr-\d+"/g);

  assert.ok(expertCount >= 24, `experts count ${expertCount} should be >= 24`);
  assert.ok(orgCount >= 14, `orgs count ${orgCount} should be >= 14`);
  assert.ok(oppCount >= 12, `opportunities count ${oppCount} should be >= 12`);
  assert.ok(proposalCount >= 20, `proposals count ${proposalCount} should be >= 20`);
  assert.ok(projectCount >= 12, `projects count ${projectCount} should be >= 12`);
  assert.ok(reviewCount >= 14, `reviews count ${reviewCount} should be >= 14`);
  assert.ok(reportCount >= 12, `reports count ${reportCount} should be >= 12`);
  assert.ok(notifCount >= 24, `notifications count ${notifCount} should be >= 24`);
  assert.ok(actCount >= 36, `activities count ${actCount} should be >= 36`);
  assert.ok(academicCount >= 12, `academic events count ${academicCount} should be >= 12`);
  assert.ok(knowledgeCount >= 20, `knowledge resources count ${knowledgeCount} should be >= 20`);
  assert.ok(iamUserCount >= 18, `IAM users count ${iamUserCount} should be >= 18`);
});

test("mock data excludes financial and investment product terms", () => {
  const financialPatterns = [
    /\bdisbursement\b/i,
    /\bgiải ngân\b/i,
    /\bngân sách dự án\b/i,
    /\btài trợ vốn\b/i,
    /\broi\b/i,
    /\bdeal value\b/i,
    /\broyalties\b/i,
  ];

  for (const pattern of financialPatterns) {
    assert.doesNotMatch(allMockDataContent, pattern, `Mock data must not contain financial domain terms: ${pattern}`);
  }
});

test("notifications contain valid deep-links to role workspaces", () => {
  for (const role of [
    "RESEARCHER",
    "REVIEWER",
    "ORGANIZATION_REPRESENTATIVE",
    "COLLABORATION_MANAGER",
    "FOUNDATION_DECISION_MAKER",
  ]) {
    assert.match(notificationsContent, new RegExp(`role:\\s*"${role}"`));
  }
  assert.match(notificationsContent, /href:\s*"\/workspace\/researcher/);
  assert.match(notificationsContent, /href:\s*"\/workspace\/reviewer/);
  assert.match(notificationsContent, /href:\s*"\/workspace\/organization/);
  assert.match(notificationsContent, /href:\s*"\/workspace\/collaboration/);
  assert.match(notificationsContent, /href:\s*"\/workspace\/decisions/);
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
