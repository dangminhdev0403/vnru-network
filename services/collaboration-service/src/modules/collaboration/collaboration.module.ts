import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/collaboration';
import { GrantController } from './grant.controller';
import { COLLAB_PRISMA, GrantRepository } from './grant.repository';
import { GrantService } from './grant.service';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [ReviewsModule],
  controllers: [GrantController],
  providers: [
    {
      provide: COLLAB_PRISMA,
      useFactory: () => new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.COLLAB_DATABASE_URL }),
      }),
    },
    GrantRepository,
    GrantService,
  ],
  exports: [GrantService],
})
export class CollaborationModule {}
