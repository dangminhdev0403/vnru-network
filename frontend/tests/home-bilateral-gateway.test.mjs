import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("home page renders streamlined news and event sections", async () => {
  const [home, page] = await Promise.all([
    readFile("features/public-v2/components/GuestHomeV2.tsx", "utf8"),
    readFile("app/page.tsx", "utf8"),
  ]);

  assert.doesNotMatch(home, /id="about-gateway"/);
  assert.match(home, /href="\/news"[\s\S]*?t\.news\.viewAll/);
  assert.match(home, /href="\/news\?type=EVENT"[\s\S]*?t\.events\.viewAll/);
  assert.match(page, /getPublicNews\(\{ locale, limit: 4, contentTypes: \["ARTICLE"\] \}\)/);
  assert.match(page, /getPublicNews\(\{ locale, limit: 4, contentTypes: \["EVENT"\] \}\)/);
  assert.match(page, /news=\{news\}/);
  assert.match(home, /news\.map\(\(item\)/);
  assert.doesNotMatch(home, /OFFICIAL_NEWS\.slice\(0, 4\)/);
  assert.match(home, /events\.map\(\(item\)/);
  assert.match(home, /href=\{newsArticleHref\(item\)\}/);
  assert.doesNotMatch(
    home,
    /displayedEvents|setEventTab|\/opportunities\?event=/,
  );
  assert.match(
    home,
    /locale === "ru"[\s\S]*?from-white via-blue-300 to-red-500[\s\S]*?РОССИЙСКО-/,
  );
  assert.match(
    home,
    /from-red-500 via-red-400 to-amber-300[\s\S]*?ВЬЕТНАМСКАЯ/,
  );
});
