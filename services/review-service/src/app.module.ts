import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ReviewController } from './review.controller';
import { PRISMA, ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [
    {
      provide: PRISMA,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          return new PrismaClient();
        }
        return new PrismaClient({
          adapter: new PrismaPg({ connectionString }),
        });
      },
    },
    ReviewRepository,
    ReviewService,
  ],
})
export class AppModule {}
