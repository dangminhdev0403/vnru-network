import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("./themes/vnru/login/", import.meta.url);
const properties = await readFile(new URL("theme.properties", root), "utf8");
const css = await readFile(new URL("resources/css/login.css", root), "utf8");

assert.match(properties, /^parent=keycloak\.v2$/m);
assert.match(properties, /^styles=css\/login\.css$/m);
assert.match(css, /VN-RU Knowledge Network/);
console.log("Keycloak theme smoke: pass");
