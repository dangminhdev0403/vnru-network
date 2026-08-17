import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { IdentityModule } from './modules/identity/identity.module';
import { SecurityModule } from './modules/security/security.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    IdentityModule,
    AuthenticationModule,
    SessionModule,
    AccessControlModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
