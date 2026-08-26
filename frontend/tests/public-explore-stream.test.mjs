import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("continuous news reveals mock items in scroll-triggered batches", async () => {
  const source = await readFile(
    new URL("../features/public-v2/components/GuestExploreV2.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const STREAM_BATCH_SIZE = 4/);
  assert.match(source, /const SPOTLIGHT_INTERVAL_MS = 5_000/);
  assert.match(source, /duration-\[1500ms\]/);
  assert.match(source, /LATEST = \[.*\].*slice\(0, 5\)/s);
  assert.match(source, /window\.setInterval/);
  assert.match(source, /motion-reduce:animate-none/);
  assert.match(source, /bg-emerald-50/);
  assert.match(source, /animate-ping/);
  assert.doesNotMatch(source, /vnru-infinity-loading/);
  assert.match(source, /animate-pulse/);
  assert.match(source, /aria-label="Đang tải ảnh"/);
  const newsLoading = await readFile(new URL("../app/news/loading.tsx", import.meta.url), "utf8");
  assert.match(newsLoading, /\.\.\/explore\/loading/);
  const loading = await readFile(new URL("../app/explore/loading.tsx", import.meta.url), "utf8");
  assert.match(loading, /role="status"/);
  assert.match(loading, /animate-pulse/);
  assert.match(loading, /Array\.from\(\{ length: 3 \}/);
  assert.match(loading, /Tin mới nhất/i);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /setIsLoadingMore\(true\)/);
  assert.match(source, /window\.setTimeout/);
  assert.match(source, /setVisibleStreamCount\(\(current\) =>\s*Math\.min\(current \+ STREAM_BATCH_SIZE, stream\.length\)/);
  assert.match(source, /Đang tải thêm tin\.\.\./);
  assert.match(source, /Loading more news\.\.\./);
  assert.match(source, /Загружаем ещё\.\.\./);
  assert.match(source, /\{t\.showing\}[\s\S]*\{Math\.min\(visibleStreamCount, stream\.length\)\}[\s\S]*\{stream\.length\} \{t\.articles\}/);
});
