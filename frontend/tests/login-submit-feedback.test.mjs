import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("login form disables submit button and shows loading state with spinner and multilingual text", async () => {
  const [loginPage, loginForm, passwordField] = await Promise.all([
    read("app/login/page.tsx"),
    read("app/login/LoginForm.tsx"),
    read("app/login/PasswordField.tsx"),
  ]);

  // Multilingual copy
  assert.match(loginPage, /submitting: "Đang đăng nhập, xin chờ\.\.\."/);
  assert.match(loginPage, /submitting: "Вход в систему, пожалуйста, подождите\.\.\."/);
  assert.match(loginPage, /submitting: "Signing in, please wait\.\.\."/);

  // LoginForm interaction
  assert.match(loginForm, /disabled=\{isSubmitting\}/);
  assert.match(loginForm, /animate-spin/);
  assert.match(loginForm, /\{t\.submitting\}/);
  assert.match(loginForm, /action="\/api\/auth\/login"/);

  // PasswordField disabled support
  assert.match(passwordField, /disabled=\{disabled\}/);
});

test("register form disables submit button and shows loading state with spinner and multilingual text", async () => {
  const registerPage = await read("app/register/page.tsx");

  // Multilingual copy
  assert.match(registerPage, /submitting: "Đang tạo tài khoản, xin chờ\.\.\."/);
  assert.match(registerPage, /submitting: "Создание аккаунта, пожалуйста, подождите\.\.\."/);
  assert.match(registerPage, /submitting: "Creating account, please wait\.\.\."/);

  // RegisterPage interaction
  assert.match(registerPage, /disabled=\{status === "submitting"\}/);
  assert.match(registerPage, /animate-spin/);
  assert.match(registerPage, /\{t\.submitting\}/);
});
