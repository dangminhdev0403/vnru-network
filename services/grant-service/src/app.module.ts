import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { GrantController } from './grant.controller';
import { GrantRepository, PRISMA } from './grant.repository';
import { GrantService } from './grant.service';

@Module({
  controllers: [GrantController],
  providers: [
    {
      provide: PRISMA,
      useFactory: () => {
        return new PrismaClient({
          adapter: new PrismaPg({
            connectionString: process.env.DATABASE_URL,
          }),
        });
      },
    },
    GrantRepository,
    GrantService,
  ],
})
export class AppModule {}
