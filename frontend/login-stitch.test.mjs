import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const route = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
const source = await readFile(new URL("./stitch/login.html", import.meta.url), "utf8");
const imported = await readFile(new URL("./public/stitch/login.html", import.meta.url), "utf8");

test("login route renders the exported Stitch screen", () => {
  assert.match(route, /\/stitch\/login\.html/);
  assert.match(imported, /href="\/api\/auth\/login"/);
  assert.doesNotMatch(imported, /type="password"/);
  assert.match(source, /<title>Login \| Russia–Vietnam Knowledge Network<\/title>/);
  assert.equal(imported, source);
  assert.doesNotMatch(imported, /data-stitch-injected/);
});