import { Module } from '@nestjs/common';

import { DatabaseClient, DatabaseModule } from '../../database/database.module';
import { IDENTITY_PRISMA, IdentityService } from './identity.service';
import { MembershipApplicationController } from './membership-application.controller';
import { MembershipApplicationService } from './membership-application.service';
import { LocalCredentialController } from './local-credential.controller';
import { LocalCredentialService } from './local-credential.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IDENTITY_PRISMA,
      useExisting: DatabaseClient,
    },
    IdentityService,
    MembershipApplicationService,
    LocalCredentialService,
  ],
  controllers: [MembershipApplicationController, LocalCredentialController],
  exports: [IdentityService],
})
export class IdentityModule {}
