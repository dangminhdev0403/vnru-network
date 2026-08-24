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
    { capabilities: ["collab.proposals.create"], landing: "/workspace/researcher", minItems: 7 },
    { capabilities: ["reviews.assignments.view_assigned"], landing: "/workspace/reviewer", minItems: 6 },
    { capabilities: ["collab.proposals.endorse"], landing: "/workspace/organization", minItems: 6 },
    {
      capabilities: [
        "collab.opportunities.create",
        "collab.opportunities.publish",
        "collab.proposals.screen",
        "reviews.assignments.manage",
        "projects.projects.view",
        "projects.reports.approve",
      ],
      landing: "/workspace/collaboration",
      minItems: 8,
    },
    { capabilities: ["collab.decisions.issue_foundation", "projects.projects.view"], landing: "/workspace/decisions", minItems: 6 },
  ];

  for (const { capabilities, landing, minItems } of roleCases) {
    const hrefs = filterNavSections(capabilities).flatMap((section) =>
      section.items.map((item) => item.href),
    );
    assert.equal(hrefs[0], landing);
    assert.equal(hrefs.at(-2), "/account");
    assert.equal(hrefs.at(-1), "/security");
    assert.ok(hrefs.length >= minItems, `${landing} should expose a complete task navigation`);
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

test("persona resolution recognizes current workspace roles and IAM independently", () => {
  const roleCases = [
    ["collab.proposals.create", "RESEARCHER"],
    ["reviews.assignments.view_assigned", "REVIEWER"],
    ["collab.proposals.endorse", "ORGANIZATION_REPRESENTATIVE"],
    ["collab.opportunities.create", "COLLABORATION_MANAGER"],
    ["collab.decisions.issue_foundation", "FOUNDATION_DECISION_MAKER"],
  ];
  for (const [capability, expectedPersona] of roleCases) {
    assert.deepEqual(
      resolveUserPersonas([capability]).map((persona) => persona.key),
      [expectedPersona],
    );
  }
  assert.deepEqual(
    resolveUserPersonas(["iam.roles.manage"]).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
});

test("workspace landing resolves every current workspace persona", () => {
  const roleCases = [
    ["collab.proposals.create", "/workspace/researcher"],
    ["reviews.assignments.view_assigned", "/workspace/reviewer"],
    ["collab.proposals.endorse", "/workspace/organization"],
    ["collab.opportunities.create", "/workspace/collaboration"],
    ["collab.decisions.issue_foundation", "/workspace/decisions"],
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
