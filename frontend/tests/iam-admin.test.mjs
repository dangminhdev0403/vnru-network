import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

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

test("IAM page route redirects unauthenticated users", async () => {
  const fileContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/page.tsx", import.meta.url),
    "utf8",
  );

  // Must use cookies() to check session
  assert.match(fileContent, /cookies\(\)/);
  // Must redirect to Keycloak login if missing
  assert.match(
    fileContent,
    /redirect\("\/api\/auth\/login\?returnTo=\/workspace\/iam\/admin"\)/,
  );
  // Backend remains the authorization authority; the client renders a real 403 state.
  const clientContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/IamClientPage.tsx", import.meta.url),
    "utf8",
  );
  assert.match(clientContent, /status === 403/);
  assert.match(clientContent, /Không có quyền truy cập/);
});

test("IAM client uses the approved flow UI with real BFF data only", async () => {
  const fileContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/IamClientPage.tsx", import.meta.url),
    "utf8",
  );

  assert.match(fileContent, /Identity → Context → Role → Backend authoritative decision/);
  assert.match(fileContent, /useIamAdministration/);
  assert.match(fileContent, /user\.canManageUser/);
  assert.match(fileContent, /SUPERADMIN/);
  assert.match(fileContent, /aria-label=\{t\.searchRoles\}/);
  assert.match(fileContent, /aria-expanded=\{expandedGroup === group\.name\}/);
  assert.match(fileContent, /groupPermissions\(selectedRole\?\.permissions, permissionQuery, locale\)/);
  assert.match(fileContent, /permissionLabels\[locale\]\[permission\]/);
  assert.match(fileContent, /groupLabels\[locale\]\[group\.name\]/);
  assert.match(fileContent, /grants\.proposals\.confirm_paired/);
  assert.match(fileContent, /Xác nhận hồ sơ đề xuất song phương/);
  assert.match(fileContent, /roleLabels\[locale\]\[role\.name\]/);
  assert.match(fileContent, /Quản trị quyết định của Quỹ/);
  assert.doesNotMatch(fileContent, /\{role\.name\} ·|\{selectedRole\?\.name\}/);
  assert.doesNotMatch(fileContent, /\{t\.workspace\}|\{t\.refresh\}/);
  assert.match(fileContent, /iam-admin-surface/);
  assert.match(fileContent, /role-profile/);
  assert.match(fileContent, /permission-module/);
  assert.doesNotMatch(fileContent, /max-w-7xl|role-information/);
  assert.match(fileContent, /aria-current="page"/);
  assert.match(fileContent, /t\.permissionName/);
  assert.doesNotMatch(fileContent, /dark:(?:bg|border|text)-slate|bg-\[#10203b\]|bg-slate-950\/45/);
  assert.match(fileContent, /t\.readOnlyNote/);
  assert.doesNotMatch(fileContent, /localStorage|roleSeed|fake|accessToken|refreshToken/i);
});

test("IAM live route does not depend on static HTML templates", async () => {
  const pageContent = await readFile(
    new URL("../app/(workspace)/workspace/iam/admin/page.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(pageContent, /html-templates|dangerouslySetInnerHTML/);
});
