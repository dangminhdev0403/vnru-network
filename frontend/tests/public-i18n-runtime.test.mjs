import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public static UI localizes for EN/RU", async () => {
  const [ecosystem, ecosystemCopy, sharedCopy, ...surfaces] = await Promise.all(
    [
      read("features/public-v2/components/GuestEcosystemV2.tsx"),
      read("features/public-v2/components/GuestEcosystemV2.copy.ts"),
      read("features/public-v2/components/public-static-translations.ts"),
      ...[
        "GuestExpertsV2.tsx",
        "GuestKnowledgeV2.tsx",
        "GuestOpportunitiesV2.tsx",
        "GuestExploreV2.tsx",
        "GuestNewsArticleV2.tsx",
        "GuestAboutV2.tsx",
      ].map((name) => read(`features/public-v2/components/${name}`)),
    ],
  );

  assert.match(ecosystem, /connectFormSchema\(locale\)\.safeParse/);
  assert.match(
    ecosystem,
    /localizeReactNode\([\s\S]*locale,[\s\S]*ECOSYSTEM_TRANSLATIONS/,
  );
  for (const surface of surfaces) {
    assert.match(
      surface,
      /localizeReactNode\([\s\S]*locale,[\s\S]*PUBLIC_STATIC_TRANSLATIONS/,
    );
  }
  for (const text of [
    "Collaboration opportunities",
    "Register for bilateral collaboration",
    "Возможности сотрудничества",
    "Регистрация для подключения к двустороннему партнёрству",
  ])
    assert.match(ecosystemCopy, new RegExp(text));
  for (const [source, translation] of [
    ["Kết nối", "Установление контактов"],
    ["Công bố", "Публикация"],
    ["Họ và tên", "ФИО"],
    ["Đối tác mạng lưới", "Участники сети"],
    ["Chuyên gia", "Специалист"],
    ["Đối tác", "Организация"],
    ["Dự án & Kết quả", "Проекты & результаты"],
    ["Tra cứu Kết quả", "Проверить результаты"],
    ["Bài báo", "Научная статья"],
    ["Tạp chí", "Научный журнал"],
  ]) {
    assert.ok(ecosystemCopy.includes(`"${source}": "${translation}"`));
  }
  for (const [source, translation] of [
    ["Viện Hàn lâm, Trường ĐH & Doanh nghiệp", "Академии, вузы и бизнес"],
    ["Nguyễn Quốc Hùng", "Нгуен Куок Хунг"],
    ["Trần Đức Tùng", "Чан Дык Тунг"],
  ]) {
    assert.ok(sharedCopy.includes(`"${source}": "${translation}"`));
  }
  for (const text of [
    "Previous page",
    "Предыдущая",
    "Privacy policy",
    "Политика конфиденциальности",
  ]) {
    assert.match(sharedCopy, new RegExp(text));
  }
  const contact = await read(
    "features/public-v2/components/GuestContactV2.tsx",
  );
  assert.doesNotMatch(contact, /Đóng \/ Закрыть/);

  const localizeSource = await read("core/i18n/localize-react-node.tsx");
  assert.match(localizeSource, /if\s*\(locale\s*===\s*"vi"\)\s*return\s*node/);
  assert.match(localizeSource, /localized\.key\s*==\s*null/);
});
