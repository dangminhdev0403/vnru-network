import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shell = await readFile(new URL("../components/shared/Sidebar.tsx", import.meta.url), "utf8");
const dashboardRoute = await readFile(new URL("../app/(workspace)/workspace/page.tsx", import.meta.url), "utf8");
const iamRoute = await readFile(new URL("../app/(workspace)/workspace/iam/page.tsx", import.meta.url), "utf8");
const knowledgeRoute = await readFile(new URL("../app/(workspace)/workspace/knowledge/page.tsx", import.meta.url), "utf8");
const iamView = await readFile(new URL("../features/auth/components/IamWorkspaceView.tsx", import.meta.url), "utf8");
const knowledgeView = await readFile(new URL("../features/knowledge/components/KnowledgeWorkspaceView.tsx", import.meta.url), "utf8");
const dashboardView = await readFile(new URL("../features/workspace/components/DashboardView.tsx", import.meta.url), "utf8");
const proxy = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");
const globals = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("runtime workspace routes compose feature-owned views", () => {
  assert.match(dashboardRoute, /DashboardView/);
  assert.match(iamRoute, /IamWorkspaceView/);
  assert.match(knowledgeRoute, /KnowledgeWorkspaceView/);
});

test("workspace shell links Module 01, Module 02 and existing governance surfaces", () => {
  assert.match(shell, /href:\s*"\/workspace\/iam"/);
  assert.match(shell, /href:\s*"\/workspace\/knowledge"/);
  assert.match(shell, /href:\s*"\/workspace\/iam\/admin"/);
  assert.match(shell, /href:\s*"\/workspace\/iam\/security"/);
  assert.doesNotMatch(shell, /fetch\(/);
  assert.doesNotMatch(shell, /M01 · IAM|M02 · Knowledge|badge:/);
  assert.doesNotMatch(shell, /tag:/);
  assert.match(shell, /flex[^"\n]*min-w-0[^"\n]*flex-1[^"\n]*items-center[^"\n]*gap-3/);
  assert.match(shell, /overflow-x-hidden/);
});

test("Module 01 template navigation lives in the shared vertical sidebar", () => {
  for (const label of ["Tổng quan IAM", "Quản lý người dùng", "Vai trò & quyền", "Phiên & bảo mật"]) assert.match(shell, new RegExp(label));
  assert.doesNotMatch(shell, /Gán vai trò cho người dùng|view=assignments/);
  assert.doesNotMatch(iamView, /Module1Nav/);
});

test("workspace remains protected by the existing proxy boundary", () => {
  assert.match(proxy, /"\/workspace\/:path\*"/);
});

test("workspace theme uses centralized institutional light and graphite dark tokens", () => {
  assert.match(globals, /@custom-variant dark \(&:where\(\[data-theme="dark"\], \[data-theme="dark"\] \*\)\);/);
  for (const token of [
    "--background", "--surface", "--surface-secondary", "--surface-raised",
    "--border", "--text-primary", "--text-secondary", "--accent-primary",
    "--nav-bg", "--nav-hover", "--nav-active", "--success", "--warning", "--danger",
  ]) assert.match(globals, new RegExp(token));
  assert.match(globals, /--background:\s*#f6f7f9/i);
  assert.match(globals, /--surface:\s*#ffffff/i);
  assert.match(globals, /--nav-bg:\s*#171c23/i);
  assert.match(globals, /\[data-theme="dark"\][^{]*\{[^}]*--background:\s*#11151b/i);
  assert.match(globals, /\.workspace-background\s*\{[^}]*background:\s*var\(--background\)/s);
});

test("shared shell avoids saturated navigation and exposes all theme modes", async () => {
  const header = await readFile(new URL("../components/shared/Header.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(shell, /bg-gradient|shadow-2xl|#08244a|#061a33|hover:scale|hover:translate/);
  assert.match(shell, /before:w-\[3px\]/);
  assert.match(shell, /bg-\[var\(--nav-bg\)\]/);
  assert.match(header, /setTheme\(mode\)/);
  for (const mode of ["light", "dark", "system"]) assert.match(header, new RegExp(`value: "${mode}"`));
});

test("IAM view preserves backend authorization as authoritative", () => {
  assert.match(iamView, /backend service boundary/i);
  assert.match(iamView, /\/workspace\/iam\/admin/);
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
  assert.match(dashboardView, /No aggregate contract/);
  assert.doesNotMatch(dashboardView, /92%|87%|81%|value:\s*"\d/);
});
