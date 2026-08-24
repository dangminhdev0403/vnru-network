import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { SessionModule } from '../session/session.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticatedRequestGuard } from './authenticated-request-context';
import { IamAdminController } from '../access-control/iam-admin.controller';

@Module({
  imports: [IdentityModule, SessionModule, AccessControlModule],
  controllers: [AuthenticationController, IamAdminController],
  providers: [AuthenticationService, AuthenticatedRequestGuard],
  exports: [AuthenticationService, AuthenticatedRequestGuard],
})
export class AuthenticationModule {}
