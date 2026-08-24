import assert from "node:assert/strict";
import test from "node:test";
import {
  filterNavSections,
  resolveUserPersonas,
  hasCapability,
} from "../features/workspace/config/workspace-registry.ts";

test("Module 1 workspace navigation exposes account, security, and explicit administrator destinations", () => {
  assert.equal(hasCapability(["iam.roles.manage"], "iam.roles.manage"), true);
  assert.equal(hasCapability([], "iam.roles.manage"), false);

  const memberItems = filterNavSections([]).flatMap((section) => section.items);
  assert.deepEqual(memberItems.map((item) => item.href), [
    "/workspace",
    "/workspace/researcher",
    "/workspace/reviewer",
    "/workspace/organization",
    "/workspace/enterprise",
    "/workspace/leadership",
    "/governance",
    "/account",
    "/security",
  ]);

  const adminItems = filterNavSections(["iam.roles.manage"]).flatMap(
    (section) => section.items,
  );
  assert.deepEqual(adminItems.map((item) => item.href), [
    "/workspace",
    "/workspace/researcher",
    "/workspace/reviewer",
    "/workspace/organization",
    "/workspace/enterprise",
    "/workspace/leadership",
    "/governance",
    "/admin/access/roles",
    "/admin/audit",
    "/account",
    "/security",
  ]);
});

test("Module 1 persona resolution recognizes only IAM administrators", () => {
  assert.deepEqual(resolveUserPersonas(["collab.proposals.create"]), []);
  assert.deepEqual(
    resolveUserPersonas(["iam.roles.manage"]).map((persona) => persona.key),
    ["SUPER_ADMIN"],
  );
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
