import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_LOGIN_DESTINATION, isSameOriginRequest, publicRequestUrl, resolveLandingPath, sanitizeLocale, sanitizeReturnTo } from "./features/auth/server.ts";

test("login origin uses the public forwarded origin behind a tunnel", () => {
  const request = new Request("https://public.example:3000/api/auth/login", {
    headers: {
      origin: "https://public.example",
      host: "public.example:3000",
      referer: "https://public.example/login",
      "sec-fetch-site": "same-origin",
    },
  });
  assert.equal(isSameOriginRequest(request), true);
  const badHeaders = Object.fromEntries(request.headers);
  badHeaders.origin = "https://evil.example";
  badHeaders["sec-fetch-site"] = "cross-site";
  assert.equal(
    isSameOriginRequest(new Request(request, { headers: badHeaders })),
    false,
  );
});

test("auth redirects use the configured public URL instead of the container host", () => {
  const previous = process.env.AUTH_URL;
  process.env.AUTH_URL = "https://rvstin.com";
  try {
    const request = new Request("http://0.0.0.0:3000/api/auth/login", {
      headers: { origin: "https://rvstin.com" },
    });
    assert.equal(isSameOriginRequest(request), true);
    assert.equal(publicRequestUrl(request, "/login").href, "https://rvstin.com/login");
  } finally {
    if (previous === undefined) delete process.env.AUTH_URL;
    else process.env.AUTH_URL = previous;
  }
});

test("reader login defaults to public home", () => {
  assert.equal(sanitizeReturnTo(undefined), "/");
  assert.equal(resolveLandingPath([]), "/");
});

test("login defaults to the capability-routed workspace", async () => {
  assert.equal(DEFAULT_LOGIN_DESTINATION, "/workspace");
  assert.equal(
    sanitizeReturnTo(undefined, DEFAULT_LOGIN_DESTINATION),
    "/workspace",
  );
  assert.equal(
    sanitizeReturnTo("https://evil.example", DEFAULT_LOGIN_DESTINATION),
    "/workspace",
  );
  assert.equal(
    sanitizeReturnTo("/admin/audit", DEFAULT_LOGIN_DESTINATION),
    "/admin/audit",
  );
  const { readFile } = await import("node:fs/promises");
  const [page, route] = await Promise.all([
    readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/api/auth/login/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(
    page,
    /sanitizeReturnTo\(returnTo, DEFAULT_LOGIN_DESTINATION\)/,
  );
  assert.equal(
    (route.match(/DEFAULT_LOGIN_DESTINATION/g) || []).length,
    3,
  );
});

test("return URL accepts only same-origin paths", () => {
  assert.equal(
    sanitizeReturnTo("/account?tab=profile"),
    "/account?tab=profile",
  );
  assert.equal(sanitizeReturnTo("https://evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("//evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("javascript:alert(1)"), "/");
  assert.equal(sanitizeReturnTo(undefined), "/");
});

test("login locale accepts only supported UI locales", () => {
  assert.equal(sanitizeLocale("vi"), "vi");
  assert.equal(sanitizeLocale("en"), "en");
  assert.equal(sanitizeLocale("ru"), "ru");
  assert.equal(sanitizeLocale("de"), "vi");
  assert.equal(sanitizeLocale(undefined), "vi");
});

test("home reconciles locale after authentication", async () => {
  const { readFile } = await import("node:fs/promises");
  const [home, locale] = await Promise.all([
    readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8"),
    readFile(new URL("./core/i18n/locale.ts", import.meta.url), "utf8"),
  ]);
  assert.match(home, /addEventListener\("pageshow", syncLocale\)/);
  assert.match(locale, /vnru_locale=\$\{locale\}/);
});

test("login renders the Auth.js Credentials form", async () => {
  const { readFile } = await import("node:fs/promises");
  const [page, form, password] = await Promise.all([
    readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/login/LoginForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/login/PasswordField.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<LoginForm[\s\S]*?destination=\{destination\}/);
  assert.match(form, /action="\/api\/auth\/login"/);
  assert.match(form, /name="account"/);
  assert.match(password, /name="password"/);
  assert.match(form, /readOnly=\{isSubmitting\}/);
  assert.match(password, /readOnly=\{disabled\}/);
  assert.doesNotMatch(form, /name="account"[\s\S]{0,180}disabled=\{isSubmitting\}/);
  assert.doesNotMatch(password, /name="password"[\s\S]{0,180}disabled=\{disabled\}/);
  assert.doesNotMatch(page + form + password, /iframe|html-templates\/login/);
});

test("registration uses the backend and canonical origin guard", async () => {
  const { readFile } = await import("node:fs/promises");
  const [page, route] = await Promise.all([
    readFile(new URL("./app/register/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/api/auth/login/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /useLocale\(\)/);
  assert.match(page, /event\.preventDefault\(\)/);
  assert.match(page, /fetch\("\/api\/auth\/register"/);
  assert.match(route, /signIn\("credentials"/);
  const registerRoute = await readFile(new URL("./app/api/auth/register/route.ts", import.meta.url), "utf8");
  assert.match(registerRoute, /isSameOriginRequest\(request\)/);
  assert.doesNotMatch(route + registerRoute, /localStorage|sessionStorage/);
});

test("login and home use backend-authoritative session state", async () => {
  const { readFile } = await import("node:fs/promises");
  const [server, login, home, motion] = await Promise.all([
    readFile(new URL("./features/auth/server.ts", import.meta.url), "utf8"),
    readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(server, /getCurrentSession/);
  assert.match(login, /getCurrentSession/);
  assert.match(home, /isAuthenticated/);
  assert.match(home, /resolveLandingPath/);
  assert.match(home, /workspaceHref/);
  assert.match(motion, /useLogout/);
  assert.match(motion, /href=\{workspaceHref\}/);
  assert.match(motion, /Vào không gian làm việc/);
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
  assert.match(source[0], /signIn\(\s*"credentials"/);
  assert.match(source[0], /Invalid login origin/);
  assert.match(source[3], /authServiceUrl\("api\/v1\/auth\/logout"\)/);
});

test("backend session remains authoritative when Auth.js state is stale", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./proxy.ts", import.meta.url), "utf8");
  assert.match(source, /request\.cookies\.has\(SESSION_COOKIE_NAME\)/);
  assert.match(source, /if \(session\?\.ok\)/);
  assert.doesNotMatch(source, /request\.auth|from "\.\/auth"|\/api\/auth\/logout/);
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
  assert.match(source, /href="\/security"/);
  assert.match(source, /useLogout\(\)/);
  assert.doesNotMatch(source, /\{t\.contextActive\}/);
});

test("the application is light-only and does not expose theme controls", async () => {
  const { readFile } = await import("node:fs/promises");
  const [header, layout, styles] = await Promise.all([
    readFile(new URL("./components/shared/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("./app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(layout, /ThemeProvider/);
  assert.doesNotMatch(header, /useTheme|setTheme|isThemeOpen|themeModes/);
  assert.doesNotMatch(styles, /@import "\.\/css\/dark\.css"/);
  assert.doesNotMatch(styles, /color-scheme:\s*dark/);
});

test("legacy IAM overview redirects to the canonical security route", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./app/(workspace)/workspace/iam/page.tsx", import.meta.url), "utf8");
  assert.match(source, /redirect\("\/security"\)/);
  assert.doesNotMatch(source, /IamWorkspaceView/);
});

test("landing copy has a value in every supported locale", async () => {
  const { readFile } = await import("node:fs/promises");
  const [source, dictionaries] = await Promise.all([
    readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8"),
    import("./features/public-home/i18n/translations.json", { with: { type: "json" } }).then(({ default: value }) => value),
  ]);
  const keys = [...source.matchAll(/t\("([^"]+)"\)/g)].map((match) => match[1]);
  for (const locale of ["vi", "en", "ru"]) {
    for (const key of keys) assert.equal(typeof dictionaries[locale][key], "string", `${locale}: ${key}`);
  }
});

test("hero typing starts after fade and cannot resize its reserved line", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8");
  assert.match(source, /HERO_TYPING_DELAY_MS = HERO_FADE_DURATION_MS \+ 100/);
  assert.match(source, /className="relative mt-3 block h-20/);
  assert.match(source, /new Intl\.Segmenter/);
});

test("workspace and landing brands follow the persisted VI EN RU locale", async () => {
  const { readFile } = await import("node:fs/promises");
  const [shell, landing] = await Promise.all([
    readFile(new URL("./components/shared/WorkspaceShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(shell, /const \{ locale \} = useLocale\(\)/);
  for (const locale of ["vi", "en", "ru"]) assert.match(shell, new RegExp(`${locale}: \\{ brand:`));
  assert.match(landing, /t\("RU-VN Network"\)/);
});

test("collaboration cards tolerate long translated words", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./features/public-home/components/PublicHome.tsx", import.meta.url), "utf8");
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
