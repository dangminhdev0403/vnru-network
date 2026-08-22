import { Module } from '@nestjs/common';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({ imports: [CollaborationModule, ReviewsModule, ProjectsModule] })
export class AppModule {}
