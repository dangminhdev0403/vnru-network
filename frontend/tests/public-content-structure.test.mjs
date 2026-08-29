import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public routes follow the RVSTIN content tree", async () => {
  const [nav, home, ecosystem, about] = await Promise.all([
    read("../features/public-v2/components/GuestPublicNav.tsx"),
    read("../features/public-v2/components/GuestHomeV2.tsx"),
    read("../features/public-v2/components/GuestEcosystemV2.tsx"),
    read("../features/public-v2/components/GuestAboutV2.tsx"),
  ]);

  await access(new URL("../app/contact/page.tsx", import.meta.url));
  assert.match(nav, /href: "\/contact"/);
  assert.doesNotMatch(nav, /href: "\/#contact"/);

  const banner = home.lastIndexOf("HERO BANNER SECTION");
  const news = home.lastIndexOf('id="news"');
  const ecosystemSection = home.lastIndexOf('id="ecosystem"');
  const events = home.lastIndexOf('id="events"');
  assert.ok(banner < news && news < ecosystemSection && ecosystemSection < events);
  const renderedHome = home.slice(banner);
  assert.doesNotMatch(renderedHome, /<BilateralGatewaySection|<GuestContactSection|<NetworkStatsInfographic/);

  for (const section of ["opportunities", "members", "projects", "knowledge-library"])
    assert.match(ecosystem, new RegExp(`id="${section}"`));
  assert.match(ecosystem, /DỰ ÁN “KHAI SÁNG”|Dự án Khai Sáng/);
  assert.match(ecosystem, /Chuyển đổi kinh tế Nga trong bối cảnh xây dựng chủ quyền công nghệ/);
  assert.doesNotMatch(ecosystem, /GS\. Trần Minh Đức|Anna Petrova|2\.500\+|Nghiên cứu pin thế hệ mới/);

  assert.doesNotMatch(about, /tel:\+798\*\*\*\*5856|t\.me\/\+798\*\*\*\*5856|wa\.me\/79996676240/);
});
