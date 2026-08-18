import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { validateConfig } from '../../config';
import {
  ACCESS_CONTROL_PRISMA,
  AccessControlService,
} from './access-control.service';

@Module({
  providers: [
    {
      provide: ACCESS_CONTROL_PRISMA,
      useFactory: () => {
        const config = validateConfig();
        const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
        return new PrismaClient({ adapter });
      },
    },
    AccessControlService,
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
