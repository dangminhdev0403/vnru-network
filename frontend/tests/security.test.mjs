import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("client components use domain server-state instead of raw API calls", async () => {
  const [home, header, authState] = await Promise.all([
    readFile(new URL("../app/HomeMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/shared/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../features/auth/server-state.ts", import.meta.url), "utf8"),
  ]);
  for (const component of [home, header]) {
    assert.doesNotMatch(component, /\bfetch\s*\(|\bhttpClient\s*\(/);
  }
  assert.match(authState, /namespace: \["vnru", "auth"\]/);
  assert.match(authState, /useCurrentUser/);
  assert.match(authState, /useLogout/);
});

test("IAM server state uses domain resources and targeted cache operations", async () => {
  const [repository, resource, hooks, provider] = await Promise.all([
    readFile(new URL("../features/iam/repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../features/iam/resource.ts", import.meta.url), "utf8"),
    readFile(new URL("../features/iam/hooks.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/providers/QueryProvider.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(provider, /QueryClientProvider/);
  assert.match(resource, /namespace: \["vnru", "iam"\]/);
  assert.match(resource, /scopeKey: \(\) => \["current-context"\]/);
  assert.match(hooks, /optimistic:/);
  assert.match(hooks, /invalidateAll/);
  assert.match(repository, /"\/api\/auth\/sessions"/);
  assert.match(repository, /\/api\/admin\/users/);
  assert.doesNotMatch(hooks, /useState|createStore|zustand/i);
});

test("httpClient redirects one time on 401 without retrying mutations", async () => {
  const fileContent = await readFile(
    new URL("../lib/httpClient.ts", import.meta.url),
    "utf8",
  );
  assert.match(fileContent, /path\.startsWith\("\/api\/"\)/);
  assert.match(fileContent, /credentials:\s*"same-origin"/);
  assert.match(fileContent, /cache:\s*"no-store"/);
  assert.match(fileContent, /response\.status === 401/);
  assert.match(fileContent, /!redirecting/);
  assert.match(fileContent, /window\.location\.assign/);
  assert.match(fileContent, /encodeURIComponent\(returnTo\)/);
  assert.equal((fileContent.match(/fetch\(/g) ?? []).length, 1);
  assert.doesNotMatch(fileContent, /refresh|retry/i);
});

test("Auth.js rotates Keycloak tokens server-side and fails closed", async () => {
  const auth = await readFile(new URL("../auth.ts", import.meta.url), "utf8");
  const proxy = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");

  assert.match(auth, /grant_type:\s*"refresh_token"/);
  assert.match(auth, /new URLSearchParams/);
  assert.match(auth, /refreshToken:\s*typeof body\.refresh_token/);
  assert.match(auth, /provider\.error = "RefreshTokenError"/);
  assert.match(proxy, /request\.auth/);
  assert.match(proxy, /cookies\.delete\(SESSION_COOKIE_NAME\)/);
  assert.doesNotMatch(auth, /session\.accessToken|session\.refreshToken/);
});

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
    new URL(
      "../app/(workspace)/workspace/iam/security/page.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  // Must use cookies() to check session
  assert.match(fileContent, /cookies\(\)/);
  // Must redirect to Keycloak login if missing
  assert.match(
    fileContent,
    /redirect\("\/api\/auth\/login\?returnTo=\/workspace\/iam\/security"\)/,
  );
});

test("Security client page handles UI actions without raw backend URL exposure", async () => {
  const fileContent = await readFile(
    new URL(
      "../app/(workspace)/workspace/iam/security/SecurityClientPage.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  // Transport moved to the domain repository; UI consumes the query hook.
  assert.match(fileContent, /useSessions/);
  // Must not fabricate IP/location/device info (avoid hardcoding typical mock lists)
  assert.doesNotMatch(
    fileContent,
    /"Hanoi,\s*VN"|"Moscow,\s*RU"|macOS|Windows|Safari|Chrome/,
  );
  // Must render only fields supplied by the session contract.
  assert.match(fileContent, /session\.activeContext/);
  assert.match(fileContent, /formatDate\(session\.createdAt\)/);
  assert.match(fileContent, /formatDate\(session\.expiresAt\)/);
  assert.match(fileContent, /setShowProfileDialog\(true\)/);
  // Must not hardcode private tokens.
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});

test("Profile dialog shows email as an explicit read-only field", async () => {
  const fileContent = await readFile(
    new URL(
      "../app/(workspace)/workspace/iam/security/ProfileDialog.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(fileContent, /type="email"/);
  assert.match(fileContent, /readOnly/);
  assert.match(fileContent, /profile\?\.email/);
});

test("MFA stays in-app while enrollment delegates only the TOTP ceremony", async () => {
  const control = await readFile(
    new URL(
      "../app/(workspace)/workspace/iam/security/MfaControl.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const route = await readFile(
    new URL("../app/api/auth/mfa/route.ts", import.meta.url),
    "utf8",
  );
  const login = await readFile(
    new URL("../app/api/auth/login/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(control, /useMfa/);
  assert.match(control, /action=CONFIGURE_TOTP/);
  assert.match(route, /authServiceUrl\("api\/v1\/auth\/mfa"\)/);
  assert.match(login, /kc_action/);
  assert.doesNotMatch(control, /otpauth:|secret/i);
});

test("Profile BFF forwards the opaque session for GET and PATCH", async () => {
  const fileContent = await readFile(
    new URL("../app/api/auth/profile/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(fileContent, /authServiceUrl\("api\/v1\/auth\/profile"\)/);
  assert.match(fileContent, /backendHeaders\(request\)/);
  assert.match(fileContent, /export const GET/);
  assert.match(fileContent, /export const PATCH/);
  assert.doesNotMatch(fileContent, /client_secret|accessToken|refreshToken/i);
});

test("Keycloak account BFF requires a valid session and allows only known sections", async () => {
  const fileContent = await readFile(
    new URL("../app/api/auth/account/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(fileContent, /authServiceUrl\("api\/v1\/auth\/me"\)/);
  assert.match(fileContent, /backendHeaders\(request\)/);
  assert.match(fileContent, /personal-info/);
  assert.match(fileContent, /account-security\/signing-in/);
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});

test("BFF context switch route proxies correctly and forwards rotated session cookie", async () => {
  const fileContent = await readFile(
    new URL("../app/api/auth/context/route.ts", import.meta.url),
    "utf8",
  );

  // Must use authServiceUrl helper
  assert.match(fileContent, /authServiceUrl\("api\/v1\/auth\/context"\)/);
  // Must pass backendHeaders
  assert.match(fileContent, /backendHeaders\(request\)/);
  // Must forward rotated session cookie
  assert.match(
    fileContent,
    /forwardSessionCookie\(backendRes,\s*response\.headers\)/,
  );
  // Must not bypass cookie flow
  assert.doesNotMatch(fileContent, /accessToken|refreshToken/i);
});
