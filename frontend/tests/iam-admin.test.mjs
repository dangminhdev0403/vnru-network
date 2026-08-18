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
    new URL("../app/admin/iam/page.tsx", import.meta.url),
    "utf8",
  );

  // Must use cookies() to check session
  assert.match(fileContent, /cookies\(\)/);
  // Must redirect to Keycloak login if missing
  assert.match(
    fileContent,
    /redirect\("\/api\/auth\/login\?returnTo=\/admin\/iam"\)/,
  );
  // Backend remains the authorization authority; the client renders a real 403 state.
  const clientContent = await readFile(
    new URL("../app/admin/iam/IamClientPage.tsx", import.meta.url),
    "utf8",
  );
  assert.match(clientContent, /status === 403/);
  assert.match(clientContent, /Access Denied/);
});

test("IAM client page handles UI actions without raw backend URL exposure", async () => {
  const fileContent = await readFile(
    new URL("../app/admin/iam/IamClientPage.tsx", import.meta.url),
    "utf8",
  );

  // Must use BFF endpoints only (no direct backend access)
  assert.match(fileContent, /\/api\/admin\/users/);
  assert.match(fileContent, /\/api\/admin\/roles/);
  assert.match(fileContent, /\/api\/admin\/role-assignments/);
  // Must not hardcode private tokens
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});
