import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("./app/page.tsx", import.meta.url), "utf8");
const source = await readFile(new URL("./stitch/home.html", import.meta.url), "utf8");
const imported = await readFile(new URL("./public/stitch/home.html", import.meta.url), "utf8");

test("home renders the Stitch MCP artifact directly", () => {
  assert.match(page, /src="\/stitch\/home\.html"/);
  assert.match(source, /<title>VN-RU Knowledge Network Portal<\/title>/);
  assert.match(imported, /Hanken Grotesk/);
});

test("incompatible fabricated sections are removed", () => {
  assert.doesNotMatch(imported, /Network Impact|Latest Announcements|Featured Opportunities/);
  assert.match(imported, /Traditions and Friendship Foundation/);
});
