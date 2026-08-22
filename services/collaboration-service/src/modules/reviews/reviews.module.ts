import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/reviews';
import { ReviewController } from './review.controller';
import { REVIEW_PRISMA, ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
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
})
export class ReviewsModule {}
