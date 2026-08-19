import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("Root not-found route renders NotFoundClient with metadata", async () => {
  const notFoundPage = await readFile(
    new URL("../app/not-found.tsx", import.meta.url),
    "utf8",
  );

  assert.match(notFoundPage, /import \{ NotFoundClient \} from "\.\/NotFoundClient"/);
  assert.match(notFoundPage, /export default function NotFound\(\)/);
  assert.match(notFoundPage, /404 - Trang không tìm thấy/);
});

test("NotFoundClient provides trilingual navigation focused on Home and Go Back", async () => {
  const clientPage = await readFile(
    new URL("../app/NotFoundClient.tsx", import.meta.url),
    "utf8",
  );

  // Must have 'use client'
  assert.match(clientPage, /^"use client";/);

  // Must support VI, RU, EN locales
  assert.match(clientPage, /vi:/);
  assert.match(clientPage, /ru:/);
  assert.match(clientPage, /en:/);

  // Must provide Home navigation
  assert.match(clientPage, /href=["']\/["']/);

  // Must provide Go Back action
  assert.match(clientPage, /router\.back\(\)/);

  // Must display 404 status
  assert.match(clientPage, /404 Not Found/);

  // Must cite Traditions and Friendship Foundation operator
  assert.match(clientPage, /Quỹ Truyền thống và Hữu nghị/);
  assert.match(clientPage, /Traditions and Friendship Foundation/);

  // Must not expose secret tokens or unapproved API calls
  assert.doesNotMatch(clientPage, /accessToken|refreshToken/i);
});
