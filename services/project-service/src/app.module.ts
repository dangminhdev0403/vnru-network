import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';

export const PRISMA = Symbol('PRISMA');

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: PRISMA,
      useFactory: () => {
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool as any);
        return new PrismaClient({ adapter });
      },
    },
    ProjectRepository,
    ProjectService,
  ],
})
export class AppModule {}
