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
  const mastheadSource = await readFile(
    new URL(
      "../features/public-v2/components/GuestNewsMasthead.tsx",
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
  assert.match(source, /const latest = initialArticles\.slice/);
  assert.match(source, /window\.setInterval/);
  assert.doesNotMatch(
    source,
    /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) return/,
  );
  assert.match(source, /<GuestNewsMasthead \/>/);
  assert.match(articleSource, /<GuestNewsMasthead \/>/);
  assert.match(articleSource, /<GuestNewsFilterNav/);
  assert.match(articleSource, /activeCategory=\{article\.category\}/);
  assert.match(articleSource, /router\.push\(newsFilterHref/);
  assert.match(filterSource, /aria-pressed=\{activeCategory === category\}/);
  assert.match(filterSource, /params\.set\("category", category\)/);
  assert.match(pageSource, /isNewsCategory\(categoryValue\)/);
  assert.match(pageSource, /initialQuery=\{query\}/);
  assert.match(mastheadSource, /Tin tức/);
  assert.match(mastheadSource, /font-serif/);
  assert.doesNotMatch(source, /vnru-infinity-loading/);
  assert.match(source, /animate-pulse/);
  assert.match(source, /aria-label="Đang tải ảnh"/);
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
