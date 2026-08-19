import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { PublicationController } from './publication.controller';
import { PRISMA, PublicationRepository } from './publication.repository';
import { PublicationService } from './publication.service';
@Module({ controllers: [PublicationController], providers: [
  { provide: PRISMA, useFactory: () => new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) }) },
  PublicationRepository, PublicationService,
] })
export class AppModule {}
