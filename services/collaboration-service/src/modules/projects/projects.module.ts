import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/projects';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: 'PROJECT_PRISMA',
      useFactory: () => new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.PROJECT_DATABASE_URL }),
      }),
    },
    ProjectRepository,
    ProjectService,
  ],
})
export class ProjectsModule {}
