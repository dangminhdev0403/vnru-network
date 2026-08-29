import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("about page renders the official VI profile with EN/RU parity", async () => {
  const about = await readFile(
    new URL("../features/public-v2/components/GuestAboutV2.tsx", import.meta.url),
    "utf8",
  );

  for (const heading of [
    "Mục tiêu cốt lõi",
    "Hình thức hoạt động",
    "Đối tác chiến lược",
    "Lĩnh vực ưu tiên",
    "Cơ chế vận hành",
  ]) assert.match(about, new RegExp(heading));

  assert.match(about, /1207700294020/g);
  assert.match(about, /Core objectives/);
  assert.match(about, /Ключевые цели/);
  assert.match(about, /eyebrow: "Về chúng tôi"/);
  assert.match(about, /eyebrow: "About us"/);
  assert.match(about, /eyebrow: "О нас"/);
  assert.doesNotMatch(about, /Cơ cấu & Sứ mệnh|font-mono text-3xl|bg-gradient-to-r from-blue-700/);
  assert.match(about, /TS Nguyễn Quốc Hùng/);
  assert.match(about, /Trần Đức Tùng/);
  assert.match(about, /\/images\/board\/nguyen-quoc-hung\.webp/);
  assert.match(about, /\/images\/board\/tran-duc-tung\.webp/);
  assert.match(about, /const PARTNERS = \[/);
  assert.equal((about.match(/country: "ru"/g) ?? []).length, 23);
  assert.equal((about.match(/country: "vi"/g) ?? []).length, 3);
  assert.match(about, /target="_blank"/);
  assert.match(about, /rel="noopener noreferrer"/);
  assert.match(about, /hover:-translate-y-1/);
  assert.match(about, /title: "Tổ chức mong muốn tham gia"/);
  assert.match(about, /contact: "\+798\*\*\*\*5856"/);
  assert.doesNotMatch(about, /tel:\+798|t\.me\/\+798|wa\.me\/79996676240/);
  assert.match(about, /overflow-hidden rounded-full/);
  assert.match(about, /\{t\.contactLabel\}:/);
  assert.match(about, /<OperatingMechanismDiagram[\s\S]*id="participating-partners"/);
  assert.doesNotMatch(about, /t\.boardIntro|\{t\.eyebrow\}[\s\S]{0,200}\{t\.boardTitle\}|member\.phone|member\.channels|Chọn logo để mở website chính thức trong tab mới\.|id="prospective-partners"/);
  assert.equal((about.match(/url: "https:\/\/www\.spbume\.ru\/"/g) ?? []).length, 1);
  assert.doesNotMatch(about, /GS\.TS\. Nguyễn Văn Kính|Alexander Petrov|MEMBER_ORGANIZATIONS|LEADERS/);
});
