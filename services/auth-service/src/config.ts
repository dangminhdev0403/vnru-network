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
});

export function validateConfig(env: Record<string, unknown> = process.env) {
  return configSchema.parse(env);
}
