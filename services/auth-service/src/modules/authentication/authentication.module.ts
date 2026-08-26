import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { SessionModule } from '../session/session.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticatedRequestGuard } from './authenticated-request-context';

@Module({
  imports: [IdentityModule, SessionModule, AccessControlModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticatedRequestGuard],
  exports: [AuthenticationService, AuthenticatedRequestGuard],
})
export class AuthenticationModule {}
