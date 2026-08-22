import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Module 2 public discovery stays guest-facing and does not submit organization names as UUIDs", async () => {
  const [header, expertsPage, expertList] = await Promise.all([
    read("../components/shared/PublicHeader.tsx"),
    read("../app/experts/page.tsx"),
    read("../features/experts/components/ExpertList.tsx"),
  ]);
  assert.match(header, /href="\/login"/);
  assert.match(header, /\["\/knowledge",/);
  assert.match(header, /\["\/experts",/);
  assert.doesNotMatch(header, /\/api\/auth\/me|useState|useEffect/);
  assert.doesNotMatch(expertsPage, /organization:/);
  assert.doesNotMatch(expertList, /name="organization"/);
});
