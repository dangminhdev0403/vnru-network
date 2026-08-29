import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exists = (path) => access(path).then(() => true, () => false);

test("news is canonical and legacy explore redirects", async () => {
  assert.equal(await exists("app/news/page.tsx"), true);
  assert.equal(await exists("features/public-v2/components/GuestNewsV2.tsx"), false);

  const news = await readFile("features/public-v2/components/GuestExploreV2.tsx", "utf8");
  assert.match(news, /href=\{newsArticleHref\(item\)\}/);

  const legacyExplore = await readFile("app/explore/page.tsx", "utf8");
  assert.match(legacyExplore, /permanentRedirect\("\/news"\)/);

  const article = await readFile("features/public-v2/components/GuestNewsArticleV2.tsx", "utf8");
  assert.doesNotMatch(article, /href="\/explore"/);
  assert.match(article, /href="\/news"/);
  assert.doesNotMatch(article, /href=\{`\$\{newsFilterHref\(article\.category\)\}#news-filters`\}/);
  assert.doesNotMatch(article, /filterControl=\{\s*<Link/s);
  assert.match(article, /<GuestNewsAdvancedFilters/);
  assert.match(article, /newsFilterHref\(\s*article\.category,\s*filterQuery,\s*nextFilters/s);
  assert.match(article, /searchSubmitLabel=\{filters\.searchSubmit\}/);
  assert.match(news, /searchSubmitLabel=\{t\.searchSubmit\}/);
  assert.match(news, /contentTypes\.includes\(article\.contentType \?\? "ARTICLE"\)/);
  assert.doesNotMatch(news, /content\.includes\("sự kiện"\)/);
  const filter = await readFile("features/public-v2/components/GuestNewsFilterNav.tsx", "utf8");
  assert.match(filter, /type="submit"/);
  assert.match(filter, /\{searchSubmitLabel\}/);
  assert.doesNotMatch(filter, /topics|params\.append\("topic"/);
  const proxy = await readFile("proxy.ts", "utf8");
  assert.doesNotMatch(proxy, /matcher:[^\n]*\/news/);
  const advancedFilter = await readFile(
    "features/public-v2/components/GuestNewsAdvancedFilters.tsx",
    "utf8",
  );
  assert.doesNotMatch(advancedFilter, /Chủ đề|NEWS_FILTER_CATALOGS|getNewsFilterTopics|availableTopics/);
  assert.match(advancedFilter, />\s*Áp dụng bộ lọc\s*<\/button>/);
  const page = await readFile("app/news/page.tsx", "utf8");
  assert.match(page, /getPublicNews/);
  assert.match(page, /initialArticles=\{articles\}/);
  assert.match(page, /initialAdvancedFilters=\{parseAdvancedFilters\(params\)\}/);

  const [legacyDetail, detailPage] = await Promise.all([
    readFile("app/news/[id]/page.tsx", "utf8"),
    readFile("app/news/[id]/[slug]/page.tsx", "utf8"),
  ]);
  assert.match(legacyDetail, /permanentRedirect\(newsArticleHref\(article\)\)/);
  assert.match(detailPage, /getPublicNewsArticle\(id/);
  assert.match(detailPage, /permanentRedirect\(canonical\)/);
  assert.doesNotMatch(detailPage, /VALID_IDS|Number\(id\)/);
});

test("public news uses the official DOCX-derived catalog", async () => {
  const data = await readFile("features/public-v2/data/official-news.ts", "utf8");
  const explore = await readFile("features/public-v2/components/GuestExploreV2.tsx", "utf8");
  const article = await readFile("features/public-v2/components/GuestNewsArticleV2.tsx", "utf8");
  const home = await readFile("features/public-v2/components/GuestHomeV2.tsx", "utf8");

  assert.match(data, /MANG TRI THỨC TRỞ VỀ/);
  assert.match(data, /Mở rộng hợp tác khoa học, giáo dục vì phát triển Việt - Nga/);
  assert.match(data, /Generated from the official DOCX files in \/Tin tức/);
  assert.match(data, /return `\/news\/\$\{article\.id\}\/\$\{slug \|\| "tin-tuc"\}`/);
  assert.match(explore, /OFFICIAL_NEWS/);
  assert.match(article, /articles: OfficialNewsArticle\[\]/);
  assert.match(article, /article\.body\.map/);
  assert.match(article, /const contentType = article\.contentType \?\? "ARTICLE"/);
  assert.match(article, /EVENT: "Đăng ký tham dự"/);
  assert.match(article, /article\.actionUrl/);
  assert.doesNotMatch(article, /actionClosed/);
  assert.match(article, /<Thumb item=\{item\}/);
  assert.match(article, /src=\{item\.image\}/);
  assert.match(home, /OFFICIAL_NEWS\.slice\(0, 4\)/);
  assert.doesNotMatch(explore, /picsum\.photos/);
  assert.doesNotMatch(article, /const articles:/);
});
