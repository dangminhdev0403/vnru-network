import { Module } from '@nestjs/common';
import { DatabaseClient, DatabaseModule } from '../../database/database.module';
import { SESSION_PRISMA, SessionService } from './session.service';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [DatabaseModule, AccessControlModule],
  providers: [
    {
      provide: SESSION_PRISMA,
      useExisting: DatabaseClient,
    },
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule {}
