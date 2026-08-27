import { z } from 'zod';

const configSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === 'postgresql:' || protocol === 'postgres:';
      } catch {
        return false;
      }
    }, 'DATABASE_URL must be a valid PostgreSQL URL'),
  AUTH_BRIDGE_SECRET: z
    .string()
    .min(32, 'AUTH_BRIDGE_SECRET must contain at least 32 characters'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
});

export function validateConfig(env: Record<string, unknown> = process.env) {
  return configSchema.parse(env);
}
