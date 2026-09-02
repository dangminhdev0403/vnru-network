import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("text controls suppress native outlines and keep component focus styling", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(
    css,
    /input:not\(\[type="checkbox"\]\):not\(\[type="radio"\]\)[\s\S]*select,[\s\S]*textarea[\s\S]*:focus-visible\s*\{\s*outline: none;/,
  );
  assert.match(
    css,
    /:where\(a, button, input\[type="checkbox"\], input\[type="radio"\]\):focus-visible/,
  );
});
