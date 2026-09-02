import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("workspace root renders the unified member dashboard while legacy IAM routes stay self-service", async () => {
  const [workspace, guard, iam, iamSecurity] = await Promise.all([
    read("app/(workspace)/workspace/page.tsx"),
    read("features/auth/workspace-server.ts"),
    read("app/(workspace)/workspace/iam/page.tsx"),
    read("app/(workspace)/workspace/iam/security/page.tsx"),
  ]);

  assert.match(workspace, /requireMemberSession\("\/workspace"\)/);
  assert.match(workspace, /UnifiedWorkspaceDashboard/);
  assert.match(guard, /isSystemAdministrator\(capabilities\)/);
  assert.match(guard, /resolveLandingPath\(capabilities\) !== "\/workspace"/);
  assert.match(iam, /redirect\("\/security"\)/);
  assert.match(iamSecurity, /redirect\("\/security"\)/);
});

test("content administration reuses admin chrome with its own navigation", async () => {
  const [contentLayout, contentSidebar, studio, iamLayout, iamSidebar] =
    await Promise.all([
      read("app/(content-admin)/layout.tsx"),
      read("features/news/ContentAdminSidebar.tsx"),
      read("features/news/AdminNewsStudio.tsx"),
      read("app/(admin)/layout.tsx"),
      read("features/admin/components/AdminSidebar.tsx"),
    ]);
  assert.match(contentLayout, /AdminShell area="content"/);
  assert.match(contentSidebar, /href: "\/workspace\/news"/);
  assert.match(contentSidebar, /view=ARTICLE/);
  assert.doesNotMatch(contentSidebar, /view=all/);
  assert.match(studio, /view === "all" \? "ARTICLE" : view/);
  for (const view of ["ANNOUNCEMENT", "EVENT", "PROJECT", "OPPORTUNITY"]) {
    assert.match(contentSidebar, new RegExp(`view=${view}`));
  }
  assert.match(studio, /searchParams\.get\("view"\)/);
  assert.match(studio, /const showOverview = !view/);
  assert.match(
    studio,
    /const showList = Boolean\(view && view !== "new" && !selectedId\)/,
  );
  assert.match(
    studio,
    /const showEditor = view === "new" \|\| Boolean\(selectedId\)/,
  );
  assert.match(studio, /showOverview \? \([\s\S]*Tổng quan nội dung/);
  assert.match(studio, /showList \? \([\s\S]*Danh sách bài viết/);
  assert.match(studio, /showEditor \? \([\s\S]*onSubmit/);
  assert.doesNotMatch(contentSidebar, /\/admin\/access/);
  assert.match(studio, /Trung tâm nội dung/);
  assert.match(studio, /Danh sách bài viết/);
  assert.match(studio, /VI.*EN.*RU|locales\.map/);
  assert.doesNotMatch(studio, /news\.mutations\.(publish|unpublish)/);
  assert.match(studio, /news\.mutations\.delete/);
  assert.match(studio, /confirmAction/);
  const [newsRepository, newsResource, newsBff] = await Promise.all([
    read("features/news/repository.ts"),
    read("features/news/resource.ts"),
    read("app/api/admin/news/[[...path]]/route.ts"),
  ]);
  assert.match(newsRepository, /method: "DELETE"/);
  assert.match(newsResource, /delete: defineMutation/);
  assert.match(newsBff, /export const DELETE = proxy/);
  for (const field of [
    "contentType",
    "actionUrl",
    "actionClosesAt",
    "sourceUrls",
    "actionLabel",
  ]) {
    assert.match(studio, new RegExp(field));
  }
  for (const label of [
    "Loại nội dung",
    "Hạn thao tác",
    "Nhãn thao tác",
    "Liên kết thao tác",
    "Nguồn tham khảo",
  ]) {
    assert.doesNotMatch(studio, new RegExp(`>\\s*${label}\\s*<`));
  }
  assert.match(studio, /view=new&type=\$\{navContentType\}/);
  assert.match(studio, /Tạo \{contentLabel\.toLocaleLowerCase\("vi"\)\} mới/);
  assert.doesNotMatch(studio, /Viết bài mới|Tạo bài viết|Chỉnh sửa bài viết/);
  assert.doesNotMatch(studio, /BẢN NHÁP MỚI|Lưu bản nháp|Lưu thay đổi/);
  assert.match(studio, /Lưu chỉnh sửa/);
  assert.match(studio, />\s*Trạng thái\s*<\/th>/);
  assert.match(studio, />\s*Tin nổi bật\s*<\/th>/);
  assert.match(studio, /colSpan=\{6\}/);
  assert.match(studio, /window\.Translator/);
  assert.match(studio, /sourceLanguage: "vi";?[\s\S]*targetLanguage: "ru"/);
  assert.equal(
    (studio.match(/focus-within:border-blue-500/g) || []).length >= 1,
    true,
  );
  assert.equal((studio.match(/appearance-none/g) || []).length >= 2, true);
  assert.equal((studio.match(/expand_more/g) || []).length >= 2, true);
  assert.doesNotMatch(studio, /localStorage|translate\.googleapis|mymemory/);
  assert.match(studio, /URL\.createObjectURL\(file\)/);
  assert.match(studio, /const submittedLocales = locales\.filter/);
  assert.match(studio, /submittedLocales\.length[\s\S]*\? submittedLocales[\s\S]*: \[locale\]/);
  assert.match(studio, /translations: Object\.fromEntries\([\s\S]*\.filter\(\(item\) => submittedLocales\.includes\(item\)\)/);
  assert.match(studio, /title: translation\.title[\s\S]*actionLabel: translation\.actionLabel/);
  assert.doesNotMatch(studio, /\.\.\.form\.translations\[item\]/);
  const newsController = await read("../services/auth-service/src/modules/news/news.controller.ts");
  assert.match(newsController, /VI: translationSchema\.optional\(\)/);
  assert.match(newsController, /EN: translationSchema\.optional\(\)/);
  assert.match(newsController, /RU: translationSchema\.optional\(\)/);
  assert.match(newsController, /Object\.keys\(value\)\.length > 0/);
  assert.doesNotMatch(newsController, /coverImageUrl: z\.url\(\)\.max\(2000\),/);
  assert.match(studio, /pendingInlineImages/);
  assert.match(studio, /uploadPendingInlineImages/);
  assert.match(studio, /Object\.values\(input\.translations\)[\s\S]*content\.includes\(image\.url\)/);
  assert.match(studio, /Object\.entries\(input\.translations\)\.map/);
  assert.match(studio, /Promise\.all\([\s\S]*referencedImages\.map/);
  assert.match(studio, /Promise\.all\(\[[\s\S]*pendingCoverFile/);
  assert.doesNotMatch(studio, /Vui lòng chọn hình ảnh đại diện bài viết/);
  assert.doesNotMatch(
    studio,
    /handleInlineImageSelect[\s\S]*?upload\.mutateAsync\(file\)/,
  );
  assert.doesNotMatch(iamLayout, /area="content"/);
  assert.doesNotMatch(iamSidebar, /\/workspace\/news/);
});

test("news spotlight uses the backend featured flag", async () => {
  const [carousel, repository, page] = await Promise.all([
    read("features/public-v2/components/GuestExploreV2.tsx"),
    read("features/public-v2/data/public-news-server.ts"),
    read("app/news/page.tsx"),
  ]);
  assert.doesNotMatch(carousel, /initialArticles\.filter|initialArticles\.slice/);
  assert.doesNotMatch(carousel, /matchesScope|matchesContentType|matchesPeriod/);
  assert.match(repository, /params\.append\("featured", String\(featured\)\)/);
  assert.match(repository, /params\.append\("contentType", type\)/);
  assert.match(repository, /isFeatured: article\.isFeatured/);
  assert.match(page, /limit: 10/);
  assert.doesNotMatch(page, /limit: 100/);
  assert.match(carousel, /spotlightIndex === 0 \? "" : "transition-transform/);
  assert.match(carousel, /const isActive = index === spotlightIndex/);
});

test("official news keeps cover images aligned with their article", async () => {
  const catalog = await read("features/public-v2/data/official-news.ts");
  assert.match(
    catalog,
    /"id": 1,[\s\S]*?"image": null,[\s\S]*?"id": 2,[\s\S]*?"title": "Ông Đỗ Xuân Hoàng[^\n]+[\s\S]*?"image": "https:\/\/res\.cloudinary\.com\/[^\n]+official-edbe2e6d[^\n]+"/,
  );
});

test("authenticated shell contains one member workspace and canonical IAM bridge", async () => {
  const [registry, proxy, header, layout, shell] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("proxy.ts"),
    read("components/shared/Header.tsx"),
    read("app/(workspace)/layout.tsx"),
    read("components/shared/WorkspaceShell.tsx"),
  ]);

  for (const href of ["/workspace", "/security", "/admin/access"]) {
    assert.match(registry, new RegExp(`href: "${href}`));
  }
  assert.doesNotMatch(
    registry,
    /href: "\/workspace\/(researcher|reviewer|organization|collaboration|decisions|enterprise|leadership)"/,
  );
  assert.doesNotMatch(layout, /DemoWorkflowProvider/);
  assert.match(
    shell,
    /capabilities\.some\(\(item\) => item\.startsWith\("content\.article\."\)\)/,
  );
  assert.match(shell, /ContentAdminSidebar/);
  assert.doesNotMatch(registry, /href: "\/governance"/);
  assert.doesNotMatch(header, /searchPlaceholder|\/admin\/catalogs/);
  assert.match(header, /roleName/);
  assert.match(header, /currentUser\.data\?\.roles\?\.\[0\]/);
  assert.match(header, /SYSTEM_ADMIN/);
  assert.match(proxy, /"\/workspace\/:path\*"/);
  assert.match(proxy, /isSystemAdministrator\(capabilities\)/);
  assert.match(proxy, /target\.pathname = "\/admin\/access"/);
  assert.match(proxy, /target\.search = ""/);
  assert.doesNotMatch(proxy, /target\.pathname = resolveLandingPath/);
});

test("unified workspace links canonical public content without fake workflow state", async () => {
  const [dashboard, knowledge, experts, opportunities] = await Promise.all([
    read("features/workspace/components/UnifiedWorkspaceDashboard.tsx"),
    read("app/knowledge/page.tsx"),
    read("app/experts/page.tsx"),
    read("app/opportunities/page.tsx"),
  ]);
  assert.doesNotMatch(
    dashboard,
    /useDemoWorkflow|WorkflowStepper|ActivityTimeline|WorkspacePreviewNotice/,
  );
  for (const href of ["/news", "/knowledge", "/experts", "/opportunities"]) {
    assert.match(dashboard, new RegExp(`href: "${href}"`));
  }
  assert.match(knowledge, /redirect\("\/news\?type=PUBLICATION"\)/);
  assert.match(opportunities, /redirect\("\/news\?type=OPPORTUNITY"\)/);
  assert.match(experts, /requireMemberSession\("\/experts"\)/);
});
