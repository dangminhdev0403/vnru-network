import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin news forwards UI locale and prefers Russian editing", async () => {
  const [studio, repository, resource] = await Promise.all([
    readFile("features/news/AdminNewsStudio.tsx", "utf8"),
    readFile("features/news/repository.ts", "utf8"),
    readFile("features/news/resource.ts", "utf8"),
  ]);

  assert.match(studio, /const listLocale = uiLocale\.toUpperCase\(\) as NewsLocale/);
  assert.match(studio, /locale: listLocale/);
  assert.match(studio, /useState<NewsLocale>\("RU"\)/);
  assert.match(studio, /article\.translations\[0\]\?\.title/);
  assert.match(studio, /localizeReactNode\([\s\S]*uiLocale,[\s\S]*ADMIN_NEWS_TRANSLATIONS/);
  assert.match(studio, /data-no-localize/);
  assert.doesNotMatch(studio, /titleVi|summaryVi/);
  assert.match(repository, /params\.set\("locale", filters\.locale\)/);
  assert.match(resource, /filters\?\.locale \?\? "RU"/);
});
