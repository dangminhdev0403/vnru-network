import { z } from 'zod';

const configSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.protocol === 'postgresql:' || url.protocol === 'postgres:';
        } catch {
          return false;
        }
      },
      {
        message:
          'DATABASE_URL must be a valid postgresql:// or postgres:// URL',
      },
    ),
  KEYCLOAK_ISSUER_URL: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.protocol === 'https:' || url.protocol === 'http:';
        } catch {
          return false;
        }
      },
      {
        message: 'KEYCLOAK_ISSUER_URL must be a valid http:// or https:// URL',
      },
    ),
  KEYCLOAK_CLIENT_ID: z.string().min(1, {
    message: 'KEYCLOAK_CLIENT_ID must be a non-empty string',
  }),
  KEYCLOAK_REDIRECT_URI: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.protocol === 'https:' || url.protocol === 'http:';
        } catch {
          return false;
        }
      },
      {
        message:
          'KEYCLOAK_REDIRECT_URI must be a valid http:// or https:// URL',
      },
    ),
});

export function validateConfig(env: Record<string, unknown> = process.env) {
  return configSchema.parse(env);
}
