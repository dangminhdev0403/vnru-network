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
  assert.deepEqual(memberItems.map((item) => item.href), [
    "/account",
    "/security",
  ]);

  const roleCases = [
    ["collab.proposals.create", "/workspace/researcher"],
    ["reviews.assignments.view_assigned", "/workspace/reviewer"],
    ["collab.proposals.endorse", "/workspace/organization"],
  ];
  for (const [capability, expectedHref] of roleCases) {
    const hrefs = filterNavSections([capability]).flatMap((section) =>
      section.items.map((item) => item.href),
    );
    assert.deepEqual(hrefs, [expectedHref, "/account", "/security"]);
  }

  for (const futureCapability of [
    "collab.opportunities.create",
    "collab.decisions.issue_foundation",
  ]) {
    const hrefs = filterNavSections([futureCapability]).flatMap((section) =>
      section.items.map((item) => item.href),
    );
    assert.deepEqual(hrefs, ["/account", "/security"]);
  }

  const adminItems = filterNavSections(["iam.roles.manage"]).flatMap(
    (section) => section.items,
  );
  assert.deepEqual(adminItems.map((item) => item.href), [
    "/governance",
    "/admin/access/roles",
    "/admin/audit",
    "/account",
    "/security",
  ]);
});

test("persona resolution recognizes current live workspace roles and IAM independently", () => {
  const roleCases = [
    ["collab.proposals.create", "RESEARCHER"],
    ["reviews.assignments.view_assigned", "REVIEWER"],
    ["collab.proposals.endorse", "ORGANIZATION_REPRESENTATIVE"],
  ];
  for (const [capability, expectedPersona] of roleCases) {
    assert.deepEqual(
      resolveUserPersonas([capability]).map((persona) => persona.key),
      [expectedPersona],
    );
  }
  assert.deepEqual(resolveUserPersonas(["collab.opportunities.create"]), []);
  assert.deepEqual(resolveUserPersonas(["collab.decisions.issue_foundation"]), []);
  assert.deepEqual(
    resolveUserPersonas(["iam.roles.manage"]).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
});

test("workspace landing resolves current live roles and falls back for future capabilities", () => {
  const roleCases = [
    ["collab.proposals.create", "/workspace/researcher"],
    ["reviews.assignments.view_assigned", "/workspace/reviewer"],
    ["collab.proposals.endorse", "/workspace/organization"],
    ["iam.roles.manage", "/admin/access"],
  ];
  for (const [capability, expectedPath] of roleCases) {
    assert.equal(resolveLandingPath([capability]), expectedPath);
  }
  assert.equal(resolveLandingPath(["collab.opportunities.create"]), "/account");
  assert.equal(resolveLandingPath(["collab.decisions.issue_foundation"]), "/account");
  assert.equal(resolveLandingPath([]), "/account");
});

test("admin navigation contains access governance and security audit only", async () => {
  const { filterAdminNavSections } = await import(
    "../features/admin/config/admin-nav-registry.ts"
  );
  const hrefs = filterAdminNavSections([
    "iam.roles.manage",
    "iam.users.manage",
  ]).flatMap((section) => section.items.map((item) => item.href));

  assert.deepEqual(hrefs, [
    "/admin/access",
    "/admin/access/users",
    "/admin/access/roles",
    "/admin/access/assignments",
    "/admin/audit",
  ]);
});
