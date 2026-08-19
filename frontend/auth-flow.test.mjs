import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeReturnTo } from "./features/auth/server.ts";

test("return URL accepts only same-origin paths", () => {
  assert.equal(
    sanitizeReturnTo("/workspace/reviewer?tab=pending"),
    "/workspace/reviewer?tab=pending",
  );
  assert.equal(sanitizeReturnTo("https://evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("//evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("javascript:alert(1)"), "/");
  assert.equal(sanitizeReturnTo(undefined), "/");
});

test("login route delegates credential UI directly to Keycloak", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
  assert.match(page, /\/api\/auth\/login\?returnTo=/);
  assert.doesNotMatch(page, /iframe|password|stitch\/login/);
});

test("login and home use backend-authoritative session state", async () => {
  const { readFile } = await import("node:fs/promises");
  const [server, login, home, motion] = await Promise.all([
    readFile(new URL("./features/auth/server.ts", import.meta.url), "utf8"),
    readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(server, /getCurrentSession/);
  assert.match(login, /getCurrentSession/);
  assert.match(home, /isAuthenticated/);
  assert.match(motion, /\/api\/auth\/logout/);
  assert.match(motion, /window\.location\.assign\(logoutUrl \|\| "\/"\)/);
});

test("auth flow keeps provider tokens out of the frontend", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "./app/api/auth/login/route.ts",
    "./app/api/auth/callback/route.ts",
    "./app/api/auth/me/route.ts",
    "./app/api/auth/logout/route.ts",
    "./proxy.ts",
  ];
  const source = await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
  );

  assert.doesNotMatch(source.join("\n"), /refresh[_T]oken|access[_T]oken/);
  assert.match(source[0], /redirect:\s*"manual"/);
  assert.match(source[0], /configuration-unavailable/);
  assert.match(source[3], /await backend\.json\(\)/);
});
