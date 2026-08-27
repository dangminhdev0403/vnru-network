import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AccessControlModule } from './modules/access-control/access-control.module';
import { IamAdminController } from './modules/access-control/iam-admin.controller';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [AuthenticationModule, AccessControlModule, NewsModule],
  controllers: [AppController, IamAdminController],
  providers: [AppService],
})
export class AppModule {}
