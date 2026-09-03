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
  const layoutSource = await readFile(
    new URL("../app/news/layout.tsx", import.meta.url),
    "utf8",
  );
  const navSource = await readFile(
    new URL(
      "../features/public-v2/components/GuestPublicNav.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const serverSource = await readFile(
    new URL(
      "../features/public-v2/data/public-news-server.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /const SPOTLIGHT_INTERVAL_MS = 5_000/);
  assert.match(source, /const latest = latestArticles/);
  assert.doesNotMatch(source, /initialArticles\.(?:slice|filter)/);
  assert.match(source, /window\.setInterval/);
  assert.match(source, /\}, \[spotlight\.length, spotlightIndex\]\);/);
  assert.doesNotMatch(
    source,
    /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) return/,
  );
  assert.match(articleSource, /categoryLabels/);
  assert.match(filterSource, /aria-pressed=\{activeCategory === category\}/);
  assert.match(filterSource, /params\.set\("category", category\)/);
  assert.match(pageSource, /isNewsCategory\(categoryValue\)/);
  assert.match(pageSource, /initialQuery=\{query\}/);
  assert.match(pageSource, /export async function generateMetadata/);
  assert.match(
    pageSource,
    /Новости \| Российско-вьетнамская сеть знаний/,
  );
  assert.match(source, /useRouter\(\)/);
  assert.match(source, /router\.push\(/);
  assert.doesNotMatch(source, /window\.location\.assign/);
  assert.match(layoutSource, /<GuestPublicNav active="news" \/>/);
  assert.match(layoutSource, /<GuestPublicFooter copy=\{HOME_COPY\[locale\]\} \/>/);
  assert.match(
    navSource,
    /<LanguageSwitcher variant="light" compact refreshOnChange \/>/,
  );
  assert.doesNotMatch(source + articleSource, /<GuestPublicNav|<GuestPublicFooter/);
  assert.doesNotMatch(source, /vnru-infinity-loading/);
  assert.match(
    serverSource,
    /article\.content\?\.split\(\/\\n\{2,\}\/\)\.filter\(Boolean\) \?\? \[\]/,
  );
  assert.match(serverSource, /title: article\.title \?\? ""/);
  assert.match(serverSource, /summary: article\.summary \?\? ""/);
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
