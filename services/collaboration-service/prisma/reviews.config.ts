import { defineConfig, env } from 'prisma/config';
export default defineConfig({ schema: 'reviews/schema.prisma', migrations: { path: 'reviews/migrations' }, datasource: { url: env('REVIEW_DATABASE_URL') } });
