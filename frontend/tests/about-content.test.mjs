import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("about page renders the official VI profile with EN/RU parity", async () => {
  const [about, documentPartners] = await Promise.all([
    readFile(
      new URL(
        "../features/public-v2/components/GuestAboutV2.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../features/public-v2/components/GuestEcosystemPartners.ts",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  for (const heading of [
    "Mục tiêu cốt lõi",
    "Hình thức hoạt động",
    "Đối tác chiến lược",
    "Lĩnh vực ưu tiên",
    "Cơ chế vận hành",
  ])
    assert.match(about, new RegExp(heading));

  assert.match(about, /1207700294020/g);
  assert.match(about, /Core objectives/);
  assert.match(about, /Ключевые цели/);
  assert.match(about, /eyebrow: "Về chúng tôi"/);
  assert.match(about, /eyebrow: "About us"/);
  assert.match(about, /eyebrow: "О нас"/);
  assert.match(about, /text-xl font-bold tracking-tight[\s\S]*?\{t\.eyebrow\}/);
  assert.match(about, /id="about-overview"/);
  assert.match(about, /id="about-ecosystem"/);
  assert.match(about, /id="operating-mechanism"/);
  assert.doesNotMatch(
    about,
    /about-light-hero-v2|t\.heroMetadata\.map|<MissionAndCoreOperations|<OperatingMechanismDiagram/,
  );
  assert.doesNotMatch(
    about,
    /Cơ cấu & Sứ mệnh|font-mono text-3xl|bg-gradient-to-r from-blue-700/,
  );
  assert.match(about, /Nguyễn Quốc Hùng/);
  assert.match(about, /Trần Đức Tùng/);
  assert.match(about, /\/images\/board\/nguyen-quoc-hung\.webp/);
  assert.match(about, /\/images\/board\/tran-duc-tung\.webp/);
  assert.match(about, /const PARTNERS = \[/);
  assert.match(
    about,
    /const PARTICIPATING_PARTNERS = \[[\s\S]*\.\.\.DOCUMENT_PARTNERS\.map/,
  );
  const activePartners = about.split("ĐỐI TÁC TẠM ẨN", 1)[0];
  assert.equal((activePartners.match(/country: "ru"/g) ?? []).length, 12);
  assert.equal((about.match(/country: "ru"/g) ?? []).length, 23);
  assert.equal((about.match(/country: "vi"/g) ?? []).length, 3);
  const participatingPartners = new Map([
    ...[...activePartners.matchAll(/url: "([^"]+)",\s+country: "(ru|vi)"/g)].map(
      ([, url, country]) => [url, country],
    ),
    ...[
      ...documentPartners.matchAll(
        /country: "(russia|vietnam)",\s+website: "([^"]+)"/g,
      ),
    ].map(([, country, url]) => [
      url,
      country === "russia" ? "ru" : "vi",
    ]),
  ]);
  assert.equal(
    [...participatingPartners.values()].filter((country) => country === "ru")
      .length,
    17,
  );
  assert.equal(
    [...participatingPartners.values()].filter((country) => country === "vi")
      .length,
    11,
  );
  assert.match(
    about,
    /TEMPORARILY_HIDDEN_PARTNER_NAMES[\s\S]*"SPbPU"[\s\S]*"VAST"[\s\S]*"Пермский Политех"[\s\S]*"СПбГУ"/,
  );
  assert.match(about, /_blank/);
  assert.match(about, /noopener noreferrer/);
  assert.match(about, /hover:-translate-y-1/);
  assert.match(about, /title: "Đối tác mạng lưới"/);
  assert.match(about, /title: "Network partners"/);
  assert.match(about, /title: "Участники сети"/);
  assert.match(
    about,
    /id="participating-partners"[\s\S]*PARTNER_COPY\[locale\]\.title/,
  );
  assert.match(about, /partners: "Đối tác"/);
  assert.match(about, /partners: "participating-partners"/);
  assert.match(about, /\["overview", "ecosystem", "board", "partners"\]/g);
  assert.match(
    about,
    /PARTICIPATING_PARTNERS\.filter\([\s\S]*partner\.country === country/,
  );
  assert.match(about, /partner\.logo\.startsWith\("\/"\)/);
  assert.doesNotMatch(about, /PARTNERS - TẠM ẨN/);
  assert.match(about, /tel:\+79856905856/);
  assert.match(about, /https:\/\/t\.me\/\+79856905856/);
  assert.match(about, /https:\/\/wa\.me\/79996676240/);
  assert.match(about, /overflow-hidden rounded-full/);
  assert.match(about, /\{t\.contactLabel\}:/);
  assert.match(about, /id="operating-mechanism"[\s\S]*id="board"/);
  assert.match(
    about,
    /aria-expanded=\{aboutMenuOpen\}[\s\S]*?about-mobile-menu/,
  );
  assert.match(about, /setAboutMenuOpen\(false\)[\s\S]*?SECTION_IDS\[tabId\]/);
  assert.match(about, /hidden w-max[\s\S]*?sm:flex/);
  assert.doesNotMatch(
    about,
    /t\.boardIntro|\{t\.eyebrow\}[\s\S]{0,200}\{t\.boardTitle\}|member\.phone|member\.channels|Chọn logo để mở website chính thức trong tab mới\.|id="prospective-partners"/,
  );
  assert.equal(
    (about.match(/url: "https:\/\/www\.spbume\.ru\/"/g) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    about,
    /GS\.TS\. Nguyễn Văn Kính|Alexander Petrov|MEMBER_ORGANIZATIONS|LEADERS/,
  );
});
