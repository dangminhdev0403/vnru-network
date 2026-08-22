import { defineConfig, env } from 'prisma/config';
export default defineConfig({ schema: 'publications/schema.prisma', migrations: { path: 'publications/migrations' }, datasource: { url: env('KNOWLEDGE_DATABASE_URL') } });
