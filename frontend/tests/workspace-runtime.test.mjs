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

test("authenticated shell contains only current capability-gated role dashboards and IAM destinations", async () => {
  const [registry, proxy, header] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("proxy.ts"),
    read("components/shared/Header.tsx"),
  ]);

  for (const href of [
    "/workspace/researcher",
    "/workspace/reviewer",
    "/workspace/organization",
    "/account",
    "/security",
    "/admin/access/roles",
    "/admin/audit",
  ]) {
    assert.match(registry, new RegExp(`href: "${href}"`));
  }
  assert.doesNotMatch(registry, /href: "\/workspace\/(enterprise|leadership)"/);
  assert.doesNotMatch(header, /searchPlaceholder|\/admin\/catalogs/);
  assert.match(proxy, /"\/workspace\/:path\*"/);
});

test("current role routes declare backend-aligned capability guards", async () => {
  const roleCases = [
    ["researcher", "collab.proposals.create"],
    ["reviewer", "reviews.assignments.view_assigned"],
    ["organization", "collab.proposals.endorse"],
  ];

  for (const [route, capability] of roleCases) {
    const source = await read(`app/(workspace)/workspace/${route}/page.tsx`);
    assert.match(source, /requireWorkspaceCapability/);
    assert.match(source, new RegExp(capability.replaceAll(".", "\\.")));
  }
});

test("future persona pages remain authenticated UI previews without role mapping", async () => {
  for (const route of ["enterprise", "leadership"]) {
    const source = await read(`app/(workspace)/workspace/${route}/page.tsx`);
    assert.match(source, /requireWorkspaceSession/);
    assert.doesNotMatch(source, /requireWorkspaceCapability/);
    assert.match(source, /UI Preview/);
  }
});
