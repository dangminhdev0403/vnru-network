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
    { capabilities: ["collab.proposals.create"], moduleHref: "/workspace/researcher?view=collaboration", minItems: 7 },
    { capabilities: ["reviews.assignments.view_assigned"], moduleHref: "/workspace/reviewer?view=assignments", minItems: 6 },
    { capabilities: ["collab.proposals.endorse"], moduleHref: "/workspace/organization?view=endorsements", minItems: 6 },
    {
      capabilities: [
        "collab.opportunities.create",
        "collab.opportunities.publish",
        "collab.proposals.screen",
        "reviews.assignments.manage",
        "projects.projects.view",
        "projects.reports.approve",
      ],
      moduleHref: "/workspace/collaboration?view=opportunities",
      minItems: 8,
    },
    { capabilities: ["collab.decisions.issue_foundation", "projects.projects.view"], moduleHref: "/workspace/decisions?view=queue", minItems: 6 },
  ];

  for (const { capabilities, moduleHref, minItems } of roleCases) {
    const hrefs = filterNavSections(capabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    );
    assert.equal(hrefs[0], "/workspace");
    assert.ok(hrefs.includes(moduleHref));
    assert.equal(hrefs.at(-2), "/account");
    assert.equal(hrefs.at(-1), "/security");
    assert.ok(hrefs.length >= minItems, `/workspace should expose a complete task navigation`);
  }

  const adminItems = filterNavSections(["iam.roles.manage"]).flatMap(
    (section) => section.items,
  );
  assert.deepEqual(adminItems.map((item) => item.href), [
    "/admin/access",
    "/account",
    "/security",
  ]);

  const fullAdminCapabilities = [
    "iam.roles.manage",
    "iam.users.manage",
    "collab.proposals.create",
    "reviews.assignments.view_assigned",
    "collab.proposals.endorse",
    "collab.opportunities.create",
    "collab.decisions.issue_foundation",
  ];
  assert.deepEqual(
    filterNavSections(fullAdminCapabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    ),
    ["/admin/access", "/account", "/security"],
  );
  assert.deepEqual(
    resolveUserPersonas(fullAdminCapabilities).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
  assert.equal(resolveLandingPath(fullAdminCapabilities), "/admin/access");
});

test("persona resolution uses one member workspace while IAM stays independent", () => {
  const roleCases = [
    "collab.proposals.create",
    "reviews.assignments.view_assigned",
    "collab.proposals.endorse",
    "collab.opportunities.create",
    "collab.decisions.issue_foundation",
  ];
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

test("workspace landing resolves every business role to the unified workspace", () => {
  const roleCases = [
    ["collab.proposals.create", "/workspace"],
    ["reviews.assignments.view_assigned", "/workspace"],
    ["collab.proposals.endorse", "/workspace"],
    ["collab.opportunities.create", "/workspace"],
    ["collab.decisions.issue_foundation", "/workspace"],
    ["iam.roles.manage", "/admin/access"],
  ];
  for (const [capability, expectedPath] of roleCases) {
    assert.equal(resolveLandingPath([capability]), expectedPath);
  }
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
