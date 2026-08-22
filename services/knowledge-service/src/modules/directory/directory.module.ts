import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/directory';
import { ExpertController } from './expert.controller';
import { DIRECTORY_PRISMA, ExpertRepository } from './expert.repository';
import { ExpertService } from './expert.service';

@Module({
  controllers: [ExpertController],
  providers: [
    {
      provide: DIRECTORY_PRISMA,
      useFactory: () => new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.ORGANIZATION_DATABASE_URL }) }),
    },
    ExpertRepository,
    ExpertService,
  ],
})
export class DirectoryModule {}
