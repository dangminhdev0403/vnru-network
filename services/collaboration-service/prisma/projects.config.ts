import { defineConfig, env } from 'prisma/config';
export default defineConfig({ schema: 'projects/schema.prisma', migrations: { path: 'projects/migrations' }, datasource: { url: env('PROJECT_DATABASE_URL') } });
