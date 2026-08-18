import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const route = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
const source = await readFile(new URL("./stitch/login.html", import.meta.url), "utf8");
const imported = await readFile(new URL("./public/stitch/login.html", import.meta.url), "utf8");

test("login route renders the exported Stitch screen", () => {
  assert.match(route, /src="\/stitch\/login\.html"/);
  assert.match(source, /<title>Login \| Russia–Vietnam Knowledge Network<\/title>/);
  assert.equal(imported, source);
  assert.doesNotMatch(imported, /data-stitch-injected/);
});