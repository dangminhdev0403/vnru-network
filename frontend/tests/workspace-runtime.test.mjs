import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("legacy workspace routes converge on Module 1 self-service", async () => {
  const [workspace, iam, iamSecurity] = await Promise.all([
    read("app/(workspace)/workspace/page.tsx"),
    read("app/(workspace)/workspace/iam/page.tsx"),
    read("app/(workspace)/workspace/iam/security/page.tsx"),
  ]);

  assert.match(workspace, /redirect\("\/account"\)/);
  assert.match(iam, /redirect\("\/account"\)/);
  assert.match(iamSecurity, /redirect\("\/security"\)/);
});

test("authenticated shell keeps only Module 1 destinations", async () => {
  const [registry, proxy, header] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("proxy.ts"),
    read("components/shared/Header.tsx"),
  ]);

  for (const href of ["/account", "/security", "/admin"]) {
    assert.match(registry, new RegExp(`href: "${href}"`));
  }
  assert.doesNotMatch(registry, /knowledge|collab|reviews|projects/i);
  assert.doesNotMatch(header, /searchPlaceholder|\/admin\/catalogs/);
  assert.match(proxy, /"\/workspace\/:path\*"/);
});
