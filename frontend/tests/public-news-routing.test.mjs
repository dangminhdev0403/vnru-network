import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exists = (path) => access(path).then(() => true, () => false);

test("news is canonical and legacy explore redirects", async () => {
  assert.equal(await exists("app/news/page.tsx"), true);
  assert.equal(await exists("features/public-v2/components/GuestNewsV2.tsx"), false);

  const news = await readFile("features/public-v2/components/GuestExploreV2.tsx", "utf8");
  assert.match(news, /href=\{`\/news\/\$\{articleId\(item\)\}`\}/);

  const legacyExplore = await readFile("app/explore/page.tsx", "utf8");
  assert.match(legacyExplore, /permanentRedirect\("\/news"\)/);

  const article = await readFile("features/public-v2/components/GuestNewsArticleV2.tsx", "utf8");
  assert.doesNotMatch(article, /href="\/explore"/);
  assert.match(article, /href="\/news"/);
});
