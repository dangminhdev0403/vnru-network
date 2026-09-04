import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("route metadata and shared copy follow the selected locale", async () => {
  const metadata = await read("core/i18n/metadata.ts");
  assert.match(metadata, /cookies\(\)/);
  assert.match(metadata, /Российско-вьетнамская сеть знаний/);
  assert.match(metadata, /Russia-Vietnam Knowledge Network/);

  for (const path of [
    "app/layout.tsx",
    "app/login/page.tsx",
    "app/about/page.tsx",
    "app/contact/page.tsx",
    "app/ecosystem/page.tsx",
    "app/experts/page.tsx",
    "app/knowledge/page.tsx",
    "app/opportunities/page.tsx",
    "app/(workspace)/workspace/page.tsx",
    "app/(content-admin)/workspace/news/page.tsx",
    "app/not-found.tsx",
  ]) {
    const source = await read(path);
    assert.match(source, /getRouteMetadata/);
    assert.doesNotMatch(source, /export const metadata/);
  }

  const sources = await Promise.all([
    read("app/login/page.tsx"),
    read("features/public-v2/components/GuestExploreV2.tsx"),
    read("features/public-v2/components/GuestContactV2.tsx"),
    read("features/workspace/components/UnifiedWorkspaceDashboard.tsx"),
    read("features/auth/components/security/SecurityClientPage.tsx"),
    read("features/public-v2/components/GuestPublicNav.tsx"),
    read("app/NotFoundClient.tsx"),
  ]);
  const joined = sources.join("\n");

  for (const staleCopy of [
    "инноваций và устойчивого развития",
    "обращение в Бан координации",
    "условия участия và сроки подачи",
    "disconnected from Mạng lưới tri thức Nga - Việt",
    'aria-label="Điều hướng công khai"',
    'aria-label="Kết nối Nga - Việt"',
  ]) {
    assert.doesNotMatch(joined, new RegExp(staleCopy));
  }
});
