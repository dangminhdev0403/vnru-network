import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../app/search/page.tsx", import.meta.url), "utf8");

test("integrated search reuses both bounded Module 2 repositories in parallel", () => {
  assert.match(page, /getPublications/);
  assert.match(page, /getExperts/);
  assert.match(page, /Promise\.all/);
  assert.match(page, /limit:\s*"10"/);
});

test("integrated search keeps URL query state and renders surviving partial results", () => {
  assert.match(page, /name="q"/);
  assert.match(page, /name="type"/);
  assert.match(page, /publications\.status === "success"/);
  assert.match(page, /experts\.status === "success"/);
  assert.match(page, /Partial results/);
  assert.match(page, /\/publications\/\$\{publication\.id\}/);
  assert.match(page, /\/experts\/\$\{expert\.id\}/);
});
