import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/publications';
import { PublicationController } from './publication.controller';
import { PUBLICATIONS_PRISMA, PublicationRepository } from './publication.repository';
import { PublicationService } from './publication.service';

@Module({
  controllers: [PublicationController],
  providers: [
    {
      provide: PUBLICATIONS_PRISMA,
      useFactory: () => new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.KNOWLEDGE_DATABASE_URL }) }),
    },
    PublicationRepository,
    PublicationService,
  ],
})
export class PublicationsModule {}
