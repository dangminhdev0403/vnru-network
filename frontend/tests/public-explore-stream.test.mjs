import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("news pages share masthead while the listing keeps spotlight and featured sections", async () => {
  const source = await readFile(
    new URL(
      "../features/public-v2/components/GuestExploreV2.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const articleSource = await readFile(
    new URL(
      "../features/public-v2/components/GuestNewsArticleV2.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const filterSource = await readFile(
    new URL(
      "../features/public-v2/components/GuestNewsFilterNav.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const pageSource = await readFile(
    new URL("../app/news/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const SPOTLIGHT_INTERVAL_MS = 5_000/);
  assert.match(source, /const latest = latestArticles/);
  assert.doesNotMatch(source, /initialArticles\.(?:slice|filter)/);
  assert.match(source, /window\.setInterval/);
  assert.doesNotMatch(
    source,
    /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) return/,
  );
  assert.match(articleSource, /categoryLabels/);
  assert.match(filterSource, /aria-pressed=\{activeCategory === category\}/);
  assert.match(filterSource, /params\.set\("category", category\)/);
  assert.match(pageSource, /isNewsCategory\(categoryValue\)/);
  assert.match(pageSource, /initialQuery=\{query\}/);
  assert.doesNotMatch(source, /vnru-infinity-loading/);
  const newsLoading = await readFile(
    new URL("../app/news/loading.tsx", import.meta.url),
    "utf8",
  );
  assert.match(newsLoading, /\.\.\/explore\/loading/);
  const loading = await readFile(
    new URL("../app/explore/loading.tsx", import.meta.url),
    "utf8",
  );
  assert.match(loading, /role="status"/);
  assert.match(loading, /animate-pulse/);
  assert.match(loading, /Array\.from\(\{ length: 3 \}/);
  assert.match(loading, /Tin mới nhất/i);
});
