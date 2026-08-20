import assert from "node:assert/strict";
import test from "node:test";
import { access } from "node:fs/promises";

const app = new URL("../app/", import.meta.url);

async function exists(path) {
  return access(new URL(path, app)).then(() => true, () => false);
}

test("only Home and Login page surfaces remain", async () => {
  assert.equal(await exists("page.tsx"), true);
  assert.equal(await exists("login/page.tsx"), true);

  for (const path of ["workspace", "admin", "security", "knowledge", "experts", "publications"]) {
    assert.equal(await exists(path), false, `${path} UI must stay removed`);
  }
});
