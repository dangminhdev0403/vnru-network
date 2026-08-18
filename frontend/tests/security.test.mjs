import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("BFF sessions route proxies correctly and uses security headers", async () => {
  const fileContent = await readFile(
    new URL("../app/api/auth/sessions/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl helper
  assert.match(fileContent, /authServiceUrl\("api\/v1\/auth\/sessions"\)/);
  // Must pass backendHeaders
  assert.match(fileContent, /headers:\s*backendHeaders\(request\)/);
  // Must not bypass cookie flow
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});

test("BFF individual session delete route forwards cookies and reads params correctly", async () => {
  const fileContent = await readFile(
    new URL("../app/api/auth/sessions/[id]/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl helper dynamically
  assert.match(
    fileContent,
    /authServiceUrl\(`api\/v1\/auth\/sessions\/\$\{encodeURIComponent\(id\.trim\(\)\)\}\`\)/,
  );
  // Must forward session cookie back to the client response
  assert.match(
    fileContent,
    /forwardSessionCookie\(backendRes,\s*response\.headers\)/,
  );
  // Must read route parameter from promise
  assert.match(fileContent, /const\s+\{\s*id\s*\}\s*=\s*await\s+params/);
});

test("Security page route redirects unauthenticated users", async () => {
  const fileContent = await readFile(
    new URL("../app/security/page.tsx", import.meta.url),
    "utf8",
  );

  // Must use cookies() to check session
  assert.match(fileContent, /cookies\(\)/);
  // Must redirect to Keycloak login if missing
  assert.match(
    fileContent,
    /redirect\("\/api\/auth\/login\?returnTo=\/security"\)/,
  );
});

test("Security client page handles UI actions without raw backend URL exposure", async () => {
  const fileContent = await readFile(
    new URL("../app/security/SecurityClientPage.tsx", import.meta.url),
    "utf8",
  );

  // Must use BFF endpoints only (no direct backend access)
  assert.match(fileContent, /"\/api\/auth\/sessions"/);
  assert.match(
    fileContent,
    /`\/api\/auth\/sessions\/\$\{sessionToRevoke\.id\}`/,
  );
  // Must not fabricate IP/location/device info (avoid hardcoding typical mock lists)
  assert.doesNotMatch(
    fileContent,
    /"Hanoi,\s*VN"|"Moscow,\s*RU"|macOS|Windows|Safari|Chrome/,
  );
  // Must not hardcode private tokens
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});
