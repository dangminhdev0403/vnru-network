import assert from "node:assert/strict";
import test from "node:test";
import {
  filterNavSections,
  resolveUserPersonas,
  hasCapability,
} from "../features/workspace/config/workspace-registry.ts";
import { resolveLandingPath } from "../features/auth/server.ts";

test("workspace navigation exposes only destinations allowed by capability", () => {
  assert.equal(hasCapability(["iam.roles.manage"], "iam.roles.manage"), true);
  assert.equal(hasCapability([], "iam.roles.manage"), false);

  const memberItems = filterNavSections([]).flatMap((section) => section.items);
  assert.deepEqual(
    memberItems.map((item) => item.href),
    ["/security"],
  );

  for (const capabilities of [["portal.member.access"]]) {
    const hrefs = filterNavSections(capabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    );
    assert.deepEqual(hrefs, ["/workspace", "/security"]);
  }

  const editorCapabilities = [
    "content.article.create",
    "content.article.update",
    "content.article.publish",
  ];
  assert.deepEqual(
    filterNavSections(editorCapabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    ),
    ["/security"],
  );
  assert.equal(resolveLandingPath(editorCapabilities), "/workspace/news");

  const adminItems = filterNavSections(["iam.roles.manage"]).flatMap(
    (section) => section.items,
  );
  assert.deepEqual(
    adminItems.map((item) => item.href),
    ["/admin/access", "/security"],
  );

  const fullAdminCapabilities = [
    "iam.roles.manage",
    "iam.users.manage",
    "portal.member.access",
  ];
  assert.deepEqual(
    filterNavSections(fullAdminCapabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    ),
    ["/admin/access", "/security"],
  );
  assert.deepEqual(
    resolveUserPersonas(fullAdminCapabilities).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
  assert.equal(resolveLandingPath(fullAdminCapabilities), "/admin/access");
});

test("persona resolution uses one member workspace while IAM stays independent", () => {
  const roleCases = ["portal.member.access"];
  for (const capability of roleCases) {
    assert.deepEqual(
      resolveUserPersonas([capability]).map((persona) => persona.key),
      ["WORKSPACE_MEMBER"],
    );
  }
  assert.deepEqual(
    resolveUserPersonas(["iam.roles.manage"]).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
});

test("landing keeps readers public while routing privileged roles to their work area", () => {
  const roleCases = [
    ["portal.member.access", "/workspace"],
    ["iam.roles.manage", "/admin/access"],
  ];
  for (const [capability, expectedPath] of roleCases) {
    assert.equal(resolveLandingPath([capability]), expectedPath);
  }
  assert.equal(resolveLandingPath([]), "/");
});

test("admin navigation contains access governance only", async () => {
  const { filterAdminNavSections } =
    await import("../features/admin/config/admin-nav-registry.ts");
  const hrefs = filterAdminNavSections([
    "iam.roles.manage",
    "iam.users.manage",
  ]).flatMap((section) => section.items.map((item) => item.href));

  assert.deepEqual(hrefs, [
    "/admin/access",
    "/admin/access/users",
    "/admin/access/roles",
    "/admin/access/permissions",
    "/admin/access/logs",
  ]);
});
