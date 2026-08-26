import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("shared dashboard surfaces keep narrow viewports inside the screen", () => {
  for (const shell of [
    "../components/shared/WorkspaceShell.tsx",
    "../features/admin/components/AdminShell.tsx",
  ]) {
    const source = read(shell);
    assert.match(source, /calc\(100vw-1rem\)/);
    assert.doesNotMatch(source, /className="w-80 max-w-80/);
  }

  const css = read("../app/globals.css");
  assert.match(css, /\.vnru-swal-popup[\s\S]*min-width: 0 !important/);
  assert.match(css, /background-attachment: scroll/);
  assert.match(css, /overflow-x: clip/);
});
