import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("./stitch/manifest.json", import.meta.url), "utf8"));
const required = {
  "workspace-shell": "Workspace Context Switcher",
  security: "Security &amp; Sessions",
  "iam-admin": "IAM Administration Console",
  "system-states": "Authentication &amp; System State Templates",
};

test("Module 1 Stitch sources are tracked without fabricated credential flows", async () => {
  for (const [name, title] of Object.entries(required)) {
    assert.ok(manifest.screens[name]);
    const html = await readFile(new URL(`./stitch/${name}.html`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`<title>${title}`));
    assert.doesNotMatch(html, /data-stitch-injected|type=["']password|access[_-]?token|refresh[_-]?token/i);
  }
});

test("one IAM console source avoids duplicate admin implementations", () => {
  assert.equal(manifest.screens["iam-admin"], "076db8257f8945d9baaead70eb1f5175");
  assert.equal(manifest.screens["iam-console"], undefined);
});
