import assert from "node:assert/strict";
import test from "node:test";
import { fetchDiscoverySection } from "../features/knowledge/repositories/module2.repository.ts";
import { isPublicPublication, isPublicExpert } from "../features/knowledge/types.ts";

test("public downstream 401 is a section integration error, not session expiry", async () => {
  const result = await fetchDiscoverySection("http://service/api/v1/publications", {}, async () => new Response("", { status: 401 }));
  assert.deepEqual(result, { status: "error", kind: "integration", message: "Module 02 service unavailable" });
});

test("valid collection envelope returns section success", async () => {
  const result = await fetchDiscoverySection("http://service/api/v1/experts", { limit: "3" }, async (url) => {
    assert.equal(new URL(url).searchParams.get("limit"), "3");
    return Response.json({ items: [{ id: "one" }], nextCursor: null });
  });
  assert.deepEqual(result, { status: "success", items: [{ id: "one" }], nextCursor: null });
});

test("malformed envelope stays inside the section error state", async () => {
  const result = await fetchDiscoverySection("http://service/api/v1/experts", {}, async () => Response.json([]));
  assert.equal(result.status, "error");
});

test("guard rejects envelopes containing invalid shapes", async () => {
  const items = [
    { id: "ok", title: "Paper", type: "article", year: 2024, country: "VN", topics: [] },
    { id: "bad" }, // missing required fields
    { title: "no-id", type: "x", year: 2020, country: "RU", topics: [] }, // missing id
  ];
  const result = await fetchDiscoverySection(
    "http://service/api/v1/publications",
    {},
    async () => Response.json({ items, nextCursor: null }),
    isPublicPublication,
  );
  assert.equal(result.status, "error");
});

test("guard passes all valid expert items", async () => {
  const items = [
    { id: "e1", displayName: "Dr A", country: "RU", visibility: "PUBLIC", organization: { id: "o1", name: "Org", country: "RU" }, expertises: [] },
    { id: "e2", displayName: "Dr B", country: "VN", visibility: "PUBLIC", organization: { id: "o2", name: "Org2", country: "VN" }, expertises: [{ id: "x1", slug: "ai", labels: {} }] },
  ];
  const result = await fetchDiscoverySection(
    "http://service/api/v1/experts",
    {},
    async () => Response.json({ items, nextCursor: "abc" }),
    isPublicExpert,
  );
  assert.equal(result.status, "success");
  if (result.status === "success") {
    assert.equal(result.items.length, 2);
    assert.equal(result.nextCursor, "abc");
  }
});

test("isPublicPublication rejects non-objects", () => {
  assert.equal(isPublicPublication(null), false);
  assert.equal(isPublicPublication("string"), false);
  assert.equal(isPublicPublication(42), false);
});

test("public guards reject non-PUBLIC and malformed nested DTOs", () => {
  assert.equal(isPublicPublication({ id: "p", title: "T", type: "ARTICLE", language: "en", year: 2026, country: "VN", visibility: "PRIVATE", authors: [], topics: [] }), false);
  assert.equal(isPublicExpert({ id: "e", displayName: "E", country: "VN", visibility: "PUBLIC", organization: { id: "o", name: "O", country: "VN" }, expertises: [{ id: "x", slug: "ai", labels: { en: 1 } }] }), false);
});

test("isPublicExpert rejects missing organization", () => {
  assert.equal(isPublicExpert({ id: "x", displayName: "Y", country: "Z", expertises: [] }), false);
  assert.equal(isPublicExpert({ id: "x", displayName: "Y", country: "Z", organization: "bad", expertises: [] }), false);
});

test("without guard, items pass through unfiltered (backward compat)", async () => {
  const result = await fetchDiscoverySection(
    "http://service/api/v1/any",
    {},
    async () => Response.json({ items: [{ any: true }], nextCursor: null }),
  );
  assert.equal(result.status, "success");
  if (result.status === "success") {
    assert.equal(result.items.length, 1);
  }
});
