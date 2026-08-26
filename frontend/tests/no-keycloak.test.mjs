import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("runtime source and docs contain no Keycloak dependency", () => {
  const result = spawnSync("git", [
    "grep",
    "-n",
    "-i",
    "keycloak",
    "--",
    ":!graphify-out/**",
    ":!.hermes/**",
    ":!.agents/**",
    ":!shared/templates/**",
    ":!frontend/tests/no-keycloak.test.mjs",
  ], { cwd: new URL("../..", import.meta.url), encoding: "utf8" });
  assert.equal(result.status, 1, result.stdout || result.stderr);
  assert.equal(result.stdout, "");
});
