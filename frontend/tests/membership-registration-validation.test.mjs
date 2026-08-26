import assert from "node:assert/strict";
import test from "node:test";
import { createRegistrationSchema } from "../app/register/validation.ts";

const schema = createRegistrationSchema({
  required: "required",
  invalidEmail: "invalid email",
  minPassword: "minimum password",
  mismatch: "password mismatch",
});

test("reader registration validates credentials and normalizes accepted input", () => {
  assert.equal(
    schema.safeParse({
      fullName: "",
      email: "invalid",
      password: "short",
      confirmPassword: "different",
    }).success,
    false,
  );

  const accepted = schema.safeParse({
    fullName: "  Nguyễn Văn An  ",
    email: "  READER@EXAMPLE.ORG  ",
    password: "TestPass123!",
    confirmPassword: "TestPass123!",
  });
  assert.equal(accepted.success, true);
  assert.equal(accepted.data.fullName, "Nguyễn Văn An");
  assert.equal(accepted.data.email, "reader@example.org");
});
