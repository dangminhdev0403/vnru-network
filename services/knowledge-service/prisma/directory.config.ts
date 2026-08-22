import { defineConfig, env } from 'prisma/config';
export default defineConfig({ schema: 'directory/schema.prisma', migrations: { path: 'directory/migrations' }, datasource: { url: env('ORGANIZATION_DATABASE_URL') } });
