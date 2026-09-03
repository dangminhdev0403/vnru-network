import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public static UI localizes for EN/RU", async () => {
  const [ecosystem, ecosystemCopy, sharedCopy, ...surfaces] = await Promise.all([
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
  ]);

  assert.match(ecosystem, /connectFormSchema\(locale\)\.safeParse/);
  assert.match(ecosystem, /localizeReactNode\([\s\S]*locale,[\s\S]*ECOSYSTEM_TRANSLATIONS/);
  for (const surface of surfaces) {
    assert.match(surface, /localizeReactNode\([\s\S]*locale,[\s\S]*PUBLIC_STATIC_TRANSLATIONS/);
  }
  for (const text of [
    "Collaboration opportunities",
    "Register for bilateral collaboration",
    "Возможности сотрудничества",
    "Заявка на двустороннее сотрудничество",
  ]) assert.match(ecosystemCopy, new RegExp(text));
  for (const text of ["Previous page", "Предыдущая", "Privacy policy", "Политика конфиденциальности"]) {
    assert.match(sharedCopy, new RegExp(text));
  }
  const contact = await read("features/public-v2/components/GuestContactV2.tsx");
  assert.doesNotMatch(contact, /Đóng \/ Закрыть/);
});