import assert from "node:assert/strict";
import { formatDate, formatDateTime } from "./date-format.ts";

for (const locale of ["vi", "en", "ru"]) {
  assert.doesNotMatch(formatDate("2026-09-01T23:15:17.596Z", locale), /T|Z/);
  assert.doesNotMatch(formatDateTime("2026-09-01T23:15:17.596Z", locale), /T|Z/);
}
assert.equal(formatDate("12/05/2026", "vi"), "12/05/2026");
assert.equal(formatDate("not-a-date", "vi"), "—");
assert.equal(formatDate(null, "vi"), "—");

console.log("date-format: ok");