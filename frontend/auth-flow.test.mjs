import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeReturnTo } from "./features/auth/server.ts";

test("return URL accepts only same-origin paths", () => {
  assert.equal(sanitizeReturnTo("/workspace/reviewer?tab=pending"), "/workspace/reviewer?tab=pending");
  assert.equal(sanitizeReturnTo("https://evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("//evil.example/steal"), "/");
  assert.equal(sanitizeReturnTo("javascript:alert(1)"), "/");
  assert.equal(sanitizeReturnTo(undefined), "/");
});

test("auth flow keeps provider tokens out of the frontend", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "./app/api/auth/login/route.ts",
    "./app/api/auth/callback/route.ts",
    "./app/api/auth/me/route.ts",
    "./app/api/auth/logout/route.ts",
    "./proxy.ts",
  ];
  const source = await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), "utf8")));

  assert.doesNotMatch(source.join("\n"), /refresh[_T]oken|access[_T]oken/);
});
