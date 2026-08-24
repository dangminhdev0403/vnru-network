import assert from "node:assert/strict";
import translations from "./features/public-home/i18n/translations.json" with { type: "json" };

const keys = Object.keys(translations.vi);
assert.deepEqual(Object.keys(translations.en), keys);
assert.deepEqual(Object.keys(translations.ru), keys);
assert.equal(translations.en["Mạng lưới tri thức"], "Knowledge network");
assert.equal(translations.ru["Mạng lưới tri thức"], "Сеть знаний");
assert.equal(translations.en["Đăng nhập →"], "Sign in →");
assert.equal(translations.ru["Đăng nhập →"], "Войти →");
assert.equal(translations.en["Vào không gian làm việc"], "Open workspace");
assert.equal(translations.ru["Vào không gian làm việc"], "Открыть рабочее пространство");
console.log(`home i18n: ${keys.length} keys × 3 locales`);
