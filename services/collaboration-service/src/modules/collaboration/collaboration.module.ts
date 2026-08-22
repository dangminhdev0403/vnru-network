import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/collaboration';
import { GrantController } from './grant.controller';
import { COLLAB_PRISMA, GrantRepository } from './grant.repository';
import { GrantService } from './grant.service';

@Module({
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
})
export class CollaborationModule {}
