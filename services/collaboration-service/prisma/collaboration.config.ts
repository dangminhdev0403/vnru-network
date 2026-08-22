import { defineConfig, env } from 'prisma/config';
export default defineConfig({ schema: 'collaboration/schema.prisma', migrations: { path: 'collaboration/migrations' }, datasource: { url: env('COLLAB_DATABASE_URL') } });
