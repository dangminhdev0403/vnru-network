import assert from "node:assert/strict";
import test from "node:test";
import { getExperts, getExpertById, getExpertMatches } from "../features/experts/repository.ts";

// --- getExperts ---

test("getExperts: valid envelope returns success", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExperts({ q: "test", limit: "5" }, async (url) => {
    const u = new URL(url);
    assert.equal(u.pathname, "/api/v1/experts");
    assert.equal(u.searchParams.get("q"), "test");
    assert.equal(u.searchParams.get("limit"), "5");
    return Response.json({ items: [{ id: "e1", displayName: "Test", bio: null, country: "VN", language: null, visibility: "PUBLIC", organization: { id: "o1", name: "Org", country: "VN" }, expertises: [] }], nextCursor: "abc" });
  });
  assert.equal(result.status, "success");
  if (result.status === "success") assert.equal(result.items[0].id, "e1");
});

test("getExperts: HTTP error maps to integration error", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExperts({}, async () => new Response("", { status: 500 }));
  assert.equal(result.status, "error");
});

test("getExperts: malformed envelope maps to error", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExperts({}, async () => Response.json([]));
  assert.equal(result.status, "error");
});

test("getExperts: missing env returns integration error", async () => {
  delete process.env.KNOWLEDGE_SERVICE_URL;
  const result = await getExperts({});
  assert.equal(result.status, "error");
});

// --- getExpertById ---

test("getExpertById: 200 returns success", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const expert = { id: "e1", displayName: "Test", bio: null, country: "VN", language: null, visibility: "PUBLIC", organization: { id: "o1", name: "Org", country: "VN" }, expertises: [] };
  const result = await getExpertById("e1", async (url) => {
    assert.ok(url.endsWith("/api/v1/experts/e1"));
    return Response.json(expert);
  });
  assert.deepEqual(result, { status: "success", expert });
});

test("getExpertById: 404 returns not_found", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExpertById("missing", async () => new Response("", { status: 404 }));
  assert.deepEqual(result, { status: "error", kind: "not_found", message: "Expert not found" });
});

test("getExpertById: 500 returns integration error", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExpertById("e1", async () => new Response("", { status: 500 }));
  assert.equal(result.status, "error");
  assert.equal(result.kind, "integration");
});

// --- getExpertMatches ---

test("getExpertMatches: valid response returns success", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const expert = { id: "e2", displayName: "Partner", bio: null, country: "RU", language: null, visibility: "PUBLIC", organization: { id: "o2", name: "Org", country: "RU" }, expertises: [] };
  const items = [{ expert, reasons: [{ id: "x1", slug: "ai", labels: { en: "AI" } }] }];
  const result = await getExpertMatches("e1", async (url) => {
    assert.ok(url.endsWith("/api/v1/experts/e1/matches"));
    return Response.json({ items });
  });
  assert.deepEqual(result, { status: "success", items });
});

test("getExpertMatches: HTTP error maps to error", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExpertMatches("e1", async () => new Response("", { status: 503 }));
  assert.equal(result.status, "error");
});

test("getExpertMatches: malformed body maps to error", async () => {
  process.env.KNOWLEDGE_SERVICE_URL = "http://org-svc";
  const result = await getExpertMatches("e1", async () => Response.json({ noItems: true }));
  assert.equal(result.status, "error");
});
