import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeLocale, sanitizeReturnTo } from "./features/auth/server.ts";

test("return URL accepts only same-origin paths", () => {
  assert.equal(
    sanitizeReturnTo("/workspace/reviewer?tab=pending"),
    "/workspace/reviewer?tab=pending",
  );
  assert.equal(sanitizeReturnTo("https://evil.example/steal"), "/workspace");
  assert.equal(sanitizeReturnTo("//evil.example/steal"), "/workspace");
  assert.equal(sanitizeReturnTo("javascript:alert(1)"), "/workspace");
  assert.equal(sanitizeReturnTo(undefined), "/workspace");
});

test("login locale accepts only supported OIDC UI locales", () => {
  assert.equal(sanitizeLocale("vi"), "vi");
  assert.equal(sanitizeLocale("en"), "en");
  assert.equal(sanitizeLocale("ru"), "ru");
  assert.equal(sanitizeLocale("de"), "vi");
  assert.equal(sanitizeLocale(undefined), "vi");
});

test("home reconciles locale after returning from Keycloak", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8");
  assert.match(source, /addEventListener\("pageshow", syncLocale\)/);
  assert.match(source, /vnru_locale=\$\{locale\}/);
});

test("login route delegates credential UI directly to Keycloak", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
  assert.match(page, /\/api\/auth\/login\?returnTo=/);
  assert.match(page, /authorizationUrl\.searchParams\.set\(\s*"ui_locales"/);
  assert.doesNotMatch(page, /iframe|password|html-templates\/login/);
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

test("landing copy has a value in every supported locale", async () => {
  const { readFile } = await import("node:fs/promises");
  const [source, dictionaries] = await Promise.all([
    readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8"),
    import("./app/home-translations.json", { with: { type: "json" } }).then(({ default: value }) => value),
  ]);
  const keys = [...source.matchAll(/t\("([^"]+)"\)/g)].map((match) => match[1]);
  for (const locale of ["vi", "en", "ru"]) {
    for (const key of keys) assert.equal(typeof dictionaries[locale][key], "string", `${locale}: ${key}`);
  }
});

test("hero typing starts after fade and cannot resize its reserved line", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8");
  assert.match(source, /HERO_TYPING_DELAY_MS = HERO_FADE_DURATION_MS \+ 100/);
  assert.match(source, /className="relative mt-3 block h-20/);
  assert.match(source, /new Intl\.Segmenter/);
});

test("workspace and landing brands follow the persisted VI EN RU locale", async () => {
  const { readFile } = await import("node:fs/promises");
  const [shell, landing] = await Promise.all([
    readFile(new URL("./components/shared/WorkspaceShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(shell, /const \{ locale \} = useLocale\(\)/);
  for (const locale of ["vi", "en", "ru"]) assert.match(shell, new RegExp(`${locale}: \\{ brand:`));
  assert.match(landing, /t\("VN–RU Network"\)/);
});

test("collaboration cards tolerate long translated words", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/HomeMotion.tsx", import.meta.url), "utf8");
  assert.equal((source.match(/<article className="relative min-w-0/g) || []).length, 3);
  assert.equal((source.match(/\[overflow-wrap:anywhere\]/g) || []).length >= 6, true);
});

test("root layout preserves nested workspace layouts during client navigation", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /RouteMotion|key=\{pathname\}/);
});
