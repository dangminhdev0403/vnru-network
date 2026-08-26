import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { formatRoleName } from "../features/admin/access/config/role-display.ts";

test("BFF list users route proxies correctly and uses security headers", async () => {
  const fileContent = await readFile(
    new URL("../app/api/admin/users/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl helper
  assert.match(fileContent, /authServiceUrl\(/);
  assert.match(fileContent, /api\/v1\/admin\/users/);
  // Must pass backendHeaders
  assert.match(fileContent, /headers:\s*backendHeaders\(request\)/);
  // Must not bypass cookie flow
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});

test("BFF patch user status route proxies correctly with dynamic ID", async () => {
  const fileContent = await readFile(
    new URL("../app/api/admin/users/[id]/status/route.ts", import.meta.url),
    "utf8",
  );

  // Must parse route parameters
  assert.match(fileContent, /const\s+\{\s*id\s*\}\s*=\s*await\s+params/);
  // Must use authServiceUrl helper with dynamic segment
  assert.match(
    fileContent,
    /api\/v1\/admin\/users\/\$\{encodeURIComponent\(id\.trim\(\)\)\}\/status/,
  );
  // Must pass backendHeaders
  assert.match(fileContent, /backendHeaders\(request\)/);
});

test("BFF reset password route forwards only the new password through the authenticated backend boundary", async () => {
  const fileContent = await readFile(
    new URL(
      "../app/api/admin/users/[id]/password/route.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    fileContent,
    /api\/v1\/admin\/users\/\$\{encodeURIComponent\(id\.trim\(\)\)\}\/password/,
  );
  assert.match(fileContent, /backendHeaders\(request\)/);
  assert.match(fileContent, /JSON\.stringify\(\{ password: body\.password \}\)/);
  assert.doesNotMatch(fileContent, /console\.|accessToken|refreshToken/i);
});

test("BFF list roles route proxies correctly", async () => {
  const fileContent = await readFile(
    new URL("../app/api/admin/roles/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl
  assert.match(fileContent, /authServiceUrl\(/);
  assert.match(fileContent, /api\/v1\/admin\/roles/);
  // Must pass backendHeaders
  assert.match(fileContent, /headers:\s*backendHeaders\(request\)/);
});

test("BFF role-assignments route proxies correctly", async () => {
  const fileContent = await readFile(
    new URL("../app/api/admin/role-assignments/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl
  assert.match(
    fileContent,
    /authServiceUrl\("api\/v1\/admin\/role-assignments"\)/,
  );
  // Must pass backendHeaders
  assert.match(fileContent, /backendHeaders\(request\)/);
});

test("IAM legacy page route redirects to canonical admin routes", async () => {
  const fileContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/page.tsx", import.meta.url),
    "utf8",
  );

  // Must redirect to canonical admin routes
  assert.match(fileContent, /redirect\("\/admin\/access/);
  // Backend remains the authorization authority; the client renders a real 403 state.
  const clientContent = await readFile(
    new URL(
      "../features/admin/access/components/UserAdministration.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(clientContent, /status === 403/);
  assert.match(clientContent, /Không có quyền truy cập/);
});

test("IAM client uses the approved flow UI with real BFF data only", async () => {
  const fileContent = await readFile(
    new URL(
      "../features/admin/access/components/UserAdministration.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(fileContent, /Identity → Context → Role → Phán quyết Backend/);
  assert.match(fileContent, /useIamAdministration/);
  assert.match(fileContent, /user\.canManageUser/);
  assert.match(fileContent, /SUPERADMIN/);
  assert.match(fileContent, /aria-label=\{t\.searchRoles\}/);
  assert.match(fileContent, /aria-expanded=\{expandedGroup === group\.name\}/);
  assert.match(
    fileContent,
    /groupPermissions\(selectedRole\?\.permissions, permissionQuery, locale\)/,
  );
  assert.match(fileContent, /permissionLabels\[locale\]\[permission\]/);
  assert.match(fileContent, /iam\.roles\.manage/);
  assert.match(fileContent, /Quản lý vai trò và quyền hạn/);
  assert.match(fileContent, /roleLabels\[locale\]\[role\.name\]/);
  assert.match(fileContent, /user\.roles\.map/);
  assert.match(fileContent, /iam\.resetUserPassword\.mutateAsync/);
  assert.match(fileContent, /autoComplete="new-password"/);
  assert.match(fileContent, /t\.resetPasswordBtn/);
  assert.match(fileContent, /Quản lý portal/);
  assert.doesNotMatch(fileContent, /\{role\.name\} ·|\{selectedRole\?\.name\}/);
  assert.doesNotMatch(fileContent, /\{t\.workspace\}|\{t\.refresh\}/);
  assert.match(fileContent, /iam-admin-surface/);
  assert.match(fileContent, /role-profile/);
  assert.match(fileContent, /permission-module/);
  assert.doesNotMatch(fileContent, /max-w-7xl|role-information/);
  assert.match(fileContent, /aria-current="page"/);
  assert.match(fileContent, /t\.permissionName/);
  assert.doesNotMatch(
    fileContent,
    /dark:(?:bg|border|text)-slate|bg-\[#10203b\]|bg-slate-950\/45/,
  );
  assert.match(fileContent, /t\.readOnlyNote/);
  assert.doesNotMatch(
    fileContent,
    /localStorage|roleSeed|fake|accessToken|refreshToken/i,
  );
});

test("IAM live route does not depend on static HTML templates", async () => {
  const pageContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/page.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(pageContent, /html-templates|dangerouslySetInnerHTML/);
});

test("IAM overview route renders the dashboard instead of role management", async () => {
  const pageContent = await readFile(
    new URL("../app/(admin)/admin/access/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(pageContent, /AccessOverviewDashboard/);
  assert.doesNotMatch(pageContent, /RolePermissionsPage/);

  const dashboardContent = await readFile(
    new URL(
      "../features/admin/access/components/AccessOverviewDashboard.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(dashboardContent, /useIamAdministration/);
  assert.match(dashboardContent, /activeUsers/);
  assert.match(dashboardContent, /roleDistribution/);
  assert.doesNotMatch(dashboardContent, /SAMPLE_|fake|localStorage/i);
});

test("IAM repository never exposes the protected SUPER_ADMIN role", async () => {
  const repositoryContent = await readFile(
    new URL("../features/iam/repository.ts", import.meta.url),
    "utf8",
  );

  assert.match(repositoryContent, /isSuperAdminRole/);
  assert.match(
    repositoryContent,
    /roles\.filter\(\(role\) => !isSuperAdminRole\(role\.name\)\)/,
  );
});

test("Role detail exposes only overview, permissions, and users tabs", async () => {
  const fileContent = await readFile(
    new URL(
      "../features/admin/access/components/RoleDetailPage.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.doesNotMatch(
    fileContent,
    /tabAudit|auditTitle|auditSynced|tab === "audit"/,
  );
  assert.doesNotMatch(fileContent, /2026-08-26 14:00:00/);
  assert.doesNotMatch(fileContent, /SCOPE_DESCRIPTIONS|selectedScope/);
  assert.match(fileContent, /availablePermissionKeys\.has\(item\.key\)/);
});

test("role codes are presented as readable localized names", () => {
  assert.equal(formatRoleName("CUSTOM_PORTAL_TEST", "vi"), "Portal Test");
  assert.equal(formatRoleName("PORTAL_MEMBER", "vi"), "Thành viên Portal");
  assert.equal(formatRoleName("CONTENT_EDITOR", "en"), "Content Editor");
});
