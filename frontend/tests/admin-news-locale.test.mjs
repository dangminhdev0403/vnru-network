import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin surfaces keep UI copy in the selected locale", async () => {
  const [
    studio,
    repository,
    resource,
    translations,
    adminSidebar,
    permissionCatalog,
    roleDetail,
    roleList,
    userAdministration,
  ] = await Promise.all([
    readFile("features/news/AdminNewsStudio.tsx", "utf8"),
    readFile("features/news/repository.ts", "utf8"),
    readFile("features/news/resource.ts", "utf8"),
    readFile("features/news/admin-news-translations.ts", "utf8"),
    readFile("features/admin/components/AdminSidebar.tsx", "utf8"),
    readFile(
      "features/admin/access/components/PermissionCatalogPage.tsx",
      "utf8",
    ),
    readFile("features/admin/access/components/RoleDetailPage.tsx", "utf8"),
    readFile("features/admin/access/components/RoleListPage.tsx", "utf8"),
    readFile(
      "features/admin/access/components/UserAdministration.tsx",
      "utf8",
    ),
  ]);

  assert.match(studio, /const listLocale = uiLocale\.toUpperCase\(\) as NewsLocale/);
  assert.match(studio, /locale: listLocale/);
  assert.match(studio, /useState<NewsLocale>\("RU"\)/);
  assert.match(studio, /article\.translations\[0\]\?\.title/);
  assert.match(studio, /localizeReactNode\([\s\S]*uiLocale,[\s\S]*ADMIN_NEWS_TRANSLATIONS/);
  assert.match(studio, /data-no-localize/);
  assert.doesNotMatch(studio, /titleVi|summaryVi/);
  assert.doesNotMatch(studio, /contentName/);
  assert.match(studio, /t\("Tạo nội dung mới"\)/);
  assert.match(studio, /editorPlaceholders\[locale\]/);
  assert.match(repository, /params\.set\("locale", filters\.locale\)/);
  assert.match(resource, /filters\?\.locale \?\? "RU"/);
  for (const text of [
    "Создать материал базы знаний",
    "Вернуться к списку материалов базы знаний",
    "Статья",
    "Журнал",
    "Изобретение",
    "PNG, JPG или WEBP (до 5 МБ)",
    "Создать материал",
    "Редактировать материал",
    "Поиск по заголовку или тексту публикации",
    "Ошибка при автоматическом переводе",
  ]) {
    assert.ok(translations.includes(text), `Missing translation: ${text}`);
  }
  assert.match(studio, /localizeText\(value, uiLocale, ADMIN_NEWS_TRANSLATIONS\)/);
  const roleDisplay = await readFile(
    "features/admin/access/config/role-display.ts",
    "utf8",
  );
  assert.match(roleDisplay, /CONTENT_EDITOR: "Редактор контента"/);
  assert.doesNotMatch(
    `${adminSidebar}\n${roleDetail}\n${roleList}`,
    /Роли và права|данных và авторизации/,
  );
  assert.match(permissionCatalog, /<option value="iam">\{t\.moduleIam\}/);
  assert.match(
    permissionCatalog,
    /SCOPE_DESCRIPTIONS\[scope\]\.label\[locale\]/,
  );
  assert.match(roleDetail, /t\.cloneSuccess\.replace\("\{role\}"/);
  assert.match(roleList, /t\.disableConfirm\.replace/);
  assert.match(roleList, /t\.summaryTitle/);
  assert.match(userAdministration, /t\.dialogLockText/);
  assert.match(userAdministration, /t\.assignConfirm/);
  assert.match(userAdministration, /t\.resetPasswordConfirm/);
});
