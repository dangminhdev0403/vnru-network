import { Module, forwardRef } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/reviews';
import { ReviewController } from './review.controller';
import { REVIEW_PRISMA, ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';
import { CollaborationModule } from '../collaboration/collaboration.module';

@Module({
  imports: [forwardRef(() => CollaborationModule)],
  controllers: [ReviewController],
  providers: [
    {
      provide: REVIEW_PRISMA,
      useFactory: () => new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.REVIEW_DATABASE_URL }),
      }),
    },
    ReviewRepository,
    ReviewService,
  ],
  exports: [ReviewService],
})
export class ReviewsModule {}
