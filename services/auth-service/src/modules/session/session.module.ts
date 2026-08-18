import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { validateConfig } from '../../config';
import { SESSION_PRISMA, SessionService } from './session.service';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [AccessControlModule],
  providers: [
    {
      provide: SESSION_PRISMA,
      useFactory: () => {
        const config = validateConfig();
        const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
        return new PrismaClient({ adapter });
      },
    },
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule {}
