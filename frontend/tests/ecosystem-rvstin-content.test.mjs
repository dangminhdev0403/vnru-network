import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ecosystem page renders concise network landing page with 4 gateways and representative items", async () => {
  const ecosystem = await readFile(
    new URL("../features/public-v2/components/GuestEcosystemV2.tsx", import.meta.url),
    "utf8",
  );

  // 1. Must contain 4 main section anchors
  assert.match(ecosystem, /id="opportunities"/);
  assert.match(ecosystem, /id="projects"/);
  assert.match(ecosystem, /id="knowledge-library"/);
  assert.match(ecosystem, /id="network-directory"/);

  // 2. Must contain the 4 network gateways
  assert.match(ecosystem, /Cơ hội hợp tác/);
  assert.match(ecosystem, /Chuyên gia & Tổ chức/);
  assert.match(ecosystem, /Thư viện tri thức/);

  // 3. Must NOT contain obsolete "Dự án & Kết quả" (replaced by "Dự án")
  assert.doesNotMatch(ecosystem, /Dự án & Kết quả|Dự án & kết quả/);

  // 4. Must contain representative authentic items
  assert.match(ecosystem, /Khai sáng/i);
  assert.match(ecosystem, /StudRussia/i);
  assert.match(ecosystem, /Lenchuk/i);

  // 5. Must contain official organizations / funds
  assert.match(ecosystem, /NAFOSTED/);
  assert.match(ecosystem, /NATIF/);
  assert.match(ecosystem, /VINIF/);
  assert.match(ecosystem, /RSF/);
  assert.match(ecosystem, /Gorchakov/);

  // 6. Must NOT contain obsolete fake mock profiles and fake projects
  assert.doesNotMatch(ecosystem, /GS\. Trần Minh Đức|Anna Petrova|TS\. Nguyễn Hữu Lộc/);
  assert.doesNotMatch(ecosystem, /Nghiên cứu pin thế hệ mới|Hợp tác KHCN Biển & Hải dương/);
  assert.doesNotMatch(ecosystem, /2\.500\+|2,500\+/);

  // 7. Must have multilingual structure with RU and EN support
  assert.match(ecosystem, /vi:\s*\{/);
  assert.match(ecosystem, /en:\s*\{/);
  assert.match(ecosystem, /ru:\s*\{/);
});
