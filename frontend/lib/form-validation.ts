import { type ZodError } from "zod";

export function getFieldErrors(error: ZodError): Record<string, string> {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]));
}
