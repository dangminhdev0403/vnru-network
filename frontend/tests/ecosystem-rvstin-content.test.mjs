import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ecosystem page renders comprehensive network gateways, interactive form, A-Z directories, Khai Sang results, and knowledge library", async () => {
  const ecosystem = await readFile(
    new URL(
      "../features/public-v2/components/GuestEcosystemV2.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  // 1. Must contain 4 main section anchors
  assert.match(ecosystem, /id="opportunities"/);
  assert.match(ecosystem, /id="members"/);
  assert.match(ecosystem, /id="network-directory"/);
  assert.match(ecosystem, /id="projects"/);
  assert.match(ecosystem, /id="knowledge-library"/);

  // 2. Must contain the 4 network sections and sticky subnav
  assert.match(ecosystem, /Cơ hội hợp tác/);
  assert.match(ecosystem, /Thành viên mạng lưới/);
  assert.match(ecosystem, /Dự án & Kết quả/);
  assert.match(ecosystem, /Thư viện tri thức/);

  // 3. Section 1 (Opportunities): Form kết nối, InteRussia, Fond Gorchakov
  assert.match(ecosystem, /Đăng ký Kết nối Hợp tác Song phương/);
  assert.match(ecosystem, /connectFormSchema\.safeParse/);
  const connectForm = ecosystem.match(
    /<form\s+noValidate\s+onSubmit=\{handleConnectSubmit\}[\s\S]*?<\/form>/,
  )?.[0];
  assert.ok(connectForm);
  assert.match(connectForm, /aria-invalid=\{!!connectErrors\.fullName\}/);
  assert.doesNotMatch(connectForm, /\brequired\b|\balert\(|focus:ring/);
  assert.match(ecosystem, /InteRussia/);
  assert.match(ecosystem, /Gorchakov/);
  assert.match(ecosystem, /minobrnaukiofficial/);

  // 4. Section 2 (Members): A-Z Experts & Organizations
  assert.match(ecosystem, /EXPERTS_LIST/);
  assert.match(ecosystem, /ORGANIZATIONS_LIST/);
  assert.match(ecosystem, /Bauman MSTU/);
  assert.match(ecosystem, /VAST/);

  // 5. Section 3 (Projects): Khai Sang Scholarship & Results Lookup
  assert.match(ecosystem, /Khai sáng/);
  assert.match(ecosystem, /Tra cứu Kết quả/);
  assert.match(ecosystem, /showResultsModal/);

  // 6. Section 4 (Library): Articles, Journals, Patents
  assert.match(ecosystem, />\s*Bài báo\s*<\/button>/);
  assert.match(ecosystem, />\s*Tạp chí\s*<\/button>/);
  assert.match(ecosystem, />\s*Sáng chế\s*<\/button>/);

  // 7. Must have multilingual structure with RU and EN support
  assert.match(ecosystem, /vi:\s*\{/);
  assert.match(ecosystem, /en:\s*\{/);
  assert.match(ecosystem, /ru:\s*\{/);

  assert.equal(
    (ecosystem.match(/text-2xl font-black tracking-tight/g) ?? []).length,
    4,
  );
  assert.doesNotMatch(
    ecosystem,
    /Cầu nối tương tác trực tiếp|Danh bạ các nhà khoa học|Các chương trình học bổng|Cơ sở dữ liệu các công trình/,
  );
  assert.match(
    ecosystem,
    /aria-expanded=\{ecosystemMenuOpen\}[\s\S]*?ecosystem-mobile-menu/,
  );
  assert.match(
    ecosystem,
    /setEcosystemMenuOpen\(false\)[\s\S]*?SECTION_IDS\[tabId\]/,
  );
  assert.doesNotMatch(ecosystem, /id="ecosystem-section"/);
  assert.match(ecosystem, /hidden w-max[\s\S]*?sm:flex/);
  assert.equal((ecosystem.match(/min-h-11 rounded-lg/g) ?? []).length, 8);
  assert.doesNotMatch(ecosystem, /✉️|📢|💰|🎓|📄|📚|💡/);
});
