import { z } from "zod";

export type RegistrationField =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword";

export type RegistrationValidationCopy = Readonly<{
  required: string;
  invalidEmail: string;
  minPassword: string;
  mismatch: string;
}>;

export function createRegistrationSchema(
  messages: RegistrationValidationCopy,
) {
  return z.object({
    fullName: z.string().trim().min(2, messages.required).max(150),
    email: z
      .string()
      .trim()
      .min(1, messages.required)
      .pipe(z.email({ error: messages.invalidEmail }))
      .transform((value) => value.toLowerCase()),
    password: z.string().min(8, messages.minPassword).max(128),
    confirmPassword: z.string().min(1, messages.required),

  }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: messages.mismatch });
}

export function isRegistrationField(value: PropertyKey): value is RegistrationField {
  return [
    "fullName",
    "email",
    "password",
    "confirmPassword",

  ].includes(String(value));
}
