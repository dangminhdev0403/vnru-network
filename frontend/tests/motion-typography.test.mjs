import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("public navigation centers tablet rows and uses a full mobile menu", async () => {
  const [nav, home] = await Promise.all([
    readFile(
      new URL(
        "../features/public-v2/components/GuestPublicNav.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../features/public-v2/components/GuestHomeV2.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  assert.match(nav, /hidden items-center justify-center lg:flex/);
  assert.match(nav, /<details className="group static lg:hidden">/);
  assert.match(nav, /absolute inset-x-4 top-\[calc\(100%\+8px\)\]/);
  assert.match(nav, /items-center justify-center rounded-xl px-4 text-center/);
  assert.match(nav, /grid gap-2 border-t border-blue-100 pt-3 sm:grid-cols-2/);
  assert.match(nav, /<MenuIcon aria-hidden="true"/);
  assert.match(nav, /translate="no"/);
  assert.doesNotMatch(nav, /overflow-x-auto/);
  assert.match(home, /relative hidden aspect-\[1200\/675\] xl:block/);
  assert.match(home, /grid-cols-1 gap-5 sm:grid-cols-2/);
});

test("locale and public symbol ligatures resist browser auto-translation", async () => {
  const [layout, locale] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../core/i18n/locale.ts", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /\(await cookies\(\)\)\.get\("vnru_locale"\)/);
  assert.match(layout, /lang=\{locale\}/);
  assert.match(layout, /<meta name="google" content="notranslate"/);
  assert.match(locale, /document\.documentElement\.lang = locale/);
});

test("shared motion and readable copy respect reduced-motion preferences", async () => {
  const [layout, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /vnru-motion-root/);
  assert.match(css, /--motion-ease:\s*cubic-bezier\(0?\.16, 1, 0?\.3, 1\)/);
  assert.match(css, /translate3d\(6px, 18px, 0\)/);
  assert.match(css, /font-size:\s*clamp\(1rem/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation:\s*none/);
});
