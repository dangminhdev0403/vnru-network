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
  const [contentLayout, contentSidebar, studio, iamLayout, iamSidebar] = await Promise.all([
    read("app/(content-admin)/layout.tsx"),
    read("features/news/ContentAdminSidebar.tsx"),
    read("features/news/AdminNewsStudio.tsx"),
    read("app/(admin)/layout.tsx"),
    read("features/admin/components/AdminSidebar.tsx"),
  ]);
  assert.match(contentLayout, /AdminShell area="content"/);
  assert.match(contentSidebar, /href: "\/workspace\/news"/);
  assert.doesNotMatch(contentSidebar, /\/admin\/access/);
  assert.match(studio, /Trung tâm nội dung/);
  assert.match(studio, /Danh sách bài viết/);
  assert.match(studio, /VI.*EN.*RU|locales\.map/);
  assert.match(studio, /news\.mutations\.publish/);
  for (const field of ["contentType", "actionUrl", "actionClosesAt", "sourceUrls", "actionLabel"]) {
    assert.match(studio, new RegExp(field));
  }
  assert.match(studio, /type="datetime-local"/);
  assert.doesNotMatch(studio, /localStorage|translate\.googleapis|mymemory/);
  assert.doesNotMatch(iamLayout, /area="content"/);
  assert.doesNotMatch(iamSidebar, /\/workspace\/news/);
});

test("authenticated shell contains one member workspace and canonical IAM bridge", async () => {
  const [registry, proxy, header, layout] = await Promise.all([
    read("features/workspace/config/workspace-registry.ts"),
    read("proxy.ts"),
    read("components/shared/Header.tsx"),
    read("app/(workspace)/layout.tsx"),
  ]);

  for (const href of ["/workspace", "/security", "/admin/access"]) {
    assert.match(registry, new RegExp(`href: "${href}`));
  }
  assert.doesNotMatch(
    registry,
    /href: "\/workspace\/(researcher|reviewer|organization|collaboration|decisions|enterprise|leadership)"/,
  );
  assert.doesNotMatch(layout, /DemoWorkflowProvider/);
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

test("unified workspace presents member-only content access without fake workflow state", async () => {
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
  for (const [source, returnTo] of [
    [knowledge, "/knowledge"],
    [experts, "/experts"],
    [opportunities, "/opportunities"],
  ]) {
    assert.match(
      source,
      new RegExp(`requireMemberSession\\(\"${returnTo}\"\\)`),
    );
  }
});
