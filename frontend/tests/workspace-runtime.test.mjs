import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("workspace root resolves the authenticated persona while legacy IAM routes stay self-service", async () => {
  const [workspace, iam, iamSecurity] = await Promise.all([
    read("app/(workspace)/workspace/page.tsx"),
    read("app/(workspace)/workspace/iam/page.tsx"),
    read("app/(workspace)/workspace/iam/security/page.tsx"),
  ]);

  assert.match(workspace, /requireWorkspaceSession\("\/workspace"\)/);
  assert.match(workspace, /redirect\(resolveLandingPath\(capabilities\)\)/);
  assert.match(iam, /redirect\("\/account"\)/);
  assert.match(iamSecurity, /redirect\("\/security"\)/);
});

test("authenticated shell contains current capability-gated task workspaces and canonical IAM bridge", async () => {
  const [registry, proxy, header] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("proxy.ts"),
    read("components/shared/Header.tsx"),
  ]);

  for (const href of [
    "/workspace/researcher",
    "/workspace/reviewer",
    "/workspace/organization",
    "/workspace/collaboration",
    "/workspace/decisions",
    "/account",
    "/security",
    "/admin/access",
  ]) {
    assert.match(registry, new RegExp(`href: "${href}`));
  }
  assert.doesNotMatch(registry, /href: "\/workspace\/(enterprise|leadership)"/);
  assert.doesNotMatch(registry, /href: "\/governance"/);
  assert.doesNotMatch(header, /searchPlaceholder|\/admin\/catalogs/);
  assert.match(proxy, /"\/workspace\/:path\*"/);
  assert.match(proxy, /isSystemAdministrator\(capabilities\)/);
  assert.match(proxy, /target\.pathname = "\/admin\/access"/);
  assert.match(proxy, /target\.search = ""/);
});

test("current role routes declare backend-aligned capability guards", async () => {
  const guard = await read("features/auth/workspace-server.ts");
  assert.match(guard, /redirect\("\/admin\/access"\)/);
  assert.ok(
    guard.indexOf("isSystemAdministrator(capabilities)")
      < guard.indexOf("requiredCapabilities.some"),
    "system administration must win before business workspace capabilities",
  );

  const roleCases = [
    ["researcher", "collab.proposals.create"],
    ["reviewer", "reviews.assignments.view_assigned"],
    ["organization", "collab.proposals.endorse"],
    ["collaboration", "collab.opportunities.create"],
    ["decisions", "collab.decisions.issue_foundation"],
  ];

  for (const [route, capability] of roleCases) {
    const source = await read(`app/(workspace)/workspace/${route}/page.tsx`);
    assert.match(source, /requireWorkspaceCapability/);
    assert.match(source, new RegExp(capability.replaceAll(".", "\\.")));
  }
});

test("future enterprise and leadership pages remain authenticated UI previews without live persona mapping", async () => {
  for (const route of ["enterprise", "leadership"]) {
    const source = await read(`app/(workspace)/workspace/${route}/page.tsx`);
    assert.match(source, /requireWorkspaceSession/);
    assert.doesNotMatch(source, /requireWorkspaceCapability/);
    assert.match(source, /UI Preview/);
  }
});

test("role workspace actions open stateful demo flows instead of ending at toast feedback", async () => {
  const [dialog, researcher, reviewer, organization, collaboration] = await Promise.all([
    read("features/workspace/components/WorkspaceTaskDialog.tsx"),
    read("features/workspace/components/ResearcherTaskWorkspace.tsx"),
    read("features/workspace/components/ReviewerTaskWorkspace.tsx"),
    read("features/workspace/components/OrganizationTaskWorkspace.tsx"),
    read("features/workspace/components/CollaborationManagerTaskWorkspace.tsx"),
  ]);

  assert.match(dialog, /ModalOverlay/);
  assert.match(dialog, /isDismissable/);
  assert.match(researcher, /kind: "create-proposal"/);
  assert.match(researcher, /proposal-title/);
  assert.match(researcher, /reportSavedAt/);
  assert.match(reviewer, /draftSavedAt/);
  assert.match(reviewer, /cloud_done/);
  assert.match(organization, /setSelectedProjectCode\(project\.code\)/);
  assert.match(organization, /Dự án tổ chức/);
  assert.doesNotMatch(organization, /showToast\(`Mở \$\{project\.code\}/);
  assert.match(collaboration, /kind: "create-opportunity"/);
  assert.match(collaboration, /opportunity-title/);
});
