import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("registration form posts to the same-origin account API with feedback", async () => {
  const [page, route] = await Promise.all([
    read("app/register/page.tsx"),
    read("app/api/auth/register/route.ts"),
  ]);

  assert.match(page, /fetch\("\/api\/auth\/register"/);
  assert.match(page, /JSON\.stringify/);
  assert.match(page, /disabled=\{status === "submitting"\}/);
  assert.doesNotMatch(page, /UI preview|bản xem trước giao diện|предварительный интерфейс/);
  assert.match(route, /new URL\(origin\)\.origin !== request\.nextUrl\.origin/);
  assert.match(route, /api\/v1\/auth\/register/);
});
