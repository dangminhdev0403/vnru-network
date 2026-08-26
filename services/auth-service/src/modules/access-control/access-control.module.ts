import { Module } from '@nestjs/common';
import { DatabaseClient, DatabaseModule } from '../../database/database.module';
import {
  ACCESS_CONTROL_PRISMA,
  AccessControlService,
} from './access-control.service';
import { IamAdminService } from './iam-admin.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ACCESS_CONTROL_PRISMA,
      useExisting: DatabaseClient,
    },
    AccessControlService,
    IamAdminService,
  ],
  exports: [AccessControlService, IamAdminService],
})
export class AccessControlModule {}
