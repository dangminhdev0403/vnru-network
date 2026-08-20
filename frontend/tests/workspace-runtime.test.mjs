import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shell = await readFile(new URL("../components/shared/WorkspaceShell.tsx", import.meta.url), "utf8");
const dashboardRoute = await readFile(new URL("../app/workspace/page.tsx", import.meta.url), "utf8");
const iamRoute = await readFile(new URL("../app/workspace/iam/page.tsx", import.meta.url), "utf8");
const knowledgeRoute = await readFile(new URL("../app/workspace/knowledge/page.tsx", import.meta.url), "utf8");
const iamView = await readFile(new URL("../features/auth/components/IamWorkspaceView.tsx", import.meta.url), "utf8");
const knowledgeView = await readFile(new URL("../features/knowledge/components/KnowledgeWorkspaceView.tsx", import.meta.url), "utf8");
const dashboardView = await readFile(new URL("../features/workspace/components/DashboardView.tsx", import.meta.url), "utf8");
const proxy = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");

test("runtime workspace routes compose feature-owned views", () => {
  assert.match(dashboardRoute, /DashboardView/);
  assert.match(iamRoute, /IamWorkspaceView/);
  assert.match(knowledgeRoute, /KnowledgeWorkspaceView/);
});

test("workspace shell links Module 01, Module 02 and existing governance surfaces", () => {
  assert.match(shell, /href:\s*"\/workspace\/iam"/);
  assert.match(shell, /href:\s*"\/workspace\/knowledge"/);
  assert.match(shell, /href:\s*"\/admin\/iam"/);
  assert.match(shell, /href:\s*"\/security"/);
  assert.doesNotMatch(shell, /fetch\(/);
});

test("workspace remains protected by the existing proxy boundary", () => {
  assert.match(proxy, /"\/workspace\/:path\*"/);
});

test("IAM view preserves backend authorization as authoritative", () => {
  assert.match(iamView, /backend service boundary/i);
  assert.match(iamView, /\/admin\/iam/);
  assert.match(iamView, /Keycloak\/OIDC/);
});

test("Knowledge view renders independent real discovery and matching states", () => {
  assert.match(knowledgeView, /publications\.status/);
  assert.match(knowledgeView, /experts\.status/);
  assert.match(knowledgeView, /Expert Matching.*organization-service/s);
  assert.doesNotMatch(knowledgeView, /fetch\(/);
});

test("Knowledge view exposes filter controls for already-supported query params", () => {
  assert.match(knowledgeView, /name="country"/);
  assert.match(knowledgeView, /name="organization"/);
  assert.match(knowledgeView, /name="topic"/);
  assert.match(knowledgeView, /name="language"/);
  assert.match(knowledgeView, /name="year"/);
});

test("Knowledge view uses cursor-based next navigation", () => {
  assert.match(knowledgeView, /publicationCursor/);
  assert.match(knowledgeView, /expertCursor/);
  assert.match(knowledgeView, /Trang tiếp/);
});

test("Workspace sections paginate independently", () => {
  assert.match(knowledgeRoute, /publicationCursor/);
  assert.match(knowledgeRoute, /expertCursor/);
  assert.doesNotMatch(knowledgeRoute, /raw\.cursor/);
});

test("Knowledge retry links preserve current query", () => {
  assert.match(knowledgeView, /retryHref/);
  assert.match(knowledgeView, /buildHref/);
});

const knowledgeRepo = await readFile(new URL("../features/knowledge/repositories/module2.repository.ts", import.meta.url), "utf8");

test("Repository applies runtime shape guards at the server boundary", () => {
  assert.match(knowledgeRepo, /isPublicPublication/);
  assert.match(knowledgeRepo, /isPublicExpert/);
  assert.match(knowledgeRepo, /guard/);
});

test("dashboard uses discovery samples without inventing aggregate totals", () => {
  assert.match(dashboardRoute, /getPublications/);
  assert.match(dashboardRoute, /getExperts/);
  assert.doesNotMatch(dashboardView, /Đối tác đang theo dõi|No aggregate contract|Pending KPI/);
  assert.doesNotMatch(dashboardView, /92%|87%|81%|value:\s*"\d/);
});

test("admin/iam and security routes are owned by WorkspaceShell", async () => {
  const adminPage = await readFile(new URL("../app/admin/iam/page.tsx", import.meta.url), "utf8");
  const securityPage = await readFile(new URL("../app/security/page.tsx", import.meta.url), "utf8");
  assert.match(adminPage, /WorkspaceShell/);
  assert.match(securityPage, /WorkspaceShell/);
});
