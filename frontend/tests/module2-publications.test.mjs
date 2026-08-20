import assert from "node:assert/strict";
import test from "node:test";
import { getLabels, labels } from "../features/publications/types.ts";

// --- types & labels ---

test("labels object has all three locales", () => {
  assert.deepEqual(Object.keys(labels).sort(), ["en", "ru", "vi"]);
});

test("every locale has identical label keys", () => {
  const enKeys = Object.keys(labels.en).sort();
  assert.deepEqual(Object.keys(labels.vi).sort(), enKeys);
  assert.deepEqual(Object.keys(labels.ru).sort(), enKeys);
});

test("getLabels returns requested locale", () => {
  assert.equal(getLabels("vi").pageTitle, labels.vi.pageTitle);
  assert.equal(getLabels("ru").pageTitle, labels.ru.pageTitle);
});

test("getLabels falls back to en for unknown locale", () => {
  assert.equal(getLabels("jp").pageTitle, labels.en.pageTitle);
  assert.equal(getLabels(undefined).pageTitle, labels.en.pageTitle);
});

// --- repository (getPublicationById) ---

test("getPublicationById returns error when KNOWLEDGE_SERVICE_URL unset", async () => {
  const saved = process.env.KNOWLEDGE_SERVICE_URL;
  delete process.env.KNOWLEDGE_SERVICE_URL;
  try {
    const { getPublicationById } = await import("../features/publications/repository.ts");
    const result = await getPublicationById("some-id");
    assert.equal(result.status, "error");
  } finally {
    if (saved !== undefined) process.env.KNOWLEDGE_SERVICE_URL = saved;
  }
});
