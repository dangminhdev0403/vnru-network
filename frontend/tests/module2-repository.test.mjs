import assert from "node:assert/strict";
import test from "node:test";
import { fetchDiscoverySection } from "../features/knowledge/repositories/module2.repository.ts";

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
