import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { validateConfig } from '../../config';
import { IDENTITY_PRISMA, IdentityService } from './identity.service';

@Module({
  providers: [
    {
      provide: IDENTITY_PRISMA,
      useFactory: () => {
        const config = validateConfig();
        const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
        return new PrismaClient({ adapter });
      },
    },
    IdentityService,
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
