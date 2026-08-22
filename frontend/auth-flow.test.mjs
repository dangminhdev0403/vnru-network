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
  assert.match(motion, /useLogout/);
  assert.match(motion, /window\.location\.assign\(logoutUrl \|\| "\/"\)/);
});

test("auth flow keeps provider tokens out of the frontend", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "./app/api/auth/login/route.ts",
    "./app/api/auth/[...nextauth]/route.ts",
    "./app/api/auth/me/route.ts",
    "./app/api/auth/logout/route.ts",
    "./proxy.ts",
  ];
  const source = await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
  );

  assert.doesNotMatch(source.join("\n"), /refresh[_T]oken|access[_T]oken/);
  assert.match(source[0], /signIn\(\s*"keycloak"/);
  assert.match(source[0], /ui_locales/);
  assert.match(source[3], /authServiceUrl\("api\/v1\/auth\/logout"\)/);
});

test("proxy logs out when provider refresh expires", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./proxy.ts", import.meta.url), "utf8");
  assert.ok(
    source.indexOf("RefreshTokenError") <
      source.indexOf("if (session?.ok) return NextResponse.next()"),
  );
  assert.match(source, /new URL\("\/api\/auth\/logout"/);
  assert.match(source, /logout\.searchParams\.set\("returnTo"/);
  const logout = await readFile(new URL("./app/api/auth/logout/route.ts", import.meta.url), "utf8");
  assert.match(logout, /export async function GET/);
  assert.match(logout, /await signOut\(\{ redirect: false \}\)/);
  assert.match(logout, /new URL\("\/api\/auth\/login"/);
  assert.match(logout, /sanitizeReturnTo/);
});

test("expired refresh skips the intermediate notice", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /Phiên đăng nhập đã hết hạn|expired/);
});


test("workspace header uses the authenticated account menu", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./components/shared/Header.tsx", import.meta.url), "utf8");
  assert.match(source, /useCurrentUser\(\)/);
  assert.match(source, /href="\/workspace\/iam\/security"/);
  assert.match(source, /useLogout\(\)/);
  assert.doesNotMatch(source, /\{t\.contextActive\}/);
});

test("workspace theme modes are localized in VI EN RU", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./components/shared/Header.tsx", import.meta.url), "utf8");
  for (const label of ["Hệ thống", "System", "Системная"]) assert.match(source, new RegExp(label));
  assert.doesNotMatch(source, /label: "(?:Light|Dark|System)"/);
  assert.doesNotMatch(source, /<select/);
  assert.match(source, /setIsThemeOpen\(false\)/);
});

test("IAM overview reuses the workspace dashboard", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/(workspace)/workspace/iam/page.tsx", import.meta.url), "utf8");
  assert.match(source, /redirect\("\/workspace"\)/);
  assert.doesNotMatch(source, /IamWorkspaceView/);
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

test("authenticated routes share one persistent workspace shell", async () => {
  const { readFile } = await import("node:fs/promises");
  const root = await readFile(new URL("./app/layout.tsx", import.meta.url), "utf8");
  const workspace = await readFile(new URL("./app/(workspace)/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(root, /RouteMotion|key=\{pathname\}/);
  assert.match(workspace, /<WorkspaceShell>\{children\}<\/WorkspaceShell>/);
});
