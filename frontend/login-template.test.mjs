import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const route = await readFile(new URL("./app/login/page.tsx", import.meta.url), "utf8");
const source = await readFile(new URL("./html-templates/login.html", import.meta.url), "utf8");
const home = await readFile(new URL("./html-templates/index.html", import.meta.url), "utf8");

test("login route sends the same tab to Keycloak", () => {
  assert.match(route, /\/api\/auth\/login\?returnTo=/);
  assert.match(route, /sanitizeReturnTo/);
  assert.doesNotMatch(route, /window\.open|postMessage|\/html-templates\/login\.html/);
});

test("login HTML template remains the visual source", () => {
  assert.match(source, /<title>Đăng nhập - VN - RU Network<\/title>/);
  assert.match(source, /Mạng lưới<br\/>tri thức Nga - Việt/);
  assert.match(source, /Email hoặc tên đăng nhập/);
  assert.match(source, /Ghi nhớ đăng nhập/);
});

test("home opens the real same-tab login route", () => {
  assert.match(home, /href="\/login">Đăng nhập →<\/a>/);
  assert.doesNotMatch(home, /href="login\.html"|target="_blank"/);
});
