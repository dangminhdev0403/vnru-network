import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const route = await readFile(
  new URL("./app/login/page.tsx", import.meta.url),
  "utf8",
);
const source = await readFile(
  new URL("./stitch/login.html", import.meta.url),
  "utf8",
);
const imported = await readFile(
  new URL("./public/stitch/login.html", import.meta.url),
  "utf8",
);
const popupComplete = await readFile(
  new URL("./public/auth-popup-complete.html", import.meta.url),
  "utf8",
);

test("login route renders the exported Stitch screen", () => {
  assert.match(route, /\/stitch\/login\.html/);
  assert.equal(imported.match(/href="\/api\/auth\/login"/g)?.length, 1);
  assert.match(imported, />\s*Sign in\s*</);
  assert.match(imported, /Authentication is handled by Keycloak/);
  assert.match(imported, /configuration-unavailable/);
  assert.doesNotMatch(imported, /type="(?:email|password)"/);
  assert.doesNotMatch(
    imported,
    /(?:Login|Continue) with Institutional SSO|Forgot password/i,
  );
  assert.match(
    source,
    /<title>Login \| Russia–Vietnam Knowledge Network<\/title>/,
  );
  assert.equal(imported, source);
  assert.doesNotMatch(imported, /data-stitch-injected/);
  assert.match(
    imported,
    /window\.open\(authUrl, 'vnru-auth', 'popup,width=520,height=700'\)/,
  );
  assert.match(imported, /Signing in…/);
  assert.match(imported, /if \(popup\.closed\) resetLogin\(\)/);
  assert.match(imported, /message\.source !== popup/);
  assert.match(
    popupComplete,
    /postMessage\('vnru:authenticated', location\.origin\)/,
  );
});
