import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shared motion and readable copy respect reduced-motion preferences", async () => {
  const [layout, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /vnru-motion-root/);
  assert.match(css, /--motion-ease:\s*cubic-bezier\(0?\.16, 1, 0?\.3, 1\)/);
  assert.match(css, /translate3d\(6px, 18px, 0\)/);
  assert.match(css, /font-size:\s*clamp\(1rem/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation:\s*none/);
});
