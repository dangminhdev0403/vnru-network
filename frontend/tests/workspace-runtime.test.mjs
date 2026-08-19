import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shell = await readFile(new URL("../components/shared/WorkspaceShell.tsx", import.meta.url), "utf8");
const dashboardRoute = await readFile(new URL("../app/workspace/page.tsx", import.meta.url), "utf8");
const iamRoute = await readFile(new URL("../app/workspace/iam/page.tsx", import.meta.url), "utf8");
const knowledgeRoute = await readFile(new URL("../app/workspace/knowledge/page.tsx", import.meta.url), "utf8");
const iamView = await readFile(new URL("../features/auth/components/IamWorkspaceView.tsx", import.meta.url), "utf8");
const knowledgeView = await readFile(new URL("../features/knowledge/components/KnowledgeWorkspaceView.tsx", import.meta.url), "utf8");
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

test("Knowledge view renders independent real discovery states while matching stays pending", () => {
  assert.match(knowledgeView, /publications\.status/);
  assert.match(knowledgeView, /experts\.status/);
  assert.match(knowledgeView, /Expert Matching.*Pending/s);
  assert.doesNotMatch(knowledgeView, /fetch\(/);
});
