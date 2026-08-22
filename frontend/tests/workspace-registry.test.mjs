import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  filterNavSections,
  resolveUserPersonas,
  hasCapability,
} from "../features/workspace/config/workspace-registry.ts";

test("hasCapability accurately checks single and multiple capability requirements", () => {
  assert.strictEqual(hasCapability(["iam.roles.manage", "collab.proposals.create"], "iam.roles.manage"), true);
  assert.strictEqual(hasCapability(["iam.roles.manage"], "reviews.assignments.view_assigned"), false);
  assert.strictEqual(hasCapability(["collab.proposals.create"], ["collab.proposals.create", "collab.proposals.submit"]), true);
  assert.strictEqual(hasCapability(["knowledge.workspace.view"], ["collab.proposals.create", "collab.proposals.submit"]), false);
});

test("filterNavSections filters sections and items based on user capabilities", () => {
  const researcherCaps = ["collab.proposals.create", "collab.proposals.submit", "knowledge.workspace.view"];
  const filtered = filterNavSections(researcherCaps);

  const overviewSection = filtered.find((s) => s.key === "overview");
  assert.ok(overviewSection);
  assert.ok(overviewSection.items.some((item) => item.href === "/workspace/collaboration"));
  assert.ok(overviewSection.items.some((item) => item.href === "/workspace/knowledge"));

  const governanceSection = filtered.find((s) => s.key === "governance");
  assert.ok(governanceSection);
  assert.strictEqual(governanceSection.items.some((item) => item.href === "/workspace/iam/admin"), false);
});

test("resolveUserPersonas identifies multiple concurrent personas", () => {
  const caps = ["collab.proposals.create", "reviews.assignments.view_assigned"];
  const personas = resolveUserPersonas(caps);

  assert.ok(personas.some((p) => p.key === "RESEARCHER"));
  assert.ok(personas.some((p) => p.key === "REVIEWER"));
  assert.strictEqual(personas.some((p) => p.key === "SUPER_ADMIN"), false);
});

test("canonical admin routes exist and are protected", async () => {
  const adminAccess = await readFile(new URL("../app/(admin)/admin/access/page.tsx", import.meta.url), "utf8");
  const adminUsers = await readFile(new URL("../app/(admin)/admin/access/users/page.tsx", import.meta.url), "utf8");
  const adminRoles = await readFile(new URL("../app/(admin)/admin/access/roles/page.tsx", import.meta.url), "utf8");
  const adminAudit = await readFile(new URL("../app/(admin)/admin/audit/page.tsx", import.meta.url), "utf8");
  const adminCatalogs = await readFile(new URL("../app/(admin)/admin/catalogs/page.tsx", import.meta.url), "utf8");
  const proxy = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");

  assert.match(adminAccess, /RolePermissionsPage/);
  assert.match(adminUsers, /UserAdministration/);
  assert.match(adminRoles, /RolePermissionsPage/);
  assert.match(adminAudit, /Nhật ký Kiểm toán|System Audit Logs|AdminAuditPage/);
  assert.match(adminCatalogs, /Danh mục Chuẩn hóa Hệ thống|System Standardized Catalogs/);
  assert.match(proxy, /"\/admin\/:path\*"/);
});

test("admin-nav-registry filters sections based on admin capabilities", async () => {
  const { filterAdminNavSections, hasAdminCapability } = await import("../features/admin/config/admin-nav-registry.ts");
  
  assert.strictEqual(hasAdminCapability(["iam.roles.manage"], "iam.roles.manage"), true);
  assert.strictEqual(hasAdminCapability(["collab.proposals.create"], "iam.roles.manage"), false);

  const adminSections = filterAdminNavSections(["iam.roles.manage", "iam.users.manage"]);
  assert.ok(adminSections.length > 0);
  const accessSection = adminSections.find((s) => s.key === "access_management");
  assert.ok(accessSection);
  assert.ok(accessSection.items.some((i) => i.href === "/admin/access/users"));
  assert.ok(accessSection.items.some((i) => i.href === "/admin/access/roles"));
});

test("collaboration BFF route handles limit and cursor without offset", async () => {
  const bffContent = await readFile(new URL("../app/api/collab/opportunities/route.ts", import.meta.url), "utf8");
  assert.match(bffContent, /url\.searchParams\.get\("cursor"\)/);
  assert.match(bffContent, /targetUrl\.searchParams\.set\("limit"/);
  assert.doesNotMatch(bffContent, /searchParams\.get\("offset"\)/);
  assert.doesNotMatch(bffContent, /offset=/);
});

test("collaboration repository formats createOpportunity payload correctly", async () => {
  const repoContent = await readFile(new URL("../features/collaboration/repository.ts", import.meta.url), "utf8");
  assert.match(repoContent, /getApiErrorMessage/);
  assert.match(repoContent, /title:\s*input\.title/);
  assert.match(repoContent, /description:\s*input\.description/);
  assert.doesNotMatch(repoContent, /openDate|closeDate|code:/);
});

