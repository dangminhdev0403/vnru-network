import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("bilateral gateway starts with its title", async () => {
  const home = await readFile(
    "features/public-v2/components/GuestHomeV2.tsx",
    "utf8",
  );

  assert.match(home, /id="about-gateway"/);
  assert.match(home, /title: "Cổng kết nối Hợp tác Song phương"/);
  assert.doesNotMatch(
    home,
    /Cơ cấu & Sứ mệnh|Structure & Mission|Структура и миссия|copy\.eyebrow/,
  );
});
